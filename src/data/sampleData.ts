import { NewsItem, EventItem, CalendarItem, CampusLocation, BusStop, DersKaydi, RehberKaydi, YemekHaftasi } from '../types';

export const sampleNews: NewsItem[] = [
  {
    id: 'n1',
    title: 'Balıkesir Üniversitesi 2026 Bahar Bilim Şenliği başladı',
    summary: 'Çağış Yerleşkesi’nde üç gün sürecek bilim şenliğinde stantlar, atölyeler ve söyleşiler öğrencileri bekliyor.',
    body: 'Üniversitemiz Çağış Yerleşkesi’nde düzenlenen Bahar Bilim Şenliği bugün açıldı. Mühendislik, fen ve sağlık fakültelerinin hazırladığı stantlarda öğrenciler proje ve deneylerini sergiliyor. Şenlik kapsamında robotik atölyeleri, kariyer söyleşileri ve akşam konserleri düzenlenecek. Etkinlik tüm öğrenci ve personele açıktır.',
    date: '2026-05-26',
    category: 'Etkinlik',
    imageUrl: 'https://picsum.photos/seed/baun1/800/450',
  },
  {
    id: 'n2',
    title: 'Mühendislik Fakültesi’nden TÜBİTAK destekli yeni proje',
    summary: 'Bilgisayar Mühendisliği bölümü öğretim üyeleri yapay zekâ tabanlı tarım projesiyle destek almaya hak kazandı.',
    body: 'Mühendislik Fakültesi Bilgisayar Mühendisliği Bölümü öğretim üyelerinin yürüteceği “Yapay Zekâ Destekli Akıllı Tarım” projesi TÜBİTAK 1001 programı kapsamında desteklenmeye değer bulundu. Proje kapsamında zeytin üretiminde verimliliği artıracak görüntü işleme tabanlı sistemler geliştirilecek.',
    date: '2026-05-22',
    category: 'Akademik',
    imageUrl: 'https://picsum.photos/seed/baun2/800/450',
  },
  {
    id: 'n3',
    title: 'Yeni dönem yemekhane ücretlerinde indirim',
    summary: 'Sağlık Kültür ve Spor Daire Başkanlığı öğrenci yemek ücretlerinde indirim yapıldığını duyurdu.',
    body: 'Sağlık Kültür ve Spor Daire Başkanlığı, öğrencilere sunulan öğle ve akşam yemeği ücretlerinde indirime gidildiğini açıkladı. Yeni ücretler önümüzdeki hafta itibarıyla tüm yerleşkelerdeki yemekhanelerde geçerli olacak.',
    date: '2026-05-19',
    category: 'Duyuru',
    imageUrl: 'https://picsum.photos/seed/baun3/800/450',
  },
  {
    id: 'n4',
    title: 'Erasmus+ başvuruları için son hafta',
    summary: 'Uluslararası İlişkiler Ofisi 2026-2027 öğretim yılı Erasmus+ öğrenim hareketliliği başvurularının yaklaştığını hatırlattı.',
    body: 'Uluslararası İlişkiler Ofisi, 2026-2027 akademik yılı Erasmus+ öğrenim hareketliliği başvurularının son haftasına girildiğini duyurdu. Başvurular çevrim içi sistem üzerinden alınıyor. Yabancı dil sınav tarihleri ofis web sayfasından takip edilebilir.',
    date: '2026-05-15',
    category: 'Duyuru',
    imageUrl: 'https://picsum.photos/seed/baun4/800/450',
  },
];

export const sampleEvents: EventItem[] = [
  {
    id: 'e1',
    title: 'Bahar Bilim Şenliği',
    location: 'Çağış Yerleşkesi Meydanı',
    start: '2026-05-29T10:00:00',
    description: 'Stantlar, atölyeler, söyleşiler ve akşam konseri.',
    category: 'Şenlik',
  },
  {
    id: 'e2',
    title: 'Kariyer Günleri 2026',
    location: 'Kongre ve Kültür Merkezi',
    start: '2026-06-03T09:30:00',
    description: 'Sektör temsilcileriyle buluşma, mülakat ve CV atölyeleri.',
    category: 'Kariyer',
  },
  {
    id: 'e3',
    title: 'Söyleşi: Yapay Zekâ ve Gelecek',
    location: 'Mühendislik Fakültesi Konferans Salonu',
    start: '2026-06-06T14:00:00',
    description: 'Alanında uzman konukların katılımıyla panel ve soru-cevap.',
    category: 'Seminer',
  },
  {
    id: 'e4',
    title: 'Bahar Konseri',
    location: 'Çağış Açık Hava Sahnesi',
    start: '2026-06-10T20:00:00',
    description: 'Öğrenci toplulukları ve sürpriz sanatçı performansı.',
    category: 'Konser',
  },
];

export const sampleCalendar: CalendarItem[] = [
  {
    title: 'Bahar Dönemi Final Sınavları',
    start: '2026-06-08',
    end: '2026-06-21',
  },
  {
    title: 'Bütünleme Sınavları',
    start: '2026-06-29',
    end: '2026-07-05',
  },
  {
    title: 'Bahar Dönemi Sonu',
    start: '2026-07-10',
  },
  {
    title: 'Güz Dönemi Kayıt Yenileme',
    start: '2026-09-14',
    end: '2026-09-20',
  },
  {
    title: 'Güz Dönemi Derslerin Başlaması',
    start: '2026-09-21',
  },
];

export const sampleCampuses: CampusLocation[] = [
  {
    name: 'Rektörlük / Çağış Yerleşkesi (Merkez)',
    type: 'kampus',
    lat: 39.53686,
    lng: 28.00183,
  },
  {
    name: 'Mühendislik Fakültesi',
    type: 'fakulte',
    lat: 39.5409,
    lng: 28.0091,
  },
  {
    name: 'Fen-Edebiyat Fakültesi',
    type: 'fakulte',
    lat: 39.53719,
    lng: 28.01146,
  },
  {
    name: 'Merkez Kütüphane',
    type: 'kutuphane',
    lat: 39.5410,
    lng: 28.0072,
  },
  {
    name: 'Tıp Fakültesi (Çağış)',
    type: 'fakulte',
    lat: 39.5349,
    lng: 28.0119,
  },
  {
    name: 'Necatibey Eğitim Fakültesi (Şehir Merkezi)',
    type: 'fakulte',
    lat: 39.6386,
    lng: 27.8794,
  },
];

export const sampleBusStops: BusStop[] = [
  {
    name: 'Kampüs - Fen Edebiyat Fakültesi',
    lat: 39.53719,
    lng: 28.01146,
    lines: ['Ü1', 'Ü2'],
  },
  {
    name: 'Kampüs Durağı (Merkez)',
    lat: 39.53933,
    lng: 28.00804,
    lines: ['Ü1', 'Ü2'],
  },
  {
    name: 'Kampüs Durağı (Kuzey)',
    lat: 39.54064,
    lng: 28.00578,
    lines: ['Ü1'],
  },
  {
    name: 'Kampüs Girişi',
    lat: 39.54656,
    lng: 27.99982,
    lines: ['Ü1', 'Ü2'],
  },
  {
    name: 'Kampüs Durağı (Güney)',
    lat: 39.53234,
    lng: 28.01533,
    lines: ['Ü2'],
  },
];

export const sampleDers: DersKaydi[] = [
  { gun: 'Pazartesi', saat: '09:00 - 10:50', ders: 'Veri Yapıları', derslik: 'D-204', hoca: 'Dr. A. Yılmaz' },
  { gun: 'Pazartesi', saat: '11:00 - 12:50', ders: 'Olasılık ve İstatistik', derslik: 'D-110', hoca: 'Doç. Dr. M. Kaya' },
  { gun: 'Salı', saat: '13:00 - 14:50', ders: 'İşletim Sistemleri', derslik: 'Lab-3', hoca: 'Dr. S. Demir' },
  { gun: 'Çarşamba', saat: '09:00 - 11:50', ders: 'Veritabanı Yönetim Sistemleri', derslik: 'Lab-1', hoca: 'Dr. E. Şahin' },
  { gun: 'Perşembe', saat: '10:00 - 11:50', ders: 'Yazılım Mühendisliği', derslik: 'D-301', hoca: 'Prof. Dr. H. Aydın' },
  { gun: 'Cuma', saat: '13:00 - 14:50', ders: 'Mobil Programlama', derslik: 'Lab-2', hoca: 'Dr. A. Yılmaz' },
];

export const sampleRehber: RehberKaydi[] = [
  { birim: 'Üniversite Santral', telefon: '+902666121000', kategori: 'Genel' },
  { birim: 'Öğrenci İşleri Daire Başkanlığı', telefon: '+902666121010', email: 'ogrenciisleri@balikesir.edu.tr', kategori: 'Genel' },
  { birim: 'Sağlık Kültür ve Spor (SKS)', telefon: '+902666121020', kategori: 'Genel' },
  { birim: 'Kütüphane ve Dokümantasyon', telefon: '+902666121030', kategori: 'Genel' },
  { birim: 'Bilgi İşlem Daire Başkanlığı', telefon: '+902666121040', email: 'bid@balikesir.edu.tr', kategori: 'Genel' },
  { birim: 'Mühendislik Fakültesi Dekanlık', telefon: '+902666121200', kategori: 'Fakülte' },
  { birim: 'Tıp Fakültesi Dekanlık', telefon: '+902666121300', kategori: 'Fakülte' },
  { birim: 'Acil / Güvenlik (Kampüs)', telefon: '+902666121999', kategori: 'Acil' },
  { birim: 'Mediko (Sağlık Merkezi)', telefon: '+902666121050', kategori: 'Acil' },
];

export const fallbackEvents: EventItem[] = sampleEvents;

export const sampleYemek: YemekHaftasi = {
  baslik: 'Haftalık Yemek Menüsü (Çevrimdışı/Örnek)',
  gunler: [
    {
      gun: 'Pazartesi',
      ogunler: ['Ezogelin Çorbası', 'Tavuk Sote', 'Pirinç Pilavı', 'Meyve veya Ayran']
    },
    {
      gun: 'Salı',
      ogunler: ['Mercimek Çorbası', 'İzmir Köfte', 'Bulgur Pilavı', 'Yoğurt veya Kemalpaşa Tatlısı']
    },
    {
      gun: 'Çarşamba',
      ogunler: ['Domates Çorbası', 'Kuru Fasulye', 'Pirinç Pilavı', 'Cacık veya Turşu']
    },
    {
      gun: 'Perşembe',
      ogunler: ['Yayla Çorbası', 'Fırın Tavuk Baget', 'Soslu Makarna', 'Meyve Suyu veya Mevsim Salata']
    },
    {
      gun: 'Cuma',
      ogunler: ['Tarhana Çorbası', 'Kıymalı Bezelye Yemeği', 'Bulgur Pilavı', 'Yoğurt veya Revani Tatlısı']
    }
  ]
};
