import { ExplorationItem } from "../portfolioData";

interface ExplorationsProps {
  onSelectImage: (item: { imageUrl: string; title: string }) => void;
  explorations: ExplorationItem[];
}

export default function Explorations({ onSelectImage, explorations }: ExplorationsProps) {
  return (
    <section id="explorations" className="hidden bg-[#080808] px-3 py-5 text-white md:block md:px-4 md:py-12">
      <div className="mx-auto max-w-5xl border-b border-white/10 pb-10">
        <div className="mx-8 grid grid-cols-6 gap-2">
          {explorations.slice(0, 6).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectImage({ imageUrl: item.imageUrl, title: item.title })}
              className="aspect-square bg-[#d9d9d9] transition-colors hover:bg-[#FF6A00]"
              aria-label={item.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
