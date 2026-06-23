import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Github, 
  X, 
  ExternalLink, 
  Star, 
  GitFork, 
  Clock, 
  Search, 
  Filter, 
  LogOut, 
  RefreshCw, 
  Copy, 
  Check, 
  ChevronRight, 
  ArrowLeft, 
  Lock, 
  Unlock,
  AlertCircle
} from "lucide-react";

// Standard GitHub language colors
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  C: "#555555",
  "C++": "#f34b7d",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Shell: "#89e051",
  Vue: "#41b883",
  React: "#61dafb",
  Svelte: "#ff3e00",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB"
};

interface GitHubExplorerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GitHubProfile {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  location?: string;
  company?: string;
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string;
  private: boolean;
  updated_at: string;
  pushed_at: string;
  size: number;
}

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author: {
    avatar_url: string;
    login: string;
  } | null;
}

export default function GitHubExplorer({ isOpen, onClose }: GitHubExplorerProps) {
  const [config, setConfig] = useState<{ configured: boolean; authenticated: boolean; clientId: string | null } | null>(null);
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Repo view details
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [languages, setLanguages] = useState<Record<string, number>>({});
  const [loadingRepoDetails, setLoadingRepoDetails] = useState<boolean>(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [sortBy, setSortBy] = useState<"updated" | "stars" | "name">("updated");

  // Copy state for instructions
  const [copiedDevUrl, setCopiedDevUrl] = useState(false);
  const [copiedSharedUrl, setCopiedSharedUrl] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Hardcoded URLs based on workspace configuration
  const devCallbackUrl = "https://ais-dev-b4zfs4435g3gge6l5tcgbv-515409363062.asia-east1.run.app/auth/callback";
  const sharedCallbackUrl = "https://ais-pre-b4zfs4435g3gge6l5tcgbv-515409363062.asia-east1.run.app/auth/callback";

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/github/config");
      const data = await res.json();
      setConfig(data);
      
      if (data.authenticated) {
        await fetchProfileAndRepos();
      } else {
        setLoading(false);
      }
    } catch (err: any) {
      setError("Failed to reach integration server. Please make sure the backend is active.");
      setLoading(false);
    }
  };

  const fetchProfileAndRepos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch profile
      const profileRes = await fetch("/api/github/profile");
      if (!profileRes.ok) {
        if (profileRes.status === 401) {
          setConfig(prev => prev ? { ...prev, authenticated: false } : null);
          setLoading(false);
          return;
        }
        throw new Error("Failed to load GitHub profile.");
      }
      const profileData = await profileRes.json();
      setProfile(profileData);

      // Fetch repos
      const reposRes = await fetch("/api/github/repos");
      if (reposRes.ok) {
        const reposData = await reposRes.json();
        setRepos(Array.isArray(reposData) ? reposData : []);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading GitHub data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRepoDetails = async (repo: Repository) => {
    try {
      setLoadingRepoDetails(true);
      setCommits([]);
      setLanguages({});
      
      const [commitsRes, langRes] = await Promise.all([
        fetch(`/api/github/repos/${repo.full_name}/commits`),
        fetch(`/api/github/repos/${repo.full_name}/languages`)
      ]);

      if (commitsRes.ok) {
        const commitsData = await commitsRes.json();
        setCommits(Array.isArray(commitsData) ? commitsData : []);
      }
      if (langRes.ok) {
        const langData = await langRes.json();
        setLanguages(langData);
      }
    } catch (err) {
      console.error("Failed to load repository details", err);
    } finally {
      setLoadingRepoDetails(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  // Handle successful login notification from popup window
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      // Security check
      const origin = event.origin;
      if (!origin.endsWith(".run.app") && !origin.includes("localhost")) {
        return;
      }

      if (event.data?.type === "OAUTH_AUTH_SUCCESS") {
        fetchStatus();
      } else if (event.data?.type === "OAUTH_AUTH_ERROR") {
        setError(event.data.error || "OAuth login failed");
      }
    };

    window.addEventListener("message", handleOAuthMessage);
    return () => window.removeEventListener("message", handleOAuthMessage);
  }, []);

  const handleConnect = async () => {
    try {
      setError(null);
      const res = await fetch("/api/auth/github/url");
      if (!res.ok) {
        throw new Error("Unable to retrieve OAuth authorization URL.");
      }
      const { url } = await res.json();
      
      // Open popup directly with Github Authorize Endpoint
      const authWindow = window.open(
        url,
        "github_oauth_popup",
        "width=600,height=750,location=no,toolbar=no,menubar=no"
      );

      if (!authWindow) {
        setError("Popup blocker active. Please allow popups to log in with GitHub.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to start GitHub login.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/github/logout", { method: "POST" });
      setProfile(null);
      setRepos([]);
      setSelectedRepo(null);
      setConfig(prev => prev ? { ...prev, authenticated: false } : null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleCopy = (text: string, type: "dev" | "shared") => {
    navigator.clipboard.writeText(text);
    if (type === "dev") {
      setCopiedDevUrl(true);
      setTimeout(() => setCopiedDevUrl(false), 2000);
    } else {
      setCopiedSharedUrl(true);
      setTimeout(() => setCopiedSharedUrl(false), 2000);
    }
  };

  const handleSelectRepo = (repo: Repository) => {
    setSelectedRepo(repo);
    fetchRepoDetails(repo);
  };

  // Extract unique languages for filter dropdown
  const uniqueLanguages = ["all", ...new Set(repos.map(r => r.language).filter(Boolean))];

  // Filtering and Sorting repositories list
  const filteredRepos = repos
    .filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesLanguage = filterLanguage === "all" || repo.language === filterLanguage;
      return matchesSearch && matchesLanguage;
    })
    .sort((a, b) => {
      if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return new Date(b.pushed_at || b.updated_at).getTime() - new Date(a.pushed_at || a.updated_at).getTime();
    });

  // Calculate languages percentage for details display
  const totalLangBytes = Object.values(languages).reduce((sum: number, val) => sum + (val as number), 0) as number;

  const getRelativeTime = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed inset-0 z-[200] flex flex-col overflow-y-auto bg-neutral-950 text-neutral-200"
      >
        {/* Navigation / Header bar */}
        <header className="sticky top-0 z-[210] flex h-16 items-center justify-between border-b border-neutral-900 bg-neutral-950/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Github className="h-6 w-6 text-white" />
            <span className="font-sans text-lg font-medium tracking-tight text-white">GitHub Explorer</span>
            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-400">Live</span>
          </div>

          <button
            onClick={onClose}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-neutral-800 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
            aria-label="Close Explorer"
          >
            <X className="h-5 w-5 text-neutral-400 transition-transform group-hover:scale-110 group-hover:text-white" />
          </button>
        </header>

        {/* Content Body */}
        <div className="mx-auto flex w-full max-w-7xl flex-grow flex-col p-6 md:p-10">
          
          {loading ? (
            <div className="flex flex-grow flex-col items-center justify-center py-20">
              <RefreshCw className="h-8 w-8 animate-spin text-neutral-500" />
              <p className="mt-4 font-mono text-xs text-neutral-500 uppercase tracking-widest">Sourcing Live GitHub Feed...</p>
            </div>
          ) : error && !config?.authenticated ? (
            <div className="mx-auto max-w-md rounded-2xl border border-red-900/40 bg-red-950/15 p-6 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
              <h3 className="mt-4 text-base font-medium text-white">Integration Error</h3>
              <p className="mt-2 text-sm text-neutral-400">{error}</p>
              <button 
                onClick={fetchStatus}
                className="mt-6 rounded-lg bg-white px-4 py-2 font-sans text-xs font-semibold text-neutral-950 transition-transform hover:scale-[1.02]"
              >
                Retry Request
              </button>
            </div>
          ) : config && !config.configured ? (
            /* ONBOARDING INSTRUCTION SCREEN (Unconfigured Applet state) */
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-2xl py-8"
            >
              <div className="rounded-3xl border border-neutral-900 bg-neutral-900/30 p-8 md:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white">
                  <Github className="h-6 w-6" />
                </div>
                
                <h2 className="mt-6 font-sans text-2xl font-semibold tracking-tight text-white">
                  Real-time GitHub Configuration Required
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                  Secure your personal credentials using GitHub OAuth. Follow these simple steps to configure variables inside AI Studio.
                </p>

                <div className="mt-8 space-y-6">
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-800 font-mono text-xs font-bold text-neutral-300">1</span>
                    <div>
                      <h4 className="font-sans text-sm font-semibold text-white">Register a GitHub Developer Application</h4>
                      <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                        Navigate to your <a href="https://github.com/settings/developers" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-neutral-300">GitHub Developer Dashboard</a> and register a new OAuth App.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-800 font-mono text-xs font-bold text-neutral-300">2</span>
                    <div className="w-full">
                      <h4 className="font-sans text-sm font-semibold text-white">Set authorization callback URLs</h4>
                      <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                        Copy and configure the exact callback URLs in GitHub OAuth Settings:
                      </p>

                      <div className="mt-3 space-y-2">
                        {/* Development Callback */}
                        <div className="flex items-center justify-between gap-3 rounded-lg bg-neutral-950 p-2.5 font-mono text-[11px]">
                          <span className="text-neutral-500 truncate mr-2">Dev Callback: <span className="text-neutral-300">{devCallbackUrl}</span></span>
                          <button
                            onClick={() => handleCopy(devCallbackUrl, "dev")}
                            className="flex h-7 w-7 items-center justify-center rounded bg-neutral-900 text-neutral-400 hover:text-white"
                          >
                            {copiedDevUrl ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>

                        {/* Shared Callback */}
                        <div className="flex items-center justify-between gap-3 rounded-lg bg-neutral-950 p-2.5 font-mono text-[11px]">
                          <span className="text-neutral-500 truncate mr-2">Shared Callback: <span className="text-neutral-300">{sharedCallbackUrl}</span></span>
                          <button
                            onClick={() => handleCopy(sharedCallbackUrl, "shared")}
                            className="flex h-7 w-7 items-center justify-center rounded bg-neutral-900 text-neutral-400 hover:text-white"
                          >
                            {copiedSharedUrl ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-800 font-mono text-xs font-bold text-neutral-300">3</span>
                    <div>
                      <h4 className="font-sans text-sm font-semibold text-white">Define Environment Variables in AI Studio</h4>
                      <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                        Access AI Studio **Settings menu (top right) ➔ API keys** or environment configuration and declare:
                      </p>
                      <ul className="mt-2 list-inside list-disc font-mono text-xs text-emerald-400 space-y-1">
                        <li>GITHUB_CLIENT_ID</li>
                        <li>GITHUB_CLIENT_SECRET</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-10 border-t border-neutral-900 pt-6 text-center">
                  <p className="font-sans text-xs text-neutral-500">
                    Once variables are configured, reload this explorer to complete synchronization.
                  </p>
                  <button
                    onClick={fetchStatus}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-neutral-900 border border-neutral-800 px-5 py-2.5 font-sans text-xs font-medium text-white transition-all hover:bg-neutral-800"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Check Configuration
                  </button>
                </div>
              </div>
            </motion.div>
          ) : config && !config.authenticated ? (
            /* CONFIG REGISTRATION COMPLETE BUT USER NOT LOGGED IN */
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto flex max-w-md flex-col items-center justify-center py-16 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 text-white shadow-xl">
                <Github className="h-8 w-8" />
              </div>
              <h2 className="mt-6 font-sans text-xl font-bold tracking-tight text-white">Connect Your GitHub Feed</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                Grant secure OAuth permission to access and display your public repositories, project configurations, and recent commit events.
              </p>

              {error && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-950/20 border border-red-900/30 px-4 py-2.5 text-xs text-red-400 text-left">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleConnect}
                className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-xl bg-white py-3.5 font-sans text-sm font-semibold text-neutral-950 transition-all hover:bg-neutral-100 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-white/5"
              >
                <Github className="h-4 w-4 fill-current" />
                Connect GitHub Account
              </button>

              <span className="mt-4 font-mono text-[10px] uppercase tracking-widest text-neutral-600">Secure Client Credential Exchange</span>
            </motion.div>
          ) : (
            /* AUTHENTICATED REAL-TIME SHOWCASE VIEW */
            <div className="flex flex-col gap-8">
              
              {/* Profile Card Header */}
              {profile && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-6 rounded-3xl border border-neutral-900 bg-neutral-900/20 p-6 md:flex-row md:items-center md:justify-between md:p-8"
                >
                  <div className="flex items-center gap-5">
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.name} 
                      className="h-16 w-16 rounded-full border-2 border-neutral-800 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="font-sans text-xl font-bold text-white tracking-tight">{profile.name || profile.login}</h2>
                        <a 
                          href={profile.html_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-neutral-500 hover:text-white"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                      <p className="font-mono text-xs text-neutral-400">@{profile.login}</p>
                      {profile.bio && <p className="mt-1.5 text-xs text-neutral-400 max-w-lg">{profile.bio}</p>}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 border-t border-neutral-900 pt-4 md:border-none md:pt-0">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <span className="block font-sans text-lg font-bold text-white">{profile.public_repos}</span>
                        <span className="font-mono text-[10px] text-neutral-500 uppercase">Repositories</span>
                      </div>
                      <div className="text-center">
                        <span className="block font-sans text-lg font-bold text-white">{profile.followers}</span>
                        <span className="font-mono text-[10px] text-neutral-500 uppercase">Followers</span>
                      </div>
                      <div className="text-center">
                        <span className="block font-sans text-lg font-bold text-white">
                          {repos.reduce((sum, r) => sum + r.stargazers_count, 0)}
                        </span>
                        <span className="font-mono text-[10px] text-neutral-500 uppercase">Stars Recv</span>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="ml-auto flex h-9 items-center gap-1.5 rounded-lg border border-neutral-900 bg-neutral-950 px-3 font-sans text-xs font-semibold text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-white"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Disconnect
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Repos and details layout */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                
                {/* Repos Grid Showcase */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  
                  {/* Search, Filter, Sort inputs */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-grow max-w-md">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                      <input 
                        type="text"
                        placeholder="Search repositories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-neutral-900 bg-neutral-950 py-2 pl-9 pr-4 text-xs text-white placeholder-neutral-500 focus:border-neutral-800 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Language filter */}
                      <div className="relative">
                        <select
                          value={filterLanguage}
                          onChange={(e) => setFilterLanguage(e.target.value)}
                          className="appearance-none rounded-xl border border-neutral-900 bg-neutral-950 px-3 py-2 pr-8 font-sans text-xs text-neutral-300 focus:border-neutral-800 focus:outline-none"
                        >
                          <option value="all">All Languages</option>
                          {uniqueLanguages.filter(l => l !== "all").map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                        </select>
                        <Filter className="pointer-events-none absolute right-2.5 top-3 h-3 w-3 text-neutral-500" />
                      </div>

                      {/* Sort selection */}
                      <select
                        value={sortBy}
                        onChange={(e: any) => setSortBy(e.target.value)}
                        className="rounded-xl border border-neutral-900 bg-neutral-950 px-3 py-2 font-sans text-xs text-neutral-300 focus:border-neutral-800 focus:outline-none"
                      >
                        <option value="updated">Recently Pushed</option>
                        <option value="stars">Most Stars</option>
                        <option value="name">Repo Name</option>
                      </select>
                    </div>
                  </div>

                  {/* Repo list Cards */}
                  <div className="grid grid-cols-1 gap-4 max-h-[550px] overflow-y-auto pr-1">
                    {filteredRepos.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 border border-dashed border-neutral-900 rounded-2xl">
                        <span className="font-mono text-xs text-neutral-600">No repositories matching configuration.</span>
                      </div>
                    ) : (
                      filteredRepos.map(repo => {
                        const isSelected = selectedRepo?.id === repo.id;
                        return (
                          <motion.div
                            key={repo.id}
                            layoutId={`repo-card-${repo.id}`}
                            onClick={() => handleSelectRepo(repo)}
                            className={`group flex cursor-pointer flex-col justify-between rounded-2xl border p-5 transition-all ${
                              isSelected 
                                ? "border-white bg-neutral-900/30 shadow-lg shadow-white/5" 
                                : "border-neutral-900 bg-neutral-950 hover:border-neutral-800 hover:bg-neutral-900/10"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-sans text-sm font-semibold tracking-tight text-white group-hover:text-white">
                                  {repo.name}
                                  {repo.private ? (
                                    <Lock className="h-3 w-3 text-neutral-500" />
                                  ) : (
                                    <Unlock className="h-3 w-3 text-neutral-600" />
                                  )}
                                </span>
                                <span className="font-mono text-[10px] text-neutral-500">
                                  {getRelativeTime(repo.pushed_at || repo.updated_at)}
                                </span>
                              </div>
                              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-neutral-400 group-hover:text-neutral-300">
                                {repo.description || "No description provided."}
                              </p>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-neutral-900/50 pt-3">
                              <div className="flex items-center gap-4">
                                {repo.language && (
                                  <span className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-400">
                                    <span 
                                      className="h-2 w-2 rounded-full" 
                                      style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || "#8b8b8b" }}
                                    />
                                    {repo.language}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3">
                                {repo.stargazers_count > 0 && (
                                  <span className="flex items-center gap-1 font-mono text-[11px] text-neutral-400">
                                    <Star className="h-3.5 w-3.5 text-amber-400" />
                                    {repo.stargazers_count}
                                  </span>
                                )}
                                {repo.forks_count > 0 && (
                                  <span className="flex items-center gap-1 font-mono text-[11px] text-neutral-400">
                                    <GitFork className="h-3.5 w-3.5 text-blue-400" />
                                    {repo.forks_count}
                                  </span>
                                )}
                                <ChevronRight className="h-4 w-4 text-neutral-600 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Repository Details Pane */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <AnimatePresence mode="wait">
                    {selectedRepo ? (
                      <motion.div
                        key={selectedRepo.id}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        className="rounded-3xl border border-neutral-900 bg-neutral-900/20 p-6 flex flex-col gap-6"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">Repository Details</span>
                            <a 
                              href={selectedRepo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-white hover:underline font-sans"
                            >
                              GitHub Link
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                          <h3 className="font-sans text-lg font-bold text-white tracking-tight mt-1">{selectedRepo.name}</h3>
                          {selectedRepo.description && (
                            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{selectedRepo.description}</p>
                          )}
                        </div>

                        {/* Languages Breakdown */}
                        <div className="border-t border-neutral-900 pt-4">
                          <h4 className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-3">Languages Breakdown</h4>
                          {loadingRepoDetails ? (
                            <div className="h-8 flex items-center justify-center font-mono text-[10px] text-neutral-600">Sourcing languages...</div>
                          ) : Object.keys(languages).length === 0 ? (
                            <div className="text-xs text-neutral-500 font-mono">No language statistics computed.</div>
                          ) : (
                            <div className="space-y-3">
                              {/* Horizontal Multi-color progress bar */}
                              <div className="h-2.5 w-full overflow-hidden rounded-full flex bg-neutral-900">
                                {Object.entries(languages).map(([lang, bytes]) => {
                                  const percentage = totalLangBytes > 0 
                                    ? (((bytes as number) / (totalLangBytes as number)) * 100).toFixed(1) 
                                    : "0";
                                  return (
                                    <div 
                                      key={lang}
                                      style={{ 
                                        width: `${percentage}%`,
                                        backgroundColor: LANGUAGE_COLORS[lang] || "#8b8b8b"
                                      }}
                                      title={`${lang}: ${percentage}%`}
                                    />
                                  );
                                })}
                              </div>

                              {/* Bullet list statistics */}
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(languages).map(([lang, bytes]) => {
                                  const percentage = totalLangBytes > 0 
                                    ? (((bytes as number) / (totalLangBytes as number)) * 100).toFixed(1) 
                                    : "0";
                                  return (
                                    <span key={lang} className="flex items-center justify-between gap-2 font-mono text-[10px]">
                                      <span className="flex items-center gap-1.5 text-neutral-400">
                                        <span 
                                          className="h-1.5 w-1.5 rounded-full"
                                          style={{ backgroundColor: LANGUAGE_COLORS[lang] || "#8b8b8b" }}
                                        />
                                        {lang}
                                      </span>
                                      <span className="text-neutral-500">{percentage}%</span>
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Recent Activity / Commits timeline */}
                        <div className="border-t border-neutral-900 pt-4">
                          <h4 className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-4">Recent Repository Events</h4>
                          {loadingRepoDetails ? (
                            <div className="flex flex-col items-center justify-center py-6">
                              <RefreshCw className="h-5 w-5 animate-spin text-neutral-600" />
                              <span className="font-mono text-[10px] text-neutral-600 mt-2">Loading timeline...</span>
                            </div>
                          ) : commits.length === 0 ? (
                            <div className="text-xs text-neutral-500 font-mono">No commit history found.</div>
                          ) : (
                            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                              {commits.map((commitItem, idx) => (
                                <div key={commitItem.sha} className="relative pl-5 flex gap-3 group">
                                  {/* Timeline node */}
                                  <div className="absolute left-[3px] top-1 h-2 w-2 rounded-full border border-neutral-800 bg-neutral-900 group-hover:bg-emerald-400 group-hover:border-emerald-400 transition-colors" />
                                  {idx !== commits.length - 1 && (
                                    <div className="absolute left-[6px] top-3 bottom-[-16px] w-[1px] bg-neutral-900" />
                                  )}
                                  
                                  {commitItem.author && (
                                    <img 
                                      src={commitItem.author.avatar_url} 
                                      alt={commitItem.commit.author.name}
                                      className="h-5 w-5 rounded-full object-cover shrink-0 mt-0.5"
                                    />
                                  )}
                                  <div className="flex flex-col">
                                    <span className="font-sans text-xs text-neutral-300 leading-normal line-clamp-2">
                                      {commitItem.commit.message}
                                    </span>
                                    <span className="font-mono text-[9px] text-neutral-500 mt-1 uppercase">
                                      {commitItem.commit.author.name} • {getRelativeTime(commitItem.commit.author.date)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-900 bg-neutral-950/20 p-8 text-center min-h-[300px]">
                        <Clock className="h-8 w-8 text-neutral-700" />
                        <h4 className="mt-4 font-sans text-sm font-semibold text-neutral-400">Select a Repository</h4>
                        <p className="mt-1 text-xs text-neutral-500 max-w-[200px] leading-relaxed">
                          Click on any repository card on the left to pull live metadata breakdown and commit events.
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

            </div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
