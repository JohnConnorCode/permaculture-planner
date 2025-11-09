# Database Schema for Template Support

## Overview
This document describes the database schema needed to support the 6 FREE permaculture garden templates in the Permaculture Planner application.

**Current Implementation:** Templates are hardcoded in `/lib/templates/template-loader.ts`
**Future Enhancement:** Move templates to Supabase for dynamic management

---

## Why Add Template Support to DB?

### Benefits
1. **Dynamic Template Management** - Add/edit templates without code changes
2. **User-Created Templates** - Allow users to save and share their own designs
3. **Template Versioning** - Track template improvements over time
4. **Usage Analytics** - Monitor which templates are most popular
5. **Personalization** - Filter templates based on user location/climate
6. **Community Templates** - Enable template sharing marketplace

---

## Required Database Tables

### 1. `garden_templates` Table

Primary table storing template metadata and configuration.

```sql
CREATE TABLE garden_templates (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Basic info
  template_id TEXT UNIQUE NOT NULL, -- e.g., "keyhole-garden"
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT, -- Emoji or icon identifier

  -- Classification
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  size TEXT NOT NULL, -- e.g., "100 sq ft", "8 ft diameter"
  category TEXT NOT NULL CHECK (category IN ('beginner', 'productive', 'ecological', 'climate')),

  -- Metadata arrays (PostgreSQL arrays)
  climate TEXT[] NOT NULL DEFAULT '{}', -- e.g., ['temperate', 'hot']
  focus TEXT[] NOT NULL DEFAULT '{}', -- e.g., ['food production', 'water conservation']

  -- Stats
  plants INTEGER NOT NULL DEFAULT 0,
  beds INTEGER NOT NULL DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_free BOOLEAN DEFAULT true, -- All current templates are FREE
  required_tier TEXT DEFAULT 'free' CHECK (required_tier IN ('free', 'premium', 'pro')),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id), -- NULL for system templates

  -- Template data (JSONB for flexibility)
  beds_data JSONB NOT NULL, -- Array of GardenBed objects

  -- Analytics
  load_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0
);

-- Indexes for performance
CREATE INDEX idx_templates_difficulty ON garden_templates(difficulty);
CREATE INDEX idx_templates_category ON garden_templates(category);
CREATE INDEX idx_templates_active ON garden_templates(is_active) WHERE is_active = true;
CREATE INDEX idx_templates_featured ON garden_templates(is_featured) WHERE is_featured = true;
CREATE INDEX idx_templates_climate ON garden_templates USING GIN(climate);
CREATE INDEX idx_templates_focus ON garden_templates USING GIN(focus);

-- Full-text search index
CREATE INDEX idx_templates_search ON garden_templates USING GIN(to_tsvector('english', name || ' ' || description));
```

---

### 2. `template_likes` Table (Optional - Future Enhancement)

Track user likes for templates.

```sql
CREATE TABLE template_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES garden_templates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(template_id, user_id)
);

CREATE INDEX idx_template_likes_template ON template_likes(template_id);
CREATE INDEX idx_template_likes_user ON template_likes(user_id);
```

---

### 3. `template_usage` Table (Optional - Analytics)

Track template usage for analytics.

```sql
CREATE TABLE template_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES garden_templates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  garden_id UUID REFERENCES gardens(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Context
  user_climate TEXT,
  user_location TEXT,
  modifications_made BOOLEAN DEFAULT false
);

CREATE INDEX idx_template_usage_template ON template_usage(template_id);
CREATE INDEX idx_template_usage_date ON template_usage(created_at);
```

---

## Data Migration Script

### Initial Seed Data

Convert the 6 existing hardcoded templates to DB records:

```sql
-- 1. Keyhole Garden
INSERT INTO garden_templates (
  template_id, name, description, icon, difficulty, size, category,
  climate, focus, plants, beds, is_featured, beds_data
) VALUES (
  'keyhole-garden',
  'Keyhole Garden',
  'A circular raised bed with central compost basket. Perfect for small spaces with maximum productivity. Water-efficient and easy to maintain.',
  '🔑',
  'beginner',
  '8 ft diameter',
  'beginner',
  ARRAY['temperate', 'hot', 'cold'],
  ARRAY['food production', 'water conservation', 'small space'],
  16,
  2,
  true,
  '[
    {
      "id": "keyhole-bed",
      "name": "Keyhole Garden Bed",
      "points": [
        {"x": 200, "y": 200},
        {"x": 300, "y": 180},
        {"x": 380, "y": 200},
        {"x": 440, "y": 260},
        {"x": 460, "y": 340},
        {"x": 440, "y": 420},
        {"x": 380, "y": 480},
        {"x": 300, "y": 500},
        {"x": 220, "y": 490},
        {"x": 160, "y": 440},
        {"x": 130, "y": 360},
        {"x": 140, "y": 280}
      ],
      "fill": "#e0f2e0",
      "stroke": "#22c55e",
      "plants": [
        {"id": "p1", "plantId": "tomato", "x": 200, "y": 220},
        {"id": "p2", "plantId": "tomato", "x": 380, "y": 220}
      ]
    }
  ]'::jsonb
);

-- Repeat for other 5 templates:
-- - three-sisters
-- - small-urban
-- - food-forest
-- - pollinator-paradise
-- - hot-climate
```

---

## API / Service Layer

### Template Service Functions

```typescript
// lib/services/template-service.ts

import { createClient } from '@/lib/supabase/client'
import type { TemplateData, TemplateMetadata } from '@/lib/templates/template-loader'

export class TemplateService {
  /**
   * Get all active templates
   */
  static async getAllTemplates(): Promise<TemplateData[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('garden_templates')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('difficulty')
      .order('name')

    if (error) {
      console.error('Error fetching templates:', error)
      return []
    }

    return data.map(row => ({
      id: row.template_id,
      name: row.name,
      beds: row.beds_data,
      metadata: {
        id: row.template_id,
        name: row.name,
        description: row.description,
        difficulty: row.difficulty,
        size: row.size,
        climate: row.climate,
        focus: row.focus,
        icon: row.icon,
        plants: row.plants,
        beds: row.beds,
      },
    }))
  }

  /**
   * Get template by ID
   */
  static async getTemplate(templateId: string): Promise<TemplateData | null> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('garden_templates')
      .select('*')
      .eq('template_id', templateId)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      console.error('Error fetching template:', error)
      return null
    }

    return {
      id: data.template_id,
      name: data.name,
      beds: data.beds_data,
      metadata: {
        id: data.template_id,
        name: data.name,
        description: data.description,
        difficulty: data.difficulty,
        size: data.size,
        climate: data.climate,
        focus: data.focus,
        icon: data.icon,
        plants: data.plants,
        beds: data.beds,
      },
    }
  }

  /**
   * Filter templates
   */
  static async filterTemplates(filters: {
    difficulty?: string
    climate?: string
    focus?: string
    category?: string
  }): Promise<TemplateData[]> {
    const supabase = createClient()

    let query = supabase
      .from('garden_templates')
      .select('*')
      .eq('is_active', true)

    if (filters.difficulty) {
      query = query.eq('difficulty', filters.difficulty)
    }

    if (filters.climate) {
      query = query.contains('climate', [filters.climate])
    }

    if (filters.category) {
      query = query.eq('category', filters.category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error filtering templates:', error)
      return []
    }

    return data.map(row => ({
      id: row.template_id,
      name: row.name,
      beds: row.beds_data,
      metadata: {
        id: row.template_id,
        name: row.name,
        description: row.description,
        difficulty: row.difficulty,
        size: row.size,
        climate: row.climate,
        focus: row.focus,
        icon: row.icon,
        plants: row.plants,
        beds: row.beds,
      },
    }))
  }

  /**
   * Track template usage
   */
  static async trackTemplateLoad(templateId: string, userId?: string) {
    const supabase = createClient()

    // Increment load count
    await supabase.rpc('increment_template_loads', {
      template_id: templateId,
    })

    // Log usage (optional)
    if (userId) {
      await supabase
        .from('template_usage')
        .insert({
          template_id: templateId,
          user_id: userId,
        })
    }
  }

  /**
   * Like a template
   */
  static async likeTemplate(templateId: string, userId: string) {
    const supabase = createClient()

    const { error } = await supabase
      .from('template_likes')
      .insert({
        template_id: templateId,
        user_id: userId,
      })

    if (!error) {
      // Increment like count
      await supabase.rpc('increment_template_likes', {
        template_id: templateId,
      })
    }

    return !error
  }
}
```

---

## Required Database Functions

```sql
-- Function to increment template load count
CREATE OR REPLACE FUNCTION increment_template_loads(template_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE garden_templates
  SET load_count = load_count + 1
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment template like count
CREATE OR REPLACE FUNCTION increment_template_likes(template_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE garden_templates
  SET like_count = like_count + 1
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_garden_templates_updated_at
BEFORE UPDATE ON garden_templates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## Row-Level Security (RLS) Policies

```sql
-- Enable RLS
ALTER TABLE garden_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_usage ENABLE ROW LEVEL SECURITY;

-- Public read access to active templates
CREATE POLICY "Templates are viewable by everyone"
ON garden_templates FOR SELECT
USING (is_active = true);

-- Only admins can create/update/delete templates
CREATE POLICY "Only admins can modify templates"
ON garden_templates FOR ALL
USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));

-- Users can like templates
CREATE POLICY "Users can like templates"
ON template_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their likes"
ON template_likes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can unlike templates"
ON template_likes FOR DELETE
USING (auth.uid() = user_id);

-- Usage tracking (insert only)
CREATE POLICY "Template usage can be tracked"
ON template_usage FOR INSERT
WITH CHECK (true);
```

---

## Migration Checklist for Merging Agent

### Step 1: Create Tables
- [ ] Run table creation SQL for `garden_templates`
- [ ] Run table creation SQL for `template_likes` (optional)
- [ ] Run table creation SQL for `template_usage` (optional)
- [ ] Verify all indexes created successfully

### Step 2: Create Functions & Triggers
- [ ] Create `increment_template_loads()` function
- [ ] Create `increment_template_likes()` function
- [ ] Create `update_updated_at_column()` function
- [ ] Create `update_garden_templates_updated_at` trigger

### Step 3: Configure RLS
- [ ] Enable RLS on all template tables
- [ ] Create read policy for public template access
- [ ] Create admin policies for template management
- [ ] Create user policies for likes and usage

### Step 4: Seed Initial Data
- [ ] Insert 6 initial templates (keyhole-garden, three-sisters, small-urban, food-forest, pollinator-paradise, hot-climate)
- [ ] Verify all template data is correct
- [ ] Set `is_featured = true` for recommended templates
- [ ] Test loading templates from DB

### Step 5: Update Application Code
- [ ] Create `lib/services/template-service.ts`
- [ ] Update `lib/templates/template-loader.ts` to support both hardcoded and DB templates
- [ ] Add feature flag to toggle between hardcoded and DB templates
- [ ] Update template library panel to use service layer
- [ ] Add error handling for DB failures (fallback to hardcoded templates)

### Step 6: Testing
- [ ] Test template listing
- [ ] Test template loading
- [ ] Test template filtering
- [ ] Test template search
- [ ] Test template analytics (if implemented)
- [ ] Test RLS policies
- [ ] Test fallback to hardcoded templates if DB fails

### Step 7: Documentation
- [ ] Update README with template management instructions
- [ ] Document how to add new templates
- [ ] Document template data format
- [ ] Add admin guide for template management

---

## Current vs Future Implementation

### Current (Hardcoded)
✅ **Pros:**
- Fast (no DB queries)
- Always available
- No infrastructure dependencies
- Version controlled in git

❌ **Cons:**
- Requires code deployment to update
- Can't track usage
- No user-created templates
- No personalization

### Future (Database)
✅ **Pros:**
- Dynamic management (no deployments)
- Usage analytics
- User-created templates possible
- Personalization by location
- Community sharing potential
- A/B testing of templates

❌ **Cons:**
- Requires DB queries (latency)
- Need fallback if DB unavailable
- More complex infrastructure

---

## Recommended Approach

### Phase 1: Hybrid (Recommended for now)
Keep hardcoded templates as default, add DB as enhancement:

```typescript
// lib/templates/template-loader.ts
export async function getAllTemplates(): Promise<TemplateData[]> {
  try {
    // Try to fetch from DB first
    const dbTemplates = await TemplateService.getAllTemplates()
    if (dbTemplates.length > 0) {
      return dbTemplates
    }
  } catch (error) {
    console.warn('Failed to load templates from DB, using hardcoded fallback')
  }

  // Fallback to hardcoded templates
  return Object.values(TEMPLATE_REGISTRY)
}
```

### Phase 2: Full DB Migration
Once proven stable, migrate fully to DB and deprecate hardcoded templates.

---

## Template Data Format

Templates are stored as JSONB in the `beds_data` column. Format matches the `GardenBed[]` TypeScript interface:

```json
[
  {
    "id": "string",
    "name": "string",
    "points": [
      {"x": number, "y": number}
    ],
    "fill": "string (hex color)",
    "stroke": "string (hex color)",
    "plants": [
      {
        "id": "string",
        "plantId": "string",
        "x": number,
        "y": number
      }
    ]
  }
]
```

---

## Performance Considerations

1. **Caching:** Cache templates in Redis or application memory
2. **CDN:** Serve template thumbnails from CDN
3. **Lazy Loading:** Only load template details when needed
4. **Pagination:** Paginate template lists for large catalogs
5. **Search:** Use PostgreSQL full-text search for fast template search

---

## Monitoring & Analytics

Track these metrics for template success:

- **Load Count:** How many times template was loaded
- **Like Count:** User likes/favorites
- **Completion Rate:** % of users who keep the template vs. delete it
- **Modification Rate:** % of users who modify vs. use as-is
- **Popular Climates:** Which climate filters are most used
- **Popular Focus Areas:** Which focus tags drive most usage

---

## Summary for Merging Agent

**TL;DR:**
1. Templates currently hardcoded in `lib/templates/template-loader.ts`
2. To add DB support, create `garden_templates` table with schema above
3. Seed 6 initial templates using INSERT statements
4. Create `TemplateService` class for DB operations
5. Update `template-loader.ts` to try DB first, fallback to hardcoded
6. Set up RLS policies for security
7. Add analytics tracking (optional)

**Current templates are FREE and work without DB changes. DB support is an enhancement, not a requirement.**
