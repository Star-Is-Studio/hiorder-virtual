import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-ref.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 메뉴판 데이터 타입 정의
export interface MenuBoard {
  id?: number
  name: string
  store_name: string
  store_address?: string
  tabs: string[]
  food_items: any[]
  created_at?: string
  updated_at?: string
} 