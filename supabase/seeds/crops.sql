-- Seed data for crops table
INSERT INTO public.crops (name, family, days_to_maturity_min, days_to_maturity_max, spacing_in, depth_in, water_needs, sun_needs, companions, antagonists, frost_hardy, heat_tolerant, notes)
VALUES
  -- Solanaceae (Nightshades)
  ('Tomato', 'Solanaceae', 60, 90, 18.0, 0.25, 'Regular, deep watering', 'Full sun (6-8 hours)',
   ARRAY['Basil', 'Carrot', 'Parsley'], ARRAY['Brassica', 'Fennel'], false, true,
   'Indeterminate varieties need staking'),

  ('Pepper', 'Solanaceae', 60, 90, 12.0, 0.25, 'Moderate, consistent', 'Full sun',
   ARRAY['Basil', 'Carrot', 'Onion'], ARRAY['Fennel'], false, true,
   'Benefits from calcium for fruit development'),

  ('Eggplant', 'Solanaceae', 70, 85, 18.0, 0.25, 'Regular, deep', 'Full sun',
   ARRAY['Bean', 'Pepper'], ARRAY['Fennel'], false, true,
   'Needs warm soil to thrive'),

  ('Potato', 'Solanaceae', 70, 120, 12.0, 4.0, 'Regular', 'Full sun',
   ARRAY['Bean', 'Corn', 'Cabbage'], ARRAY['Tomato', 'Squash'], false, false,
   'Hill as plants grow for more yield'),

  -- Brassicaceae (Cole crops)
  ('Broccoli', 'Brassicaceae', 60, 90, 18.0, 0.5, 'Consistent moisture', 'Full sun to partial shade',
   ARRAY['Onion', 'Beet', 'Chard'], ARRAY['Tomato', 'Strawberry'], true, false,
   'Cool season crop, bolt in heat'),

  ('Cabbage', 'Brassicaceae', 70, 120, 18.0, 0.5, 'Consistent, deep', 'Full sun',
   ARRAY['Onion', 'Potato', 'Dill'], ARRAY['Tomato', 'Strawberry'], true, false,
   'Heavy feeder, benefits from compost'),

  ('Kale', 'Brassicaceae', 55, 75, 12.0, 0.5, 'Regular', 'Full sun to partial shade',
   ARRAY['Beet', 'Onion', 'Potato'], ARRAY['Tomato', 'Strawberry'], true, false,
   'Sweeter after frost'),

  ('Cauliflower', 'Brassicaceae', 55, 100, 18.0, 0.5, 'Consistent, deep', 'Full sun',
   ARRAY['Onion', 'Spinach'], ARRAY['Tomato', 'Strawberry'], true, false,
   'Blanch heads for white color'),

  ('Radish', 'Brassicaceae', 20, 60, 2.0, 0.5, 'Consistent', 'Full sun to partial shade',
   ARRAY['Carrot', 'Lettuce', 'Pea'], ARRAY['Hyssop'], true, false,
   'Fast growing, good for succession planting'),

  -- Cucurbitaceae (Squash family)
  ('Cucumber', 'Cucurbitaceae', 50, 70, 12.0, 1.0, 'Regular, deep', 'Full sun',
   ARRAY['Bean', 'Corn', 'Radish'], ARRAY['Aromatic herbs'], false, true,
   'Can trellis to save space'),

  ('Zucchini', 'Cucurbitaceae', 45, 60, 24.0, 1.0, 'Regular, deep', 'Full sun',
   ARRAY['Corn', 'Radish', 'Nasturtium'], ARRAY['Potato'], false, true,
   'Heavy producer, harvest young'),

  ('Winter Squash', 'Cucurbitaceae', 90, 120, 36.0, 1.0, 'Deep, infrequent', 'Full sun',
   ARRAY['Corn', 'Bean'], ARRAY['Potato'], false, true,
   'Needs lots of space or trellis'),

  ('Melon', 'Cucurbitaceae', 70, 90, 36.0, 1.0, 'Regular until fruit sets', 'Full sun',
   ARRAY['Corn', 'Radish'], ARRAY['Potato'], false, true,
   'Reduce water as fruit ripens'),

  -- Fabaceae (Legumes)
  ('Bean (Bush)', 'Fabaceae', 50, 60, 6.0, 1.5, 'Regular until flowering', 'Full sun',
   ARRAY['Carrot', 'Cucumber', 'Corn'], ARRAY['Onion', 'Garlic'], false, true,
   'Nitrogen fixer, improves soil'),

  ('Bean (Pole)', 'Fabaceae', 60, 70, 6.0, 1.5, 'Regular until flowering', 'Full sun',
   ARRAY['Carrot', 'Corn', 'Radish'], ARRAY['Onion', 'Garlic', 'Beet'], false, true,
   'Needs support structure'),

  ('Pea', 'Fabaceae', 55, 70, 2.0, 1.5, 'Regular', 'Full sun to partial shade',
   ARRAY['Carrot', 'Radish', 'Turnip'], ARRAY['Onion', 'Garlic'], true, false,
   'Cool season, plant early spring or fall'),

  ('Fava Bean', 'Fabaceae', 80, 100, 8.0, 2.0, 'Regular', 'Full sun',
   ARRAY['Cabbage', 'Corn'], ARRAY['Onion', 'Garlic'], true, false,
   'Very cold hardy, nitrogen fixer'),

  -- Allium
  ('Onion', 'Allium', 90, 120, 4.0, 0.5, 'Regular until bulbing', 'Full sun',
   ARRAY['Beet', 'Carrot', 'Lettuce'], ARRAY['Bean', 'Pea'], false, false,
   'Day length sensitive varieties'),

  ('Garlic', 'Allium', 180, 240, 4.0, 2.0, 'Regular spring growth', 'Full sun',
   ARRAY['Beet', 'Tomato'], ARRAY['Bean', 'Pea'], true, false,
   'Plant fall, harvest summer'),

  ('Leek', 'Allium', 100, 120, 6.0, 0.5, 'Consistent', 'Full sun',
   ARRAY['Carrot', 'Celery'], ARRAY['Bean', 'Pea'], true, false,
   'Hill for longer white stems'),

  ('Scallion', 'Allium', 60, 70, 2.0, 0.5, 'Regular', 'Full sun to partial shade',
   ARRAY['Beet', 'Carrot', 'Chard'], ARRAY['Bean', 'Pea'], false, false,
   'Can succession plant'),

  -- Apiaceae (Carrot family)
  ('Carrot', 'Apiaceae', 60, 80, 2.0, 0.25, 'Deep, infrequent', 'Full sun',
   ARRAY['Onion', 'Leek', 'Rosemary'], ARRAY['Dill'], false, false,
   'Loose soil for straight roots'),

  ('Celery', 'Apiaceae', 120, 140, 12.0, 0.125, 'Constant moisture', 'Full sun to partial shade',
   ARRAY['Bean', 'Tomato', 'Leek'], ARRAY['Corn'], false, false,
   'Heavy feeder, needs rich soil'),

  ('Parsley', 'Apiaceae', 70, 90, 6.0, 0.25, 'Regular', 'Full sun to partial shade',
   ARRAY['Tomato', 'Corn', 'Asparagus'], ARRAY['Lettuce'], false, false,
   'Slow germination, soak seeds'),

  ('Cilantro', 'Apiaceae', 45, 70, 4.0, 0.5, 'Regular', 'Full sun to partial shade',
   ARRAY['Tomato', 'Pepper', 'Spinach'], ARRAY['Fennel'], false, false,
   'Bolts in heat, succession plant'),

  -- Asteraceae (Lettuce family)
  ('Lettuce', 'Asteraceae', 30, 60, 6.0, 0.125, 'Consistent, shallow', 'Partial shade in heat',
   ARRAY['Carrot', 'Radish', 'Strawberry'], ARRAY['Cabbage family'], false, false,
   'Cool season, bolts in heat'),

  ('Sunflower', 'Asteraceae', 80, 120, 18.0, 1.0, 'Deep, infrequent', 'Full sun',
   ARRAY['Cucumber', 'Corn'], ARRAY['Potato'], false, true,
   'Attracts beneficial insects'),

  -- Amaranthaceae
  ('Spinach', 'Amaranthaceae', 40, 50, 4.0, 0.5, 'Consistent', 'Full sun to partial shade',
   ARRAY['Strawberry', 'Radish'], ARRAY['None'], true, false,
   'Cool season, bolts in heat'),

  ('Beet', 'Amaranthaceae', 50, 70, 4.0, 0.5, 'Regular', 'Full sun',
   ARRAY['Onion', 'Kohlrabi', 'Lettuce'], ARRAY['Bean (pole)'], false, false,
   'Thinnings are edible greens'),

  ('Chard', 'Amaranthaceae', 50, 60, 12.0, 0.5, 'Regular', 'Full sun to partial shade',
   ARRAY['Bean', 'Cabbage family'], ARRAY['Corn'], false, true,
   'Cut-and-come-again harvest'),

  -- Poaceae (Grass family)
  ('Corn', 'Poaceae', 60, 100, 12.0, 1.5, 'Deep at tasseling', 'Full sun',
   ARRAY['Bean', 'Squash', 'Cucumber'], ARRAY['Tomato'], false, true,
   'Plant in blocks for pollination'),

  -- Other vegetables
  ('Asparagus', 'Other', 730, 1095, 18.0, 6.0, 'Regular first 2 years', 'Full sun',
   ARRAY['Tomato', 'Parsley'], ARRAY['Onion', 'Garlic'], true, false,
   'Perennial, 20+ year lifespan'),

  ('Rhubarb', 'Other', 365, 730, 36.0, 2.0, 'Regular', 'Full sun to partial shade',
   ARRAY['Garlic', 'Onion'], ARRAY['None'], true, false,
   'Perennial, toxic leaves'),

  ('Strawberry', 'Other', 60, 90, 12.0, 0.5, 'Regular, drip best', 'Full sun',
   ARRAY['Bean', 'Spinach', 'Lettuce'], ARRAY['Cabbage family'], true, false,
   'Perennial, runners produce new plants'),

  ('Okra', 'Other', 50, 60, 12.0, 0.75, 'Regular', 'Full sun',
   ARRAY['Pepper', 'Eggplant'], ARRAY['None'], false, true,
   'Loves heat, harvest young pods'),

  ('Artichoke', 'Other', 180, 365, 36.0, 0.5, 'Regular', 'Full sun',
   ARRAY['Sunflower'], ARRAY['None'], false, false,
   'Perennial in mild climates')
ON CONFLICT (name) DO NOTHING;