"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, Crop, Image as ImageIcon, RotateCw, Sliders, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type EditorTab = "filters" | "crop";
type FilterPreset = "natural" | "warm" | "cool" | "vivid" | "fade" | "bw";

interface FilterState {
  brightness: number; // 0–200 (100 = neutral)
  contrast: number;   // 0–200
  saturation: number; // 0–200
  preset: FilterPreset;
}

interface CropState {
  top: number;    // percent 0–50
  right: number;
  bottom: number;
  left: number;
}

export interface ImageUploadEditorProps {
  /** Label shown above the upload zone */
  label?: string;
  /** Short description of dimension/format requirements */
  requirements?: string;
  /** Aspect ratio hint, e.g. "16/9", "1/1", "4/3" */
  aspectHint?: string;
  /** Maximum file size in MB */
  maxMB?: number;
  /** Called with the final data-URL when user saves */
  onSave: (dataUrl: string) => void;
  /** Currently saved image URL (to show as preview) */
  value?: string;
  className?: string;
}

// ── Filter preset definitions ─────────────────────────────────────────────────

const PRESETS: { key: FilterPreset; label: string; brightness: number; contrast: number; saturation: number }[] = [
  { key: "natural", label: "Natural", brightness: 100, contrast: 100, saturation: 100 },
  { key: "warm",    label: "Warm",    brightness: 105, contrast: 102, saturation: 115 },
  { key: "cool",    label: "Cool",    brightness: 100, contrast: 105, saturation: 90 },
  { key: "vivid",   label: "Vivid",   brightness: 105, contrast: 115, saturation: 140 },
  { key: "fade",    label: "Fade",    brightness: 115, contrast: 85,  saturation: 70 },
  { key: "bw",      label: "B&W",     brightness: 100, contrast: 110, saturation: 0 },
];

function filterCss(f: FilterState): string {
  return `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%)`;
}

// ── Discard confirm dialog ────────────────────────────────────────────────────

function DiscardDialog({
  onDiscard,
  onReturn,
}: {
  onDiscard: () => void;
  onReturn: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
        <h3 className="text-lg font-semibold text-[var(--ms-charcoal)]">Discard changes?</h3>
        <p className="mt-2 text-sm leading-5 text-[var(--ms-mauve)]">
          Your edits (filters and crop) have not been saved. If you exit now they will be lost.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={onDiscard}
            className="rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Discard changes &amp; exit
          </button>
          <button
            type="button"
            onClick={onReturn}
            className="rounded-full border border-[var(--ms-border)] px-5 py-3 text-sm font-semibold text-[var(--ms-charcoal)] transition hover:border-[var(--ms-plum)] hover:text-[var(--ms-plum)]"
          >
            Return to edit
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ImageUploadEditor({
  label = "Upload image",
  requirements = "JPG or PNG · Min 800×600 · Max 5 MB",
  aspectHint,
  maxMB = 5,
  onSave,
  value,
  className,
}: ImageUploadEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"idle" | "editing">("idle");
  const [activeTab, setActiveTab] = useState<EditorTab>("filters");
  const [rawUrl, setRawUrl] = useState<string | null>(null);       // original file blob URL
  const [savedUrl, setSavedUrl] = useState<string | null>(value ?? null); // saved result
  const [showDiscard, setShowDiscard] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ w: number; h: number } | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    preset: "natural",
  });

  // Crop state (percentage inset from each edge)
  const [crop, setCrop] = useState<CropState>({ top: 0, right: 0, bottom: 0, left: 0 });

  // Track if user has made changes from defaults
  const hasEdits =
    filters.brightness !== 100 ||
    filters.contrast !== 100 ||
    filters.saturation !== 100 ||
    crop.top !== 0 ||
    crop.right !== 0 ||
    crop.bottom !== 0 ||
    crop.left !== 0;

  // ── File handling ────────────────────────────────────────────────────────

  function readFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > maxMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxMB} MB.`);
      return;
    }
    const url = URL.createObjectURL(file);
    // Check dimensions
    const img = new window.Image();
    img.onload = () => {
      setImageSize({ w: img.naturalWidth, h: img.naturalHeight });
      setRawUrl(url);
      setFilters({ brightness: 100, contrast: 100, saturation: 100, preset: "natural" });
      setCrop({ top: 0, right: 0, bottom: 0, left: 0 });
      setActiveTab("filters");
      setMode("editing");
    };
    img.src = url;
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  }

  // ── Apply preset ─────────────────────────────────────────────────────────

  function applyPreset(key: FilterPreset) {
    const preset = PRESETS.find((p) => p.key === key)!;
    setFilters({ brightness: preset.brightness, contrast: preset.contrast, saturation: preset.saturation, preset: key });
  }

  // ── Save: render canvas → dataURL ─────────────────────────────────────────

  function handleSave() {
    if (!rawUrl) return;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const srcW = img.naturalWidth;
      const srcH = img.naturalHeight;
      const cx = (crop.left / 100) * srcW;
      const cy = (crop.top / 100) * srcH;
      const cw = srcW - (crop.left / 100) * srcW - (crop.right / 100) * srcW;
      const ch = srcH - (crop.top / 100) * srcH - (crop.bottom / 100) * srcH;
      const canvas = canvasRef.current!;
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext("2d")!;
      // Apply CSS-equivalent filters via ctx.filter
      ctx.filter = filterCss(filters);
      ctx.drawImage(img, cx, cy, cw, ch, 0, 0, cw, ch);
      const result = canvas.toDataURL("image/jpeg", 0.92);
      setSavedUrl(result);
      onSave(result);
      setMode("idle");
    };
    img.src = rawUrl;
  }

  // ── Discard ───────────────────────────────────────────────────────────────

  function tryClose() {
    if (hasEdits) {
      setShowDiscard(true);
    } else {
      setMode("idle");
    }
  }

  function confirmDiscard() {
    setShowDiscard(false);
    setMode("idle");
    setRawUrl(null);
  }

  // ── Idle state: upload zone ───────────────────────────────────────────────

  if (mode === "idle") {
    return (
      <div className={className}>
        {label && (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ms-mauve)]">{label}</p>
        )}
        {requirements && (
          <p className="mb-2 text-[11px] text-[var(--ms-mauve)] opacity-70">{requirements}{aspectHint ? ` · Best ratio: ${aspectHint}` : ""}</p>
        )}
        <button
          type="button"
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative flex w-full flex-col items-center justify-center gap-3 rounded-[20px] border-2 border-dashed p-6 text-center transition",
            isDragging
              ? "border-[var(--ms-rose)] bg-[var(--ms-petal)]"
              : "border-[var(--ms-border)] bg-[var(--ms-soft-bg)] hover:border-[var(--ms-plum)]/40 hover:bg-white",
          )}
          style={{ minHeight: "160px" }}
        >
          {savedUrl ? (
            <>
              {/* Show saved thumbnail */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={savedUrl}
                alt="Uploaded"
                className="max-h-32 max-w-full rounded-[12px] object-contain shadow"
              />
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ms-plum)]">
                <Check className="h-4 w-4 text-emerald-500" />
                Image saved — click to replace
              </div>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ms-plum)]/10">
                <Upload className="h-6 w-6 text-[var(--ms-plum)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--ms-charcoal)]">
                  {isDragging ? "Drop it here" : "Tap to upload or drag & drop"}
                </p>
                <p className="mt-1 text-xs text-[var(--ms-mauve)]">{requirements}</p>
              </div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleFileInput}
          />
        </button>
        {error && (
          <p className="mt-1.5 text-xs text-red-500">{error}</p>
        )}
        {/* Hidden canvas for export */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  // ── Editing state ────────────────────────────────────────────────────────

  const previewFilter = filterCss(filters);
  const previewClip = `inset(${crop.top}% ${crop.right}% ${crop.bottom}% ${crop.left}%)`;

  return (
    <>
      {showDiscard && (
        <DiscardDialog
          onDiscard={confirmDiscard}
          onReturn={() => setShowDiscard(false)}
        />
      )}

      {/* Full-screen editor overlay */}
      <div
        className="fixed inset-0 z-[9000] flex flex-col bg-[#0d1b2a]"
        onClick={(e) => { if (e.target === e.currentTarget) tryClose(); }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <button
            type="button"
            onClick={tryClose}
            className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/20"
          >
            <X className="h-3.5 w-3.5" />
            Close
          </button>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
            Image editor
            {imageSize && (
              <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] normal-case text-white/40">
                {imageSize.w}×{imageSize.h}
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={tryClose}
            className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/20"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Return to edit
          </button>
        </div>

        {/* Image preview */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-6">
          {rawUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={rawUrl}
              alt="Preview"
              className="max-h-full max-w-full rounded-[12px] object-contain shadow-[0_16px_60px_rgba(0,0,0,0.5)]"
              style={{
                filter: previewFilter,
                clipPath: previewClip,
                transition: "filter 0.2s, clip-path 0.2s",
              }}
            />
          )}
        </div>

        {/* Bottom controls panel */}
        <div className="border-t border-white/10 bg-[#0d1b2a]">
          {/* Tab bar */}
          <div className="flex border-b border-white/10">
            {[
              { key: "filters" as EditorTab, icon: <Sliders className="h-4 w-4" />, label: "Filters" },
              { key: "crop" as EditorTab, icon: <Crop className="h-4 w-4" />, label: "Crop" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 py-3 text-xs font-semibold transition",
                  activeTab === t.key
                    ? "border-b-2 border-[var(--ms-rose)] text-white"
                    : "text-white/40 hover:text-white/70",
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          <div className="max-h-64 overflow-y-auto px-4 py-4">
            {activeTab === "filters" && (
              <div className="space-y-5">
                {/* Preset chips */}
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">Presets</p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {PRESETS.map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => applyPreset(p.key)}
                        className={cn(
                          "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                          filters.preset === p.key
                            ? "bg-[var(--ms-rose)] text-white"
                            : "bg-white/10 text-white/60 hover:bg-white/20",
                        )}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sliders */}
                {[
                  { label: "Brightness", key: "brightness" as const, min: 50, max: 150 },
                  { label: "Contrast",   key: "contrast"   as const, min: 50, max: 150 },
                  { label: "Saturation", key: "saturation" as const, min: 0,  max: 200 },
                ].map((slider) => (
                  <div key={slider.key}>
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-xs text-white/60">{slider.label}</p>
                      <p className="text-xs font-mono text-white/40">{filters[slider.key]}</p>
                    </div>
                    <input
                      type="range"
                      min={slider.min}
                      max={slider.max}
                      value={filters[slider.key]}
                      onChange={(e) =>
                        setFilters((f) => ({ ...f, [slider.key]: Number(e.target.value), preset: "natural" }))
                      }
                      className="w-full accent-[var(--ms-rose)]"
                    />
                  </div>
                ))}

                {/* Reset */}
                {hasEdits && (
                  <button
                    type="button"
                    onClick={() => {
                      applyPreset("natural");
                      setCrop({ top: 0, right: 0, bottom: 0, left: 0 });
                    }}
                    className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70"
                  >
                    <RotateCw className="h-3 w-3" />
                    Reset all edits
                  </button>
                )}
              </div>
            )}

            {activeTab === "crop" && (
              <div className="space-y-4">
                <p className="text-xs text-white/50">
                  Adjust the crop insets. Use 0 to keep the full edge, or increase to trim.
                </p>
                {[
                  { label: "Top trim", key: "top" as const },
                  { label: "Bottom trim", key: "bottom" as const },
                  { label: "Left trim", key: "left" as const },
                  { label: "Right trim", key: "right" as const },
                ].map((s) => (
                  <div key={s.key}>
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-xs text-white/60">{s.label}</p>
                      <p className="text-xs font-mono text-white/40">{crop[s.key]}%</p>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={crop[s.key]}
                      onChange={(e) => setCrop((c) => ({ ...c, [s.key]: Number(e.target.value) }))}
                      className="w-full accent-[var(--ms-rose)]"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setCrop({ top: 0, right: 0, bottom: 0, left: 0 })}
                  className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70"
                >
                  <RotateCw className="h-3 w-3" />
                  Reset crop
                </button>
              </div>
            )}
          </div>

          {/* Save / Return buttons */}
          <div className="flex gap-3 border-t border-white/10 px-4 py-4">
            <button
              type="button"
              onClick={tryClose}
              className="flex-1 rounded-full border border-white/20 py-3 text-sm font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
            >
              Return to edit
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-full bg-[var(--ms-rose)] py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Save image ✓
            </button>
          </div>
        </div>

        {/* Hidden canvas for export */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </>
  );
}
