"use client"

import type React from "react"
import { Search, Star, Heart, Sparkles, Filter, Grid, Leaf } from "lucide-react"
import { useApp } from "../../context/AppContext"
import { ClientHeader } from "../shared/ClientHeader"

export const ProductCatalog: React.FC = () => {
  const { products, searchTerm, setSearchTerm, addToCart } = useApp()

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const categories = [...new Set(products.map((p) => p.category))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-violet-100 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-300/20 to-pink-300/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-violet-300/20 to-purple-300/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

      <ClientHeader />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-full text-purple-800 text-sm font-semibold mb-6 shadow-lg backdrop-blur-sm">
            <Sparkles size={18} className="mr-2" />
            Colección Premium de Jabones Naturales
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-purple-800 bg-clip-text text-transparent mb-6">
            Nuestra Colección Exclusiva
          </h2>
          <p className="text-gray-700 text-xl max-w-3xl mx-auto leading-relaxed">
            Descubre jabones artesanales creados con ingredientes botánicos selectos y la tradición italiana más
            auténtica
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-purple-400" size={22} />
              <input
                type="text"
                placeholder="Busca tu jabón perfecto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white/80 backdrop-blur-lg border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-xl text-lg placeholder-purple-400"
              />
            </div>
            <div className="flex space-x-4">
              <button className="px-6 py-4 bg-white/80 backdrop-blur-lg border-2 border-purple-200 rounded-2xl hover:bg-white hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex items-center space-x-3 text-purple-700 font-semibold">
                <Filter size={22} />
                <span className="hidden sm:inline">Filtros</span>
              </button>
              <button className="px-6 py-4 bg-white/80 backdrop-blur-lg border-2 border-purple-200 rounded-2xl hover:bg-white hover:shadow-xl hover:border-purple-300 transition-all duration-300 text-purple-700">
                <Grid size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Categorías Especializadas</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSearchTerm("")}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 text-white rounded-2xl hover:from-purple-700 hover:via-violet-700 hover:to-purple-800 transition-all duration-300 font-bold shadow-xl hover:shadow-purple-500/25 transform hover:scale-105"
            >
              Todos los Productos
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSearchTerm(category)}
                className="px-8 py-4 bg-white/80 backdrop-blur-lg border-2 border-purple-200 text-purple-700 rounded-2xl hover:bg-white hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 font-semibold transform hover:scale-105"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 border border-white/50 overflow-hidden hover:border-purple-200 transform hover:scale-[1.03]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="absolute top-4 right-4">
                  <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 group">
                    <Heart size={20} className="text-purple-600 group-hover:text-red-500 group-hover:fill-current" />
                  </button>
                </div>

                {product.stock < 10 && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl animate-pulse">
                    ¡Últimas unidades!
                  </div>
                )}

                <div className="absolute bottom-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-purple-600 flex items-center">
                      <Leaf size={12} className="mr-1" />
                      100% Natural
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-purple-600 bg-purple-100 px-4 py-2 rounded-full border border-purple-200">
                    {product.category}
                  </span>
                  {product.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="text-yellow-400 fill-current" size={18} />
                      <span className="text-sm font-bold text-gray-700">{product.rating}</span>
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 mb-3 text-xl group-hover:text-purple-600 transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">{product.description}</p>

                <div className="flex items-center text-sm text-purple-600 mb-6 font-semibold">
                  <Sparkles size={16} className="mr-2" />
                  <span>Stock: {product.stock} unidades disponibles</span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                      ${product.price}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">USD</span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 text-white px-8 py-3 rounded-2xl font-bold hover:from-purple-700 hover:via-violet-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-purple-500/25 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {product.stock === 0 ? "Agotado" : "Agregar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
