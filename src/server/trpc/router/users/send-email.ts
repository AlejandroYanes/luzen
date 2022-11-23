import { protectedProcedure } from '../../trpc';
import { sendEmail as sendSGEmail } from 'server/send-grid';

const sendEmail = protectedProcedure
  .mutation(() => {
    return sendSGEmail();
  });

export default sendEmail;

