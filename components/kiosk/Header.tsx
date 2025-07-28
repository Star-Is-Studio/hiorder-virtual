"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useKiosk } from "@/contexts/KioskContext"
import { Settings, Download, RefreshCw, MapPin } from "lucide-react"

export const Header = () => {
  const {
    isToggled,
    handleToggle,
    handleStoreSettingsOpen,
    handleDownloadHTML,
    handleResetMenu,
    handleOpenMap,
  } = useKiosk()

  return (
    <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
      {/* <Switch
        checked={isToggled}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-gray-800"
      /> */}
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
  )
} 