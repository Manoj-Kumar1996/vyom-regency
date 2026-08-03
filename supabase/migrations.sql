-- FAQs table for dynamic FAQ management
CREATE TABLE IF NOT EXISTS faqs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read FAQs"
  ON faqs FOR SELECT USING (true);

CREATE POLICY "Admin can manage FAQs"
  ON faqs FOR ALL USING (auth.role() = 'authenticated');

-- Site content for editable home page text
CREATE TABLE IF NOT EXISTS site_content (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  page TEXT NOT NULL DEFAULT 'home',
  section TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page, section)
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site content"
  ON site_content FOR SELECT USING (true);

CREATE POLICY "Admin can manage site content"
  ON site_content FOR ALL USING (auth.role() = 'authenticated');

-- Insert default home page content
INSERT INTO site_content (page, section, content) VALUES
  ('home', 'hero_title', 'Own Your Dream Farmhouse in the Heart of'),
  ('home', 'hero_title_highlight', 'Aravali Hills'),
  ('home', 'hero_subtitle', '2 Hrs Drive from Delhi NCR in Khairthal, Alwar'),
  ('home', 'hero_description', 'Premium Farmhouse Plots | Registry Available | Gated Community | High Investment Growth'),
  ('home', 'urgency_badge', 'Hurry Price Revising Soon'),
  ('home', 'area_starts_prefix', 'Area starts from'),
  ('home', 'area_starts_value', '1250 sq yard'),
  ('home', 'benefits_title', 'Why Choose Vyom Regency?')
ON CONFLICT (page, section) DO NOTHING;

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert newsletter subscribers"
  ON newsletter_subscribers FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated can view newsletter subscribers"
  ON newsletter_subscribers FOR SELECT USING (auth.role() = 'authenticated');

-- Insert default FAQs
INSERT INTO faqs (question, answer, sort_order) VALUES
  ('Where exactly is the estate located?', 'The estate is located in Khairthal, Alwar, Rajasthan. It''s a serene location perfect for farmhouses, away from city pollution yet well-connected.', 0),
  ('What is the standard plot size available?', 'We primarily offer premium farmhouse plots of 1350 Sq. Yards. This size is ideal for building a spacious farmhouse with plenty of room for gardening and outdoor activities.', 1),
  ('Is the land title clear and secure?', 'Yes, Vyom Regency ensures 100% clear titles and complete documentation for every plot. We prioritize transparency and due diligence in all our transactions.', 2),
  ('What basic amenities are provided?', 'The community features wide 30ft approach roads, gated security, water supply, and electricity connections. We aim to provide all the essentials for a comfortable living experience.', 3),
  ('Can I visit the site before booking?', 'Absolutely! We encourage site visits. You can book a free consultation and site visit through our lead form or by calling us directly at +91 89553 11031.', 4);
