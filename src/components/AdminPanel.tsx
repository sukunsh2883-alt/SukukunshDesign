import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, Plus, Settings, Check, ShieldAlert, Edit3, Trash2, Image as ImageIcon, Briefcase, Film, User, Sparkles, X, ChevronRight, Lock, Unlock, LogOut, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { RESUME_CATEGORIES } from "../portfolioData";
import { DEFAULT_LOGO_FONT, LOGO_FONT_OPTIONS, getLogoFontStyle } from "../localFonts";

interface AdminPanelProps {
  onAddFilm: (data: any) => void;
  onAddDesign: (data: any) => void;
  onAddVideo: (data: any) => void;
  onAddExploration: (data: any) => void;
  profile: any;
  onUpdateProfile: (newProfile: any) => void;
  designs: any[];
  onUpdateDesigns: (newDesigns: any[]) => void;
  films: any[];
  onUpdateFilms: (newFilms: any[]) => void;
  videos: any[];
  onUpdateVideos: (newVideos: any[]) => void;
  explorations?: any[];
  onUpdateExplorations?: (newExplorations: any[]) => void;
}

interface ArchiveImageItem {
  id: string;
  title: string;
  imageUrl: string;
}

export default function AdminPanel({
  onAddFilm,
  onAddDesign,
  onAddVideo,
  onAddExploration,
  profile,
  onUpdateProfile,
  designs,
  onUpdateDesigns,
  films,
  onUpdateFilms,
  videos,
  onUpdateVideos,
  explorations = [],
  onUpdateExplorations = () => {}
}: AdminPanelProps) {
  const shouldShowStudio = () => {
    return true; // Permanently visible for easy access
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isStudioVisible, setIsStudioVisible] = useState(true);

  // Admin Login States
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("sukunsh_creator_studio_auth") === "true";
  });
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === "Sukunsh" && loginPassword === "Cera@123") {
      setIsAuthenticated(true);
      setIsStudioVisible(true);
      localStorage.setItem("sukunsh_creator_studio_auth", "true");
      setLoginError("");
    } else {
      setLoginError("Invalid Administrator Credentials");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsOpen(false);
    setIsStudioVisible(true);
    localStorage.removeItem("sukunsh_creator_studio_auth");
  };

  useEffect(() => {
    const unlockStudio = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        setIsStudioVisible(true);
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", unlockStudio);
    return () => window.removeEventListener("keydown", unlockStudio);
  }, []);

  const handleExportChanges = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile,
      films,
      designs,
      videos,
      explorations,
      aiArchiveImages: archiveImages,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sukunsh-portfolio-changes-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Changes exported. Send this JSON to Codex to make it permanent on GitHub.", "success");
  };

  const [consoleTab, setConsoleTab] = useState<"uploader" | "branding">("uploader");
  const [uploaderSubTab, setUploaderSubTab] = useState<"add" | "manage">("add");
  const [activeAssetType, setActiveAssetType] = useState<"film" | "design" | "video" | "exploration">("film");

  // Custom non-blocking, iframe-safe feedback states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage((curr) => curr === message ? null : curr);
    }, 4500);
  };

  // State in editing mode
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  
  // Remote asset URL state for dynamic slides
  const [remoteGalleryUrl, setRemoteGalleryUrl] = useState("");

  // Form fields for creating / editing items
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("2026");
  const [desc, setDesc] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [toolsInput, setToolsInput] = useState("");
  const [duration, setDuration] = useState("00:15");
  const [aspect, setAspect] = useState<"16:9" | "9:16">("16:9");
  const [isAI, setIsAI] = useState(true);

  // Design project extra fields
  const [client, setClient] = useState("");
  const [aboutProject, setAboutProject] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [uploadedPdfName, setUploadedPdfName] = useState("");
  const [behanceEmbedUrl, setBehanceEmbedUrl] = useState("");

  // Canvas sticker upload states
  const [explorationMode, setExplorationMode] = useState<"single" | "bulk">("single");
  const [bulkFiles, setBulkFiles] = useState<{ name: string; base64: string }[]>([]);
  const [archiveImages, setArchiveImages] = useState<ArchiveImageItem[]>(() => {
    try {
      const saved = localStorage.getItem("portfolio_ai_archive_images");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [archiveImageUrl, setArchiveImageUrl] = useState("");
  const [archiveImageTitle, setArchiveImageTitle] = useState("");

  // Branding states
  const [brandName, setBrandName] = useState(profile?.brandName || "Sukunsh");
  const [logoFontFamily, setLogoFontFamily] = useState(profile?.logoFontFamily || DEFAULT_LOGO_FONT);
  const [fullName, setFullName] = useState(profile?.fullName || "Suraj Kumar Sharma");
  const [contactEmail, setContactEmail] = useState(profile?.email || "sukunsh2883@gmail.com");
  const [rolesCSV, setRolesCSV] = useState(profile?.roles?.join(", ") || "Visual Designer, AI Creative Designer, Motion Designer");
  const [heroVideoUrl, setHeroVideoUrl] = useState(profile?.heroVideoUrl || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [aboutImage, setAboutImage] = useState(profile?.aboutImage || "");
  
  useEffect(() => {
    if (profile) {
      setBrandName(profile.brandName || "Sukunsh");
      setLogoFontFamily(profile.logoFontFamily || DEFAULT_LOGO_FONT);
      setFullName(profile.fullName || "Suraj Kumar Sharma");
      setContactEmail(profile.email || "sukunsh2883@gmail.com");
      setRolesCSV(profile.roles?.join(", ") || "Visual Designer, AI Creative Designer, Motion Designer");
      setHeroVideoUrl(profile.heroVideoUrl || "");
      setBio(profile.bio || "");
      setAboutImage(profile.aboutImage || "");
    }
  }, [profile]);

  const [heroImages, setHeroImages] = useState<string[]>(() => {
    const DEFAULT_HERO_SLOTS = [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618005198143-d366800ee4ef?q=80&w=600&auto=format&fit=crop",
    ];
    if (profile?.heroImages && profile.heroImages.length === 6) {
      return profile.heroImages;
    }
    const images = profile?.heroImages || [];
    const filled = [...images];
    for (let i = filled.length; i < 6; i++) {
      filled.push(DEFAULT_HERO_SLOTS[i]);
    }
    return filled.slice(0, 6);
  });

  // Slide drag/drop uploader states (for currently edited design project)
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setYear("2026");
    setDesc("");
    setThumbnail("");
    setVideoUrl("");
    setTagsInput("");
    setToolsInput("");
    setDuration("00:15");
    setAspect("16:9");
    setIsAI(true);
    setClient("");
    setAboutProject("");
    setPdfUrl("");
    setUploadedPdfName("");
    setBehanceEmbedUrl("");
    setEditingItemId(null);
    setBulkFiles([]);
    setExplorationMode("single");
  };

  const handleEditSelect = (item: any, type: "film" | "design" | "video" | "exploration") => {
    setEditingItemId(item.id);
    setActiveAssetType(type);
    setTitle(item.title || "");
    setCategory(type === "design" ? item.type || "" : type === "video" ? item.type || "" : type === "exploration" ? "Exploration Study" : item.category || "");
    setYear(item.year || "2026");
    setDesc(item.description || "");
    setThumbnail(type === "design" ? item.image || "" : type === "exploration" ? item.imageUrl || "" : item.thumbnail || "");
    setVideoUrl(item.videoUrl || "");
    setTagsInput(item.tags ? item.tags.join(", ") : "");
    setToolsInput(item.tools ? item.tools.join(", ") : "");
    setDuration(item.duration || "00:15");
    setAspect(item.format || "16:9");
    setIsAI(item.isAI !== undefined ? item.isAI : true);
    setClient(item.client || "");
    setAboutProject(item.aboutProject || "");
    setPdfUrl(type === "design" ? item.pdfUrl || "" : "");
    setUploadedPdfName(type === "design" ? item.uploadedPdfName || "" : "");
    setBehanceEmbedUrl(type === "design" ? item.behanceEmbedUrl || "" : "");
    
    // Smooth scroll inside panel to form
    const container = document.getElementById("admin-form-container");
    if (container) {
      container.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDeleteItem = (id: string, type: "film" | "design" | "video" | "exploration") => {
    if (type === "film") {
      onUpdateFilms(films.filter(f => f.id !== id));
    } else if (type === "design") {
      onUpdateDesigns(designs.filter(d => d.id !== id));
    } else if (type === "video") {
      onUpdateVideos(videos.filter(v => v.id !== id));
    } else {
      onUpdateExplorations(explorations.filter(e => e.id !== id));
    }

    if (editingItemId === id) {
      resetForm();
    }
    showToast("Project deleted successfully from active dashboard view!", "success");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isBulkExplorationUpload = activeAssetType === "exploration" && explorationMode === "bulk";
    if (!title.trim() && !isBulkExplorationUpload) {
      showToast("Add a project title before saving.", "error");
      return;
    }

    if (isBulkExplorationUpload && bulkFiles.length === 0) {
      showToast("Select at least one image for the bulk canvas upload.", "error");
      return;
    }

    const fallbackImage = activeAssetType === "film"
      ? "https://images.unsplash.com/photo-1542204172-e7052809a86e?q=80&w=800"
      : activeAssetType === "design"
      ? "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=800"
      : activeAssetType === "video"
      ? "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800"
      : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800";

    const resolvedThumbnail = thumbnail.trim() || fallbackImage;
    const resolvedVideo = videoUrl.trim() || "https://assets.mixkit.co/videos/preview/mixkit-mysterious-neon-lights-in-rainy-city-streets-43288-large.mp4";

    if (editingItemId) {
      // EDIT MODE
      if (activeAssetType === "film") {
        const updated = films.map(f => f.id === editingItemId ? {
          ...f,
          title,
          category: category || "AI Video / Art",
          year,
          description: desc,
          thumbnail: resolvedThumbnail,
          videoUrl: resolvedVideo,
          tags: tagsInput ? tagsInput.split(",").map(t => t.trim()).filter(Boolean) : ["AI Film"],
          isAI
        } : f);
        onUpdateFilms(updated);
      } else if (activeAssetType === "design") {
        const cleanLink = behanceEmbedUrl.trim();
        const srcMatch = cleanLink.match(/src=["']([^"']+)["']/i);
        const resolvedLink = srcMatch ? srcMatch[1] : cleanLink;

        const updated = designs.map(d => d.id === editingItemId ? {
          ...d,
          title,
          type: category || "Branding & Typography",
          year,
          description: desc,
          image: resolvedThumbnail,
          tools: toolsInput ? toolsInput.split(",").map(t => t.trim()).filter(Boolean) : ["Adobe Suite"],
          client,
          aboutProject,
          isAI,
          pdfUrl,
          uploadedPdfName,
          behanceEmbedUrl: cleanLink,
          link: resolvedLink || d.link || "#",
          galleryImages: [resolvedThumbnail, ...(d.galleryImages && d.galleryImages.length > 1 ? d.galleryImages.slice(1) : [])]
        } : d);
        onUpdateDesigns(updated);
      } else if (activeAssetType === "video") {
        const updated = videos.map(v => v.id === editingItemId ? {
          ...v,
          title,
          format: aspect,
          type: category || "Showreel Clip",
          thumbnail: resolvedThumbnail,
          videoUrl: resolvedVideo,
          duration,
          year,
          isAI
        } : v);
        onUpdateVideos(updated);
      } else {
        const updated = explorations.map(e => e.id === editingItemId ? {
          ...e,
          title,
          imageUrl: resolvedThumbnail
        } : e);
        onUpdateExplorations(updated);
      }
      showToast("Project successfully updated in real-time!", "success");
      resetForm();
    } else {
      // ADD MODE
      if (activeAssetType === "film") {
        onAddFilm({
          id: `film-${Date.now()}`,
          title,
          category: category || "AI Video / Art",
          year,
          description: desc || "Custom prompt-driven showcase project details.",
          thumbnail: resolvedThumbnail,
          videoUrl: resolvedVideo,
          tags: tagsInput ? tagsInput.split(",").map(t => t.trim()).filter(Boolean) : ["AI Film", "Prompt Art"],
          isAI
        });
      } else if (activeAssetType === "design") {
        const cleanLink = behanceEmbedUrl.trim();
        const srcMatch = cleanLink.match(/src=["']([^"']+)["']/i);
        const resolvedLink = srcMatch ? srcMatch[1] : cleanLink;

        onAddDesign({
          id: `design-${Date.now()}`,
          title,
          type: category || "Branding & Typography",
          year,
          description: desc || "Branding layouts, typography exercises, and publications.",
          image: resolvedThumbnail,
          galleryImages: [resolvedThumbnail],
          tools: toolsInput ? toolsInput.split(",").map(t => t.trim()).filter(Boolean) : ["Photoshop", "Illustrator"],
          link: resolvedLink || "#",
          client: client || "Sukunsh Labs Inc.",
          aboutProject: aboutProject || desc || "Academic graphic communication design project detail study.",
          isAI,
          pdfUrl,
          uploadedPdfName,
          behanceEmbedUrl: cleanLink
        });
      } else if (activeAssetType === "video") {
        onAddVideo({
          id: `vid-${Date.now()}`,
          title,
          format: aspect,
          type: category || "AI Ad Story",
          thumbnail: resolvedThumbnail,
          videoUrl: resolvedVideo,
          duration,
          year,
          isAI
        });
      } else {
        if (explorationMode === "bulk" && bulkFiles.length > 0) {
          bulkFiles.forEach((file, fIdx) => {
            onAddExploration({
              id: `exploration-${Date.now()}-${fIdx}-${Math.floor(Math.random() * 1000)}`,
              title: file.name.replace(/\.[^/.]+$/, ""),
              imageUrl: file.base64,
              rotation: "0",
              yOffset: "0"
            });
          });
          showToast(`${bulkFiles.length} transparent PNG stickers have been uploaded and added successfully to the active canvas stage!`, "success");
        } else {
          onAddExploration({
            id: `exploration-${Date.now()}`,
            title: title || "Prompt Experiment",
            imageUrl: resolvedThumbnail,
            rotation: "0",
            yOffset: "0"
          });
          showToast("Pristine sticker successfully created and added to the interactive canvas stage!", "success");
        }
      }
      resetForm();
    }
  };

  const handleUpdateBranding = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      brandName,
      logoFontFamily,
      fullName,
      email: contactEmail,
      roles: rolesCSV.split(",").map(r => r.trim()).filter(Boolean),
      heroVideoUrl: heroVideoUrl.trim(),
      heroImages,
      bio: bio.trim(),
      aboutImage: aboutImage.trim()
    });
    showToast("Branding identity portfolio sync finished!", "success");
  };

  // Convert files locally to Base64 and inject to active design project
  const processUploadedFiles = (files: FileList) => {
    if (!editingItemId || activeAssetType !== "design") return;
    
    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) {
        showToast("Only images are accepted in project slide shows!", "error");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        if (!base64Url) return;

        const original = designs.find(d => d.id === editingItemId);
        if (!original) return;

        const existingGallery = original.galleryImages || [original.image];
        const updatedGallery = [...existingGallery, base64Url];

        onUpdateDesigns(designs.map(d => d.id === editingItemId ? {
          ...d,
          image: updatedGallery[0] || d.image,
          galleryImages: updatedGallery
        } : d));
        setThumbnail(updatedGallery[0] || original.image || "");
      };
      reader.readAsDataURL(file);
    });
  };

  const saveArchiveImages = (items: ArchiveImageItem[]) => {
    setArchiveImages(items);
    localStorage.setItem("portfolio_ai_archive_images", JSON.stringify(items));
  };

  const addArchiveImage = (titleValue: string, imageUrl: string) => {
    const cleanImageUrl = imageUrl.trim();
    if (!cleanImageUrl) {
      showToast("Add an image URL or upload an image file first.", "error");
      return;
    }

    const cleanTitle = titleValue.trim() || "AI Archive Image";
    const next = [
      {
        id: `archive-image-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: cleanTitle,
        imageUrl: cleanImageUrl,
      },
      ...archiveImages,
    ];

    saveArchiveImages(next);
    setArchiveImageUrl("");
    setArchiveImageTitle("");
    showToast("AI archive image added to the public gallery.", "success");
  };

  const handleArchiveImageFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        showToast("Only image files can be added to AI Archive.", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        if (!base64Url) return;
        setArchiveImages((prev) => {
          const next = [
            {
              id: `archive-image-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              title: file.name.replace(/\.[^/.]+$/, ""),
              imageUrl: base64Url,
            },
            ...prev,
          ];
          localStorage.setItem("portfolio_ai_archive_images", JSON.stringify(next));
          return next;
        });
        showToast("AI archive image added to the public gallery.", "success");
      };
      reader.readAsDataURL(file);
    });
  };

  const removeArchiveImage = (id: string) => {
    saveArchiveImages(archiveImages.filter((item) => item.id !== id));
    showToast("AI archive image removed.", "success");
  };

  const deleteGalleryImage = (imageIndex: number) => {
    const original = designs.find(d => d.id === editingItemId);
    if (!original) return;

    const existingGallery = original.galleryImages || [original.image];
    const updatedGallery = existingGallery.filter((_: any, idx: number) => idx !== imageIndex);

    onUpdateDesigns(designs.map(d => d.id === editingItemId ? {
      ...d,
      galleryImages: updatedGallery,
      image: updatedGallery[0] || d.image
    } : d));
    setThumbnail(updatedGallery[0] || original.image || "");
  };

  const reorderGalleryImage = (imageIndex: number, direction: "up" | "down") => {
    const original = designs.find(d => d.id === editingItemId);
    if (!original) return;

    const existingGallery = [...(original.galleryImages || [original.image]).filter(Boolean)];
    const newIndex = direction === "up" ? imageIndex - 1 : imageIndex + 1;

    if (newIndex < 0 || newIndex >= existingGallery.length) return;

    // Swap elements
    const temp = existingGallery[imageIndex];
    existingGallery[imageIndex] = existingGallery[newIndex];
    existingGallery[newIndex] = temp;

    onUpdateDesigns(designs.map(d => d.id === editingItemId ? {
      ...d,
      galleryImages: existingGallery,
      image: existingGallery[0] || d.image
    } : d));
    setThumbnail(existingGallery[0] || original.image || "");
  };

  const handleAddRemoteGalleryUrl = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!remoteGalleryUrl.trim()) return;

    const original = designs.find(d => d.id === editingItemId);
    if (!original) return;

    const existingGallery = original.galleryImages || [original.image];
    const updatedGallery = [...existingGallery, remoteGalleryUrl.trim()];

    onUpdateDesigns(designs.map(d => d.id === editingItemId ? {
      ...d,
      image: updatedGallery[0] || d.image,
      galleryImages: updatedGallery
    } : d));
    setThumbnail(updatedGallery[0] || original.image || "");
    setRemoteGalleryUrl("");
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFiles(e.target.files);
    }
  };

  if (!isStudioVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* Dynamic Accessible Console Overlay (Light theme) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="w-[92vw] sm:w-[460px] max-h-[85vh] overflow-y-auto rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] mb-4 text-neutral-950 flex flex-col scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-neutral-50"
            role="dialog"
            aria-label="Sukunsh Portfolio Manager Console"
          >
            {/* Header info */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4 font-sans">
              <div className="flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-[#FF6A00] animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-widest uppercase font-mono font-bold text-neutral-900">Creator Studio</span>
                  <span className="text-[8px] text-neutral-500 uppercase tracking-widest font-mono">Dynamic Portfolio Sync</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 font-sans">
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    type="button"
                    className="p-1.5 text-neutral-500 hover:text-red-500 rounded-full border border-neutral-200 hover:bg-neutral-50 hover:border-red-200 transition-colors cursor-pointer"
                    title="Lock Creator Studio"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[10px] uppercase tracking-wider font-mono text-neutral-600 hover:text-black px-3 py-1.5 rounded-full border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Close Studio
                </button>
              </div>
            </div>

            {!isAuthenticated ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4 py-4 font-sans">
                <div className="text-center pb-2">
                  <span className="text-xs uppercase font-mono tracking-widest text-[#FF6A00] font-bold block mb-1">
                    Creator Access Verification
                  </span>
                  <p className="text-[10px] font-sans text-neutral-500 uppercase tracking-wider font-mono">
                    Verify credentials to continue
                  </p>
                  <div className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-left font-mono text-[9px] uppercase tracking-widest text-neutral-500">
                    <div>Username: <span className="font-bold text-neutral-950">Sukunsh</span></div>
                    <div>Password: <span className="font-bold text-neutral-950">Cera@123</span></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[8px] uppercase font-mono tracking-widest text-neutral-500 block mb-1">
                      User Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Username (Sukunsh)"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-[#FF6A00]"
                    />
                  </div>

                  <div>
                    <label className="text-[8px] uppercase font-mono tracking-widest text-neutral-500 block mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D1D1D6] bg-white text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-[#FF6A00]"
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="p-2.5 rounded-xl border border-red-200 bg-red-50 text-[10px] text-red-600 font-mono text-center">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-black text-white hover:bg-neutral-800 font-sans font-semibold text-[10px] uppercase tracking-widest cursor-pointer transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-[#FF6A00]" />
                  <span>Authenticate Studio</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginUsername("Sukunsh");
                    setLoginPassword("Cera@123");
                    setIsAuthenticated(true);
                    setIsStudioVisible(true);
                    localStorage.setItem("sukunsh_creator_studio_auth", "true");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-[#FF6A00]/10 hover:bg-[#FF6A00]/20 text-[#FF6A00] font-sans font-semibold text-[10px] uppercase tracking-widest cursor-pointer transition-all border border-[#FF6A00]/20 mt-1"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Quick Autofill & Login</span>
                </button>
              </form>
            ) : (
              <>
                {/* Embedded Custom Toast Alert (100% Sandbox-friendly) */}
                <AnimatePresence>
                  {toastMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className={`p-3 rounded-2xl text-center text-[11px] font-semibold border mb-4 font-sans flex items-center justify-center gap-2 shadow-xs ${
                        toastType === "success" 
                          ? "bg-green-50 border-green-200 text-green-700" 
                          : "bg-red-50 border-[#FF453A]/20 text-[#FF453A]"
                      }`}
                    >
                      <span>{toastType === "success" ? "✓" : "⚠"}</span>
                      <span>{toastMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Core Navigation Tabs */}
                <div className="grid grid-cols-2 gap-2 mb-6 bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200 font-sans">
                  <button
                    onClick={() => setConsoleTab("uploader")}
                    className={`py-2 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      consoleTab === "uploader" ? "bg-white text-black shadow-sm font-bold" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Creator Studio</span>
                  </button>
                  <button
                    onClick={() => setConsoleTab("branding")}
                    className={`py-2 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      consoleTab === "branding" ? "bg-white text-black shadow-sm font-bold" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Branding details</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleExportChanges}
                  className="mb-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#FF6A00]/25 bg-[#FF6A00]/8 px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-widest text-[#FF6A00] transition-colors hover:bg-[#FF6A00] hover:text-white"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export Changes For GitHub
                </button>

            {/* TAB CONTAINER 1: INTEGRATED PROJECT UPLOADER & LIST EDITOR */}
            {consoleTab === "uploader" && (
              <div className="space-y-4">
                
                {/* Mode Selector Toggle */}
                <div className="flex gap-1.5 p-1 rounded-xl bg-neutral-100 border border-neutral-200">
                  <button
                    onClick={() => { setUploaderSubTab("add"); resetForm(); }}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] uppercase tracking-widest font-mono font-semibold transition-all ${
                      uploaderSubTab === "add" && !editingItemId ? "bg-white text-black shadow-xs font-bold" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    Add new Project
                  </button>
                  <button
                    onClick={() => setUploaderSubTab("manage")}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] uppercase tracking-widest font-mono font-semibold transition-all ${
                      uploaderSubTab === "manage" || editingItemId ? "bg-white text-black shadow-xs font-bold" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {editingItemId ? "✏️ Editing active item" : "Manage & Edit Projects"}
                  </button>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-3">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#FF6A00]">
                        AI Archive Images
                      </p>
                      <p className="mt-1 text-[10px] leading-relaxed text-neutral-500">
                        Add images here. The public AI Archive page only displays them.
                      </p>
                    </div>
                    <label className="shrink-0 cursor-pointer rounded-full border border-neutral-200 bg-neutral-950 px-3 py-2 text-[8px] font-mono font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-neutral-950">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(event) => {
                          handleArchiveImageFiles(event.target.files);
                          event.target.value = "";
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <input
                      type="text"
                      value={archiveImageTitle}
                      onChange={(event) => setArchiveImageTitle(event.target.value)}
                      placeholder="Image title"
                      className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[10px] text-neutral-950 outline-none focus:border-[#FF6A00]"
                    />
                    <button
                      type="button"
                      onClick={() => addArchiveImage(archiveImageTitle, archiveImageUrl)}
                      className="row-span-2 rounded-xl bg-[#FF6A00] px-3 text-[8px] font-mono font-bold uppercase tracking-widest text-white transition-colors hover:bg-black"
                    >
                      Add URL
                    </button>
                    <input
                      type="url"
                      value={archiveImageUrl}
                      onChange={(event) => setArchiveImageUrl(event.target.value)}
                      placeholder="Image URL"
                      className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[10px] text-neutral-950 outline-none focus:border-[#FF6A00]"
                    />
                  </div>

                  {archiveImages.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-2 border-t border-neutral-100 pt-3">
                      {archiveImages.slice(0, 8).map((item) => (
                        <div key={item.id} className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => removeArchiveImage(item.id)}
                            className="absolute inset-0 flex items-center justify-center bg-black/70 text-[8px] font-mono font-black uppercase tracking-widest text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sub Tab: Manage/Edit existing listed projects */}
                {(uploaderSubTab === "manage" || editingItemId) && !editingItemId && (
                  <div className="space-y-3 bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#FF6A00] font-bold block mb-1">
                      Choose Project Type to Edit:
                    </span>
                    <div className="grid grid-cols-4 gap-1 mb-3 bg-neutral-200 p-1 rounded-xl">
                      {(["film", "design", "video", "exploration"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setActiveAssetType(type)}
                          className={`py-1.5 rounded text-[7px] font-mono uppercase tracking-tight text-center ${
                            activeAssetType === type ? "bg-[#FF6A00] text-white font-bold" : "text-neutral-600 hover:text-black"
                          }`}
                        >
                          {type === "film" ? "AI Film" : type === "design" ? "Design" : type === "video" ? "Showreels" : "Canvas"}
                        </button>
                      ))}
                    </div>

                    {activeAssetType === "design" && (
                      <div className="mb-3 p-2 rounded-xl bg-[#FF6A00]/10 border border-[#FF6A00]/20 text-[9px] text-[#FF6A00] font-sans font-medium leading-relaxed">
                        💡 Updating designs here automatically updates the 3-column Scroll Grid Showcase!
                      </div>
                    )}

                    {/* Lists of items based on activeAssetType */}
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {activeAssetType === "film" ? (
                        films.map(f => (
                          <div key={f.id} className="flex flex-col p-2 rounded-xl bg-white border border-neutral-200 shadow-2xs hover:border-[#FF6A00]/40 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5 truncate">
                                <img src={f.thumbnail} className="w-9 h-9 rounded object-cover border border-neutral-100" />
                                <div className="flex flex-col truncate">
                                  <span className="text-[11px] font-semibold text-neutral-900 truncate">{f.title}</span>
                                  <span className="text-[8px] font-mono text-neutral-500 uppercase">{f.category}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleEditSelect(f, "film")}
                                  className="p-1 rounded bg-neutral-100 hover:bg-[#FF6A00]/10 text-neutral-600 hover:text-[#FF6A00] transition-all cursor-pointer"
                                  title="Edit elements details"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(deleteConfirmId === f.id ? null : f.id)}
                                  className={`p-1 rounded transition-all cursor-pointer ${
                                    deleteConfirmId === f.id ? "bg-red-50 text-red-600" : "bg-neutral-100 hover:bg-rose-50 text-neutral-600 hover:text-red-600"
                                  }`}
                                  title="Delete from list"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            {deleteConfirmId === f.id && (
                              <div className="flex items-center justify-between p-1.5 bg-rose-50/50 rounded-lg border border-[#FF453A]/10 mt-1.5">
                                <span className="text-[9px] text-[#FF453A] font-semibold font-sans">Delete this project?</span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => { handleDeleteItem(f.id, "film"); setDeleteConfirmId(null); }}
                                    className="px-2 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold hover:bg-red-700 cursor-pointer transition-colors"
                                  >
                                    Yes, Delete
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-2 py-0.5 rounded bg-neutral-200 text-neutral-700 text-[9px] font-bold hover:bg-neutral-300 cursor-pointer transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      ) : activeAssetType === "design" ? (
                        designs.map(d => (
                          <div key={d.id} className="flex flex-col p-2 rounded-xl bg-white border border-neutral-200 shadow-2xs hover:border-[#FF6A00]/40 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5 truncate">
                                <img src={d.image} className="w-9 h-9 rounded object-cover border border-neutral-100" />
                                <div className="flex flex-col truncate">
                                  <span className="text-[11px] font-semibold text-neutral-900 truncate">{d.title}</span>
                                  <span className="text-[8px] font-mono text-neutral-500 uppercase">{d.type}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleEditSelect(d, "design")}
                                  className="p-1 rounded bg-neutral-100 hover:bg-[#FF6A00]/10 text-neutral-600 hover:text-[#FF6A00] transition-all cursor-pointer"
                                  title="Edit elements details"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(deleteConfirmId === d.id ? null : d.id)}
                                  className={`p-1 rounded transition-all cursor-pointer ${
                                    deleteConfirmId === d.id ? "bg-red-50 text-red-600" : "bg-neutral-100 hover:bg-rose-50 text-neutral-600 hover:text-red-600"
                                  }`}
                                  title="Delete from list"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            {deleteConfirmId === d.id && (
                              <div className="flex items-center justify-between p-1.5 bg-rose-50/50 rounded-lg border border-[#FF453A]/10 mt-1.5">
                                <span className="text-[9px] text-[#FF453A] font-semibold font-sans">Delete this project?</span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => { handleDeleteItem(d.id, "design"); setDeleteConfirmId(null); }}
                                    className="px-2 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold hover:bg-red-700 cursor-pointer transition-colors"
                                  >
                                    Yes, Delete
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-2 py-0.5 rounded bg-neutral-200 text-neutral-700 text-[9px] font-bold hover:bg-neutral-300 cursor-pointer transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      ) : activeAssetType === "video" ? (
                        videos.map(v => (
                          <div key={v.id} className="flex flex-col p-2 rounded-xl bg-white border border-neutral-200 shadow-2xs hover:border-[#FF6A00]/40 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5 truncate">
                                <img src={v.thumbnail} className="w-9 h-9 rounded object-cover border border-neutral-100" />
                                <div className="flex flex-col truncate">
                                  <span className="text-[11px] font-semibold text-neutral-900 truncate">{v.title}</span>
                                  <span className="text-[8px] font-mono text-neutral-500 uppercase">{v.type} ({v.duration})</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleEditSelect(v, "video")}
                                  className="p-1 rounded bg-neutral-100 hover:bg-[#FF6A00]/10 text-neutral-600 hover:text-[#FF6A00] transition-all cursor-pointer"
                                  title="Edit elements details"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(deleteConfirmId === v.id ? null : v.id)}
                                  className={`p-1 rounded transition-all cursor-pointer ${
                                    deleteConfirmId === v.id ? "bg-red-50 text-red-600" : "bg-neutral-100 hover:bg-rose-50 text-neutral-600 hover:text-red-600"
                                  }`}
                                  title="Delete from list"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            {deleteConfirmId === v.id && (
                              <div className="flex items-center justify-between p-1.5 bg-rose-50/50 rounded-lg border border-[#FF453A]/10 mt-1.5">
                                <span className="text-[9px] text-[#FF453A] font-semibold font-sans">Delete this video?</span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => { handleDeleteItem(v.id, "video"); setDeleteConfirmId(null); }}
                                    className="px-2 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold hover:bg-red-700 cursor-pointer transition-colors"
                                  >
                                    Yes, Delete
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-2 py-0.5 rounded bg-neutral-200 text-neutral-700 text-[9px] font-bold hover:bg-neutral-300 cursor-pointer transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        explorations.map(e => (
                          <div key={e.id} className="flex flex-col p-2 rounded-xl bg-white border border-neutral-200 shadow-2xs hover:border-[#FF6A00]/40 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5 truncate">
                                <img src={e.imageUrl} className="w-9 h-9 rounded object-cover border border-neutral-100" />
                                <div className="flex flex-col truncate">
                                  <span className="text-[11px] font-semibold text-neutral-900 truncate">{e.title}</span>
                                  <span className="text-[8px] font-mono text-neutral-500 uppercase">Exploration study</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleEditSelect(e, "exploration")}
                                  className="p-1 rounded bg-neutral-100 hover:bg-[#FF6A00]/10 text-neutral-600 hover:text-[#FF6A00] transition-all cursor-pointer"
                                  title="Edit elements details"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(deleteConfirmId === e.id ? null : e.id)}
                                  className={`p-1 rounded transition-all cursor-pointer ${
                                    deleteConfirmId === e.id ? "bg-red-50 text-red-600" : "bg-neutral-100 hover:bg-rose-50 text-neutral-600 hover:text-red-600"
                                  }`}
                                  title="Delete from list"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            {deleteConfirmId === e.id && (
                              <div className="flex items-center justify-between p-1.5 bg-rose-50/50 rounded-lg border border-[#FF453A]/10 mt-1.5">
                                <span className="text-[9px] text-[#FF453A] font-semibold font-sans">Delete this sticker?</span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => { handleDeleteItem(e.id, "exploration"); setDeleteConfirmId(null); }}
                                    className="px-2 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold hover:bg-red-700 cursor-pointer transition-colors"
                                  >
                                    Yes, Delete
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-2 py-0.5 rounded bg-neutral-200 text-neutral-700 text-[9px] font-bold hover:bg-neutral-300 cursor-pointer transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Main Form Fields */}
                <div id="admin-form-container" className="pt-2 border-t border-neutral-100">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Header showing edit vs add */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-900 font-bold">
                        {editingItemId ? `✏️ Editing project elements` : `➕ Creating new item`}
                      </span>
                      {editingItemId && (
                        <button
                          type="button"
                          onClick={() => resetForm()}
                          className="text-[8px] uppercase tracking-widest font-mono text-medium px-2 py-1 rounded bg-red-50 text-red-600 border border-red-100 shrink-0 hover:bg-red-100 transition-all cursor-pointer"
                        >
                          Cancel / Reset
                        </button>
                      )}
                    </div>

                    {/* Category Selection Tabs (ONLY FOR NEW ITEM CREATION) */}
                    {!editingItemId && (
                      <div className="grid grid-cols-4 gap-1.5 p-1 bg-neutral-150 border border-neutral-200 rounded-lg">
                        {(["film", "design", "video", "exploration"] as const).map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => { setActiveAssetType(tab); }}
                            className={`py-1 rounded text-[7px] font-mono uppercase tracking-tight text-center ${
                              activeAssetType === tab ? "bg-[#FF6A00] text-white font-bold" : "text-neutral-500 hover:text-neutral-800"
                            }`}
                          >
                            {tab === "film" ? "AI Film" : tab === "design" ? "Design" : tab === "video" ? "Showreel" : "Canvas"}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Exploration mode selector */}
                    {activeAssetType === "exploration" && !editingItemId && (
                      <div className="flex gap-2 p-1 bg-neutral-100 border border-neutral-200 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setExplorationMode("single")}
                          className={`flex-1 py-1.5 rounded-lg text-[8px] font-mono uppercase tracking-wider transition-all font-bold ${
                            explorationMode === "single"
                              ? "bg-white text-[#FF6A00] shadow-3xs"
                              : "text-neutral-500 hover:text-neutral-800"
                          }`}
                        >
                          Single Sticker
                        </button>
                        <button
                          type="button"
                          onClick={() => setExplorationMode("bulk")}
                          className={`flex-1 py-1.5 rounded-lg text-[8px] font-mono uppercase tracking-wider transition-all font-bold ${
                            explorationMode === "bulk"
                              ? "bg-white text-[#FF6A00] shadow-3xs"
                              : "text-neutral-500 hover:text-neutral-800"
                          }`}
                        >
                          📂 Bulk Upload Stickers
                        </button>
                      </div>
                    )}

                    {!(activeAssetType === "exploration" && explorationMode === "bulk") && (
                      <div>
                        <label className="text-[8px] uppercase font-mono tracking-widest text-neutral-500 block">Project Title *</label>
                        <input
                          type="text"
                          required={activeAssetType !== "exploration" || explorationMode !== "bulk"}
                          placeholder="e.g. Neo-Deconstructivist Space"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-[#FF6A00]"
                        />
                      </div>
                    )}
                                      {activeAssetType !== "exploration" && (
                      <>
                        <div>
                          <label className="text-[8.5px] uppercase font-mono tracking-widest text-[#FF6A00] font-extrabold block">Format Category (Resume Alignment)</label>
                          <div className="flex flex-col sm:flex-row gap-2 mt-1">
                            <select
                              value={RESUME_CATEGORIES.includes(category) ? category : ""}
                              onChange={(e) => {
                                if (e.target.value) setCategory(e.target.value);
                              }}
                              className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-950 focus:outline-none focus:border-[#FF6A00]"
                            >
                              <option value="">Select Category from Resume...</option>
                              {RESUME_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              placeholder="Or enter custom..."
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-[#FF6A00]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[8px] uppercase font-mono tracking-widest text-neutral-500 block">Launch Year</label>
                            <input
                              type="text"
                              value={year}
                              onChange={(e) => setYear(e.target.value)}
                              className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-950 font-mono focus:outline-none focus:border-[#FF6A00]"
                            />
                          </div>
                          
                          {/* Identify AI vs Handcrafted toggle */}
                          <div>
                            <label className="text-[8px] uppercase font-mono tracking-widest text-neutral-500 block">Workflow Engine</label>
                            <div className="flex gap-1 mt-1 p-0.5 rounded-xl bg-neutral-100 border border-neutral-200">
                              <button
                                type="button"
                                onClick={() => setIsAI(true)}
                                className={`flex-1 py-1 px-2 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all ${
                                  isAI 
                                    ? "bg-[#FF6A00] text-white font-bold" 
                                    : "text-neutral-500 hover:text-neutral-800"
                                }`}
                              >
                                AI Made
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsAI(false)}
                                className={`flex-1 py-1 px-2 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all ${
                                  !isAI 
                                    ? "bg-black text-white font-bold" 
                                    : "text-neutral-500 hover:text-neutral-800"
                                }`}
                              >
                                Manual
                              </button>
                            </div>
                          </div>
                        </div>

                        {activeAssetType === "design" && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[8px] uppercase font-mono tracking-widest text-neutral-500 block">Client name</label>
                                <input
                                  type="text"
                                  placeholder="e.g. College of Art"
                                  value={client}
                                  onChange={(e) => setClient(e.target.value)}
                                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-950 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[8px] uppercase font-mono tracking-widest text-neutral-500 block">About Project Description</label>
                                <input
                                  type="text"
                                  placeholder="Brief project prompt details"
                                  value={aboutProject}
                                  onChange={(e) => setAboutProject(e.target.value)}
                                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-950 focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Dynamic PDF Attachment Field */}
                            <div className="p-3 bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
                              <span className="text-[8px] uppercase font-mono tracking-wider text-neutral-500 font-bold block mb-1">
                                PROJECT PDF ATTACHMENT
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.55">
                                <div>
                                  <label className="text-[7.5px] uppercase font-mono tracking-widest text-neutral-450 block mb-1">Upload PDF Document</label>
                                  <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                          if (event.target?.result) {
                                            setPdfUrl(event.target.result as string);
                                            setUploadedPdfName(file.name);
                                          }
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                    className="w-full text-[10px] text-neutral-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-sans file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"
                                  />
                                  {uploadedPdfName && (
                                    <span className="text-[9px] text-[#FF6A00] mt-1 font-mono block">
                                      Attached: {uploadedPdfName}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <label className="text-[7.5px] uppercase font-mono tracking-widest text-neutral-450 block mb-1">or enter PDF URL</label>
                                  <input
                                    type="text"
                                    placeholder="https://example.com/project.pdf"
                                    value={pdfUrl.startsWith("data:") ? "" : pdfUrl}
                                    onChange={(e) => {
                                      setPdfUrl(e.target.value);
                                      setUploadedPdfName(e.target.value ? "External URL PDF" : "");
                                    }}
                                    className="w-full px-2.5 py-1 text-[10px] rounded-lg border border-neutral-200 bg-white text-neutral-950 focus:outline-none"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Dynamic Behance Integration Field */}
                            <div className="p-3 bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
                              <span className="text-[8px] uppercase font-mono tracking-wider text-neutral-500 font-bold block mb-1">
                                LIVE BEHANCE EMBED LINK (OPTIONAL)
                              </span>
                              <div className="space-y-1">
                                <label className="text-[7.5px] uppercase font-mono tracking-widest text-neutral-450 block">
                                  BEHANCE PROJECT LINK or EMBED IFRAME SCRIPT
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. https://www.behance.net/gallery/12345/Title or <iframe src='...'>"
                                  value={behanceEmbedUrl}
                                  onChange={(e) => setBehanceEmbedUrl(e.target.value)}
                                  className="w-full px-2.5 py-1.5 text-[10px] rounded-lg border border-neutral-200 bg-white text-neutral-950 focus:outline-none focus:border-[#FF6A00] transition-all"
                                />
                                <span className="text-[9px] text-neutral-400 font-sans block mt-1">
                                  You can directly paste your Behance gallery URL or copy-paste the raw iframe embed code from Behance!
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="text-[8px] uppercase font-mono tracking-widest text-neutral-500 block">Overview Narrative</label>
                          <textarea
                            placeholder="Cinematic presentation description detail..."
                            rows={2}
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-[#FF6A00] [resize:none]"
                          />
                        </div>
                      </>
                    )}

                    {activeAssetType === "video" && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[8px] uppercase font-mono tracking-widest text-neutral-500 block">Clip Duration</label>
                          <input
                            type="text"
                            placeholder="e.g. 00:45"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-950 focus:outline-none focus:border-[#FF6A00]"
                          />
                        </div>
                        <div>
                          <label className="text-[8px] uppercase font-mono tracking-widest text-neutral-500 block">Aspect Projection</label>
                          <select
                            value={aspect}
                            onChange={(e) => setAspect(e.target.value as any)}
                            className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-950 focus:outline-none focus:border-[#FF6A00]"
                          >
                            <option value="16:9">Widescreen (16:9)</option>
                            <option value="9:16">Vertical (9:16)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {activeAssetType === "film" && (
                      <div>
                        <label className="text-[8px] uppercase font-mono tracking-widest text-neutral-500 block">Creative Tech Tags (comma separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. Luma Dream, Midjourney, Gen-3"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-[#FF6A00]"
                        />
                      </div>
                    )}

                    {activeAssetType === "design" && (
                      <div>
                        <label className="text-[8px] uppercase font-mono tracking-widest text-neutral-500 block">Software Tools used (comma separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. InDesign, Figma, Illustrator"
                          value={toolsInput}
                          onChange={(e) => setToolsInput(e.target.value)}
                          className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-[#FF6A00]"
                        />
                      </div>
                    )}

                    <div className="space-y-3">
                      {!(activeAssetType === "exploration" && explorationMode === "bulk") ? (
                        <div>
                          <label className="text-[8px] uppercase font-mono tracking-widest text-[#FF6A00] block font-bold">Primary Cover Image / Thumbnail (URL / File Upload) *</label>
                          <div className="flex gap-2 mt-1">
                            <input
                              type="text"
                              required={!(activeAssetType === "exploration" && explorationMode === "bulk")}
                              placeholder="HTTP image link or uploaded base64 data"
                              value={thumbnail}
                              onChange={(e) => setThumbnail(e.target.value)}
                              className="flex-1 px-3 py-2 text-[10px] rounded-xl border border-neutral-200 bg-white text-neutral-950 font-mono focus:outline-none focus:border-[#FF6A00] truncate"
                            />
                            <label className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[10px] font-sans rounded-xl border border-neutral-200 cursor-pointer flex items-center justify-center gap-1.5 transition-colors select-none font-medium text-center shrink-0">
                              Upload File
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const base64Url = event.target?.result as string;
                                      if (base64Url) {
                                        setThumbnail(base64Url);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        /* Bulk Canvas stickers multi-uploader dropzone with real-time stack view */
                        <div className="space-y-3 p-4 rounded-2xl border-2 border-dashed border-[#FF6A00]/30 bg-[#FF6A00]/2">
                          <div className="text-center py-4 relative">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files) {
                                  const filesArray = Array.from(e.target.files) as File[];
                                  filesArray.forEach((file: File) => {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const base64 = event.target?.result as string;
                                      if (base64) {
                                        setBulkFiles((prev) => [
                                          ...prev,
                                          { name: file.name, base64 }
                                        ]);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  });
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <div className="flex flex-col items-center justify-center pointer-events-none">
                              <span className="text-xl mb-1.5">📁</span>
                              <h4 className="text-[10px] font-bold text-neutral-800 uppercase tracking-wider font-sans">
                                Select or Drag Multiple Images
                              </h4>
                              <p className="text-[8px] text-neutral-400 font-mono uppercase tracking-widest mt-0.5">
                                png format with transparency works best
                              </p>
                            </div>
                          </div>

                          {bulkFiles.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-neutral-200">
                              <div className="flex items-center justify-between text-[8.5px] font-mono uppercase tracking-widest text-[#FF6A00] font-extrabold">
                                <span>Bulk upload queue ({bulkFiles.length})</span>
                                <button
                                  type="button"
                                  onClick={() => setBulkFiles([])}
                                  className="text-red-500 hover:text-red-700 underline text-[8px] uppercase tracking-wider font-bold cursor-pointer"
                                >
                                  Clear queue
                                </button>
                              </div>

                              <div className="grid grid-cols-4 gap-2 max-h-[140px] overflow-y-auto p-1.5 bg-white/70 rounded-xl border border-neutral-200">
                                {bulkFiles.map((file, bIdx) => (
                                  <div key={bIdx} className="relative aspect-square rounded-lg border border-neutral-250 bg-neutral-50 overflow-hidden group">
                                    <img
                                      src={file.base64}
                                      alt="bulk preview"
                                      className="w-full h-full object-contain"
                                      referrerPolicy="no-referrer"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setBulkFiles((prev) => prev.filter((_, i) => i !== bIdx))}
                                      className="absolute inset-0 bg-red-600/90 text-white text-[7px] uppercase font-mono tracking-widest font-black opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-center"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {activeAssetType !== "design" && !(activeAssetType === "exploration" && explorationMode === "bulk") && (
                      <div>
                        <label className="text-[8px] uppercase font-mono tracking-widest text-neutral-500 block">Streaming Video URL (.mp4 file link)</label>
                        <input
                          type="url"
                          placeholder="Optional video file URL"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          className="w-full mt-1 px-3 py-2 text-[10px] rounded-xl border border-neutral-200 bg-white text-neutral-950 font-mono focus:outline-none focus:border-[#FF6A00]"
                        />
                      </div>
                    )}

                    {/* Integrated Slides Management directly within active edit form for Design projects */}
                    {editingItemId && activeAssetType === "design" && (
                      <div className="space-y-3 pt-3 border-t border-neutral-100 bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-[#FF6A00] font-bold block">
                          Design Case Study Slides & Gallery Show
                        </span>
                        
                        <div
                          onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                          onDragLeave={() => setDragActive(false)}
                          onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files) processUploadedFiles(e.dataTransfer.files); }}
                          onClick={() => fileInputRef.current?.click()}
                          className={`p-5 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                            dragActive 
                              ? "border-[#FF6A00] bg-[#FF6A00]/5 text-black" 
                              : "border-neutral-300 hover:border-[#FF6A00]/40 bg-white hover:bg-neutral-50 text-neutral-500"
                          }`}
                        >
                          <UploadCloud className="h-5 w-5 text-[#FF6A00] mb-1.5" />
                          <span className="text-[9px] font-sans font-medium text-neutral-900 mb-0.5">Drag & Drop Slide Images</span>
                          <span className="text-[8px] font-mono uppercase tracking-wider text-neutral-400">or click to upload images</span>
                          <input
                            type="file"
                            ref={fileInputRef}
                            multiple
                            accept="image/*"
                            onChange={handleFileInputChange}
                            className="hidden"
                          />
                        </div>

                        {/* Add image to slides via URL */}
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="Append image to slides via remote URL link"
                            value={remoteGalleryUrl}
                            onChange={(e) => setRemoteGalleryUrl(e.target.value)}
                            className="flex-1 px-3 py-1.5 text-[9px] rounded-xl border border-neutral-250 bg-white text-neutral-950 font-mono focus:outline-none focus:border-[#FF6A00]"
                          />
                          <button
                            onClick={handleAddRemoteGalleryUrl}
                            type="button"
                            className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white text-[9px] uppercase tracking-widest font-mono rounded-xl cursor-pointer font-bold transition-all shrink-0"
                          >
                            Add URL
                          </button>
                        </div>

                        {/* Thumbnails of current active design slide images with reordering handles */}
                        <div>
                          <span className="text-[8px] uppercase tracking-widest font-mono text-neutral-500 block mb-1">
                            Gallery Images list ({designs.find(d => d.id === editingItemId)?.galleryImages?.length || 1})
                          </span>
                          <div className="grid grid-cols-4 gap-2 max-h-[160px] overflow-y-auto pr-1">
                            {(designs.find(d => d.id === editingItemId)?.galleryImages || [designs.find(d => d.id === editingItemId)?.image]).map((img: string, idx: number) => {
                              const galleryLength = (designs.find(d => d.id === editingItemId)?.galleryImages || [designs.find(d => d.id === editingItemId)?.image]).length;
                              return (
                                <div key={idx} className="relative aspect-square rounded-lg border border-neutral-200 overflow-hidden group bg-white shadow-3xs">
                                  <img src={img} alt="slide preview" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1 gap-1">
                                    <button
                                      onClick={() => deleteGalleryImage(idx)}
                                      type="button"
                                      className="p-1 w-full rounded bg-red-600 text-white text-[7px] font-mono uppercase tracking-widest hover:bg-red-700 transition-all cursor-pointer text-center"
                                    >
                                      Delete
                                    </button>
                                    <div className="flex gap-1 w-full">
                                      <button
                                        onClick={() => reorderGalleryImage(idx, "up")}
                                        disabled={idx === 0}
                                        type="button"
                                        className="flex-1 p-0.5 rounded bg-neutral-200 text-neutral-800 hover:bg-neutral-300 text-[8px] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer text-center font-bold"
                                        title="Move index left"
                                      >
                                        &lt;
                                      </button>
                                      <button
                                        onClick={() => reorderGalleryImage(idx, "down")}
                                        disabled={idx === galleryLength - 1}
                                        type="button"
                                        className="flex-1 p-0.5 rounded bg-neutral-200 text-neutral-800 hover:bg-neutral-300 text-[8px] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer text-center font-bold"
                                        title="Move index right"
                                      >
                                        &gt;
                                      </button>
                                    </div>
                                  </div>
                                  <span className="absolute bottom-1 right-1 px-1 py-[0.5px] rounded bg-white/90 border border-neutral-200 text-[6px] font-mono text-neutral-900 shadow-3xs">
                                    #{idx + 1}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-black text-white hover:bg-neutral-800 font-sans font-semibold text-[10px] uppercase tracking-widest cursor-pointer shadow-sm transition-all"
                    >
                      {editingItemId ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{editingItemId ? "Save Project Edits" : "Inbound Create Asset"}</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB CONTAINER 2: CREDENTIALS & BRANDING METADATA */}
            {consoleTab === "branding" && (
              <form onSubmit={handleUpdateBranding} className="space-y-4">
                <div>
                  <label className="text-[8px] uppercase font-mono tracking-widest text-neutral-500 block">Branded Portal Title (Navbar Brand)</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-950 focus:outline-none focus:border-[#FF6A00]"
                    placeholder="e.g. Sukunsh"
                  />
                </div>

                <div>
                  <label className="text-[8px] uppercase font-mono tracking-widest text-[#FF6A00] block font-bold">Sukunsh Logo Font</label>
                  <select
                    value={logoFontFamily}
                    onChange={(e) => setLogoFontFamily(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-950 focus:outline-none focus:border-[#FF6A00]"
                  >
                    {LOGO_FONT_OPTIONS.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                  <div
                    className="mt-2 border border-neutral-200 bg-neutral-50 px-3 py-3 text-3xl text-neutral-950"
                    style={getLogoFontStyle(logoFontFamily)}
                  >
                    Sukunsh.
                  </div>
                </div>

                <div>
                  <label className="text-[8px] uppercase font-mono tracking-widest text-neutral-500 block">Creator's Full Name (Credits & Copy)</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-950 focus:outline-none focus:border-[#FF6A00]"
                    placeholder="e.g. Suraj Kumar Sharma"
                  />
                </div>

                <div>
                  <label className="text-[8px] uppercase font-mono tracking-widest text-neutral-500 block">Contact Email address</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-950 focus:outline-none focus:border-[#FF6A00]"
                    placeholder="e.g. sukunsh2883@gmail.com"
                  />
                </div>

                <div>
                  <label className="text-[8px] uppercase font-mono tracking-widest text-neutral-500 block">Specialty Roles (comma-separated list)</label>
                  <textarea
                    rows={2}
                    value={rolesCSV}
                    onChange={(e) => setRolesCSV(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-950 focus:outline-none focus:border-[#FF6A00] [resize:none]"
                    placeholder="Visual Designer, AI Creative Specialist, Motion Editor"
                  />
                </div>

                <div>
                  <label className="text-[8px] uppercase font-mono tracking-widest text-neutral-500 block">About Me Biography Narrative</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white text-neutral-950 focus:outline-none focus:border-[#FF6A00] [resize:none]"
                    placeholder="Describe your design career narrative and creative motivations."
                  />
                </div>

                <div>
                  <label className="text-[8px] uppercase font-mono tracking-widest text-[#FF6A00] block font-bold">About Me Portrait Picture</label>
                  <div className="flex gap-2 items-center mt-1.5 p-2 rounded-xl border border-neutral-200 bg-neutral-50">
                    <div className="w-12 h-12 rounded-xl border border-neutral-250 bg-neutral-200 overflow-hidden shrink-0">
                      {aboutImage ? (
                        <img src={aboutImage} alt="About Portrait" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400 font-bold uppercase">No Pic</div>
                      )}
                    </div>
                    <div className="flex-grow space-y-1">
                      <input
                        type="text"
                        value={aboutImage}
                        onChange={(e) => setAboutImage(e.target.value)}
                        className="w-full px-3 py-1 text-[9px] rounded-lg border border-neutral-200 bg-white text-neutral-950 focus:outline-none focus:border-[#FF6A00]"
                        placeholder="Image URL or upload below"
                      />
                      <label className="inline-block px-2.5 py-1 rounded bg-neutral-200 border border-neutral-300 hover:bg-neutral-350 text-neutral-800 text-[8px] font-mono tracking-wider uppercase transition-colors cursor-pointer text-center">
                        Upload Photo File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const base64Url = event.target?.result as string;
                                if (base64Url) {
                                  setAboutImage(base64Url);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[8px] uppercase font-mono tracking-widest text-neutral-500 block">Hero Cinematic Video Streaming Loop Link</label>
                  <input
                    type="url"
                    value={heroVideoUrl}
                    onChange={(e) => setHeroVideoUrl(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-[10px] rounded-xl border border-neutral-200 bg-white text-neutral-950 font-mono focus:outline-none focus:border-[#FF6A00]"
                    placeholder="Video link to loop on hero section background"
                  />
                </div>

                {/* Hero section floating images uploader grid */}
                <div className="space-y-3 pt-3 border-t border-neutral-100">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#FF6A00] font-bold block">
                    Hero Hover Floating Images (6 Slots)
                  </span>
                  <p className="text-[8px] text-neutral-500 font-mono -mt-1 leading-normal">
                    Upload dynamic images (Base64) or specify custom URLs for the 6 parallax floating assets visible on mouse hover.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {heroImages.map((img, idx) => {
                      const DEFAULT_HERO_SLOTS = [
                        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1618005198143-d366800ee4ef?q=80&w=600&auto=format&fit=crop"
                      ];
                      return (
                        <div key={idx} className="relative aspect-square rounded-2xl border border-neutral-200 overflow-hidden group bg-white shadow-3xs hover:border-[#FF6A00]/60 transition-colors">
                          <img src={img} alt={`Slot ${idx + 1}`} className="w-full h-full object-cover" />
                          
                          {/* Hover action overlay */}
                          <div className="absolute inset-0 bg-neutral-950/85 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1.5 gap-1 text-white select-none">
                            <span className="text-[7.5px] font-mono text-neutral-400">SLOT {idx + 1}</span>
                            
                            <button
                              type="button"
                              onClick={() => {
                                const url = window.prompt(`Enter image URL for Hero Slot #${idx + 1}:`, img);
                                if (url !== null && url.trim()) {
                                  const updated = [...heroImages];
                                  updated[idx] = url.trim();
                                  setHeroImages(updated);
                                }
                              }}
                              className="w-full py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-[7.5px] font-mono uppercase tracking-widest transition-colors cursor-pointer text-center"
                            >
                              Edit URL
                            </button>
                            
                            <label className="w-full py-0.5 rounded bg-[#FF6A00] hover:bg-[#FF6A00]/80 text-white text-[7.5px] font-mono uppercase tracking-widest transition-colors cursor-pointer text-center block">
                              Upload
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const base64Url = event.target?.result as string;
                                      if (base64Url) {
                                        const updated = [...heroImages];
                                        updated[idx] = base64Url;
                                        setHeroImages(updated);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                            
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...heroImages];
                                updated[idx] = DEFAULT_HERO_SLOTS[idx];
                                setHeroImages(updated);
                              }}
                              className="w-full py-0.5 rounded bg-red-600/30 hover:bg-red-600/50 text-red-200 text-[6.5px] font-mono uppercase tracking-widest transition-colors cursor-pointer text-center"
                            >
                              Reset
                            </button>
                          </div>
                          
                          <span className="absolute bottom-1 right-1 px-1 py-[0.5px] rounded bg-black/70 border border-white/10 text-[6px] font-mono text-white pointer-events-none">
                            #{idx + 1}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-black text-white hover:bg-neutral-800 font-sans font-semibold text-[10px] uppercase tracking-widest cursor-pointer shadow-sm transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Update Branding Info</span>
                </button>
              </form>
            )}
              </>
            )}

            {/* Shield warning explanation */}
            <div className="p-2.5 gap-2 flex items-start text-[8px] text-neutral-500 font-mono leading-relaxed bg-neutral-50 rounded-xl border border-neutral-200 mt-6">
              <ShieldAlert className="h-4 w-4 text-[#FF6A00] shrink-0" />
              <span>
                CONSOLE FEEDBACK: Adding, editing, or deleting entries within this uploader panel instantly rewrites the active React portfolio lists and cascades updates in real-time.
              </span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Floating Button (Light Theme styled) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 rounded-full border border-neutral-200 px-5 py-3 hover:scale-105 active:scale-95 transition-all duration-300 bg-white text-neutral-950 shadow-lg cursor-pointer"
        style={{
          boxShadow: isOpen ? "0 4px 20px rgba(10, 132, 255, 0.25)" : "0 8px 30px rgba(0,0,0,0.06)"
        }}
        aria-label="Toggle admin controller deck"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6A00] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6A00]"></span>
        </span>
        <Settings className={`h-4 w-4 text-[#FF6A00] ${isOpen ? "rotate-90" : "group-hover:rotate-45"} transition-transform duration-500`} />
        <span className="text-[10px] tracking-widest uppercase font-mono font-bold text-neutral-900">
          {isOpen ? "Close Studio" : "Creator Studio"}
        </span>
      </button>

    </div>
  );
}
