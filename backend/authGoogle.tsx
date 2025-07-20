"use client"

import { useState } from "react"
import { doc, setDoc, getDoc} from "firebase/firestore"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth, db } from "@/backend/firebase"
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
        guardarDatosUsuario(user) // Función para guardar datos del usuario en tu base de datos o contexto

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

async function guardarDatosUsuario(user: any) {
  if (!user) return

  try {
    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      // El usuario ya está en la base, revisamos los datos
      const data = userSnap.data()

      // Verifica que los campos que te importan no estén vacíos o nulos
      if (
        data.name && data.email && data.photoURL // agrega más campos si quieres
      ) {
        console.log("Usuario ya registrado y con datos completos.")
        return // No hace falta guardar nada más
      } else {
        console.log("Usuario registrado pero con datos incompletos, actualizando...")
        // Actualiza sólo los campos que falten o que quieras refrescar
        await setDoc(
          userRef,
          {
            nombre: user.displayName || data.nombre,
            email: user.email || data.email,
            photoURL: user.photoURL || data.photoURL,
            telefono: data.telefono || "", // Si tienes un campo de teléfono
            direccion: data.direccion || "", // Si tienes un campo de dirección
            emailVerified: user.emailVerified,
            updatedAt: new Date().toISOString(),
          },
          { merge: true } // merge para no sobreescribir campos existentes
        )
        return
      }
    } else {
      // No existe, crea nuevo documento con todos los datos
      await setDoc(userRef, {
        uid: user.uid,
        nombre: user.displayName,
        email: user.email,
        telefono: "", // Puedes agregar un campo de teléfono si lo necesitas
        rol: "cliente", // O el rol que quieras asignar
        direccion:"",
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        createdAt: new Date().toISOString(),
      })
      console.log("Usuario guardado en Firestore.")
    }
  } catch (error) {
    console.error("Error guardando usuario:", error)
  }
}



export default GoogleLoginButton
