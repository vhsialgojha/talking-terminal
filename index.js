import 'dotenv/config';
import axios from 'axios';
import say from 'say';

// ---------- COLORS ----------
const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const MAGENTA = "\x1b[35m";
const BOLD = "\x1b[1m";

// ---------- INPUT ----------
const args = process.argv.slice(2);
const commandOutput = args.join(" ");

if (!commandOutput) {
  console.log(`${RED}${BOLD}❌ No terminal output provided.${RESET}`);
  console.log(`${YELLOW}👉 Example:${RESET} node index.js "git should be committed"`);
  process.exit(1);
}

// ---------- BANNER ----------
console.log(`
${CYAN}${BOLD}
┌──────────────────────────────┐
│ 🤖  TALKING TERMINAL         │
│     your CLI buddy           │
└──────────────────────────────┘
${RESET}
`);

// ---------- PROMPT ----------
const prompt = `
You are a sassy but helpful AI terminal assistant.

Rules:
- Talk like a chill developer friend.
- Be funny, slightly sarcastic, but never rude.
- Use very simple language.
- If the user made a mistake, roast lightly 😄
- Always explain what went wrong and how to fix it.
- No markdown. Plain text only.

Terminal output:
${commandOutput}
`;

// ---------- GEMINI CALL ----------
async function callGemini() {
  try {
    console.log(`${MAGENTA}🤖 Thinking...${RESET}\n`);

    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const text =
      res.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("AI returned empty response");
    }

    console.log(`${GREEN}${BOLD}🤖 Talking Terminal says:${RESET}\n`);
    console.log(`${CYAN}${text}${RESET}`);

    // ---------- VOICE ----------
    say.speak(text, undefined, 0.9);

    console.log(`\n${YELLOW}— powered by AI 🤖${RESET}`);

  } catch (err) {
    console.error(`\n${RED}${BOLD}❌ Oops.${RESET}`);
    console.error(
      `${RED}`,
      err.response?.data || err.message,
      RESET
    );
  }
}

callGemini();
