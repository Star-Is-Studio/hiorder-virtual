"use client"

import { useState, useEffect } from "react"
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
import { supabase, MenuBoard } from "@/lib/supabase"

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
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  
  // 저장/불러오기 관련 상태
  const [savedMenuBoards, setSavedMenuBoards] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width <= 1024)
    }
    
    checkDeviceType()
    window.addEventListener('resize', checkDeviceType)
    
    return () => window.removeEventListener('resize', checkDeviceType)
  }, [])

  // 저장된 메뉴판 목록 로드
  useEffect(() => {
    loadSavedMenuBoards()
  }, [])

  const loadSavedMenuBoards = async () => {
    setIsLoading(true)
    try {
      // Supabase에서 로드
      const { data, error } = await supabase
        .from('menu_boards')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setSavedMenuBoards(data || [])
    } catch (error) {
      console.error('저장된 메뉴판 로드 실패:', error)
      alert('메뉴판 로드에 실패했습니다: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

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
  // 현재 상태 저장
  const handleSaveCurrentState = async () => {
    setIsLoading(true)
    try {
      const boardName = `${storeName} ${storeAddress}`.trim() || '이름없는 메뉴판'
      
      // Supabase에 저장
      const menuBoard: MenuBoard = {
        name: boardName,
        store_name: storeName,
        store_address: storeAddress,
        tabs,
        food_items: foodItems
      }
      
      // 같은 이름이 있는지 확인
      const { data: existing } = await supabase
        .from('menu_boards')
        .select('id')
        .eq('name', boardName)
        .single()
      
      if (existing) {
        // 업데이트
        const { error } = await supabase
          .from('menu_boards')
          .update(menuBoard)
          .eq('id', existing.id)
        
        if (error) throw error
      } else {
        // 새로 추가
        const { error } = await supabase
          .from('menu_boards')
          .insert([menuBoard])
        
        if (error) throw error
      }
      
      await loadSavedMenuBoards()
      alert('메뉴판이 저장되었습니다!')
    } catch (error) {
      console.error('저장 실패:', error)
      alert('저장에 실패했습니다: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  // 저장된 메뉴판 불러오기
  const handleLoadMenuBoard = (boardData: any) => {
    try {
      // 클라우드 데이터와 로컬 데이터 모두 지원
      const storeName = boardData.store_name || boardData.storeName || '식당명'
      const storeAddress = boardData.store_address || boardData.storeAddress || ''
      const tabs = boardData.tabs || ['메인메뉴']
      const foodItems = boardData.food_items || boardData.foodItems || []
      
      setStoreName(storeName)
      setStoreAddress(storeAddress)
      setTabs(tabs)
      setFoodItems(foodItems)
      setActiveTab(tabs[0] || '메인메뉴')
      
      // 임시 상태도 업데이트
      setTempStoreName(storeName)
      setTempStoreAddress(storeAddress)
      
      setShowStoreSettings(false)
      alert('메뉴판을 불러왔습니다!')
    } catch (error) {
      console.error('불러오기 실패:', error)
      alert('불러오기에 실패했습니다: ' + (error as Error).message)
    }
  }

  // 저장된 메뉴판 삭제
  const handleDeleteMenuBoard = async (boardId: number) => {
    setIsLoading(true)
    try {
      // Supabase에서 삭제
      const { error } = await supabase
        .from('menu_boards')
        .delete()
        .eq('id', boardId)
      
      if (error) throw error
      await loadSavedMenuBoards()
      alert('메뉴판이 삭제되었습니다.')
    } catch (error) {
      console.error('삭제 실패:', error)
      alert('삭제에 실패했습니다: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  // 검색 필터링된 메뉴판 목록
  const filteredSavedBoards = savedMenuBoards.filter(board => {
    const name = board.name || ''
    const storeName = board.store_name || board.storeName || ''
    const storeAddress = board.store_address || board.storeAddress || ''
    
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           storeAddress.toLowerCase().includes(searchQuery.toLowerCase())
  })

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
            padding: 8px;
            overflow: hidden;
        }
        @media (min-width: 640px) {
            body { padding: 16px; }
        }
        @media (min-width: 768px) {
            body { padding: 32px; }
        }
        @media (min-width: 1024px) {
            body { padding: 10%; }
        }
        .kiosk-container {
            background: rgb(31, 41, 55);
            border-radius: 12px;
            padding: 4px 8px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            aspect-ratio: 9/16;
            width: 98vw;
            height: 98vh;
        }
        @media (min-width: 768px) {
            .kiosk-container {
                border-radius: 20px;
                padding: 16px 20px;
                aspect-ratio: 4/3;
                width: 100%;
                height: auto;
                max-width: min(90vw, 90vh * 4/3);
                max-height: 90vh;
            }
        }
        @media (min-width: 1024px) {
            .kiosk-container {
                border-radius: 24px;
                padding: 16px 20px;
            }
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
            width: 80px;
            min-width: 80px;
            background: rgb(31, 41, 55);
            color: white;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        @media (min-width: 640px) {
            .sidebar {
                width: 96px;
                min-width: 96px;
            }
        }
        @media (min-width: 768px) {
            .sidebar {
                width: 128px;
                min-width: 128px;
            }
        }
        @media (min-width: 1024px) {
            .sidebar {
                width: 144px;
                min-width: 144px;
            }
        }
        .logo-section {
            padding: 8px;
            text-align: center;
            background: rgba(34, 34, 34, 1);
        }
        @media (min-width: 640px) {
            .logo-section { padding: 12px; }
        }
        @media (min-width: 768px) {
            .logo-section { padding: 16px; }
        }
        .logo {
            background: white;
            color: black;
            border-radius: 8px;
            font-weight: bold;
            font-size: 14px;
            line-height: 16px;
            text-align: center;
            letter-spacing: 0.025em;
            padding: 8px;
            margin-bottom: 8px;
            margin-top: 8px;
            margin-left: 1px;
            margin-right: 2px;
        }
        @media (min-width: 640px) {
            .logo {
                border-radius: 10px;
                font-size: 18px;
                line-height: 20px;
                padding: 12px;
                margin-bottom: 12px;
                margin-top: 12px;
            }
        }
        @media (min-width: 768px) {
            .logo {
                border-radius: 12px;
                font-size: 24px;
                line-height: 26px;
                padding: 16px;
                margin-bottom: 16px;
                margin-top: 16px;
            }
        }
        @media (min-width: 1024px) {
            .logo {
                font-size: 30px;
                line-height: 32px;
            }
        }
        .store-name {
            color: white;
            font-weight: bold;
            margin-bottom: 12px;
            font-size: 12px;
            white-space: pre-wrap;
            text-align: center;
            line-height: 1.25;
        }
        @media (min-width: 640px) {
            .store-name {
                margin-bottom: 16px;
                font-size: 14px;
            }
        }
        @media (min-width: 768px) {
            .store-name {
                margin-bottom: 20px;
                font-size: 18px;
            }
        }
        @media (min-width: 1024px) {
            .store-name {
                margin-bottom: 24px;
                font-size: 24px;
            }
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
            padding: 8px 8px;
            border-left: 4px solid rgb(6, 182, 212);
            margin-left: 4px;
            margin-right: 4px;
            border-radius: 0 4px 4px 0;
            background: rgba(61, 61, 61, 1);
            white-space: nowrap;
        }
        @media (min-width: 640px) {
            .menu-item {
                padding: 10px 12px;
                margin-left: 6px;
                margin-right: 6px;
            }
        }
        @media (min-width: 768px) {
            .menu-item {
                padding: 12px 16px;
                margin-left: 8px;
                margin-right: 8px;
            }
        }
        .bell-icon {
            margin-right: 4px;
            width: 12px;
            height: 12px;
            object-fit: contain;
            filter: brightness(0) invert(1);
        }
        @media (min-width: 640px) {
            .bell-icon {
                margin-right: 6px;
                width: 16px;
                height: 16px;
            }
        }
        @media (min-width: 768px) {
            .bell-icon {
                margin-right: 8px;
                width: 20px;
                height: 20px;
            }
        }
        @media (min-width: 1024px) {
            .bell-icon {
                width: 24px;
                height: 24px;
            }
        }
        .menu-text {
            font-size: 12px;
            letter-spacing: normal;
            font-weight: 800;
            line-height: 1.5;
            white-space: nowrap;
        }
        @media (min-width: 640px) {
            .menu-text {
                font-size: 14px;
                line-height: 2;
            }
        }
        @media (min-width: 768px) {
            .menu-text {
                font-size: 16px;
                line-height: 2.5;
            }
        }
        .call-button {
            position: absolute;
            bottom: 12px;
            left: 50%;
            transform: translateX(-50%);
            background: rgb(6, 182, 212);
            color: white;
            font-weight: bold;
            border-radius: 9999px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            font-size: 12px;
            line-height: 12px;
            letter-spacing: normal;
            height: 48px;
            width: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            border: none;
            cursor: pointer;
        }
        @media (min-width: 640px) {
            .call-button {
                bottom: 16px;
                font-size: 14px;
                line-height: 16px;
                height: 64px;
                width: 64px;
            }
        }
        @media (min-width: 768px) {
            .call-button {
                bottom: 20px;
                font-size: 16px;
                line-height: 20px;
                height: 80px;
                width: 80px;
            }
        }
        @media (min-width: 1024px) {
            .call-button {
                bottom: 24px;
                font-size: 20px;
                line-height: 28px;
                height: 96px;
                width: 96px;
            }
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
            padding-left: 8px;
            padding-top: 8px;
        }
        @media (min-width: 640px) {
            .tabs {
                padding-left: 12px;
                padding-top: 12px;
            }
        }
        @media (min-width: 768px) {
            .tabs {
                padding-left: 16px;
                padding-top: 16px;
            }
        }
        @media (min-width: 1024px) {
            .tabs {
                padding-left: 24px;
            }
        }
        .tab {
            padding: 8px 8px;
            font-size: 12px;
            font-weight: 500;
            border-bottom: 3px solid transparent;
            transition: all 0.2s;
            margin-right: 8px;
            cursor: pointer;
            color: rgb(75, 85, 99);
        }
        @media (min-width: 640px) {
            .tab {
                padding: 10px 12px;
                font-size: 14px;
                margin-right: 16px;
            }
        }
        @media (min-width: 768px) {
            .tab {
                padding: 12px 16px;
                font-size: 16px;
                margin-right: 24px;
            }
        }
        @media (min-width: 1024px) {
            .tab {
                padding: 12px 24px;
                font-size: 18px;
                margin-right: 32px;
            }
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
            padding: 8px;
            overflow: auto;
            border: 0;
            line-height: 1.75;
            letter-spacing: normal;
        }
        @media (min-width: 640px) {
            .content-area {
                padding: 12px;
            }
        }
        @media (min-width: 768px) {
            .content-area {
                padding: 16px;
            }
        }
        @media (min-width: 1024px) {
            .content-area {
                padding: 24px;
            }
        }
        .section-title {
            font-weight: 500;
            color: rgb(75, 85, 99);
            margin-bottom: 12px;
            font-size: 14px;
        }
        @media (min-width: 640px) {
            .section-title {
                margin-bottom: 16px;
                font-size: 18px;
            }
        }
        @media (min-width: 768px) {
            .section-title {
                margin-bottom: 20px;
                font-size: 24px;
            }
        }
        @media (min-width: 1024px) {
            .section-title {
                margin-bottom: 24px;
                font-size: 32px;
            }
        }
        .menu-grid {
            display: grid;
            grid-template-columns: repeat(1, 1fr);
            gap: 8px;
        }
        @media (min-width: 640px) {
            .menu-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
            }
        }
        @media (min-width: 1024px) {
            .menu-grid {
                grid-template-columns: repeat(3, 1fr);
                gap: 24px;
            }
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
            height: 96px;
            object-fit: cover;
        }
        @media (min-width: 640px) {
            .menu-image {
                height: 128px;
            }
        }
        @media (min-width: 768px) {
            .menu-image {
                height: 144px;
            }
        }
        @media (min-width: 1024px) {
            .menu-image {
                height: 176px;
            }
        }
        .badge {
            position: absolute;
            top: 4px;
            right: 4px;
            background: rgb(31, 41, 55);
            color: white;
            padding: 2px 4px;
            font-size: 12px;
            border-radius: 2px;
        }
        @media (min-width: 640px) {
            .badge {
                top: 8px;
                right: 8px;
            }
        }
        @media (min-width: 768px) {
            .badge {
                top: 12px;
                right: 12px;
            }
        }
        .menu-info {
            padding: 8px;
        }
        @media (min-width: 640px) {
            .menu-info {
                padding: 12px;
            }
        }
        @media (min-width: 768px) {
            .menu-info {
                padding: 16px;
            }
        }
        .menu-name {
            font-weight: 500;
            font-size: 14px;
            margin-bottom: 8px;
        }
        @media (min-width: 640px) {
            .menu-name {
                font-size: 16px;
                margin-bottom: 10px;
            }
        }
        @media (min-width: 768px) {
            .menu-name {
                font-size: 18px;
                margin-bottom: 12px;
            }
        }
        .price-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .menu-price {
            font-size: 14px;
            font-weight: bold;
        }
        @media (min-width: 640px) {
            .menu-price {
                font-size: 16px;
            }
        }
        @media (min-width: 768px) {
            .menu-price {
                font-size: 18px;
            }
        }
        .add-button {
            background: rgb(31, 41, 55);
            color: white;
            padding: 4px 8px;
            font-weight: 500;
            font-size: 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        @media (min-width: 640px) {
            .add-button {
                padding: 6px 12px;
                font-size: 13px;
            }
        }
        @media (min-width: 768px) {
            .add-button {
                padding: 6px 16px;
                font-size: 14px;
            }
        }
        @media (min-width: 1024px) {
            .add-button {
                padding: 8px 24px;
            }
        }
        .add-button:hover {
            background: rgb(55, 65, 81);
        }
        
        /* 하단 액션바 */
        .action-bar {
            background: white;
            border-top: 1px solid rgb(229, 231, 235);
            padding: 8px;
            display: flex;
            align-items: end;
            justify-content: end;
        }
        @media (min-width: 640px) {
            .action-bar {
                padding: 12px;
            }
        }
        @media (min-width: 768px) {
            .action-bar {
                padding: 16px;
            }
        }
        @media (min-width: 1024px) {
            .action-bar {
                padding: 24px;
            }
        }
        .action-buttons {
            display: flex;
            gap: 8px;
        }
        @media (min-width: 640px) {
            .action-buttons {
                gap: 12px;
            }
        }
        @media (min-width: 768px) {
            .action-buttons {
                gap: 16px;
            }
        }
        .order-history-btn {
            display: flex;
            align-items: center;
            gap: 4px;
            background: white;
            border: 1px solid rgb(209, 213, 219);
            color: rgb(75, 85, 99);
            padding: 8px 8px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            font-size: 12px;
            transition: background-color 0.2s;
        }
        @media (min-width: 640px) {
            .order-history-btn {
                gap: 6px;
                padding: 10px 12px;
                font-size: 14px;
            }
        }
        @media (min-width: 768px) {
            .order-history-btn {
                gap: 8px;
                padding: 12px 16px;
                font-size: 16px;
            }
        }
        @media (min-width: 1024px) {
            .order-history-btn {
                padding: 12px 24px;
            }
        }
        .order-history-btn:hover {
            background: rgb(249, 250, 251);
        }
        .order-btn {
            background: rgb(6, 182, 212);
            color: black;
            font-weight: bold;
            font-size: 12px;
            padding: 8px 12px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            transition: background-color 0.2s;
        }
        @media (min-width: 640px) {
            .order-btn {
                font-size: 14px;
                padding: 10px 16px;
            }
        }
        @media (min-width: 768px) {
            .order-btn {
                font-size: 16px;
                padding: 12px 24px;
            }
        }
        @media (min-width: 1024px) {
            .order-btn {
                padding: 12px 32px;
            }
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
            top: -4px;
            right: -4px;
            background: rgb(8, 145, 178);
            color: white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
        }
        @media (min-width: 640px) {
            .cart-count {
                top: -6px;
                right: -6px;
                width: 20px;
                height: 20px;
            }
        }
        @media (min-width: 768px) {
            .cart-count {
                top: -8px;
                right: -8px;
                width: 24px;
                height: 24px;
            }
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
    <div className="w-full h-screen bg-gray-200 flex items-center justify-center p-1 sm:p-4 md:p-8 lg:p-[10%] overflow-hidden">
      <div
        className="bg-gray-800 rounded-lg sm:rounded-2xl md:rounded-3xl p-1 sm:p-3 md:p-4 lg:p-6 shadow-2xl"
        style={{ 
          aspectRatio: isMobile ? "9/16" : isTablet ? "16/10" : "4/3", 
          width: isMobile ? "98vw" : isTablet ? "92vw" : "100%",
          height: isMobile ? "98vh" : isTablet ? "78vh" : "auto",
          maxWidth: isMobile ? "none" : isTablet ? "none" : "min(90vw, 90vh * 4/3)",
          maxHeight: isMobile ? "none" : isTablet ? "78vh" : "90vh"
        }}
      >
        <div className="w-full h-full bg-white rounded-2xl overflow-hidden flex relative">
          {/* Mobile/Tablet: 하단에 배치, Desktop: 상단에 배치 */}
          {isMobile || isTablet ? (
            <div className="absolute bottom-2 right-2 z-10 flex gap-1">
              <Button
                onClick={handleOpenMap}
                className={`bg-blue-600 hover:bg-blue-700 text-white rounded-full ${isTablet ? 'p-2' : 'p-1'}`}
                size="sm"
                title="네이버 지도에서 검색"
              >
                <MapPin className={`${isTablet ? 'w-4 h-4' : 'w-3 h-3'}`} />
              </Button>
              <Button
                onClick={handleDownloadHTML}
                className={`bg-green-600 hover:bg-green-700 text-white rounded-full ${isTablet ? 'p-2' : 'p-1'}`}
                size="sm"
                title="HTML 파일 다운로드"
              >
                <Download className={`${isTablet ? 'w-4 h-4' : 'w-3 h-3'}`} />
              </Button>
              <Button
                onClick={handleStoreSettingsOpen}
                className={`bg-gray-600 hover:bg-gray-700 text-white rounded-full ${isTablet ? 'p-2' : 'p-1'}`}
                size="sm"
              >
                <Settings className={`${isTablet ? 'w-4 h-4' : 'w-3 h-3'}`} />
              </Button>
            </div>
          ) : (
            <>
              {/* Settings Button - 우측 상단 */}
              <Button
                onClick={handleStoreSettingsOpen}
                className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 z-10 bg-gray-600 hover:bg-gray-700 text-white p-1 sm:p-1.5 md:p-2 rounded-full"
                size="sm"
              >
                <Settings className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4" />
              </Button>

              {/* Download Button - 우측 상단 */}
              <Button
                onClick={handleDownloadHTML}
                className="absolute top-2 sm:top-3 md:top-4 right-[2.5rem] sm:right-[3rem] md:right-[3.5rem] lg:right-[4rem] z-10 bg-green-600 hover:bg-green-700 text-white p-1 sm:p-1.5 md:p-2 rounded-full"
                size="sm"
                title="HTML 파일 다운로드"
                style={{ marginRight: '5px' }}
              >
                <Download className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4" />
              </Button>

              {/* Map Button - 우측 상단 (매장명이 있을 때만 표시) */}
              <Button
                onClick={handleOpenMap}
                className="absolute top-2 sm:top-3 md:top-4 right-[5rem] sm:right-[5.75rem] md:right-[6.5rem] lg:right-[7.25rem] z-10 bg-blue-600 hover:bg-blue-700 text-white p-1 sm:p-1.5 md:p-2 rounded-full"
                size="sm"
                title="네이버 지도에서 검색"
                style={{ marginRight: '5px' }}
              >
                <MapPin className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4" />
              </Button>
            </>
          )}

          {/* Left Sidebar */}
          <div className={`${isMobile ? 'w-24' : isTablet ? 'w-28' : 'w-20 sm:w-24 md:w-32 lg:w-36'} bg-gray-800 text-white flex flex-col relative`}>
            <div className={`text-center bg-[rgba(34,34,34,1)] ${isMobile ? 'p-1.5' : isTablet ? 'p-1.5' : 'p-2 sm:p-3 md:p-4'}`}>
              <div className={`bg-white text-black rounded-lg sm:rounded-xl font-bold leading-tight text-center tracking-wide ml-px mr-0.5 ${isMobile ? 'text-xs py-1.5 mb-1.5 mt-1.5 px-2' : isTablet ? 'text-sm py-2 mb-2 mt-2 px-2 leading-4' : 'text-sm sm:text-lg md:text-2xl lg:text-3xl py-2 sm:py-3 md:py-4 mb-2 sm:mb-3 md:mb-4 mt-2 sm:mt-3 md:mt-4 leading-4 sm:leading-6 md:leading-8 px-2 sm:px-3 md:px-4'}`}>
                하이
                <br />
                오더
              </div>
              <div className={`text-white font-bold whitespace-pre-wrap text-center leading-tight ${isMobile ? 'mb-2 text-xs' : isTablet ? 'mb-2 text-xs' : 'mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm md:text-lg lg:text-2xl'}`}>{storeName}</div>
            </div>

            <div className="flex-1 px-0 mx-0 tracking-normal leading-7 border-0 bg-[rgba(34,34,34,1)] flex flex-col">
              <div className={`flex items-center ${isMobile ? 'px-1 py-1.5 mx-0.5' : isTablet ? 'px-1.5 py-1.5 mx-0.5' : 'px-2 sm:px-3 md:px-4 py-2 sm:py-3 mx-1 sm:mx-2'} border-l-4 border-cyan-400 rounded-r bg-[rgba(61,61,61,1)]`}>
                <img src="https://cdn-icons-png.flaticon.com/256/192/192732.png" className={`${isMobile ? 'mr-1 w-3 h-3' : isTablet ? 'mr-1 w-3 h-3' : 'mr-1 sm:mr-2 w-3 sm:w-4 md:w-5 lg:w-6 h-3 sm:h-4 md:h-5 lg:h-6'} brightness-0 invert`} alt="메뉴주문" />
                <span className={`${isMobile ? 'text-xs' : isTablet ? 'text-xs' : 'text-xs sm:text-sm md:text-base'} tracking-normal font-extrabold leading-6 sm:leading-8 md:leading-10`} style={{ whiteSpace: 'nowrap' }}>메뉴주문</span>
              </div>
              
              {/* Spacer to push button to bottom */}
              <div className="flex-1"></div>
              
              {/* Circular Call Staff Button */}
              <div className={`${isMobile ? 'pb-2' : isTablet ? 'pb-2' : 'pb-3 sm:pb-4 md:pb-6'} flex justify-center`}>
                <Button className={`bg-cyan-400 hover:bg-cyan-500 font-bold rounded-full shadow-lg text-white tracking-normal ${isMobile ? 'text-xs leading-3 h-10 w-10' : isTablet ? 'text-xs leading-3 h-12 w-12' : 'text-xs sm:text-sm md:text-lg lg:text-xl leading-3 sm:leading-5 md:leading-7 h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24'}`}>
                  직원
                  <br />
                  호출
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header Tabs */}
            <div className="bg-white border-b border-gray-200">
              <div className={`flex ${isMobile ? 'px-1 pt-1' : isTablet ? 'px-2 pt-1' : 'px-2 sm:px-3 md:px-4 lg:px-6 pt-2 sm:pt-3 md:pt-4'}`}>
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`${isMobile ? 'px-2 py-1.5 text-xs mr-1' : isTablet ? 'px-2 py-1.5 text-xs mr-1' : 'px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base lg:text-lg mr-2 sm:mr-4 md:mr-6 lg:mr-8'} font-medium border-b-3 transition-colors ${
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
            <div className={`flex-1 ${isMobile ? 'p-1' : isTablet ? 'p-1.5' : 'p-2 sm:p-3 md:p-4 lg:p-6'} overflow-auto border-0 leading-7 tracking-normal`}>
              <h2 className={`font-medium text-gray-600 ${isMobile ? 'mb-2 text-sm' : isTablet ? 'mb-1.5 text-sm' : 'mb-3 sm:mb-4 md:mb-6 text-sm sm:text-lg md:text-xl lg:text-2xl'}`}>{activeTab}</h2>

              <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2 gap-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6'}`}>
                {filteredFoodItems.map((item) => (
                                      <Card key={item.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={280}
                          height={180}
                          className={`w-full object-cover ${isMobile ? 'h-24' : isTablet ? 'h-24' : 'h-24 sm:h-32 md:h-36 lg:h-44'}`}
                        />
                        {item.badge && (
                          <Badge className="absolute top-1 sm:top-2 md:top-3 right-1 sm:right-2 md:right-3 bg-gray-800 text-white px-1 sm:px-2 py-0.5 sm:py-1 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <CardContent className={`${isMobile ? 'p-2' : isTablet ? 'p-3' : 'p-2 sm:p-3 md:p-4'}`}>
                        <h3 className={`font-medium mb-2 ${isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-sm sm:text-base md:text-lg mb-2 sm:mb-3'}`}>{item.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-sm sm:text-base md:text-lg'}`}>{item.price}</span>
                          <Button
                            onClick={() => handleAddToCart(item)}
                            className={`bg-gray-800 hover:bg-gray-700 text-white font-medium ${isMobile ? 'px-2 py-1 text-xs' : isTablet ? 'px-3 py-1.5 text-sm' : 'px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base'}`}
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
            <div className={`bg-white border-t border-gray-200 ${isMobile ? 'p-1 pb-12' : isTablet ? 'p-1.5 pb-12' : 'p-2 sm:p-3 md:p-4 lg:p-6'} flex items-end justify-end`}>
                              <div className={`flex ${isMobile ? 'gap-1' : isTablet ? 'gap-1.5' : 'gap-2 sm:gap-3 md:gap-4'}`}>
                <Dialog open={showOrderHistory} onOpenChange={setShowOrderHistory}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className={`flex items-center gap-1 sm:gap-2 bg-white border-gray-300 text-gray-600 hover:bg-gray-50 ${isMobile ? 'px-2 py-1.5 text-xs' : isTablet ? 'px-2 py-1.5 text-xs' : 'px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base'}`}
                    >
                      <Menu className={`${isMobile ? 'w-3 h-3' : isTablet ? 'w-3 h-3' : 'w-3 sm:w-4 h-3 sm:h-4'}`} />
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
                    className={`bg-cyan-400 hover:bg-cyan-500 text-black font-bold relative ${isMobile ? 'px-3 py-1.5 text-xs' : isTablet ? 'px-3 py-1.5 text-xs' : 'px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base'}`}
                    disabled={orderItems.length === 0}
                  >
                      주문하기
                      <Badge className={`absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold ${isMobile ? 'w-4 h-4' : isTablet ? 'w-4 h-4' : 'w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6'}`}>
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
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="store">매장 설정</TabsTrigger>
                  <TabsTrigger value="tabs">탭 관리</TabsTrigger>
                  <TabsTrigger value="menu">메뉴 관리</TabsTrigger>
                  <TabsTrigger value="load">불러오기</TabsTrigger>
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
                  <div className="flex flex-col gap-2 pt-4">
                    <div className="flex gap-2">
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
                    <Button
                      onClick={handleSaveCurrentState}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          저장 중...
                        </>
                      ) : (
                        "현재 상태를 메뉴판으로 저장"
                      )}
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

                <TabsContent value="load" className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">저장된 메뉴판 불러오기</h3>
                    <div className="text-sm text-gray-600">
                      총 {savedMenuBoards.length}개
                    </div>
                  </div>
                  
                  {/* 로딩 상태 */}
                  {isLoading && (
                    <div className="text-center py-4 text-gray-500">
                      <div className="animate-spin w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                      불러오는 중...
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="searchQuery" className="text-sm font-medium">
                      검색
                    </Label>
                    <Input
                      id="searchQuery"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="매장명, 주소로 검색..."
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredSavedBoards.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {savedMenuBoards.length === 0 
                          ? "저장된 메뉴판이 없습니다."
                          : "검색 결과가 없습니다."
                        }
                      </div>
                    ) : (
                      filteredSavedBoards.map((board) => (
                        <Card key={board.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-lg mb-1">{board.name}</h4>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div>매장명: {board.store_name || board.storeName}</div>
                                {(board.store_address || board.storeAddress) && 
                                  <div>주소: {board.store_address || board.storeAddress}</div>
                                }
                                <div>탭: {board.tabs?.join(', ')}</div>
                                <div>메뉴: {(board.food_items || board.foodItems)?.length || 0}개</div>
                                <div>저장일: {new Date(board.created_at || board.savedAt).toLocaleString('ko-KR')}</div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 ml-4">
                              <Button
                                onClick={() => handleLoadMenuBoard(board)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                              >
                                불러오기
                              </Button>
                              <Button
                                onClick={() => {
                                  if (confirm('정말 삭제하시겠습니까?')) {
                                    handleDeleteMenuBoard(board.id)
                                  }
                                }}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:bg-red-50"
                              >
                                삭제
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
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
