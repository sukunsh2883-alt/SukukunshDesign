import { Mail, Linkedin } from "lucide-react";

interface FooterProps {
  profile: any;
}

export default function Footer({ profile }: FooterProps) {
  return (
    <footer id="contact" className="relative bg-[#869e57] px-8 py-20 text-[#1d1e1e] md:px-16 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        {/* Main Grid: Left side has contact header + main heading + copy, right side has Sukunsh. + contact links */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1px_1rem_1fr] gap-x-12 gap-y-16 items-start md:items-stretch">
          
          {/* Left Column */}
          <div className="flex flex-col justify-between h-full space-y-12 md:space-y-0">
            <div>
              <span className="block text-lg font-light lowercase tracking-wider text-[#1d1e1e] mb-5">
                contact
              </span>
              <h2 className="text-4xl sm:text-[44px] md:text-[54px] font-bold leading-[1.1] tracking-[-0.025em] text-[#1d1e1e] max-w-xl">
                Available for<br className="hidden sm:inline" /> visual design work.
              </h2>
            </div>
            
            <p className="text-xs sm:text-sm tracking-wide text-[#1d1e1e]/80 font-medium">
              2026 © Sukunsh. All rights reserved
            </p>
          </div>

          {/* Center Line Divider (visible only on desktop) */}
          <div className="hidden md:block w-[1.5px] bg-[#1d1e1e]/30 self-stretch my-1" />
          <div className="hidden md:block" /> {/* Dummy spacer for col gap */}

          {/* Right Column */}
          <div className="flex flex-col justify-center h-full py-1">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1d1e1e] mb-8">
              Sukunsh.
            </h3>
            
            {/* Custom styled contact links */}
            <div className="flex flex-col gap-5 text-sm sm:text-base md:text-lg text-[#1d1e1e] font-medium">
              {/* Email */}
              <a 
                href={`mailto:${profile?.email || "sukunsh2883@gmail.com"}`}
                className="flex items-center gap-3.5 hover:opacity-75 transition-all duration-200 group"
              >
                <Mail className="w-5 h-5 flex-shrink-0 stroke-[1.5]" />
                <span className="border-b border-transparent group-hover:border-[#1d1e1e] pb-0.5">
                  {profile?.email || "sukunsh2883@gmail.com"}
                </span>
              </a>

              {/* LinkedIn */}
              <a 
                href={profile?.linkedin || "https://www.linkedin.com/in/sukunsh"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3.5 hover:opacity-75 transition-all duration-200 group"
              >
                <Linkedin className="w-5 h-5 flex-shrink-0 stroke-[1.5]" />
                <span className="border-b border-transparent group-hover:border-[#1d1e1e] pb-0.5">LinkedIn</span>
              </a>

              {/* Behance */}
              <a 
                href={profile?.behance || "https://www.behance.net/sukunshsharma"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3.5 hover:opacity-75 transition-all duration-200 group"
              >
                <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center font-bold text-base leading-none select-none tracking-tighter">
                  Bē
                </span>
                <span className="border-b border-transparent group-hover:border-[#1d1e1e] pb-0.5">Behance</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
