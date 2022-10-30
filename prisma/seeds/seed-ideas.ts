import type { Idea, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export default async function seedIdeas(prisma: PrismaClient) {
	const ideas: Omit<Idea, 'id'>[] = new Array(10).fill(0).map(() => ({
		title: faker.music.songName(),
		summary: faker.lorem.lines(5),
		description: faker.lorem.paragraphs(5),
		postedAt: faker.date.past(0, new Date()),
		votes: faker.datatype.number({ min: 0, max: 1000 }),
	} as Omit<Idea, 'id'>));

	for (const idea of ideas) {
		await prisma.idea.create({
			data: idea,
		});
	}
}
