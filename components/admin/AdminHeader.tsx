"use client"

import type React from "react"
import { useApp } from "../../context/AppContext"

export const AdminHeader: React.FC = () => {
  const { currentUser, logout } = useApp()

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
            <p className="text-gray-300 text-sm">L'ERBOLARIO Dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-300">Bienvenido,</p>
              <p className="font-medium">{currentUser?.name}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
