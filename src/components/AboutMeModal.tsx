import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Mail, Linkedin, Globe, GraduationCap, Sparkles, 
  ArrowRight, Award, MapPin, Briefcase
} from "lucide-react";

interface AboutMeProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    fullName: string;
    brandName: string;
    roles: string[];
    bio: string;
    email: string;
    linkedin: string;
    behance: string;
    aboutImage?: string;
    aboutImageSecondary?: string;
  };
}

export default function AboutMeModal({ isOpen, onClose, profile }: AboutMeProps) {
  const [activeImgType, setActiveImgType] = React.useState<"primary" | "secondary">("primary");

  const aboutImg = profile.aboutImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop";
  const aboutImgSecondary = profile.aboutImageSecondary || "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056275/image_42_z0hjbd.png";
  const currentImg = activeImgType === "primary" ? aboutImg : aboutImgSecondary;

  const formattedRoles = profile.roles || [
    "Visual Designer",
    "AI Creative Designer",
    "Motion Designer",
    "Storyboard Artist"
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="about-me-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] flex items-center justify-center bg-neutral-950/90 backdrop-blur-lg p-4 md:p-6"
      >
        <motion.div
          id="about-me-container"
          initial={{ scale: 0.95, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="w-full max-w-5xl bg-neutral-900 rounded-3xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.8)] relative text-white border border-white/10 flex flex-col md:flex-row min-h-[500px] md:h-[620px]"
        >
          {/* Close Button */}
          <button
            id="close-about-btn"
            onClick={onClose}
            className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-black/60 hover:bg-white/10 text-white border border-white/10 transition-all backdrop-blur-md cursor-pointer"
            aria-label="Close About Section"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Left Column: Portrait and Big Title decoration */}
          <div className="w-full md:w-[40%] bg-neutral-950 relative overflow-hidden flex flex-col justify-between p-8 border-b md:border-b-0 md:border-r border-white/10 select-none">
            {/* Background image preview */}
            <div className="absolute inset-0 z-0">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImgType}
                  src={currentImg}
                  alt={profile.fullName}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 0.44, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="w-full h-full object-cover object-center grayscale"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
            </div>

            <div className="relative z-10 flex justify-between items-center w-full">
              <span className="text-[9px] font-sans font-bold uppercase tracking-[0.3em] text-[#FF6A00] bg-[#FF6A00]/10 px-2.5 py-1 rounded-full border border-[#FF6A00]/20 inline-block">
                PROFILE CARD
              </span>

              {/* Dynamic Switcher */}
              <div className="flex gap-1.5 bg-black/50 hover:bg-black/80 px-2.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md transition-all scale-100 hover:scale-105 active:scale-98">
                <button
                  type="button"
                  onClick={() => setActiveImgType("primary")}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    activeImgType === "primary" ? "bg-[#FF6A00] scale-125 shadow-[0_0_8px_#FF6A00]" : "bg-neutral-600 hover:bg-neutral-400"
                  }`}
                  aria-label="View portrait one"
                />
                <button
                  type="button"
                  onClick={() => setActiveImgType("secondary")}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    activeImgType === "secondary" ? "bg-[#FFB000] scale-125 shadow-[0_0_8px_#FFB000]" : "bg-neutral-600 hover:bg-neutral-400"
                  }`}
                  aria-label="View portrait two"
                />
              </div>
            </div>

            <div className="relative z-10 space-y-2 mt-auto">
              <h3 className="text-4xl font-black font-sans uppercase tracking-tight leading-none text-white">
                Suraj Kumar
              </h3>
              <p className="text-sm font-sans tracking-widest uppercase text-neutral-400 font-bold">
                {profile.brandName}
              </p>
              <div className="flex items-center gap-2 text-xs text-neutral-300 pt-1 font-mono">
                <MapPin className="h-3.5 w-3.5 text-neutral-500" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Biography, Roles & Credentials */}
          <div className="w-full md:w-[60%] p-6 sm:p-10 md:p-12 overflow-y-auto flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Badge */}
              <div className="flex items-center gap-1.5 text-[#FF6A00]">
                <Sparkles className="h-4 w-4" />
                <span className="text-[10px] uppercase font-sans tracking-[0.25em] font-bold text-neutral-300">
                  CREATIVE WORKFLOWS & PROFILE
                </span>
              </div>

              {/* Tagline */}
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight font-sans">
                Visual Designer & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] to-[#FFB000]">AI Creative Director</span>
              </h2>

              {/* Biography Paragraph (Inside modal as requested) */}
              <div className="space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed font-sans font-light tracking-wide">
                <p>{profile.bio}</p>
              </div>

              {/* Expanded Roles Caps */}
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400">Core Capabilities</h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formattedRoles.map((role) => (
                    <span
                      key={role}
                      className="px-3 py-1 bg-white/5 text-neutral-200 hover:bg-white/10 text-[9px] font-sans font-medium uppercase tracking-widest rounded-full transition-all border border-white/10"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education Snippet */}
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400">Education Context</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex gap-2.5 items-start p-3 rounded-xl bg-white/5 border border-white/5">
                    <GraduationCap className="h-5 w-5 text-[#FF6A00] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-neutral-200">M.Des. Communication</h4>
                      <p className="text-[10px] text-neutral-400">IDC, IIT Bombay</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5 items-start p-3 rounded-xl bg-white/5 border border-white/5">
                    <GraduationCap className="h-5 w-5 text-[#FFB000] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-neutral-200">B.F.A. Visual Comm</h4>
                      <p className="text-[10px] text-neutral-400">College of Art, Delhi University</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom: Close Button and Social Links */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="p-2 border border-white/15 rounded-full bg-white/5 hover:bg-[#FF6A00]/20 hover:border-[#FF6A00] text-neutral-300 hover:text-white transition-all hover:scale-105"
                  title="Send Mail"
                >
                  <Mail className="h-4 w-4" />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-white/15 rounded-full bg-white/5 hover:bg-[#FF6A00]/20 hover:border-[#FF6A00] text-neutral-300 hover:text-white transition-all hover:scale-105"
                  title="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href={profile.behance}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-white/15 rounded-full bg-white/5 hover:bg-[#FF6A00]/20 hover:border-[#FF6A00] text-neutral-300 hover:text-white transition-all hover:scale-105"
                  title="Behance"
                >
                  <Globe className="h-4 w-4" />
                </a>
              </div>

              <button
                id="modal-close-action-btn"
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-[10px] uppercase font-sans font-bold tracking-widest flex items-center justify-center gap-1.5 cursor-pointer transition-all scale-100 active:scale-95 shadow-lg"
              >
                <span>Close Window</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
