import 'dotenv/config';
import axios from 'axios';

const commandOutput = process.argv.slice(2).join(' ');

if (!commandOutput) {
  console.log("❌ No command output provided");
  process.exit(1);
}

const prompt = `
Explain this terminal output in simple human language. If it's an error, explain what went wrong and what to do next.

Output:
${commandOutput}
`;

async function callGemini() {
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    console.log("\n🤖 AI says:\n");
    console.log(res.data.candidates[0].content.parts[0].text);
  } catch (err) {
    console.error("❌ Gemini error:", err.response?.data || err.message);
  }
}

callGemini();
