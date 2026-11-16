import React from 'react';
import { ArrowRight, Flower2 } from 'lucide-react';
import { HeroGarlandPair } from './ThaiGarlandSvg';
import { ThaiKanokCorner, ThaiPrachamYamDivider } from './ThaiOrnamentSvg';

interface EntranceGateProps {
  onEnterWebsite: () => void;
  onOpenAdmin: () => void;
}

export const EntranceGate: React.FC<EntranceGateProps> = ({
  onEnterWebsite,
  onOpenAdmin,
}) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FBF8F1] text-[#1F1A14] px-4 sm:px-8 py-6 sm:py-10">
      <div />

      <main className="relative max-w-3xl w-full mx-auto bg-[#F7F1E4] border border-[#D4C3A3] rounded-2xl px-6 sm:px-14 py-12 sm:py-16 text-center flex flex-col items-center shadow-sm">
        {/* Traditional Thai Lai Kanok Corner Ornaments */}
        <ThaiKanokCorner position="top-left" className="w-12 h-12 sm:w-16 sm:h-16 text-[#B47B1A] absolute top-3 left-3" />
        <ThaiKanokCorner position="top-right" className="w-12 h-12 sm:w-16 sm:h-16 text-[#B47B1A] absolute top-3 right-3" />
        <ThaiKanokCorner position="bottom-left" className="w-12 h-12 sm:w-16 sm:h-16 text-[#B47B1A] absolute bottom-3 left-3" />
        <ThaiKanokCorner position="bottom-right" className="w-12 h-12 sm:w-16 sm:h-16 text-[#B47B1A] absolute bottom-3 right-3" />

        {/* Beautiful Thai Floral Garlands */}
        <div className="mb-6">
          <HeroGarlandPair />
        </div>

        <ThaiPrachamYamDivider className="w-64 sm:w-80 h-6 text-[#B47B1A] mb-5" />

        {/* Website Name */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-[#1F1A14] leading-[1.2] tracking-tight">
          พวงมาลัยสี่ทิศ
          <span className="block text-[#8C2D19] mt-2">มงคลรุ่งอรุณ</span>
        </h1>

        {/* Restoration Subtitle */}
        <p className="mt-5 text-base sm:text-xl font-medium text-[#5A4E3F] leading-relaxed">
          บูรณะศาลพระพรหม หมู่บ้านรุ่งอรุณ 1 กรุงเทพมหานคร
        </p>

        <ThaiPrachamYamDivider className="w-56 sm:w-72 h-6 text-[#B47B1A] mt-6" />

        {/* Primary Enter Website Button */}
        <div className="mt-7">
          <button
            type="button"
            onClick={onEnterWebsite}
            className="inline-flex items-center justify-center gap-3 px-9 py-4 text-lg font-semibold text-white bg-[#8C2D19] hover:bg-[#732312] rounded-xl transition-colors shadow-md cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B47B1A]"
          >
            <Flower2 className="w-5 h-5" aria-hidden="true" />
            <span>เข้าเว็บไซต์</span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </main>

      <footer className="text-center pt-6">
        <button
          type="button"
          onClick={onOpenAdmin}
          className="text-xs text-[#8E7F6B] hover:text-[#5A4E3F] underline underline-offset-4 transition-colors cursor-pointer"
        >
          โหมดผู้ดูแล
        </button>
      </footer>
    </div>
  );
};
