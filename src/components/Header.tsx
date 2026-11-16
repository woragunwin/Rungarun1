import React from 'react';
import { Shield } from 'lucide-react';

interface HeaderProps {
  activeSection: 'hero' | 'studio' | 'shrine' | 'wall' | 'thanks';
  onNavigate: (target: 'hero' | 'studio' | 'shrine' | 'wall') => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  onOpenAdmin,
}) => {
  const navItems: Array<{ id: 'hero' | 'studio' | 'shrine' | 'wall'; label: string }> = [
    { id: 'shrine', label: 'หน้าศาลพระพรหม' },
    { id: 'studio', label: 'ร้อยพวงมาลัย' },
    { id: 'wall', label: 'คำอธิษฐานหมู่บ้าน' },
    { id: 'hero', label: 'หน้าต้อนรับ' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#FBF8F1]/95 backdrop-blur-sm border-b border-[#DFD3BC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('hero')}
          className="font-display text-lg sm:text-xl font-semibold tracking-tight text-[#1F1A14] hover:text-[#8C2D19] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B47B1A]"
        >
          พวงมาลัยสี่ทิศ มงคลรุ่งอรุณ
        </button>

        {/* Zone 2: 4 single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#5A4E3F]">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B47B1A] ${
                  isActive
                    ? 'text-[#8C2D19] border-[#B47B1A] font-semibold'
                    : 'border-transparent hover:text-[#1F1A14] hover:border-[#D5C9B0]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-[#1F1A14] bg-[#F2E9D8] border border-[#D4C3A3] rounded-lg hover:bg-[#E9DEC8] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B47B1A]"
          >
            <Shield className="w-4 h-4 text-[#8C5A0B]" aria-hidden="true" />
            <span>โหมดผู้ดูแล</span>
          </button>
        </div>
      </div>
    </header>
  );
};
