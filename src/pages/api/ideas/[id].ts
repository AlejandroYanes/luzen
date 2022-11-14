import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'server/db/client';

export default async function fetchIdea(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const idea = await prisma.idea.findUnique({
    where: {
      id: id as string,
    },
    select: {
      title: true,
      summary: true,
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
  res.json({ idea });
}
