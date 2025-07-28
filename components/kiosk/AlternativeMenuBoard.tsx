"use client"

import {
  ChevronDown,
  Plus,
  Minus,
  Globe,
  Star,
  X,
  LayoutGrid,
  Settings,
  Download,
  RefreshCw,
  MapPin,
} from "lucide-react"
import Image from "next/image"
import { useKiosk } from "@/contexts/KioskContext"
import { FoodItem, OrderItem } from "@/types/kiosk"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export const AlternativeMenuBoard = () => {
  const {
    foodItems,
    tabs,
    orderItems,
    handleAddToCart,
    handleRemoveFromCart,
    storeName,
    activeTab,
    setActiveTab,
    getTotalPrice,
    getCartCount,
    isToggled,
    handleToggle,
    handleStoreSettingsOpen,
    handleDownloadHTML,
    handleResetMenu,
    handleOpenMap,
    alternativeLayoutCols,
  } = useKiosk()

  const [showCart, setShowCart] = useState(false)

  const filteredItems = foodItems.filter(
    (item: FoodItem) => item.category === activeTab
  )

  const cartItemsForDisplay = orderItems.map((cartItem: OrderItem) => {
    const menuItem = foodItems.find((item) => item.id === cartItem.id)
    return {
      ...cartItem,
      name: menuItem?.name || "Unknown Item",
      price: menuItem?.priceNumber || 0,
      image: menuItem?.image,
    }
  })

  // This is a simplified handler. The context does not have an update quantity function.
  // We will use addToCart and removeFromCart to simulate it.
  const handleUpdateQuantity = (itemId: number, currentQuantity: number, change: number) => {
    if (change > 0) {
      const itemToAdd = foodItems.find(item => item.id === itemId);
      if (itemToAdd) handleAddToCart(itemToAdd);
    } else {
      handleRemoveFromCart(itemId);
    }
  };

  const clearCart = () => {
    // The context does not have a clear cart function.
    // We can simulate it by removing each item.
    orderItems.forEach(item => {
        for(let i=0; i < item.quantity; i++) {
            handleRemoveFromCart(item.id)
        }
    })
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-100">
      <header className="bg-white shadow-md p-4 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">{storeName}</h1>
          <span className="text-lg text-gray-600">Table 3</span>
        </div>
        <div className="flex items-center space-x-2">
          
          <div className="flex items-center gap-2 mr-4">
            <Switch
              checked={isToggled}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-gray-800"
            />
          </div>

          <Button
            onClick={handleResetMenu}
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:bg-gray-200"
            title="메뉴판 초기화"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
          <Button
            onClick={handleOpenMap}
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:bg-gray-200"
            title="네이버 지도에서 검색"
          >
            <MapPin className="w-5 h-5" />
          </Button>
          <Button
            onClick={handleDownloadHTML}
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:bg-gray-200"
            title="메뉴판 불러오기"
          >
            <Download className="w-5 h-5" />
          </Button>
          <Button
            onClick={handleStoreSettingsOpen}
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:bg-gray-200"
            title="설정"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-red-500 text-white flex flex-col">
          <div className="p-4">
            <h2 className="text-xl font-bold">KT 하이오더</h2>
            <p>Table 3</p>
          </div>
          <nav className="flex-1 space-y-2 p-2">
            {tabs.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`w-full text-left p-3 rounded-md transition-colors ${
                  activeTab === category
                    ? "bg-white text-red-500"
                    : "hover:bg-red-600"
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-red-400">
            <button className="w-full text-left p-3 flex items-center gap-2 rounded-md hover:bg-red-600">
              <Globe className="w-5 h-5" />
              <span>Language</span>
            </button>
            <button className="w-full text-left p-3 flex items-center gap-2 rounded-md hover:bg-red-600">
              <span>직원호출</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex">
          <div
            className={`${
              showCart ? "w-[calc(100%-24rem)]" : "w-full"
            } p-6 overflow-y-auto`}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold">{activeTab}</h2>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline">추가 기능</Button>
                <Button onClick={() => setShowCart(!showCart)}>
                  주문 내역 ({getCartCount()})
                </Button>
              </div>
            </div>

            <div
              className={`grid gap-6 ${
                alternativeLayoutCols === 1
                  ? "grid-cols-1"
                  : alternativeLayoutCols === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {filteredItems.map((item: FoodItem) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="relative">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    {item.name.includes("볼로네제") && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        NEW
                      </Badge>
                    )}
                    {item.name.includes("바질") && (
                      <Badge className="absolute top-2 left-2 bg-orange-400 text-white">
                        BEST
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-lg">
                        {(item.price).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-red-500 hover:bg-red-600"
                    >
                      담기
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {showCart && (
            <div className="w-96 bg-white p-6 flex flex-col shadow-lg">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>주문 내역</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItemsForDisplay.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <div className="flex-1 space-y-1">
                        <p>{item.name}</p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-6 h-6"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity, -1)
                            }
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-6 h-6"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity, 1)
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p>
                          {(item.price * item.quantity).toLocaleString()} 원
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 text-gray-400"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
                <Separator />
                <CardContent className="pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>총 금액</span>
                    <span>{getTotalPrice().toLocaleString()} 원</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={clearCart}
                      variant="outline"
                      className="w-full"
                    >
                      전체삭제
                    </Button>
                    <Button className="w-full bg-green-500 hover:bg-green-600">
                      주문하기 ({getCartCount()})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 