"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Component from "../korean-kiosk-exact"

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = () => {
    if (password === "0827") {
      setIsLoggedIn(true)
      setError("")
    } else {
      setError("비밀번호가 틀렸습니다.")
      setPassword("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  // 로그인된 경우 키오스크 화면 표시
  if (isLoggedIn) {
    return <Component />
  }

  // 로그인 화면
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="text-6xl mb-4">🏢</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">토탈프로</h1>
          <p className="text-gray-600 text-lg">시뮬레이터</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="text-center">
              <label className="text-lg font-medium text-gray-700 block mb-3">
                비밀번호를 입력하세요
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="비밀번호"
                className="text-center text-xl py-3 tracking-widest"
                maxLength={4}
                autoFocus
              />
            </div>
            
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700 text-center">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={handleLogin}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 text-lg"
              size="lg"
            >
              로그인
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500 pt-4 border-t">
            시뮬레이터에 접근하려면<br />
            관리자 비밀번호가 필요합니다
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
