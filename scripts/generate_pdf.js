import fs from 'node:fs';
import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({
    width: 794,
    height: 1123
});

await page.goto('http://localhost/projects/resume2.html', {
	waitUntil: 'networkidle2',
});

await make1PagePdf(page, 'resume2.pdf');

// await page.goto('http://localhost/projects/cover.html', {
// 	waitUntil: 'networkidle2',
// });

// await make1PagePdf(page, 'cover.pdf');

await browser.close();

async function make1PagePdf(page, filename, scale=1){
	await page.pdf({
		path: filename,
		format: 'A4',
		scale,
		printBackground: true
	});
	let pdfBytes = await fs.readFileSync(filename);
	const pdfDoc = await PDFDocument.load(pdfBytes);
	if(pdfDoc.getPageCount() > 1){
		await make1PagePdf(page, filename, scale-.05);
	}
}