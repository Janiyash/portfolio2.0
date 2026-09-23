// Technology universe data — categories map to constellation "arms".
// Colors are hex so they can be used directly in canvas/SVG.
export const skillCategories = [
  {
    id: "frontend",
    label: "Frontend",
    color: "#D99A4E",
    skills: ["React", "JavaScript", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "Vite"],
  },
  {
    id: "backend",
    label: "Backend",
    color: "#C1703D",
    skills: ["Node.js", "Express.js", "MongoDB", "MySQL", "PostgreSQL", "PHP"],
  },
  {
    id: "languages",
    label: "Languages",
    color: "#6E8FAE",
    skills: ["Python", "Java", "C", "JavaScript"],
  },
  {
    id: "ai-data",
    label: "AI / Data",
    color: "#8FAE8F",
    skills: ["Django", "Flask", "FastAPI", "NumPy", "Pandas"],
  },
  {
    id: "tools",
    label: "Tools",
    color: "#A8763A",
    skills: ["Git", "GitHub", "Postman", "MVC"],
  },
];

// A curated set of connections that describe how the pieces fit together —
// this is what turns a flat skill list into "how Yash builds systems".
export const skillConnections = [
  ["React", "Node.js"],
  ["React", "TypeScript"],
  ["React", "Tailwind CSS"],
  ["Node.js", "Express.js"],
  ["Express.js", "MongoDB"],
  ["Express.js", "MySQL"],
  ["Express.js", "PostgreSQL"],
  ["Node.js", "GitHub"],
  ["Python", "Django"],
  ["Python", "Flask"],
  ["Python", "FastAPI"],
  ["Python", "Pandas"],
  ["Pandas", "NumPy"],
  ["Git", "GitHub"],
  ["GitHub", "Postman"],
  ["Java", "MVC"],
  ["PHP", "MySQL"],
];
