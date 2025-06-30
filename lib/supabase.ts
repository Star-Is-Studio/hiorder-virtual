import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ibxuecfsiuwqsgdzjzek.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlieHVlY2ZzaXV3cXNnZHpqemVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyODgwNTAsImV4cCI6MjA2Njg2NDA1MH0.wRoV9hKgZkhsarehbFiFcv5F2w8BF7838P1Ei-epfkY'

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