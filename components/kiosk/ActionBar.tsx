"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useKiosk } from "@/contexts/KioskContext"
import { Menu, X } from "lucide-react"

export const ActionBar = () => {
  const {
    isMobile,
    isLandscape,
    isTablet,
    showOrderHistory,
    setShowOrderHistory,
    showOrderConfirm,
    setShowOrderConfirm,
    orderItems,
    handleRemoveFromCart,
    getTotalPrice,
    getCartCount,
    handleOrderConfirm,
  } = useKiosk()

  return (
    <div
      className={`bg-white border-gray-200 border-t ${
        isMobile && !isLandscape
          ? "p-3 pb-4"
          : isMobile && isLandscape
          ? "p-2 pb-3"
          : isTablet
          ? "p-3 pb-4"
          : "p-2 sm:p-3 md:p-4 lg:p-6"
      } flex items-end justify-end mt-auto`}
    >
      <div
        className={`flex ${
          isMobile && !isLandscape
            ? "gap-4"
            : isMobile && isLandscape
            ? "gap-3"
            : isTablet
            ? "gap-4"
            : "gap-2 sm:gap-3 md:gap-4"
        }`}
      >
        <Dialog open={showOrderHistory} onOpenChange={setShowOrderHistory}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className={`flex items-center gap-1 sm:gap-2 bg-white border-gray-300 text-gray-600 hover:bg-gray-50 ${
                isMobile && !isLandscape
                  ? "px-3 py-2.5 text-sm"
                  : isMobile && isLandscape
                  ? "px-3 py-2 text-sm"
                  : isTablet
                  ? "px-3 py-2.5 text-sm"
                  : "px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base"
              }`}
            >
              <Menu
                className={`${
                  isMobile && !isLandscape
                    ? "w-3.5 h-3.5"
                    : isMobile && isLandscape
                    ? "w-3.5 h-3.5"
                    : isTablet
                    ? "w-3.5 h-3.5"
                    : "w-3 sm:w-4 h-3 sm:h-4"
                }`}
              />
              주문내역
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">주문내역</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {orderItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  주문한 상품이 없습니다.
                </p>
              ) : (
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">
                          {item.name} x {item.quantity}
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.price}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          {(item.priceNumber * item.quantity).toLocaleString()}
                          원
                        </span>
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
              className={`bg-cyan-400 hover:bg-cyan-500 text-black font-bold relative ${
                isMobile && !isLandscape
                  ? "px-4 py-2.5 text-base"
                  : isMobile && isLandscape
                  ? "px-3 py-2 text-sm"
                  : isTablet
                  ? "px-4 py-2.5 text-base"
                  : "px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base"
              }`}
              disabled={orderItems.length === 0}
            >
              주문하기
              <Badge
                className={`absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold ${
                  isMobile && !isLandscape
                    ? "w-5 h-5 text-xs"
                    : isMobile && isLandscape
                    ? "w-4 h-4 text-xs"
                    : isTablet
                    ? "w-5 h-5 text-xs"
                    : "w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-xs"
                }`}
              >
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
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>
                          {(item.priceNumber * item.quantity).toLocaleString()}
                          원
                        </span>
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
              <AlertDialogAction
                onClick={handleOrderConfirm}
                className="bg-cyan-400 hover:bg-cyan-500 text-black"
              >
                주문하기
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
} 