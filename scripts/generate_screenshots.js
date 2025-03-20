import fs from 'node:fs';
import puppeteer from 'puppeteer';

const data = fs.readFileSync('projects.json', 'utf8');
const projects = JSON.parse(data);

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({
    width: 767,
    height: 499
});

for(let i=0; i<projects.length; i++){
	let filename = projects[i].img ? projects[i].img : projects[i].name.toLowerCase().replaceAll(/[^a-z0-9_ ]/g, '').replaceAll(' ', '-')+'.png';
	
	if (fs.existsSync(`imgs/${filename}`)) continue;

	await page.goto(projects[i].url, {
		waitUntil: 'networkidle2',
	});

	await page.screenshot({
		path: `imgs/${filename}`,
	});

	projects[i].img = filename;
	console.log(`Completed: ${filename}`);
}

fs.writeFileSync("projects-new.json", JSON.stringify(projects, null, 2)); 
await browser.close();