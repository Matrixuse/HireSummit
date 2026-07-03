const { GoogleGenAI } = require("@google/genai");
const puppeteer = require('puppeteer')
const { z } = require('zod')
const { zodToJsonSchema } = require('zod-to-json-schema')

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
})

async function generateInterviewReport({ resume, selfdescribe, jobdescribe }) {      // Function to generate an interview report based on the candidate's resume, self-describe, and job describe

    const prompt = `You are a Senior Software Engineering Interviewer.
                    Analyze the following candidate.
                    Return ONLY valid JSON.
                    The JSON must have EXACTLY this structure.

{
  "matchScore": 0,
  "technicalQuestions": [
    {
      "question":"",
      "intention":"",
      "answer":""
    }
  ],
  "behavioralQuestions":[
    {
      "question":"",
      "intention":"",
      "answer":""
    }
  ],
  "skillGaps":[
    {
      "skill":"",
      "severity":"low"
    }
  ],
  "preparationPlan":[
    {
      "day":1,
      "focus":"",
      "tasks":[]
    }
  ]
}

Rules:

Generate exactly 10 technicalQuestions.

Generate exactly 5 behavioralQuestions.

Generate exactly 5 skillGaps.

Generate exactly 7 preparationPlan objects.

For every technical question:
- Generate a detailed expected answer.
- The answer field must NEVER be empty.

For every behavioral question:
- Generate a STAR-format sample answer.
- The answer field must NEVER be empty.

Do NOT return markdown.

Do NOT return explanation.

Do NOT return reportTitle.

Do NOT return strengths.

Do NOT return summary.

Return ONLY JSON.

Resume:
${resume}

Self Description:
${selfdescribe}

Job Description:
${jobdescribe} `;

    // hamare pass jo response aayega wo ek JSON format me hoga jisme matchScore, technicalQuestions, behavioralQuestions, skillGaps aur preparationPlan fields honge. Ye fields interviewReportSchema ke according honge. and isko hame JSON.parse(response.text) larke likhna padega

    const response = await ai.models.generateContent({   // Call the Google GenAI API to generate content based on the provided input  
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {    //config ke andar hum wo sb likhte hai jo hum chahte hai ki model ko follow karna chahiye
            responseMimeType: "application/json",  //responseMimeType is used to specify the format of the response we want from the model. In this case, we want the response in JSON format.
            // responseSchema: zodToJsonSchema(interviewReportSchema),  //yaha hum batate hai ki hum chahte hai ki model ka response interviewReportSchema ke format me ho
            temperature: 0.2,  //temperature is used to control the randomness of the model's output. A lower temperature value (closer to 0) will make the model's output more deterministic and focused, while a higher temperature value (closer to 1) will make the output more random and diverse.
        }
    })

    const report = JSON.parse(response.text);

    if (
        !Array.isArray(report.technicalQuestions) ||
        !Array.isArray(report.behavioralQuestions) ||
        !Array.isArray(report.skillGaps) ||
        !Array.isArray(report.preparationPlan)
    ) {
        throw new Error("Gemini returned invalid JSON structure");
    }

    return report;
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0"})

  const pdfBuffer = await page.pdf({ format: "A4", margin: { top: "10mm", bottom: "15mm", left: "10mm", right: "10mm"}})
  await browser.close()

  return pdfBuffer
}

function buildFallbackResumeHtml({ resume, selfDescription, jobDescription }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Resume</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.5; margin: 24px; }
    h1, h2, h3 { color: #111; margin-bottom: 8px; }
    section { margin-bottom: 20px; }
    pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; }
    .header { border-bottom: 2px solid #111; padding-bottom: 12px; margin-bottom: 20px; }
    .subtitle { color: #555; margin-top: 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Generated Resume</h1>
    <p class="subtitle">Tailored for the provided job description</p>
  </div>
  <section>
    <h2>Job Description</h2>
    <pre>${jobDescription}</pre>
  </section>
  <section>
    <h2>Profile Summary</h2>
    <pre>${selfDescription}</pre>
  </section>
  <section>
    <h2>Resume Content</h2>
    <pre>${resume}</pre>
  </section>
</body>
</html>`
}

async function generateResumePdf({ resume, selfDescription, jobDescription }){
  const resumePdfSchema = z.object({
    html: z.string().describe("the HTML content of resume which can be converted to pdf using a library such as puppeteer")
  })

  const prompt = `Generate a resume for a candidate with the following details:\nResume: ${resume}\nSelf Description: ${selfDescription}\nJob Description: ${jobDescription}\n\nReturn a JSON object with a single field \"html\" containing valid HTML content that can be converted to PDF using a library such as puppeteer. The resume should be tailored for the given job description, highlight the candidate's strengths and relevant experience, and be easy to read. Keep the design simple, professional, ATS-friendly, and ideally 1-2 pages long not more than that, when converted to PDF. Do not include markdown or plain text wrappers; return only the JSON object.
                  Read job description, self description and resume and generate a professional resume using those details and do not add job description or self description to the resume.`

  let htmlContent
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(resumePdfSchema),
      }
    })

    const jsonContent = JSON.parse(response.text || '{}')
    htmlContent = jsonContent.html || jsonContent.HTML

    if (typeof htmlContent !== 'string' || htmlContent.trim().length === 0) {
      throw new Error('Resume generator returned invalid HTML content')
    }
  } catch (_) {
    htmlContent = buildFallbackResumeHtml({ resume, selfDescription, jobDescription })
  }

  const pdfBuffer = await generatePdfFromHtml(htmlContent)
  return pdfBuffer
}

module.exports = { generateInterviewReport, generateResumePdf }