"use client"

import type React from "react"
import { BarChart3, Package, FileText, TrendingUp, DollarSign } from "lucide-react"
import { useApp } from "../../context/AppContext"
import { AdminHeader } from "./AdminHeader"

export const AdminDashboard: React.FC = () => {
  const { navigateTo, products, orders } = useApp()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            <TrendingUp size={16} className="mr-2" />
            Panel de Control
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Dashboard Principal
          </h2>
          <p className="text-gray-600 text-lg">Gestiona tu tienda desde un solo lugar con herramientas avanzadas</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Package className="text-white" size={24} />
              </div>
              <span className="text-blue-100 text-sm font-medium">+12%</span>
            </div>
            <h4 className="text-lg font-semibold mb-1">Productos</h4>
            <p className="text-3xl font-bold">{products.length}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FileText className="text-white" size={24} />
              </div>
              <span className="text-green-100 text-sm font-medium">+8%</span>
            </div>
            <h4 className="text-lg font-semibold mb-1">Pedidos</h4>
            <p className="text-3xl font-bold">{orders.length}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="text-white" size={24} />
              </div>
              <span className="text-purple-100 text-sm font-medium">+15%</span>
            </div>
            <h4 className="text-lg font-semibold mb-1">Ingresos</h4>
            <p className="text-3xl font-bold">${orders.reduce((sum, order) => sum + order.total, 0)}</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-white" size={24} />
              </div>
              <span className="text-red-100 text-sm font-medium">-2</span>
            </div>
            <h4 className="text-lg font-semibold mb-1">Stock Bajo</h4>
            <p className="text-3xl font-bold">{products.filter((p) => p.stock < 10).length}</p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <button
            onClick={() => navigateTo("admin-reports")}
            className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left border border-white/50 hover:border-blue-200 transform hover:scale-[1.02]"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <BarChart3 className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
              Reportes de Ventas
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Analiza el rendimiento de tu tienda con estadísticas detalladas, gráficos interactivos y reportes en
              tiempo real
            </p>
            <div className="mt-4 text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
              Ver reportes →
            </div>
          </button>

          <button
            onClick={() => navigateTo("admin-products")}
            className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left border border-white/50 hover:border-green-200 transform hover:scale-[1.02]"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Package className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
              Gestión de Productos
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Administra tu inventario completo, actualiza precios, gestiona stock y optimiza tu catálogo de productos
            </p>
            <div className="mt-4 text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
              Gestionar productos →
            </div>
          </button>

          <button
            onClick={() => navigateTo("admin-orders")}
            className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left border border-white/50 hover:border-purple-200 transform hover:scale-[1.02]"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <FileText className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
              Detalle de Pedidos
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Revisa, procesa y gestiona todos los pedidos de tus clientes con herramientas avanzadas de seguimiento
            </p>
            <div className="mt-4 text-purple-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
              Ver pedidos →
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
