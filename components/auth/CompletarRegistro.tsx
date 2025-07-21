"use client"

import type React from "react"
import { useState } from "react"
import { Plus } from "lucide-react"
import { useApp } from "@/context/AppContext"
import TerminarRegistrarButton from "../../backend/endRegistroFire"


export const CompletedRegisterForm: React.FC = () => {
  const { setUsers, setCurrentUser, setUserType, navigateTo, datosUsuariosGoogle, setCompleteDatosGoogle  } = useApp()
  const [name, setName] = useState("")
  const [Number, setNumber] = useState("")
  const [dirección, setDirección] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    function terminarRegistro() {

    }

    if(dirección.trim() === "") {
      setError("La dirección es obligatoria")
      return

    }
    if (Number.length < 8) {
      setError("El número de celular debe tener al menos 10 dígitos")
      return
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      type: "client" as const,
    }

    setUsers((prev) => [...prev, newUser])
    setCurrentUser(newUser)
    setUserType("client")
    navigateTo("catalog")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
           <img
              src={datosUsuariosGoogle?.photoURL || "/default-avatar.png"}
              alt="Avatar"
              className="w-12 h-12 rounded-full"
            />
            </div>
          <h2 className="text-2xl font-bold text-gray-900">Completar Datos de la Cuenta</h2>
          <p className="text-gray-600 mt-2">Únete a nuestra comunidad</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
            <input
              type="text"
              value={datosUsuariosGoogle?.nombre || name}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
            <input
              type="email"
              value={datosUsuariosGoogle?.email || email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Celular</label>
            <input
               type="text"
                inputMode="numeric" // Sugiere teclado numérico en móvil
                pattern="[0-9]*"     // Valida solo números
              value={Number}
                onChange={(e) => {
                    const value = e.target.value
                  if (/^\d*$/.test(value)) setNumber(value)
                }}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Tu número de celular"
                           required
            />

          </div>
          <div> 
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            <input
              type="text"
              value={dirección}
              onChange={(e) => setDirección(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tu dirección"
              required
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

        <TerminarRegistrarButton
          datosUsuario={{
            id: datosUsuariosGoogle?.id || Date.now().toString(),
            nombre: datosUsuariosGoogle?.nombre || name,
            email: datosUsuariosGoogle?.email || email,
            telefono: Number,
            direccion: dirección,
          }}
          onTerminar={() => {
            setCompleteDatosGoogle({
              celular: Number,
              dirección: dirección,
            })
            navigateTo("catalog")
          }}
        />
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => navigateTo("client-login")} className="text-blue-600 hover:text-blue-700 font-medium">
            ¿Ya tienes cuenta? Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  )
}
