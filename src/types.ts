export type FlowerType =
  | 'jasmine_double'
  | 'jasmine_bud'
  | 'crown_white'
  | 'crown_purple'
  | 'rose_petal'
  | 'marigold';

export type GarlandStyleId = 'song_chai' | 'klom_kliao' | 'dao_ruang_thong';

export type DirectionKey = 'north' | 'east' | 'south' | 'west';

export interface FlowerOption {
  id: FlowerType;
  name: string;
  meaning: string;
  color: string;
  accentColor: string;
}

export interface GarlandStyleOption {
  id: GarlandStyleId;
  name: string;
  subtitle: string;
  description: string;
  cordColor: string;
  tasselColor: string;
  recommendedFlowers: FlowerType[];
}

export interface DirectionInfo {
  key: DirectionKey;
  thaiName: string;
  sacredName: string;
  blessingFocus: string;
  compassLabel: string;
}

export interface GarlandOffering {
  id: string;
  residentName: string;
  houseNumber: string;
  garlandStyle: GarlandStyleId;
  flowers: FlowerType[];
  directionsOffered: DirectionKey[];
  wish: string;
  contributedRestoration: boolean;
  contributionAmount?: number | null;
  contributionNote?: string;
  createdAt: string;
}

export const BEAD_COUNT = 12;

export const FLOWER_CATALOG: FlowerOption[] = [
  {
    id: 'jasmine_double',
    name: 'ดอกมะลิซ้อน',
    meaning: 'ความบริสุทธิ์และความร่มเย็นเป็นสุข',
    color: '#FFFFFF',
    accentColor: '#F3E8C8',
  },
  {
    id: 'jasmine_bud',
    name: 'ดอกมะลิตูม',
    meaning: 'ศรัทธาอันงดงามและความอ่อนน้อม',
    color: '#FBFBF7',
    accentColor: '#D9E5C9',
  },
  {
    id: 'crown_white',
    name: 'ดอกรักขาว',
    meaning: 'ความรักสามัคคีของคนในหมู่บ้าน',
    color: '#F7F3FB',
    accentColor: '#DDD2EA',
  },
  {
    id: 'crown_purple',
    name: 'ดอกรักม่วง',
    meaning: 'ความมั่นคงผูกพันดุจเครือญาติ',
    color: '#B89AD9',
    accentColor: '#7C56A6',
  },
  {
    id: 'rose_petal',
    name: 'กลีบกุหลาบมอญ',
    meaning: 'เมตตามหานิยมและความสิริมงคล',
    color: '#C94A5A',
    accentColor: '#8B2635',
  },
  {
    id: 'marigold',
    name: 'กลีบดาวเรืองทอง',
    meaning: 'ความเจริญรุ่งเรืองและโชคลาภพูนทวี',
    color: '#E59D1A',
    accentColor: '#B4690E',
  },
];

export const GARLAND_STYLES: GarlandStyleOption[] = [
  {
    id: 'song_chai',
    name: 'มาลัยสองชายมงคล',
    subtitle: 'แบบประเพณีไทยโบราณ',
    description: 'ร้อยเรียงมะลิสลับกลีบกุหลาบมอญ พร้อมชายอุบะจำปาอ่อนช้อย เหมาะสำหรับคล้องบูชาองค์พระพรหม',
    cordColor: '#C99B3B',
    tasselColor: '#B44332',
    recommendedFlowers: [
      'jasmine_double',
      'jasmine_double',
      'rose_petal',
      'jasmine_bud',
      'jasmine_double',
      'crown_white',
      'crown_white',
      'jasmine_double',
      'jasmine_bud',
      'rose_petal',
      'jasmine_double',
      'jasmine_double',
    ],
  },
  {
    id: 'klom_kliao',
    name: 'มาลัยกลมเกลียวสามัคคี',
    subtitle: 'เกลียวมะลิซ้อนบริสุทธิ์',
    description: 'ร้อยดอกมะลิซ้อนและดอกรักอย่างแน่นหนา เป็นสัญลักษณ์แห่งความกลมเกลียวของลูกบ้านรุ่งอรุณ 1',
    cordColor: '#9E7D38',
    tasselColor: '#FFFFFF',
    recommendedFlowers: [
      'jasmine_double',
      'jasmine_bud',
      'crown_white',
      'jasmine_double',
      'jasmine_bud',
      'crown_purple',
      'crown_purple',
      'jasmine_bud',
      'jasmine_double',
      'crown_white',
      'jasmine_bud',
      'jasmine_double',
    ],
  },
  {
    id: 'dao_ruang_thong',
    name: 'มาลัยดาวเรืองทองรุ่งอรุณ',
    subtitle: 'มงคลแสงทองแห่งรุ่งอรุณ',
    description: 'ประดับดอกมะลิขาวแซมกลีบดาวเรืองสีทองอร่าม ดุจแสงแรกแห่งรุ่งอรุณนำพาความเจริญสู่ทุกครัวเรือน',
    cordColor: '#D49A2A',
    tasselColor: '#D98218',
    recommendedFlowers: [
      'marigold',
      'jasmine_double',
      'jasmine_double',
      'marigold',
      'jasmine_bud',
      'crown_white',
      'crown_white',
      'jasmine_bud',
      'marigold',
      'jasmine_double',
      'jasmine_double',
      'marigold',
    ],
  },
];

export const DIRECTIONS_DATA: DirectionInfo[] = [
  {
    key: 'north',
    thaiName: 'ทิศเหนือ',
    sacredName: 'พระพักตร์ทิศอุดร',
    blessingFocus: 'เมตตาบารมี ความร่มเย็น และสติปัญญา',
    compassLabel: 'น.',
  },
  {
    key: 'east',
    thaiName: 'ทิศตะวันออก',
    sacredName: 'พระพักตร์ทิศบูรพา',
    blessingFocus: 'ความเจริญรุ่งเรือง การงาน และกิจการก้าวหน้า',
    compassLabel: 'ต.อ.',
  },
  {
    key: 'south',
    thaiName: 'ทิศใต้',
    sacredName: 'พระพักตร์ทิศทักษิณ',
    blessingFocus: 'สุขภาพพลานามัยสมบูรณ์ แคล้วคลาดปลอดภัย',
    compassLabel: 'ต.',
  },
  {
    key: 'west',
    thaiName: 'ทิศตะวันตก',
    sacredName: 'พระพักตร์ทิศประจิม',
    blessingFocus: 'ความสามัคคีในครอบครัว และทรัพย์สินพูนทวี',
    compassLabel: 'ต.ต.',
  },
];

export const SAMPLE_BLESSING_PROMPTS: string[] = [
  'ขอองค์พระพรหมคุ้มครองลูกบ้านหมู่บ้านรุ่งอรุณ 1 ทุกหลังคาเรือนให้อยู่เย็นเป็นสุข รักใคร่สามัคคี และเจริญรุ่งเรืองสืบไป',
  'ขอให้การบูรณะศาลพระพรหมสำเร็จลุล่วงงดงาม นำความสิริมงคล โชคลาภ และสุขภาพแข็งแรงมาสู่ทุกครอบครัวในหมู่บ้าน',
  'ขอพรอันประเสริฐทั้งสี่ทิศดลบันดาลให้หมู่บ้านรุ่งอรุณ 1 ร่มเย็น ปลอดภัย ไร้อุปสรรค และเปี่ยมด้วยน้ำใจไมตรีต่อกัน',
];
