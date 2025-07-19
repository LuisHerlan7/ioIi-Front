"use client"

import type React from "react"
import { useState } from "react"
import { Edit2, User } from "lucide-react"
import { useApp } from "../../context/AppContext"
import { ClientHeader } from "../shared/ClientHeader"

export const ProfileView: React.FC = () => {
  const { currentUser, setUsers, setCurrentUser } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(
    currentUser || { id: "", name: "", email: "", password: "", type: "client" as const },
  )

  const saveProfile = () => {
    setUsers((prev) => prev.map((u) => (u.id === editedUser.id ? editedUser : u)))
    setCurrentUser(editedUser)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <ClientHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Mi Perfil
            </h2>
            <p className="text-gray-600">Gestiona tu información personal</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{currentUser?.name}</h3>
              <p className="text-gray-600">{currentUser?.email}</p>
            </div>

            {isEditing ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Nombre completo</label>
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Correo electrónico</label>
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={saveProfile}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Guardar cambios
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl p-4 border border-purple-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                    <p className="text-lg font-semibold text-gray-900">{currentUser?.name}</p>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-50 to-indigo-50 rounded-xl p-4 border border-cyan-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <p className="text-lg font-semibold text-gray-900">{currentUser?.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                >
                  <Edit2 size={20} />
                  <span>Editar perfil</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
