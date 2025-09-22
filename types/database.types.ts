export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
        }
      }
      sites: {
        Row: {
          id: string
          user_id: string
          name: string
          lat: number | null
          lng: number | null
          country_code: string | null
          usda_zone: string | null
          last_frost: string | null
          first_frost: string | null
          surface_type: 'soil' | 'hard'
          slope_pct: number | null
          shade_notes: string | null
          water_source: 'spigot' | 'none' | 'rain'
          constraints_json: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          lat?: number | null
          lng?: number | null
          country_code?: string | null
          usda_zone?: string | null
          last_frost?: string | null
          first_frost?: string | null
          surface_type: 'soil' | 'hard'
          slope_pct?: number | null
          shade_notes?: string | null
          water_source: 'spigot' | 'none' | 'rain'
          constraints_json?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          lat?: number | null
          lng?: number | null
          country_code?: string | null
          usda_zone?: string | null
          last_frost?: string | null
          first_frost?: string | null
          surface_type?: 'soil' | 'hard'
          slope_pct?: number | null
          shade_notes?: string | null
          water_source?: 'spigot' | 'none' | 'rain'
          constraints_json?: Json | null
          created_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          site_id: string
          name: string
          version: number
          status: 'draft' | 'active' | 'archived'
          created_at: string
        }
        Insert: {
          id?: string
          site_id: string
          name: string
          version?: number
          status?: 'draft' | 'active' | 'archived'
          created_at?: string
        }
        Update: {
          id?: string
          site_id?: string
          name?: string
          version?: number
          status?: 'draft' | 'active' | 'archived'
          created_at?: string
        }
      }
      beds: {
        Row: {
          id: string
          plan_id: string
          name: string
          shape: 'rect'
          length_ft: number
          width_ft: number
          height_in: number
          orientation: 'NS' | 'EW'
          surface: 'soil' | 'hard'
          wicking: boolean
          trellis: boolean
          path_clearance_in: number
          notes: string | null
          order_index: number
        }
        Insert: {
          id?: string
          plan_id: string
          name: string
          shape?: 'rect'
          length_ft: number
          width_ft: number
          height_in?: number
          orientation?: 'NS' | 'EW'
          surface?: 'soil' | 'hard'
          wicking?: boolean
          trellis?: boolean
          path_clearance_in?: number
          notes?: string | null
          order_index?: number
        }
        Update: {
          id?: string
          plan_id?: string
          name?: string
          shape?: 'rect'
          length_ft?: number
          width_ft?: number
          height_in?: number
          orientation?: 'NS' | 'EW'
          surface?: 'soil' | 'hard'
          wicking?: boolean
          trellis?: boolean
          path_clearance_in?: number
          notes?: string | null
          order_index?: number
        }
      }
      plantings: {
        Row: {
          id: string
          bed_id: string
          season: 'spring' | 'summer' | 'fall' | 'winter'
          year: number
          crop_id: string | null
          variety: string | null
          spacing_in: number
          family: 'Solanaceae' | 'Brassicaceae' | 'Cucurbitaceae' | 'Fabaceae' | 'Allium' | 'Apiaceae' | 'Asteraceae' | 'Amaranthaceae' | 'Poaceae' | 'Other'
          target_days_to_maturity: number | null
          sowing_method: 'direct' | 'transplant'
          successions_json: Json | null
        }
        Insert: {
          id?: string
          bed_id: string
          season: 'spring' | 'summer' | 'fall' | 'winter'
          year: number
          crop_id?: string | null
          variety?: string | null
          spacing_in: number
          family: 'Solanaceae' | 'Brassicaceae' | 'Cucurbitaceae' | 'Fabaceae' | 'Allium' | 'Apiaceae' | 'Asteraceae' | 'Amaranthaceae' | 'Poaceae' | 'Other'
          target_days_to_maturity?: number | null
          sowing_method?: 'direct' | 'transplant'
          successions_json?: Json | null
        }
        Update: {
          id?: string
          bed_id?: string
          season?: 'spring' | 'summer' | 'fall' | 'winter'
          year?: number
          crop_id?: string | null
          variety?: string | null
          spacing_in?: number
          family?: 'Solanaceae' | 'Brassicaceae' | 'Cucurbitaceae' | 'Fabaceae' | 'Allium' | 'Apiaceae' | 'Asteraceae' | 'Amaranthaceae' | 'Poaceae' | 'Other'
          target_days_to_maturity?: number | null
          sowing_method?: 'direct' | 'transplant'
          successions_json?: Json | null
        }
      }
      materials_estimates: {
        Row: {
          id: string
          plan_id: string
          soil_cuft: number
          compost_cuft: number
          mulch_cuft: number
          lumber_boardfeet: number
          screws_count: number
          drip_line_ft: number
          emitters_count: number
          row_cover_sqft: number
          cost_estimate_cents: number | null
        }
        Insert: {
          id?: string
          plan_id: string
          soil_cuft: number
          compost_cuft: number
          mulch_cuft: number
          lumber_boardfeet: number
          screws_count: number
          drip_line_ft: number
          emitters_count: number
          row_cover_sqft: number
          cost_estimate_cents?: number | null
        }
        Update: {
          id?: string
          plan_id?: string
          soil_cuft?: number
          compost_cuft?: number
          mulch_cuft?: number
          lumber_boardfeet?: number
          screws_count?: number
          drip_line_ft?: number
          emitters_count?: number
          row_cover_sqft?: number
          cost_estimate_cents?: number | null
        }
      }
      irrigation_zones: {
        Row: {
          id: string
          plan_id: string
          method: 'drip' | 'SIP' | 'hand'
          runtime_min_per_week: number
          notes: string | null
        }
        Insert: {
          id?: string
          plan_id: string
          method: 'drip' | 'SIP' | 'hand'
          runtime_min_per_week: number
          notes?: string | null
        }
        Update: {
          id?: string
          plan_id?: string
          method?: 'drip' | 'SIP' | 'hand'
          runtime_min_per_week?: number
          notes?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          plan_id: string
          title: string
          due_on: string
          category: 'build' | 'plant' | 'water' | 'cover' | 'harvest' | 'maint'
          completed: boolean
        }
        Insert: {
          id?: string
          plan_id: string
          title: string
          due_on: string
          category: 'build' | 'plant' | 'water' | 'cover' | 'harvest' | 'maint'
          completed?: boolean
        }
        Update: {
          id?: string
          plan_id?: string
          title?: string
          due_on?: string
          category?: 'build' | 'plant' | 'water' | 'cover' | 'harvest' | 'maint'
          completed?: boolean
        }
      }
      history: {
        Row: {
          id: string
          plan_id: string
          change_json: Json
          created_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          change_json: Json
          created_at?: string
        }
        Update: {
          id?: string
          plan_id?: string
          change_json?: Json
          created_at?: string
        }
      }
    }
  }
}