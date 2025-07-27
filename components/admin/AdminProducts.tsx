"use client"

import type React from "react"
import { useState, type ChangeEvent, useEffect } from "react"
import { Plus, Edit2, Trash2, Upload, Loader2 } from "lucide-react"
import { useApp } from "../../context/AppContext"
import { AdminHeader } from "./AdminHeader"
import type { Product } from "../../utils/firestoreProducts"
import { db } from "../../backend/firebase"
import { doc, setDoc, collection, addDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore"
import { uploadImageToCloudinary } from "../../utils/cloudinaryUpload"

// Estilos CSS personalizados para móviles
const mobileStyles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  @media (max-width: 768px) {
    .product-card {
      transition: transform 0.2s ease-in-out;
    }
    
    .product-card:active {
      transform: scale(0.98);
    }
  }
`


// Interfaz para el estado del nuevo producto/producto en edición
interface ProductFormState {
  name: string
  price: number
  description: string
  category: string
  stock: number
  image: string // Para la URL de la imagen
}

// Interfaz extendida para productos con Firebase ID
interface ProductWithFirebase extends Product {
  firebaseId?: string
}
export const AdminProducts: React.FC = () => {
  const { products, setProducts, navigateTo } = useApp()
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    description: "",
    category: "",
    stock: 0,
    image: "",
  })

  const [newProductImageFile, setNewProductImageFile] = useState<File | null>(null)
  const [editingProductImageFile, setEditingProductImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>("")
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [updatingProduct, setUpdatingProduct] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<string | null>(null)
  const [editFormErrors, setEditFormErrors] = useState<string[]>([])
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [addFormErrors, setAddFormErrors] = useState<string[]>([])
  const [showAddErrorModal, setShowAddErrorModal] = useState(false)

  // Cargar productos desde Firebase al montar el componente
  useEffect(() => {
    loadProductsFromFirebase()
  }, [])

  const loadProductsFromFirebase = async () => {
    setLoadingProducts(true)
    try {
      const querySnapshot = await getDocs(collection(db, "products"))
      const firebaseProducts: ProductWithFirebase[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        firebaseProducts.push({
          id: doc.id,
          firebaseId: doc.id,
          name: data.name || "",
          price: data.price || 0,
          description: data.description || "",
          category: data.category || "",
          stock: data.stock || 0,
          image: data.image || "/placeholder.svg",
          rating: data.rating || 4.5,
          createdAt: data.createdAt || new Date().toISOString(),
        })
      })
      
      console.log("Productos cargados desde Firebase:", firebaseProducts.length)
      setProducts(firebaseProducts)
    } catch (error) {
      console.error("Error al cargar productos desde Firebase:", error)
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>, type: "new" | "edit") => {
    if (e.target.files && e.target.files[0]) {
      if (type === "new") {
        setNewProductImageFile(e.target.files[0])
      } else {
        setEditingProductImageFile(e.target.files[0])
      }
    }
  }

  const uploadImageAndSaveToFirebase = async (file: File): Promise<string> => {
    setUploading(true)
    setUploadProgress("Subiendo imagen a Cloudinary...")
    
    try {
      // Subir imagen a Cloudinary
      const imageUrl = await uploadImageToCloudinary(file)
      setUploadProgress("Imagen subida exitosamente ✓")
      
      return imageUrl
    } catch (error) {
      console.error("Error al subir imagen:", error)
      setUploadProgress("Error al subir imagen ❌")
      throw error
    } finally {
      setUploading(false)
    }
  }

  const addProduct = async () => {
    // Validar formulario antes de proceder
    const errors = validateAddForm(newProduct)
    
    if (errors.length > 0) {
      setAddFormErrors(errors)
      setShowAddErrorModal(true)
      return
    }
    
    // Limpiar errores si la validación pasa
    setAddFormErrors([])
    
    try {
      let imageUrl = "/placeholder.svg?height=300&width=300"
      
      // Si hay una imagen seleccionada, subirla a Cloudinary
      if (newProductImageFile) {
        imageUrl = await uploadImageAndSaveToFirebase(newProductImageFile)
      }

              const productId = Date.now().toString()
        const product: ProductWithFirebase = {
          id: productId,
          ...newProduct,
          image: imageUrl,
          rating: 4.5,
          createdAt: new Date().toISOString(),
        }

        // Guardar en Firebase
        try {
          const productData = {
            name: newProduct.name,
            price: newProduct.price,
            description: newProduct.description,
            category: newProduct.category,
            stock: newProduct.stock,
            image: imageUrl,
            rating: 4.5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          
          const docRef = await addDoc(collection(db, "products"), productData)
          console.log("Producto guardado en Firebase exitosamente con ID:", docRef.id)
          
          // Actualizar el producto con el ID de Firebase
          product.firebaseId = docRef.id
        } catch (firebaseError) {
          console.error("Error al guardar en Firebase:", firebaseError)
          alert("Error al guardar en la base de datos. El producto se guardó localmente.")
        }

      // Actualizar estado local
      setProducts((prev) => [...prev, product])
      setNewProduct({ name: "", price: 0, description: "", category: "", stock: 0, image: "" })
      setNewProductImageFile(null)
      setIsAddingProduct(false)
      setUploadProgress("")
      setAddFormErrors([])
      setShowAddErrorModal(false)
      
    } catch (error) {
      console.error("Error al agregar producto:", error)
      alert("Error al agregar el producto. Por favor intenta de nuevo.")
      setAddFormErrors([])
      setShowAddErrorModal(false)
    }
  }

  const updateProduct = async () => {
    if (editingProduct) {
      // Validar formulario antes de proceder
      const errors = validateEditForm(editingProduct)
      
      if (errors.length > 0) {
        setEditFormErrors(errors)
        setShowErrorModal(true)
        return
      }
      
      // Limpiar errores si la validación pasa
      setEditFormErrors([])
      setUpdatingProduct(true)
      
      try {
        let imageUrl = editingProduct.image
        
        // Si hay una nueva imagen seleccionada, subirla a Cloudinary
        if (editingProductImageFile) {
          imageUrl = await uploadImageAndSaveToFirebase(editingProductImageFile)
        }

        // Actualizar en Firebase si el producto tiene firebaseId
        if (editingProduct.firebaseId) {
          const productRef = doc(db, "products", editingProduct.firebaseId)
          const updateData = {
            name: editingProduct.name,
            price: editingProduct.price,
            description: editingProduct.description,
            category: editingProduct.category,
            stock: editingProduct.stock,
            image: imageUrl,
            updatedAt: new Date().toISOString(),
          }
          
          await updateDoc(productRef, updateData)
          console.log("Producto actualizado en Firebase exitosamente")
        }

        // Actualizar estado local con la nueva imagen
        const updatedProduct = {
          ...editingProduct,
          image: imageUrl,
        }
        
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p)))
        setEditingProduct(null)
        setEditingProductImageFile(null)
        setEditFormErrors([])
        setShowErrorModal(false)
        
      } catch (error) {
        console.error("Error al actualizar producto en Firebase:", error)
        alert("Error al actualizar en la base de datos. Los cambios se guardaron localmente.")
        
        // Aún actualizar el estado local aunque falle Firebase
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? editingProduct : p)))
        setEditingProduct(null)
        setEditingProductImageFile(null)
        setEditFormErrors([])
        setShowErrorModal(false)
      } finally {
        setUpdatingProduct(false)
      }
    }
  }

  const validateEditForm = (product: any): string[] => {
    const errors: string[] = []
    
    if (!product.name || product.name.trim() === '') {
      errors.push('El nombre del producto es obligatorio')
    }
    
    if (!product.category || product.category.trim() === '') {
      errors.push('La categoría del producto es obligatoria')
    }
    
    if (product.price <= 0) {
      errors.push('El precio debe ser mayor a 0')
    }
    
    if (product.stock < 0) {
      errors.push('El stock no puede ser negativo')
    }
    
    return errors
  }

  const validateAddForm = (product: any): string[] => {
    const errors: string[] = []
    
    if (!product.name || product.name.trim() === '') {
      errors.push('El nombre del producto es obligatorio')
    }
    
    if (!product.category || product.category.trim() === '') {
      errors.push('La categoría del producto es obligatoria')
    }
    
    if (product.price <= 0) {
      errors.push('El precio debe ser mayor a 0')
    }
    
    if (product.stock < 0) {
      errors.push('El stock no puede ser negativo')
    }
    
    return errors
  }

  const deleteProduct = async (id: string) => {
    setDeletingProduct(id)
    try {
      // Encontrar el producto para obtener su firebaseId
      const productToDelete = products.find(p => p.id === id)
      
      if (productToDelete?.firebaseId) {
        // Eliminar de Firebase
        const productRef = doc(db, "products", productToDelete.firebaseId)
        await deleteDoc(productRef)
        console.log("Producto eliminado de Firebase exitosamente")
      }

      // Eliminar del estado local
      setProducts((prev) => prev.filter((p) => p.id !== id))
      
    } catch (error) {
      console.error("Error al eliminar producto de Firebase:", error)
      alert("Error al eliminar de la base de datos. El producto se eliminó localmente.")
      
      // Aún eliminar del estado local aunque falle Firebase
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } finally {
      setDeletingProduct(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-purple-100">
      <style dangerouslySetInnerHTML={{ __html: mobileStyles }} />
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
              onClick={() => setIsAddingProduct(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Agregar Producto</span>
            </button>
            <button
              onClick={() => navigateTo("admin-dashboard")}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              ← Volver al Dashboard
            </button>
          </div>
        </div>

        {isAddingProduct && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 border border-white/20">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Plus className="mr-3 text-green-600" size={24} />
              Agregar Nuevo Producto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Nombre del producto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: iPhone 15 Pro"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    addFormErrors.some(error => error.includes('nombre')) 
                      ? 'border-red-300 focus:ring-red-400' 
                      : 'border-gray-200 focus:ring-purple-400'
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Precio <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="999"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, price: Number(e.target.value) }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    addFormErrors.some(error => error.includes('precio')) 
                      ? 'border-red-300 focus:ring-red-400' 
                      : 'border-gray-200 focus:ring-purple-400'
                  }`}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Electrónicos"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    addFormErrors.some(error => error.includes('categoría')) 
                      ? 'border-red-300 focus:ring-red-400' 
                      : 'border-gray-200 focus:ring-purple-400'
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="50"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, stock: Number(e.target.value) }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    addFormErrors.some(error => error.includes('stock')) 
                      ? 'border-red-300 focus:ring-red-400' 
                      : 'border-gray-200 focus:ring-purple-400'
                  }`}
                  min="0"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Imagen del Producto</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-all duration-200 bg-white/50 backdrop-blur-sm">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileChange(e, "new")}
                    className="hidden"
                    id="product-image-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="product-image-upload" className={`cursor-pointer ${uploading ? 'pointer-events-none opacity-50' : ''}`}>
                    {uploading ? (
                      <div className="space-y-2">
                        <div className="w-16 h-16 mx-auto bg-purple-100 rounded-lg flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                        </div>
                        <p className="text-sm text-purple-600 font-medium">{uploadProgress}</p>
                      </div>
                    ) : newProductImageFile ? (
                      <div className="space-y-2">
                        <img
                          src={URL.createObjectURL(newProductImageFile)}
                          alt="Vista previa"
                          className="w-32 h-32 mx-auto rounded-lg object-cover shadow-lg"
                        />
                        <p className="text-sm text-gray-600">{newProductImageFile.name}</p>
                        <p className="text-xs text-green-600 flex items-center justify-center">
                          <Upload className="w-3 h-3 mr-1" />
                          Imagen seleccionada ✓
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600">Haz clic para subir una imagen</p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG hasta 5MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Descripción</label>
                <textarea
                  placeholder="Descripción detallada del producto..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={addProduct}
                disabled={uploading}
                className={`bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform shadow-lg flex items-center space-x-2 ${
                  uploading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:from-green-700 hover:to-emerald-600 hover:scale-105'
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <span>Guardar Producto</span>
                )}
              </button>
              <button
                onClick={() => {
                  setIsAddingProduct(false)
                  setNewProductImageFile(null)
                  setUploadProgress("")
                  setAddFormErrors([])
                  setShowAddErrorModal(false)
                }}
                disabled={uploading}
                className={`bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  uploading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          {loadingProducts ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600 mb-4" />
              <p className="text-gray-600">Cargando productos desde Firebase...</p>
            </div>
          ) : (
            <>
              {/* Vista Desktop - Tabla */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-50 to-cyan-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50 transition-all duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name || "Producto"}
                              className="w-16 h-16 rounded-xl mr-4 shadow-lg object-cover"
                            />
                            <div>
                              <div className="text-lg font-bold text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-600 max-w-xs truncate">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                                                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                        Bs. {product.price}
                      </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              product.stock < 10
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : "bg-green-100 text-green-700 border border-green-200"
                            }`}
                          >
                            {product.stock} unidades
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-cyan-100 text-purple-700 rounded-full text-sm font-semibold border border-purple-200">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => setEditingProduct(product)}
                              disabled={deletingProduct === product.id}
                              className={`p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 ${
                                deletingProduct === product.id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => product.id && deleteProduct(product.id)}
                              disabled={deletingProduct === product.id}
                              className={`p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 ${
                                deletingProduct === product.id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              {deletingProduct === product.id ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista Móvil - Cards */}
              <div className="md:hidden p-4 space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="product-card bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center flex-1 min-w-0">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name || "Producto"}
                          className="w-16 h-16 rounded-lg mr-3 shadow-md object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-bold text-gray-900 truncate">{product.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-3">
                        <button
                          onClick={() => setEditingProduct(product)}
                          disabled={deletingProduct === product.id}
                          className={`p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 ${
                            deletingProduct === product.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => product.id && deleteProduct(product.id)}
                          disabled={deletingProduct === product.id}
                          className={`p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 ${
                            deletingProduct === product.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {deletingProduct === product.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="text-center">
                        <div className="text-lg font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                          Bs. {product.price}
                        </div>
                        <div className="text-xs text-gray-500">Precio</div>
                      </div>
                      <div className="text-center">
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-semibold mx-auto w-fit ${
                            product.stock < 10
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : "bg-green-100 text-green-700 border border-green-200"
                          }`}
                        >
                          {product.stock}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Stock</div>
                      </div>
                      <div className="text-center">
                        <div className="px-2 py-1 bg-gradient-to-r from-purple-100 to-cyan-100 text-purple-700 rounded-full text-xs font-semibold border border-purple-200 mx-auto w-fit">
                          {product.category}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Categoría</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 w-full max-w-2xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Edit2 className="mr-3 text-purple-600" size={24} />
                Editar Producto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct((prev: any) => (prev ? { ...prev, name: e.target.value } : null))
                    }
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                      editFormErrors.some(error => error.includes('nombre')) 
                        ? 'border-red-300 focus:ring-red-400' 
                        : 'border-gray-200 focus:ring-purple-400'
                    }`}
                    placeholder="Nombre del producto"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Precio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct((prev: any) => (prev ? { ...prev, price: Number(e.target.value) } : null))
                    }
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                      editFormErrors.some(error => error.includes('precio')) 
                        ? 'border-red-300 focus:ring-red-400' 
                        : 'border-gray-200 focus:ring-purple-400'
                    }`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Categoría <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct((prev: any) => (prev ? { ...prev, category: e.target.value } : null))
                    }
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                      editFormErrors.some(error => error.includes('categoría')) 
                        ? 'border-red-300 focus:ring-red-400' 
                        : 'border-gray-200 focus:ring-purple-400'
                    }`}
                    placeholder="Categoría del producto"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct((prev: any) => (prev ? { ...prev, stock: Number(e.target.value) } : null))
                    }
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                      editFormErrors.some(error => error.includes('stock')) 
                        ? 'border-red-300 focus:ring-red-400' 
                        : 'border-gray-200 focus:ring-purple-400'
                    }`}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Descripción</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct((prev: any) => (prev ? { ...prev, description: e.target.value } : null))
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Imagen del Producto</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-all duration-200 bg-white/50 backdrop-blur-sm">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileChange(e, "edit")}
                      className="hidden"
                      id="edit-product-image-upload"
                      disabled={updatingProduct}
                    />
                    <label htmlFor="edit-product-image-upload" className={`cursor-pointer ${updatingProduct ? 'pointer-events-none opacity-50' : ''}`}>
                      {updatingProduct ? (
                        <div className="space-y-2">
                          <div className="w-16 h-16 mx-auto bg-purple-100 rounded-lg flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                          </div>
                          <p className="text-sm text-purple-600 font-medium">Actualizando producto...</p>
                        </div>
                      ) : editingProductImageFile ? (
                        <div className="space-y-2">
                          <img
                            src={URL.createObjectURL(editingProductImageFile)}
                            alt="Vista previa"
                            className="w-32 h-32 mx-auto rounded-lg object-cover shadow-lg"
                          />
                          <p className="text-sm text-gray-600">{editingProductImageFile.name}</p>
                          <p className="text-xs text-green-600 flex items-center justify-center">
                            <Upload className="w-3 h-3 mr-1" />
                            Nueva imagen seleccionada ✓
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                            <Upload className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-600">Haz clic para cambiar la imagen</p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG hasta 5MB</p>
                          {editingProduct.image && editingProduct.image !== "/placeholder.svg" && (
                            <div className="mt-4">
                              <p className="text-xs text-gray-500 mb-2">Imagen actual:</p>
                              <img
                                src={editingProduct.image}
                                alt="Imagen actual"
                                className="w-24 h-24 mx-auto rounded-lg object-cover shadow-md"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={updateProduct}
                  disabled={updatingProduct}
                  className={`flex-1 bg-gradient-to-r from-purple-600 to-cyan-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform shadow-lg flex items-center justify-center space-x-2 ${
                    updatingProduct 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:from-purple-700 hover:to-cyan-600 hover:scale-105'
                  }`}
                >
                  {updatingProduct ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(null)
                    setEditingProductImageFile(null)
                    setEditFormErrors([])
                    setShowErrorModal(false)
                  }}
                  disabled={updatingProduct}
                  className={`flex-1 bg-white border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    updatingProduct 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Error de Validación - Editar */}
        {showErrorModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20">
              <div className="text-center">
                {/* Icono de Error */}
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                
                {/* Título */}
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Campos Requeridos
                </h3>
                
                {/* Mensaje */}
                <p className="text-gray-600 mb-6">
                  Por favor completa todos los campos obligatorios antes de guardar:
                </p>
                
                {/* Lista de Errores */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <ul className="list-disc list-inside space-y-2 text-left">
                    {editFormErrors.map((error, index) => (
                      <li key={index} className="text-red-700 text-sm font-medium">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Botón de Cerrar */}
                <button
                  onClick={() => {
                    setShowErrorModal(false)
                    setEditFormErrors([])
                  }}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Error de Validación - Agregar */}
        {showAddErrorModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20">
              <div className="text-center">
                {/* Icono de Error */}
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                
                {/* Título */}
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Campos Requeridos
                </h3>
                
                {/* Mensaje */}
                <p className="text-gray-600 mb-6">
                  Por favor completa todos los campos obligatorios antes de agregar el producto:
                </p>
                
                {/* Lista de Errores */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <ul className="list-disc list-inside space-y-2 text-left">
                    {addFormErrors.map((error, index) => (
                      <li key={index} className="text-red-700 text-sm font-medium">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Botón de Cerrar */}
                <button
                  onClick={() => {
                    setShowAddErrorModal(false)
                    setAddFormErrors([])
                  }}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
