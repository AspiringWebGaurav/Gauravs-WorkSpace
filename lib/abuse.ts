const BANNED_TERMS = [
  "fuck",
  "shit",
  "bitch",
  "bastard",
  "asshole",
  "slut",
  "douche",
  "cunt",
  "fag",
  "motherfucker",
];

const normalize = (input: string) =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const profanityList = [...BANNED_TERMS];

export const isAbusive = (text: string) => {
  const normalized = normalize(text);
  if (!normalized.length) return false;
  return BANNED_TERMS.some((term) => normalized.includes(term));
};

export const isAbusiveMessage = (title: string, content: string) =>
  isAbusive(`${title} ${content}`);
