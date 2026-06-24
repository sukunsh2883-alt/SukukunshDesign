/**
 * Sukunsh - Creative Portfolio Data Engine
 * 
 * Edit this file to add more films, design projects, video reel archives, journals, and skill sets.
 * Supports HLS streaming and direct MP4/YouTube/Vimeo links.
 */

export interface AIFilm {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  thumbnail: string; // Replace with local path (e.g., "/projects/ai-film-1.jpg") or public URL
  videoUrl: string; // Paste your MP4 or HLS (.m3u8) video URL here, or YouTube/Vimeo links
  tags: string[];
  isAI?: boolean;
}

export interface DesignProject {
  id: string;
  title: string;
  type: string;
  year: string;
  description: string;
  image: string; // Replace with local path (e.g., "/projects/design-1.jpg") or public URL
  tools: string[];
  link: string;
  aboutProject?: string;
  client?: string;
  galleryImages?: string[];
  isAI?: boolean;
  pdfUrl?: string;
  uploadedPdfName?: string;
  behanceEmbedUrl?: string;
}

export interface VideoCard {
  id: string;
  title: string;
  format: "16:9" | "9:16";
  type: string;
  thumbnail: string; // Replace with local path (e.g., "/videos/video-1.jpg") or public URL
  videoUrl: string; // Direct video path or HLS/YouTube link
  duration: string;
  year: string;
  isAI?: boolean;
}

export interface JournalPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  image: string; // Replace with local path (e.g., "/journal/journal-1.jpg") or public URL
  content?: string;
}

export interface SkillCategory {
  title: string;
  items: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
}

// AI Film Works Section List
export const aiFilms: AIFilm[] = [
  {
    id: "ai-film-rivr-ad",
    title: "RIVR Ad Film",
    category: "AI Film / Product Ad",
    year: "2026",
    description: "AI-directed product film with cinematic ad pacing and polished commercial framing.",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780259813/RIVR_AD_Flim_ln2lz9.jpg",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780259813/RIVR_AD_Flim_ln2lz9.mp4",
    tags: ["AI Film", "Product Ad", "Commercial", "RIVR"],
    isAI: true
  },
  {
    id: "ai-film-extended-prompt",
    title: "Extended Prompt Film",
    category: "AI Film / Prompt Study",
    year: "2026",
    description: "Eight-second AI film study built from prompt extension and cinematic motion refinement.",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780260388/_extend_3______duration____8s____prompt___202605151502_2_ffqasy.jpg",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780260388/_extend_3______duration____8s____prompt___202605151502_2_ffqasy.mp4",
    tags: ["AI Film", "Prompt Study", "Cinematic"],
    isAI: true
  },
  {
    id: "ai-film-sequence-01-4",
    title: "Sequence 01 Film 04",
    category: "AI Film / Sequence",
    year: "2026",
    description: "Short cinematic AI sequence focused on atmosphere, timing, and visual continuity.",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780264965/Sequence_01_4_m7ijop.jpg",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780264965/Sequence_01_4_m7ijop.mp4",
    tags: ["AI Film", "Sequence", "Cinematic"],
    isAI: true
  },
  {
    id: "ai-film-1",
    title: "Hyper Motion Product Film",
    category: "AI Video / Product Ad",
    year: "2026",
    description: "Dynamic product storytelling using AI video generation, vector effects, and cinematic motion.",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-neon-lights-43958-large.mp4",
    tags: ["AI Video", "Product Film", "Motion", "Ads"]
  },
  {
    id: "ai-film-2",
    title: "Cinematic Brand Visual",
    category: "AI Film / Brand Story",
    year: "2026",
    description: "A cinematic AI-generated brand film with dramatic lighting, movement, and storytelling.",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-neon-light-from-a-tunnel-in-a-futuristic-city-43282-large.mp4",
    tags: ["Brand", "AI Film", "Cinematic", "Branding"]
  },
  {
    id: "ai-film-music-video",
    title: "Synthwave AI Music Journey",
    category: "AI Music Video",
    year: "2026",
    description: "Retro-futuristic music video using prompt-guided clip loops, neon light streams, and audio-reactive pacing.",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-32115-large.mp4",
    tags: ["Music Video", "Synthwave", "AI Video"]
  },
  {
    id: "ai-film-3",
    title: "Storyboard to AI Film",
    category: "Storyboard / Motion",
    year: "2026",
    description: "Visual storytelling experiment moving from storyboard frames to AI-generated motion.",
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-32115-large.mp4",
    tags: ["Storyboard", "Motion", "AI", "Story"]
  },
  {
    id: "ai-film-action",
    title: "Neon Heist Tokyo Sequence",
    category: "AI Action Sequence",
    year: "2026",
    description: "High-octane dramatic action sequence rendered in a cinematic cyberpunk Tokyo utilizing extreme camera pans.",
    thumbnail: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-look-of-a-woman-neon-lighting-43284-large.mp4",
    tags: ["Action", "AI Film", "Cyberpunk"]
  },
  {
    id: "ai-film-glass-bottle",
    title: "Cyber Glass Bottle Concept",
    category: "AI Packaging Design",
    year: "2026",
    description: "Glass fluid material simulation of standard beverage containers casting realistic colored shadows.",
    thumbnail: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-metallic-fluid-flow-abstract-texture-40078-large.mp4",
    tags: ["Packaging", "AI Design", "3D"]
  },
  {
    id: "ai-film-poster-art",
    title: "Chroma Monolith Poster",
    category: "AI Poster Art",
    year: "2026",
    description: "Prismatic graphic posters designed by fusing Midjourney layout queries with custom vector typography.",
    thumbnail: "https://images.unsplash.com/photo-1618005198143-d366800ee4ef?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-spinning-metallic-object-shining-abstract-animation-40082-large.mp4",
    tags: ["Poster", "AI Design", "Typography"]
  },
  {
    id: "ai-film-ad-poster",
    title: "Midnight Energy Ad Campaign",
    category: "Ad Poster Design",
    year: "2026",
    description: "Futuristic commercial poster layouts for an experimental midnight beverage brand showing extreme fluid mechanics.",
    thumbnail: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-mysterious-neon-lights-in-rainy-city-streets-43288-large.mp4",
    tags: ["Ad Poster", "Ads", "Design"]
  }
];

// Selected Design Works List
export const designProjects: DesignProject[] = [
  {
    id: "AI film",
    title: "Ai short Film",
    type: "Film",
    year: "2026",
    description: "Academic photo communication study capturing extreme body elasticity, suspension leaps, and somatic contour lighting.",
    image: "https://res.cloudinary.com/dylv5m3jk/image/upload/v1782300043/Slide_16_9_-_28_dy5t4r.png",
    tools: ["Studio Spotlight Rigging", "Motion Capture", "Contrast Optimization", "Academic Layouts"],
    link: "mailto:sukunsh3882@gmail.com",
    client: "College of Art, Delhi University",
    aboutProject: "Action photography is an incredibly exciting genre to shoot. Under the guidance of Mr. Parveen Kumar, the study explores body contouring using high-density side lighting and extreme raw athleticism. It illustrates suspension, equilibrium, and spatial trajectory transitions in darkness.",
    galleryImages: [
      "https://res.cloudinary.com/dylv5m3jk/image/upload/v1782300043/Slide_16_9_-_28_dy5t4r.png",
      "https://res.cloudinary.com/dylv5m3jk/image/upload/v1782300043/Slide_16_9_-_28_dy5t4r.png",
      "https://res.cloudinary.com/dylv5m3jk/image/upload/v1782300043/Slide_16_9_-_28_dy5t4r.png"
    ]
  },
  {
    id: "design-illustrative-riso",
    title: "Risography Welcome Cards",
    type: "Illustration / Print",
    year: "2025",
    description: "Designed, layered, and printed welcome cards and children's book illustrations using tactile Risography duplicators.",
    image: "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056275/image_41_knefoc.png",
    tools: ["Riso Print", "Sourcing Ink", "Figma", "Illustrator"],
    link: "https://www.behance.net/sukunshsharma",
    client: "IDC, IIT Bombay",
    aboutProject: "A physical illustration study. We crafted layered stencil assets which were processed straight via screen-printing mechanics on natural-toned cardstocks using botanical ink bases.",
    galleryImages: [
      "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056275/image_41_knefoc.png",
      "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "design-kinetic-motion",
    title: "Fluid Kinetic Promo Loop",
    type: "Motion Design / Video",
    year: "2026",
    description: "Branded after-effects motion sequence showcasing complex layout transformations and typography transitions.",
    image: "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056274/image_36_hyojxm.png",
    tools: ["After Effects", "Illustrator", "Premiere Pro"],
    link: "https://www.behance.net/sukunshsharma",
    client: "ShareChat Creative Lab",
    aboutProject: "Creating continuous loops that demonstrate fluid transformation of flat geometric assets into 3D isometric typography configurations in line with modern marketing trends.",
    galleryImages: [
      "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056274/image_36_hyojxm.png",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "design-1",
    title: "Brand Identity Layouts",
    type: "Branding",
    year: "2026",
    description: "Visual identity system with strong typography, color accent schemes, and cinematic brand guidelines.",
    image: "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_33_lku3qb.png",
    tools: ["Photoshop", "Illustrator", "Figma"],
    link: "https://www.behance.net/sukunshsharma",
    client: "Sukunsh Labs Inc.",
    aboutProject: "A comprehensive core visual identity structure created to bridge corporate architecture with premium cinematic brand directives. The design relies heavily on grid alignment systems, technical display spacing, and fluid ink-based textures.",
    galleryImages: [
      "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_33_lku3qb.png",
      "https://images.unsplash.com/photo-1581291518655-9523c932dedf?q=80&w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "design-monogram-logos",
    title: "Minimal Monogram logos",
    type: "Logo Design",
    year: "2025",
    description: "Fusing geometric monolith layouts with elegant calligraphy forms to compile responsive, modern corporate logo designs.",
    image: "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_37_mqlouw.png",
    tools: ["Illustrator", "Grids", "Inking"],
    link: "https://www.behance.net/sukunshsharma",
    client: "Sukunsh Design Studio",
    aboutProject: "An exploration into logo responsiveness. The mono-line grid is fully optimized to stay perfectly visible at massive billboard sizes or tiny 16px digital screen corners.",
    galleryImages: [
      "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_37_mqlouw.png"
    ]
  },
  {
    id: "design-earthquake-map",
    title: "Disaster Pedagogy Map",
    type: "Infographic Design",
    year: "2025",
    description: "High-density evacuation map illustrating structural weak zones and safe evacuation vectors through clear infographics.",
    image: "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_34_xopufv.png",
    tools: ["Figma", "Illustrator", "Evagenerate"],
    link: "https://www.behance.net/sukunshsharma",
    client: "National Earthquake Society",
    aboutProject: "Developing clear directions and easy-to-digest symbols representing structural threats, exit pathways, and response coordinates.",
    galleryImages: [
      "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_34_xopufv.png"
    ]
  },
  {
    id: "design-character-anim",
    title: "Neuro 2D Character Run",
    type: "Animation",
    year: "2025",
    description: "A frame-by-frame 2D hand-drawn character run-cycle highlighting fluid action, clothes inertia, and wind drag.",
    image: "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_35_st0j6w.png",
    tools: ["Animate CC", "Photoshop", "Procreate"],
    link: "https://www.behance.net/sukunshsharma",
    client: "Freelance Editorial Study",
    aboutProject: "Studying weight and balance in keyframes, drafting timing charts, and tracking joint markers to make the overall character motion feel deeply realistic and smooth.",
    galleryImages: [
      "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056273/image_35_st0j6w.png"
    ]
  },
  {
    id: "design-pw-socials",
    title: "PW Campaign Creatives",
    type: "Social Media Post Design",
    year: "2023",
    description: "Branded visual layout posts, banners, and advertising composites designed for extensive digital distribution lists.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
    tools: ["Photoshop", "Illustrator", "Color Theory"],
    link: "https://www.behance.net/sukunshsharma",
    client: "Physics Wallah",
    aboutProject: "A high-intensity campaign post-design system requiring fast visual alignment, readable call-out boxes, and engaging scientific graphics for social channels.",
    galleryImages: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "design-2",
    title: "Typographic Children’s Book",
    type: "Publication / Typography",
    year: "2025",
    description: "A storytelling format where expressive, kinetic typography replaces traditional illustration structures.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop",
    tools: ["Typography", "Layout", "Print"],
    link: "https://www.behance.net/sukunshsharma",
    client: "National Typography Press",
    aboutProject: "Rather than taking illustrations for granted, this typographic children's book treats words as live, breathing structural architecture that conveys tone, fear, scale, and joy.",
    galleryImages: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "design-eco-box",
    title: "Aftershock Board Packaging",
    type: "Packaging Design",
    year: "2025",
    description: "Eco-friendly cardboard structural packaging layouts complete with custom inner separation dividers and rules boxes.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
    tools: ["Boxes Blueprint", "Illustrator", "Sustainability Studies"],
    link: "https://www.behance.net/sukunshsharma",
    client: "Sukunsh Boardgames Studio",
    aboutProject: "A premium structural packaging study designed with recycled boardstock. The box cover uses heavy industrial line-weights and a custom screen-printed yellow neon color accent.",
    galleryImages: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "design-3",
    title: "Aftershock: Escape the Quake",
    type: "Board Game / Academic Project",
    year: "2025",
    description: "A comprehensive board game simulating real-world earthquake evacuation scenarios through strategic pedagogy.",
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=1200&auto=format&fit=crop",
    tools: ["Game Design", "Visual Design", "Storytelling"],
    link: "https://www.behance.net/sukunshsharma",
    client: "Sukunsh Studio Studies",
    aboutProject: "Aftershock structures disaster pedagogy as a dynamic physical board game. Our purpose was to create intuitive instructions, modular layouts, and visual rules cards.",
    galleryImages: [
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "design-4",
    title: "AI Virtual Gifts & UI",
    type: "AI Visual Design",
    year: "2026",
    description: "AI-powered custom gifts, glass UI materials, and interface assets modeled for maximum digital engagement.",
    image: "https://images.unsplash.com/photo-1618005198143-d366800ee4ef?q=80&w=1200&auto=format&fit=crop",
    tools: ["AI Design", "UI Assets", "Branding"],
    link: "https://www.behance.net/sukunshsharma",
    client: "ShareChat & Moj Inc.",
    aboutProject: "A study on design elements representing digital collectibles, virtual gifting mechanisms, and translucent materials.",
    galleryImages: [
      "https://images.unsplash.com/photo-1618005198143-d366800ee4ef?q=80&w=1200&auto=format&fit=crop"
    ]
  }
];

// Motion Archive Section List
export const videos: VideoCard[] = [
  {
    id: "video-kenerate-ad",
    title: "Kenerate Ad Reel",
    format: "9:16",
    type: "AI Ad Reel",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780260451/kenerate-ad-1779796765745_1_njywwd.jpg",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780260451/kenerate-ad-1779796765745_1_njywwd.mp4",
    duration: "00:15",
    year: "2026",
    isAI: true
  },
  {
    id: "video-sequence-01-5",
    title: "Sequence 01 Ad Reel",
    format: "9:16",
    type: "AI Ad Reel",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780260423/Sequence_01_5_ktappc.jpg",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780260423/Sequence_01_5_ktappc.mp4",
    duration: "00:15",
    year: "2026",
    isAI: true
  },
  {
    id: "video-sequence-01-6",
    title: "Sequence 01 Reel 06",
    format: "9:16",
    type: "AI Ad Reel",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780260408/Sequence_01_6_c32bs3.jpg",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780260408/Sequence_01_6_c32bs3.mp4",
    duration: "00:15",
    year: "2026",
    isAI: true
  },
  {
    id: "video-kenerate-ad-02",
    title: "Kenerate Ad Reel 02",
    format: "9:16",
    type: "AI Ad Reel",
    thumbnail: "https://res.cloudinary.com/dylv5m3jk/video/upload/so_0,q_auto,f_jpg/v1780264091/kenerate-ad-1779833779917_w0ndh7.jpg",
    videoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/q_auto/f_auto/v1780264091/kenerate-ad-1779833779917_w0ndh7.mp4",
    duration: "00:15",
    year: "2026",
    isAI: true
  },
  {
    id: "video-1",
    title: "AI Product Ad Reel",
    format: "16:9",
    type: "AI Ad",
    // Replace "/videos/video-1.jpg" with your own image when ready. Public CDN URL used as a high-quality fallback.
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-look-of-a-woman-neon-lighting-43284-large.mp4",
    duration: "00:15",
    year: "2026"
  },
  {
    id: "video-2",
    title: "Motion Poster Experiment",
    format: "9:16",
    type: "Motion Design",
    // Replace "/videos/video-2.jpg" with your own image when ready. Public CDN URL used as a high-quality fallback.
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-spinning-metallic-object-shining-abstract-animation-40082-large.mp4",
    duration: "00:10",
    year: "2026"
  },
  {
    id: "video-3",
    title: "Cinematic Visual Test",
    format: "16:9",
    type: "AI Film",
    // Replace "/videos/video-3.jpg" with your own image when ready. Public CDN URL used as a high-quality fallback.
    thumbnail: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-mysterious-neon-lights-in-rainy-city-streets-43288-large.mp4",
    duration: "00:20",
    year: "2026"
  }
];

// Explorations Section List
export interface ExplorationItem {
  id: string;
  title: string;
  imageUrl: string;
  rotation: string;
  yOffset: string;
}

export const explorations: ExplorationItem[] = [
  {
    id: "exp-1",
    title: "Abstract Chrome Fluid",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    rotation: "-6deg",
    yOffset: "0px"
  },
  {
    id: "exp-2",
    title: "Cinematic Fog Study",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    rotation: "4deg",
    yOffset: "60px"
  },
  {
    id: "exp-3",
    title: "Surreal Mirror Portal",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop",
    rotation: "-3deg",
    yOffset: "-40px"
  },
  {
    id: "exp-4",
    title: "Neon Cinematic Transit",
    imageUrl: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=800&auto=format&fit=crop",
    rotation: "5deg",
    yOffset: "200px"
  },
  {
    id: "exp-5",
    title: "Character Storyboard Concept",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    rotation: "-5deg",
    yOffset: "120px"
  },
  {
    id: "exp-6",
    title: "Dark Cyberpunk Horizon",
    imageUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop",
    rotation: "3deg",
    yOffset: "250px"
  }
];

// Recent Journal Posts
export const journalPosts: JournalPost[] = [
  {
    id: "journal-1",
    title: "How AI is changing visual design workflows",
    date: "2026",
    readTime: "4 min read",
    // Replace "/journal/journal-1.jpg" with your own image when ready. Public CDN URL used as a fallback.
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "journal-2",
    title: "Designing cinematic product ads with generative video",
    date: "2026",
    readTime: "5 min read",
    // Replace "/journal/journal-2.jpg" with your own image when ready. Public CDN URL used as a fallback.
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "journal-3",
    title: "From storyboard frames to full AI cinema reels",
    date: "2026",
    readTime: "3 min read",
    // Replace "/journal/journal-3.jpg" with your own image when ready. Public CDN URL used as a fallback.
    image: "https://images.unsplash.com/photo-1542204172-e7052809a86e?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "journal-4",
    title: "Why typography still matters in AI visual direction",
    date: "2026",
    readTime: "4 min read",
    // Replace "/journal/journal-4.jpg" with your own image when ready. Public CDN URL used as a fallback.
    image: "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=800&auto=format&fit=crop"
  }
];

// Professional Credentials
export const education: EducationItem[] = [
  {
    degree: "M.Des. Communication Design",
    institution: "IDC, IIT Bombay"
  },
  {
    degree: "B.F.A. Visual Communication",
    institution: "College of Art, Delhi University"
  }
];

export const experience: ExperienceItem[] = [
  {
    role: "AI Visual Design Intern",
    company: "ShareChat & Moj"
  },
  {
    role: "Freelance Graphic Designer",
    company: "Physics Wallah"
  },
  {
    role: "Graphic Designer & Video Editor",
    company: "Radiation Education"
  }
];

export const skills: string[] = [
  "Branding",
  "Visual Design",
  "UI/UX Design",
  "Motion Graphics",
  "Video Editing",
  "AI Image Generation",
  "AI Video Generation",
  "Prompt Design",
  "2D/3D Illustration",
  "Storyboarding",
  "Typography",
  "Packaging Design",
  "Publication Design",
  "Cinematography",
  "Sound Design"
];

export const software: string[] = [
  "Photoshop",
  "Illustrator",
  "Figma",
  "After Effects",
  "Premiere Pro",
  "Lightroom",
  "Animate",
  "Autodesk Maya",
  "Procreate"
];

export const RESUME_CATEGORIES = [
  "Branding",
  "Visual Design",
  "UI/UX Design",
  "Typographic Design",
  "Illustration (2D & 3D)",
  "Storyboarding",
  "Packaging Design",
  "Publication Design",
  "Motion Graphics",
  "Video Editing",
  "2D Animation",
  "Cinematography",
  "Sound Design",
  "AI Image & Video Generation",
  "Prompt Design & Optimization",
  "Rapid Visual Prototyping",
  "Fine Art Photography",
  "AI Video / Product Ad",
  "AI Film / Brand Story",
  "Academic Project"
];

// Profile Details
export const profile = {
  fullName: "Suraj Kumar Sharma",
  brandName: "Sukunsh",
  roles: [
    "Visual Designer",
    "AI Creative Designer",
    "Motion Designer",
    "Storyboard Artist",
    "AI Film Creator"
  ],
  bio: "Suraj Kumar Sharma is a Visual Designer and AI Creative Designer with deep experience in branding, motion graphics, UI design, AI-assisted creative workflows, video editing, storyboarding, typography, and visual storytelling.",
  email: "sukunsh2883@gmail.com",
  linkedin: "https://www.linkedin.com/in/sukunsh",
  behance: "https://www.behance.net/sukunshsharma",
  accentGradient: "linear-gradient(90deg, #FF6A00 0%, #FFB000 100%)",
  logoFontFamily: "\"Sukunsh Wordmark\", \"Clash Display Local\", \"Arial Black\", Impact, sans-serif",
  heroVideoUrl: "https://res.cloudinary.com/dylv5m3jk/video/upload/v1779644211/make_give_bit_loop_motion_202605242304_vd4fkj.mp4",
  aboutImage: "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056275/image_39_obkaf2.png",
  aboutImageSecondary: "https://res.cloudinary.com/dylv5m3jk/image/upload/q_auto/f_auto/v1782056275/image_42_z0hjbd.png"
};
