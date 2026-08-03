-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  location TEXT,
  price TEXT,
  size TEXT,
  status TEXT DEFAULT 'available',
  description TEXT,
  features TEXT[],
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Public can view properties
CREATE POLICY "Public can view properties" ON properties
  FOR SELECT USING (true);

-- Authenticated users can insert/update/delete
CREATE POLICY "Authenticated can insert properties" ON properties
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update properties" ON properties
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete properties" ON properties
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insert Sample Property (Test Ke Liye)
INSERT INTO properties (name, slug, location, price, size, status, description, features, image_url)
VALUES (
  'Vyom Green Paradise',
  'vyom-green-paradise',
  'Kishangarh Bas, Khairthal–Tijara District',
  '₹50 Lakhs onwards',
  '1350 Sq. Yards',
  'limited',
  'Premium farmhouse plots with clear documentation, wide roads, gated community, water & electricity facilities.',
  ARRAY['40ft Main Road', '30ft Internal Roads', '24x7 Water', 'Electricity', 'Gated Community with CCTV'],
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80'
);