"use client";

import { useState } from "react";

function isYouTube(url: string) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function getYouTubeId(url: string): string {
  const m = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return m ? m[1] : "";
}

export default function VideoGallery({ urls }: { urls: string[] }) {
  const [active, setActive] = useState(0);
  const current = urls[active];

  return (
    <div>
      <div className="relative aspect-video bg-black/50 overflow-hidden mb-4">
        {isYouTube(current) ? (
          <iframe
            key={current}
            src={`https://www.youtube.com/embed/${getYouTubeId(current)}`}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video key={current} src={current} controls className="absolute inset-0 w-full h-full object-contain" />
        )}
      </div>

      {urls.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {urls.map((url, i) => (
            <button
              key={url}
              onClick={() => setActive(i)}
              className={`shrink-0 px-5 py-3 text-[10px] tracking-[0.22em] uppercase border transition-colors duration-200 ${
                active === i
                  ? "border-red text-red bg-red/6"
                  : "border-white/10 text-white/35 hover:border-white/30 hover:text-white/60"
              }`}
            >
              ▶ Demo {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
