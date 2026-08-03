-- Table 1: testimonials (Admin ke dwara manual add kiye gaye reviews)
CREATE TABLE testimonials (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  type VARCHAR(255),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  media_type VARCHAR(10) DEFAULT 'text',
  image_url TEXT,
  video_url TEXT,
  source VARCHAR(20) DEFAULT 'admin',
  status VARCHAR(20) DEFAULT 'approved',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table 2: visitor_reviews (Site par aane wale visitors ka feedback)
CREATE TABLE visitor_reviews (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  visited_date DATE,
  property_name VARCHAR(255),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  experience TEXT,
  suggestions TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table 3: website_feedback (Online visitors ka website feedback)
CREATE TABLE website_feedback (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  experience TEXT,
  suggestions TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sample Data (Ek example review daal do)
INSERT INTO testimonials (name, location, type, rating, text, media_type, status) 
VALUES ('Rajesh Sharma', 'Delhi NCR', 'Farmhouse Owner', 5, 'Vyom Regency ne mere sapno ka farmhouse dila diya. Bahut supportive team!', 'text', 'approved');