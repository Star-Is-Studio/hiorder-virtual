"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useKiosk } from "@/contexts/KioskContext"

export const MainContent = () => {
  const {
    tabs,
    activeTab,
    setActiveTab,
    isMobile,
    isLandscape,
    isTablet,
    filteredFoodItems,
    handleShowMenuDetail,
    getMenuNameFontSize,
  } = useKiosk()

  return (
    <div className="flex-1 flex flex-col">
      {/* Header Tabs */}
      <div
        className={`bg-transparent border-gray-200 border-b`}
      >
        <div
          className={`flex ${
            isMobile && !isLandscape
              ? "px-4 pt-4"
              : isMobile && isLandscape
              ? "px-3 pt-2"
              : isTablet
              ? "px-4 pt-4"
              : "px-2 sm:px-3 md:px-4 lg:px-6 pt-2 sm:pt-3 md:pt-4"
          }`}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                isMobile && !isLandscape
                  ? "px-4 py-3 text-base mr-4"
                  : isMobile && isLandscape
                  ? "px-3 py-2 text-sm mr-3"
                  : isTablet
                  ? "px-4 py-3 text-lg mr-6"
                  : "px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base lg:text-lg mr-2 sm:mr-4 md:mr-6 lg:mr-8"
              } font-bold border-b-4 transition-colors bg-transparent ${
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
      <div
        className={`flex-1 ${
          isMobile && !isLandscape
            ? "p-4"
            : isMobile && isLandscape
            ? "p-3"
            : isTablet
            ? "p-4"
            : "p-2 sm:p-3 md:p-4 lg:p-6"
        } flex flex-col border-0 leading-7 tracking-normal overflow-hidden`}
      >
        <h2
          className={`font-bold text-gray-600 ${
            isMobile && !isLandscape
              ? "mb-4 text-xl"
              : isMobile && isLandscape
              ? "mb-3 text-lg"
              : isTablet
              ? "mb-4 text-2xl"
              : "mb-3 sm:mb-4 md:mb-6 text-sm sm:text-lg md:text-xl lg:text-2xl"
          }`}
        >
          {activeTab}
        </h2>

        <div
          className={`flex-1 overflow-y-auto`}
          style={{
            maxHeight:
              isMobile && !isLandscape
                ? "calc(100vh - 125px)" // 모바일 세로: 메뉴 카드가 커진만큼 더 넓게
                : isMobile && isLandscape
                ? "calc(100vh - 95px)" // 모바일 가로: 더 넓게
                : isTablet
                ? "calc(100vh - 130px)" // 태블릿: 더 넓게
                : "calc(100vh - 195px)", // 데스크톱: 약간 더 넓게
          }}
        >
          <div
            className={`grid ${
              isMobile && !isLandscape
                ? "grid-cols-3 gap-3"
                : isMobile && isLandscape
                ? "grid-cols-3 gap-3"
                : isTablet
                ? "grid-cols-3 gap-4"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6"
            }`}
          >
            {filteredFoodItems.map((item) => (
              <Card
                key={item.id}
                className={`overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
                  isMobile && !isLandscape
                    ? "h-64"
                    : isMobile && isLandscape
                    ? "h-[207px]"
                    : isTablet
                    ? "h-72"
                    : "h-56 sm:h-60 md:h-64 lg:h-72"
                }`}
              >
                <div className="relative h-3/5">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={280}
                    height={180}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center 50%", objectFit: "cover" }}
                  />
                  {item.badge && (
                    <Badge className="absolute top-1 sm:top-2 md:top-3 right-1 sm:right-2 md:right-3 bg-gray-800 text-white px-1 sm:px-2 py-0.5 sm:py-1 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <CardContent className="h-2/5 flex flex-col justify-between p-2 sm:p-3">
                  <h3
                    className={`font-medium ${getMenuNameFontSize(
                      item.name
                    )} text-gray-900 break-keep line-clamp-2 mt-[-5px]`}
                  >
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className={`font-bold ${
                        isMobile && !isLandscape
                          ? "text-base"
                          : isMobile && isLandscape
                          ? "text-base"
                          : isTablet
                          ? "text-base"
                          : "text-base sm:text-base md:text-lg"
                      }`}
                    >
                      {item.price}
                    </span>
                    <Button
                      onClick={() => handleShowMenuDetail(item)}
                      className={`bg-gray-800 hover:bg-gray-700 text-white font-medium ${
                        isMobile && !isLandscape
                          ? "px-3 py-1.5 text-sm"
                          : isMobile && isLandscape
                          ? "px-3 py-1 text-sm"
                          : isTablet
                          ? "px-4 py-2 text-base"
                          : "px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base"
                      }`}
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
    </div>
  )
} 