import paddleImg from "@/assets/product-paddle.jpg";
import rubberImg from "@/assets/product-rubber.jpg";
import bladeImg from "@/assets/product-blade.jpg";
import ballsImg from "@/assets/product-balls.jpg";

export type ProductLevel = "principiante" | "intermedio" | "avanzado" | "pro";
export type ProductType = "paleta" | "madera" | "goma" | "pelota" | "accesorio" | "kit";
export type PlayStyle = "spin" | "control" | "velocidad" | "all-round";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  type: ProductType;
  level: ProductLevel;
  style: PlayStyle;
  price: number; // CLP
  oldPrice?: number;
  image: string;
  badge?: "STOCK SANTIAGO" | "MÁS VENDIDO" | "NUEVO" | "OFERTA";
  description: string;
  specs: { label: string; value: string }[];
  rating: { speed: number; spin: number; control: number };
  shipping: string;
}

export const products: Product[] = [
  {
    id: "1", slug: "dhs-hurricane-3-neo", name: "DHS Hurricane 3 Neo", brand: "DHS",
    type: "goma", level: "pro", style: "spin", price: 24990, image: rubberImg,
    badge: "STOCK SANTIAGO",
    description: "La goma #1 de la selección China. Control absoluto y spin asesino para jugadores de elite.",
    specs: [
      { label: "Dureza", value: "39° / 40°" },
      { label: "Esponja", value: "2.15 mm" },
      { label: "Tipo", value: "Pip-in / Tacky" },
    ],
    rating: { speed: 9, spin: 10, control: 9 },
    shipping: "Despacho 10-20 días (importación directa)",
  },
  {
    id: "2", slug: "loki-arthur-europe", name: "Loki Arthur Europe", brand: "Loki",
    type: "goma", level: "avanzado", style: "velocidad", price: 32500, image: rubberImg,
    badge: "MÁS VENDIDO",
    description: "Velocidad europea con tecnología de carbono. La sensación premium a precio justo.",
    specs: [
      { label: "Dureza", value: "47.5°" },
      { label: "Esponja", value: "2.0 mm" },
      { label: "Tipo", value: "Tensor" },
    ],
    rating: { speed: 10, spin: 9, control: 8 },
    shipping: "Despacho 10-20 días (importación directa)",
  },
  {
    id: "3", slug: "butterfly-viscaria", name: "Butterfly Viscaria", brand: "Butterfly",
    type: "madera", level: "pro", style: "all-round", price: 189990, image: bladeImg,
    badge: "STOCK SANTIAGO",
    description: "El blade legendario. Estructura ALC para máxima sensación con potencia explosiva.",
    specs: [
      { label: "Capas", value: "5+2 ALC" },
      { label: "Peso", value: "90g" },
      { label: "Velocidad", value: "OFF" },
    ],
    rating: { speed: 9, spin: 8, control: 9 },
    shipping: "Despacho 10-20 días (importación directa)",
  },
  {
    id: "4", slug: "stiga-clipper-wood", name: "Stiga Clipper Wood", brand: "Stiga",
    type: "madera", level: "avanzado", style: "velocidad", price: 79990, image: bladeImg,
    description: "All-wood clásico de 7 capas. Velocidad sin compromiso para ataque puro.",
    specs: [
      { label: "Capas", value: "7 wood" },
      { label: "Peso", value: "95g" },
      { label: "Velocidad", value: "OFF+" },
    ],
    rating: { speed: 10, spin: 7, control: 7 },
    shipping: "Despacho 10-20 días (importación directa)",
  },
  {
    id: "5", slug: "kit-pingponghub-starter", name: "Kit Starter PingPongHub", brand: "PingPongHub",
    type: "kit", level: "principiante", style: "control", price: 34990, oldPrice: 44990, image: paddleImg,
    badge: "OFERTA",
    description: "Kit completo: paleta armada, 3 pelotas y funda. Listo para empezar a jugar hoy.",
    specs: [
      { label: "Paleta", value: "Pre-armada" },
      { label: "Pelotas", value: "3 estrellas x3" },
      { label: "Funda", value: "Incluida" },
    ],
    rating: { speed: 6, spin: 6, control: 9 },
    shipping: "Despacho 10-20 días (importación directa)",
  },
  {
    id: "6", slug: "nittaku-premium-3star", name: "Nittaku Premium 3★ (3u)", brand: "Nittaku",
    type: "pelota", level: "pro", style: "all-round", price: 8990, image: ballsImg,
    badge: "MÁS VENDIDO",
    description: "Pelotas oficiales aprobadas ITTF. Consistencia y rebote perfecto para entrenamiento serio.",
    specs: [
      { label: "Diámetro", value: "40+" },
      { label: "Material", value: "Plastic" },
      { label: "Pack", value: "3 unidades" },
    ],
    rating: { speed: 8, spin: 8, control: 9 },
    shipping: "Despacho 10-20 días (importación directa)",
  },
  {
    id: "7", slug: "tibhar-evolution-mxp", name: "Tibhar Evolution MX-P", brand: "Tibhar",
    type: "goma", level: "avanzado", style: "spin", price: 38990, image: rubberImg,
    description: "Goma alemana premium. Spin brutal con buen control para topspin moderno.",
    specs: [
      { label: "Dureza", value: "47.5°" },
      { label: "Esponja", value: "2.1 mm" },
      { label: "Tipo", value: "Tensor" },
    ],
    rating: { speed: 9, spin: 10, control: 8 },
    shipping: "Despacho 15-25 días (importación directa)",
  },
  {
    id: "8", slug: "yasaka-mark-v", name: "Yasaka Mark V", brand: "Yasaka",
    type: "goma", level: "intermedio", style: "all-round", price: 19990, image: rubberImg,
    description: "El clásico atemporal. Goma all-round perfecta para subir de nivel.",
    specs: [
      { label: "Dureza", value: "Medium" },
      { label: "Esponja", value: "2.0 mm" },
      { label: "Tipo", value: "Pip-in" },
    ],
    rating: { speed: 7, spin: 8, control: 9 },
    shipping: "Despacho 10-20 días (importación directa)",
  },
  {
    id: "9", slug: "donic-waldner-senso", name: "Donic Waldner Senso V1", brand: "Donic",
    type: "madera", level: "intermedio", style: "all-round", price: 64990, image: bladeImg,
    description: "Diseñado por la leyenda Jan-Ove Waldner. Sensación pura de madera con control.",
    specs: [
      { label: "Capas", value: "5 wood" },
      { label: "Peso", value: "85g" },
      { label: "Velocidad", value: "ALL+" },
    ],
    rating: { speed: 7, spin: 8, control: 9 },
    shipping: "Despacho 15-25 días (importación directa)",
  },
  {
    id: "10", slug: "andro-rasanter-r47", name: "Andro Rasanter R47", brand: "Andro",
    type: "goma", level: "pro", style: "velocidad", price: 42990, image: rubberImg,
    badge: "NUEVO",
    description: "Tecnología Energy Cell de última generación. Velocidad explosiva con catapulta.",
    specs: [
      { label: "Dureza", value: "47°" },
      { label: "Esponja", value: "2.1 mm" },
      { label: "Tipo", value: "Tensor" },
    ],
    rating: { speed: 10, spin: 9, control: 7 },
    shipping: "Despacho 15-25 días (importación directa)",
  },
  {
    id: "11", slug: "kit-pro-club", name: "Kit Pro Club PingPongHub", brand: "PingPongHub",
    type: "kit", level: "avanzado", style: "spin", price: 129990, image: paddleImg,
    badge: "STOCK SANTIAGO",
    description: "Madera Viscaria-style + 2 gomas premium + pelotas + funda. Setup competitivo.",
    specs: [
      { label: "Madera", value: "ALC 5+2" },
      { label: "Gomas", value: "Hurricane 3 Neo + Tenergy-style" },
      { label: "Extras", value: "6 pelotas + funda rígida" },
    ],
    rating: { speed: 9, spin: 9, control: 8 },
    shipping: "Despacho 10-20 días (importación directa)",
  },
  {
    id: "12", slug: "kit-niños-junior", name: "Kit Junior", brand: "PingPongHub",
    type: "kit", level: "principiante", style: "control", price: 22990, image: paddleImg,
    description: "Mango pequeño optimizado para niños 6-12 años. Incluye pelotas y guía de inicio.",
    specs: [
      { label: "Mango", value: "Reducido" },
      { label: "Peso", value: "120g" },
      { label: "Edad", value: "6-12 años" },
    ],
    rating: { speed: 5, spin: 5, control: 9 },
    shipping: "Despacho 10-20 días (importación directa)",
  },
];

export const brands = [
  "DHS", "Butterfly", "Loki", "Stiga", "Yasaka", "Tibhar", "Donic", "Andro", "Nittaku", "Joola",
];

export interface Clip {
  id: string;
  player: string;
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  city: string;
}

export const clips: Clip[] = [
  { id: "1", player: "@matias_tt", title: "Counter loop desde fuera de la mesa", thumbnail: bladeImg, views: 12400, likes: 892, city: "Santiago" },
  { id: "2", player: "@flaca_spin", title: "Servicio invertido + remate fulminante", thumbnail: paddleImg, views: 8900, likes: 654, city: "Concepción" },
  { id: "3", player: "@ramirez_pong", title: "Defensa imposible y contraataque", thumbnail: rubberImg, views: 15600, likes: 1240, city: "Valparaíso" },
  { id: "4", player: "@cami_drive", title: "Top spin de derecha a 180 km/h", thumbnail: bladeImg, views: 7200, likes: 481, city: "Santiago" },
  { id: "5", player: "@junior_chile", title: "Punto del torneo nacional sub-15", thumbnail: paddleImg, views: 23100, likes: 1890, city: "La Serena" },
  { id: "6", player: "@maestro_tt", title: "Servicio con efecto lateral imparable", thumbnail: rubberImg, views: 9800, likes: 712, city: "Santiago" },
];

export interface Tournament {
  id: string;
  name: string;
  date: string;
  city: string;
  category: string;
  status: "abierto" | "proximamente" | "finalizado";
  registerUrl?: string;
}

export const tournaments: Tournament[] = [
  { id: "1", name: "Open PingPongHub Santiago", date: "2026-05-10", city: "Santiago", category: "Todas las categorías", status: "abierto" },
  { id: "2", name: "Copa Sur Concepción", date: "2026-05-24", city: "Concepción", category: "Sub-18 / Sub-21 / Adulto", status: "abierto" },
  { id: "3", name: "Torneo Nacional Federado", date: "2026-06-14", city: "Viña del Mar", category: "Federados", status: "proximamente" },
  { id: "4", name: "Liga Metropolitana Fecha 3", date: "2026-04-26", city: "Santiago", category: "Equipos", status: "abierto" },
  { id: "5", name: "Open Norte Antofagasta", date: "2026-07-05", city: "Antofagasta", category: "Open + Veteranos", status: "proximamente" },
];

export interface RankingEntry {
  position: number;
  player: string;
  city: string;
  points: number;
  trend: "up" | "down" | "same";
}

export const ranking: RankingEntry[] = [
  { position: 1, player: "Nicolás Burgos", city: "Santiago", points: 2840, trend: "same" },
  { position: 2, player: "Felipe Olivares", city: "Concepción", points: 2710, trend: "up" },
  { position: 3, player: "Manuel Moya", city: "Santiago", points: 2680, trend: "down" },
  { position: 4, player: "Camila Aguirre", city: "Valparaíso", points: 2520, trend: "up" },
  { position: 5, player: "Diego Pérez", city: "La Serena", points: 2410, trend: "same" },
];

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  cover: string;
  date: string;
}

export const articles: Article[] = [
  { id: "1", slug: "que-goma-segun-tu-juego", title: "¿Qué goma elegir según tu estilo de juego?", excerpt: "Spin, control o velocidad — guía definitiva para no comprar mal.", category: "Guía", readTime: "6 min", cover: rubberImg, date: "2026-04-12" },
  { id: "2", slug: "loki-vs-dhs-vs-butterfly", title: "Loki vs DHS vs Butterfly: comparativa real", excerpt: "Probamos las 3 marcas top con jugadores chilenos. Resultados sorprendentes.", category: "Comparativa", readTime: "9 min", cover: bladeImg, date: "2026-04-08" },
  { id: "3", slug: "setup-recomendado-empezar", title: "Setup recomendado para empezar bien", excerpt: "El kit ideal para no abandonar en el primer mes.", category: "Principiantes", readTime: "4 min", cover: paddleImg, date: "2026-04-02" },
  { id: "4", slug: "ranking-chile-abril", title: "Ranking nacional Chile: actualización abril", excerpt: "Cambios en el top 10 y nuevos ascensos federados.", category: "Noticias", readTime: "3 min", cover: ballsImg, date: "2026-04-15" },
];

export interface LiveMatch {
  id: string;
  player1: string;
  flag1: string;
  player2: string;
  flag2: string;
  score: string;
  tournament: string;
  status: "live" | "scheduled" | "finished";
}

export const liveMatches: LiveMatch[] = [
  { id: "1", player1: "Lebrun", flag1: "🇫🇷", player2: "Ma Long", flag2: "🇨🇳", score: "4 - 2", tournament: "WTT Champions", status: "live" },
  { id: "2", player1: "Fan Zhendong", flag1: "🇨🇳", player2: "Harimoto", flag2: "🇯🇵", score: "3 - 1", tournament: "WTT Champions", status: "live" },
  { id: "3", player1: "Calderano", flag1: "🇧🇷", player2: "Moregard", flag2: "🇸🇪", score: "vs", tournament: "WTT Champions — 18:00", status: "scheduled" },
];
