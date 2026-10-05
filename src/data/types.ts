export type Role = "consumer" | "producer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;

  role: Role;
  phone: string;
  status: "active" | "suspended";
  created_at: string;
  last_login: string;
  avatar_url?: string;
}

export interface ProducerProfile {
  id: string;
  user_id: string;
  workshop_name: string;
  artisan_name?: string;
  biography: string;
  community: string;
  municipality: string;
  languages: string[];
  craft_types: string[];
  years_experience: number;
  profile_image: string;
  authorization_status: "pending" | "approved" | "rejected";
  represented_by?: string;
  verified_contact: boolean;
  rating: number;
  total_products: number;
}

export interface Product {
  id: string;
  producer_id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  status: "draft" | "pending" | "published" | "paused" | "rejected";
  materials: string[];
  technique: string;
  production_time: string;
  package_weight: number;
  package_dimensions: string;
  featured_image: string;
  gallery: string[];
  created_at: string;
  updated_at: string;
  views: number;
  favorites_count: number;
}

export interface CulturalRecord {
  id: string;
  product_id: string;
  community_origin: string;
  author_name: string;
  cultural_description: string;
  process: string;
  authorized_text: string;
  audio_url?: string;
  video_url?: string;
  maya_content_status: "pending" | "validated" | "not_applicable";
  consent_id: string;
  disclaimer: string;
}

export interface CartItem {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface Cart {
  id: string;
  consumer_id: string;
  items: CartItem[];
}

export interface Order {
  id: string;
  order_number: string;
  consumer_id: string;
  producer_id: string;
  status: "pending_payment" | "paid" | "preparing" | "shipped" | "delivered" | "cancelled" | "return_requested" | "refunded";
  subtotal: number;
  shipping: number;
  total: number;
  platform_commission: number;
  producer_net: number;
  processing_cost: number;
  created_at: string;
  estimated_delivery: string;
  items: CartItem[];
  consumer_address?: string;
  tracking_number?: string;
  carrier?: string;
}

export interface PaymentSandbox {
  id: string;
  order_id: string;
  sandbox_transaction_id: string;
  method: "card" | "transfer" | "pending";
  status: "pending" | "approved" | "declined" | "refunded";
  amount: number;
  card_last_four?: string;
  simulated: true;
  created_at: string;
}

export interface Review {
  id: string;
  order_id: string;
  consumer_id: string;
  product_id: string;
  rating: number;
  comment: string;
  status: "published" | "pending" | "rejected";
  consumer_name: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface QRCode {
  id: string;
  product_id: string;
  public_url: string;
  scans: number;
  last_scan: string;
  active: boolean;
}

export interface Favorite {
  id: string;
  consumer_id: string;
  product_id: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  order_id?: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  created_at: string;
}

export interface AppStore {
  users: User[];
  producer_profiles: ProducerProfile[];
  products: Product[];
  cultural_records: CulturalRecord[];
  orders: Order[];
  payments: PaymentSandbox[];
  reviews: Review[];
  notifications: Notification[];
  qr_codes: QRCode[];
  favorites: Favorite[];
  carts: Cart[];
  support_tickets: SupportTicket[];
  consents: { id: string; product_id: string; revoked_at: string | null; expires_at: string | null }[];
  audit_logs: { id: number; action: string; target_id: string; created_at: string }[];
}
