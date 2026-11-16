import React, { useEffect, useState } from 'react';
import {
  Download,
  Loader2,
  Lock,
  LogOut,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { GARLAND_STYLES, GarlandOffering } from '../types';
import { MiniGarlandBadge } from './ThaiGarlandSvg';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

interface AdminStats {
  totalOfferings: number;
  totalGarlandsOffered: number;
  totalContributors: number;
  totalContributionAmount: number;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onDataChanged,
}) => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [offerings, setOfferings] = useState<GarlandOffering[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalOfferings: 0,
    totalGarlandsOffered: 0,
    totalContributors: 0,
    totalContributionAmount: 0,
  });
  const [isLoadingRows, setIsLoadingRows] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contribFilter, setContribFilter] = useState<'all' | 'contributed' | 'garland_only'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const fetchAdminOfferings = async (adminToken: string) => {
    setIsLoadingRows(true);
    try {
      const res = await fetch('/api/admin/offerings', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status === 401) {
        setToken(null);
        setAuthError('หมดเวลาการใช้งาน กรุณาเข้าสู่ระบบผู้ดูแลใหม่อีกครั้ง');
        return;
      }
      const data = await res.json();
      setOfferings(data.offerings || []);
      if (data.stats) setStats(data.stats);
    } catch {
      setAuthError('ไม่สามารถโหลดข้อมูลลูกบ้านได้');
    } finally {
      setIsLoadingRows(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      fetchAdminOfferings(token);
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'รหัสผ่านไม่ถูกต้อง');
      }
      setToken(data.token);
      setPassword('');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/offerings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setOfferings((prev) => prev.filter((item) => item.id !== id));
        await fetchAdminOfferings(token);
        onDataChanged();
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportCsv = () => {
    const header = [
      'ชื่อลูกบ้าน',
      'บ้านเลขที่/ซอย',
      'แบบพวงมาลัย',
      'ทิศที่ถวาย',
      'ร่วมสมทบทุน',
      'จำนวนเงิน (บาท)',
      'หมายเหตุ',
      'คำอธิษฐานมงคล',
      'วันเวลา',
    ];
    const rows = filteredOfferings.map((o) => {
      const styleName =
        GARLAND_STYLES.find((s) => s.id === o.garlandStyle)?.name || o.garlandStyle;
      return [
        o.residentName,
        o.houseNumber || '-',
        styleName,
        'ครบทั้ง 4 ทิศ',
        o.contributedRestoration ? 'ร่วมสมทบทุน' : 'ร่วมร้อยพวงมาลัย',
        o.contributionAmount ?? '',
        o.contributionNote || '',
        o.wish,
        new Date(o.createdAt).toLocaleString('th-TH'),
      ]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(',');
    });
    const csvContent = '\uFEFF' + [header.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rungarun1-phraphrom-residents.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredOfferings = offerings.filter((item) => {
    if (contribFilter === 'contributed' && !item.contributedRestoration) return false;
    if (contribFilter === 'garland_only' && item.contributedRestoration) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return (
      item.residentName.toLowerCase().includes(q) ||
      (item.houseNumber || '').toLowerCase().includes(q) ||
      item.wish.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1F1A14]/65 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
    >
      <div className="relative w-full max-w-5xl bg-[#FBF8F1] border border-[#D4C3A3] rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 px-5 sm:px-7 py-4 bg-[#F5EFE2] border-b border-[#DFD3BC]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#8C2D19]" aria-hidden="true" />
            <div>
              <h2 id="admin-modal-title" className="font-display text-lg sm:text-xl font-bold text-[#1F1A14]">
                โหมดผู้ดูแล · คณะกรรมการหมู่บ้านรุ่งอรุณ 1
              </h2>
              <p className="text-xs text-[#6E6252]">
                ตรวจสอบรายชื่อลูกบ้าน การถวายพวงมาลัยสี่ทิศ และบันทึกการร่วมสมทบทุน
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {token && (
              <button
                type="button"
                onClick={() => setToken(null)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#5A4E3F] bg-[#FBF8F1] border border-[#D4C3A3] hover:bg-[#EFE6D4] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                <span>ออกจากโหมดผู้ดูแล</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="ปิดหน้าต่างผู้ดูแล"
              className="p-2 rounded-lg border border-[#D4C3A3] bg-[#FBF8F1] text-[#5A4E3F] hover:text-[#8C2D19] hover:bg-[#EFE6D4] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Password Gate OR Admin Dashboard */}
        {!token ? (
          <form onSubmit={handleLogin} className="p-6 sm:p-10 max-w-md mx-auto space-y-5">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-[#F5EFE2] border border-[#DFD3BC] flex items-center justify-center mx-auto mb-3">
                <Lock className="w-5 h-5 text-[#8C5A0B]" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#1F1A14]">
                ยืนยันรหัสผ่านเข้าสู่โหมดผู้ดูแล
              </h3>
              <p className="mt-1 text-sm text-[#5A4E3F]">
                สำหรับฝ่ายประชาสัมพันธ์และคณะกรรมการหมู่บ้านรุ่งอรุณ 1
              </p>
            </div>

            <div>
              <label
                htmlFor="admin-passcode"
                className="block text-sm font-medium text-[#1F1A14] mb-1.5"
              >
                รหัสผ่านผู้ดูแล
              </label>
              <input
                id="admin-passcode"
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านผู้ดูแล"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D4C3A3] rounded-lg text-[#1F1A14] focus:outline-none focus:border-[#B47B1A] focus:ring-1 focus:ring-[#B47B1A]"
              />
            </div>

            {authError && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-[#FDF2F0] border border-[#D98B7C] text-xs sm:text-sm text-[#8C2D19]"
              >
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#8C2D19] hover:bg-[#732312] rounded-xl transition-colors cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>กำลังตรวจสอบรหัสผ่าน...</span>
                </>
              ) : (
                <span>เข้าสู่โหมดผู้ดูแล</span>
              )}
            </button>
          </form>
        ) : (
          <div className="p-5 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Summary Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-xl bg-[#F6F0E3] border border-[#DFD3BC]">
                <p className="text-xs text-[#6E6252]">จำนวนลูกบ้านที่ร่วมกิจกรรม</p>
                <p className="mt-1 text-2xl font-semibold text-[#1F1A14] tabular-nums">
                  {stats.totalOfferings} ราย
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#F6F0E3] border border-[#DFD3BC]">
                <p className="text-xs text-[#6E6252]">พวงมาลัยถวายรวมทั้ง ๔ ทิศ</p>
                <p className="mt-1 text-2xl font-semibold text-[#8C2D19] tabular-nums">
                  {stats.totalGarlandsOffered} พวง
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#F6F0E3] border border-[#DFD3BC]">
                <p className="text-xs text-[#6E6252]">ผู้แจ้งร่วมสมทบทุนบูรณะ</p>
                <p className="mt-1 text-2xl font-semibold text-[#8C5A0B] tabular-nums">
                  {stats.totalContributors} ท่าน
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#F6F0E3] border border-[#DFD3BC]">
                <p className="text-xs text-[#6E6252]">ยอดสมทบทุนที่ระบุรวม</p>
                <p className="mt-1 text-2xl font-semibold text-[#2D6A4F] tabular-nums">
                  {stats.totalContributionAmount.toLocaleString('th-TH')} บาท
                </p>
              </div>
            </div>

            {/* Filter & Export Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5 flex-1">
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                  <Search
                    className="w-4 h-4 text-[#7A6A56] absolute left-3 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหาชื่อ, บ้านเลขที่, คำอธิษฐาน..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D4C3A3] rounded-lg text-[#1F1A14] focus:outline-none focus:border-[#B47B1A]"
                  />
                </div>

                <div className="inline-flex items-center gap-1 p-1 bg-[#EFE6D4] border border-[#DFD3BC] rounded-lg">
                  <button
                    type="button"
                    onClick={() => setContribFilter('all')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                      contribFilter === 'all'
                        ? 'bg-[#FBF8F1] text-[#1F1A14]'
                        : 'text-[#5A4E3F]'
                    }`}
                  >
                    ทั้งหมด
                  </button>
                  <button
                    type="button"
                    onClick={() => setContribFilter('contributed')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                      contribFilter === 'contributed'
                        ? 'bg-[#FBF8F1] text-[#1F1A14]'
                        : 'text-[#5A4E3F]'
                    }`}
                  >
                    ร่วมสมทบทุน
                  </button>
                  <button
                    type="button"
                    onClick={() => setContribFilter('garland_only')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                      contribFilter === 'garland_only'
                        ? 'bg-[#FBF8F1] text-[#1F1A14]'
                        : 'text-[#5A4E3F]'
                    }`}
                  >
                    ร้อยพวงมาลัย
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleExportCsv}
                disabled={filteredOfferings.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-[#1F1A14] bg-[#F5EFE2] hover:bg-[#E9DEC8] border border-[#D4C3A3] disabled:opacity-40 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <Download className="w-4 h-4 text-[#8C5A0B]" aria-hidden="true" />
                <span>ดาวน์โหลด CSV</span>
              </button>
            </div>

            {/* Resident Directory Table */}
            {isLoadingRows ? (
              <div className="py-12 text-center text-sm text-[#6E6252]">
                กำลังโหลดรายชื่อลูกบ้าน...
              </div>
            ) : filteredOfferings.length === 0 ? (
              <div className="py-12 text-center text-sm text-[#6E6252] bg-[#F6F0E3] border border-[#DFD3BC] rounded-xl">
                ยังไม่มีรายชื่อลูกบ้านที่ตรงกับเงื่อนไข
              </div>
            ) : (
              <div className="overflow-x-auto border border-[#DFD3BC] rounded-xl bg-white">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#F5EFE2] border-b border-[#DFD3BC] text-xs font-semibold text-[#4A4034]">
                      <th className="py-3 px-4">มาลัย</th>
                      <th className="py-3 px-4">ชื่อลูกบ้าน / บ้านเลขที่</th>
                      <th className="py-3 px-4">การร่วมสมทบทุน</th>
                      <th className="py-3 px-4">คำอธิษฐานมงคล</th>
                      <th className="py-3 px-4 whitespace-nowrap">วันที่บันทึก</th>
                      <th className="py-3 px-4 text-right">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE6D4]">
                    {filteredOfferings.map((item) => {
                      const styleName =
                        GARLAND_STYLES.find((s) => s.id === item.garlandStyle)?.name ||
                        item.garlandStyle;
                      return (
                        <tr key={item.id} className="align-top hover:bg-[#FBF8F1]">
                          <td className="py-3 px-4">
                            <MiniGarlandBadge
                              styleId={item.garlandStyle}
                              flowers={item.flowers}
                              size={46}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-[#1F1A14]">{item.residentName}</p>
                            <p className="text-xs text-[#6E6252] mt-0.5 tabular-nums">
                              {item.houseNumber || 'ไม่ระบุบ้านเลขที่'} · {styleName}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-xs text-[#4A4034] tabular-nums">
                            {item.contributedRestoration ? (
                              <div>
                                <span className="font-semibold text-[#2D6A4F]">ร่วมสมทบทุนแล้ว</span>
                                {item.contributionAmount ? (
                                  <span className="block mt-0.5">
                                    {item.contributionAmount.toLocaleString('th-TH')} บาท
                                  </span>
                                ) : null}
                                {item.contributionNote ? (
                                  <span className="block text-[#6E6252] mt-0.5">
                                    {item.contributionNote}
                                  </span>
                                ) : null}
                              </div>
                            ) : (
                              <span className="text-[#6E6252]">ร่วมร้อยมาลัยถวายพระพรหม</span>
                            )}
                          </td>
                          <td className="py-3 px-4 max-w-xs text-xs text-[#2F271E] leading-relaxed">
                            “{item.wish}”
                          </td>
                          <td className="py-3 px-4 text-xs text-[#6E6252] whitespace-nowrap tabular-nums">
                            {new Date(item.createdAt).toLocaleDateString('th-TH', {
                              day: '2-digit',
                              month: 'short',
                              year: '2-digit',
                            })}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              disabled={deletingId === item.id}
                              onClick={() => handleDelete(item.id)}
                              aria-label={`ลบรายการของ ${item.residentName}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#8C2D19] hover:bg-[#FDF2F0] border border-[#E5C1B8] rounded-md transition-colors cursor-pointer disabled:opacity-40"
                            >
                              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>ลบ</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
