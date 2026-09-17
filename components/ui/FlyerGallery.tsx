"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

interface Props {
  images: string[];
  alt?: string;
}

export function FlyerGallery({ images, alt = "Event flyer" }: Props) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images || images.length === 0) return null;

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  const single = images.length === 1;

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-[#0d0d0d] rounded-2xl overflow-hidden border border-[#333333] group">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={images[index]}
                alt={`${alt} ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority={index === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Zoom button */}
          <button
            onClick={() => setLightbox(true)}
            className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-sm hover:bg-[#c9a84c] hover:text-[#0d0d0d] text-white rounded-full transition-all touch-manipulation"
            aria-label="Zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Nav arrows */}
          {!single && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 backdrop-blur-sm hover:bg-[#c9a84c] hover:text-[#0d0d0d] text-white rounded-full transition-all touch-manipulation"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 backdrop-blur-sm hover:bg-[#c9a84c] hover:text-[#0d0d0d] text-white rounded-full transition-all touch-manipulation"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Counter */}
          {!single && (
            <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
              {index + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {!single && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-custom">
            {images.map((img, i) => (
              <button
                key={img + i}
                onClick={() => setIndex(i)}
                className={`relative w-16 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all touch-manipulation ${
                  i === index
                    ? "border-[#c9a84c]"
                    : "border-[#333333] hover:border-[#555]"
                }`}
                aria-label={`View flyer ${i + 1}`}
              >
                <Image
                  src={img}
                  alt={`${alt} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-4 right-4 p-3 text-white hover:text-[#c9a84c] transition-colors touch-manipulation"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <div
              className="relative max-w-4xl w-full max-h-[90vh] aspect-[4/5]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[index]}
                alt={`${alt} ${index + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
            {!single && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur hover:bg-[#c9a84c] hover:text-[#0d0d0d] text-white rounded-full transition-all touch-manipulation"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur hover:bg-[#c9a84c] hover:text-[#0d0d0d] text-white rounded-full transition-all touch-manipulation"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-custom::-webkit-scrollbar {
          height: 3px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #c9a84c;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}
