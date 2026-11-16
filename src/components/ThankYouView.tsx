import React, { useState } from 'react';
import { Compass, Flower2, Printer, Sparkles } from 'lucide-react';
import { DIRECTIONS_DATA, GARLAND_STYLES, GarlandOffering } from '../types';
import { MiniGarlandBadge } from './ThaiGarlandSvg';
import { ThaiKanokCorner, ThaiPrachamYamDivider } from './ThaiOrnamentSvg';

interface ThankYouViewProps {
  offering: GarlandOffering;
  onViewWall: () => void;
  onThreadAnother: () => void;
}

export const ThankYouView: React.FC<ThankYouViewProps> = ({
  offering,
  onViewWall,
  onThreadAnother,
}) => {
  const [imgError, setImgError] = useState(false);
  const styleInfo =
    GARLAND_STYLES.find((s) => s.id === offering.garlandStyle) || GARLAND_STYLES[0];

  const formattedDate = new Date(offering.createdAt).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className="py-12 sm:py-16 border-b border-[#DFD3BC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative bg-[#F6F0E3] border-2 border-[#C99B3B] rounded-2xl p-6 sm:p-10 shadow-sm">
          <ThaiKanokCorner position="top-left" className="w-12 h-12 text-[#B47B1A] absolute top-3 left-3 pointer-events-none" />
          <ThaiKanokCorner position="top-right" className="w-12 h-12 text-[#B47B1A] absolute top-3 right-3 pointer-events-none" />
          <ThaiKanokCorner position="bottom-left" className="w-12 h-12 text-[#B47B1A] absolute bottom-3 left-3 pointer-events-none" />
          <ThaiKanokCorner position="bottom-right" className="w-12 h-12 text-[#B47B1A] absolute bottom-3 right-3 pointer-events-none" />

          {/* Certificate Header */}
          <div className="text-center pb-6 border-b border-[#DFD3BC]">
            <ThaiPrachamYamDivider className="w-60 h-5 text-[#B47B1A] mb-3" />
            <p className="text-xs sm:text-sm font-medium text-[#8C5A0B] tracking-wide">
              ใบอนุโมทนาบัตรและคำขอบพระคุณ · พวงมาลัยสี่ทิศ มงคลรุ่งอรุณ
            </p>
            <h2 className="mt-3 font-display text-2xl sm:text-4xl font-bold text-[#1F1A14] leading-snug">
              ขอบพระคุณที่ร่วมสมทบทุน
              <span className="block text-[#8C2D19] mt-1">
                และร่วมร้อยพวงมาลัยถวายพระพรหม
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#4A4034] max-w-2xl mx-auto leading-relaxed">
              ขอกุศลผลบุญและพรอันประเสริฐจากองค์พระพรหมทั้งสี่ทิศ
              ดลบันดาลให้ท่านและครอบครัวประสบแต่ความสุข ความเจริญ สุขภาพแข็งแรง
              และร่วมสร้างความร่มเย็นแก่หมู่บ้านรุ่งอรุณ 1 สืบไป
            </p>
          </div>

          {/* Resident Offering Summary */}
          <div className="my-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 flex flex-col items-center justify-center bg-[#FBF8F1] border border-[#DFD3BC] rounded-xl p-5">
              <MiniGarlandBadge
                styleId={offering.garlandStyle}
                flowers={offering.flowers}
                size={128}
              />
              <p className="mt-2 font-display text-sm font-semibold text-[#1F1A14]">
                {styleInfo.name}
              </p>
              <p className="text-xs text-[#6E6252] mt-0.5">
                ถวายครบทั้ง ๔ ทิศรอบศาลพระพรหม
              </p>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div>
                <p className="text-xs text-[#7A6A56]">นามผู้ถวายพวงมาลัยและคำอธิษฐาน</p>
                <p className="mt-0.5 font-display text-xl sm:text-2xl font-bold text-[#1F1A14]">
                  {offering.residentName}
                </p>
                <p className="mt-1 text-xs sm:text-sm text-[#5A4E3F] tabular-nums">
                  {offering.houseNumber ? `${offering.houseNumber} · ` : ''}
                  บันทึกเมื่อ {formattedDate}
                  {offering.contributedRestoration ? ' · ร่วมสมทบทุนบูรณะศาลพระพรหม' : ''}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FBF8F1] border border-[#DFD3BC]">
                <p className="text-xs text-[#7A6A56] mb-1.5">คำอธิษฐานมงคลแก่หมู่บ้าน</p>
                <blockquote className="font-display text-base sm:text-lg italic text-[#1F1A14] leading-relaxed">
                  “{offering.wish}”
                </blockquote>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                {DIRECTIONS_DATA.map((dir) => (
                  <div
                    key={dir.key}
                    className="py-2 px-2 rounded-lg bg-[#FFF9EC] border border-[#DFC07C] text-xs font-medium text-[#6B470B]"
                  >
                    {dir.thaiName}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Official Credit & Shrine Photo */}
          <div className="pt-6 border-t border-[#DFD3BC] grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
            <div className="sm:col-span-4">
              <div className="aspect-video rounded-xl overflow-hidden bg-[#E8DFCE] border border-[#DFD3BC]">
                {!imgError ? (
                  <img
                    src="/assets/aistudio/IMG_20261114_125926_c624788e.jpg"
                    alt="ศาลพระพรหมหมู่บ้านรุ่งอรุณ 1"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#6E6252]">
                    ศาลพระพรหม หมู่บ้านรุ่งอรุณ 1
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-8">
              <p className="text-xs text-[#7A6A56]">ด้วยความเคารพและอนุโมทนาอย่างสูง</p>
              <p className="mt-1 font-display text-base sm:text-lg font-bold text-[#1F1A14]">
                จัดทำโดย ฝ่ายประชาสัมพันธ์ คณะกรรมการหมู่บ้านรุ่งอรุณ 1 กรุงเทพมหานคร
              </p>
              <p className="mt-1 text-xs sm:text-sm text-[#5A4E3F]">
                โครงการบูรณะศาลพระพรหมประจำหมู่บ้านรุ่งอรุณ 1 · ร่วมแรงร่วมใจเพื่อความเป็นสิริมงคลสืบไป
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="no-print mt-8 pt-6 border-t border-[#DFD3BC] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#1F1A14] bg-[#FBF8F1] hover:bg-[#EFE6D4] border border-[#D4C3A3] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                <Printer className="w-4 h-4 text-[#8C5A0B]" aria-hidden="true" />
                <span>พิมพ์การ์ดขอบพระคุณ</span>
              </button>

              <button
                type="button"
                onClick={onViewWall}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#1F1A14] bg-[#FBF8F1] hover:bg-[#EFE6D4] border border-[#D4C3A3] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                <Compass className="w-4 h-4 text-[#8C5A0B]" aria-hidden="true" />
                <span>ชมคำอธิษฐานหมู่บ้าน</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onThreadAnother}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#8C2D19] hover:bg-[#732312] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              <Flower2 className="w-4 h-4" aria-hidden="true" />
              <span>ร้อยพวงมาลัยเพิ่มอีกพวง</span>
              <Sparkles className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
