import { protectedProcedure } from 'server/trpc/trpc';
import { notifyOfNewIdea } from 'server/slack';

const sendSlack = protectedProcedure
  .mutation(() => {
    return notifyOfNewIdea({
      author: 'Alejandro Yanes',
      id: '12345',
    });
  });

export default sendSlack;

