"use client"

import { useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth, db } from "@/backend/firebase"
import { useApp } from "../context/AppContext"
import Image from "next/image"

const GoogleLoginButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { navigateTo, setUser } = useApp()

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    const provider = new GoogleAuthProvider()

    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log("Usuario autenticado:", user)

      // Actualiza el contexto con datos del usuario
      setUser({
        id: user.uid,
        nombre: user.displayName ?? "",
        email: user.email ?? "",
        photoURL: user.photoURL ?? "",
        celular: "",
        dirección: "",
        rol: "client",
      })

      await guardarDatosUsuario(user, navigateTo, setUser)
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

async function guardarDatosUsuario(
  user: any,
  navigateTo: (path: string) => void,
  setUser: (user: any) => void
) {
  if (!user) return

  try {
    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const data = userSnap.data()
      const rol = data.type || "client"

      // Solo permitir ingreso si el usuario es "client" o "admin"
      if (rol !== "client" && rol !== "admin") {
        console.warn("Rol no autorizado:", rol)
        navigateTo("no-autorizado")
        return
      }

      const userData = {
        id: user.uid,
        nombre: data.nombre ?? user.displayName ?? "",
        email: data.email ?? user.email ?? "",
        photoURL: data.photoURL ?? user.photoURL ?? "",
        celular: data.celular ?? "",
        dirección: data.dirección ?? "",
        rol,
      }

      setUser(userData)

      if (rol === "admin") {
        navigateTo("admin-dashboard")
      } else {
        navigateTo("catalog")
      }

    } else {
      // Usuario NO existe → lanzar error si intenta ser admin
      console.error("El usuario no está registrado en Firestore.")
      navigateTo("no-autorizado")
    }
  } catch (error) {
    console.error("Error verificando el usuario:", error)
    navigateTo("no-autorizado")
  }
}



export default GoogleLoginButton
