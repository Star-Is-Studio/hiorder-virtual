"use client"

import { useKiosk } from "@/contexts/KioskContext"
import { ReactNode } from "react"

export const KioskContainer = ({ children }: { children: ReactNode }) => {
  const { isMobile, isTablet, isLandscape } = useKiosk()

  return (
    <div
      className={`w-full h-screen bg-gray-200 flex items-center justify-center overflow-hidden ${
        isMobile || isTablet ? "p-0" : "p-1 sm:p-4 md:p-8 lg:p-[10%]"
      }`}
    >
      <div
        className={`bg-gray-800 shadow-2xl ${
          isMobile || isTablet
            ? "rounded-lg p-1 sm:p-2"
            : "rounded-lg sm:rounded-2xl md:rounded-3xl p-1 sm:p-3 md:p-4 lg:p-6"
        }`}
        style={{
          aspectRatio:
            isMobile && !isLandscape
              ? "9/16"
              : isMobile && isLandscape
              ? "16/9"
              : isTablet
              ? "16/10"
              : "4/3",
          width:
            isMobile && !isLandscape
              ? "100vw"
              : isMobile && isLandscape
              ? "100vw"
              : isTablet
              ? "100vw"
              : "100%",
          height:
            isMobile && !isLandscape
              ? "100vh"
              : isMobile && isLandscape
              ? "100vh"
              : isTablet
              ? "100vh"
              : "90vh",
          maxWidth: isMobile ? "none" : isTablet ? "none" : "min(90vw, 90vh * 4/3)",
          maxHeight:
            isMobile && !isLandscape
              ? "100vh"
              : isMobile && isLandscape
              ? "100vh"
              : isTablet
              ? "100vh"
              : "90vh",
          minHeight:
            isMobile && !isLandscape
              ? "100vh"
              : isMobile && isLandscape
              ? "100vh"
              : isTablet
              ? "100vh"
              : "90vh",
        }}
      >
        <div
          className={`w-full h-full bg-white overflow-hidden flex relative ${
            isMobile || isTablet ? "rounded-lg" : "rounded-2xl"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  )
} 