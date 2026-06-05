export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  body: string;
  date: string; // ISO string
  category: string;
  imageUrl?: string;
}

export interface EventItem {
  id: string;
  title: string;
  location: string;
  start: string; // ISO string
  description: string;
  category: string;
}

export interface CalendarItem {
  title: string;
  start: string; // ISO string
  end?: string; // ISO string
}

export interface DersKaydi {
  gun: string;
  saat: string;
  ders: string;
  derslik: string;
  hoca: string;
}

export interface WebNewsItem {
  title: string;
  url: string;
  imageUrl?: string;
  date?: string; // Stored as ISO string or parsed date string
  isDuyuru: boolean;
}

export interface ApiEvent {
  id: number;
  name: string;
  description: string;
  start?: string; // ISO string
  end?: string; // ISO string
  place: string;
  unit: string;
  typeName?: string;
  imageUrl?: string;
}

export interface YemekGunu {
  gun: string;
  ogunler: string[];
}

export interface YemekHaftasi {
  baslik: string;
  gunler: YemekGunu[];
}

export interface RehberKaydi {
  birim: string;
  telefon: string;
  email?: string;
  kategori: string;
}

export interface CampusLocation {
  name: string;
  type: 'kampus' | 'fakulte' | 'yurt' | 'kutuphane' | 'hastane' | string;
  lat: number;
  lng: number;
}

export interface BusStop {
  name: string;
  lat: number;
  lng: number;
  lines: string[];
}
