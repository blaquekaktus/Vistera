-- ============================================================
-- Vistera – Seed Data (for development / demo)
-- Run AFTER 001_initial_schema.sql
-- ============================================================

-- NOTE: This creates a demo agent user in auth.users.
-- In production use the Supabase dashboard or API to create real users.
-- The trigger on_auth_user_created automatically creates their profile.

-- Demo: insert a sample property (requires a real agent UUID).
-- Replace 'YOUR-AGENT-UUID' with the UUID of a created agent user.

/*
INSERT INTO public.properties (
  agent_id, title, title_de, description, description_de,
  type, listing_type, price, currency, price_per_sqm,
  street, city, region, country, postal_code, lat, lng,
  rooms, bedrooms, bathrooms, area, year_built,
  parking, elevator, balcony, garden, cellar, energy_class,
  amenities, images, status, featured
) VALUES (
  'YOUR-AGENT-UUID',
  'Luxuriöses Penthouse mit Bergpanorama',
  'Luxuriöses Penthouse mit Bergpanorama',
  'Breathtaking penthouse in Innsbruck with Nordkette views.',
  'Atemberaubendes Penthouse im Herzen Innsbrucks mit grandiosem Blick auf die Nordkette.',
  'penthouse', 'sale', 1850000, 'EUR', 12333,
  'Innstraße 45', 'Innsbruck', 'Tirol', 'AT', '6020', 47.2692, 11.4041,
  5, 3, 2, 150, 2021,
  TRUE, TRUE, TRUE, FALSE, TRUE, 'A+',
  ARRAY['Concierge','Tiefgarage','Smart Home','Sauna','Fitnessraum','Dachterrasse'],
  ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop'],
  'active', TRUE
);
*/
