import React from "react";
import { ArrowUpRight, FileText, ArrowRight, BookOpen, Briefcase, Award } from "lucide-react";
import { education, experience, skills, software } from "../portfolioData";

interface ResumeProps {
  onResumeClick: () => void;
}

export default function Resume({ onResumeClick }: ResumeProps) {
  return (
    <section 
      id="full-resume" 
      className="relative min-h-screen bg-white text-neutral-950 font-sans select-none border-t border-neutral-200 overflow-hidden"
    >
      {/* Outer Editorial Container - Swiss Grid Layout */}
      <div className="w-full mx-auto max-w-[1881px] px-6 md:px-12 py-12 flex flex-col">
        
        {/* ROW 1: Top Navigation Style Bar (Divided by borders) */}
        <div className="grid grid-cols-2 md:grid-cols-12 border-t border-b border-neutral-250 py-3 text-[10px] uppercase tracking-wider font-semibold text-neutral-500">
          <div className="col-span-1 md:col-span-3 flex items-center md:border-r border-neutral-200 pr-4">
            <span className="text-neutral-400">CREDENTIALS / TRACK.02</span>
          </div>
          <div className="col-span-1 md:col-span-2 hidden md:flex items-center border-r border-neutral-200 px-4">
            <span className="text-neutral-900 font-bold">PROFESSIONAL FILE</span>
          </div>
          <div className="col-span-1 md:col-span-2 hidden md:flex items-center border-r border-neutral-200 px-4">
            <span className="hover:text-neutral-900 transition-colors">ACADEMICS & ROLES</span>
          </div>
          <div className="col-span-1 md:col-span-2 flex items-center justify-end md:justify-start md:border-r border-neutral-200 px-2 md:px-4 text-right md:text-left truncate">
            <span className="text-neutral-400 font-mono">M.DES (IIT BOMBAY)</span>
          </div>
          <div className="col-span-1 md:col-span-2 hidden md:flex items-center px-4">
            <span>CURRICULUM VITAE</span>
          </div>
          <div className="col-span-1 md:col-span-1 flex items-center justify-end font-normal">
            <span className="text-[14px] leading-none">☰</span>
          </div>
        </div>

        {/* ROW 2: Mega Typography Logo & Intro Description Column Span */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-neutral-250 py-8 md:py-12 items-baseline gap-6 md:gap-0">
          {/* Main Huge Aesthetic Brand Title - Astera style */}
          <div className="col-span-1 md:col-span-6 pr-4">
            <h1 className="text-[12vw] md:text-[8vw] font-normal tracking-tight text-neutral-800 font-sans leading-none">
              Credentials
            </h1>
          </div>

          {/* Mini Grey Bio Paragraph Block */}
          <div className="col-span-1 md:col-span-3 md:border-l border-neutral-200 md:px-6 space-y-2">
            <p className="text-[10px] text-neutral-400 leading-relaxed uppercase tracking-wide select-none">
              Institutional records of educational achievements, collaborative roles, and graphic capabilities spanning design ecosystems across ShareChat, Moj, Radiation Education, and Physics Wallah.
            </p>
          </div>

          {/* Roles Metadata Block */}
          <div className="col-span-1 md:col-span-2 md:border-l border-neutral-200 md:px-6 text-[10px] uppercase font-semibold text-neutral-500 space-y-1">
            <div className="text-neutral-900 font-bold">EXPERIENCE MATRIX</div>
            <div>AI Visual Prototyping</div>
            <div>Full Brand Design Systems</div>
          </div>

          {/* Country Location / Year Info */}
          <div className="col-span-1 md:col-span-1 md:border-l border-neutral-200 md:px-6 text-[10px] uppercase font-semibold text-neutral-500">
          </div>
        </div>

        {/* ROW 3: Bottom Grid Splits - Education, Experience, Skills list in Swiss Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px] md:min-h-[520px]">
          
          {/* Left Column: Academic & Experience Timeline */}
          <div className="col-span-1 md:col-span-6 border-b md:border-b-0 md:border-r border-neutral-250 py-8 md:pt-8 md:pb-0 md:pr-8 flex flex-col justify-between">
            <div className="space-y-10">
              
              {/* Education section */}
              <div>
                <div className="flex items-center gap-2 mb-6 text-[10px] uppercase tracking-widest font-extrabold text-[#FF6A00]">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Academic Qualifications</span>
                </div>
                <div className="border-t border-neutral-200 divide-y divide-neutral-200">
                  {education.map((edu, idx) => (
                    <div key={idx} className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 text-neutral-900">
                      <div className="col-span-5 text-xs font-bold uppercase tracking-tight font-sans">
                        {edu.degree}
                      </div>
                      <div className="col-span-7 text-xs text-neutral-500 uppercase tracking-wider text-left sm:text-right">
                        {edu.institution}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience section */}
              <div>
                <div className="flex items-center gap-2 mb-6 text-[10px] uppercase tracking-widest font-extrabold text-[#FF6A00]">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Professional Track</span>
                </div>
                <div className="border-t border-neutral-200 divide-y divide-neutral-200">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 text-neutral-900">
                      <div className="col-span-5 text-xs font-bold uppercase tracking-tight font-sans">
                        {exp.role}
                      </div>
                      <div className="col-span-7 text-xs text-neutral-500 uppercase tracking-wider text-left sm:text-right">
                        {exp.company}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom note */}
            <div className="pt-6 border-t border-neutral-200">
              <p className="text-[10px] text-neutral-400 uppercase tracking-wide">
                All roles require precise tactical creative thinking, visual execution under dense project requirements, and constant integration of advanced design tools.
              </p>
            </div>
          </div>

          {/* Right Column: Expertises, Tool Stacks, and Interactive CV Button */}
          <div className="col-span-1 md:col-span-6 py-8 md:py-8 md:pl-8 flex flex-col justify-between gap-8 h-full">
            
            {/* Competency & Software Sets */}
            <div className="space-y-8">
              
              {/* Creative Skills set */}
              <div>
                <div className="flex items-center gap-2 mb-4 text-[10px] uppercase tracking-widest font-extrabold text-[#FF6A00]">
                  <Award className="h-3.5 w-3.5" />
                  <span>Core Visual Competencies</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 border border-neutral-200 text-[10px] uppercase font-bold tracking-wider text-neutral-700 bg-neutral-50 hover:border-neutral-900 hover:bg-neutral-950 hover:text-white transition-all rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Software Tool set */}
              <div>
                <div className="text-[10px] uppercase tracking-widest font-extrabold text-neutral-400 mb-4">
                  Digital Software Fluency
                </div>
                <div className="flex flex-wrap gap-2">
                  {software.map((sw, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 border border-[#FF6A00]/20 text-[10px] uppercase font-semibold tracking-wider text-[#FF6A00] bg-[#FF6A00]/5 hover:bg-[#FF6A00]/10 transition-all rounded"
                    >
                      {sw}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* CTA Option Block */}
            <div className="space-y-6 pt-6 border-t border-neutral-200">
              <h2 className="text-xl md:text-2xl font-normal leading-snug text-neutral-800 tracking-tight max-w-md font-sans">
                Access the complete curated interactive index or digital dossier.
              </h2>
              
              {/* Action Buttons to replicate layout */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  onClick={onResumeClick}
                  className="px-8 py-3.5 rounded-full border border-neutral-900 bg-neutral-950 text-white text-[10px] uppercase font-bold tracking-widest hover:bg-neutral-900 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>OPEN INTERACTIVE CV</span>
                </button>
              </div>
            </div>

            {/* Footer Row of the grid carrying links */}
            <div className="border-t border-neutral-200 pt-6 flex items-center justify-between text-[10px] uppercase tracking-wider font-semibold text-neutral-500">
              <div className="flex items-center gap-4">
                <span className="text-neutral-400">DESIGN DIRECTIVES</span>
                <span className="text-neutral-300">|</span>
                <span className="text-neutral-900 font-bold">ACTIVE PROTOCOLS</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Sideways Vertical Right Ribbons */}
      <div className="absolute top-12 bottom-12 right-4 hidden xl:flex flex-col justify-between items-center z-10 select-none pointer-events-none text-neutral-400">
        <span className="whitespace-nowrap select-none text-[8px] uppercase tracking-[0.3em] font-sans font-bold origin-center rotate-90 translate-y-16">
          IN THE MOVE WITH THE FUTURE.
        </span>
        <span className="font-mono text-[9px] uppercase font-bold tracking-wider origin-center rotate-90 -translate-y-8">
          TRACKING ID: PRF-997
        </span>
      </div>

    </section>
  );
}
