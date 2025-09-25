'use client';

import Link from "next/link";
import { useLanguage, LanguageSelector } from "@/lib/LanguageContext";
import { getTranslation, getTranslationArray } from "@/lib/translations";

export default function Home() {
  const { language } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3v-8h6v8h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getTranslation('appTitle', language) as string}
              </h1>
            </div>
            <div className="flex items-center">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12 mt-5">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {getTranslation('heroTitle', language) as string}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {getTranslation('heroSubtitle', language) as string}
            </p>
          </div>

          {/* Portal Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* MI Room Incharge Portal */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {getTranslation('miRoomTitle', language) as string}
              </h3>
              <p className="text-gray-600 mb-6">
                {getTranslation('miRoomDescription', language) as string}
              </p>
              <ul className="text-sm text-gray-600 mb-8 space-y-2">
                {getTranslationArray('miRoomFeatures', language).map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
              <Link
                href="/mi-room/login"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                {getTranslation('miRoomLogin', language) as string}
              </Link>
            </div>

            {/* Hospital Doctor Portal */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {getTranslation('doctorTitle', language) as string}
              </h3>
              <p className="text-gray-600 mb-6">
                {getTranslation('doctorDescription', language) as string}
              </p>
              <ul className="text-sm text-gray-600 mb-8 space-y-2">
                {getTranslationArray('doctorFeatures', language).map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
              <Link
                href="/doctor/login"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {getTranslation('doctorLogin', language) as string}
              </Link>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              {getTranslation('systemBenefitsTitle', language) as string}
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{getTranslation('reducedLoadTitle', language) as string}</h4>
                <p className="text-gray-600 text-sm">
                  {getTranslation('reducedLoadDesc', language) as string}
                </p>
              </div>
              <div>
                <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{getTranslation('improvedAccessTitle', language) as string}</h4>
                <p className="text-gray-600 text-sm">
                  {getTranslation('improvedAccessDesc', language) as string}
                </p>
              </div>
              <div>
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{getTranslation('efficientTriageTitle', language) as string}</h4>
                <p className="text-gray-600 text-sm">
                  {getTranslation('efficientTriageDesc', language) as string}
                </p>
              </div>
            </div>
          </div>

          {/* Health Guidelines & Prevention Section */}
          <div className="mt-12 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl p-8 border border-emerald-100 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}></div>
            </div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                  {getTranslation('healthGuidelinesTitle', language) as string}
                </h3>
                <p className="text-xl text-emerald-700 font-semibold mb-3">
                  {getTranslation('healthGuidelinesSubtitle', language) as string}
                </p>
                <p className="text-emerald-600 max-w-3xl mx-auto leading-relaxed">
                  {getTranslation('healthGuidelinesDesc', language) as string}
                </p>
              </div>

              {/* Health Guidelines Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Hand Hygiene */}
                <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-emerald-100">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2C8.897 2 8 2.897 8 4v4l-1.5 1.5C5.672 10.328 5 11.414 5 12.586V16a2 2 0 002 2h6a2 2 0 002-2v-3.414c0-1.172-.672-2.258-1.5-3.086L12 8V4c0-1.103-.897-2-2-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-2 text-lg group-hover:text-blue-600 transition-colors">
                        🧼 {getTranslation('handHygieneTitle', language) as string}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {getTranslation('handHygieneDesc', language) as string}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Balanced Nutrition */}
                <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-emerald-100">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5a1 1 0 000 2h2a1 1 0 100-2zm8 0h-2a1 1 0 100 2h2a1 1 0 100-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-2 text-lg group-hover:text-green-600 transition-colors">
                        🥗 {getTranslation('balancedDietTitle', language) as string}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {getTranslation('balancedDietDesc', language) as string}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Regular Exercise */}
                <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-emerald-100">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-2 text-lg group-hover:text-orange-600 transition-colors">
                        🏃‍♂️ {getTranslation('regularExerciseTitle', language) as string}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {getTranslation('regularExerciseDesc', language) as string}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quality Sleep */}
                <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-emerald-100">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-2 text-lg group-hover:text-purple-600 transition-colors">
                        😴 {getTranslation('adequateSleepTitle', language) as string}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {getTranslation('adequateSleepDesc', language) as string}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stay Hydrated */}
                <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-emerald-100">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 3.636L6.464 2.222a1 1 0 011.414 0L10 4.343l2.122-2.121a1 1 0 011.414 0l1.414 1.414a1 1 0 010 1.414L12.828 7.172a4 4 0 010 5.656l2.122 2.122a1 1 0 01-1.414 1.414L11.414 14.242a4 4 0 01-5.656 0L3.636 16.364a1 1 0 01-1.414-1.414l2.122-2.122a4 4 0 010-5.656L2.222 5.05a1 1 0 011.414-1.414L5.05 3.636z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-2 text-lg group-hover:text-cyan-600 transition-colors">
                        💧 {getTranslation('stayHydratedTitle', language) as string}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {getTranslation('stayHydratedDesc', language) as string}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preventive Care */}
                <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-emerald-100">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-2 text-lg group-hover:text-pink-600 transition-colors">
                        🩺 {getTranslation('preventiveCaretitle', language) as string}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {getTranslation('preventiveCareDesc', language) as string}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-12 text-center">
                <div className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">
                    {language === 'en' ? 'Start Your Healthy Journey Today!' : 
                     language === 'hi' ? 'आज ही अपनी स्वस्थ यात्रा शुरू करें!' : 
                     'ਅੱਜ ਹੀ ਆਪਣਾ ਸਿਹਤਮੰਦ ਸਫ਼ਰ ਸ਼ੁਰੂ ਕਰੋ!'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Village Awareness Message */}
          <div className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-4 4-4-4 4-4 .257-.257A6 6 0 1118 8zm-6-2a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">{getTranslation('villageAwarenessTitle', language) as string}</h3>
              <p className="text-lg mb-4 opacity-95">
                {getTranslation('villageAwarenessSubtitle', language) as string}
              </p>
              <p className="text-base mb-6 opacity-90 max-w-2xl mx-auto">
                {getTranslation('villageAwarenessDesc', language) as string}
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-full">
                  {getTranslation('freeCheckups', language) as string}
                </span>
                <span className="bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-full">
                  {getTranslation('expertDoctors', language) as string}
                </span>
                <span className="bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-full">
                  {getTranslation('villageLocation', language) as string}
                </span>
                <span className="bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-full">
                  {getTranslation('saveMoneyTime', language) as string}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              {getTranslation('footerText', language) as string}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}