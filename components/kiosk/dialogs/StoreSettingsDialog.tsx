"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useKiosk } from "@/contexts/KioskContext"
import { Plus, Edit, Trash2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export const StoreSettingsDialog = () => {
  const {
    showStoreSettings,
    setShowStoreSettings,
    // Store Tab
    tempStoreName,
    setTempStoreName,
    tempStoreAddress,
    setTempStoreAddress,
    handleStoreSettingsCancel,
    handleStoreSettingsSave,
    handleSaveCurrentState,
    isLoading,
    // Tabs Tab
    tempTabs,
    handleAddTab,
    handleEditTab,
    handleDeleteTab,
    alternativeLayoutCols,
    setAlternativeLayoutCols,
    // Menu Tab
    foodItems,
    handleAddMenu,
    handleEditMenu,
    handleDeleteMenu,
    // Load Tab
    savedMenuBoards,
    loadSavedMenuBoards,
    searchQuery,
    setSearchQuery,
    filteredSavedBoards,
    handleLoadMenuBoard,
    handleDeleteMenuBoard,
  } = useKiosk()

  if (!showStoreSettings) return null

  return (
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
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                >
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
                    <div className="text-xs text-gray-600 mb-1">
                      {item.price}
                    </div>
                    <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {item.category}
                    </div>
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

            {/* <div className="space-y-2">
              <h3 className="text-lg font-semibold mb-2">신형 메뉴판 레이아웃</h3>
              <RadioGroup
                value={String(alternativeLayoutCols)}
                onValueChange={(value) => setAlternativeLayoutCols(Number(value))}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="cols-1" />
                  <Label htmlFor="cols-1">1열</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="cols-2" />
                  <Label htmlFor="cols-2">2열</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="cols-3" />
                  <Label htmlFor="cols-3">3열</Label>
                </div>
              </RadioGroup>
            </div> */}

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredSavedBoards.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {savedMenuBoards.length === 0
                    ? "저장된 메뉴판이 없습니다."
                    : "검색 결과가 없습니다."}
                </div>
              ) : (
                filteredSavedBoards.map((board) => (
                  <Card key={board.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-lg mb-1">
                          {board.name}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>
                            매장명: {board.store_name || board.storeName}
                          </div>
                          {(board.store_address || board.storeAddress) && (
                            <div>
                              주소: {board.store_address || board.storeAddress}
                            </div>
                          )}
                          <div>탭: {board.tabs?.join(", ")}</div>
                          <div>
                            메뉴:{" "}
                            {(board.food_items || board.foodItems)?.length || 0}
                            개
                          </div>
                          <div>
                            저장일:{" "}
                            {new Date(
                              board.created_at || board.savedAt
                            ).toLocaleString("ko-KR")}
                          </div>
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
                            if (confirm("정말 삭제하시겠습니까?")) {
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
  )
} 