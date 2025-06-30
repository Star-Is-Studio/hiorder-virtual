"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ConciergeBellIcon, Menu, X, Settings, Plus, Edit, Trash2, MapPin, Download } from "lucide-react"
import Image from "next/image"

// 주문 아이템 타입 정의
interface OrderItem {
  id: number
  name: string
  price: string
  priceNumber: number
  quantity: number
}

// 메뉴 아이템 타입 정의
interface FoodItem {
  id: number
  name: string
  price: string
  priceNumber: number
  image: string
  category: string // 탭 카테고리 추가
  badge?: string
}

export default function Component() {
  const [activeTab, setActiveTab] = useState("메인메뉴")
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [showOrderHistory, setShowOrderHistory] = useState(false)
  const [showOrderConfirm, setShowOrderConfirm] = useState(false)
  const [showStoreSettings, setShowStoreSettings] = useState(false)
  const [storeName, setStoreName] = useState("식당명")
  const [storeAddress, setStoreAddress] = useState("")
  const [tempStoreName, setTempStoreName] = useState("")
  const [tempStoreAddress, setTempStoreAddress] = useState("")
  
  // 탭 관리 state
  const [tabs, setTabs] = useState<string[]>(["메인메뉴", "사이드", "음료"])
  const [tempTabs, setTempTabs] = useState<string[]>([])
  
  // 메뉴 관리 state
  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    {
      id: 1,
      name: "메뉴",
      price: "0원",
      priceNumber: 0,
      image: "/placeholder.svg?height=180&width=280",
      category: "메인메뉴"
    }
  ])
  const [editingMenu, setEditingMenu] = useState<FoodItem | null>(null)
  const [showMenuEdit, setShowMenuEdit] = useState(false)
  const [tempMenuName, setTempMenuName] = useState("")
  const [tempMenuPrice, setTempMenuPrice] = useState("")
  const [tempMenuImage, setTempMenuImage] = useState("")
  const [tempMenuCategory, setTempMenuCategory] = useState("")

  // 현재 선택된 탭에 해당하는 메뉴만 필터링
  const filteredFoodItems = foodItems.filter(item => item.category === activeTab)

  // orderItems에서 총 수량을 계산
  const getCartCount = () => {
    return orderItems.reduce((total, item) => total + item.quantity, 0)
  }

  const handleAddToCart = (item: FoodItem) => {
    setOrderItems((prev) => {
      const existingItem = prev.find(orderItem => orderItem.id === item.id)
      if (existingItem) {
        return prev.map(orderItem =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        )
      } else {
        return [...prev, {
          id: item.id,
          name: item.name,
          price: item.price,
          priceNumber: item.priceNumber,
          quantity: 1
        }]
      }
    })
  }

  const handleRemoveFromCart = (itemId: number) => {
    setOrderItems((prev) => {
      const item = prev.find(orderItem => orderItem.id === itemId)
      if (!item) return prev
      
      if (item.quantity > 1) {
        // 수량이 1보다 크면 수량만 감소
        return prev.map(orderItem =>
          orderItem.id === itemId
            ? { ...orderItem, quantity: orderItem.quantity - 1 }
            : orderItem
        )
      } else {
        // 수량이 1이면 아이템 전체 제거
        return prev.filter(orderItem => orderItem.id !== itemId)
      }
    })
  }

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + (item.priceNumber * item.quantity), 0)
  }

  const handleOrderConfirm = () => {
    setShowOrderConfirm(false)
    // 실제 주문 처리 로직
    alert("주문이 완료되었습니다!")
    setOrderItems([])
  }

  const handleStoreSettingsOpen = () => {
    setTempStoreName(storeName)
    setTempStoreAddress(storeAddress)
    setTempTabs([...tabs])
    setShowStoreSettings(true)
  }

  const handleStoreSettingsSave = () => {
    setStoreName(tempStoreName || "식당명")
    setStoreAddress(tempStoreAddress)
    setTabs([...tempTabs])
    
    // 삭제된 탭에 속한 메뉴들을 첫 번째 탭으로 이동
    if (tempTabs.length > 0) {
      setFoodItems(prev => 
        prev.map(item => 
          tempTabs.includes(item.category) ? item : { ...item, category: tempTabs[0] }
        )
      )
      
      // 현재 선택된 탭이 삭제되었다면 첫 번째 탭으로 변경
      if (!tempTabs.includes(activeTab)) {
        setActiveTab(tempTabs[0])
      }
    }
    
    setShowStoreSettings(false)
  }

  const handleStoreSettingsCancel = () => {
    setTempStoreName("")
    setTempStoreAddress("")
    setTempTabs([])
    setShowStoreSettings(false)
  }

  // 탭 관리 함수들
  const handleAddTab = () => {
    const newTabName = `새 탭 ${tempTabs.length + 1}`
    setTempTabs(prev => [...prev, newTabName])
  }

  const handleEditTab = (index: number, newName: string) => {
    setTempTabs(prev => 
      prev.map((tab, i) => i === index ? newName : tab)
    )
  }

  const handleDeleteTab = (index: number) => {
    if (tempTabs.length <= 1) {
      alert("최소 1개의 탭은 있어야 합니다.")
      return
    }
    setTempTabs(prev => prev.filter((_, i) => i !== index))
  }

  // 메뉴 관리 함수들
  const handleAddMenu = () => {
    const newId = Math.max(...foodItems.map(item => item.id), 0) + 1
    const newMenu: FoodItem = {
      id: newId,
      name: "새 메뉴",
      price: "0원",
      priceNumber: 0,
      image: "/placeholder.svg?height=180&width=280",
      category: activeTab
    }
    setFoodItems(prev => [...prev, newMenu])
  }

  const handleEditMenu = (menu: FoodItem) => {
    setEditingMenu(menu)
    setTempMenuName(menu.name)
    setTempMenuPrice(menu.priceNumber.toString())
    setTempMenuImage(menu.image)
    setTempMenuCategory(menu.category)
    setShowMenuEdit(true)
  }

  const handleDeleteMenu = (menuId: number) => {
    setFoodItems(prev => prev.filter(item => item.id !== menuId))
    // 주문 내역에서도 해당 메뉴 제거
    setOrderItems(prev => prev.filter(item => item.id !== menuId))
  }

  const handleMenuEditSave = () => {
    if (!editingMenu) return
    
    const priceNumber = parseInt(tempMenuPrice) || 0
    const updatedMenu: FoodItem = {
      ...editingMenu,
      name: tempMenuName || "메뉴",
      price: `${priceNumber.toLocaleString()}원`,
      priceNumber: priceNumber,
      image: tempMenuImage || "/placeholder.svg?height=180&width=280",
      category: tempMenuCategory || tabs[0]
    }
    
    setFoodItems(prev => 
      prev.map(item => item.id === editingMenu.id ? updatedMenu : item)
    )
    
    // 주문 내역의 해당 메뉴 정보도 업데이트
    setOrderItems(prev => 
      prev.map(item => 
        item.id === editingMenu.id 
          ? { ...item, name: updatedMenu.name, price: updatedMenu.price, priceNumber: updatedMenu.priceNumber }
          : item
      )
    )
    
    setShowMenuEdit(false)
    setEditingMenu(null)
  }

  const handleMenuEditCancel = () => {
    setShowMenuEdit(false)
    setEditingMenu(null)
    setTempMenuName("")
    setTempMenuPrice("")
    setTempMenuImage("")
    setTempMenuCategory("")
  }

  // 네이버 지도 검색 함수
  const handleOpenMap = () => {
    if (!storeName || storeName === "식당명" || storeName.trim() === "") {
      alert("식당명을 입력해주세요")
      return
    }
    const searchQuery = encodeURIComponent(storeName.replace(/\n/g, ' ').trim())
    const mapUrl = `https://map.naver.com/p/search/${searchQuery}`
    window.open(mapUrl, '_blank')
  }

  // HTML 다운로드 함수
  const handleDownloadHTML = () => {
    const currentDate = new Date().toISOString().split('T')[0]
    
    const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>토탈프로 시뮬레이터 - ${storeName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
            background: rgb(229, 231, 235);
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10%;
        }
        .kiosk-container {
            background: rgb(31, 41, 55);
            border-radius: 24px;
            padding: 16px 20px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            aspect-ratio: 4/3;
            width: 100%;
            max-width: 1152px;
            height: auto;
        }
        .kiosk-content {
            width: 100%;
            height: 100%;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            display: flex;
            position: relative;
        }
        .sidebar {
            width: 144px;
            min-width: 144px;
            background: rgb(31, 41, 55);
            color: white;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        .logo-section {
            padding: 16px;
            text-align: center;
            background: rgba(34, 34, 34, 1);
        }
        .logo {
            background: white;
            color: black;
            border-radius: 12px;
            font-weight: bold;
            font-size: 30px;
            line-height: 32px;
            text-align: center;
            letter-spacing: 0.025em;
            padding: 16px;
            margin-bottom: 16px;
            margin-top: 16px;
            margin-left: 1px;
            margin-right: 2px;
        }
        .store-name {
            color: white;
            font-weight: bold;
            margin-bottom: 24px;
            font-size: 24px;
            white-space: pre-wrap;
            text-align: center;
            line-height: 1.25;
        }
        .menu-section {
            flex: 1;
            padding-left: 0;
            padding-right: 0;
            margin-left: 0;
            margin-right: 0;
            letter-spacing: normal;
            line-height: 1.75;
            border: 0;
            background: rgba(34, 34, 34, 1);
        }
        .menu-item {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            border-left: 4px solid rgb(6, 182, 212);
            margin-left: 8px;
            margin-right: 8px;
            border-radius: 0 4px 4px 0;
            background: rgba(61, 61, 61, 1);
            white-space: nowrap;
        }
        .bell-icon {
            margin-right: 8px;
            width: 24px;
            height: 24px;
            object-fit: contain;
            filter: brightness(0) invert(1);
        }
        .menu-text {
            font-size: 16px;
            letter-spacing: normal;
            font-weight: 800;
            line-height: 2.5;
            white-space: nowrap;
        }
        .call-button {
            position: absolute;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            background: rgb(6, 182, 212);
            color: white;
            font-weight: bold;
            border-radius: 9999px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            font-size: 20px;
            line-height: 28px;
            letter-spacing: normal;
            height: 96px;
            width: 96px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            border: none;
            cursor: pointer;
        }
        .call-button:hover {
            background: rgb(8, 145, 178);
        }
        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        .tabs-container {
            background: white;
            border-bottom: 1px solid rgb(229, 231, 235);
        }
        .tabs {
            display: flex;
            padding-left: 24px;
            padding-top: 16px;
        }
        .tab {
            padding: 12px 24px;
            font-size: 18px;
            font-weight: 500;
            border-bottom: 3px solid transparent;
            transition: all 0.2s;
            margin-right: 32px;
            cursor: pointer;
            color: rgb(75, 85, 99);
        }
        .tab:hover {
            color: rgb(31, 41, 55);
        }
        .tab.active {
            color: rgb(6, 182, 212);
            border-bottom-color: rgb(6, 182, 212);
        }
        .content-area {
            flex: 1;
            padding: 24px;
            overflow: auto;
            padding-left: 24px;
            border: 0;
            line-height: 1.75;
            letter-spacing: normal;
        }
        .section-title {
            font-weight: 500;
            color: rgb(75, 85, 99);
            margin-bottom: 24px;
            font-size: 32px;
        }
        .menu-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
        }
        .menu-card {
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: box-shadow 0.2s;
            border-radius: 8px;
            background: white;
        }
        .menu-card:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .menu-image-container {
            position: relative;
        }
        .menu-image {
            width: 100%;
            height: 176px;
            object-fit: cover;
        }
        .badge {
            position: absolute;
            top: 12px;
            right: 12px;
            background: rgb(31, 41, 55);
            color: white;
            padding: 2px 4px;
            font-size: 12px;
            border-radius: 2px;
        }
        .menu-info {
            padding: 16px;
        }
        .menu-name {
            font-weight: 500;
            font-size: 18px;
            margin-bottom: 12px;
        }
        .price-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .menu-price {
            font-size: 18px;
            font-weight: bold;
        }
        .add-button {
            background: rgb(31, 41, 55);
            color: white;
            padding: 8px 24px;
            font-weight: 500;
            font-size: 14px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .add-button:hover {
            background: rgb(55, 65, 81);
        }
        
        /* 하단 액션바 */
        .action-bar {
            background: white;
            border-top: 1px solid rgb(229, 231, 235);
            padding: 24px;
            display: flex;
            align-items: end;
            justify-content: end;
        }
        .action-buttons {
            display: flex;
            gap: 16px;
        }
        .order-history-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            background: white;
            border: 1px solid rgb(209, 213, 219);
            color: rgb(75, 85, 99);
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            font-size: 16px;
            transition: background-color 0.2s;
        }
        .order-history-btn:hover {
            background: rgb(249, 250, 251);
        }
        .order-btn {
            background: rgb(6, 182, 212);
            color: black;
            font-weight: bold;
            font-size: 16px;
            padding: 12px 32px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            transition: background-color 0.2s;
        }
        .order-btn:hover {
            background: rgb(8, 145, 178);
        }
        .order-btn:disabled {
            background: rgb(156, 163, 175);
            cursor: not-allowed;
        }
        .cart-count {
            position: absolute;
            top: -8px;
            right: -8px;
            background: rgb(8, 145, 178);
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
        }
        
        /* 모달 스타일 */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 50;
        }
        .modal-overlay.show {
            display: flex;
        }
        .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 28rem;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        .modal-header {
            padding: 24px 24px 0 24px;
        }
        .modal-title {
            font-size: 20px;
            font-weight: bold;
        }
        .modal-body {
            padding: 16px 24px;
        }
        .order-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px;
            background: rgb(249, 250, 251);
            border-radius: 8px;
            margin-bottom: 12px;
        }
        .order-item-info {
            flex: 1;
        }
        .order-item-name {
            font-weight: 500;
            font-size: 16px;
        }
        .order-item-price {
            font-size: 14px;
            color: rgb(75, 85, 99);
        }
        .order-item-controls {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .order-item-total {
            font-weight: bold;
            font-size: 16px;
        }
        .remove-btn {
            width: 32px;
            height: 32px;
            border: 1px solid rgb(209, 213, 219);
            background: white;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: rgb(75, 85, 99);
        }
        .remove-btn:hover {
            background: rgb(249, 250, 251);
        }
        .total-section {
            border-top: 1px solid rgb(229, 231, 235);
            padding-top: 12px;
            margin-top: 16px;
        }
        .total-price {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 18px;
            font-weight: bold;
        }
        .empty-order {
            text-align: center;
            color: rgb(156, 163, 175);
            padding: 32px 0;
            font-size: 16px;
        }
        
        /* 확인 모달 */
        .confirm-modal-content {
            background: white;
            border-radius: 12px;
            max-width: 24rem;
            width: 90%;
        }
        .confirm-modal-header {
            padding: 24px 24px 16px 24px;
        }
        .confirm-modal-title {
            font-size: 18px;
            font-weight: bold;
        }
        .confirm-modal-body {
            padding: 0 24px 24px 24px;
        }
        .confirm-modal-description {
            font-size: 16px;
            color: rgb(75, 85, 99);
            margin-bottom: 16px;
        }
        .order-summary {
            background: rgb(249, 250, 251);
            border-radius: 8px;
            padding: 16px;
        }
        .summary-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 16px;
        }
        .summary-total {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            font-size: 18px;
            border-top: 1px solid rgb(229, 231, 235);
            padding-top: 12px;
            margin-top: 12px;
        }
        .modal-footer {
            display: flex;
            gap: 8px;
        }
        .modal-btn {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            font-size: 14px;
            cursor: pointer;
        }
        .modal-btn-cancel {
            background: white;
            border: 1px solid rgb(209, 213, 219);
            color: rgb(75, 85, 99);
        }
        .modal-btn-confirm {
            background: rgb(6, 182, 212);
            color: black;
        }
        .modal-btn:hover {
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="kiosk-container">
        <div class="kiosk-content">
            <div class="sidebar">
                <div class="logo-section">
                    <div class="logo">하이<br/>오더</div>
                    <div class="store-name">${storeName}</div>
                </div>
                <div class="menu-section">
                    <div class="menu-item">
                        <img src="https://cdn-icons-png.flaticon.com/256/192/192732.png" class="bell-icon" alt="메뉴주문" />
                        <span class="menu-text">메뉴주문</span>
                    </div>
                </div>
                <button class="call-button" onclick="alert('직원을 호출했습니다!')">직원<br/>호출</button>
            </div>
            <div class="main-content">
                <div class="tabs-container">
                    <div class="tabs">
                        ${tabs.map((tab, index) => 
                            `<div class="tab ${index === 0 ? 'active' : ''}" onclick="switchTab('${tab}')">${tab}</div>`
                        ).join('')}
                    </div>
                </div>
                <div class="content-area">
                    <h2 class="section-title">${tabs[0]}</h2>
                    <div class="menu-grid" id="menu-grid">
                        ${foodItems.filter(item => item.category === tabs[0]).map(item => `
                            <div class="menu-card">
                                <div class="menu-image-container">
                                    <img src="${item.image}" alt="${item.name}" class="menu-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                                    <div style="display:none; width:100%; height:176px; background:#f3f4f6; align-items:center; justify-content:center; color:#9ca3af;">이미지</div>
                                    ${item.badge ? `<div class="badge">${item.badge}</div>` : ''}
                                </div>
                                <div class="menu-info">
                                    <h3 class="menu-name">${item.name}</h3>
                                    <div class="price-container">
                                        <span class="menu-price">${item.price}</span>
                                        <button class="add-button" onclick="addToCart(${item.id}, '${item.name}', '${item.price}', ${item.priceNumber})">담기</button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="action-bar">
                    <div class="action-buttons">
                        <button class="order-history-btn" onclick="showOrderHistory()">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                            주문내역
                        </button>
                        <button class="order-btn" id="order-btn" onclick="showOrderConfirm()" disabled>
                            주문하기
                            <div class="cart-count" id="cart-count" style="display: none;">0</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 주문내역 모달 -->
    <div class="modal-overlay" id="order-history-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">주문내역</h2>
            </div>
            <div class="modal-body" id="order-history-content">
                <div class="empty-order">주문한 상품이 없습니다.</div>
            </div>
        </div>
    </div>
    
    <!-- 주문확인 모달 -->
    <div class="modal-overlay" id="order-confirm-modal">
        <div class="confirm-modal-content">
            <div class="confirm-modal-header">
                <h2 class="confirm-modal-title">주문 확인</h2>
            </div>
            <div class="confirm-modal-body">
                <div class="confirm-modal-description">주문하시겠습니까?</div>
                <div class="order-summary" id="order-confirm-content">
                </div>
                <div class="modal-footer">
                    <button class="modal-btn modal-btn-cancel" onclick="hideOrderConfirm()">취소</button>
                    <button class="modal-btn modal-btn-confirm" onclick="confirmOrder()">주문하기</button>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // 전역 변수
        let orderItems = [];
        const allMenus = ${JSON.stringify(foodItems)};
        const tabMenus = {
            ${tabs.map((tab, index) => `
                "${tab}": ${JSON.stringify(foodItems.filter(item => item.category === tab))}
            `).join(',')}
        };
        
        // 탭 전환 함수
        function switchTab(tabName) {
            // 모든 탭 비활성화
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            // 클릭된 탭 활성화
            event.target.classList.add('active');
            
            const menus = tabMenus[tabName] || [];
            
            // 섹션 제목 업데이트
            document.querySelector('.section-title').textContent = tabName;
            
            // 메뉴 그리드 업데이트
            const menuGrid = document.getElementById('menu-grid');
            menuGrid.innerHTML = menus.map(item => \`
                <div class="menu-card">
                    <div class="menu-image-container">
                        <img src="\${item.image}" alt="\${item.name}" class="menu-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                        <div style="display:none; width:100%; height:176px; background:#f3f4f6; align-items:center; justify-content:center; color:#9ca3af;">이미지</div>
                        \${item.badge ? \`<div class="badge">\${item.badge}</div>\` : ''}
                    </div>
                    <div class="menu-info">
                        <h3 class="menu-name">\${item.name}</h3>
                        <div class="price-container">
                            <span class="menu-price">\${item.price}</span>
                            <button class="add-button" onclick="addToCart(\${item.id}, '\${item.name}', '\${item.price}', \${item.priceNumber})">담기</button>
                        </div>
                    </div>
                </div>
            \`).join('');
        }
        
        // 장바구니에 추가
        function addToCart(id, name, price, priceNumber) {
            const existingItem = orderItems.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                orderItems.push({
                    id: id,
                    name: name,
                    price: price,
                    priceNumber: priceNumber,
                    quantity: 1
                });
            }
            
            updateCartUI();
        }
        
        // 장바구니에서 제거
        function removeFromCart(id) {
            const item = orderItems.find(item => item.id === id);
            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    orderItems = orderItems.filter(item => item.id !== id);
                }
            }
            updateCartUI();
            updateOrderHistoryModal();
        }
        
        // 장바구니 UI 업데이트
        function updateCartUI() {
            const totalCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
            const cartCountEl = document.getElementById('cart-count');
            const orderBtnEl = document.getElementById('order-btn');
            
            if (totalCount > 0) {
                cartCountEl.textContent = totalCount;
                cartCountEl.style.display = 'flex';
                orderBtnEl.disabled = false;
            } else {
                cartCountEl.style.display = 'none';
                orderBtnEl.disabled = true;
            }
        }
        
        // 총 금액 계산
        function getTotalPrice() {
            return orderItems.reduce((sum, item) => sum + (item.priceNumber * item.quantity), 0);
        }
        
        // 주문내역 모달 표시
        function showOrderHistory() {
            updateOrderHistoryModal();
            document.getElementById('order-history-modal').classList.add('show');
        }
        
        // 주문내역 모달 업데이트
        function updateOrderHistoryModal() {
            const content = document.getElementById('order-history-content');
            
            if (orderItems.length === 0) {
                content.innerHTML = '<div class="empty-order">주문한 상품이 없습니다.</div>';
                return;
            }
            
            const itemsHtml = orderItems.map(item => \`
                <div class="order-item">
                    <div class="order-item-info">
                        <div class="order-item-name">\${item.name} x \${item.quantity}</div>
                        <div class="order-item-price">\${item.price}</div>
                    </div>
                    <div class="order-item-controls">
                        <div class="order-item-total">\${(item.priceNumber * item.quantity).toLocaleString()}원</div>
                        <button class="remove-btn" onclick="removeFromCart(\${item.id})">×</button>
                    </div>
                </div>
            \`).join('');
            
            const totalHtml = \`
                <div class="total-section">
                    <div class="total-price">
                        <span>총 금액</span>
                        <span>\${getTotalPrice().toLocaleString()}원</span>
                    </div>
                </div>
            \`;
            
            content.innerHTML = itemsHtml + totalHtml;
        }
        
        // 주문확인 모달 표시
        function showOrderConfirm() {
            if (orderItems.length === 0) return;
            
            const content = document.getElementById('order-confirm-content');
            
            const itemsHtml = orderItems.map(item => \`
                <div class="summary-item">
                    <span>\${item.name} x \${item.quantity}</span>
                    <span>\${(item.priceNumber * item.quantity).toLocaleString()}원</span>
                </div>
            \`).join('');
            
            const totalHtml = \`
                <div class="summary-total">
                    <span>총 금액</span>
                    <span>\${getTotalPrice().toLocaleString()}원</span>
                </div>
            \`;
            
            content.innerHTML = itemsHtml + totalHtml;
            document.getElementById('order-confirm-modal').classList.add('show');
        }
        
        // 모달 숨기기
        function hideOrderHistory() {
            document.getElementById('order-history-modal').classList.remove('show');
        }
        
        function hideOrderConfirm() {
            document.getElementById('order-confirm-modal').classList.remove('show');
        }
        
        // 주문 확정
        function confirmOrder() {
            alert('주문이 완료되었습니다!');
            orderItems = [];
            updateCartUI();
            hideOrderConfirm();
        }
        
        // 모달 배경 클릭 시 닫기
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('show');
                }
            });
        });
        
        // ESC 키로 모달 닫기
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay').forEach(modal => {
                    modal.classList.remove('show');
                });
            }
        });
    </script>
</body>
</html>`

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `토탈프로_시뮬레이터_${storeName.replace(/\n/g, '_')}_${currentDate}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full h-screen bg-gray-200 flex items-center justify-center p-[10%]">
      <div
        className="bg-gray-800 rounded-3xl p-4 shadow-2xl px-5 py-6"
        style={{ aspectRatio: "4/3", width: "100%", maxWidth: "1200px", height: "auto" }}
      >
        <div className="w-full h-full bg-white rounded-2xl overflow-hidden flex relative">
          {/* Map Button - 우측 상단 (매장명이 있을 때만 표시) */}
          <Button
            onClick={handleOpenMap}
            className="absolute top-4 right-20 z-10 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
            size="sm"
            title="네이버 지도에서 검색"
          >
            <MapPin className="w-4 h-4" />
          </Button>

          {/* Download Button - 우측 상단 */}
          <Button
            onClick={handleDownloadHTML}
            className="absolute top-4 right-12 z-10 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full"
            size="sm"
            title="HTML 파일 다운로드"
          >
            <Download className="w-4 h-4" />
          </Button>

          {/* Settings Button - 우측 상단 */}
          <Button
            onClick={handleStoreSettingsOpen}
            className="absolute top-4 right-4 z-10 bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full"
            size="sm"
          >
            <Settings className="w-4 h-4" />
          </Button>

          {/* Left Sidebar */}
          <div className="w-36 bg-gray-800 text-white flex flex-col relative">
            <div className="p-4 text-center bg-[rgba(34,34,34,1)]">
              <div className="bg-white text-black rounded-xl font-bold leading-tight text-3xl text-center tracking-wide py-4 mb-4 mt-4 leading-8 px-4 ml-px mr-0.5">
                하이
                <br />
                오더
              </div>
              <div className="text-white font-bold mb-6 text-2xl whitespace-pre-wrap text-center leading-tight">{storeName}</div>
            </div>

            <div className="flex-1 px-0 mx-0 tracking-normal leading-7 border-0 bg-[rgba(34,34,34,1)]">
              <div className="flex items-center px-4 py-3 border-l-4 border-cyan-400 mx-2 rounded-r bg-[rgba(61,61,61,1)]">
                <img src="https://cdn-icons-png.flaticon.com/256/192/192732.png" className="mr-2 w-6 h-6 brightness-0 invert" alt="메뉴주문" />
                <span className="text-base tracking-normal font-extrabold leading-10">메뉴주문</span>
              </div>
            </div>

            {/* Circular Call Staff Button - positioned absolutely */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <Button className="bg-cyan-400 hover:bg-cyan-500 font-bold rounded-full shadow-lg text-white text-xl leading-7 tracking-normal h-24 w-24">
                직원
                <br />
                호출
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header Tabs */}
            <div className="bg-white border-b border-gray-200">
              <div className="flex px-6 pt-4">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-lg font-medium border-b-3 transition-colors mr-8 ${
                      activeTab === tab
                        ? "text-cyan-500 border-cyan-500"
                        : "text-gray-600 border-transparent hover:text-gray-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-auto px-6 border-0 leading-7 tracking-normal">
              <h2 className="font-medium text-gray-600 mb-6 text-2xl">{activeTab}</h2>

              <div className="grid grid-cols-3 gap-6">
                {filteredFoodItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={280}
                        height={180}
                        className="w-full h-44 object-cover"
                      />
                      {item.badge && (
                        <Badge className="absolute top-3 right-3 bg-gray-800 text-white px-2 py-1 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-lg mb-3">{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">{item.price}</span>
                        <Button
                          onClick={() => handleAddToCart(item)}
                          className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 font-medium"
                        >
                          담기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="bg-white border-t border-gray-200 p-6 flex items-end justify-end">
              <div className="flex gap-4">
                <Dialog open={showOrderHistory} onOpenChange={setShowOrderHistory}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 bg-white border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-3"
                    >
                      <Menu className="w-4 h-4" />
                      주문내역
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">주문내역</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      {orderItems.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">주문한 상품이 없습니다.</p>
                      ) : (
                        <div className="space-y-3">
                          {orderItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium">{item.name} x {item.quantity}</div>
                                <div className="text-sm text-gray-600">{item.price}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{(item.priceNumber * item.quantity).toLocaleString()}원</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRemoveFromCart(item.id)}
                                  className="w-8 h-8 p-0"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <div className="border-t pt-3 mt-4">
                            <div className="flex justify-between items-center text-lg font-bold">
                              <span>총 금액</span>
                              <span>{getTotalPrice().toLocaleString()}원</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <AlertDialog open={showOrderConfirm} onOpenChange={setShowOrderConfirm}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-8 py-3 relative"
                      disabled={orderItems.length === 0}
                    >
                      주문하기
                      <Badge className="absolute -top-2 -right-2 bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {getCartCount()}
                      </Badge>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>주문 확인</AlertDialogTitle>
                      <AlertDialogDescription className="text-base">
                        주문하시겠습니까?
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="space-y-2">
                            {orderItems.map((item) => (
                              <div key={item.id} className="flex justify-between">
                                <span>{item.name} x {item.quantity}</span>
                                <span>{(item.priceNumber * item.quantity).toLocaleString()}원</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t pt-2 mt-3 font-bold flex justify-between">
                            <span>총 금액</span>
                            <span>{getTotalPrice().toLocaleString()}원</span>
                          </div>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={handleOrderConfirm} className="bg-cyan-400 hover:bg-cyan-500 text-black">
                        주문하기
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>

          {/* Store Settings Dialog */}
          <Dialog open={showStoreSettings} onOpenChange={setShowStoreSettings}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">설정</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="store" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="store">매장 설정</TabsTrigger>
                  <TabsTrigger value="tabs">탭 관리</TabsTrigger>
                  <TabsTrigger value="menu">메뉴 관리</TabsTrigger>
                </TabsList>
                
                <TabsContent value="store" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName" className="text-sm font-medium">
                      매장명
                    </Label>
                    <Textarea
                      id="storeName"
                      value={tempStoreName}
                      onChange={(e) => setTempStoreName(e.target.value)}
                      placeholder="매장명을 입력하세요(엔터가능)"
                      className="w-full resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeAddress" className="text-sm font-medium">
                      주소(선택)
                    </Label>
                    <Input
                      id="storeAddress"
                      value={tempStoreAddress}
                      onChange={(e) => setTempStoreAddress(e.target.value)}
                      placeholder="주소를 입력하세요"
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={handleStoreSettingsCancel}
                      className="flex-1"
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleStoreSettingsSave}
                      className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-black"
                    >
                      저장
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="tabs" className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">탭 관리</h3>
                    <Button
                      onClick={handleAddTab}
                      className="bg-cyan-400 hover:bg-cyan-500 text-black"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      탭 추가
                    </Button>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {tempTabs.map((tab, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Input
                          value={tab}
                          onChange={(e) => handleEditTab(index, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={() => handleDeleteTab(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          disabled={tempTabs.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={handleStoreSettingsCancel}
                      className="flex-1"
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleStoreSettingsSave}
                      className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-black"
                    >
                      저장
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="menu" className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">메뉴 목록</h3>
                    <Button
                      onClick={handleAddMenu}
                      className="bg-cyan-400 hover:bg-cyan-500 text-black"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      메뉴 추가
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {foodItems.map((item) => (
                      <Card key={item.id} className="relative">
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button
                            onClick={() => handleEditMenu(item)}
                            variant="outline"
                            size="sm"
                            className="w-8 h-8 p-0"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteMenu(item.id)}
                            variant="outline"
                            size="sm"
                            className="w-8 h-8 p-0 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <CardContent className="p-3">
                          <div className="text-sm font-medium mb-1">{item.name}</div>
                          <div className="text-xs text-gray-600 mb-1">{item.price}</div>
                          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">{item.category}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          {/* Menu Edit Dialog */}
          <Dialog open={showMenuEdit} onOpenChange={setShowMenuEdit}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">메뉴 편집</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="menuName" className="text-sm font-medium">
                    메뉴명
                  </Label>
                  <Input
                    id="menuName"
                    value={tempMenuName}
                    onChange={(e) => setTempMenuName(e.target.value)}
                    placeholder="메뉴명을 입력하세요"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="menuPrice" className="text-sm font-medium">
                    가격 (원)
                  </Label>
                  <Input
                    id="menuPrice"
                    type="number"
                    value={tempMenuPrice}
                    onChange={(e) => setTempMenuPrice(e.target.value)}
                    placeholder="가격을 입력하세요"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="menuCategory" className="text-sm font-medium">
                    카테고리
                  </Label>
                  <Select value={tempMenuCategory} onValueChange={setTempMenuCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="카테고리를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {tabs.map((tab) => (
                        <SelectItem key={tab} value={tab}>
                          {tab}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="menuImage" className="text-sm font-medium">
                    이미지 URL
                  </Label>
                  <Input
                    id="menuImage"
                    value={tempMenuImage}
                    onChange={(e) => setTempMenuImage(e.target.value)}
                    placeholder="이미지 URL을 입력하세요"
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleMenuEditCancel}
                    className="flex-1"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleMenuEditSave}
                    className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-black"
                  >
                    저장
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
