import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from "server/db/client";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
	const ideas = await prisma.idea.findMany();
	res.status(200).json(ideas);
}
