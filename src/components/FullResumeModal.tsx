import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Briefcase, GraduationCap, Laptop, BadgeCheck, FileText, 
  MapPin, Phone, Mail, Linkedin, Globe, Award, Heart, Printer, Copy, Check 
} from "lucide-react";

interface FullResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FullResumeModal({ isOpen, onClose }: FullResumeModalProps) {
  const [copied, setCopied] = React.useState(false);

  // Resume specs from Suraj Kumar Sharma's official CV
  const resumeDetails = {
    name: "SURAJ KUMAR SHARMA",
    title: "Visual Designer | AI Creative Designer",
    tagline: "Bridging human artistic vision with emerging generative AI technologies.",
    contact: {
      phone: "+91 9968849327",
      email: "sukunsh2883@gmail.com",
      linkedin: "www.linkedin.com/in/sukunsh",
      behance: "www.behance.net/sukunshsharma",
      location: "Mumbai / Delhi, India"
    },
    summary: "Creative Visual Designer with strong expertise in branding, motion graphics, UI design, and AI-assisted creative workflows. Passionate about transforming complex ideas into engaging visual experiences through storytelling, typography, and emerging technologies. Skilled in creating impactful designs that enhance user engagement, brand clarity, and product experience.",
    skills: {
      design: [
        "Branding & Logo Design", "Visual Design", "UI/UX Design", 
        "Typographic Design", "Illustration (2D & 3D)", "Storyboarding", 
        "Packaging Design", "Publication Design"
      ],
      motion: [
        "Motion Graphics", "Video Editing", "2D Animation", 
        "Cinematography", "Sound Design"
      ],
      ai: [
        "AI Image & Video Generation", "Prompt Design & Optimization", 
        "Rapid Visual Prototyping", "Generative Workflow Design"
      ]
    },
    experience: [
      {
        role: "AI Visual Design Intern",
        company: "ShareChat & Moj",
        duration: "Sept 2025 - Mar 2026",
        highlights: [
          "Designed AI-powered virtual gifts and customized digital collectibles.",
          "Created AI-generated UI assets & interactive tactile elements.",
          "Worked on event branding campaigns & edited the internal creative handbook.",
          "Integrated generative AI algorithms into active production design pipelines."
        ]
      },
      {
        role: "Graphic Designer (Freelance)",
        company: "Physics Wallah",
        duration: "Feb 2023 - May 2023",
        highlights: [
          "Designed highly engaging marketing creatives and advertising visual assets.",
          "Crafted branded social media post designs targeting major digital channels."
        ]
      },
      {
        role: "Graphic Designer & Video Editor",
        company: "Radiation Education",
        duration: "May 2021 - Nov 2022",
        highlights: [
          "Designed key marketing tools including posters, banners, and digital flyers.",
          "Performed professional educational video editing with clear visual flow.",
          "Co-designed Aftershock earthquake simulation board game assets."
        ]
      }
    ],
    academicProjects: [
      {
        title: "Aftershock: Escape the Quake",
        context: "Academic Dissertation Project",
        description: "Co-designed a comprehensive tabletop board game simulating complex earthquake evacuation and disaster pedagogies. Focused heavily on high-density strategy maps, emergency rules layouts, and typographic action cards to enable rapid, interactive engagement."
      },
      {
        title: "Welcome Card Design",
        context: "IDC, IIT Bombay",
        description: "Designed, layered, and screen-printed highly tactical welcome cards and premium children's book layouts using specialized Risography duplicator stencils and ink separations."
      },
      {
        title: "Typographic Children’s Book",
        context: "Core Typography Exploration",
        description: "Established a tactile storytelling publication design where expressive, scaled, and baseline-shifted typography completely replaces traditional pictorial illustrations to visually communicate emotion and pace."
      }
    ],
    education: [
      {
        degree: "M.Des. in Communication Design",
        institution: "Industrial Design Centre (IDC), IIT Bombay",
        year: "Class of 2025",
        score: "CPI: 8.39"
      },
      {
        degree: "B.F.A. in Visual Communication",
        institution: "College of Art, Delhi University",
        year: "Class of 2022",
        score: "76.70%"
      }
    ],
    software: [
      "Photoshop", "Illustrator", "Figma", "After Effects", 
      "Premiere Pro", "Lightroom", "Animate", "Autodesk Maya", "Procreate"
    ],
    awards: [
      {
        title: "Outstanding Contribution in Cultural Activities",
        organizer: "Hostel 18, IIT Bombay",
        duration: "2023 - 2024"
      }
    ],
    responsibilities: [
      {
        role: "Teaching Assistant",
        institution: "Industrial Design Centre (IDC), IIT Bombay",
        details: "Assisted Prof. Swati Agarwal with academic coordination, lecture administration, and student portfolio mentoring."
      }
    ]
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(resumeDetails.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-start md:items-center justify-center bg-black/80 backdrop-blur-md p-4 pt-24 md:pt-24 overflow-y-auto print:bg-white print:p-0"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ duration: 0.4 }}
          className="relative bg-white text-neutral-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh] print:max-h-full print:my-0 print:rounded-none print:shadow-none"
        >
          {/* Header Action Controls */}
          <div className="flex items-center justify-between border-b border-neutral-200 px-8 py-4 bg-neutral-50 shrink-0 print:hidden">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-neutral-600">
              <FileText className="w-4 h-4 text-[#FF6A00]" />
              <span>Suraj Kumar Sharma Curriculum Vitae</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-sans text-neutral-600 cursor-pointer transition-colors"
                title="Copy Email to Clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Email"}</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-sans text-neutral-600 cursor-pointer transition-colors"
                title="Print / Save PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-600 cursor-pointer transition-colors"
                aria-label="Close Resume"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Resume Sheet */}
          <div className="flex-grow p-8 sm:p-12 overflow-y-auto select-text print:p-0 print:overflow-visible">
            
            {/* Name and Header Block */}
            <div className="border-b-2 border-neutral-900 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-sans font-bold tracking-tight text-neutral-950">
                  {resumeDetails.name}
                </h1>
                <p className="text-lg text-[#FF6A00] font-sans uppercase tracking-widest font-semibold mt-1">
                  {resumeDetails.title}
                </p>
                <p className="text-xs text-neutral-500 font-sans italic mt-1 font-medium">
                  {resumeDetails.tagline}
                </p>
              </div>
              
              {/* Quick Contact Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 text-xs font-mono font-medium text-neutral-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{resumeDetails.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <a href={`mailto:${resumeDetails.contact.email}`} className="hover:text-black hover:underline">{resumeDetails.contact.email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <a href="https://linkedin.com/in/sukunsh" target="_blank" rel="noreferrer" className="hover:text-black hover:underline">{resumeDetails.contact.linkedin}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <a href="https://www.behance.net/sukunshsharma" target="_blank" rel="noreferrer" className="hover:text-black hover:underline">{resumeDetails.contact.behance}</a>
                </div>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="mb-10">
              <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 font-semibold mb-3 border-b border-neutral-100 pb-1.5">
                Professional Blueprint
              </h2>
              <p className="text-sm font-sans tracking-wide leading-relaxed text-neutral-800">
                {resumeDetails.summary}
              </p>
            </div>

            {/* Core Section Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left Main Stream: Experience & Projects (8 cols) */}
              <div className="lg:col-span-8 space-y-10">
                
                {/* Work Experience */}
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 font-semibold mb-6 border-b border-neutral-100 pb-1.5 flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-[#FF6A00]" /> Working Experience
                  </h2>
                  <div className="space-y-8">
                    {resumeDetails.experience.map((exp, expIdx) => (
                      <div key={expIdx} className="relative pl-6 border-l border-neutral-200">
                        {/* Timeline Node dot */}
                        <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2 border-white bg-[#FF6A00]" />
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                          <h3 className="text-base font-sans font-bold text-neutral-950">
                            {exp.role}
                          </h3>
                          <span className="text-xs font-mono text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                            {exp.duration}
                          </span>
                        </div>
                        <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-700 font-semibold mb-3">
                          {exp.company}
                        </h4>
                        <ul className="space-y-1.5 text-xs font-sans tracking-wide leading-relaxed text-neutral-600 list-disc pl-4">
                          {exp.highlights.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Academic Projects */}
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 font-semibold mb-6 border-b border-neutral-100 pb-1.5 flex items-center gap-2">
                    <Laptop className="w-3.5 h-3.5 text-[#FF6A00]" /> Academic Projects & Research
                  </h2>
                  <div className="space-y-6">
                    {resumeDetails.academicProjects.map((proj, projIdx) => (
                      <div key={projIdx} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-150">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <h3 className="text-sm font-sans font-bold text-neutral-950">
                            {proj.title}
                          </h3>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF6A00] font-semibold">
                            {proj.context}
                          </span>
                        </div>
                        <p className="text-xs font-sans tracking-wide leading-relaxed text-neutral-600">
                          {proj.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Side Column: Educational Credentials & Skills Mapping (4 cols) */}
              <div className="lg:col-span-4 space-y-10">
                
                {/* Educational Qualifications */}
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 font-semibold mb-6 border-b border-neutral-100 pb-1.5 flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-[#FF6A00]" /> Education
                  </h2>
                  <div className="space-y-6">
                    {resumeDetails.education.map((edu, eduIdx) => (
                      <div key={eduIdx} className="space-y-1">
                        <h3 className="text-xs font-sans font-bold text-neutral-950">
                          {edu.degree}
                        </h3>
                        <p className="text-xs text-[#FF6A00] font-sans font-medium">
                          {edu.institution}
                        </p>
                        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-0.5">
                          <span>{edu.year}</span>
                          <span className="font-semibold text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded">{edu.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Professional Skills */}
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 font-semibold mb-6 border-b border-neutral-100 pb-1.5 flex items-center gap-2">
                    <BadgeCheck className="w-3.5 h-3.5 text-[#FF6A00]" /> Skills Matrix
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                        Design &amp; Creative
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {resumeDetails.skills.design.map((skill, idx) => (
                          <span key={idx} className="text-[9px] font-sans font-medium px-2 py-0.5 border border-neutral-200 bg-neutral-50 rounded text-neutral-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                        Motion &amp; Media
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {resumeDetails.skills.motion.map((skill, idx) => (
                          <span key={idx} className="text-[9px] font-sans font-medium px-2 py-0.5 border border-neutral-205 bg-neutral-50 rounded text-neutral-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                        AI &amp; Generative
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {resumeDetails.skills.ai.map((skill, idx) => (
                          <span key={idx} className="text-[9px] font-sans font-medium px-2 py-0.5 border border-[#FF6A00]/25 bg-[#FF6A00]/5 text-[#FF6A00] rounded font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Software Mastery */}
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 font-semibold mb-4 border-b border-neutral-100 pb-1.5 flex items-center gap-2">
                    <Laptop className="w-3.5 h-3.5 text-[#FF6A00]" /> Software Suite
                  </h2>
                  <div className="flex flex-wrap gap-1">
                    {resumeDetails.software.map((sw, idx) => (
                      <span key={idx} className="text-[9px] font-mono px-2 py-0.5 border border-neutral-200 bg-neutral-100 rounded text-neutral-800">
                        {sw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Honorary Awards */}
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 font-semibold mb-4 border-b border-neutral-100 pb-1.5 flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-[#FF6A00]" /> Appreciations
                  </h2>
                  {resumeDetails.awards.map((award, idx) => (
                    <div key={idx} className="text-xs font-sans">
                      <h4 className="font-bold text-neutral-900 leading-snug">{award.title}</h4>
                      <p className="text-neutral-500 text-[10px] font-mono mt-0.5">{award.organizer} | {award.duration}</p>
                    </div>
                  ))}
                </div>

                {/* Roles of Responsibility */}
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 font-semibold mb-4 border-b border-neutral-100 pb-1.5 flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-[#FF6A00]" /> Responsibilities
                  </h2>
                  {resumeDetails.responsibilities.map((resp, idx) => (
                    <div key={idx} className="text-xs font-sans space-y-0.5">
                      <h4 className="font-bold text-neutral-900">{resp.role}</h4>
                      <p className="text-neutral-500 font-mono text-[10px]">{resp.institution}</p>
                      <p className="text-neutral-600 text-[11px] leading-relaxed pt-1">{resp.details}</p>
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
