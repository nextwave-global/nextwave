"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Link as LinkIcon } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  onUploaded?: (path: string) => void;
  onRemoved?: (path: string) => void;
  folder?: string;
  label?: string;
  placeholder?: string;
  aspect?: "square" | "portrait" | "wide";
}

export function ImageUpload({
  value,
  onChange,
  onUploaded,
  onRemoved,
  folder = "uploads",
  label,
  placeholder = "/events/flyer.jpg",
  aspect = "portrait",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);

  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "wide"
        ? "aspect-[16/9]"
        : "aspect-[4/5]";

  const handlePick = () => {
    inputRef.current?.click();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setUploadedPath(data.path);
      onChange(data.url);
      onUploaded?.(data.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    // If this was a fresh upload in this session, tell the parent so it can clean up
    if (uploadedPath) {
      onRemoved?.(uploadedPath);
      setUploadedPath(null);
    }
    onChange("");
  };

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-[#b8b0a8] mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />

      {value ? (
        <div className="relative">
          <div
            className={`relative w-full ${aspectClass} max-h-64 bg-[#0d0d0d] border border-[#333333] rounded-lg overflow-hidden`}
          >
            <Image
              src={value}
              alt="Uploaded"
              fill
              className="object-cover"
              sizes="300px"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-red-500 text-white rounded-full transition-colors touch-manipulation"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handlePick}
            disabled={uploading}
            className="absolute bottom-2 right-2 px-3 py-1.5 bg-black/70 hover:bg-[#c9a84c] hover:text-[#0d0d0d] text-white text-xs font-semibold rounded-full transition-colors touch-manipulation disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Replace"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handlePick}
          disabled={uploading}
          className={`w-full ${aspectClass} max-h-40 bg-[#0d0d0d] border-2 border-dashed border-[#333333] hover:border-[#c9a84c] rounded-lg flex flex-col items-center justify-center gap-2 transition-colors touch-manipulation disabled:opacity-50`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 text-[#c9a84c] animate-spin" />
              <span className="text-xs text-[#7a7270]">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 text-[#c9a84c]" />
              <span className="text-xs font-semibold text-white">
                Tap to upload
              </span>
              <span className="text-[10px] text-[#7a7270]">
                JPG, PNG, WEBP · max 5MB
              </span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-[10px] text-red-400 mt-1.5">{error}</p>}

      <button
        type="button"
        onClick={() => setShowUrl(!showUrl)}
        className="text-[10px] text-[#7a7270] hover:text-[#c9a84c] mt-1.5 flex items-center gap-1 touch-manipulation"
      >
        <LinkIcon className="w-3 h-3" />
        {showUrl ? "Hide URL field" : "Or paste a URL instead"}
      </button>

      {showUrl && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full mt-1.5 px-3 py-2 bg-[#0d0d0d] border border-[#333333] rounded-lg text-xs text-white placeholder:text-[#7a7270] focus:border-[#c9a84c] outline-none"
        />
      )}
    </div>
  );
}
