import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'server/db/client';
import type { inferPrismaModelFromQuery } from 'utils/prisma';

export default async function fetchIdea(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const idea = await query(id as string);
  res.json({ idea });
}

export type QueryIdea = inferPrismaModelFromQuery<typeof query>;

async function query(id: string) {
  return prisma.idea.findUnique({
    where: {
      id: id as string,
    },
    select: {
      title: true,
      tagLine: true,
      summary: true,
      votes: true,
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  })
}
