"use client"

import { useState } from "react"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/backend/firebase"
import { useApp } from "../context/AppContext"

type Props = {
  datosUsuario: {
    id: string
    nombre: string
    email: string
    telefono: string
    direccion: string
  }
  onTerminar: () => void
}

const TerminarRegistrarButton: React.FC<Props> = ({ datosUsuario, onTerminar }) => {
  const [error, setError] = useState<string | null>(null)
  const { completarDatosGoogle } = useApp()

  const registrar = async (event: React.MouseEvent<HTMLButtonElement>) => {
  

    try {
      const userRef = doc(db, "users", datosUsuario.id)

      await setDoc(userRef, {
        nombre: datosUsuario.nombre,
        email: datosUsuario.email,
        celular: datosUsuario.telefono,
        direccion: datosUsuario.direccion,
        rol: "client",

     
        creadoEn: new Date()
      })
      onTerminar()
    } catch (err) {
      console.error("Error al registrar:", err)
      setError("Hubo un problema al guardar tus datos.")
    }
  }

  return (
    <div>
      <button
        type="submit"
        onClick={registrar}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Crear cuenta
      </button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}

export default TerminarRegistrarButton
