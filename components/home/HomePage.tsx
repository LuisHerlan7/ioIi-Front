"use client"

import type React from "react"
import { ShoppingCart, Package, Sparkles, Leaf, Heart, Award, Phone, Instagram, Facebook } from "lucide-react"
import { useApp } from "@/context/AppContext"

export const HomePage: React.FC = () => {
  const { navigateTo } = useApp()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-violet-100 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-violet-300/20 to-purple-300/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-full text-purple-800 text-sm font-semibold mb-8 shadow-lg backdrop-blur-sm">
              <Leaf size={18} className="mr-2" />
              Cosmética Natural Premium 
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 relative">
              <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-800 bg-clip-text text-transparent">
                L'ERBOLARIO
              </span>
              <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-pulse"></div>
            </h1>
            <img src="/logoJabones.png" alt="Hero" className="mx-auto mb-6" />
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed font-light px-4">
              Descubre la magia de la naturaleza italiana en cada jabón artesanal.
              <span className="font-semibold text-purple-700"> Ingredientes puros, tradición auténtica.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 text-gray-600 mb-8 md:mb-12">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} className="text-yellow-400 fill-current animate-pulse" size={20} />
                ))}
              </div>
              <span className="text-sm sm:text-lg font-semibold">4.9/5 • Más de 25,000 clientes satisfechos</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center max-w-2xl mx-auto mb-16 md:mb-20 px-4">
            <button
              onClick={() => navigateTo("client-login")}
              className="group relative bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 text-white px-6 md:px-10 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-bold hover:from-purple-700 hover:via-violet-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 w-full sm:w-auto overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center justify-center space-x-2 md:space-x-3">
                <ShoppingCart size={20} className="md:w-6 md:h-6" />
                <span>Explorar Colección</span>
                <Heart size={16} className="animate-pulse md:w-5 md:h-5" />
              </div>
            </button>

            <button
              onClick={() => navigateTo("admin-login")}
              className="bg-white/80 backdrop-blur-lg border-2 border-purple-200 text-purple-700 px-6 md:px-10 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-bold hover:bg-white hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 w-full sm:w-auto"
            >
              <div className="flex items-center justify-center space-x-2 md:space-x-3">
                <Package size={20} className="md:w-6 md:h-6" />
                <span>Panel Admin</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 pb-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Por qué elegir L'ERBOLARIO?</h2>
          <p className="text-gray-600 text-xl">La excelencia italiana en cosmética natural</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="group bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 border border-white/50 hover:border-purple-200 transform hover:scale-105">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
              <Leaf className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">100% Natural</h3>
            <p className="text-gray-600 text-center leading-relaxed text-lg">
              Ingredientes botánicos puros seleccionados de los jardines italianos más prestigiosos, sin químicos
              agresivos
            </p>
          </div>

          <div className="group bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 border border-white/50 hover:border-purple-200 transform hover:scale-105">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
              <Award className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Tradición Artesanal</h3>
            <p className="text-gray-600 text-center leading-relaxed text-lg">
              Más de 75 años de experiencia italiana en la creación de jabones artesanales con técnicas tradicionales
            </p>
          </div>

          <div className="group bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 border border-white/50 hover:border-purple-200 transform hover:scale-105">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
              <Heart className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Cuidado Premium</h3>
            <p className="text-gray-600 text-center leading-relaxed text-lg">
              Fórmulas exclusivas que nutren, protegen y embellecen tu piel con el poder de la naturaleza italiana
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 rounded-3xl p-12 text-white text-center shadow-2xl">
          <h3 className="text-3xl font-bold mb-6">Conecta con nosotros</h3>
          <p className="text-xl mb-8 text-purple-100">Síguenos para tips de belleza y ofertas exclusivas</p>
          <div className="flex justify-center space-x-4 md:space-x-6">
            <a
              href="https://wa.me/77417175"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 backdrop-blur-sm p-3 md:p-4 rounded-2xl hover:bg-white/30 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
            >
              <img src="/whatsapp.png" alt="WhatsApp" className="w-6 h-6 md:w-7 md:h-7 object-contain" />
            </a>
            <a
              href="https://www.instagram.com/lerbolario.bo"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 backdrop-blur-sm p-3 md:p-4 rounded-2xl hover:bg-white/30 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
            >
              <Instagram size={24} className="md:w-7 md:h-7" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61578687236593&,ibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 backdrop-blur-sm p-3 md:p-4 rounded-2xl hover:bg-white/30 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
            >
              <Facebook size={24} className="md:w-7 md:h-7" />
            </a>
            <a
              href="https://www.tiktok.com/@lerbolario.bo"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 backdrop-blur-sm p-3 md:p-4 rounded-2xl hover:bg-white/30 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
            >
              <img src="/tik-tok.png" alt="TikTok" className="w-6 h-6 md:w-7 md:h-7 object-contain" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
