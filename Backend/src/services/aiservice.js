const puppeteer = require('puppeteer')

function resolveApiKey() {
  return (process.env.GROQ_API_KEY || '').trim()
}

const apiKey = resolveApiKey()
const AI_API_BASE = 'https://api.groq.com/openai/v1'
const MODEL = 'llama-3.3-70b-versatile'

function getApiKeyMeta() {
  return {
    hasKey: !!apiKey,
    keyLength: apiKey.length,
    isGroqKey: apiKey.startsWith('gsk_'),
  }
}

function parseAiError(err) {
  const raw = err?.message || String(err)
  if (/401|unauthenticated|authorization|invalid api key/i.test(raw)) {
    return 'Your Groq API key is invalid or expired. Set GROQ_API_KEY in Backend/.env and restart the server.'
  }
  return raw
}

function stripJsonFences(text) {
  return String(text || '')
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/, '')
    .replace(/```\s*$/, '')
    .trim()
}

async function sendGroqRequest(prompt, options = {}) {
  if (!apiKey) {
    throw new Error('Groq API key is not configured. Set GROQ_API_KEY in Backend/.env and restart the server.')
  }

  const body = {
    model: options.model || MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_completion_tokens: options.maxOutputTokens ?? 4096,
    temperature: options.temperature ?? 0.2,
    top_p: options.topP ?? 1,
  }

  const response = await fetch(`${AI_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`Groq API request failed (${response.status}): ${text}`)
  }

  try {
    return JSON.parse(text)
  } catch (err) {
    throw new Error(`Unable to parse Groq API response: ${text}`)
  }
}

function extractGroqText(response) {
  return response?.choices?.[0]?.message?.content || ''
}

async function validateGroqApiKey() {
  if (!apiKey) {
    console.error('[Groq] Missing API key. Set GROQ_API_KEY in Backend/.env')
    return false
  }

  try {
    const response = await sendGroqRequest('Ping', { maxOutputTokens: 5, temperature: 0 })
    const text = extractGroqText(response)
    console.log('[Groq] API key validated successfully:', text?.slice(0, 100))
    return true
  } catch (err) {
    console.error('[Groq] API key validation failed:', parseAiError(err))
    return false
  }
}

async function generateInterviewReport({ resume, selfdescribe, jobdescribe }) {
  if (!apiKey) {
    throw new Error('Groq API key is not configured. Set GROQ_API_KEY in Backend/.env and restart the server.')
  }

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

  let response
  try {
    response = await sendGroqRequest(prompt, { maxOutputTokens: 4096, temperature: 0.2 })
  } catch (err) {
    throw new Error(parseAiError(err))
  }

  const reportText = stripJsonFences(extractGroqText(response))

  let report
  try {
    report = JSON.parse(reportText)
  } catch (err) {
    throw new Error('Groq returned a response that was not valid JSON. Try raising max_completion_tokens or check the model name in Groq console.')
  }

  if (
    !Array.isArray(report.technicalQuestions) ||
    !Array.isArray(report.behavioralQuestions) ||
    !Array.isArray(report.skillGaps) ||
    !Array.isArray(report.preparationPlan)
  ) {
    throw new Error('Groq returned an unexpected JSON structure');
  }

  return report;
}

async function generatePdfFromHtml(htmlContent) {
  const isProd = process.env.NODE_ENV === 'production'
  let browser

  if (isProd) {
    const chromium = require('@sparticuz/chromium')
    const puppeteerCore = require('puppeteer-core')
    browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    })
  } else {
    browser = await puppeteer.launch()
  }

  const page = await browser.newPage()
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' })
  const pdfBuffer = await page.pdf({ format: 'A4', margin: { top: '10mm', bottom: '15mm', left: '10mm', right: '10mm' } })
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

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const prompt = `Generate a resume for a candidate with the following details:\nResume: ${resume}\nSelf Description: ${selfDescription}\nJob Description: ${jobDescription}\n\nReturn a JSON object with a single field \"html\" containing valid HTML content that can be converted to PDF using a library such as puppeteer. The resume should be tailored for the given job description, highlight the candidate's strengths and relevant experience, and be easy to read. Keep the design simple, professional, ATS-friendly, and ideally 1-2 pages long. Do not include markdown or plain text wrappers; return only the JSON object.`

  let htmlContent
  try {
    const response = await sendGroqRequest(prompt, { maxOutputTokens: 2000, temperature: 0.2 })
    const responseText = stripJsonFences(extractGroqText(response))
    const jsonContent = JSON.parse(responseText || '{}')
    htmlContent = jsonContent.html || jsonContent.HTML

    if (typeof htmlContent !== 'string' || htmlContent.trim().length === 0) {
      throw new Error('Resume generator returned invalid HTML content')
    }
  } catch (err) {
    htmlContent = buildFallbackResumeHtml({ resume, selfDescription, jobDescription })
  }

  return await generatePdfFromHtml(htmlContent)
}

module.exports = { generateInterviewReport, generateResumePdf, validateGroqApiKey }