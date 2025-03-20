export default async function linkedin_login(page){
	await page.goto('https://www.linkedin.com/login', {
		waitUntil: 'networkidle2',
	});
	
	await page.waitForSelector('form.login__form');
	await page.$eval('#username', el => el.value = 'adelphia@protonmail.ch');
	await page.$eval('#password', el => el.value = 'bijoux22');
	
	await page.$eval('form.login__form', el => el.submit());
	await new Promise(d=>setTimeout(d, 1000));
}