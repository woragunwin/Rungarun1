import React, { useState } from 'react';
import { Flower2 } from 'lucide-react';
import { GARLAND_STYLES, GarlandOffering } from '../types';
import { MiniGarlandBadge } from './ThaiGarlandSvg';

interface BlessingWallProps {
  offerings: GarlandOffering[];
  isLoading: boolean;
  onOpenStudio: () => void;
}

export const BlessingWall: React.FC<BlessingWallProps> = ({
  offerings,
  isLoading,
  onOpenStudio,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'contributors'>('all');

  const filtered =
    filterMode === 'contributors'
      ? offerings.filter((item) => item.contributedRestoration)
      : offerings;

  return (
    <section id="blessing-wall" className="py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#DFD3BC]">
          <div>
            <p className="text-xs font-medium text-[#7A6A56]">
              บันทึกแห่งศรัทธา · ชาวหมู่บ้านรุ่งอรุณ 1
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-[#1F1A14]">
              กระดานคำอธิษฐานมงคลร่วมกัน
            </h2>
          </div>

          {/* Interactive filter segmented buttons */}
          <div className="inline-flex items-center gap-1 p-1 bg-[#EFE6D4] border border-[#DFD3BC] rounded-lg self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filterMode === 'all'
                  ? 'bg-[#FBF8F1] text-[#1F1A14] shadow-xs'
                  : 'text-[#5A4E3F] hover:text-[#1F1A14]'
              }`}
            >
              ทั้งหมด ({offerings.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('contributors')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filterMode === 'contributors'
                  ? 'bg-[#FBF8F1] text-[#1F1A14] shadow-xs'
                  : 'text-[#5A4E3F] hover:text-[#1F1A14]'
              }`}
            >
              ร่วมสมทบทุน ({offerings.filter((i) => i.contributedRestoration).length})
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-sm text-[#6E6252]">
            กำลังโหลดรายการพวงมาลัยและคำอธิษฐานมงคล...
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 bg-[#F6F0E3] border border-[#DFD3BC] rounded-2xl p-10 text-center">
            <Flower2 className="w-10 h-10 text-[#8C5A0B] mx-auto mb-3" aria-hidden="true" />
            <h3 className="font-display text-lg font-semibold text-[#1F1A14]">
              ยังไม่มีคำอธิษฐานในหมวดหมู่นี้
            </h3>
            <p className="mt-1 text-sm text-[#5A4E3F]">
              ขอเชิญลูกบ้านร่วมร้อยพวงมาลัยดอกมะลิถวายพระพรหมทั้งสี่ทิศและเขียนคำอธิษฐานมงคลร่วมกัน
            </p>
            <button
              type="button"
              onClick={onOpenStudio}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#8C2D19] hover:bg-[#732312] rounded-xl transition-colors cursor-pointer"
            >
              <span>เริ่มร้อยพวงมาลัย</span>
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item) => {
              const styleInfo =
                GARLAND_STYLES.find((s) => s.id === item.garlandStyle) || GARLAND_STYLES[0];
              const dateStr = new Date(item.createdAt).toLocaleDateString('th-TH', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <article
                  key={item.id}
                  className="bg-[#F6F0E3] border border-[#DFD3BC] rounded-2xl p-5 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-start gap-3.5">
                      <div className="w-16 h-16 rounded-xl bg-[#FBF8F1] border border-[#E2D7C1] flex items-center justify-center shrink-0">
                        <MiniGarlandBadge
                          styleId={item.garlandStyle}
                          flowers={item.flowers}
                          size={58}
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-display text-base font-bold text-[#1F1A14] truncate">
                          {item.residentName}
                        </h3>
                        <p className="mt-0.5 text-xs text-[#6E6252] tabular-nums">
                          {item.houseNumber ? `${item.houseNumber} · ` : ''}
                          {styleInfo.name}
                        </p>
                        <p className="mt-0.5 text-xs text-[#7A6A56] tabular-nums">
                          ถวายครบ ๔ ทิศ · {dateStr}
                          {item.contributedRestoration ? ' · ร่วมสมทบทุนบูรณะ' : ''}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 pt-3.5 border-t border-[#E2D7C1] text-sm text-[#2F271E] leading-relaxed">
                      “{item.wish}”
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
