'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useLanguage } from "@/lib/LanguageContext"
import { getTranslation } from "@/lib/translations"

interface LoginFormProps {
  title: string
  role: 'MI_ROOM_INCHARGE' | 'HOSPITAL_DOCTOR'
  redirectPath: string
  className?: string
}

export default function LoginForm({ title, role, redirectPath, className }: LoginFormProps) {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation - just check if fields are not empty
    if (!formData.email.trim() || !formData.password.trim()) {
      setError(getTranslation('fillAllFields', language) as string)
      return
    }

    setIsLoading(true)
    setError('')

    // Simulate login delay for better UX (prototype mode)
    setTimeout(() => {
      router.push(redirectPath)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className={cn("max-w-md mx-auto bg-white rounded-lg shadow-md p-6", className)}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-2">{getTranslation('pleaseSignIn', language) as string}</p>
        <div className="mt-3 p-3 bg-green-50 rounded-md text-sm text-green-700">
          <p className="font-semibold">{getTranslation('prototypeMode', language) as string}</p>
          <p className="text-xs mt-1">{getTranslation('prototypeInstructions', language) as string}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {getTranslation('emailAddress', language) as string}
          </label>
          <input
            type="email"
            id="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder={role === 'MI_ROOM_INCHARGE' ? getTranslation('emailPlaceholderMI', language) as string : getTranslation('emailPlaceholderDoctor', language) as string}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            {getTranslation('password', language) as string}
          </label>
          <input
            type="password"
            id="password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder={getTranslation('passwordPlaceholder', language) as string}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? getTranslation('signingIn', language) as string : getTranslation('signIn', language) as string}
        </button>
      </form>

      <div className="mt-6 text-center">
        <a href="/" className="text-blue-600 hover:text-blue-700 text-sm">
          {getTranslation('backToHome', language) as string}
        </a>
      </div>
    </div>
  )
}