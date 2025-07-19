"use client"

import type React from "react"
import { ShoppingCart, User, Phone, Instagram, Bell, Sparkles } from "lucide-react"
import { useApp } from "../../context/AppContext"

export const ClientHeader: React.FC = () => {
  const { cart, navigateTo, logout } = useApp()

  return (
    <header className="bg-white/90 backdrop-blur-xl shadow-2xl border-b-2 border-purple-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => navigateTo("catalog")}>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-purple-800 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:via-violet-700 group-hover:to-purple-900 transition-all duration-300">
                L'ERBOLARIO
              </h1>
              <p className="text-xs text-purple-600 font-semibold">Cosmética Natural Italiana</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigateTo("cart")}
              className="relative p-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-2xl transition-all duration-300 group"
            >
              <ShoppingCart size={26} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full h-7 w-7 flex items-center justify-center font-bold shadow-lg animate-bounce">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            <button
              onClick={() => navigateTo("profile")}
              className="p-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-2xl transition-all duration-300"
            >
              <User size={26} />
            </button>

            <button className="p-4 text-purple-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-2xl transition-all duration-300">
              <Bell size={26} />
            </button>

            <div className="flex space-x-2">
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 text-purple-600 hover:text-green-600 hover:bg-green-50 rounded-2xl transition-all duration-300"
              >
                <Phone size={22} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 text-purple-600 hover:text-pink-600 hover:bg-pink-50 rounded-2xl transition-all duration-300"
              >
                <Instagram size={22} />
              </a>
            </div>

            <button
              onClick={logout}
              className="text-sm text-purple-600 hover:text-red-600 font-bold transition-colors px-6 py-3 rounded-2xl hover:bg-red-50 border-2 border-purple-200 hover:border-red-200"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
