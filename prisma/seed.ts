import { PrismaClient } from '@prisma/client';
import seedIdeas from './seeds/seed-ideas';

const prisma = new PrismaClient();

async function main() {
	await seedIdeas(prisma);
}


main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
