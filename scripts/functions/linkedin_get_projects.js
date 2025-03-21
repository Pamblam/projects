export default async function linkedin_get_projects(page){

	await page.goto('https://www.linkedin.com/in/robert-parham/details/projects/', {
		waitUntil: 'domcontentloaded',
	});
	
	let project_selector = 'section.artdeco-card.pb3 .scaffold-finite-scroll__content>ul>li';
	let projects_count = (await page.$$(project_selector)).length;
	while(true){
		await page.evaluate(_ => { window.scrollBy(0, window.innerHeight); });
		await new Promise(d=>setTimeout(d, 1000));
		let pc = (await page.$$(project_selector)).length;
		if(pc === projects_count) break; // nothing new
		projects_count = pc;
	}
	
	return await page.evaluate(() => { 
		let projects = [];
		document.querySelectorAll('section.artdeco-card.pb3 .scaffold-finite-scroll__content>ul>li').forEach(p=>{
			let title_part = p.querySelector('div.display-flex.flex-row.justify-space-between div');
			let title = title_part.querySelector('div.display-flex.align-items-center.mr1.t-bold>span').innerText.trim();
			let dates_div = p.querySelector('span.t-14.t-normal');
			let start_date = null, end_date = null;
			if(dates_div){
				let dates = dates_div.innerText.trim();
				let [sd, ed] = dates.split("\n").map(t=>t.trim()).map(d=>{
					let [month, year] = d.split(" ");
					return {month, year};
				});
				start_date = sd;
				end_date = ed;
			}
	
			let link = null;
			let a = p.querySelector('a.optional-action-target-wrapper.artdeco-button.artdeco-button--secondary');
			if(a) link = a.href;
	
			let desc = '', skills = [];
			p.querySelectorAll('.display-flex.align-items-center.t-14.t-normal.t-black span').forEach(itm=>{
				let text = itm.innerText.trim();
				if(text.indexOf('Skills: ') === 0){
					skills = text.substring(8).split(' · ');
				}else{
					desc = text;
				}
			});
	
			projects.push({title, start_date, end_date, link, desc, skills});
		});
		return projects;
	});
}