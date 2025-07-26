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

      if (data.rol === "client") {
        // ✅ Usuario válido con rol cliente y datos completos
        setUser({
          id: user.uid,
          nombre: data.nombre ?? user.displayName ?? "",
          email: data.email ?? user.email ?? "",
          photoURL: data.photoURL ?? user.photoURL ?? "",
          rol: "client",
          celular: data.celular ?? "",
          dirección: data.dirección ?? "",
        })
        navigateTo("catalog")
      } else {
        // ❌ Usuario tiene otro rol o no es cliente
        console.log("Usuario no es cliente, redirigiendo...")
        navigateTo("no-autorizado") // puedes crear esta vista si quieres
      }
    } else {
      // 🆕 Usuario no existe aún: redirige a completar registro
      setUser({
        id: user.uid,
        nombre: user.displayName ?? "",
        email: user.email ?? "",
        photoURL: user.photoURL ?? "",
        rol: "client", // por si quieres usarlo después
        celular: "",
        dirección: "",
      
      })
      navigateTo("completar-registro")
      console.log("Usuario nuevo, redirigiendo a completar registro.")
    }
  } catch (error) {
    console.error("Error guardando usuario:", error)
  }
}


export default GoogleLoginButton
