import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


async function main() {
  // Read environment variables
  const ticketId = process.env.TICKET_ID;
  const description = process.env.TICKET_DESCRIPTION;

  // HTML file to modify
  const filePath = 'index.html';

  // Validate required environment variables
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ Error: GEMINI_API_KEY is not set.');
    process.exit(1);
  }

  if (!ticketId) {
    console.error('❌ Error: TICKET_ID is not set.');
    process.exit(1);
  }

  if (!description) {
    console.error('❌ Error: TICKET_DESCRIPTION is not set.');
    process.exit(1);
  }

  // Check if index.html exists
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: ${filePath} not found.`);
    process.exit(1);
  }

  // Read existing HTML
  const currentContent = fs.readFileSync(filePath, 'utf8');

  console.log('');
  console.log('========================================');
  console.log('🤖 Gemini AI Web Developer Agent');
  console.log('========================================');
  console.log(`🎫 Ticket ID: ${ticketId}`);
  console.log(`📝 Task: ${description}`);
  console.log(`📄 File: ${filePath}`);
  console.log('========================================');
  console.log('');

  // Create Gemini prompt
  const prompt = `
You are an expert web developer AI agent.

You are given an existing HTML file and a task from Jira.

TASK ID:
${ticketId}

TASK DESCRIPTION:
${description}

CURRENT HTML CONTENT:
\`\`\`html
${currentContent}
\`\`\`

INSTRUCTIONS:

1. Modify the existing HTML to completely fulfill the Jira task.
2. Preserve existing functionality unless the task specifically requires changing it.
3. Add all required HTML, CSS, and JavaScript necessary to implement the task.
4. Make the page responsive and usable on desktop and mobile.
5. Keep the code clean and well structured.
6. Do not remove existing features unless required by the task.
7. Maintain valid HTML.
8. Make sure all CSS and JavaScript is correctly embedded or referenced.
9. Return ONLY the complete modified HTML file.
10. Do NOT return Markdown code fences.
11. Do NOT return explanations.
12. Do NOT return comments outside the HTML document.

Your response must start with:
<!DOCTYPE html>

And your response must contain the complete HTML file.
`;

  try {
    console.log('⏳ Sending request to Gemini...');

    // Send request to Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // Make sure Gemini returned something
    if (!response || !response.text) {
      throw new Error('Gemini returned an empty response.');
    }

    let updatedHtml = response.text.trim();

    // Remove Markdown code fences if Gemini accidentally returns them
    updatedHtml = updatedHtml.replace(/^```html\s*/i, '');
    updatedHtml = updatedHtml.replace(/^```\s*/i, '');
    updatedHtml = updatedHtml.replace(/\s*```$/i, '');
    updatedHtml = updatedHtml.trim();

    // Sometimes Gemini may put text before <!DOCTYPE html>.
    // Remove everything before the actual HTML document.
    const htmlStart = updatedHtml.search(/<!doctype html>/i);

    if (htmlStart !== -1) {
      updatedHtml = updatedHtml.substring(htmlStart);
    }

    // Validate that Gemini returned HTML
    if (!updatedHtml.toLowerCase().includes('<html')) {
      throw new Error(
        'Gemini response does not appear to contain a valid HTML document.'
      );
    }

    // Create a backup before overwriting the original file
    const backupPath = `${filePath}.backup`;

    fs.writeFileSync(
      backupPath,
      currentContent,
      'utf8'
    );

    console.log(`💾 Backup created: ${backupPath}`);

    // Write updated HTML
    fs.writeFileSync(
      filePath,
      updatedHtml,
      'utf8'
    );

    console.log('');
    console.log('========================================');
    console.log('✅ SUCCESS');
    console.log('========================================');
    console.log(`📄 Updated file: ${filePath}`);
    console.log(`💾 Backup file: ${backupPath}`);
    console.log(`🎫 Ticket: ${ticketId}`);
    console.log('========================================');
    console.log('');
  } catch (error) {
    console.error('');
    console.error('========================================');
    console.error('❌ GEMINI AGENT ERROR');
    console.error('========================================');
    console.error(error);
    console.error('========================================');
    console.error('');

    process.exit(1);
  }
}

// Run the agent
main();