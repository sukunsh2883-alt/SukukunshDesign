import { Compass, Sparkles, Layers, Sliders } from "lucide-react";
import { motion } from "motion/react";

const STEPS = [
  {
    step: "01",
    title: "Concept & Story",
    description: "Turning raw creative ideas into formatted moodboards, screenplays, custom story references, and cinematic design directions.",
    icon: Compass,
  },
  {
    step: "02",
    title: "Prompt & AI Direction",
    description: "Designing targeted image and video prompts, frame-by-frame style guides, seed controls, camera movements, and model pipeline workflows.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Design & Motion",
    description: "Creating premium vector brand visuals, complex fluid glass UI systems, kinetic typography layouts, motion graphics, and editorial video cuts.",
    icon: Layers,
  },
  {
    step: "04",
    title: "Final Polish",
    description: "Color grading, subtle sound design layering, pacing correction, typography adjustments, upscale resolutions, and production delivery.",
    icon: Sliders,
  },
];

export default function Process() {
  return (
    <section id="process" className="py-16 md:py-24 bg-white relative overflow-hidden">
      
      {/* Background soft ambient glowing light */}
      <div className="absolute bottom-[10%] right-[-10%] w-[380px] h-[380px] rounded-full bg-[#FF6A00]/2 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#FF6A00] font-semibold block mb-3">
            Workflow Methodology
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight text-neutral-900 leading-[1.15] mb-6">
            How I <span className="font-serif italic text-accent-gradient font-light">build visuals</span>
          </h2>
          <p className="text-sm md:text-base text-neutral-600 font-sans tracking-wide leading-relaxed">
            Integrating advanced AI generation pipelines with classical graphic design principles, motion aesthetics, and high-fidelity video production techniques.
          </p>
        </div>

        {/* Process Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((stepItem, index) => {
            const IconComponent = stepItem.icon;
            return (
              <motion.div
                key={stepItem.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className="liquid-glass rounded-2xl p-8 border border-neutral-200 bg-neutral-50/50 group hover:bleed-glass hover:bg-neutral-50/90 hover:border-neutral-350 transition-all duration-350 cursor-default shadow-2xs"
              >
                {/* Glowing Top line spacer */}
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-800 group-hover:bg-neutral-900 group-hover:text-white transition-all duration-300 shadow-2xs">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-mono text-zinc-500 group-hover:text-[#FF6A00] font-semibold transition-colors duration-350">
                    {stepItem.step}
                  </span>
                </div>

                {/* Card description */}
                <div className="space-y-3">
                  <h3 className="text-lg font-serif italic text-neutral-900 tracking-wide group-hover:text-black transition-colors">
                    {stepItem.title}
                  </h3>
                  <p className="text-xs text-neutral-600 font-sans tracking-wide leading-relaxed">
                    {stepItem.description}
                  </p>
                </div>

                {/* Animated progress underline track */}
                <div className="mt-8 h-[1px] w-full bg-neutral-200 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-full accent-gradient origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
