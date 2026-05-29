export type Template = {
  id: string;
  name: string;
  description: string;
  prompt: string;
};

export const templates: Template[] = [
  {
    id: "loyal",
    name: "Loyal & Dedicated",
    description:
      "Emphasizes loyalty, family motivation, and unwavering work ethic. Honest about why you work hard.",
    prompt: `Role: You are helping me write a cover letter for a job application.

Rules:
- Use very simple and basic words. Never use fancy or complex vocabulary.
- Never use dashes anywhere in the letter.
- Do not list specific projects or go into detail about my experiences. Let my resume speak for itself.
- Keep it general about my love for building things on the web and working with code.
- Emphasize that I am loyal, dependable, and willing to work hard no matter what.
- Briefly mention that I am the primary provider for my family. I have 3 younger brothers still in school and elderly retired parents. As long as the job can pay the bills and put food on the table, that is enough for me and I will give my absolute best.
- No more than 200 words total.
- Write exactly 3 paragraphs.
- Do not include any greeting like "Dear Hiring Manager" or sign off like "Sincerely". Just output the 3 paragraph body.

Structure:
Paragraph 1: Introduce myself and the role I am applying for. Mention my genuine love for web development and building things with code.
Paragraph 2: Talk about my strong work ethic and loyalty. Briefly and honestly mention my family situation and that I am deeply motivated by the need to provide for my loved ones.
Paragraph 3: Simple closing. Express that I am ready to work hard and would love the chance to chat. Thank them for their time.`,
  },
  {
    id: "straightforward",
    name: "Straightforward",
    description:
      "Very direct and to the point. No fluff, just the essentials. Gets the job done quickly.",
    prompt: `Role: You are helping me write a short cover letter for a job application.

Rules:
- Use very simple and basic words.
- Never use dashes anywhere in the letter.
- Be extremely direct and concise.
- Do not list specific projects or go into detail about my experiences.
- Just say I have relevant experience and my resume shows the details.
- No more than 120 words total.
- Write exactly 2 paragraphs.
- Do not include any greeting or sign off.

Structure:
Paragraph 1: State the role I am applying for and that I have the skills needed based on my resume.
Paragraph 2: Say I am reliable, ready to work, and would like to discuss further.`,
  },
  {
    id: "enthusiastic",
    name: "Enthusiastic Builder",
    description:
      "Shows genuine excitement for web development and eagerness to contribute to the team.",
    prompt: `Role: You are helping me write a cover letter for a job application.

Rules:
- Use simple and basic words but show genuine excitement.
- Never use dashes anywhere in the letter.
- Do not list specific projects or go into detail about my experiences. Let my resume speak for itself.
- Show that I genuinely love building things on the web and learning new technologies.
- Mention that I am loyal and committed to any team I join.
- Briefly mention I am motivated by providing for my family (3 younger brothers in school, elderly parents).
- No more than 200 words total.
- Write exactly 3 paragraphs.
- Do not include any greeting or sign off.

Structure:
Paragraph 1: Express excitement about the role and the company. Show my love for web development.
Paragraph 2: Talk about my eagerness to learn and contribute. Mention my loyalty and family motivation.
Paragraph 3: Enthusiastic closing. Say I would love to chat and bring my energy to the team.`,
  },
  {
    id: "humble",
    name: "Humble & Honest",
    description:
      "Down to earth and honest. No corporate speak. Just a real person looking for real work.",
    prompt: `Role: You are helping me write a cover letter for a job application.

Rules:
- Use very simple, everyday words. Write like a normal person talking.
- Never use dashes anywhere in the letter.
- Do not list specific projects or go into detail about my experiences.
- Be honest and humble. Do not oversell or exaggerate.
- Say that I may not know everything but I learn fast and work hard.
- Mention that I need this job to support my family (3 younger brothers still studying, retired parents) and that is my biggest motivation.
- No more than 180 words total.
- Write exactly 3 paragraphs.
- Do not include any greeting or sign off.

Structure:
Paragraph 1: Introduce myself simply. Say what role I want and that I enjoy working with web technologies.
Paragraph 2: Be honest about my situation. I work hard because my family depends on me. I will do my best no matter what.
Paragraph 3: Simple and humble closing. Thank them and say I hope to get a chance to prove myself.`,
  },
];

export function getTemplateById(id: string): Template {
  return templates.find((t) => t.id === id) ?? templates[0];
}
