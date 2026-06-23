import React from "react";

interface NavbarProps {
  activeSection: string;
  profile?: any;
  onOpenProjects?: () => void;
  onOpenAIWork?: () => void;
  onOpenResume?: () => void;
  onOpenAboutMe?: () => void;
  onOpenGitHub?: () => void;
  onNavigate?: (targetId: string) => void;
}

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#scroll-demo" },
  { label: "GitHub", href: "#github" },
  { label: "Hire me", href: "#contact" },
];

export default function Navbar({ profile, onNavigate, onOpenProjects, onOpenAIWork, onOpenGitHub }: NavbarProps) {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    if (onNavigate) {
      onNavigate(href);
      return;
    }

    if (href === "#projects" && onOpenProjects) {
      onOpenProjects();
      return;
    }

    if (href === "#showreel" && onOpenAIWork) {
      onOpenAIWork();
      return;
    }

    if (href === "#github" && onOpenGitHub) {
      onOpenGitHub();
      return;
    }

    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="navbar fixed inset-x-0 top-0 z-[150] bg-[#050505] text-white">
      <nav className="mx-auto flex h-14 max-w-[1520px] items-center justify-between px-6 text-sm md:px-8">
        <button
          onClick={() => onNavigate?.("#about-me-modal")}
          className="logo text-xl font-semibold tracking-[-0.04em] text-white"
        >
          {profile?.brandName || "Sukunsh"}.
        </button>

        <div className="nav-links flex items-center gap-5 text-white/86 md:gap-7">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
