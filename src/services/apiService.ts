import { parse } from 'node-html-parser';
import { ApiEvent, WebNewsItem, YemekHaftasi, YemekGunu } from '../types';

const EVENTS_URL = 'https://form-api.balikesir.edu.tr/api/events?limit=5';
const YEMEK_URL = 'https://www.balikesir.edu.tr/yemek-listesi';
const SITE_BASE = 'https://www.balikesir.edu.tr';
export const HABERLER_URL = `${SITE_BASE}/haberler`;
export const DUYURULAR_URL = `${SITE_BASE}/duyurular`;

class ApiService {
  private static instance: ApiService;
  private eventsCache: ApiEvent[] | null = null;
  private yemekCache: YemekHaftasi | null = null;
  private haberCache: WebNewsItem[] | null = null;
  private duyuruCache: WebNewsItem[] | null = null;

  private gunlerSet = new Set([
    'pazartesi', 'salı', 'sali', 'çarşamba', 'carsamba',
    'perşembe', 'persembe', 'cuma', 'cumartesi', 'pazar'
  ]);

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private absoluteUrl(href: string): string {
    if (!href) return '';
    if (href.startsWith('http')) return href;
    return `${SITE_BASE}/${href.replace(/^\//, '')}`;
  }

  private dateFromUrl(url: string): string | undefined {
    const match = url.match(/(\d{8})/);
    if (!match) return undefined;
    const dateStr = match[1];
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}-${month}-${day}`;
  }

  public async fetchEvents(force = false): Promise<ApiEvent[]> {
    if (!force && this.eventsCache) return this.eventsCache;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(EVENTS_URL, {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(id);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const rawData = json.data || [];

      const list: ApiEvent[] = rawData.map((j: any) => {
        const imgPath = (j.ImagePath || '').trim();
        const imageBase = 'https://form-api.balikesir.edu.tr';
        return {
          id: Number(j.ID) || 0,
          name: (j.Name || '').trim(),
          description: (j.Description || '').trim(),
          start: j.StartDatetime || undefined,
          end: j.EndDatetime || undefined,
          place: (j.EventPlace || '').trim(),
          unit: (j.Unit || '').trim(),
          typeName: j.EventType?.Name || undefined,
          imageUrl: imgPath ? (imgPath.startsWith('http') ? imgPath : `${imageBase}${imgPath}`) : undefined,
        };
      });

      this.eventsCache = list;
      return list;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  public async fetchYemek(force = false): Promise<YemekHaftasi> {
    if (!force && this.yemekCache) return this.yemekCache;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 20000);

    try {
      const res = await fetch(YEMEK_URL, {
        headers: { 'User-Agent': 'Mozilla/5.0 (BAUN Mobil RN)' },
        signal: controller.signal,
      });
      clearTimeout(id);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const htmlText = await res.text();
      const root = parse(htmlText);

      // Find date/menu title
      let baslik = 'Haftalık Yemek Listesi';
      let firstMatch: string | null = null;
      
      const headings = root.querySelectorAll('.cstRow h2, h2');
      for (const h of headings) {
        const text = h.text.replace(/\s+/g, ' ').trim();
        if (text.toLowerCase().includes('yemek listesi')) {
          if (!firstMatch) firstMatch = text;
          if (/\d/.test(text)) {
            baslik = text;
            break;
          }
        }
      }
      if (baslik === 'Haftalık Yemek Listesi' && firstMatch) {
        baslik = firstMatch;
      }

      // Parse the table
      const table = root.querySelector('table.table-bordered') || root.querySelector('table');
      const gunler: YemekGunu[] = [];

      if (table) {
        const rows = table.querySelectorAll('tr');
        for (const row of rows) {
          const cells = row.querySelectorAll('td');
          if (cells.length === 0) continue;

          const gun = cells[0].text.replace(/\xA0/g, ' ').trim(); // Replace &nbsp; equivalent
          const ogunler = cells.slice(1).map(c => c.text.replace(/\xA0/g, ' ').trim()).filter(s => s.length > 0);

          const isGun = this.gunlerSet.has(gun.toLowerCase());
          if (!isGun && ogunler.length === 0) continue;
          if (gun.length === 0 && ogunler.length === 0) continue;

          gunler.push({
            gun: gun.length === 0 ? '-' : gun,
            ogunler: ogunler
          });
        }
      }

      const hafta: YemekHaftasi = { baslik, gunler };
      this.yemekCache = hafta;
      return hafta;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  public async fetchHaberler(limit = 5, force = false): Promise<WebNewsItem[]> {
    if (!force && this.haberCache) return this.haberCache;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 20000);

    try {
      const res = await fetch(HABERLER_URL, {
        headers: { 'User-Agent': 'Mozilla/5.0 (BAUN Mobil RN)' },
        signal: controller.signal,
      });
      clearTimeout(id);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const htmlText = await res.text();
      const root = parse(htmlText);

      const items: WebNewsItem[] = [];
      const links = root.querySelectorAll('a.northwood-news__news-item-content');

      for (const a of links) {
        const href = a.getAttribute('href') || '';
        if (!href) continue;

        const title = (a.getAttribute('title') || a.querySelector('.northwood-news__news-item-title')?.text || '').trim();
        const img = a.querySelector('img')?.getAttribute('src');

        items.push({
          title,
          url: this.absoluteUrl(href),
          imageUrl: img ? this.absoluteUrl(img) : undefined,
          date: this.dateFromUrl(href),
          isDuyuru: false,
        });

        if (items.length >= limit) break;
      }

      this.haberCache = items;
      return items;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  public async fetchDuyurular(limit = 5, force = false): Promise<WebNewsItem[]> {
    if (!force && this.duyuruCache) return this.duyuruCache;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 20000);

    try {
      const res = await fetch(DUYURULAR_URL, {
        headers: { 'User-Agent': 'Mozilla/5.0 (BAUN Mobil RN)' },
        signal: controller.signal,
      });
      clearTimeout(id);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const htmlText = await res.text();
      const root = parse(htmlText);

      const items: WebNewsItem[] = [];
      const links = root.querySelectorAll('a.northwood-events__event-link');

      for (const a of links) {
        const href = a.getAttribute('href') || '';
        if (!href) continue;

        const title = (a.querySelector('.northwood-events__event-title')?.text || '').trim();
        if (!title) continue;

        items.push({
          title,
          url: this.absoluteUrl(href),
          date: this.dateFromUrl(href),
          isDuyuru: true,
        });

        if (items.length >= limit) break;
      }

      this.duyuruCache = items;
      return items;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }
}

export default ApiService;
