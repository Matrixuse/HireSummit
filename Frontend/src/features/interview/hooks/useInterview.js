import { getAllInterviewReports, generateInterviewReport, generateInterviewReportById, generateResumePdf } from "../services/interview.api";
import React, { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router-dom"

export const useInterview = () => {
    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if(!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports, error, setError } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setError(null)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            if (!response?.interviewReport) {
                setError('Interview report was not returned by the server.')
                return null
            }
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (err) {
            setError(err?.message || 'Failed to generate interview report')
            return null
        } finally {
            setLoading(false)
        }
    }

    const generateReportById = async (interviewId) => {
        setLoading(true)
        try {
            const response = await generateInterviewReportById(interviewId)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (_) {
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        try {
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)
            return response.interviewReports
        } catch (_) {
            return null
        } finally {
            setLoading(false)
        }
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        try {
            const response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            // link.href = urllink.setAttribute("download", `resume_${interviewReportId}.pdf`)
            link.href = url                                                           //<--------these two lines comes by removeing the above line
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)          //<--------
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        }
        catch (err) {
            console.error('Failed to download resume PDF:', err)
            alert('Something went wrong while generating your resume PDF. Please try again in a moment.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(interviewId) {
            generateReportById(interviewId)
        } else {
            getReports()
        }
    }, [])

    return { loading, report, reports, error, generateReport, generateReportById, getReports, getResumePdf}
}