"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useKiosk } from "@/contexts/KioskContext"

export const ImportMenuDialog = () => {
  const {
    showImportModal,
    setShowImportModal,
    importPlaceId,
    setImportPlaceId,
    isImporting,
    handleImportMenu,
  } = useKiosk()

  return (
    <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            네이버 메뉴 불러오기
          </DialogTitle>
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
              매장 URL의 "restaurant/" 다음에 오는 숫자를 입력해주세요.
              <br />
              예시:
              https://pcmap.place.naver.com/restaurant/1234567890/menu/list
            </p>
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowImportModal(false)
                setImportPlaceId("")
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
  )
} 