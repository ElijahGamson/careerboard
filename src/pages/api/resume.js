import Anthropic from "@anthropic-ai/sdk";

// formidable parses incoming FormData (file uploads) on the server.
// Think of it as the server-side partner to the browser's FormData API —
// the browser packages the file up, formidable unpacks it.
import formidable from "formidable";

// fs = "file system" — a built-in Node.js module for reading/writing files.
// No install needed, it comes with Node.
// We need it to read the uploaded file from the temp location
// where formidable saves it.
import fs from "fs";

// Tell Next.js NOT to parse the request body automatically.
// By default, Next.js reads the body and turns it into JSON for you
// (which is why req.body works with JSON in your other routes).
// But file uploads aren't JSON — they're binary data in "multipart/form-data" format.
// If Next.js tries to parse that as JSON, it breaks.
// This is like telling a mail clerk "don't open this package, just hand it to me."
export const config = {
    api: {
        bodyParser: false,
    },
};

// Create the client OUTSIDE the handler function.
// This means it's created once when the server starts, not on every request.
// Same idea as when I initialize Firebase once in firebaseConfig.js instead of inside every component.
const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Helper function that wraps formidable in a Promise.
// Formidable uses the older "callback" style (like early JavaScript),
// but we want to use async/await (the modern style you're used to).
// This wrapper converts it — same concept as wrapping setTimeout in a Promise.
function parseForm(req) {
    const form = formidable({
        maxFileSize: 5 * 1024 * 1024, // 5MB limit — resumes shouldn't be bigger
    });

    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            // fields = text data (like resume text, job description)
            // files = uploaded files (like the PDF)
            else resolve({ fields, files });
        });
    });
}

// This function runs every time someone hits /api/resume
// Next.js API routes work like mini Express servers:
// req = the incoming request, res = what I send back
export default async function handler(req, res) {

    // Only allow POST requests.
    // GET = "give me data" (like loading a page)
    // POST = "here's data, do something with it" (like submitting a form)
    // We're sending resume + job description, that's why POST is used.
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // Parse the incoming FormData
        const { fields, files } = await parseForm(req);

        // ============================================
        // BUILD THE MESSAGE BASED ON INPUT TYPE
        // If a PDF was uploaded, send it directly to Claude as a document.
        // If text was pasted, send it as plain text like before.
        // ============================================

        let resumeContent;
        const uploadedFile = files.resumeFile;

        if (uploadedFile) {
            // files come as arrays in newer formidable versions
            const file = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;

            // Read the file from disk into memory as a "buffer" (raw binary data).
            // formidable saves uploads to a temp folder — filepath tells us where.
            const fileBuffer = fs.readFileSync(file.filepath);

            // Convert the buffer to base64 — a text encoding of binary data.
            // Think of base64 like translating a picture into a really long string
            // of letters and numbers so it can travel through text-only channels.
            // Same reason email attachments use base64 under the hood.
            const base64Data = fileBuffer.toString("base64");

            // Clean up the temp file — good practice to not leave files sitting around.
            // It's like clearing your dishes after eating.
            fs.unlinkSync(file.filepath);

            // Claude can read PDFs natively — we send it as a "document" content block.
            // This is way better than extracting text ourselves because Claude
            // can see the formatting, layout, and structure of the actual PDF.
            resumeContent = {
                type: "document",
                source: {
                    type: "base64",
                    media_type: "application/pdf",
                    data: base64Data,
                },
            };
        } else if (fields.resume) {
            // No file uploaded — user pasted text instead
            // formidable returns field values as arrays, so grab [0]
            const resumeText = Array.isArray(fields.resume) ? fields.resume[0] : fields.resume;
            resumeContent = {
                type: "text",
                text: `RESUME:\n${resumeText}`,
            };
        }

        // Get the job description (always pasted as text)
        const jobDescription = Array.isArray(fields.jobDescription)
            ? fields.jobDescription[0]
            : fields.jobDescription;

        // Basic validation: I don't waste an API call (and money) on empty input. (I don't have that kind of money)
        // Always validate on the server even if you also validate on the frontend,
        // because someone can bypass my UI and call /api/resume directly.
        if (!resumeContent || !jobDescription) {
            return res.status(400).json({
                error: "Both a resume (text or PDF) and job description are required.",
            });
        }

        // ============================================
        // THIS IS THE ACTUAL AI CALL
        // Everything above is just plumbing.
        // Everything below is just formatting the response.
        // ============================================
        const message = await client.messages.create({

            // Choose the model to use
            // Haiku = economy (fast, cheap, less smart)
            // Sonnet = mid-range (good balance)
            // Opus = luxury (smartest, slowest, most expensive)
            model: "claude-sonnet-4-6",

            // Cap the response length so a weird prompt doesn't
            // generate a novel and cost me $5.
            // 1024 tokens = roughly 750 words
            max_tokens: 1024,

            // The "messages" array is the conversation.
            // Notice content is now an ARRAY of content blocks instead of a single string.
            // This is how you send mixed content (documents + text) in one message.
            // Think of it like attaching a file to an email and writing a note —
            // the document block is the attachment, the text block is the note.
            messages: [
                {
                    role: "user",
                    content: [
                        resumeContent,
                        {
                            type: "text",
                            text: `You are an expert career coach and resume reviewer. Your job is to analyze how well a resume matches a specific job posting.

Compare the resume provided above against the job description below. Provide your analysis as a JSON object with these exact fields:

1. "score" — A match score from 0 to 100
2. "summary" — A 2-3 sentence overall assessment
3. "matchingSkills" — An array of skills/keywords from the job description that ARE present on the resume
4. "missingSkills" — An array of skills/keywords from the job description that are MISSING from the resume
5. "suggestions" — An array of 3-4 specific, actionable suggestions to improve the resume for this particular role

IMPORTANT: Respond with ONLY the JSON object. No markdown, no backticks, no explanation outside the JSON.

JOB DESCRIPTION:
${jobDescription}`,
                        },
                    ],
                },
            ],
        });

        // ============================================
        // PARSING THE RESPONSE
        // ============================================

        // Claude's response comes back as an array of "content blocks."
        // For a text response, it's message.content[0].text
        const rawText = message.content[0].text;

        // Claude responds in JSON, so parse it.
        // This is the same JSON.parse() used on any API response.
        // Why JSON? Because we need to PROGRAM against the result.
        // If Claude returned "Your score is 75 and you're missing Docker...",
        // we'd have to write messy regex to extract the number.
        // JSON gives us clean data: result.score, result.missingSkills, etc.
        //
        // Sometimes Claude wraps JSON in markdown backticks like ```json ... ```
        // or adds a sentence before/after it. This cleanup handles that.
        // It's like getting a letter where someone wrote "Here you go!" above
        // the actual form — we just need to find the form and ignore the note.
        const cleanedText = rawText
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .trim();

        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("No JSON found in response:", rawText);
            return res.status(500).json({
                error: "The AI didn't return a valid analysis. Try again."
            });
        }

        const analysis = JSON.parse(jsonMatch[0]);

        // Send it back to the frontend
        return res.status(200).json(analysis);

    } catch (error) {
        console.error("Resume analysis error:", error);
        console.error("Raw response was:", error.rawText || "no raw text captured");

        // If JSON.parse fails, Claude probably returned text instead of JSON.
        // This happens sometimes, LLMs aren't perfect at following instructions.
        // In production you'd add retry logic, but for now a clear error is fine.
        return res.status(500).json({
            error: "Analysis failed. The AI response couldn't be processed. Try again.",
        });
    }
}