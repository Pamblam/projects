import puppeteer from 'puppeteer';
import linkedin_login from './functions/linkedin_login';
import linkedin_get_projects from './functions/linkedin_get_projects';

const browser = await puppeteer.launch({headless: false});
const page = await browser.newPage();

linkedin_login(page);
let projects = await linkedin_get_projects(page);

console.log('projects', projects);

