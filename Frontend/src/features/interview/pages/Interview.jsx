import React, { useState, useEffect } from "react"; 
import { Code2, MessageSquare, Map, ChevronRight } from "lucide-react";
import { useInterview } from "../hooks/useInterview";
import { useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';

const severityStyles = {
  high: 'bg-red-600 text-white',
  medium: 'bg-yellow-500 text-slate-950',
  low: 'bg-slate-500 text-white',
}

const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical");
  const [openQuestion, setOpenQuestion] = useState(0);
  const [openBehavior, setOpenBehavior] = useState(0);
  const { report, generateReportById, loading, getResumePdf} = useInterview();
  const { interviewId } = useParams();

  useEffect(() => {
    generateReportById(interviewId);
  }, [interviewId]);

  if(loading || !report) {
    return (
      <main className='loading-screen bg-mauve-800'>
        <h1 className='flex h-screen justify-center items-center text-4xl font-bold text-white'>Downloading Resume...</h1>
      </main>
    )
  }

  const scoreColor = report.matchScore >=80 ? 'score--high': report.matchScore >= 60 ? 'score--mid' : 'score--low'

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#111827] to-[#0f172a] text-white">

      <div className="flex">

        {/* ================= Sidebar ================= */}

        <aside className="w-[270px] min-h-screen border-r border-slate-800 px-6 py-10">
          <br />
          <h2 className="uppercase text-md font-bold text-white mb-4 ml-[-6px]">
            Sections
          </h2>
          <hr />
          <br />
          <div className="space-y-3">

            <button
              onClick={() => setActiveNav("technical")}
              className={`w-full flex items-center cursor-pointer gap-2 rounded px-5 py-2 transition-all duration-300 ${
                activeNav === "technical"
                  ? "bg-pink-600/20 border border-pink-500/40 text-pink-400"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <Code2 size={20} />
              <span className="font-semibold">
                Technical Questions
              </span>
            </button>

            <button
              onClick={() => setActiveNav("behavioral")}
              className={`w-full flex items-center cursor-pointer gap-2 rounded px-5 py-2 transition-all duration-300 ${
                activeNav === "behavioral"
                  ? "bg-pink-600/20 border border-pink-500/40 text-pink-400"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <MessageSquare size={15} />
              <span className="font-medium">
                Behavioral Questions
              </span>
            </button>

            <button
              onClick={() => setActiveNav("roadmap")}
              className={`w-full flex items-center cursor-pointer gap-2 rounded px-5 py-2 transition-all duration-300 ${
                activeNav === "roadmap"
                  ? "bg-pink-600/20 border border-pink-500/40 text-pink-400"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <Map size={20} />
              <span className="font-medium">
                Road Map
              </span>
            </button>

          </div>
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          <br /><br /><br /><br />
          <div className="justify-between ml-9">
            <button onClick={() => {getResumePdf(interviewId)}} className="button cursor-pointer">
              <FontAwesomeIcon icon={faCloudArrowDown} />
              Download Resume
            </button>
          </div>

        </aside>

        {/* ================= Main Area ================= */}

        <section className="flex-1 p-10">

          <div className="grid grid-cols-12 gap-8">

            {/* Left Content */}

            <div className="col-span-8">

              <div className="flex items-center gap-4 mb-8">

                <h1 className="text-2xl ml-3 font-bold">

                  {activeNav === "technical" &&
                    "Technical Questions"}

                  {activeNav === "behavioral" &&
                    "Behavioral Questions"}

                  {activeNav === "roadmap" &&
                    "Preparation Roadmap"}

                </h1>

                <span className="rounded bg-slate-800 px-4 py-1 text-sm text-slate-400">

                  {activeNav === "technical" &&
                    `${report.technicalQuestions.length} Questions`}

                  {activeNav === "behavioral" &&
                    `${report.behavioralQuestions.length} Questions`}

                  {activeNav === "roadmap" &&
                    `${report.preparationPlan.length} Days`}

                </span>

              </div>

              {/* ================= Technical Questions ================= */}

{activeNav === "technical" && (
  <div className="space-y-5">

    {report.technicalQuestions.map((item, index) => (

      <div
        key={index}
        className="rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-slate-800 overflow-hidden"
      >

        {/* Header */}

        <button
          onClick={() =>
            setOpenQuestion(
              openQuestion === index ? -1 : index
            )
          }
          className="w-full px-3 py-2 flex items-center justify-between hover:bg-slate-800/40 transition"
        >

          <div className="flex items-center gap-5">

            <div className="h-10 w-10 rounded-xl bg-slate-900/70 hover:bg-slate-800/40 flex items-center justify-center font-bold">

              {index + 1}.

            </div>

            <div className="text-left">

              <h3 className="font-semibold text-md">

                {item.question}

              </h3>

              <p className="text-sm text-slate-500 mt-1">

                Click to view answer

              </p>

            </div>

          </div>

          <ChevronRight
            size={24}
            className={`transition-transform duration-300 ${
              openQuestion === index
                ? "rotate-90 text-pink-400"
                : "text-slate-500"
            }`}
          />

        </button>

        {/* Body */}

        {openQuestion === index && (

          <div className="px-8 pb-8 border-t border-slate-800">

            {/* Interviewer Intention */}

            <div className="mt-6">

              <h4 className="text-pink-400 font-semibold mb-2">

                Intention

              </h4>
              <p className="text-slate-300 leading-7">
                {item.intention}
              </p>

            </div>

            {/* Suggested Answer */}

            <div className="mt-4">

              <h4 className="text-green-400 font-semibold mb-2">

                Answer

              </h4>

              <p className="text-slate-300 whitespace-pre-line leading-8">

                {item.answer}

              </p>

            </div>

          </div>

        )}

      </div>

    ))}

  </div>
)}

{/* ================= Behavioral Questions ================= */}

{activeNav === "behavioral" && (
  <div className="space-y-5">

    {report.behavioralQuestions.map((item, index) => (

      <div
        key={index}
        className="rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-slate-800 overflow-hidden"
      >

        {/* Header */}

        <button
          onClick={() =>
            setOpenBehavior(
              openBehavior === index ? -1 : index
            )
          }
          className="w-full px-6 py-2 flex justify-between items-center hover:bg-slate-800/40 transition"
        >

          <div className="flex items-center gap-5">

            <div className="h-10 w-10 rounded-xl bg-slate-900/70 hover:bg-slate-800/40 flex items-center justify-center font-bold">

              {index + 1}.

            </div>

            <div className="text-left">

              <h3 className="font-semibold text-md">

                {item.question}

              </h3>

              <p className="text-sm text-slate-500 mt-1">

                Click to view answer

              </p>

            </div>

          </div>

          <ChevronRight
            size={24}
            className={`transition-transform duration-300 ${
              openBehavior === index
                ? "rotate-90 text-blue-400"
                : "text-slate-500"
            }`}
          />

        </button>

        {/* Expanded */}

        {openBehavior === index && (

          <div className="px-4 pb-4 border-t border-slate-800">

            {/* Why interviewer asks */}

            <div className="mt-4">

              <h4 className="text-blue-400 font-semibold">

                Interviewer's Intention

              </h4>

              <p className="text-slate-300 leading-7">

                {item.intention}

              </p>

            </div>

            {/* STAR Answer */}

            <div className="mt-3">

              <h4 className="text-green-400 font-semibold">Answer</h4>

              <div className="rounded-xl bg-slate-900 p-1">

                <p className="text-slate-300 leading-8">

                  {item.answer}

                </p>

              </div>

            </div>

          </div>

        )}

      </div>

    ))}

  </div>
)}

{/* ================= Road Map ================= */}

{activeNav === "roadmap" && (
  <div className="space-y-6">

    {report.preparationPlan.map((day) => (

      <div
        key={day.day}
        className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl overflow-hidden"
      >

        {/* Header */}

        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800">

          <div>

            <h2 className="text-lg font-bold text-white">

              Day {day.day}

            </h2>

            <p className="text-slate-400 mt-1">

              {day.focus}

            </p>

          </div>

          <span className="rounded-full bg-pink-600/20 text-pink-400 border border-pink-500/30 px-4 py-2 text-sm font-medium">

            Focus Area

          </span>

        </div>

        {/* Tasks */}

        <div className="p-4">

          <h3 className="text-green-400 font-semibold mb-2">

            Tasks

          </h3>

          <div className="space-y-2">

            {day.tasks.map((task, index) => (

              <div
                key={index}
                className="flex items-start gap-2 rounded-lg bg-slate-900 p-2 hover:bg-slate-800 transition"
              >

                <div className="h-7 w-7 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold">

                  ✓

                </div>

                <p className="text-slate-300 leading-7">

                  {task}

                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

    ))}

  </div>
)}
</div>

            {/* ================= Right Side ================= */}

            <div className="col-span-4 space-y-6">
              {/* Match Score */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-4">
                <h2 className="text-lg font-semibold mb-2">
                  Match Score
                </h2>
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-35 h-35 rounded-full border-[12px] border-slate-700 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-[12px] border-green-500 rotate-0 border-4" />
                        <div className="text-center">
                          <h1 className="text-4xl font-bold text-green-400">{report.matchScore}%</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-slate-400 mt-6">Excellent profile match</p>
                </div>

              {/* Skill Gaps */}

              <div className="rounded-xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-4">

                <h2 className="text-2xl font-semibold mb-2">Skill Gaps</h2>

                <div className="space-y-2">

                  {report.skillGaps.map((skill, index) => (

                    <div
                      key={index}
                      className="flex items-center justify-between rounded-xl bg-slate-900 p-3"
                    >
                      <div>
                        <p className="font-normal">

                          {skill.skill}

                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${severityStyles[skill.severity]}`}>
                        {skill.severity}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
};

export default Interview
