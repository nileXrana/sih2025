'use client'

import LoginForm from '@/components/LoginForm'
import { useLanguage, LanguageSelector } from "@/lib/LanguageContext"
import { getTranslation } from "@/lib/translations"

export default function MIRoomLogin() {
  const { language } = useLanguage()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      {/* Language Selector in top-right corner */}
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <LoginForm
        title={getTranslation('miRoomInchargeLogin', language) as string}
        role="MI_ROOM_INCHARGE"
        redirectPath="/mi-room/dashboard"
      />
    </div>
  )
}