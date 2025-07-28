"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useKiosk } from "@/contexts/KioskContext"

export const MenuDetailDialog = () => {
  const { 
    showMenuDetail, 
    setShowMenuDetail, 
    selectedMenuItem, 
    handleAddToCart 
  } = useKiosk()

  if (!selectedMenuItem) return null

  return (
    <Dialog open={showMenuDetail} onOpenChange={setShowMenuDetail}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{selectedMenuItem.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
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
        </div>
      </DialogContent>
    </Dialog>
  )
} 