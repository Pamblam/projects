import fs from 'node:fs';

const projects = JSON.parse(fs.readFileSync('projects.json', 'utf8'));
const resume = fs.readFileSync('resume.txt', 'utf8');
const jobdesc = fs.readFileSync('resume.txt', 'utf8');

fs.writeFileSync("prompt_resume.txt", `Using the following job description, resume, and project list, please create a resume tailored to the given job description. Include the most relevant details from the provided resume and project list. Please format the resume in HTML as a complete HTML document including any CSS. The HTML will be converted to a PDF so please do not use any links.
	
# Job Description 

${jobdesc}

# Resume

${resume}

# Projects

${projects.map(p=>`${p.name}\n${p.url}\n${p.description}\ntech used: ${p.technologies}`).join("\n\n")}`); 

fs.writeFileSync("prompt_cover.txt", `Using the following job description, resume, and project list, please create a cover letter tailored to the given job description. Include the most relevant details from the provided resume and project list. Please format the cover letter in HTML as a complete HTML document including any CSS. The HTML will be converted to a PDF so please do not use any links.

# Job Description 

${jobdesc}

# Resume

${resume}

# Projects

${projects.map(p=>`${p.name}\n${p.url}\n${p.description}\ntech used: ${p.technologies}`).join("\n\n")}`); 