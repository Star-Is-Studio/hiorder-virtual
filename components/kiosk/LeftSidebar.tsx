"use client"

import { Button } from "@/components/ui/button"
import { useKiosk } from "@/contexts/KioskContext"

interface LeftSidebarProps {
  theme?: 'default' | 'alternative';
}

export const LeftSidebar = ({ theme = 'default' }: LeftSidebarProps) => {
  const { storeName, isMobile, isLandscape, isTablet } = useKiosk()

  const themeClasses = {
    default: {
      border: "border-cyan-400",
      bg: "bg-cyan-400",
      hoverBg: "hover:bg-cyan-500",
    },
    alternative: {
      border: "border-red-500",
      bg: "bg-red-500",
      hoverBg: "hover:bg-red-600",
    },
  };

  const currentTheme = themeClasses[theme];

  return (
    <div
      className={`${
        isMobile && !isLandscape
          ? "w-40"
          : isMobile && isLandscape
          ? "w-36"
          : isTablet
          ? "w-44"
          : "w-24 sm:w-32 md:w-40 lg:w-44"
      } bg-gray-800 text-white flex flex-col relative`}
    >
      <div
        className={`text-center bg-[rgba(34,34,34,1)] ${
          isMobile && !isLandscape
            ? "p-3"
            : isMobile && isLandscape
            ? "p-2"
            : isTablet
            ? "p-3"
            : "p-2 sm:p-3 md:p-4"
        }`}
      >
        <div
          className={`bg-white text-black rounded-lg sm:rounded-xl font-bold leading-tight text-center tracking-wide aspect-square flex items-center justify-center ${
            isMobile && !isLandscape
              ? "text-3xl p-3 m-1"
              : isMobile && isLandscape
              ? "text-2xl p-2 m-1"
              : isTablet
              ? "text-4xl p-3 m-1"
              : "text-xl sm:text-2xl md:text-3xl lg:text-4xl p-2 sm:p-3 md:p-4 m-1"
          }`}
        >
          하이
          <br />
          오더
        </div>
      </div>

      <div
        className={`flex-1 px-0 mx-0 tracking-normal leading-7 border-0 bg-[rgba(34,34,34,1)] flex flex-col`}
      >
        {/* 식당명 */}
        <div
          className={`text-white font-bold whitespace-pre-wrap text-center leading-tight ${
            isMobile && !isLandscape
              ? "mt-4 mb-4 text-lg px-3"
              : isMobile && isLandscape
              ? "mt-3 mb-3 text-base px-2"
              : isTablet
              ? "mt-4 mb-4 text-xl px-3"
              : "mt-4 mb-4 text-base sm:text-lg md:text-xl lg:text-2xl px-2 sm:px-3 md:px-4"
          }`}
        >
          {storeName}
        </div>

        <div
          className={`flex items-center justify-center ${
            isMobile && !isLandscape
              ? "px-3 py-3 mx-1"
              : isMobile && isLandscape
              ? "px-2 py-2 mx-1"
              : isTablet
              ? "px-3 py-3 mx-1"
              : "px-2 sm:px-3 md:px-4 py-2 sm:py-3 mx-1 sm:mx-2"
          } border-l-4 ${currentTheme.border} rounded-r bg-[rgba(61,61,61,1)]`}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/256/192/192732.png"
            className={`${
              isMobile && !isLandscape
                ? "mr-2 w-5 h-5"
                : isMobile && isLandscape
                ? "mr-1 w-4 h-4"
                : isTablet
                ? "mr-2 w-5 h-5"
                : "mr-1 sm:mr-2 w-3 sm:w-4 md:w-5 lg:w-6 h-3 sm:h-4 md:h-5 lg:h-6"
            } brightness-0 invert`}
            alt="메뉴주문"
          />
          <span
            className={`${
              isMobile && !isLandscape
                ? "text-sm"
                : isMobile && isLandscape
                ? "text-xs"
                : isTablet
                ? "text-base"
                : "text-xs sm:text-sm md:text-base"
            } tracking-normal font-extrabold leading-6 sm:leading-8 md:leading-10`}
            style={{ whiteSpace: "nowrap" }}
          >
            메뉴주문
          </span>
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-1"></div>

        {/* Circular Call Staff Button */}
        <div
          className={`${
            isMobile && !isLandscape
              ? "pb-4"
              : isMobile && isLandscape
              ? "pb-3"
              : isTablet
              ? "pb-4"
              : "pb-3 sm:pb-4 md:pb-6"
          } flex justify-center`}
        >
          <Button
            className={`font-bold rounded-full shadow-lg text-white tracking-normal ${currentTheme.bg} ${currentTheme.hoverBg} ${
              isMobile && !isLandscape
                ? "text-sm leading-4 h-16 w-16"
                : isMobile && isLandscape
                ? "text-xs leading-3 h-12 w-12"
                : isTablet
                ? "text-base leading-5 h-20 w-20"
                : "text-xs sm:text-sm md:text-lg lg:text-xl leading-3 sm:leading-5 md:leading-7 h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24"
            }`}
          >
            직원
            <br />
            호출
          </Button>
        </div>
      </div>
    </div>
  )
} 