"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useKiosk } from "@/contexts/KioskContext"

export const MenuEditDialog = () => {
  const {
    showMenuEdit,
    setShowMenuEdit,
    tempMenuName,
    setTempMenuName,
    tempMenuPrice,
    setTempMenuPrice,
    tempMenuCategory,
    setTempMenuCategory,
    tabs,
    tempMenuImage,
    setTempMenuImage,
    tempMenuDescription,
    setTempMenuDescription,
    handleMenuEditCancel,
    handleMenuEditSave,
  } = useKiosk()

  return (
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
  )
} 