"use client"

import type React from "react"
import { useApp } from "@/context/AppContext"
import { AdminHeader } from "./AdminHeader"

export const AdminOrders: React.FC = () => {
  const { orders, navigateTo } = useApp()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-purple-100">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Detalle de Pedidos
            </h2>
            <p className="text-gray-600">Gestiona todos los pedidos de clientes</p>
          </div>
          <button
            onClick={() => navigateTo("admin-dashboard")}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            ← Volver al Dashboard
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-cyan-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    ID Pedido
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Productos
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-purple-600">#{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{order.clientName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.product.id} className="text-sm text-gray-700">
                            <span className="font-medium">{item.product.name}</span> x{item.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                        ${order.total}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{order.date}</td>
                    <td className="px-6 py-4">
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
