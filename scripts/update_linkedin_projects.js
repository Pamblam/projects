import puppeteer from 'puppeteer';
import linkedin_login from './functions/linkedin_login.js';
import linkedin_get_projects from './functions/linkedin_get_projects.js';
import fs from 'node:fs';

const browser = await puppeteer.launch({headless: false});
const page = await browser.newPage();

await linkedin_login(page);

let linkedinProjects = await linkedin_get_projects(page);

const projectExists = pname => linkedinProjects.some(ele => ele.title === pname);

const projects = JSON.parse(fs.readFileSync('proects-parsed.json', 'utf8'));

for(let i=0; i<projects.length; i++){
	let project = projects[i];
	if(projectExists(project.name)) continue;

	console.log(project);

	await addProject(project);

	console.log("done...");

	break;
}

async function addProject(proj){
	await page.$eval('#navigation-add-edit-deeplink-add-project', el => el.click());
	await new Promise(d=>setTimeout(d, 1000));

	await page.$eval(`input[id^='single-line-text-form-component-profileEditFormElement-PROJECT-profileProject']`, (el,x)=>el.value=x, proj.name);
	await page.$eval(`textarea[id^='multiline-text-form-component-profileEditFormElement-PROJECT-profileProject']`, (el,x)=> el.value=x, proj.description);

	let tech = proj.technologies.split(', ');
	for(let i=0; i<tech.length; i++){
		await addSkill(tech[i]);
	}

	if(proj.url){
		await page.$eval('#media-dropdown-trigger', el => el.click());

		// attempting to work out the cxode to click the buitton to add media and link...

		// (()=>{
  
		// 	setTimeout(()=>{
		// 	  let btn = document.querySelector(`#ember69`);
			  
		// 	  let dd = [...document.querySelectorAll('.artdeco-dropdown__content-inner')].filter(e=>{
		// 		let btns = e.querySelectorAll('.artdeco-dropdown__item.artdeco-dropdown__item--is-dropdown.ember-view.display-flex.align-items-center');
		// 		return btns.length == 2;
		// 	  })[0];
			  
		// 	  dd.querySelectorAll('li')[0].click();
			  
		// 	  console.log(dd.querySelectorAll('li')[0].innerHTML);
		// 	}, 1500);
			
			
		//   })();
	}
}

async function addSkill(skill){
	// click add skill button
	await page.evaluate(_ => { document.querySelectorAll(`button[id^='form-component__typeahead-cta-ember']`)[0].click(); });
	await new Promise(d=>setTimeout(d, 1000));
	
	await page.type(`input[placeholder="Skill (ex: Project Management)"]`, skill, {delay: 120});
	await page.keyboard.press('Enter');
	await new Promise(d=>setTimeout(d, 500));
}