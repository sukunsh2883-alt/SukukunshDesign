import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { JournalPost } from "../portfolioData";

interface JournalProps {
  posts: JournalPost[];
}

export default function Journal({ posts }: JournalProps) {
  return (
    <section id="journal" className="py-16 md:py-24 bg-white border-t border-neutral-200 relative">
      
      {/* Background Soft Glow */}
      <div className="absolute top-[40%] left-[5%] w-[400px] h-[400px] rounded-full bg-[#FF6A00]/2 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-20 text-center mx-auto">
          <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#FF6A00] font-semibold block mb-3">
            Digital Logbook
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight text-neutral-900 leading-[1.12] mb-6">
            Recent <span className="font-serif italic text-accent-gradient font-light">thoughts</span>
          </h2>
          <p className="text-sm text-neutral-600 font-sans tracking-wide leading-relaxed max-w-xl mx-auto">
            Essays and documentation observing the intersection of artificial intelligence, cinematic camera direction, and expressive human layout design.
          </p>
        </div>

        {/* Horizontal Card Pills Stack */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.a
              key={post.id}
              href="https://www.behance.net/sukunshsharma"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-neutral-50/50 hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-350 rounded-xl sm:rounded-full transition-all duration-300 gap-4 shadow-2xs"
            >
              <div className="flex items-center gap-4">
                {/* Post Image Thumbnail */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-full overflow-hidden flex-shrink-0 bg-neutral-100 border border-neutral-200 shadow-2xs">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Primary Content fields */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-[#FF6A00] tracking-wider uppercase font-semibold">
                      Insight Post
                    </span>
                    <span className="text-[10px] text-neutral-300 font-mono">/</span>
                    <span className="text-[9px] font-mono text-neutral-500 tracking-tight">{post.readTime}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-serif italic text-neutral-800 group-hover:text-neutral-950 leading-tight tracking-wide transition-colors">
                    {post.title}
                  </h3>
                </div>
              </div>

              {/* Action metadata with moving arrow */}
              <div className="flex items-center justify-between sm:justify-end gap-4 px-2 sm:px-0 border-t border-neutral-200 sm:border-0 pt-3 sm:pt-0">
                <span className="text-[10px] font-mono text-neutral-500 group-hover:text-neutral-800 transition-colors">
                  {post.date}
                </span>
                
                <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-800 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900 transition-all duration-300 shadow-2xs">
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </div>
              </div>

            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}
