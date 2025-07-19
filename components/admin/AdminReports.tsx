"use client"

import type React from "react"
import { BarChart3, FileText } from "lucide-react"
import { useApp } from "../../context/AppContext"
import { AdminHeader } from "./AdminHeader"

export const AdminReports: React.FC = () => {
  const { orders, navigateTo } = useApp()
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-purple-100">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Reportes de Ventas
            </h2>
            <p className="text-gray-600">Análisis detallado del rendimiento</p>
          </div>
          <button
            onClick={() => navigateTo("admin-dashboard")}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            ← Volver al Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Ingresos Totales</h3>
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">$</span>
              </div>
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              ${totalRevenue}
            </p>
            <p className="text-green-600 text-sm mt-2">↗ +12% vs mes anterior</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Total de Pedidos</h3>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                <FileText className="text-white" size={20} />
              </div>
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {totalOrders}
            </p>
            <p className="text-blue-600 text-sm mt-2">↗ +8% vs mes anterior</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Valor Promedio</h3>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="text-white" size={20} />
              </div>
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ${avgOrderValue.toFixed(2)}
            </p>
            <p className="text-purple-600 text-sm mt-2">↗ +5% vs mes anterior</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FileText className="mr-3 text-purple-600" size={24} />
            Ventas Recientes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="pb-4 text-left font-semibold text-gray-700">Fecha</th>
                  <th className="pb-4 text-left font-semibold text-gray-700">Cliente</th>
                  <th className="pb-4 text-left font-semibold text-gray-700">Total</th>
                  <th className="pb-4 text-left font-semibold text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50 transition-all duration-200"
                  >
                    <td className="py-4 font-medium text-gray-800">{order.date}</td>
                    <td className="py-4 text-gray-700">{order.clientName}</td>
                    <td className="py-4 font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                      ${order.total}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          order.status === "confirmed"
                            ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                            : order.status === "pending"
                              ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200"
                              : "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {order.status === "confirmed"
                          ? "Confirmado"
                          : order.status === "pending"
                            ? "Pendiente"
                            : "Entregado"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
