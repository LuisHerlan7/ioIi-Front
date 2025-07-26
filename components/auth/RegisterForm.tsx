"use client"

import type React from "react"
import { useState } from "react"
import { Plus } from "lucide-react"
import { ClientUser, useApp } from "../../context/AppContext"
import RegistrarButton from "@/backend/crearCuenta"
import { auth, db } from "@/backend/firebase"
import { doc, setDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { set } from "react-hook-form"

export const RegisterForm: React.FC = () => {
  const { users, setUsers, setCurrentUser, setUserType, navigateTo } = useApp()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [number, setNumber] = useState("")
  const [direccion, setDireccion] = useState("")

 const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault()

  setError("")

  if (password !== confirmPassword) {
    setError("Las contraseñas no coinciden")
    return
  }

  if (users.find((u) => u.email === email)) {
    setError("El correo ya está registrado")
    return
  }

  try {
    // 1. Crear usuario con Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    console.log("nombre", name)
    // 2. Guardar en Firestore (colección "clients")
    const clientData: ClientUser = {
      uid: user.uid,
      name: name.trim(),
      email,
      photoURL: user.photoURL ?? null,
      type: "client",
      number,
      direccion,
    }

    await setDoc(doc(db, "users", user.uid), clientData)

    // 3. Actualizar el contexto de tu app
    setUsers([...users, clientData])
    setCurrentUser(clientData)
    setUserType("client")
    navigateTo("catalog")
  } catch (err: any) {
    console.error(err)
    setError("Error al registrar: " + err.message)
  }
}

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="text-green-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Crear Cuenta</h2>
          <p className="text-gray-600 mt-2">Únete a nuestra comunidad</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Celular</label>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="tu numero de celular"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Direccion</label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="tu direccion"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
          Crear cuenta
          </button>

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
