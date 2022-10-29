import { Idea, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export default async function seedIdeas(prisma: PrismaClient) {
	const ideas: Omit<Idea, 'id'>[] = new Array(10).fill(0).map(() => ({
		title: faker.music.songName(),
		description: faker.lorem.lines(10),
		postedAt: faker.date.past(0, new Date()),
		votes: faker.datatype.number({ min: 0, max: 1000 }),
	}));

	for (const idea of ideas) {
		await prisma.idea.create({
			data: idea,
		});
	}
}
