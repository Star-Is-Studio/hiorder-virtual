"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase, MenuBoard } from "@/lib/supabase"
import { FoodItem, OrderItem } from '@/types/kiosk'

interface KioskContextType {
  // State
  activeTab: string
  orderItems: OrderItem[]
  showOrderHistory: boolean
  showOrderConfirm: boolean
  showStoreSettings: boolean
  storeName: string
  storeAddress: string
  tabs: string[]
  tempTabs: string[]
  foodItems: FoodItem[]
  editingMenu: FoodItem | null
  showMenuEdit: boolean
  tempMenuName: string
  tempMenuPrice: string
  tempMenuImage: string
  tempMenuCategory: string
  tempMenuDescription: string
  showMenuDetail: boolean
  selectedMenuItem: FoodItem | null
  isMobile: boolean
  isTablet: boolean
  isLandscape: boolean
  savedMenuBoards: any[]
  searchQuery: string
  isLoading: boolean
  showImportModal: boolean
  importPlaceId: string
  isImporting: boolean
  isToggled: boolean
  tempStoreName: string
  tempStoreAddress: string
  alternativeLayoutCols: number

  // State Setters
  setActiveTab: (tab: string) => void
  setOrderItems: (items: OrderItem[] | ((prev: OrderItem[]) => OrderItem[])) => void
  setShowOrderHistory: (show: boolean) => void
  setShowOrderConfirm: (show: boolean) => void
  setShowStoreSettings: (show: boolean) => void
  setStoreName: (name: string) => void
  setStoreAddress: (address: string) => void
  setTabs: (tabs: string[]) => void
  setTempTabs: (tabs: string[] | ((prev: string[]) => string[])) => void
  setFoodItems: (items: FoodItem[] | ((prev: FoodItem[]) => FoodItem[])) => void
  setEditingMenu: (menu: FoodItem | null) => void
  setShowMenuEdit: (show: boolean) => void
  setTempMenuName: (name: string) => void
  setTempMenuPrice: (price: string) => void
  setTempMenuImage: (url: string) => void
  setTempMenuCategory: (category: string) => void
  setTempMenuDescription: (desc: string) => void
  setShowMenuDetail: (show: boolean) => void
  setSelectedMenuItem: (item: FoodItem | null) => void
  setSearchQuery: (query: string) => void
  setShowImportModal: (show: boolean) => void
  setImportPlaceId: (id: string) => void
  setIsToggled: (toggled: boolean) => void
  setTempStoreName: (name: string) => void
  setTempStoreAddress: (address: string) => void
  setAlternativeLayoutCols: (cols: number) => void
  
  // Handlers & Derived State
  loadSavedMenuBoards: () => Promise<void>
  filteredFoodItems: FoodItem[]
  getCartCount: () => number
  handleShowMenuDetail: (item: FoodItem) => void
  handleAddToCart: (item: FoodItem) => void
  handleRemoveFromCart: (itemId: number) => void
  getTotalPrice: () => number
  handleOrderConfirm: () => void
  handleStoreSettingsOpen: () => void
  handleStoreSettingsSave: () => void
  handleStoreSettingsCancel: () => void
  handleAddTab: () => void
  handleEditTab: (index: number, newName: string) => void
  handleDeleteTab: (index: number) => void
  handleAddMenu: () => void
  handleEditMenu: (menu: FoodItem) => void
  handleDeleteMenu: (menuId: number) => void
  handleMenuEditSave: () => void
  handleMenuEditCancel: () => void
  handleOpenMap: () => void
  handleDownloadHTML: () => void
  handleImportMenu: () => Promise<void>
  handleSaveCurrentState: () => Promise<void>
  handleLoadMenuBoard: (boardData: any) => void
  handleDeleteMenuBoard: (boardId: number) => Promise<void>
  filteredSavedBoards: any[]
  handleResetMenu: () => void
  handleToggle: (checked: boolean) => void
  getStoreNameFontSize: () => string
  getMenuNameFontSize: (name: string) => string
}

const KioskContext = createContext<KioskContextType | undefined>(undefined)

export const KioskProvider = ({ children, initialStoreName }: { children: ReactNode, initialStoreName?: string }) => {
  const [activeTab, setActiveTab] = useState("메인메뉴")
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [showOrderHistory, setShowOrderHistory] = useState(false)
  const [showOrderConfirm, setShowOrderConfirm] = useState(false)
  const [showStoreSettings, setShowStoreSettings] = useState(false)
  const [storeName, setStoreName] = useState(initialStoreName || "식당명")
  const [storeAddress, setStoreAddress] = useState("")
  const [tempStoreName, setTempStoreName] = useState("")
  const [tempStoreAddress, setTempStoreAddress] = useState("")
  
  const [tabs, setTabs] = useState<string[]>(["메인메뉴", "사이드", "음료"])
  const [tempTabs, setTempTabs] = useState<string[]>([])
  
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
  
  const [showMenuDetail, setShowMenuDetail] = useState(false)
  const [selectedMenuItem, setSelectedMenuItem] = useState<FoodItem | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)
  
  const [savedMenuBoards, setSavedMenuBoards] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importPlaceId, setImportPlaceId] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [isToggled, setIsToggled] = useState(false)
  const [alternativeLayoutCols, setAlternativeLayoutCols] = useState(3)

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

  const getMenuNameFontSize = (name: string) => {
    const nameLength = name.length;
    if (isMobile && !isLandscape) {
      if (nameLength > 20) return 'text-sm leading-snug';
      if (nameLength > 15) return 'text-sm leading-normal';
      if (nameLength > 10) return 'text-base leading-normal';
      return 'text-base leading-relaxed';
    } 
    else if (isMobile && isLandscape) {
      if (nameLength > 18) return 'text-sm leading-snug';
      if (nameLength > 13) return 'text-sm leading-normal';
      if (nameLength > 8) return 'text-base leading-normal';
      return 'text-base leading-relaxed';
    } 
    else if (isTablet) {
      if (nameLength > 25) return 'text-base leading-snug';
      if (nameLength > 20) return 'text-base leading-normal';
      if (nameLength > 15) return 'text-lg leading-normal';
      return 'text-lg leading-relaxed';
    } 
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

  useEffect(() => {
    loadSavedMenuBoards()
  }, [])

  const loadSavedMenuBoards = async () => {
    setIsLoading(true)
    try {
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

  const filteredFoodItems = foodItems.filter(item => item.category === activeTab)

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
    setShowMenuDetail(false)
  }

  const handleRemoveFromCart = (itemId: number) => {
    setOrderItems((prev) => {
      const item = prev.find(orderItem => orderItem.id === itemId)
      if (!item) return prev
      
      if (item.quantity > 1) {
        return prev.map(orderItem =>
          orderItem.id === itemId
            ? { ...orderItem, quantity: orderItem.quantity - 1 }
            : orderItem
        )
      } else {
        return prev.filter(orderItem => orderItem.id !== itemId)
      }
    })
  }

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + (item.priceNumber * item.quantity), 0)
  }

  const handleOrderConfirm = () => {
    setShowOrderConfirm(false)
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
    
    if (tempTabs.length > 0) {
      setFoodItems(prev => 
        prev.map(item => 
          tempTabs.includes(item.category) ? item : { ...item, category: tempTabs[0] }
        )
      )
      
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

  const handleOpenMap = () => {
    if (!storeName || storeName === "식당명" || storeName.trim() === "") {
      alert("식당명을 입력해주세요")
      return
    }
    const searchQuery = encodeURIComponent(storeName.replace(/\n/g, ' ').trim())
    const mapUrl = `https://m.map.naver.com/search?query=${searchQuery},${storeAddress}`
    window.open(mapUrl, '_blank')
  }

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
      
      const newMenus = data.items.map((item: FoodItem) => {
        const priceNumber = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
        return {
          ...item,
          id: Math.max(...foodItems.map((item: FoodItem) => item.id), 0) + 1 + data.items.indexOf(item),
          category: "메인메뉴",
          price: `${priceNumber.toLocaleString()}원`,
          priceNumber: priceNumber
        };
      });

      setFoodItems(prev => {
        const nonDefaultMenus = prev.filter(item => 
          !(item.priceNumber === 0 && item.name === "메뉴")
        );
        return [...nonDefaultMenus, ...newMenus];
      });
      
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

  const handleSaveCurrentState = async () => {
    setIsLoading(true);
    try {
      const boardName = `${storeName} ${storeAddress}`.trim() || '이름없는 메뉴판';
      
      const menuBoard: MenuBoard = {
        name: boardName,
        store_name: storeName,
        store_address: storeAddress,
        tabs,
        food_items: foodItems
      };
      
      const { data: existing } = await supabase
        .from('menu_boards')
        .select('id')
        .eq('name', boardName)
        .single();
      
      if (existing) {
        const { error } = await supabase
          .from('menu_boards')
          .update(menuBoard)
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
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

  const handleLoadMenuBoard = (boardData: any) => {
    try {
      const storeName = boardData.store_name || boardData.storeName || '식당명'
      const storeAddress = boardData.store_address || boardData.storeAddress || ''
      const tabs = boardData.tabs || ['메인메뉴']
      const foodItems = boardData.food_items || boardData.foodItems || []
      
      setStoreName(storeName)
      setStoreAddress(storeAddress)
      setTabs(tabs)
      setFoodItems(foodItems)
      setActiveTab(tabs[0] || '메인메뉴')
      
      setTempStoreName(storeName)
      setTempStoreAddress(storeAddress)
      
      setShowStoreSettings(false)
      alert('메뉴판을 불러왔습니다!')
    } catch (error) {
      console.error('불러오기 실패:', error)
      alert('불러오기에 실패했습니다: ' + (error as Error).message)
    }
  }

  const handleDeleteMenuBoard = async (boardId: number) => {
    setIsLoading(true)
    try {
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

  const filteredSavedBoards = savedMenuBoards.filter(board => {
    const name = board.name || ''
    const storeName = board.store_name || board.storeName || ''
    const storeAddress = board.store_address || board.storeAddress || ''
    
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           storeAddress.toLowerCase().includes(searchQuery.toLowerCase())
  })

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

  const handleToggle = (checked: boolean) => {
    setIsToggled(checked)
  }

  const value = {
    activeTab, orderItems, showOrderHistory, showOrderConfirm, showStoreSettings, storeName, storeAddress,
    tabs, tempTabs, foodItems, editingMenu, showMenuEdit, tempMenuName, tempMenuPrice, tempMenuImage,
    tempMenuCategory, tempMenuDescription, showMenuDetail, selectedMenuItem, isMobile, isTablet, isLandscape,
    savedMenuBoards, searchQuery, isLoading, showImportModal, importPlaceId, isImporting, isToggled,
    tempStoreName, tempStoreAddress, alternativeLayoutCols,
    setActiveTab, setOrderItems, setShowOrderHistory, setShowOrderConfirm, setShowStoreSettings, setStoreName,
    setStoreAddress, setTabs, setTempTabs, setFoodItems, setEditingMenu, setShowMenuEdit, setTempMenuName,
    setTempMenuPrice, setTempMenuImage, setTempMenuCategory, setTempMenuDescription, setShowMenuDetail,
    setSelectedMenuItem, setSearchQuery, setShowImportModal, setImportPlaceId, setIsToggled,
    setTempStoreName, setTempStoreAddress, setAlternativeLayoutCols,
    loadSavedMenuBoards, filteredFoodItems, getCartCount, handleShowMenuDetail, handleAddToCart,
    handleRemoveFromCart, getTotalPrice, handleOrderConfirm, handleStoreSettingsOpen, handleStoreSettingsSave,
    handleStoreSettingsCancel, handleAddTab, handleEditTab, handleDeleteTab, handleAddMenu, handleEditMenu,
    handleDeleteMenu, handleMenuEditSave, handleMenuEditCancel, handleOpenMap, handleDownloadHTML,
    handleImportMenu, handleSaveCurrentState, handleLoadMenuBoard, handleDeleteMenuBoard, filteredSavedBoards,
    handleResetMenu, handleToggle, getStoreNameFontSize, getMenuNameFontSize
  }

  return <KioskContext.Provider value={value}>{children}</KioskContext.Provider>
}

export const useKiosk = () => {
  const context = useContext(KioskContext)
  if (context === undefined) {
    throw new Error('useKiosk must be used within a KioskProvider')
  }
  return context
} 