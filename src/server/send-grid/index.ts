import sendGrid from '@sendgrid/mail';

import { env } from 'env/server.mjs';
import { EMAIL_TEMPLATES } from 'constants/send-grid';

export function sendEmail() {
  sendGrid.setApiKey(env.SENDGRID_API_KEY);
  return sendGrid
    .send({
      to: 'alejandro.yanes94@gmail.com', // Change to your recipient
      from: env.SENDGRID_SENDER, // Change to your verified sender
      subject: 'Sending with SendGrid is Fun',
      templateId: EMAIL_TEMPLATES.IDEA_PUBLISHED,
      dynamicTemplateData: {
        link: 'http://localhost:3000'
      },
    })
}
