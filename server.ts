import crypto from 'crypto';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_PASSCODE = process.env.ADMIN_PASSWORD || 'rungarun1';
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'offerings.json');

interface StoredOffering {
  id: string;
  residentName: string;
  houseNumber: string;
  garlandStyle: 'song_chai' | 'klom_kliao' | 'dao_ruang_thong';
  flowers: string[];
  directionsOffered: Array<'north' | 'east' | 'south' | 'west'>;
  wish: string;
  contributedRestoration: boolean;
  contributionAmount: number | null;
  contributionNote: string;
  createdAt: string;
}

const VALID_STYLES = new Set(['song_chai', 'klom_kliao', 'dao_ruang_thong']);
const VALID_FLOWERS = new Set([
  'jasmine_double',
  'jasmine_bud',
  'crown_white',
  'crown_purple',
  'rose_petal',
  'marigold',
]);
const VALID_DIRECTIONS = new Set(['north', 'east', 'south', 'west']);

const activeAdminTokens = new Map<string, number>();

function ensureDataStore(): StoredOffering[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveDataStore(items: StoredOffering[]): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
}

function verifyAdminToken(authHeader: string | undefined): boolean {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.slice(7).trim();
  const expiresAt = activeAdminTokens.get(token);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    activeAdminTokens.delete(token);
    return false;
  }
  return true;
}

function toPublicOffering(item: StoredOffering) {
  return {
    id: item.id,
    residentName: item.residentName,
    houseNumber: item.houseNumber ? `บ้าน ${item.houseNumber.slice(0, 24)}` : '',
    garlandStyle: item.garlandStyle,
    flowers: item.flowers,
    directionsOffered: item.directionsOffered,
    wish: item.wish,
    contributedRestoration: item.contributedRestoration,
    createdAt: item.createdAt,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/offerings', (_req, res) => {
    const items = ensureDataStore();
    const sorted = [...items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const directionCounts = { north: 0, east: 0, south: 0, west: 0 };
    for (const item of items) {
      for (const dir of item.directionsOffered) {
        if (dir in directionCounts) {
          directionCounts[dir] += 1;
        }
      }
    }
    res.json({
      offerings: sorted.map(toPublicOffering),
      summary: {
        totalOfferings: items.length,
        totalContributors: items.filter((i) => i.contributedRestoration).length,
        directionCounts,
      },
    });
  });

  app.post('/api/offerings', (req, res) => {
    const body = req.body ?? {};
    const residentName =
      typeof body.residentName === 'string' ? body.residentName.trim().slice(0, 80) : '';
    const houseNumber =
      typeof body.houseNumber === 'string' ? body.houseNumber.trim().slice(0, 40) : '';
    const garlandStyle =
      typeof body.garlandStyle === 'string' && VALID_STYLES.has(body.garlandStyle)
        ? (body.garlandStyle as StoredOffering['garlandStyle'])
        : null;
    const flowers = Array.isArray(body.flowers)
      ? body.flowers.filter((f: unknown): f is string => typeof f === 'string' && VALID_FLOWERS.has(f)).slice(0, 12)
      : [];
    const rawDirections: Array<'north' | 'east' | 'south' | 'west'> = Array.isArray(
      body.directionsOffered
    )
      ? body.directionsOffered.filter(
          (d: unknown): d is 'north' | 'east' | 'south' | 'west' =>
            typeof d === 'string' && VALID_DIRECTIONS.has(d)
        )
      : [];
    const directionsOffered: Array<'north' | 'east' | 'south' | 'west'> = Array.from(
      new Set(rawDirections)
    );
    const wish = typeof body.wish === 'string' ? body.wish.trim().slice(0, 400) : '';
    const contributedRestoration = Boolean(body.contributedRestoration);
    const rawAmount = Number(body.contributionAmount);
    const contributionAmount =
      contributedRestoration && Number.isFinite(rawAmount) && rawAmount > 0 && rawAmount <= 10000000
        ? Math.round(rawAmount)
        : null;
    const contributionNote =
      typeof body.contributionNote === 'string' ? body.contributionNote.trim().slice(0, 160) : '';

    if (!residentName) {
      res.status(400).json({ error: 'กรุณาระบุชื่อลูกบ้านหรือชื่อครอบครัว' });
      return;
    }
    if (!garlandStyle) {
      res.status(400).json({ error: 'กรุณาเลือกรูปแบบพวงมาลัย' });
      return;
    }
    if (flowers.length !== 12) {
      res.status(400).json({ error: 'กรุณาร้อยดอกไม้ให้ครบ 12 ดอกก่อนถวาย' });
      return;
    }
    if (directionsOffered.length !== 4) {
      res.status(400).json({ error: 'กรุณาคล้องพวงมาลัยให้ครบทั้ง 4 ทิศรอบศาลพระพรหม' });
      return;
    }
    if (!wish) {
      res.status(400).json({ error: 'กรุณาเขียนคำอธิษฐานมงคลเพื่อหมู่บ้าน' });
      return;
    }

    const newItem: StoredOffering = {
      id: crypto.randomUUID(),
      residentName,
      houseNumber,
      garlandStyle,
      flowers,
      directionsOffered,
      wish,
      contributedRestoration,
      contributionAmount,
      contributionNote,
      createdAt: new Date().toISOString(),
    };

    const items = ensureDataStore();
    items.push(newItem);
    saveDataStore(items);

    res.status(201).json({ offering: toPublicOffering(newItem) });
  });

  app.post('/api/admin/login', (req, res) => {
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!password || password !== ADMIN_PASSCODE) {
      res.status(401).json({ error: 'รหัสผ่านผู้ดูแลไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' });
      return;
    }
    const token = crypto.randomBytes(24).toString('hex');
    activeAdminTokens.set(token, Date.now() + 1000 * 60 * 60 * 4);
    res.json({ token });
  });

  app.get('/api/admin/offerings', (req, res) => {
    if (!verifyAdminToken(req.headers.authorization)) {
      res.status(401).json({ error: 'กรุณาเข้าสู่ระบบผู้ดูแลใหม่' });
      return;
    }
    const items = ensureDataStore();
    const sorted = [...items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const totalContributionAmount = items.reduce(
      (sum, item) => sum + (item.contributionAmount || 0),
      0
    );
    res.json({
      offerings: sorted,
      stats: {
        totalOfferings: items.length,
        totalGarlandsOffered: items.reduce((sum, i) => sum + i.directionsOffered.length, 0),
        totalContributors: items.filter((i) => i.contributedRestoration).length,
        totalContributionAmount,
      },
    });
  });

  app.delete('/api/admin/offerings/:id', (req, res) => {
    if (!verifyAdminToken(req.headers.authorization)) {
      res.status(401).json({ error: 'ไม่มีสิทธิ์ดำเนินการ' });
      return;
    }
    const targetId = req.params.id;
    const items = ensureDataStore();
    const nextItems = items.filter((item) => item.id !== targetId);
    if (nextItems.length === items.length) {
      res.status(404).json({ error: 'ไม่พบรายการที่ต้องการลบ' });
      return;
    }
    saveDataStore(nextItems);
    res.json({ success: true });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
