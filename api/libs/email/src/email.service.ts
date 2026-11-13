import { Injectable } from '@nestjs/common';
import { CreateEmail } from './email.typings';
import { Env } from '@app/shared';
import { parseEmailTemplate } from './email.parser';
import { readFile } from 'fs/promises';
import { extname } from 'path';

const SUPER_SEND_TX_API_URL = 'https://api.supersendtx.com/emails';

const CONTENT_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
  txt: 'text/plain',
  zip: 'application/zip',
};

function contentTypeOf(filename: string): string {
  const extension = extname(filename).slice(1).toLowerCase();
  return CONTENT_TYPES[extension] ?? 'application/octet-stream';
}

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
        contentType: contentTypeOf(attachment.filename),
        content: (await readFile(attachment.path)).toString('base64'),
      })),
    );
    const response = await fetch(SUPER_SEND_TX_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        // SuperSend TX wants the address and display name as separate fields.
        from: {
          email: fromAddress.email,
          ...(fromAddress.name ? { name: fromAddress.name } : {}),
        },
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
      // The response body explains the rejection (key, domain, quota).
      const detail = (await response.text().catch(() => '')).slice(0, 500);
      throw new Error(
        `SuperSend TX request failed (${response.status} ${response.statusText})${detail ? `: ${detail}` : ''}`,
      );
    }
  }
}
