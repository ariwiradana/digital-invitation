import handleError from "@/lib/errorHandling";
import { ClientV2, Participant } from "@/lib/types";
import { sql } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

interface Query {
  slug?: string;
  page?: number;
  limit?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      try {
        const { slug, page = 1, limit = 5 }: Query = req.query;

        let query = `
          SELECT c.*, t.name as theme_name
          FROM clients c
          LEFT JOIN themes t ON c.theme_id = t.id
        `;
        let countQuery = `SELECT COUNT(*) FROM clients`;

        const values: (number | string)[] = [];
        const countValues: (number | string)[] = [];

        if (slug) {
          const valueIndex = values.length + 1;
          query += ` WHERE slug = $${valueIndex}`;
          countQuery += ` WHERE slug = $${valueIndex}`;
          values.push(slug);
          countValues.push(slug);
        }

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const offset = (pageNumber - 1) * limitNumber;
        const valueIndex = values.length + 1;
        query += ` LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`;
        values.push(limitNumber, offset);

        const { rows } = await sql.query(query, values);
        const { rows: total } = await sql.query(countQuery, countValues);

        const clientIds = rows.map((client) => client.id);

        const { rows: participants } = await sql.query(
          `
            SELECT p.*
            FROM participants p
            JOIN clients c ON p.client_id = c.id
            WHERE c.id = ANY($1::int[])
        `,
          [clientIds]
        );

        const clients = rows.map((client) => {
          const clientParticipants = participants.filter(
            (p) => p.client_id === client.id
          );
          return {
            ...client,
            participants: clientParticipants,
          };
        });

        return res.status(200).json({
          success: true,
          data: clients,
          total_rows: Number(total[0].count),
          page: pageNumber,
          limit: limitNumber,
        });
      } catch (error) {
        handleError(res, error);
      }

    case "POST":
      try {
        const client: ClientV2 & { theme_id: number } = req.body;

        if (client.theme_id) {
          const checkTheme =
            await sql`SELECT EXISTS (SELECT 1 FROM themes WHERE id = ${client.theme_id});`;
          if (!checkTheme.rows[0].exists) {
            return handleError(
              res,
              new Error("Theme not found with the provided ID.")
            );
          }
        }

        const slug = client.name.toLocaleLowerCase().replace(" ", "-");

        if (slug) {
          const checkSlug =
            await sql`SELECT EXISTS (SELECT 1 FROM clients WHERE slug = ${slug});`;
          if (checkSlug.rows[0].exists) {
            return handleError(
              res,
              new Error("Client exists with the provided slug.")
            );
          }
        }

        const queryClient = sql`
          INSERT INTO clients (slug, name, address, address_url, address_full, date, time, theme_id)
          VALUES (${slug}, ${client.name}, ${client.address}, ${client.address_url},
                  ${client.address_full}, ${client.date}, ${client.time}, ${client.theme_id})
          RETURNING *;
        `;
        const resultClient = await queryClient;
        const clientId = resultClient.rows[0].id;

        const participants: Participant[] = client.participants;
        const participantPromises = participants.map(
          (participant: Participant) => {
            return sql`
            INSERT INTO participants (client_id, name, nickname, address, child, parents_male, parents_female, gender)
            VALUES (${clientId}, ${participant.name}, ${participant.nickname}, ${participant.address}, ${participant.child},
              ${participant.parents_male}, ${participant.parents_female}, ${participant.gender});
          `;
          }
        );
        await Promise.all(participantPromises);

        const newClient = resultClient.rows[0];
        newClient["participants"] = participants.map((participant) => ({
          ...participant,
          id: clientId,
        }));

        return res.status(200).json({ success: true, data: newClient });
      } catch (error) {
        handleError(res, error);
      }
    case "PUT":
    case "DELETE":

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
