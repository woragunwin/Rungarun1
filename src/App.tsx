import { useCallback, useEffect, useState } from 'react';
import { AdminModal } from './components/AdminModal';
import { BlessingWall } from './components/BlessingWall';
import { EntranceGate } from './components/EntranceGate';
import { FourDirectionsShrine } from './components/FourDirectionsShrine';
import { GarlandStudioModal } from './components/GarlandStudioModal';
import { Header } from './components/Header';
import { ThankYouView } from './components/ThankYouView';
import { DirectionKey, FlowerType, GarlandOffering, GarlandStyleId } from './types';

interface OfferingsApiResponse {
  offerings: GarlandOffering[];
  summary: {
    totalOfferings: number;
    totalContributors: number;
    directionCounts: Record<DirectionKey, number>;
  };
}

export default function App() {
  const [hasEntered, setHasEntered] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('page') === 'shrine' || window.location.hash === '#shrine';
  });

  const [offerings, setOfferings] = useState<GarlandOffering[]>([]);
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(true);
  const [directionCounts, setDirectionCounts] = useState<Record<DirectionKey, number>>({
    north: 0,
    east: 0,
    south: 0,
    west: 0,
  });

  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const [craftedStyle, setCraftedStyle] = useState<GarlandStyleId>('song_chai');
  const [craftedFlowers, setCraftedFlowers] = useState<FlowerType[]>([]);
  const [submittedOffering, setSubmittedOffering] = useState<GarlandOffering | null>(null);
  const [activeSection, setActiveSection] = useState<'hero' | 'studio' | 'shrine' | 'wall' | 'thanks'>('shrine');

  const fetchOfferings = useCallback(async () => {
    setIsLoadingOfferings(true);
    try {
      const res = await fetch('/api/offerings');
      if (!res.ok) return;
      const data: OfferingsApiResponse = await res.json();
      setOfferings(data.offerings || []);
      if (data.summary) {
        setDirectionCounts(data.summary.directionCounts);
      }
    } catch {
      // Keep current state on transient network error
    } finally {
      setIsLoadingOfferings(false);
    }
  }, []);

  useEffect(() => {
    fetchOfferings();
  }, [fetchOfferings]);

  const handleEnterWebsite = () => {
    setHasEntered(true);
    setActiveSection('shrine');
    setIsStudioOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (target: 'hero' | 'studio' | 'shrine' | 'wall') => {
    if (target === 'hero') {
      setHasEntered(false);
      setIsStudioOpen(false);
      setActiveSection('hero');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setHasEntered(true);
    setActiveSection(target);
    if (target === 'studio') {
      setIsStudioOpen(true);
      return;
    }
    if (target === 'shrine') {
      setSubmittedOffering(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (target === 'wall') {
      document.getElementById('blessing-wall')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCompleteGarland = (style: GarlandStyleId, flowers: FlowerType[]) => {
    setCraftedStyle(style);
    setCraftedFlowers(flowers);
    setSubmittedOffering(null);
    setIsStudioOpen(false);
    setActiveSection('shrine');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmittedOffering = (newOffering: GarlandOffering) => {
    setSubmittedOffering(newOffering);
    setActiveSection('thanks');
    fetchOfferings();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleThreadAnother = () => {
    setSubmittedOffering(null);
    setCraftedFlowers([]);
    setIsStudioOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F1] text-[#1F1A14]">
      {!hasEntered ? (
        <EntranceGate
          onEnterWebsite={handleEnterWebsite}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      ) : (
        <>
          <Header
            activeSection={activeSection}
            onNavigate={handleNavigate}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />

          <main className="flex-1">
            {submittedOffering ? (
              <div id="thank-you-section">
                <ThankYouView
                  offering={submittedOffering}
                  onViewWall={() => handleNavigate('wall')}
                  onThreadAnother={handleThreadAnother}
                />
              </div>
            ) : (
              <FourDirectionsShrine
                garlandStyle={craftedStyle}
                flowers={craftedFlowers}
                directionCounts={directionCounts}
                onOpenStudio={() => setIsStudioOpen(true)}
                onSubmitted={handleSubmittedOffering}
              />
            )}

            <BlessingWall
              offerings={offerings}
              isLoading={isLoadingOfferings}
              onOpenStudio={() => setIsStudioOpen(true)}
            />
          </main>

          <footer className="border-t border-[#DFD3BC] bg-[#F5EFE2] py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm text-[#5A4E3F]">
              <div>
                <p className="font-display font-semibold text-[#1F1A14]">
                  พวงมาลัยสี่ทิศ มงคลรุ่งอรุณ · โครงการบูรณะศาลพระพรหม
                </p>
                <p className="mt-1">
                  จัดทำโดย ฝ่ายประชาสัมพันธ์ คณะกรรมการหมู่บ้านรุ่งอรุณ 1 กรุงเทพมหานคร
                </p>
              </div>
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => setIsStudioOpen(true)}
                  className="hover:text-[#8C2D19] transition-colors cursor-pointer"
                >
                  ร้อยพวงมาลัย
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('wall')}
                  className="hover:text-[#8C2D19] transition-colors cursor-pointer"
                >
                  คำอธิษฐานหมู่บ้าน
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdminOpen(true)}
                  className="hover:text-[#8C2D19] transition-colors cursor-pointer"
                >
                  โหมดผู้ดูแล
                </button>
              </div>
            </div>
          </footer>
        </>
      )}

      <GarlandStudioModal
        isOpen={isStudioOpen}
        initialStyle={craftedStyle}
        initialFlowers={craftedFlowers}
        onClose={() => setIsStudioOpen(false)}
        onCompleteGarland={handleCompleteGarland}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataChanged={fetchOfferings}
      />
    </div>
  );
}
