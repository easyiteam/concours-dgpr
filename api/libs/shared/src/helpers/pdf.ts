import { PDFOptions, PaperFormat } from 'puppeteer';
import puppeteer, { executablePath } from 'puppeteer-core';

export type PrintPaperFormat = PaperFormat;
export type PrintPdfOptions = PDFOptions;

export interface PrintOptions {
  html: string;
  options?: PrintPdfOptions;
}

export async function generatePdf(args: PrintOptions) {
  let path = '/usr/bin/google-chrome-stable';

  try {
    path = executablePath();
  } catch (error) {
    path = 'google-chrome-stable';
  }

  const browser = await puppeteer.launch({
    executablePath: path,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  page.setContent(args.html, { waitUntil: 'domcontentloaded' });

  await page.emulateMediaType('screen');

  const pdf = await page.pdf(args.options);

  await browser.close();

  return pdf.buffer;
}
