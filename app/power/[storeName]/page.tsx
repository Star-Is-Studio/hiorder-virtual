'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import KioskComponent from '@/korean-kiosk-exact'

interface PageProps {
  params: {
    storeName: string
  }
}

export default function PowerPage({ params }: PageProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // URL에서 매장명 디코딩
  const decodedStoreName = decodeURIComponent(params.storeName)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password === '1025') {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('접속코드가 틀렸습니다.')
      setPassword('')
    }
  }

  if (isAuthenticated) {
    return <KioskComponent initialStoreName={decodedStoreName} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">🏢</div>
          <CardTitle className="text-4xl font-bold text-gray-800 mb-2">토탈프로</CardTitle>
          <CardDescription className="text-2xl text-gray-600 mb-4">가상메뉴판</CardDescription>
          <div className="text-lg font-medium text-blue-600 bg-blue-50 p-3 rounded-lg border">
            매장: {decodedStoreName}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
              접속코드
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="접속코드를 입력하세요"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            
            <Button type="submit" className="w-full" size="lg">
              키오스크 시작
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 