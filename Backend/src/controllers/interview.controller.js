const pdfParse = require('pdf-parse')  //pdf ka jo data hai ya uske andar ka jo content hai use read karne ke liye hum use karte hai pdf-parser ka
const { generateInterviewReport, generateResumePdf } = require('../services/aiservice')  //generateInterviewReport function ko import karte hai jo ki interview report generate karega
const interviewReportModel = require('../models/interviewReport.model')

async function generateInterviewReportController(req, res) {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({
        success: false,
        message: 'Resume PDF file is required'
      })
    }

    const parser = new pdfParse.PDFParse({ data: req.file.buffer })
    const resumeContent = await parser.getText()
    await parser.destroy()

    const { selfDescription, jobDescription } = req.body
    const title = jobDescription.substring(0, 60) + "..."

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfdescribe: selfDescription,
        jobdescribe: jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        title,
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: 'Interview report generated successfully',
        interviewReport
    })
  } catch (err) {
      const isAuthError = /api key|authentication|unauthenticated|oauth/i.test(err.message || '')
      return res.status(isAuthError ? 503 : 500).json({
        success: false,
        message: err.message
      });
  }
}

async function getInterviewReportByIdController(req, res) {    //ye api us particular user ki koi si report send karega
    const { interviewId } = req.params

    // const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    const interviewReport = await interviewReportModel.findById(interviewId);

    if(!interviewReport) {
        return res.status(404).json ({
            message: "Interview report not found",
        })
    }

    res.status(200).json({
        message: "Interview report fetch successfully",
        interviewReport
    })
}

async function getAllInterviewReportController(req, res) {    //ye api us user ki saari report send karegi
    const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

    res.status(200).json({
        message: "Interview report successfully",
        interviewReports
    })
}
 
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if(!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportController, generateResumePdfController }
