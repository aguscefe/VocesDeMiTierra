-- Alternativa a php artisan migrate, exclusivamente para una base NUEVA VACÍA.
-- Ejecutar con mysql -u voces_user -p vocesdemitierra < database/instalar_tablas.sql
-- No elimina tablas ni contiene contraseñas.
SET NAMES utf8mb4;
CREATE TABLE users (
  id VARCHAR(40) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  -- Sustituir password por password_hash al conectar un backend real.
  password VARCHAR(255) NOT NULL,
  role ENUM('consumer', 'producer', 'admin') NOT NULL DEFAULT 'consumer',
  phone VARCHAR(30) NULL,
  status ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role_status (role, status)
) ENGINE=InnoDB;

CREATE TABLE producer_profiles (
  id VARCHAR(40) PRIMARY KEY,
  user_id VARCHAR(40) NOT NULL UNIQUE,
  workshop_name VARCHAR(180) NOT NULL,
  biography TEXT NOT NULL,
  community VARCHAR(150) NOT NULL,
  municipality VARCHAR(150) NOT NULL,
  languages JSON NOT NULL,
  craft_types JSON NOT NULL,
  years_experience SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  profile_image VARCHAR(500) NULL,
  intro_video_url VARCHAR(500) NULL,
  authorization_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  represented_by VARCHAR(150) NULL,
  verified_contact TINYINT(1) NOT NULL DEFAULT 0,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0,
  total_products INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_producer_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_producer_location (municipality, community),
  INDEX idx_producer_authorization (authorization_status)
) ENGINE=InnoDB;

CREATE TABLE products (
  id VARCHAR(40) PRIMARY KEY,
  producer_id VARCHAR(40) NOT NULL,
  name VARCHAR(220) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(12,2) UNSIGNED NOT NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('draft', 'pending', 'published', 'paused', 'rejected') NOT NULL DEFAULT 'draft',
  materials JSON NOT NULL,
  technique VARCHAR(255) NOT NULL,
  production_time VARCHAR(100) NULL,
  package_weight DECIMAL(8,3) UNSIGNED NULL,
  package_dimensions VARCHAR(100) NULL,
  featured_image VARCHAR(500) NULL,
  gallery JSON NULL,
  views INT UNSIGNED NOT NULL DEFAULT 0,
  favorites_count INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_product_producer
    FOREIGN KEY (producer_id) REFERENCES producer_profiles(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_product_catalog (status, category),
  INDEX idx_product_producer_status (producer_id, status),
  FULLTEXT INDEX ft_product_search (name, description, technique)
) ENGINE=InnoDB;

CREATE TABLE cultural_consents (
  id VARCHAR(40) PRIMARY KEY,
  producer_id VARCHAR(40) NOT NULL,
  product_id VARCHAR(40) NULL,
  allow_name TINYINT(1) NOT NULL DEFAULT 0,
  allow_community TINYINT(1) NOT NULL DEFAULT 0,
  allow_photos TINYINT(1) NOT NULL DEFAULT 0,
  allow_technique TINYINT(1) NOT NULL DEFAULT 0,
  allow_materials TINYINT(1) NOT NULL DEFAULT 0,
  allow_history TINYINT(1) NOT NULL DEFAULT 0,
  allow_audio TINYINT(1) NOT NULL DEFAULT 0,
  allow_video TINYINT(1) NOT NULL DEFAULT 0,
  allow_platform TINYINT(1) NOT NULL DEFAULT 0,
  allow_qr TINYINT(1) NOT NULL DEFAULT 0,
  allow_social TINYINT(1) NOT NULL DEFAULT 0,
  accepted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at DATETIME NULL,
  expires_at DATETIME NULL,
  CONSTRAINT fk_consent_producer
    FOREIGN KEY (producer_id) REFERENCES producer_profiles(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_consent_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE cultural_records (
  id VARCHAR(40) PRIMARY KEY,
  product_id VARCHAR(40) NOT NULL UNIQUE,
  community_origin VARCHAR(180) NOT NULL,
  author_name VARCHAR(180) NOT NULL,
  cultural_description TEXT NOT NULL,
  production_process TEXT NOT NULL,
  authorized_text TEXT NULL,
  audio_url VARCHAR(500) NULL,
  video_url VARCHAR(500) NULL,
  maya_content_status ENUM('pending', 'validated', 'not_applicable') NOT NULL DEFAULT 'pending',
  consent_id VARCHAR(40) NOT NULL,
  disclaimer TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cultural_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_cultural_consent
    FOREIGN KEY (consent_id) REFERENCES cultural_consents(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  FULLTEXT INDEX ft_cultural_search (cultural_description, production_process, authorized_text)
) ENGINE=InnoDB;

CREATE TABLE orders (
  id VARCHAR(40) PRIMARY KEY,
  order_number VARCHAR(40) NOT NULL UNIQUE,
  checkout_key CHAR(36) NULL,
  INDEX idx_checkout(checkout_key),
  consumer_id VARCHAR(40) NOT NULL,
  producer_id VARCHAR(40) NOT NULL,
  status ENUM(
    'pending_payment',
    'paid',
    'preparing',
    'shipped',
    'delivered',
    'cancelled',
    'return_requested',
    'refunded'
  ) NOT NULL DEFAULT 'pending_payment',
  subtotal DECIMAL(12,2) UNSIGNED NOT NULL,
  shipping DECIMAL(12,2) UNSIGNED NOT NULL DEFAULT 0,
  total DECIMAL(12,2) UNSIGNED NOT NULL,
  platform_commission DECIMAL(12,2) UNSIGNED NOT NULL DEFAULT 0,
  producer_net DECIMAL(12,2) UNSIGNED NOT NULL DEFAULT 0,
  processing_cost DECIMAL(12,2) UNSIGNED NOT NULL DEFAULT 0,
  consumer_address TEXT NULL,
  tracking_number VARCHAR(150) NULL,
  carrier VARCHAR(100) NULL,
  estimated_delivery DATE NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_consumer
    FOREIGN KEY (consumer_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_order_producer
    FOREIGN KEY (producer_id) REFERENCES producer_profiles(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_order_consumer (consumer_id, created_at),
  INDEX idx_order_producer_status (producer_id, status)
) ENGINE=InnoDB;

CREATE TABLE order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(40) NOT NULL,
  product_id VARCHAR(40) NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  unit_price DECIMAL(12,2) UNSIGNED NOT NULL,
  CONSTRAINT fk_order_item_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_order_item_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  UNIQUE KEY uq_order_product (order_id, product_id)
) ENGINE=InnoDB;

CREATE TABLE payments (
  id VARCHAR(40) PRIMARY KEY,
  order_id VARCHAR(40) NOT NULL,
  transaction_id VARCHAR(150) NOT NULL UNIQUE,
  method ENUM('card', 'transfer', 'pending') NOT NULL DEFAULT 'pending',
  status ENUM('pending', 'approved', 'declined', 'refunded') NOT NULL DEFAULT 'pending',
  amount DECIMAL(12,2) UNSIGNED NOT NULL,
  card_last_four CHAR(4) NULL,
  is_simulated TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payment_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_payment_order_status (order_id, status)
) ENGINE=InnoDB;

CREATE TABLE reviews (
  id VARCHAR(40) PRIMARY KEY,
  order_id VARCHAR(40) NOT NULL,
  consumer_id VARCHAR(40) NOT NULL,
  product_id VARCHAR(40) NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  comment TEXT NOT NULL,
  status ENUM('published', 'pending', 'rejected') NOT NULL DEFAULT 'pending',
  consumer_name VARCHAR(150) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_review_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_review_consumer
    FOREIGN KEY (consumer_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_review_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE KEY uq_review_order_product (order_id, product_id),
  INDEX idx_review_product_status (product_id, status)
) ENGINE=InnoDB;

CREATE TABLE notifications (
  id VARCHAR(40) PRIMARY KEY,
  user_id VARCHAR(40) NOT NULL,
  type VARCHAR(80) NOT NULL,
  title VARCHAR(180) NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notification_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_notification_unread (user_id, is_read, created_at)
) ENGINE=InnoDB;

CREATE TABLE qr_codes (
  id VARCHAR(40) PRIMARY KEY,
  product_id VARCHAR(40) NOT NULL UNIQUE,
  public_url VARCHAR(500) NOT NULL,
  scans INT UNSIGNED NOT NULL DEFAULT 0,
  last_scan DATETIME NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_qr_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE favorites (
  id VARCHAR(40) PRIMARY KEY,
  consumer_id VARCHAR(40) NOT NULL,
  product_id VARCHAR(40) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_favorite_consumer
    FOREIGN KEY (consumer_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_favorite_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE KEY uq_favorite_consumer_product (consumer_id, product_id)
) ENGINE=InnoDB;

CREATE TABLE carts (
  id VARCHAR(40) PRIMARY KEY,
  consumer_id VARCHAR(40) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cart_consumer
    FOREIGN KEY (consumer_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE cart_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cart_id VARCHAR(40) NOT NULL,
  product_id VARCHAR(40) NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) UNSIGNED NOT NULL,
  CONSTRAINT fk_cart_item_cart
    FOREIGN KEY (cart_id) REFERENCES carts(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_cart_item_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE KEY uq_cart_product (cart_id, product_id)
) ENGINE=InnoDB;

CREATE TABLE support_tickets (
  id VARCHAR(40) PRIMARY KEY,
  user_id VARCHAR(40) NOT NULL,
  order_id VARCHAR(40) NULL,
  subject VARCHAR(220) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('open', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'open',
  priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ticket_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_ticket_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_ticket_status_priority (status, priority)
) ENGINE=InnoDB;


CREATE TABLE shipments (
 id VARCHAR(40) PRIMARY KEY, order_id VARCHAR(40) NOT NULL UNIQUE,
 carrier VARCHAR(100) NOT NULL, tracking_number VARCHAR(150) NOT NULL,
 shipped_at DATETIME NOT NULL, delivered_at DATETIME NULL,
 FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE analytics_events (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(40) NULL,
 product_id VARCHAR(40) NULL, event_type VARCHAR(50) NOT NULL,
 source VARCHAR(100) NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 INDEX idx_event_type_date(event_type,created_at)
) ENGINE=InnoDB;
CREATE TABLE audit_logs (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,user_id VARCHAR(40) NOT NULL,
 action VARCHAR(100) NOT NULL, target_id VARCHAR(40) NULL,
 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE migrations (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, migration VARCHAR(255) NOT NULL, batch INT NOT NULL);
INSERT INTO migrations(migration,batch) VALUES ('2026_10_04_000001_create_marketplace',1);

ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500) NULL;
INSERT INTO migrations(migration,batch) VALUES ('2026_10_04_000002_add_avatar_to_users',2);
