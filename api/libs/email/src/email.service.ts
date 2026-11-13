import { Injectable } from '@nestjs/common';
import { CreateEmail } from './email.typings';
import { Env } from '@app/shared';
import { parseEmailTemplate } from './email.parser';
import { readFile } from 'fs/promises';

const SUPER_SEND_TX_API_URL = 'https://api.groundmail.dev/emails';

function parseFromAddress(raw: string): { email: string; name?: string } {
  const match = raw.match(/^(.*?)\s*<(.+)>\s*$/);

  if (match) {
    return {
      name: match[1].replace(/"/g, '').trim() || undefined,
      email: match[2].trim(),
    };
  }

  return { email: raw.trim() };
}

function htmlToText(html: string): string {
  return html
    .replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6])>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

@Injectable()
export class EmailService {
  async sendEmail(data: CreateEmail) {
    const apiKey = Env.email.apiKey;
    if (!apiKey) {
      throw new Error('SUPERSENDTX_API_KEY is not configured');
    }

    const from = data.from ?? Env.email.from;
    if (!from) {
      throw new Error('EMAIL_FROM is not configured');
    }

    const fromAddress = parseFromAddress(from);
    if (!fromAddress.email) {
      throw new Error('EMAIL_FROM must contain a valid sender address');
    }

    const html =
      data.content ??
      (await parseEmailTemplate(data.template, data.data ?? {}));
    const attachments = await Promise.all(
      (data.attachments ?? []).map(async (attachment) => ({
        filename: attachment.filename,
        contentType: 'application/octet-stream',
        content: (await readFile(attachment.path)).toString('base64'),
      })),
    );
    const sender = fromAddress.name
      ? `"${fromAddress.name.replace(/"/g, '\\"')}" <${fromAddress.email}>`
      : fromAddress.email;

    const response = await fetch(SUPER_SEND_TX_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        from: sender,
        to: data.to,
        subject: data.subject ?? '',
        html,
        text: htmlToText(html),
        reply_to: fromAddress.email,
        ...(data.cc ? { cc: data.cc } : {}),
        ...(attachments.length ? { attachments } : {}),
      }),
    });

    if (!response.ok) {
      throw new Error(
        `SuperSend TX request failed (${response.status} ${response.statusText})`,
      );
    }
  }
}
