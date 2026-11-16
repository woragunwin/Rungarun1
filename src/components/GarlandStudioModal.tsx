import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  RotateCcw,
  Sparkles,
  Undo2,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  BEAD_COUNT,
  FLOWER_CATALOG,
  FlowerType,
  GARLAND_STYLES,
  GarlandStyleId,
} from '../types';
import { FlowerBeadIcon, InteractiveThreadingCord } from './ThaiGarlandSvg';

interface GarlandStudioModalProps {
  isOpen: boolean;
  initialStyle: GarlandStyleId;
  initialFlowers: FlowerType[];
  onClose: () => void;
  onCompleteGarland: (style: GarlandStyleId, flowers: FlowerType[]) => void;
}

function playSoftBeadChime(stepIndex: number, isComplete: boolean) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const notes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    const freq = isComplete ? 1046.5 : notes[stepIndex % notes.length];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (isComplete ? 0.45 : 0.2));

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + (isComplete ? 0.5 : 0.22));
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 600);
  } catch {
    // Ignore audio context restrictions
  }
}

export const GarlandStudioModal: React.FC<GarlandStudioModalProps> = ({
  isOpen,
  initialStyle,
  initialFlowers,
  onClose,
  onCompleteGarland,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<GarlandStyleId>(initialStyle);
  const [flowers, setFlowers] = useState<FlowerType[]>(initialFlowers);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAutoThreading, setIsAutoThreading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedStyle(initialStyle);
      setFlowers(initialFlowers);
      setIsAutoThreading(false);
    }
  }, [isOpen, initialStyle, initialFlowers]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const activeStyleInfo =
    GARLAND_STYLES.find((s) => s.id === selectedStyle) || GARLAND_STYLES[0];
  const isComplete = flowers.length === BEAD_COUNT;

  useEffect(() => {
    if (!isAutoThreading || !isOpen) return;
    if (flowers.length >= BEAD_COUNT) {
      setIsAutoThreading(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setFlowers((prev) => {
        if (prev.length >= BEAD_COUNT) return prev;
        const nextFlower = activeStyleInfo.recommendedFlowers[prev.length] || 'jasmine_double';
        const next = [...prev, nextFlower];
        if (soundEnabled) {
          playSoftBeadChime(next.length - 1, next.length === BEAD_COUNT);
        }
        return next;
      });
    }, 140);

    return () => window.clearTimeout(timer);
  }, [isAutoThreading, isOpen, flowers.length, activeStyleInfo, soundEnabled]);

  if (!isOpen) return null;

  const handleAddFlower = (type: FlowerType) => {
    if (flowers.length >= BEAD_COUNT || isAutoThreading) return;
    const next = [...flowers, type];
    setFlowers(next);
    if (soundEnabled) {
      playSoftBeadChime(next.length - 1, next.length === BEAD_COUNT);
    }
  };

  const handleUndo = () => {
    setIsAutoThreading(false);
    if (flowers.length === 0) return;
    setFlowers((prev) => prev.slice(0, -1));
  };

  const handleReset = () => {
    setIsAutoThreading(false);
    setFlowers([]);
  };

  const handleFillRecommended = () => {
    if (flowers.length >= BEAD_COUNT) return;
    setIsAutoThreading(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1F1A14]/65 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="studio-modal-title"
    >
      <div className="relative w-full max-w-5xl bg-[#FBF8F1] border border-[#D4C3A3] rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Studio Header */}
        <div className="flex items-center justify-between gap-4 px-5 sm:px-7 py-4 bg-[#F5EFE2] border-b border-[#DFD3BC]">
          <div>
            <p className="text-xs text-[#7A6A56]">
              ขั้นตอนที่ 1 · เลือกแบบพวงมาลัยและร้อยดอกไม้ทีละเม็ดตามเชือก
            </p>
            <h2
              id="studio-modal-title"
              className="font-display text-xl sm:text-2xl font-bold text-[#1F1A14]"
            >
              ร้อยพวงมาลัยมงคลถวายพระพรหม
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              aria-label={soundEnabled ? 'ปิดเสียงเอฟเฟกต์' : 'เปิดเสียงเอฟเฟกต์'}
              className="p-2.5 rounded-lg border border-[#D4C3A3] bg-[#FBF8F1] text-[#5A4E3F] hover:text-[#1F1A14] hover:bg-[#EFE6D4] transition-colors cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" aria-hidden="true" />
              ) : (
                <VolumeX className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="ปิดหน้าต่างร้อยพวงมาลัย"
              className="p-2.5 rounded-lg border border-[#D4C3A3] bg-[#FBF8F1] text-[#5A4E3F] hover:text-[#8C2D19] hover:bg-[#EFE6D4] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Two-Zone Studio Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-7 max-h-[82vh] overflow-y-auto">
          {/* Left Zone: Interactive Stringing Canvas */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between bg-[#F6F0E3] border border-[#DFD3BC] rounded-xl p-5">
            <div className="w-full flex items-center justify-between text-sm">
              <span className="font-medium text-[#4A4034]">{activeStyleInfo.name}</span>
              <span className="font-mono tabular-nums font-semibold text-[#8C2D19]">
                {flowers.length} / {BEAD_COUNT} ดอก
              </span>
            </div>

            <div className="w-full my-2">
              <InteractiveThreadingCord styleId={selectedStyle} flowers={flowers} />
            </div>

            {/* Progress bar & Cord Controls */}
            <div className="w-full space-y-3">
              <div className="w-full h-2 bg-[#E6DAC4] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#B47B1A] transition-all duration-200"
                  style={{ width: `${(flowers.length / BEAD_COUNT) * 100}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={flowers.length === 0}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#3F352A] bg-[#FBF8F1] border border-[#D4C3A3] rounded-lg hover:bg-[#EFE6D4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Undo2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>ถอดดอกล่าสุด</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={flowers.length === 0}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#3F352A] bg-[#FBF8F1] border border-[#D4C3A3] rounded-lg hover:bg-[#EFE6D4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>ร้อยใหม่</span>
                  </button>
                </div>

                {!isComplete && (
                  <button
                    type="button"
                    disabled={isAutoThreading}
                    onClick={handleFillRecommended}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#8C5A0B] bg-[#FFF8E6] border border-[#DFC07C] hover:bg-[#F7EAC8] disabled:opacity-60 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{isAutoThreading ? 'กำลังร้อยทีละดอก...' : 'ร้อยลายแนะนำให้ครบ'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Zone: Garland Style & Flower Selection Deck */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            {/* Step 1A: Garland Style Selector */}
            <div>
              <h3 className="text-sm font-semibold text-[#1F1A14] mb-2.5">
                1. เลือกรูปแบบพวงมาลัยมงคล
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {GARLAND_STYLES.map((style) => {
                  const active = style.id === selectedStyle;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style.id)}
                      className={`text-left p-3.5 rounded-xl border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#B47B1A] ${
                        active
                          ? 'bg-[#FFF9EC] border-[#B47B1A] ring-1 ring-[#B47B1A]'
                          : 'bg-[#F6F0E3] border-[#DFD3BC] hover:border-[#BFA980]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display font-semibold text-sm text-[#1F1A14]">
                          {style.name}
                        </span>
                        {active && (
                          <Check className="w-4 h-4 text-[#8C2D19] shrink-0" aria-hidden="true" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-[#6E6252]">{style.subtitle}</p>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-[#5A4E3F] leading-relaxed">
                {activeStyleInfo.description}
              </p>
            </div>

            {/* Step 1B: Flower Bead Picker */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <h3 className="text-sm font-semibold text-[#1F1A14]">
                  2. กดเลือกดอกมะลิและดอกไม้มงคลเพื่อร้อยทีละเม็ด
                </h3>
                <span className="text-xs text-[#6E6252]">
                  {isComplete ? 'ร้อยครบสมบูรณ์แล้ว' : `เลือกอีก ${BEAD_COUNT - flowers.length} ดอก`}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {FLOWER_CATALOG.map((flower) => (
                  <button
                    key={flower.id}
                    type="button"
                    disabled={isComplete || isAutoThreading}
                    onClick={() => handleAddFlower(flower.id)}
                    className="group flex items-center gap-3 p-3 rounded-xl bg-[#F6F0E3] border border-[#DFD3BC] hover:border-[#B47B1A] hover:bg-[#FFF9EC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#B47B1A]"
                  >
                    <div className="w-11 h-11 rounded-lg bg-[#FBF8F1] border border-[#E2D7C1] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <FlowerBeadIcon type={flower.id} size={34} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1F1A14] truncate">
                        {flower.name}
                      </p>
                      <p className="text-xs text-[#6E6252] line-clamp-2 leading-snug mt-0.5">
                        {flower.meaning}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Completion Footer CTA */}
            <div className="pt-4 border-t border-[#DFD3BC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-[#4A4034]">
                {isComplete ? (
                  <span className="font-medium text-[#2D6A4F]">
                    พวงมาลัยของท่านร้อยเสร็จสมบูรณ์พร้อมอุบะมงคลแล้ว
                  </span>
                ) : (
                  <span>
                    คลิกดอกไม้ด้านบนทีละดอกเพื่อร้อยเรียงตามแนวเชือกจนครบ {BEAD_COUNT} ดอก
                  </span>
                )}
              </div>

              <button
                type="button"
                disabled={!isComplete}
                onClick={() => onCompleteGarland(selectedStyle, flowers)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-semibold text-white bg-[#8C2D19] hover:bg-[#732312] disabled:bg-[#CBBCA2] disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B47B1A]"
              >
                <span>นำพวงมาลัยไปถวายสี่ทิศ</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
