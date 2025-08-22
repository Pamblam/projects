import puppeteer from 'puppeteer';
import linkedin_login from './functions/linkedin_login.js';
import linkedin_get_projects from './functions/linkedin_get_projects.js';
import fs from 'node:fs';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const dbg = true; const dbg_pause = 3000;
const browser = await puppeteer.launch({headless: false});
const page = await browser.newPage();

await linkedin_login(page);
await enterToContinue();
let linkedinProjects = await linkedin_get_projects(page);

const projectExists = pname => linkedinProjects.some(ele => ele.title === pname);
const projects = JSON.parse(fs.readFileSync('projects.json', 'utf8'));

for(let i=0; i<projects.length; i++){
	let project = projects[i];

	if(projectExists(project.name)) continue;
	console.log(project.name, i, 'of', projects.length);
	await addProject(project);
}

browser.close();
process.exit();

async function addProject(proj){
	await page.$eval('#navigation-add-edit-deeplink-add-project', el => el.click());

	await page.waitForSelector(`input[id^='single-line-text-form-component-profileEditFormElement-PROJECT-profileProject']`);
	await page.type(`input[id^='single-line-text-form-component-profileEditFormElement-PROJECT-profileProject']`, proj.name, {delay: 60});
	await page.type(`textarea[id^='multiline-text-form-component-profileEditFormElement-PROJECT-profileProject']`, proj.description, {delay: 60});

	let tech = proj.technologies.split(', ');
	for(let i=0; i<tech.length; i++){
		await addSkill(tech[i]);
	}

	await new Promise(d=>setTimeout(d, 1000));
	await addLink(proj.url, proj.img);

	// submit the form
	await new Promise(d=>setTimeout(d, 200));
	await page.evaluate(() => { 
		document.querySelector('button[data-view-name="profile-form-save"]').click();
	});

	// Dismiss the share modal
	await new Promise(d=>setTimeout(d, 6000));
	await page.waitForSelector('[aria-label="Dismiss"]');
	await page.evaluate(() => { 
		document.querySelector('[aria-label="Dismiss"]').click();
	});
	await new Promise(d=>setTimeout(d, 500));
}

async function addLink(link, img){
	// click the button
	await page.waitForSelector('#media-dropdown-trigger');
	await page.$eval('#media-dropdown-trigger', el => el.click());
	await new Promise(d=>setTimeout(d, 200));

	// Click the appropriate button in the dropdown
	await page.evaluate(() => {
		// get reference to the button's dropdown
		let dd = [...document.querySelectorAll('.artdeco-dropdown__content-inner')].filter(e=>{
			let btns = e.querySelectorAll('.artdeco-dropdown__item.artdeco-dropdown__item--is-dropdown.ember-view.display-flex.align-items-center');
			return btns.length == 2;
		})[0];

		// click the option to add an link
		let btn = dd.querySelectorAll('li')[0].firstElementChild;
		btn.click();
	});

	// type the link url
	await page.type(`#link-page-input`, link, {delay: 60});

	// Click the 'Add' button
	await new Promise(d=>setTimeout(d, 500));
	await page.waitForSelector('#link-page-input');
	await page.evaluate(() => { document.getElementById('link-page-input').nextElementSibling.click(); });

	// upload the thumbnail image
	await new Promise(d=>setTimeout(d, 1000));
	let file_input_selector = '.pe-treasury-edit__media-pencil>input[id^="upload-file-input-ember"]';
	await page.waitForSelector(file_input_selector);
	let fileInput = await page.$(file_input_selector);
	await fileInput.uploadFile(`imgs/${img}`);
	await new Promise(d=>setTimeout(d, 1500));

	// Click the modal's 'Apply' button
	let btnSel = '.artdeco-modal__actionbar.display-flex.justify-space-between.flex-row-reverse.pv4.ember-view button:not([disabled])';
	await page.waitForSelector(btnSel);

	await page.click(btnSel);
	// await page.evaluate(btnSel => { document.querySelector(btnSel).click(); }, btnSel);

	await new Promise(d=>setTimeout(d, 1500));
}

async function addSkill(skill){
	// click add skill button
	await page.evaluate(_ => { document.querySelectorAll(`button[id^='form-component__typeahead-cta-ember']`)[0].click(); });
	await new Promise(d=>setTimeout(d, 1000));
	
	await page.type(`input[placeholder="Skill (ex: Project Management)"]`, skill, {delay: 60});
	await page.keyboard.press('Enter');
	await new Promise(d=>setTimeout(d, 500));

}

function getLineNumber() {
	const e = new Error();
	const line = e.stack.split('\n')[2]; // Grab the caller line
	const match = line.match(/:(\d+):\d+\)?$/);
	return match ? parseInt(match[1], 10) : null;
}

function enterWhenReady(){

}



async function enterToContinue() {
	const rl = readline.createInterface({ input, output });
	const answer = await rl.question('Press enter to continue...');
	rl.close();
}