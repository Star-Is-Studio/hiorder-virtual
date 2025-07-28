"use client"

// 주문 아이템 타입 정의
export interface OrderItem {
  id: number
  name: string
  price: string
  priceNumber: number
  quantity: number
}

// 메뉴 아이템 타입 정의
export interface FoodItem {
  id: number
  name: string
  price: string
  priceNumber: number
  image: string
  category: string // 탭 카테고리 추가
  description?: string // 메뉴 설명 추가
  badge?: string
} 