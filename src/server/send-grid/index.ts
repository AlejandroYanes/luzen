import sendGrid from '@sendgrid/mail';

import { env } from 'env/server.mjs';
import type { EmailTemplates } from 'constants/send-grid';

interface Params {
  to: string;
  templateId: EmailTemplates;
  dynamicTemplateData: Record<string, string>;
}

export function sendEmail(params: Params) {
  sendGrid.setApiKey(env.SENDGRID_API_KEY);
  return sendGrid
    .send({
      from: env.SENDGRID_SENDER,
      ...params,
    })
}
