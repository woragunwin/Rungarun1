import React, { useState } from 'react';
import { CheckCircle2, Compass, HeartHandshake, Loader2, Pencil, Send } from 'lucide-react';
import {
  BEAD_COUNT,
  DIRECTIONS_DATA,
  DirectionKey,
  FlowerType,
  GARLAND_STYLES,
  GarlandOffering,
  GarlandStyleId,
  SAMPLE_BLESSING_PROMPTS,
} from '../types';
import { MiniGarlandBadge } from './ThaiGarlandSvg';
import { ThaiKanokCorner, ThaiPhraPhromHalo } from './ThaiOrnamentSvg';

interface FourDirectionsShrineProps {
  garlandStyle: GarlandStyleId;
  flowers: FlowerType[];
  directionCounts: Record<DirectionKey, number>;
  onOpenStudio: () => void;
  onSubmitted: (offering: GarlandOffering) => void;
}

export const FourDirectionsShrine: React.FC<FourDirectionsShrineProps> = ({
  garlandStyle,
  flowers,
  directionCounts,
  onOpenStudio,
  onSubmitted,
}) => {
  const [placedDirections, setPlacedDirections] = useState<DirectionKey[]>([]);
  const [residentName, setResidentName] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [contributedRestoration, setContributedRestoration] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionNote, setContributionNote] = useState('');
  const [wish, setWish] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shrineImgError, setShrineImgError] = useState(false);

  const hasCompletedGarland = flowers.length === BEAD_COUNT;
  const allFourPlaced = placedDirections.length === 4;
  const styleInfo =
    GARLAND_STYLES.find((s) => s.id === garlandStyle) || GARLAND_STYLES[0];

  const toggleDirection = (dir: DirectionKey) => {
    if (!hasCompletedGarland) {
      onOpenStudio();
      return;
    }
    setPlacedDirections((prev) =>
      prev.includes(dir) ? prev.filter((item) => item !== dir) : [...prev, dir]
    );
  };

  const handlePlaceAllFour = () => {
    if (!hasCompletedGarland) {
      onOpenStudio();
      return;
    }
    setPlacedDirections(['north', 'east', 'south', 'west']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!hasCompletedGarland) {
      setErrorMsg('กรุณาร้อยพวงมาลัยดอกมะลิให้ครบ 12 ดอกก่อนทำการถวาย');
      onOpenStudio();
      return;
    }
    if (!allFourPlaced) {
      setErrorMsg('กรุณาคล้องพวงมาลัยให้ครบทั้ง 4 ทิศรอบศาลพระพรหม');
      return;
    }
    if (!residentName.trim()) {
      setErrorMsg('กรุณาระบุชื่อลูกบ้านหรือชื่อครอบครัว');
      return;
    }
    if (!wish.trim()) {
      setErrorMsg('กรุณาเขียนคำอธิษฐานมงคลเพื่อความเป็นสิริมงคลแก่หมู่บ้าน');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/offerings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          residentName: residentName.trim(),
          houseNumber: houseNumber.trim(),
          garlandStyle,
          flowers,
          directionsOffered: placedDirections,
          wish: wish.trim(),
          contributedRestoration,
          contributionAmount:
            contributedRestoration && contributionAmount
              ? Number(contributionAmount)
              : null,
          contributionNote: contributedRestoration ? contributionNote.trim() : '',
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      }
      onSubmitted(data.offering as GarlandOffering);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDirectionPedestal = (dirKey: DirectionKey) => {
    const info = DIRECTIONS_DATA.find((d) => d.key === dirKey)!;
    const isPlaced = placedDirections.includes(dirKey);

    return (
      <button
        key={dirKey}
        type="button"
        onClick={() => toggleDirection(dirKey)}
        className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#B47B1A] ${
          isPlaced
            ? 'bg-[#FFF9EC] border-[#B47B1A] ring-1 ring-[#B47B1A]'
            : 'bg-[#FBF8F1] border-[#DFD3BC] hover:border-[#BFA980]'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-[#7A6A56]">
              <span className="font-mono font-semibold text-[#8C5A0B]">{info.compassLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{info.sacredName}</span>
            </div>
            <h4 className="mt-1 font-display text-base font-bold text-[#1F1A14]">
              {info.thaiName}
            </h4>
            <p className="mt-0.5 text-xs text-[#5A4E3F] leading-relaxed">
              {info.blessingFocus}
            </p>
            <p className="mt-2 text-xs text-[#7A6A56] tabular-nums">
              สะสมในทิศนี้ {directionCounts[dirKey]} พวง ·{' '}
              <span className={isPlaced ? 'font-semibold text-[#2D6A4F]' : 'text-[#8C2D19] font-medium'}>
                {isPlaced ? 'คล้องมาลัยของท่านแล้ว' : 'กดเพื่อคล้องพวงมาลัย'}
              </span>
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-[#F5EFE2] border border-[#E2D7C1]">
            {isPlaced ? (
              <MiniGarlandBadge styleId={garlandStyle} flowers={flowers} size={56} />
            ) : (
              <Compass className="w-6 h-6 text-[#A39278]" aria-hidden="true" />
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <section id="shrine-offering" className="py-12 sm:py-16 border-b border-[#DFD3BC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#DFD3BC]">
          <div>
            <p className="text-xs font-medium text-[#7A6A56]">
              ขั้นตอนที่ 2 · ถวายพวงมาลัยสักการะพระพรหมทั้งสี่ทิศและอธิษฐานร่วมกัน
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-[#1F1A14]">
              ร้อยพวงมาลัยทั้งสี่ทิศรอบศาลพระพรหม
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-[#4A4034] tabular-nums">
              คล้องพวงมาลัยแล้ว{' '}
              <strong className="text-[#8C2D19]">{placedDirections.length} / 4 ทิศ</strong>
            </span>
            {!allFourPlaced && (
              <button
                type="button"
                onClick={handlePlaceAllFour}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#8C2D19] bg-[#FFF8E6] border border-[#DFC07C] hover:bg-[#F7EAC8] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                คล้องพวงมาลัยครบทั้ง ๔ ทิศ
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Stage: Interactive 4-Direction Shrine Compass */}
          <div className="relative lg:col-span-7 bg-[#F6F0E3] border border-[#DFD3BC] rounded-2xl p-5 sm:p-8">
            <ThaiKanokCorner position="top-left" className="w-10 h-10 text-[#B47B1A] absolute top-2.5 left-2.5 pointer-events-none" />
            <ThaiKanokCorner position="top-right" className="w-10 h-10 text-[#B47B1A] absolute top-2.5 right-2.5 pointer-events-none" />
            <ThaiKanokCorner position="bottom-left" className="w-10 h-10 text-[#B47B1A] absolute bottom-2.5 left-2.5 pointer-events-none" />
            <ThaiKanokCorner position="bottom-right" className="w-10 h-10 text-[#B47B1A] absolute bottom-2.5 right-2.5 pointer-events-none" />
            {!hasCompletedGarland && (
              <div className="mb-5 p-4 rounded-xl bg-[#FFF8E6] border border-[#DFC07C] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-sm text-[#5A4212]">
                  ท่านยังไม่ได้ร้อยพวงมาลัยให้ครบ 12 ดอก กรุณาร้อยพวงมาลัยก่อนนำมาคล้องถวายทั้งสี่ทิศ
                </p>
                <button
                  type="button"
                  onClick={onOpenStudio}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#8C2D19] hover:bg-[#732312] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  เปิดหน้าต่างร้อยพวงมาลัย
                </button>
              </div>
            )}

            {/* North */}
            <div className="max-w-md mx-auto">{renderDirectionPedestal('north')}</div>

            {/* West - Central Phra Phrom Shrine - East */}
            <div className="my-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-4">{renderDirectionPedestal('west')}</div>

              <div className="md:col-span-4 flex flex-col items-center justify-center py-2">
                <div className="relative flex items-center justify-center">
                  <ThaiPhraPhromHalo className="w-52 h-52 sm:w-56 sm:h-56 text-[#C99B3B] pointer-events-none" />
                  <div className="absolute w-40 h-40 sm:w-44 sm:h-44 rounded-full border-4 border-[#C99B3B] p-1 bg-[#FBF8F1] shadow-md overflow-hidden">
                    {!shrineImgError ? (
                      <img
                        src="/assets/aistudio/IMG_20261114_125926_c624788e.jpg"
                        alt="ศาลพระพรหมประจำหมู่บ้านรุ่งอรุณ 1"
                        referrerPolicy="no-referrer"
                        onError={() => setShrineImgError(true)}
                        className="w-full h-full object-cover rounded-full"
                      />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#EFE6D4] flex items-center justify-center text-center p-4">
                      <span className="font-display text-sm font-semibold text-[#8C2D19]">
                        ศาลพระพรหม
                        <br />
                        หมู่บ้านรุ่งอรุณ 1
                      </span>
                    </div>
                    )}
                  </div>
                </div>
                <p className="mt-2.5 text-center font-display text-sm font-semibold text-[#1F1A14]">
                  ศาลพระพรหม ๔ พักตร์
                </p>
                <p className="text-xs text-[#6E6252] text-center">
                  หมู่บ้านรุ่งอรุณ 1 กรุงเทพมหานคร
                </p>
              </div>

              <div className="md:col-span-4">{renderDirectionPedestal('east')}</div>
            </div>

            {/* South */}
            <div className="max-w-md mx-auto">{renderDirectionPedestal('south')}</div>
          </div>

          {/* Right Panel: Garland Preview + Resident Info + Village Auspicious Wish Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-5 bg-[#F6F0E3] border border-[#DFD3BC] rounded-2xl p-5 sm:p-6 space-y-5"
          >
            {/* Crafted Garland Summary */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#DFD3BC]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-16 h-16 rounded-xl bg-[#FBF8F1] border border-[#E2D7C1] flex items-center justify-center shrink-0">
                  <MiniGarlandBadge styleId={garlandStyle} flowers={flowers} size={60} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[#7A6A56]">พวงมาลัยของท่าน</p>
                  <p className="font-display text-base font-bold text-[#1F1A14] truncate">
                    {styleInfo.name}
                  </p>
                  <p className="text-xs text-[#5A4E3F] tabular-nums">
                    ร้อยแล้ว {flowers.length} / {BEAD_COUNT} ดอก
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenStudio}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#3F352A] bg-[#FBF8F1] border border-[#D4C3A3] hover:bg-[#EFE6D4] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                <span>ร้อยใหม่</span>
              </button>
            </div>

            {/* Resident Details */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="resident-name"
                  className="block text-sm font-medium text-[#1F1A14] mb-1.5"
                >
                  ชื่อลูกบ้าน / นามสกุล หรือชื่อครอบครัว <span className="text-[#8C2D19]">*</span>
                </label>
                <input
                  id="resident-name"
                  type="text"
                  required
                  maxLength={80}
                  value={residentName}
                  onChange={(e) => setResidentName(e.target.value)}
                  placeholder="เช่น ครอบครัวคุณสมชาย ใจดี"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FBF8F1] border border-[#D4C3A3] rounded-lg text-[#1F1A14] placeholder:text-[#9C8E78] focus:outline-none focus:border-[#B47B1A] focus:ring-1 focus:ring-[#B47B1A]"
                />
              </div>

              <div>
                <label
                  htmlFor="house-number"
                  className="block text-sm font-medium text-[#1F1A14] mb-1.5"
                >
                  บ้านเลขที่ / ซอย (หมู่บ้านรุ่งอรุณ 1)
                </label>
                <input
                  id="house-number"
                  type="text"
                  maxLength={40}
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  placeholder="เช่น 99/18 ซอย 3"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FBF8F1] border border-[#D4C3A3] rounded-lg text-[#1F1A14] placeholder:text-[#9C8E78] focus:outline-none focus:border-[#B47B1A] focus:ring-1 focus:ring-[#B47B1A]"
                />
              </div>

              {/* Restoration Contribution */}
              <div className="p-3.5 rounded-xl bg-[#FBF8F1] border border-[#DFD3BC] space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contributedRestoration}
                    onChange={(e) => setContributedRestoration(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#8C2D19] rounded cursor-pointer"
                  />
                  <span className="text-sm text-[#1F1A14] leading-snug">
                    <strong className="font-semibold">ร่วมสมทบทุนบูรณะศาลพระพรหม</strong>
                    <span className="block text-xs text-[#6E6252] mt-0.5">
                      แจ้งให้คณะกรรมการหมู่บ้านบันทึกอนุโมทนาการร่วมสมทบทุน (ไม่บังคับ)
                    </span>
                  </span>
                </label>

                {contributedRestoration && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label
                        htmlFor="contribution-amount"
                        className="block text-xs font-medium text-[#5A4E3F] mb-1"
                      >
                        จำนวนเงินสมทบทุน (บาท)
                      </label>
                      <input
                        id="contribution-amount"
                        type="number"
                        min={1}
                        max={10000000}
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(e.target.value)}
                        placeholder="ระบุจำนวน (ถ้ามี)"
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D4C3A3] rounded-lg text-[#1F1A14] tabular-nums focus:outline-none focus:border-[#B47B1A]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contribution-note"
                        className="block text-xs font-medium text-[#5A4E3F] mb-1"
                      >
                        หมายเหตุ / ช่องทาง
                      </label>
                      <input
                        id="contribution-note"
                        type="text"
                        maxLength={160}
                        value={contributionNote}
                        onChange={(e) => setContributionNote(e.target.value)}
                        placeholder="เช่น โอนเข้ากองทุน / กล่องรับบริจาค"
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D4C3A3] rounded-lg text-[#1F1A14] focus:outline-none focus:border-[#B47B1A]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Auspicious Wish */}
              <div>
                <label
                  htmlFor="auspicious-wish"
                  className="block text-sm font-medium text-[#1F1A14] mb-1.5"
                >
                  คำอธิษฐานมงคลเพื่อความเป็นสิริมงคลแก่หมู่บ้านร่วมกัน{' '}
                  <span className="text-[#8C2D19]">*</span>
                </label>
                <textarea
                  id="auspicious-wish"
                  required
                  rows={4}
                  maxLength={400}
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  placeholder="เขียนคำอธิษฐานขอพรเพื่อความร่มเย็นเป็นสุขแก่หมู่บ้านรุ่งอรุณ 1..."
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FBF8F1] border border-[#D4C3A3] rounded-lg text-[#1F1A14] placeholder:text-[#9C8E78] leading-relaxed focus:outline-none focus:border-[#B47B1A] focus:ring-1 focus:ring-[#B47B1A]"
                />
                <div className="mt-2 space-y-1.5">
                  <p className="text-xs text-[#6E6252]">ตัวอย่างคำอธิษฐานมงคล (กดเพื่อเลือกใช้):</p>
                  <div className="flex flex-col gap-1.5">
                    {SAMPLE_BLESSING_PROMPTS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setWish(sample)}
                        className="text-left text-xs text-[#5A4E3F] hover:text-[#8C2D19] bg-[#FBF8F1] hover:bg-[#FFF9EC] border border-[#E2D7C1] rounded-lg px-3 py-2 transition-colors cursor-pointer line-clamp-2"
                      >
                        “{sample}”
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-[#FDF2F0] border border-[#D98B7C] text-xs sm:text-sm text-[#8C2D19]"
              >
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-[#8C2D19] hover:bg-[#732312] disabled:bg-[#BFA980] rounded-xl transition-colors shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B47B1A]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  <span>กำลังถวายพวงมาลัยและบันทึกคำอธิษฐาน...</span>
                </>
              ) : allFourPlaced ? (
                <>
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  <span>ถวายพวงมาลัยทั้งสี่ทิศ และบันทึกคำอธิษฐาน</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>ถวายพวงมาลัยทั้งสี่ทิศ และบันทึกคำอธิษฐาน</span>
                </>
              )}
            </button>

            <p className="text-xs text-[#6E6252] flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-[#8C5A0B] shrink-0" aria-hidden="true" />
              <span>คำอธิษฐานของท่านจะถูกนำไปแสดงร่วมกันบนกระดานมงคลของหมู่บ้าน</span>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
