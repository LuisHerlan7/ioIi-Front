"use client"

import { useState } from "react"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/backend/firebase"
import { useApp } from "../context/AppContext"
import Image from "next/image"

const GoogleLoginButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { navigateTo } = useApp()

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    const provider = new GoogleAuthProvider()

    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log("Usuario autenticado:", user)

      // Puedes guardar el usuario en tu contexto, o hacer lógica extra
        console.log("UID:", user.uid)                         // ID único del usuario
console.log("Nombre:", user.displayName)              // Nombre del usuario
console.log("Email:", user.email)                     // Correo electrónico
console.log("Foto:", user.photoURL)                   // URL de la foto de perfil
console.log("Verificado:", user.emailVerified)        // true/false
console.log("Proveedor:", user.providerId)            // 'google.com'
console.log("Teléfono:", user.phoneNumber)            // null (no se obtiene por Google)
console.log("Token:", await user.getIdToken())        // Token JWT de autenticación

      navigateTo("catalog")// Redirigir al catálogo después del login exitoso
    } catch (err: any) {
      console.error("Error en login con Google:", err)
      setError("Hubo un problema al iniciar sesión.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 disabled:opacity-50"
      >
        <Image src="/google.png" alt="Google Logo" width={24} height={24} />
        {loading ? "Cargando..." : "Iniciar sesión con Google"}
      </button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}

export default GoogleLoginButton
