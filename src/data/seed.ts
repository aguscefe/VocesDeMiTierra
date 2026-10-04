import type { AppStore } from "./types";
import img7 from "../imports/7.jpg";
import img8 from "../imports/8.jpg";
import img9 from "../imports/9.jpg";
import img2 from "../imports/2.jpg";
import img6 from "../imports/6.jpg";

const UNSPLASH_CRAFTS = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1603344797033-f0f4f587ab60?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1582657233633-6b32d2e7b28a?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1546484458-6904289cd4f0?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1566275529824-cca6d008f3da?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1509721434272-b79147e0e708?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1524721696987-b9527df9e512?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=600&h=600&fit=crop&auto=format",
];

const PRODUCER_PHOTOS = [
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=400&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1546961342-ea5f62d951f4?w=400&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&auto=format",
];

export const SEED_DATA: AppStore = {
 consents: [], audit_logs: [],
  users: [
    { id: "u1", name: "María González", email: "consumidor@vocesdemo.mx", role: "consumer", phone: "998-100-0001", status: "active", created_at: "2026-01-15", last_login: "2026-08-28" },
    { id: "u2", name: "Antonio Puc Dzul", email: "productor@vocesdemo.mx", role: "producer", phone: "983-200-0002", status: "active", created_at: "2026-01-10", last_login: "2026-08-29" },
    { id: "u3", name: "Admin Sistema", email: "admin@vocesdemo.mx", role: "admin", phone: "998-300-0003", status: "active", created_at: "2025-12-01", last_login: "2026-08-30" },
    { id: "u4", name: "Sofía Chan Balam", email: "sofia.chan@vocesdemo.mx", role: "producer", phone: "983-100-0004", status: "active", created_at: "2026-02-01", last_login: "2026-08-25" },
    { id: "u5", name: "Rosa Tun Ek", email: "rosa.tun@vocesdemo.mx", role: "producer", phone: "984-100-0005", status: "active", created_at: "2026-02-15", last_login: "2026-08-20" },
    { id: "u6", name: "Felipe Cahum Cen", email: "felipe.cahum@vocesdemo.mx", role: "producer", phone: "997-100-0006", status: "active", created_at: "2026-03-01", last_login: "2026-08-18" },
    { id: "u7", name: "Carmen Kantún Pat", email: "carmen.kantun@vocesdemo.mx", role: "producer", phone: "983-200-0007", status: "active", created_at: "2026-03-10", last_login: "2026-08-22" },
    { id: "u8", name: "José Cauich Hau", email: "jose.cauich@vocesdemo.mx", role: "producer", phone: "987-100-0008", status: "active", created_at: "2026-04-01", last_login: "2026-08-15" },
    { id: "u9", name: "Luisa Poot Cen", email: "luisa.poot@vocesdemo.mx", role: "producer", phone: "983-300-0009", status: "active", created_at: "2026-04-15", last_login: "2026-08-10" },
    { id: "u10", name: "Miguel Uc Xool", email: "miguel.uc@vocesdemo.mx", role: "producer", phone: "997-200-0010", status: "active", created_at: "2026-05-01", last_login: "2026-08-05" },
  ],

  producer_profiles: [
    { id: "pp1", user_id: "u2", workshop_name: "Taller Puc Dzul", biography: "Artesano maya con más de 20 años de experiencia en tejido de hamacas y bordado tradicional. Sus piezas reflejan los patrones geométricos propios de la región de Felipe Carrillo Puerto.", community: "Felipe Carrillo Puerto", municipality: "Felipe Carrillo Puerto", languages: ["Español", "Maya"], craft_types: ["Textiles y bordados", "Fibras naturales"], years_experience: 20, profile_image: img6, authorization_status: "approved", verified_contact: true, rating: 4.8, total_products: 6 },
    { id: "pp2", user_id: "u4", workshop_name: "Colectivo Balam", biography: "Colectivo de mujeres artesanas de José María Morelos especializadas en bordado de punto de cruz con diseños inspirados en la flora y fauna de Quintana Roo.", community: "José María Morelos", municipality: "José María Morelos", languages: ["Español", "Maya"], craft_types: ["Textiles y bordados"], years_experience: 15, profile_image: PRODUCER_PHOTOS[1], authorization_status: "approved", verified_contact: true, rating: 4.9, total_products: 5 },
    { id: "pp3", user_id: "u5", workshop_name: "Cerámica Tun", biography: "Productora de cerámica artesanal en Tulum con técnicas prehispánicas recuperadas y adaptadas. Cada pieza es única y refleja el simbolismo cosmológico maya.", community: "Tulum", municipality: "Tulum", languages: ["Español"], craft_types: ["Cerámica", "Decoración"], years_experience: 12, profile_image: PRODUCER_PHOTOS[2], authorization_status: "approved", verified_contact: true, rating: 4.7, total_products: 4 },
    { id: "pp4", user_id: "u6", workshop_name: "Madera Viva Bacalar", biography: "Taller de carpintería artesanal en Bacalar. Felipe trabaja con maderas locales de origen sustentable para crear muebles y piezas decorativas de uso cotidiano.", community: "Bacalar", municipality: "Bacalar", languages: ["Español"], craft_types: ["Madera", "Decoración"], years_experience: 18, profile_image: img2, authorization_status: "approved", verified_contact: true, rating: 4.6, total_products: 3 },
    { id: "pp5", user_id: "u7", workshop_name: "Joyería Kantún", biography: "Diseñadora de joyería artesanal que fusiona técnicas prehispánicas con materiales contemporáneos. Sus piezas incorporan piedras semipreciosas de la región.", community: "Benito Juárez", municipality: "Benito Juárez", languages: ["Español"], craft_types: ["Joyería artesanal", "Accesorios"], years_experience: 8, profile_image: PRODUCER_PHOTOS[4], authorization_status: "approved", verified_contact: true, rating: 4.9, total_products: 4 },
    { id: "pp6", user_id: "u8", workshop_name: "Fibras Cauich", biography: "Productor de artesanías en fibras naturales como henequén, palma y bejuco. Sus piezas son ecológicas y de alta durabilidad.", community: "Lázaro Cárdenas", municipality: "Lázaro Cárdenas", languages: ["Español", "Maya"], craft_types: ["Fibras naturales", "Accesorios"], years_experience: 25, profile_image: PRODUCER_PHOTOS[5], authorization_status: "approved", verified_contact: false, rating: 4.5, total_products: 3 },
    { id: "pp7", user_id: "u9", workshop_name: "Textiles Poot", biography: "Tejedora de huipiles y ropa tradicional maya en Cozumel. Sus diseños mantienen los patrones ancestrales transmitidos de generación en generación.", community: "Cozumel", municipality: "Cozumel", languages: ["Español", "Maya"], craft_types: ["Textiles y bordados"], years_experience: 30, profile_image: PRODUCER_PHOTOS[6], authorization_status: "approved", verified_contact: true, rating: 5.0, total_products: 3 },
    { id: "pp8", user_id: "u10", workshop_name: "Arte Uc", biography: "Artesano de pintura en barro y decoración mural con motivos prehispánicos. Trabaja con materiales naturales de la zona costera de Quintana Roo.", community: "Bacalar", municipality: "Bacalar", languages: ["Español"], craft_types: ["Cerámica", "Decoración"], years_experience: 10, profile_image: PRODUCER_PHOTOS[7], authorization_status: "pending", verified_contact: false, rating: 4.3, total_products: 2 },
  ],

  products: [
    { id: "prod1", producer_id: "pp1", name: "Rebozo tejido con motivos mayas", category: "Textiles y bordados", description: "Rebozo tejido a mano en tonos tierra y azul, con motivos geométricos inspirados en la tradición textil maya y acabado de flecos anudados.", price: 1200, stock: 8, status: "published", materials: ["Algodón natural", "Tintes textiles"], technique: "Tejido tradicional y anudado de flecos", production_time: "7-10 días", package_weight: 0.8, package_dimensions: "40x30x8cm", featured_image: img8, gallery: [img8], created_at: "2026-03-01", updated_at: "2026-08-01", views: 342, favorites_count: 28 },
    { id: "prod2", producer_id: "pp2", name: "Camino de mesa bordado a mano", category: "Textiles y bordados", description: "Camino de mesa con bordado de punto de cruz en tela de lino. Motivos florales y de animales regionales. Medidas: 150x40cm.", price: 650, stock: 15, status: "published", materials: ["Lino", "Hilo de algodón"], technique: "Bordado de punto de cruz", production_time: "3-5 días", package_weight: 0.5, package_dimensions: "30x20x5cm", featured_image: UNSPLASH_CRAFTS[1], gallery: [UNSPLASH_CRAFTS[1], UNSPLASH_CRAFTS[2]], created_at: "2026-03-15", updated_at: "2026-08-10", views: 215, favorites_count: 19 },
    { id: "prod3", producer_id: "pp3", name: "Vasija decorativa de barro negro", category: "Cerámica", description: "Vasija de cerámica de barro negro con acabado pulido. Diseño inspirado en motivos mayas clásicos. Pieza única de colección.", price: 850, stock: 4, status: "published", materials: ["Barro negro", "Pigmentos naturales"], technique: "Alfarería a mano y horno de leña", production_time: "14 días", package_weight: 1.2, package_dimensions: "25x25x25cm", featured_image: img7, gallery: [img7, UNSPLASH_CRAFTS[3]], created_at: "2026-04-01", updated_at: "2026-08-05", views: 189, favorites_count: 22 },
    { id: "prod4", producer_id: "pp4", name: "Jícara tallada con motivos mayas", category: "Madera", description: "Jícara ceremonial tallada a mano con diseños geométricos y florales de tradición maya. Pieza decorativa y funcional de origen sustentable.", price: 480, stock: 10, status: "published", materials: ["Madera de cedro local"], technique: "Tallado a mano y pirograbado", production_time: "5 días", package_weight: 0.8, package_dimensions: "20x15x10cm", featured_image: img9, gallery: [img9, UNSPLASH_CRAFTS[4]], created_at: "2026-04-10", updated_at: "2026-08-08", views: 156, favorites_count: 15 },
    { id: "prod5", producer_id: "pp5", name: "Collar de jade y plata artesanal", category: "Joyería artesanal", description: "Collar con colgante de jade auténtico engarzado en plata. Diseño inspirado en la joyería maya clásica. Certificado de procedencia declarada.", price: 1800, stock: 3, status: "published", materials: ["Jade", "Plata 925"], technique: "Cincelado y engaste en frío", production_time: "10-15 días", package_weight: 0.1, package_dimensions: "15x10x3cm", featured_image: UNSPLASH_CRAFTS[4], gallery: [UNSPLASH_CRAFTS[4], UNSPLASH_CRAFTS[5]], created_at: "2026-04-20", updated_at: "2026-08-12", views: 423, favorites_count: 41 },
    { id: "prod6", producer_id: "pp6", name: "Bolsa tejida de henequén natural", category: "Fibras naturales", description: "Bolsa de mano tejida con fibra de henequén natural. Resistente y ecológica. Con diseño geométrico en dos tonos naturales.", price: 320, stock: 20, status: "published", materials: ["Henequén", "Tintes naturales"], technique: "Tejido a mano", production_time: "3 días", package_weight: 0.4, package_dimensions: "35x30x5cm", featured_image: UNSPLASH_CRAFTS[5], gallery: [UNSPLASH_CRAFTS[5], UNSPLASH_CRAFTS[6]], created_at: "2026-05-01", updated_at: "2026-08-15", views: 198, favorites_count: 17 },
    { id: "prod7", producer_id: "pp7", name: "Huipil tradicional bordado a mano", category: "Textiles y bordados", description: "Huipil de tela de manta bordado a mano con flores y aves. Talla única ajustable. Colores vivos con hilo de algodón mercerizado.", price: 2200, stock: 5, status: "published", materials: ["Manta de algodón", "Hilo mercerizado"], technique: "Bordado a mano", production_time: "20-25 días", package_weight: 0.6, package_dimensions: "40x30x5cm", featured_image: UNSPLASH_CRAFTS[6], gallery: [UNSPLASH_CRAFTS[6], UNSPLASH_CRAFTS[7]], created_at: "2026-05-10", updated_at: "2026-08-18", views: 512, favorites_count: 55 },
    { id: "prod8", producer_id: "pp1", name: "Portavasos de palma trenzada (set de 6)", category: "Fibras naturales", description: "Set de 6 portavasos circulares tejidos con palma natural. Resistentes al agua. Diseño geométrico con colores naturales.", price: 180, stock: 30, status: "published", materials: ["Palma natural"], technique: "Trenzado maya", production_time: "2 días", package_weight: 0.3, package_dimensions: "20x20x5cm", featured_image: UNSPLASH_CRAFTS[7], gallery: [UNSPLASH_CRAFTS[7], UNSPLASH_CRAFTS[8]], created_at: "2026-05-15", updated_at: "2026-08-20", views: 289, favorites_count: 24 },
    { id: "prod9", producer_id: "pp8", name: "Panel decorativo de barro pintado a mano", category: "Decoración", description: "Panel cuadrado de 30x30cm en barro cocido con diseño de calendario maya pintado a mano. Listo para colgar.", price: 550, stock: 6, status: "published", materials: ["Barro cocido", "Pintura natural"], technique: "Modelado y pintura a mano", production_time: "7 días", package_weight: 1.0, package_dimensions: "35x35x5cm", featured_image: UNSPLASH_CRAFTS[8], gallery: [UNSPLASH_CRAFTS[8], UNSPLASH_CRAFTS[9]], created_at: "2026-05-20", updated_at: "2026-08-22", views: 134, favorites_count: 11 },
    { id: "prod10", producer_id: "pp2", name: "Mantel individual bordado flores silvestres", category: "Textiles y bordados", description: "Mantel individual en lino natural bordado a mano con flores silvestres de la selva maya. Set de dos piezas.", price: 420, stock: 12, status: "published", materials: ["Lino", "Hilo de seda"], technique: "Bordado libre a mano", production_time: "4 días", package_weight: 0.3, package_dimensions: "35x25x3cm", featured_image: UNSPLASH_CRAFTS[9], gallery: [UNSPLASH_CRAFTS[9], UNSPLASH_CRAFTS[10]], created_at: "2026-06-01", updated_at: "2026-08-25", views: 167, favorites_count: 13 },
    { id: "prod11", producer_id: "pp5", name: "Aretes de plata con turquesa", category: "Joyería artesanal", description: "Aretes de plata 925 con incrustación de turquesa natural. Diseño prehispánico contemporáneo.", price: 780, stock: 7, status: "published", materials: ["Plata 925", "Turquesa"], technique: "Cincelado a mano", production_time: "5-7 días", package_weight: 0.05, package_dimensions: "10x8x3cm", featured_image: UNSPLASH_CRAFTS[10], gallery: [UNSPLASH_CRAFTS[10], UNSPLASH_CRAFTS[11]], created_at: "2026-06-05", updated_at: "2026-08-26", views: 298, favorites_count: 33 },
    { id: "prod12", producer_id: "pp4", name: "Portarretratos de madera tallada", category: "Madera", description: "Portarretratos de madera de parota tallada a mano con motivos de ceiba. Para foto 13x18cm.", price: 280, stock: 15, status: "published", materials: ["Madera de parota"], technique: "Tallado y pirograbado", production_time: "3 días", package_weight: 0.4, package_dimensions: "20x15x5cm", featured_image: UNSPLASH_CRAFTS[11], gallery: [UNSPLASH_CRAFTS[11], UNSPLASH_CRAFTS[12]], created_at: "2026-06-10", updated_at: "2026-08-27", views: 122, favorites_count: 9 },
    { id: "prod13", producer_id: "pp3", name: "Taza de cerámica con motivos tropicales", category: "Cerámica", description: "Taza de 350ml en cerámica artesanal con diseño de fauna tropical pintado a mano. Apta para uso en horno y lavavajillas.", price: 340, stock: 18, status: "published", materials: ["Cerámica de gres", "Esmaltes naturales"], technique: "Torneado y pintado a mano", production_time: "5 días", package_weight: 0.4, package_dimensions: "15x12x12cm", featured_image: UNSPLASH_CRAFTS[12], gallery: [UNSPLASH_CRAFTS[12], UNSPLASH_CRAFTS[13]], created_at: "2026-06-15", updated_at: "2026-08-28", views: 201, favorites_count: 18 },
    { id: "prod14", producer_id: "pp6", name: "Canasta de palma para frutas", category: "Fibras naturales", description: "Canasta tejida de palma natural con asa. Ideal para frutas o como decoración. Diseño maya clásico.", price: 260, stock: 25, status: "published", materials: ["Palma natural", "Bejuco"], technique: "Cestería maya", production_time: "2 días", package_weight: 0.5, package_dimensions: "35x35x20cm", featured_image: UNSPLASH_CRAFTS[13], gallery: [UNSPLASH_CRAFTS[13], UNSPLASH_CRAFTS[14]], created_at: "2026-06-20", updated_at: "2026-08-29", views: 145, favorites_count: 12 },
    { id: "prod15", producer_id: "pp7", name: "Tapete de algodón tejido en telar", category: "Textiles y bordados", description: "Tapete 60x90cm tejido en telar de pedal con algodón natural. Diseño de rombos geométricos en colores naturales tierra.", price: 920, stock: 6, status: "published", materials: ["Algodón natural", "Tintes naturales"], technique: "Tejido en telar de pedal", production_time: "8 días", package_weight: 1.5, package_dimensions: "40x30x10cm", featured_image: UNSPLASH_CRAFTS[14], gallery: [UNSPLASH_CRAFTS[14], UNSPLASH_CRAFTS[15]], created_at: "2026-07-01", updated_at: "2026-08-29", views: 187, favorites_count: 21 },
    { id: "prod16", producer_id: "pp1", name: "Estola de algodón con flecos", category: "Textiles y bordados", description: "Estola 180x60cm tejida en telar de cintura con algodón natural. Diseño de rombos en tonos naturales.", price: 750, stock: 9, status: "published", materials: ["Algodón natural"], technique: "Tejido en telar de cintura", production_time: "6 días", package_weight: 0.4, package_dimensions: "30x20x5cm", featured_image: UNSPLASH_CRAFTS[15], gallery: [UNSPLASH_CRAFTS[15], UNSPLASH_CRAFTS[16]], created_at: "2026-07-05", updated_at: "2026-08-28", views: 163, favorites_count: 14 },
    { id: "prod17", producer_id: "pp8", name: "Figura decorativa de barro jaguar", category: "Cerámica", description: "Figura de jaguar en barro modelado a mano y pintado con pigmentos naturales. Altura 15cm. Pieza única.", price: 420, stock: 3, status: "published", materials: ["Barro", "Pigmentos naturales"], technique: "Modelado a mano", production_time: "5 días", package_weight: 0.6, package_dimensions: "20x15x15cm", featured_image: UNSPLASH_CRAFTS[16], gallery: [UNSPLASH_CRAFTS[16], UNSPLASH_CRAFTS[17]], created_at: "2026-07-10", updated_at: "2026-08-27", views: 98, favorites_count: 7 },
    { id: "prod18", producer_id: "pp5", name: "Pulsera de plata con obsidiana", category: "Joyería artesanal", description: "Pulsera ajustable de plata 925 con obsidiana negra pulida. Diseño minimalista con influencia maya.", price: 560, stock: 10, status: "published", materials: ["Plata 925", "Obsidiana"], technique: "Cincelado y engaste", production_time: "4-6 días", package_weight: 0.05, package_dimensions: "10x8x3cm", featured_image: UNSPLASH_CRAFTS[17], gallery: [UNSPLASH_CRAFTS[17], UNSPLASH_CRAFTS[18]], created_at: "2026-07-15", updated_at: "2026-08-26", views: 231, favorites_count: 27 },
    { id: "prod19", producer_id: "pp2", name: "Cojín bordado con tucán", category: "Textiles y bordados", description: "Cojín 40x40cm con bordado de tucán a punto de cruz. Relleno de algodón incluido. Cierre en la parte inferior.", price: 480, stock: 8, status: "published", materials: ["Tela de lino", "Hilo mercerizado", "Relleno algodón"], technique: "Bordado de punto de cruz", production_time: "5-7 días", package_weight: 0.7, package_dimensions: "42x42x10cm", featured_image: UNSPLASH_CRAFTS[18], gallery: [UNSPLASH_CRAFTS[18], UNSPLASH_CRAFTS[19]], created_at: "2026-07-20", updated_at: "2026-08-25", views: 143, favorites_count: 16 },
    { id: "prod20", producer_id: "pp4", name: "Cuadro de madera con mapa de Quintana Roo", category: "Decoración", description: "Mapa de Quintana Roo cortado y tallado en madera de cedro. Enmarcado con listón natural. Medidas: 30x40cm.", price: 680, stock: 12, status: "published", materials: ["Madera de cedro"], technique: "Calado y tallado CNC artesanal", production_time: "4 días", package_weight: 0.8, package_dimensions: "35x45x5cm", featured_image: UNSPLASH_CRAFTS[19], gallery: [UNSPLASH_CRAFTS[19], UNSPLASH_CRAFTS[0]], created_at: "2026-07-25", updated_at: "2026-08-24", views: 176, favorites_count: 20 },
  ],

  cultural_records: [
    { id: "cr1", product_id: "prod1", community_origin: "Felipe Carrillo Puerto", author_name: "Antonio Puc Dzul", cultural_description: "La hamaca tiene profundas raíces en la cultura maya peninsular. Tradicionalmente tejida por hombres, era el lugar de descanso principal en el hogar. Los diseños geométricos transmiten significados cosmológicos.", process: "Se seleccionan fibras de algodón natural, se tiñen con tintes vegetales y se tejen en telar de cintura siguiendo patrones heredados.", authorized_text: "Información declarada y autorizada por el productor. No constituye una certificación oficial de autenticidad.", maya_content_status: "pending", consent_id: "cons1", disclaimer: "Contenido en maya pendiente de validación" },
    { id: "cr2", product_id: "prod7", community_origin: "Cozumel", author_name: "Luisa Poot Cen", cultural_description: "El huipil es la vestimenta femenina tradicional maya. Los bordados representan el árbol del mundo y las deidades florales. Cada diseño varía por comunidad.", process: "La tela de manta se corta y cose a mano. El bordado lleva semanas de trabajo meticuloso con hilo de diferentes calibres.", authorized_text: "Información declarada y autorizada por la productora. No constituye certificación oficial.", maya_content_status: "pending", consent_id: "cons2", disclaimer: "Contenido en maya pendiente de validación" },
  ],

  orders: [
    { id: "ord1", order_number: "VMT-2026-0001", consumer_id: "u1", producer_id: "pp2", status: "delivered", subtotal: 650, shipping: 120, total: 770, platform_commission: 65, producer_net: 585, processing_cost: 30.74, created_at: "2026-03-10", estimated_delivery: "2026-03-17", items: [{ product_id: "prod2", quantity: 1, unit_price: 650 }], consumer_address: "Calle 20 #45, Cancún, Q.Roo", tracking_number: "TRK001230001", carrier: "Estafeta" },
    { id: "ord2", order_number: "VMT-2026-0002", consumer_id: "u1", producer_id: "pp1", status: "delivered", subtotal: 1200, shipping: 150, total: 1350, platform_commission: 120, producer_net: 1080, processing_cost: 46.20, created_at: "2026-04-05", estimated_delivery: "2026-04-15", items: [{ product_id: "prod1", quantity: 1, unit_price: 1200 }], consumer_address: "Calle 20 #45, Cancún, Q.Roo", tracking_number: "TRK001230002", carrier: "FedEx" },
    { id: "ord3", order_number: "VMT-2026-0003", consumer_id: "u1", producer_id: "pp5", status: "shipped", subtotal: 1800, shipping: 80, total: 1880, platform_commission: 180, producer_net: 1620, processing_cost: 67.80, created_at: "2026-08-20", estimated_delivery: "2026-09-01", items: [{ product_id: "prod5", quantity: 1, unit_price: 1800 }], consumer_address: "Calle 20 #45, Cancún, Q.Roo", tracking_number: "TRK001230003", carrier: "DHL" },
    { id: "ord4", order_number: "VMT-2026-0004", consumer_id: "u1", producer_id: "pp7", status: "preparing", subtotal: 2200, shipping: 120, total: 2320, platform_commission: 220, producer_net: 1980, processing_cost: 82.20, created_at: "2026-08-26", estimated_delivery: "2026-09-05", items: [{ product_id: "prod7", quantity: 1, unit_price: 2200 }], consumer_address: "Calle 20 #45, Cancún, Q.Roo" },
    { id: "ord5", order_number: "VMT-2026-0005", consumer_id: "u1", producer_id: "pp3", status: "paid", subtotal: 850, shipping: 100, total: 950, platform_commission: 85, producer_net: 765, processing_cost: 33.60, created_at: "2026-08-29", estimated_delivery: "2026-09-08", items: [{ product_id: "prod3", quantity: 1, unit_price: 850 }], consumer_address: "Calle 20 #45, Cancún, Q.Roo" },
    { id: "ord6", order_number: "VMT-2026-0006", consumer_id: "u1", producer_id: "pp2", status: "delivered", subtotal: 420, shipping: 90, total: 510, platform_commission: 42, producer_net: 378, processing_cost: 18.12, created_at: "2026-05-12", estimated_delivery: "2026-05-20", items: [{ product_id: "prod10", quantity: 1, unit_price: 420 }], consumer_address: "Calle 20 #45, Cancún, Q.Roo", tracking_number: "TRK001230006", carrier: "Correos México" },
  ],

  payments: [
    { id: "pay1", order_id: "ord1", sandbox_transaction_id: "SBX-VMT-2026-0001", method: "card", status: "approved", amount: 770, card_last_four: "4242", simulated: true, created_at: "2026-03-10" },
    { id: "pay2", order_id: "ord2", sandbox_transaction_id: "SBX-VMT-2026-0002", method: "card", status: "approved", amount: 1350, card_last_four: "4242", simulated: true, created_at: "2026-04-05" },
    { id: "pay3", order_id: "ord3", sandbox_transaction_id: "SBX-VMT-2026-0003", method: "transfer", status: "approved", amount: 1880, simulated: true, created_at: "2026-08-20" },
    { id: "pay4", order_id: "ord4", sandbox_transaction_id: "SBX-VMT-2026-0004", method: "card", status: "approved", amount: 2320, card_last_four: "4242", simulated: true, created_at: "2026-08-26" },
    { id: "pay5", order_id: "ord5", sandbox_transaction_id: "SBX-VMT-2026-0005", method: "card", status: "approved", amount: 950, card_last_four: "4242", simulated: true, created_at: "2026-08-29" },
    { id: "pay6", order_id: "ord6", sandbox_transaction_id: "SBX-VMT-2026-0006", method: "card", status: "approved", amount: 510, card_last_four: "4242", simulated: true, created_at: "2026-05-12" },
  ],

  reviews: [
    { id: "rev1", order_id: "ord1", consumer_id: "u1", product_id: "prod2", rating: 5, comment: "Camino de mesa hermosísimo. El bordado es muy detallado. Llegó bien empacado.", status: "published", consumer_name: "María G.", created_at: "2026-03-20" },
    { id: "rev2", order_id: "ord2", consumer_id: "u1", product_id: "prod1", rating: 5, comment: "La hamaca es de excelente calidad. Muy cómoda y bien tejida. 100% recomendable.", status: "published", consumer_name: "María G.", created_at: "2026-04-18" },
    { id: "rev3", order_id: "ord6", consumer_id: "u1", product_id: "prod10", rating: 4, comment: "El mantel es precioso. El bordado muy fino. Solo bajé una estrella porque tardó un poco más de lo esperado.", status: "published", consumer_name: "María G.", created_at: "2026-05-25" },
    { id: "rev4", order_id: "ord1", consumer_id: "u1", product_id: "prod5", rating: 5, comment: "El collar es espectacular. El jade es precioso y la plata de buena calidad.", status: "published", consumer_name: "María G.", created_at: "2026-07-10" },
    { id: "rev5", order_id: "ord2", consumer_id: "u1", product_id: "prod7", rating: 5, comment: "El huipil es una joya de la artesanía maya. El bordado a mano es impresionante.", status: "published", consumer_name: "María G.", created_at: "2026-07-22" },
    { id: "rev6", order_id: "ord3", consumer_id: "u1", product_id: "prod3", rating: 4, comment: "La vasija es hermosa. Se nota el trabajo artesanal. Llegó muy bien protegida.", status: "published", consumer_name: "María G.", created_at: "2026-08-01" },
    { id: "rev7", order_id: "ord4", consumer_id: "u1", product_id: "prod11", rating: 5, comment: "Los aretes son preciosos. La turquesa tiene un color increíble. Excelente servicio.", status: "published", consumer_name: "María G.", created_at: "2026-08-10" },
    { id: "rev8", order_id: "ord5", consumer_id: "u1", product_id: "prod18", rating: 5, comment: "La pulsera es elegante y de muy buena calidad. La obsidiana es auténtica.", status: "published", consumer_name: "María G.", created_at: "2026-08-15" },
  ],

  notifications: [
    { id: "n1", user_id: "u1", type: "order_shipped", title: "Tu pedido fue enviado", message: "Tu pedido VMT-2026-0003 fue enviado. Número de guía: TRK001230003", read: false, created_at: "2026-08-22" },
    { id: "n2", user_id: "u1", type: "order_preparing", title: "Tu pedido está en preparación", message: "Tu pedido VMT-2026-0004 está siendo preparado por el artesano.", read: false, created_at: "2026-08-27" },
    { id: "n3", user_id: "u1", type: "payment_approved", title: "Pago aprobado", message: "Tu pago sandbox SBX-VMT-2026-0005 fue aprobado. Pedido VMT-2026-0005 confirmado.", read: true, created_at: "2026-08-29" },
    { id: "n4", user_id: "u2", type: "new_order", title: "Nueva venta recibida", message: "Recibiste un nuevo pedido VMT-2026-0001 por $770.00 MXN.", read: true, created_at: "2026-03-10" },
    { id: "n5", user_id: "u2", type: "product_published", title: "Producto publicado", message: "Tu producto 'Camino de mesa bordado a mano' fue aprobado y está publicado.", read: true, created_at: "2026-03-15" },
    { id: "n6", user_id: "u2", type: "low_stock", title: "Stock bajo", message: "Tu producto 'Rebozo tejido con motivos mayas' tiene solo 8 unidades en stock.", read: false, created_at: "2026-08-28" },
  ],

  qr_codes: [
    { id: "qr1", product_id: "prod1", public_url: "/producto/prod1", scans: 45, last_scan: "2026-08-29", active: true },
    { id: "qr2", product_id: "prod2", public_url: "/producto/prod2", scans: 23, last_scan: "2026-08-25", active: true },
    { id: "qr3", product_id: "prod3", public_url: "/producto/prod3", scans: 31, last_scan: "2026-08-28", active: true },
    { id: "qr4", product_id: "prod5", public_url: "/producto/prod5", scans: 67, last_scan: "2026-08-30", active: true },
    { id: "qr5", product_id: "prod7", public_url: "/producto/prod7", scans: 89, last_scan: "2026-08-30", active: true },
    { id: "qr6", product_id: "prod11", public_url: "/producto/prod11", scans: 41, last_scan: "2026-08-27", active: true },
    { id: "qr7", product_id: "prod18", public_url: "/producto/prod18", scans: 28, last_scan: "2026-08-26", active: true },
    { id: "qr8", product_id: "prod15", public_url: "/producto/prod15", scans: 19, last_scan: "2026-08-20", active: true },
    { id: "qr9", product_id: "prod6", public_url: "/producto/prod6", scans: 12, last_scan: "2026-08-15", active: false },
    { id: "qr10", product_id: "prod9", public_url: "/producto/prod9", scans: 8, last_scan: "2026-08-10", active: true },
  ],

  favorites: [
    { id: "fav1", consumer_id: "u1", product_id: "prod5", created_at: "2026-05-01" },
    { id: "fav2", consumer_id: "u1", product_id: "prod7", created_at: "2026-05-05" },
    { id: "fav3", consumer_id: "u1", product_id: "prod1", created_at: "2026-05-10" },
    { id: "fav4", consumer_id: "u1", product_id: "prod11", created_at: "2026-06-01" },
    { id: "fav5", consumer_id: "u1", product_id: "prod18", created_at: "2026-06-15" },
  ],

  carts: [],

  support_tickets: [
    { id: "st1", user_id: "u1", order_id: "ord3", subject: "¿Cuándo llegará mi pedido?", description: "Mi pedido VMT-2026-0003 lleva varios días en tránsito y quisiera saber la fecha estimada de entrega.", status: "in_progress", priority: "medium", created_at: "2026-08-25" },
    { id: "st2", user_id: "u2", subject: "Error al subir fotografías del producto", description: "Al intentar cargar imágenes de mi nuevo producto, aparece un error. ¿Pueden ayudarme?", status: "resolved", priority: "high", created_at: "2026-08-15" },
    { id: "st3", user_id: "u1", subject: "¿Cómo escaneo el QR de mi pieza?", description: "Compré un producto pero no veo el QR en la ficha. ¿Dónde lo encuentro?", status: "resolved", priority: "low", created_at: "2026-08-10" },
    { id: "st4", user_id: "u4", subject: "¿Cuándo se acredita mi pago?", description: "Mi pedido fue marcado como entregado hace 3 días pero aún no veo el monto en mis ingresos.", status: "open", priority: "high", created_at: "2026-08-28" },
    { id: "st5", user_id: "u1", subject: "Solicitud de devolución", description: "El tapete que recibí tiene un defecto de fábrica. Quisiera iniciar una devolución.", status: "open", priority: "high", created_at: "2026-08-29" },
  ],
};

export const MONTHLY_SALES = [
  { mes: "Mar", ventas: 12, monto: 9840 },
  { mes: "Abr", ventas: 18, monto: 14220 },
  { mes: "May", ventas: 24, monto: 19680 },
  { mes: "Jun", ventas: 31, monto: 25420 },
  { mes: "Jul", ventas: 28, monto: 22960 },
  { mes: "Ago", ventas: 35, monto: 28700 },
];

export const CATEGORY_SALES = [
  { name: "Textiles y bordados", value: 38 },
  { name: "Joyería artesanal", value: 22 },
  { name: "Cerámica", value: 16 },
  { name: "Fibras naturales", value: 12 },
  { name: "Madera", value: 8 },
  { name: "Decoración", value: 4 },
];
