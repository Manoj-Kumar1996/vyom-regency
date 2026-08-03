-- Ensure there is at least one row in site_settings
INSERT INTO site_settings (hero_image_key)
SELECT 'hero/default-hero.jpg'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);