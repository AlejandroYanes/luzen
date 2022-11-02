/* eslint-disable max-len */
import type { Idea, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const fakeSummary = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lacus luctus accumsan tortor posuere ac ut consequat semper. Quis imperdiet massa tincidunt nunc pulvinar sapien et. Erat nam at lectus urna. Blandit cursus risus at ultrices mi tempus. Mauris pharetra et ultrices neque. Nibh nisl condimentum id venenatis a condimentum. Phasellus egestas tellus rutrum tellus. Nunc vel risus commodo viverra maecenas accumsan lacus. Sem fringilla ut morbi tincidunt. Quam vulputate dignissim suspendisse in est ante in nibh mauris. Consequat nisl vel pretium lectus quam id leo in. Consequat nisl vel pretium lectus quam id leo in.';

export default async function seedIdeas(prisma: PrismaClient) {
  const ideas: Omit<Idea, 'id'>[] = new Array(10).fill(0).map(() => ({
    title: faker.music.songName(),
    summary: fakeSummary.trim(),
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
