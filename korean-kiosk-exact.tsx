"use client"

import { KioskProvider, useKiosk } from "@/contexts/KioskContext"

import { AlternativeMenuBoard } from "@/components/kiosk/AlternativeMenuBoard"
import { MenuDetailDialog } from "@/components/kiosk/dialogs/MenuDetailDialog"
import { StoreSettingsDialog } from "@/components/kiosk/dialogs/StoreSettingsDialog"
import { MenuEditDialog } from "@/components/kiosk/dialogs/MenuEditDialog"
import { ImportMenuDialog } from "@/components/kiosk/dialogs/ImportMenuDialog"
import { Header } from "@/components/kiosk/Header"
import { LeftSidebar } from "@/components/kiosk/LeftSidebar"
import { MainContent } from "@/components/kiosk/MainContent"
import { ActionBar } from "@/components/kiosk/ActionBar"
import { KioskContainer } from "@/components/kiosk/KioskContainer"

interface ComponentProps {
  initialStoreName?: string
}

const KioskLayoutContent = () => (
  <>
    <Header />
    <LeftSidebar />
    <div className="flex-1 flex flex-col">
      <MainContent />
      <ActionBar />
    </div>
  </>
)

const KioskView = () => {
  const { isToggled } = useKiosk()

  return (
    <KioskContainer>
      <>
        {isToggled ? <AlternativeMenuBoard /> : <KioskLayoutContent />}
        {/* Dialogs */}
        <MenuDetailDialog />
        <StoreSettingsDialog />
        <MenuEditDialog />
        <ImportMenuDialog />
      </>
    </KioskContainer>
  )
}

export default function Component({ initialStoreName }: ComponentProps = {}) {
  return (
    <KioskProvider initialStoreName={initialStoreName}>
      <KioskView />
    </KioskProvider>
  )
}
