import React, { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { useInterview } from "../hooks/useInterview"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth.jsx'

const statusStyles = {
  emerald: {
    bar: 'bg-emerald-500',
    pill: 'bg-emerald-500/10 text-emerald-400',
  },
  amber: {
    bar: 'bg-amber-500',
    pill: 'bg-amber-500/10 text-amber-400',
  },
  rose: {
    bar: 'bg-rose-500',
    pill: 'bg-rose-500/10 text-rose-400',
  },
}

const Home = () => {
    const { loading, generateReport, reports, error } = useInterview()
    const { handleLogout } = useAuth()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })

        if (!data?._id) {
            return  // error already `error` state mein set ho chuka hai, UI mein red box dikha hi raha hai
        }
        navigate(`/interview/${data._id}`)
    }

    const onLogoutClick = async () => {
        await handleLogout()
        navigate('/login')
    }

    if (loading) {
        return (
            <main className='min-h-screen flex items-center justify-center bg-slate-950'>
                <div className='flex flex-col items-center gap-4'>
                    {/* <div className='w-10 h-10 border-4 border-slate-700 border-t-pink-500 rounded-full animate-spin' /> */}
                    <h1 className='text-xl font-semibold text-white'>Loading interview plan...</h1>
                </div>
            </main>
        )
    }

  return (
    <main className="min-h-screen bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-10">

            {/* Header */}
            <header className="relative flex flex-col items-center text-center gap-3 py-6">
                <button
                  onClick={onLogoutClick}
                  className='absolute right-0 top-0 text-sm font-semibold text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white px-4 py-2 rounded-lg transition duration-200'
                >
                    Logout
                </button>

                <h1 className='font-bold text-4xl md:text-5xl text-white'>
                    Create Your Custom{' '}
                    <span className='bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
                        Interview Plan
                    </span>
                </h1>
                <p className='text-slate-400 text-base'>Let AI analyze the job requirement and build a winning strategy.</p>
            </header>

            {/* Form section */}
            <section className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

                {/* Job description card */}
                <div className='rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col gap-4'>
                    <div className='flex items-center gap-3'>
                        <FontAwesomeIcon icon={faBagShopping} className="text-pink-400 text-xl" />
                        <h2 className='text-lg font-semibold text-white'>Job description</h2>
                    </div>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="w-full h-72 p-4 bg-slate-950/60 text-white border border-slate-800 rounded-xl resize-none placeholder:text-slate-500 focus:outline-none focus:border-pink-500/50 transition"
                      placeholder="Enter job description here..."
                    />
                </div>

                {/* Profile card */}
                <div className='rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col gap-5'>
                    <div className='flex items-center gap-3'>
                        <FontAwesomeIcon icon={faUser} className="text-pink-400 text-xl" />
                        <h2 className='text-lg font-semibold text-white'>Your profile</h2>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor="resume-upload" className="text-sm font-semibold text-slate-300">Upload resume</label>
                        <input
                          ref={resumeInputRef}
                          type="file"
                          id="resume-upload"
                          className="w-full p-2.5 bg-slate-950/60 text-slate-300 border border-slate-800 rounded-xl file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-800 file:text-white file:text-sm file:font-semibold hover:file:bg-slate-700 transition"
                        />
                    </div>

                    <div className='flex flex-col gap-2 flex-1'>
                        <label htmlFor="self-description" className="text-sm font-semibold text-slate-300">Self description</label>
                        <textarea
                          value={selfDescription}
                          onChange={(e) => setSelfDescription(e.target.value)}
                          className="w-full h-40 p-4 bg-slate-950/60 border border-slate-800 text-white rounded-xl resize-none placeholder:text-slate-500 focus:outline-none focus:border-pink-500/50 transition"
                          placeholder="Enter self description here..."
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <div className='flex flex-col items-center gap-3'>
                {error && (
                    <p className='max-w-2xl text-center text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3'>
                        {error}
                    </p>
                )}
                <button
                  onClick={handleGenerateReport}
                  className="px-10 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition duration-200 shadow-lg shadow-blue-500/20"
                >
                    Generate report
                </button>
            </div>

            {/* Reports section */}
            {reports.length > 0 && (
                <section className='rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8'>
                    <div className='mb-6 flex flex-col gap-1 md:flex-row md:items-center md:justify-between'>
                        <h2 className='text-xl font-semibold text-white'>Your recent interview plans</h2>
                        <p className='text-sm text-slate-400'>Click any plan to continue or review it.</p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                        {reports.map(report => {
                            const score = report.matchScore ?? null;
                            const key = score >= 80 ? 'emerald' : score >= 60 ? 'amber' : 'rose';
                            const statusLabel = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs improvement';
                            const styles = statusStyles[key];

                            return (
                                <button
                                  key={report._id}
                                  onClick={() => navigate(`/interview/${report._id}`)}
                                  className='group flex flex-col justify-between text-left rounded-xl border border-slate-800 bg-slate-950/40 p-5 transition-all duration-300 hover:scale-[1.02] hover:border-pink-500/40 hover:bg-slate-950/80 hover:shadow-lg hover:shadow-pink-500/5'
                                >
                                    <div className='flex items-start justify-between gap-3'>
                                        <h3 className='text-base font-semibold text-slate-100 group-hover:text-white line-clamp-2 leading-snug'>
                                            {report.title || 'Untitled position'}
                                        </h3>
                                        <span className='shrink-0 rounded-lg bg-slate-800/80 px-2.5 py-1 text-xs font-bold text-pink-400'>
                                            {score ?? 'N/A'}%
                                        </span>
                                    </div>

                                    <div className='mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between'>
                                        <span className='text-xs text-slate-500'>
                                            {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Unknown'}
                                        </span>
                                        <span className={`font-semibold px-2.5 py-1 rounded-md text-[11px] capitalize ${styles.pill}`}>
                                            {statusLabel}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    </main>
  )
}

export default Home