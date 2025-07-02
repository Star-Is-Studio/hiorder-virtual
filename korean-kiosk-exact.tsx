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
import { ConciergeBellIcon, Menu, X, Settings, Plus, Edit, Trash2, MapPin, Download, RefreshCw } from "lucide-react"
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
  description?: string // 메뉴 설명 추가
  badge?: string
}

interface ComponentProps {
  initialStoreName?: string
}

export default function Component({ initialStoreName }: ComponentProps = {}) {
  const [activeTab, setActiveTab] = useState("메인메뉴")
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [showOrderHistory, setShowOrderHistory] = useState(false)
  const [showOrderConfirm, setShowOrderConfirm] = useState(false)
  const [showStoreSettings, setShowStoreSettings] = useState(false)
  const [storeName, setStoreName] = useState(initialStoreName || "식당명")
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
      category: "메인메뉴",
      description: "맛있는 메뉴입니다"
    }
  ])
  const [editingMenu, setEditingMenu] = useState<FoodItem | null>(null)
  const [showMenuEdit, setShowMenuEdit] = useState(false)
  const [tempMenuName, setTempMenuName] = useState("")
  const [tempMenuPrice, setTempMenuPrice] = useState("")
  const [tempMenuImage, setTempMenuImage] = useState("")
  const [tempMenuCategory, setTempMenuCategory] = useState("")
  const [tempMenuDescription, setTempMenuDescription] = useState("")
  
  // 메뉴 상세 팝업 상태
  const [showMenuDetail, setShowMenuDetail] = useState(false)
  const [selectedMenuItem, setSelectedMenuItem] = useState<FoodItem | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)
  
  // 저장/불러오기 관련 상태
  const [savedMenuBoards, setSavedMenuBoards] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importPlaceId, setImportPlaceId] = useState("")
  const [isImporting, setIsImporting] = useState(false)

  // 매장명 길이에 따른 글씨 크기 계산 함수 추가
  const getStoreNameFontSize = () => {
    const nameLength = storeName.length
    if (isMobile && !isLandscape) {
      if (nameLength > 15) return 'text-xs'
      if (nameLength > 10) return 'text-xs'
      return 'text-xs'
    } else if (isMobile && isLandscape) {
      if (nameLength > 15) return 'text-xs'
      if (nameLength > 10) return 'text-xs'
      return 'text-xs'
    } else if (isTablet) {
      if (nameLength > 15) return 'text-xs'
      if (nameLength > 10) return 'text-xs'
      return 'text-xs'
    } else {
      if (nameLength > 20) return 'text-xs'
      if (nameLength > 15) return 'text-sm'
      if (nameLength > 10) return 'text-base'
      return 'text-xs sm:text-sm md:text-lg lg:text-2xl'
    }
  }

  // 메뉴 이름 길이에 따른 글씨 크기 계산 함수 추가
  const getMenuNameFontSize = (name: string) => {
    const nameLength = name.length;
    
    // 모바일 세로모드
    if (isMobile && !isLandscape) {
      if (nameLength > 20) return 'text-sm leading-snug';
      if (nameLength > 15) return 'text-sm leading-normal';
      if (nameLength > 10) return 'text-base leading-normal';
      return 'text-base leading-relaxed';
    } 
    // 모바일 가로모드
    else if (isMobile && isLandscape) {
      if (nameLength > 18) return 'text-sm leading-snug';
      if (nameLength > 13) return 'text-sm leading-normal';
      if (nameLength > 8) return 'text-base leading-normal';
      return 'text-base leading-relaxed';
    } 
    // 태블릿
    else if (isTablet) {
      if (nameLength > 25) return 'text-base leading-snug';
      if (nameLength > 20) return 'text-base leading-normal';
      if (nameLength > 15) return 'text-lg leading-normal';
      return 'text-lg leading-relaxed';
    } 
    // 데스크톱
    else {
      if (nameLength > 22) return 'text-sm leading-snug';
      if (nameLength > 17) return 'text-base leading-normal';
      if (nameLength > 12) return 'text-base leading-relaxed';
      return 'text-lg leading-relaxed';
    }
  };

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ua = navigator.userAgent.toLowerCase();
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      const isMobileUA = /iphone|ipod|android.*mobile|windows phone/.test(ua);
      const isTabletUA = /ipad|android(?!.*mobile)|tablet/.test(ua);

      const isMobile = isMobileUA || (width < 768 && isTouchDevice);
      const isTablet = isTabletUA || (width >= 768 && width <= 1400 && isTouchDevice);
      const isLandscape = width > height;

      setIsMobile(isMobile);
      setIsTablet(isTablet);
      setIsLandscape(isLandscape);
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

  const handleShowMenuDetail = (item: FoodItem) => {
    setSelectedMenuItem(item)
    setShowMenuDetail(true)
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
    setShowMenuDetail(false) // 팝업에서 담기 후 팝업 닫기
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
    setTempMenuPrice(menu.priceNumber ? menu.priceNumber.toString() : '0')
    setTempMenuImage(menu.image)
    setTempMenuCategory(menu.category)
    setTempMenuDescription(menu.description || "")
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
      category: tempMenuCategory || tabs[0],
      description: tempMenuDescription || ""
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
    setTempMenuDescription("")
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
    setShowImportModal(true)
  }

  const handleImportMenu = async () => {
    if (!importPlaceId) {
      alert('매장 ID를 입력해주세요.');
      return;
    }

    setIsImporting(true);
    try {
      const response = await fetch('/api/naver-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ placeId: importPlaceId }),
      });

      if (!response.ok) {
        throw new Error('메뉴 정보를 가져오는데 실패했습니다.');
      }

      const data = await response.json();
      
      // 새로운 메뉴 추가 (메인메뉴 탭에 추가)
      const newMenus = data.items.map((item: FoodItem) => {
        // 가격에서 숫자만 추출
        const priceNumber = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
        return {
          ...item,
          id: Math.max(...foodItems.map((item: FoodItem) => item.id), 0) + 1 + data.items.indexOf(item),
          category: "메인메뉴", // 메인메뉴 탭에 강제로 추가
          price: `${priceNumber.toLocaleString()}원`,
          priceNumber: priceNumber
        };
      });

      setFoodItems(prev => [...prev, ...newMenus]);
      setShowImportModal(false);
      setImportPlaceId("");
      alert(`${newMenus.length}개의 메뉴를 메인메뉴 탭에 추가했습니다!`);
    } catch (error) {
      console.error('Error:', error);
      alert('메뉴 정보를 가져오는데 실패했습니다. 올바른 매장 ID인지 확인해주세요.');
    } finally {
      setIsImporting(false);
    }
  }

  // 현재 상태 저장
  const handleSaveCurrentState = async () => {
    setIsLoading(true);
    try {
      const boardName = `${storeName} ${storeAddress}`.trim() || '이름없는 메뉴판';
      
      // Supabase에 저장
      const menuBoard: MenuBoard = {
        name: boardName,
        store_name: storeName,
        store_address: storeAddress,
        tabs,
        food_items: foodItems
      };
      
      // 같은 이름이 있는지 확인
      const { data: existing } = await supabase
        .from('menu_boards')
        .select('id')
        .eq('name', boardName)
        .single();
      
      if (existing) {
        // 업데이트
        const { error } = await supabase
          .from('menu_boards')
          .update(menuBoard)
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        // 새로 추가
        const { error } = await supabase
          .from('menu_boards')
          .insert([menuBoard]);
        
        if (error) throw error;
      }
      
      await loadSavedMenuBoards();
      alert('메뉴판이 저장되었습니다!');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
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

  // 메뉴판 초기화 함수 추가
  const handleResetMenu = () => {
    if (confirm('메뉴판을 초기 상태로 되돌리시겠습니까?')) {
      setFoodItems([{
        id: 1,
        name: "메뉴",
        price: "0원",
        priceNumber: 0,
        image: "/placeholder.svg?height=180&width=280",
        category: "메인메뉴",
        description: "맛있는 메뉴입니다"
      }]);
      setActiveTab("메인메뉴");
      setTabs(["메인메뉴", "사이드", "음료"]);
    }
  };

  return (
    <div className={`w-full h-screen bg-gray-200 flex items-center justify-center overflow-hidden ${isMobile || isTablet ? 'p-0' : 'p-1 sm:p-4 md:p-8 lg:p-[10%]'}`}>
      <div
        className={`bg-gray-800 shadow-2xl ${isMobile || isTablet ? 'rounded-lg p-1 sm:p-2' : 'rounded-lg sm:rounded-2xl md:rounded-3xl p-1 sm:p-3 md:p-4 lg:p-6'}`}
        style={{ 
          aspectRatio: isMobile && !isLandscape ? "9/16" : isMobile && isLandscape ? "16/9" : isTablet ? "16/10" : "4/3", 
          width: isMobile && !isLandscape ? "100vw" : isMobile && isLandscape ? "100vw" : isTablet ? "100vw" : "100%",
          height: isMobile && !isLandscape ? "100vh" : isMobile && isLandscape ? "100vh" : isTablet ? "100vh" : "90vh",
          maxWidth: isMobile ? "none" : isTablet ? "none" : "min(90vw, 90vh * 4/3)",
          maxHeight: isMobile && !isLandscape ? "100vh" : isMobile && isLandscape ? "100vh" : isTablet ? "100vh" : "90vh",
          minHeight: isMobile && !isLandscape ? "100vh" : isMobile && isLandscape ? "100vh" : isTablet ? "100vh" : "90vh"
        }}
      >
        <div className={`w-full h-full bg-white overflow-hidden flex relative ${isMobile || isTablet ? 'rounded-lg' : 'rounded-2xl'}`}>
          {/* 모든 화면에서 상단에 배치 */}
          {/* Settings Button - 우측 상단 */}
          <Button
            onClick={handleStoreSettingsOpen}
            className={`absolute z-10 bg-gray-600 hover:bg-gray-700 text-white rounded-full ${
              isMobile && !isLandscape ? 'top-3 right-3 p-2' :
              isMobile && isLandscape ? 'top-2 right-2 p-1.5' :
              isTablet ? 'top-3 right-3 p-2' :
              'top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 p-1 sm:p-1.5 md:p-2'
            }`}
            size="sm"
          >
            <Settings className={`${
              isMobile && !isLandscape ? 'w-5 h-5' :
              isMobile && isLandscape ? 'w-4 h-4' :
              isTablet ? 'w-6 h-6' :
              'w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6'
            }`} />
          </Button>

          {/* Download Button - 우측 상단 */}
          <Button
            onClick={handleDownloadHTML}
            className={`absolute z-10 bg-green-600 hover:bg-green-700 text-white rounded-full ${
              isMobile && !isLandscape ? 'top-3 right-[3.5rem] p-2' :
              isMobile && isLandscape ? 'top-2 right-[2.75rem] p-1.5' :
              isTablet ? 'top-3 right-[3.5rem] p-2' :
              'top-2 sm:top-3 md:top-4 right-[2.5rem] sm:right-[3rem] md:right-[3.5rem] lg:right-[4rem] p-1 sm:p-1.5 md:p-2'
            }`}
            size="sm"
            title="HTML 파일 다운로드"
            style={{ marginRight: isMobile || isTablet ? '0px' : '5px' }}
          >
            <Download className={`${
              isMobile && !isLandscape ? 'w-5 h-5' :
              isMobile && isLandscape ? 'w-4 h-4' :
              isTablet ? 'w-6 h-6' :
              'w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6'
            }`} />
          </Button>

          {/* Reset Button - 우측 상단 */}
          <Button
            onClick={handleResetMenu}
            className={`absolute z-10 bg-yellow-600 hover:bg-yellow-700 text-white rounded-full ${
              isMobile && !isLandscape ? 'top-3 right-[8.5rem] p-2' :
              isMobile && isLandscape ? 'top-2 right-[7.25rem] p-1.5' :
              isTablet ? 'top-3 right-[8.5rem] p-2' :
              'top-2 sm:top-3 md:top-4 right-[7.5rem] sm:right-[8.5rem] md:right-[9.5rem] lg:right-[10.5rem] p-1 sm:p-1.5 md:p-2'
            }`}
            size="sm"
            title="메뉴판 초기화"
            style={{ marginRight: isMobile || isTablet ? '0px' : '5px' }}
          >
            <RefreshCw className={`${
              isMobile && !isLandscape ? 'w-5 h-5' :
              isMobile && isLandscape ? 'w-4 h-4' :
              isTablet ? 'w-6 h-6' :
              'w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6'
            }`} />
          </Button>

          {/* Map Button - 우측 상단 */}
          <Button
            onClick={handleOpenMap}
            className={`absolute z-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full ${
              isMobile && !isLandscape ? 'top-3 right-[6rem] p-2' :
              isMobile && isLandscape ? 'top-2 right-[5rem] p-1.5' :
              isTablet ? 'top-3 right-[6rem] p-2' :
              'top-2 sm:top-3 md:top-4 right-[5rem] sm:right-[5.75rem] md:right-[6.5rem] lg:right-[7.25rem] p-1 sm:p-1.5 md:p-2'
            }`}
            size="sm"
            title="네이버 지도에서 검색"
            style={{ marginRight: isMobile || isTablet ? '0px' : '5px' }}
          >
            <MapPin className={`${
              isMobile && !isLandscape ? 'w-5 h-5' :
              isMobile && isLandscape ? 'w-4 h-4' :
              isTablet ? 'w-6 h-6' :
              'w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6'
            }`} />
          </Button>

          {/* Left Sidebar */}
          <div className={`${isMobile && !isLandscape ? 'w-40' : isMobile && isLandscape ? 'w-36' : isTablet ? 'w-44' : 'w-24 sm:w-32 md:w-40 lg:w-44'} bg-gray-800 text-white flex flex-col relative`}>
            <div className={`text-center bg-[rgba(34,34,34,1)] ${isMobile && !isLandscape ? 'p-3' : isMobile && isLandscape ? 'p-2' : isTablet ? 'p-3' : 'p-2 sm:p-3 md:p-4'}`}>
              <div className={`bg-white text-black rounded-lg sm:rounded-xl font-bold leading-tight text-center tracking-wide aspect-square flex items-center justify-center ${isMobile && !isLandscape ? 'text-3xl p-3 m-1' : isMobile && isLandscape ? 'text-2xl p-2 m-1' : isTablet ? 'text-4xl p-3 m-1' : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl p-2 sm:p-3 md:p-4 m-1'}`}>
                하이
                <br />
                오더
              </div>
            </div>

            <div className="flex-1 px-0 mx-0 tracking-normal leading-7 border-0 bg-[rgba(34,34,34,1)] flex flex-col">
              {/* 식당명 */}
              <div className={`text-white font-bold whitespace-pre-wrap text-center leading-tight ${isMobile && !isLandscape ? 'mt-4 mb-4 text-lg px-3' : isMobile && isLandscape ? 'mt-3 mb-3 text-base px-2' : isTablet ? 'mt-4 mb-4 text-xl px-3' : 'mt-4 mb-4 text-base sm:text-lg md:text-xl lg:text-2xl px-2 sm:px-3 md:px-4'}`}>{storeName}</div>
              
              <div className={`flex items-center justify-center ${isMobile && !isLandscape ? 'px-3 py-3 mx-1' : isMobile && isLandscape ? 'px-2 py-2 mx-1' : isTablet ? 'px-3 py-3 mx-1' : 'px-2 sm:px-3 md:px-4 py-2 sm:py-3 mx-1 sm:mx-2'} border-l-4 border-cyan-400 rounded-r bg-[rgba(61,61,61,1)]`}>
                <img src="https://cdn-icons-png.flaticon.com/256/192/192732.png" className={`${isMobile && !isLandscape ? 'mr-2 w-5 h-5' : isMobile && isLandscape ? 'mr-1 w-4 h-4' : isTablet ? 'mr-2 w-5 h-5' : 'mr-1 sm:mr-2 w-3 sm:w-4 md:w-5 lg:w-6 h-3 sm:h-4 md:h-5 lg:h-6'} brightness-0 invert`} alt="메뉴주문" />
                <span className={`${isMobile && !isLandscape ? 'text-sm' : isMobile && isLandscape ? 'text-xs' : isTablet ? 'text-base' : 'text-xs sm:text-sm md:text-base'} tracking-normal font-extrabold leading-6 sm:leading-8 md:leading-10`} style={{ whiteSpace: 'nowrap' }}>메뉴주문</span>
              </div>
              
              {/* Spacer to push button to bottom */}
              <div className="flex-1"></div>
              
              {/* Circular Call Staff Button */}
              <div className={`${isMobile && !isLandscape ? 'pb-4' : isMobile && isLandscape ? 'pb-3' : isTablet ? 'pb-4' : 'pb-3 sm:pb-4 md:pb-6'} flex justify-center`}>
                <Button className={`bg-cyan-400 hover:bg-cyan-500 font-bold rounded-full shadow-lg text-white tracking-normal ${isMobile && !isLandscape ? 'text-sm leading-4 h-16 w-16' : isMobile && isLandscape ? 'text-xs leading-3 h-12 w-12' : isTablet ? 'text-base leading-5 h-20 w-20' : 'text-xs sm:text-sm md:text-lg lg:text-xl leading-3 sm:leading-5 md:leading-7 h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24'}`}>
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
            <div className="bg-transparent border-b border-gray-200">
              <div className={`flex ${isMobile && !isLandscape ? 'px-4 pt-4' : isMobile && isLandscape ? 'px-3 pt-2' : isTablet ? 'px-4 pt-4' : 'px-2 sm:px-3 md:px-4 lg:px-6 pt-2 sm:pt-3 md:pt-4'}`}>
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`${isMobile && !isLandscape ? 'px-4 py-3 text-base mr-4' : isMobile && isLandscape ? 'px-3 py-2 text-sm mr-3' : isTablet ? 'px-4 py-3 text-lg mr-6' : 'px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base lg:text-lg mr-2 sm:mr-4 md:mr-6 lg:mr-8'} font-bold border-b-4 transition-colors bg-transparent ${
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
            <div className={`flex-1 ${isMobile && !isLandscape ? 'p-4' : isMobile && isLandscape ? 'p-3' : isTablet ? 'p-4' : 'p-2 sm:p-3 md:p-4 lg:p-6'} flex flex-col border-0 leading-7 tracking-normal overflow-hidden`}>
              <h2 className={`font-bold text-gray-600 ${isMobile && !isLandscape ? 'mb-4 text-xl' : isMobile && isLandscape ? 'mb-3 text-lg' : isTablet ? 'mb-4 text-2xl' : 'mb-3 sm:mb-4 md:mb-6 text-sm sm:text-lg md:text-xl lg:text-2xl'}`}>{activeTab}</h2>

              <div className={`flex-1 overflow-y-auto`} style={{ 
                maxHeight: isMobile && !isLandscape 
                  ? 'calc(100vh - 125px)' // 모바일 세로: 메뉴 카드가 커진만큼 더 넓게
                  : isMobile && isLandscape 
                  ? 'calc(100vh - 95px)' // 모바일 가로: 더 넓게
                  : isTablet 
                  ? 'calc(100vh - 130px)' // 태블릿: 더 넓게
                  : 'calc(100vh - 195px)' // 데스크톱: 약간 더 넓게
              }}>
                <div className={`grid ${isMobile && !isLandscape ? 'grid-cols-3 gap-3' : isMobile && isLandscape ? 'grid-cols-3 gap-3' : isTablet ? 'grid-cols-3 gap-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6'}`}>
                  {filteredFoodItems.map((item) => (
                    <Card key={item.id} className={`overflow-hidden shadow-md hover:shadow-lg transition-shadow ${isMobile && !isLandscape ? 'h-64' : isMobile && isLandscape ? 'h-48' : isTablet ? 'h-72' : 'h-56 sm:h-60 md:h-64 lg:h-72'}`}>
                      <div className="relative h-3/5">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={280}
                          height={180}
                          className="w-full h-full object-cover"
                          style={{ objectPosition: 'center 50%', objectFit: 'cover' }}
                        />
                        {item.badge && (
                          <Badge className="absolute top-1 sm:top-2 md:top-3 right-1 sm:right-2 md:right-3 bg-gray-800 text-white px-1 sm:px-2 py-0.5 sm:py-1 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <CardContent className="h-2/5 flex flex-col justify-between p-2 sm:p-3">
                        <h3 className={`font-medium ${getMenuNameFontSize(item.name)} text-gray-900 break-keep line-clamp-2`}>
                          {item.name}
                        </h3>
                        <div className="flex items-center justify-between mt-auto">
                          <span className={`font-bold ${isMobile && !isLandscape ? 'text-base' : isMobile && isLandscape ? 'text-base' : isTablet ? 'text-base' : 'text-base sm:text-base md:text-lg'}`}>{item.price}</span>
                          <Button
                            onClick={() => handleShowMenuDetail(item)}
                            className={`bg-gray-800 hover:bg-gray-700 text-white font-medium ${isMobile && !isLandscape ? 'px-3 py-1.5 text-sm' : isMobile && isLandscape ? 'px-3 py-1 text-sm' : isTablet ? 'px-4 py-2 text-base' : 'px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base'}`}
                          >
                            담기
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

                        {/* Bottom Action Bar */}
            <div className={`bg-white border-t border-gray-200 ${isMobile && !isLandscape ? 'p-3 pb-4' : isMobile && isLandscape ? 'p-2 pb-3' : isTablet ? 'p-3 pb-4' : 'p-2 sm:p-3 md:p-4 lg:p-6'} flex items-end justify-end mt-auto`}>
              <div className={`flex ${isMobile && !isLandscape ? 'gap-4' : isMobile && isLandscape ? 'gap-3' : isTablet ? 'gap-4' : 'gap-2 sm:gap-3 md:gap-4'}`}>
                <Dialog open={showOrderHistory} onOpenChange={setShowOrderHistory}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className={`flex items-center gap-1 sm:gap-2 bg-white border-gray-300 text-gray-600 hover:bg-gray-50 ${isMobile && !isLandscape ? 'px-3 py-2.5 text-sm' : isMobile && isLandscape ? 'px-3 py-2 text-sm' : isTablet ? 'px-3 py-2.5 text-sm' : 'px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base'}`}
                    >
                      <Menu className={`${isMobile && !isLandscape ? 'w-3.5 h-3.5' : isMobile && isLandscape ? 'w-3.5 h-3.5' : isTablet ? 'w-3.5 h-3.5' : 'w-3 sm:w-4 h-3 sm:h-4'}`} />
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
                    className={`bg-cyan-400 hover:bg-cyan-500 text-black font-bold relative ${isMobile && !isLandscape ? 'px-4 py-2.5 text-base' : isMobile && isLandscape ? 'px-3 py-2 text-sm' : isTablet ? 'px-4 py-2.5 text-base' : 'px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base'}`}
                    disabled={orderItems.length === 0}
                  >
                    주문하기
                    <Badge className={`absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold ${isMobile && !isLandscape ? 'w-5 h-5 text-xs' : isMobile && isLandscape ? 'w-4 h-4 text-xs' : isTablet ? 'w-5 h-5 text-xs' : 'w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-xs'}`}>
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

          {/* Menu Detail Dialog */}
          <Dialog open={showMenuDetail} onOpenChange={setShowMenuDetail}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">{selectedMenuItem?.name}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                {selectedMenuItem && (
                  <div className="space-y-4">
                    <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={selectedMenuItem.image}
                        alt={selectedMenuItem.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold">{selectedMenuItem.name}</h3>
                      <p className="text-gray-600">{selectedMenuItem.description || "맛있는 메뉴입니다."}</p>
                      <div className="text-2xl font-bold text-gray-900">{selectedMenuItem.price}</div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowMenuDetail(false)}
                        className="flex-1"
                      >
                        취소
                      </Button>
                      <Button
                        onClick={() => handleAddToCart(selectedMenuItem)}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white"
                      >
                        담기
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

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
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-600">
                        총 {savedMenuBoards.length}개
                      </div>
                      <Button
                        onClick={loadSavedMenuBoards}
                        variant="outline"
                        size="sm"
                        disabled={isLoading}
                        className="text-gray-600 hover:bg-gray-50"
                      >
                        {isLoading ? (
                          <div className="animate-spin w-3 h-3 border border-gray-400 border-t-transparent rounded-full"></div>
                        ) : (
                          "새로고침"
                        )}
                      </Button>
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
                <div className="space-y-2">
                  <Label htmlFor="menuDescription" className="text-sm font-medium">
                    메뉴 설명
                  </Label>
                  <Textarea
                    id="menuDescription"
                    value={tempMenuDescription}
                    onChange={(e) => setTempMenuDescription(e.target.value)}
                    placeholder="메뉴 설명을 입력하세요"
                    className="w-full resize-none"
                    rows={3}
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

          {/* 네이버 메뉴 불러오기 모달 */}
          <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">네이버 메뉴 불러오기</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="placeId" className="text-sm font-medium">
                    네이버 플레이스 매장 ID
                  </Label>
                  <Input
                    id="placeId"
                    value={importPlaceId}
                    onChange={(e) => setImportPlaceId(e.target.value)}
                    placeholder="예: 1234567890"
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500">
                    매장 URL의 "restaurant/" 다음에 오는 숫자를 입력해주세요.<br/>
                    예시: https://pcmap.place.naver.com/restaurant/1234567890/menu/list
                  </p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowImportModal(false);
                      setImportPlaceId("");
                    }}
                    className="flex-1"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleImportMenu}
                    className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-black"
                    disabled={isImporting}
                  >
                    {isImporting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full mr-2"></div>
                        불러오는 중...
                      </>
                    ) : (
                      "메뉴 불러오기"
                    )}
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
