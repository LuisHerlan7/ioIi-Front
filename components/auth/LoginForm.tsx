"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, User, Mail, Lock, Sparkles, AlignCenter } from "lucide-react"
import { useApp } from "../../context/AppContext"
import GoogleLoginButton from "@/backend/authGoogle"
import { auth, db } from "@/backend/firebase"
import {signInWithEmailAndPassword} from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

interface LoginFormProps {
  type: "client" | "admin"
}

export const LoginForm: React.FC<LoginFormProps> = ({ type }) => {
  const { users, setCurrentUser, setUserType, navigateTo } = useApp()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setError("")

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user

    // Traer info completa desde Firestore
    const userRef = doc(db, "users", firebaseUser.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      setError("Usuario no registrado en la base de datos")
      return
    }

    const userData = userSnap.data()
    if (userData.type !== type && userData.rol !== type) {
      setError("Este usuario no tiene permisos como " + type)
      return
    }

    // Login exitoso
    setCurrentUser({
      uid: firebaseUser.uid,
      name: firebaseUser.displayName ?? userData.name,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL ?? userData.photoURL ?? null,
      type: userData.type ?? userData.rol ?? "client",
    })
    setUserType(userData.type ?? userData.rol ?? "client")
    navigateTo(type === "admin" ? "admin-dashboard" : "catalog")
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      setError("Usuario no encontrado")
    } else if (error.code === "auth/wrong-password") {
      setError("Contraseña incorrecta")
    } else {
      setError("Error al iniciar sesión: " + error.message)
    }
  }
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-violet-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-violet-300/20 to-purple-300/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 w-full max-w-lg border-2 border-white/50 relative z-10">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-600 via-violet-600 to-purple-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            {type === "admin" ? (
              <User className="text-white" size={36} />
            ) : (
              <Sparkles className="text-white" size={36} />
            )}
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-purple-800 bg-clip-text text-transparent mb-3">
            {type === "admin" ? "Panel Administrativo" : "¡Bienvenida!"}
          </h2>
          <p className="text-gray-600 text-lg">
            {type === "admin" ? "Acceso exclusivo para administradores" : "Inicia sesión en tu cuenta L'ERBOLARIO"}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-purple-700">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={22} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-6 py-4 border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-purple-50/50 text-lg placeholder-purple-400"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-purple-700">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={22} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-14 py-4 border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-purple-50/50 text-lg placeholder-purple-400"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-600 px-6 py-4 rounded-2xl text-sm font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-purple-700 hover:via-violet-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-[1.02] shadow-2xl hover:shadow-purple-500/25"
          >
            Ingresar
          </button>
          <p className="text-gray-600 text-sm" style={{ textAlign: "center" }}>O</p>
          <div className="flex justify-center items-center h-screen bg-white-100" style={{ marginTop: "20px", height: "50px", width: "100%" }}>
            <GoogleLoginButton />
          </div>
        </form>

        {type === "client" && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigateTo("register")}
              className="text-purple-600 hover:text-purple-700 font-bold text-lg transition-colors"
            >
              ¿No tienes cuenta? Crear cuenta nueva
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigateTo("home")}
            className="text-purple-500 hover:text-purple-700 text-sm transition-colors font-semibold"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  )
  function handleLogineFirebase(e: React.FormEvent) {
    e.preventDefault()
    // Implement Firebase login logic here

  }
    
  
}
