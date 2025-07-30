
"use client"

import React, { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Upload, Loader2 } from "lucide-react"
import { AdminHeader } from "../AdminHeader"
import "./AdminProducts.css"
import { useApp } from "../../../context/AppContext"
import AgregarModal from "./agregarModal"
import {getAuth, onAuthStateChanged} from "firebase/auth"
import { getFirestore, doc, collection, getDocs } from "firebase/firestore"
import {app} from "../../../backend/firebase"

interface Product {
  id: string
  name: string
  price: number
  description: string
  color: string
  fragance: string
  stock: number
  image: string
}

export const VenderComoAdmin = () => {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [productos, setProductos] = useState<Product[]>([])
  const { navigateTo } = useApp()

  const manejarAgregarProducto = (nuevoProducto: Product) => {
    console.log("Producto agregado:", nuevoProducto)
    setProductos(prev => [...prev, nuevoProducto])
  }

  // 🔥 FUNCION PARA CARGAR PRODUCTOS DE FIREBASE
  const cargarProductosDesdeFirebase = async (uid: string) => {
  try {
    const db = getFirestore(app)
    const ref = collection(db, "ventasAdministrador", uid, "itemJabones")
    const snapshot = await getDocs(ref)

    console.log(`✅ Se encontraron ${snapshot.docs.length} productos en Firebase:`)

    const items: Product[] = snapshot.docs.map((doc, index) => {
      const data = doc.data()
      console.log(`📦 Producto [${index + 1}] ID: ${doc.id}`, data)

      return {
        id: doc.id,
        name: data.nombre || "Sin nombre",
        price: data.precio || 0,
        description: data.descripcion || "",
        color: data.color || "",
        fragance: data.aroma || "",
        stock: data.cantidad || 0,
        image: data.imageUrl || "/placeholder.svg"
      }
    })

    setProductos(items)
  } catch (error: any) {
    console.error("❌ Error al cargar productos desde Firebase:", error.message)
    alert("Ocurrió un error al cargar los productos. Revisa la consola para más detalles.")
  }
}


  // 📌 Obtener el usuario y cargar datos
 useEffect(() => {
  const auth = getAuth(app)
  const unsubscribe = onAuthStateChanged(auth, user => {
    if (user) {
      console.log("🔐 Usuario autenticado:", user.uid)
      cargarProductosDesdeFirebase(user.uid)
    } else {
      console.warn("⚠️ No hay usuario autenticado")
    }
  })

  return () => unsubscribe()
}, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-purple-100">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Gestión de Productos
            </h2>
            <p className="text-gray-600">Administra tu inventario</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigateTo("admin-dashboard")}
              className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              Regresar
            </button>
            <button
              onClick={() => setModalAbierto(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Agregar Producto</span>
            </button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-cyan-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">Producto</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">Precio</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">Aroma/Color</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {productos.map((product) => (
                  <tr key={product.id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50">
                    <td className="px-6 py-4 flex items-center">
                      <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl mr-4 shadow-lg object-cover" />
                      <div>
                        <div className="text-lg font-bold text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-600 max-w-xs truncate">{product.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-purple-700">Bs. {product.price}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">{product.fragance} / {product.color}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button className="text-blue-600 hover:text-blue-800"><Edit2 size={18} /></button>
                        <button className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <AgregarModal
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
          onAgregar={manejarAgregarProducto}
        />
      </div>
    </div>
  )
}