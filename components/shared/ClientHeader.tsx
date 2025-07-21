"use client"

import type React from "react"
import { ShoppingCart, User, Phone, Instagram, Bell } from "lucide-react"
import { useApp } from "@/context/AppContext"
import Image from "next/image"

export const ClientHeader: React.FC = () => {
  const { cart, navigateTo, logout } = useApp()

  return (
    <header className="bg-white/90 backdrop-blur-xl shadow-2xl border-b-2 border-purple-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 md:space-x-4 cursor-pointer group" onClick={() => navigateTo("catalog")}>
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 overflow-hidden">
              <Image 
                src="/logoJabones.png" 
                alt="L'ERBOLARIO Logo" 
                width={56} 
                height={56} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-purple-800 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:via-violet-700 group-hover:to-purple-900 transition-all duration-300">
                L'ERBOLARIO
              </h1>
              <p className="text-xs text-purple-600 font-semibold">Cosmética Natural Italiana</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-purple-800 bg-clip-text text-transparent">
                L'ERBOLARIO
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-1 md:space-x-3">
            <button
              onClick={() => navigateTo("cart")}
              className="relative p-2 md:p-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-2xl transition-all duration-300 group"
            >
              <ShoppingCart size={22} className="md:w-6 md:h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full h-6 w-6 md:h-7 md:w-7 flex items-center justify-center font-bold shadow-lg animate-bounce">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            <button
              onClick={() => navigateTo("profile")}
              className="p-2 md:p-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-2xl transition-all duration-300"
            >
              <User size={22} className="md:w-6 md:h-6" />
            </button>

            <button className="p-2 md:p-4 text-purple-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-2xl transition-all duration-300">
              <Bell size={20} className="md:w-6 md:h-6" />
            </button>

            <div className="flex space-x-1 md:space-x-2">
              <a
                href="https://wa.me/59165747121"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 md:p-4 text-purple-600 hover:text-green-600 hover:bg-green-50 rounded-2xl transition-all duration-300"
              >
                <Phone size={20} className="md:w-6 md:h-6" />
              </a>
              <a
                href="https://www.instagram.com/lerbolario.bo/?utm_source=ig_web_button_share_sheet"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 md:p-4 text-purple-600 hover:text-pink-600 hover:bg-pink-50 rounded-2xl transition-all duration-300"
              >
                <Instagram size={20} className="md:w-6 md:h-6" />
              </a>
            </div>

            <button
              onClick={logout}
              className="text-xs md:text-sm text-purple-600 hover:text-red-600 font-bold transition-colors px-2 py-2 md:px-6 md:py-3 rounded-2xl hover:bg-red-50 border-2 border-purple-200 hover:border-red-200"
            >
              <span className="hidden sm:inline">Salir</span>
              <span className="sm:hidden">X</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
