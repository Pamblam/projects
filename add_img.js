import fs from 'node:fs';
import puppeteer from 'puppeteer';

const data = fs.readFileSync('projects.txt', 'utf8');

const projects = data.trim().split(/\n\n/).map(p=>{
	let props = {};
	p.split(/\n/).forEach(l=>{
		l = l.trim().split(':');
		let prop = l.shift().trim();
		let val = l.join(':');
		props[prop] = val.trim();
	});
	return props;
});

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({
    width: 1300,
    height: 900
});

for(let i=0; i<projects.length; i++){
	if(projects[i].img || !projects[i].url) continue;
	let filename = projects[i].name.toLowerCase().replaceAll(/[^a-z0-9_ ]/g, '').replaceAll(' ', '-')+'.png';
	
	await page.goto(projects[i].url, {
		waitUntil: 'networkidle2',
	});

	await page.screenshot({
		path: `imgs/${filename}`,
	});

	projects[i].img = filename;
	console.log(`Completed: ${filename}`);
}

fs.writeFileSync("proects-parsed.json", JSON.stringify(projects, null, 2)); 
await browser.close();