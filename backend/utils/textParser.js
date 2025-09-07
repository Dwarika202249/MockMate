// Skill Bank - Expand this as needed
const KNOWN_SKILLS = [
  "HTML", "CSS", "JavaScript", "React", "Redux", "Node.js", "Express",
  "MongoDB", "MySQL", "TypeScript", "Tailwind", "Shadcn", "Flask",
  "Python", "Java", "Spring Boot", "Git", "Docker"
];

const parseResumeText = (text) => {
  return {
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    summary: extractSummary(text), 
    skills: extractSkills(text),
    education: extractEducation(text),
    experience: extractExperience(text),
  };
};

const extractName = (text) => {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  // Assume name is first line if it doesn’t have email/phone
  const likelyName = lines.find(line =>
    !line.match(/@|[0-9]/g) && line.split(" ").length <= 4
  );
  return likelyName || "N/A";
};

const extractEmail = (text) => {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
  return match ? match[0] : "N/A";
};

const extractPhone = (text) => {
  const match = text.match(/(\+91[\-\s]?)?[0]?[789]\d{9}/);
  return match ? match[0] : "N/A";
};

const extractSkills = (text) => {
  const lowerText = text.toLowerCase();
  return KNOWN_SKILLS.filter(skill =>
    new RegExp(`\\b${skill.toLowerCase()}\\b`, 'i').test(lowerText)
  );
};

const extractEducation = (text) => {
  const lines = text.split('\n').map(line => line.trim());
  const eduKeywords = ["b.tech", "bachelor", "master", "b.sc", "m.sc", "graduation", "degree", "university", "college"];
  return lines.filter(line =>
    eduKeywords.some(keyword => line.toLowerCase().includes(keyword))
  );
};

const extractExperience = (text) => {
  const lines = text.split('\n').map(line => line.trim());
  const expKeywords = ["worked", "company", "experience", "developer", "engineer", "project"];
  return lines.filter(line =>
    expKeywords.some(keyword => line.toLowerCase().includes(keyword))
  );
};

const extractSummary = (text) => {
  const summaryKeywords = ["summary", "professional summary", "career objective", "objective", "about me", "profile"];
  const lines = text.split('\n').map(line => line.trim());
  let summaryStartIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const lower = lines[i].toLowerCase();
    if (summaryKeywords.some(keyword => lower.includes(keyword))) {
      summaryStartIndex = i + 1;
      break;
    }
  }

  if (summaryStartIndex === -1) return "Not found";

  let summary = "";
  for (let i = summaryStartIndex; i < lines.length; i++) {
    if (lines[i] === "" || /^[A-Z ]{3,}$/.test(lines[i])) break; // stops at next heading
    summary += lines[i] + " ";
  }

  return summary.trim() || "Not found";
};

module.exports = { parseResumeText };