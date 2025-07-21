"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { onAuthStateChanged, signOut, type User as FirebaseAuthUser } from "firebase/auth"
import { doc, setDoc, getDoc, type DocumentData } from "firebase/firestore"
import { auth, db } from "../backend/firebase"

// Types
export interface DatosUsuariosGoogle{
  id: string,
  nombre: string,
  email: string,
  photoURL: string,
  celular:string,
  dirección: string,
  rol: "client"
}
export interface CompletarDatosGoogle {
  celular: string,
  dirección: string,
}

import {
  fetchProducts,
  addProduct as addProductFirestore,
  updateProduct as updateProductFirestore,
  deleteProduct as deleteProductFirestore,
  type Product,
} from "../utils/firestoreProducts"
import { fetchCart, saveCart, type Cart, type CartItem } from "../utils/firestoreCarts"
import { uploadImageToCloudinary } from "../utils/cloudinaryUpload"

// Interfaz para el usuario en el contexto
export interface ClientUser extends DocumentData {
  uid: string
  name: string | null
  email: string | null
  photoURL: string | null
  // Usamos 'type' aquí para el rol del usuario, consistente con el campo 'rol' en Firestore.
  type: "client" | "admin" // O el rol que asignes
}

// Interfaz para el contexto de la aplicación
interface AppContextType {
  // State
  currentView: string
  userType: "client" | "admin" | null
  datosUsuariosGoogle: DatosUsuariosGoogle | null
  completarDatosGoogle: CompletarDatosGoogle | null
  currentUser: ClientUser | null
  users: ClientUser[]
  products: Product[]
  cart: Cart // Asegúrate de que sea de tipo 'Cart'
  orders: any[]
  searchTerm: string

  // Actions
  setCurrentView: (view: string) => void
  navigateTo: (view: string) => void
  logout: () => Promise<void>
  setUserType: (type: "client" | "admin" | null) => void
  setCurrentUser: (user: ClientUser | null) => void
  setUsers: React.Dispatch<React.SetStateAction<ClientUser[]>>
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  setCart: React.Dispatch<React.SetStateAction<Cart>> // Asegúrate de que sea de tipo 'Cart'
  setOrders: React.Dispatch<React.SetStateAction<any[]>>
  setSearchTerm: (term: string) => void

  // Funciones CRUD de productos que interactúan con Firestore y Cloudinary
  addProduct: (product: Omit<Product, "id">, imageFile?: File) => Promise<void>
  updateProduct: (product: Product, imageFile?: File) => Promise<void>
  deleteProduct: (id: string) => Promise<void>

  // Funciones de carrito que interactúan con Firestore
  addToCart: (productId: string, quantity: number) => Promise<void>
  updateCartItemQuantity: (productId: string, quantity: number) => Promise<void>
  removeCartItem: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  getCartTotal: () => number
  setUser: (user: DatosUsuariosGoogle) => void
  setCompleteDatosGoogle: (datos: CompletarDatosGoogle) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

interface AppProviderProps {
  children: ReactNode
  currentView: string
  setCurrentView: (view: string) => void
}

export const AppProvider: React.FC<AppProviderProps> = ({
  children,
  currentView,
  setCurrentView,
}: AppProviderProps) => {
  const [userType, setUserType] = useState<"client" | "admin" | null>(null)
  const [currentUser, setCurrentUser] = useState<ClientUser | null>(null)
  const [users, setUsers] = useState<ClientUser[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<Cart>({ userId: "", items: [] }) // Inicializar con estructura de Cart
  const [orders, setOrders] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [datosUsuariosGoogle, setDatosUsuariosGoogle] = useState<DatosUsuariosGoogle | null>(null)
  const [completarDatosGoogle, setCompletarDatosGoogle] = useState<CompletarDatosGoogle | null>(null)

  const navigateTo = (view: string) => {
    setCurrentView(view)
  }
  
  // Función para guardar/actualizar datos del usuario en Firestore
  const guardarDatosUsuario = async (user: FirebaseAuthUser) => {
    if (!user || !user.uid) return

    try {
      const userRef = doc(db, "users", user.uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const data = userSnap.data()
        await setDoc(
          userRef,
          {
            name: user.displayName || data.name,
            email: user.email || data.email,
            photoURL: user.photoURL || data.photoURL,
            emailVerified: user.emailVerified,
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        )
        console.log("Usuario registrado y datos actualizados en Firestore.")
        setCurrentUser({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          type: data.type || data.rol || "client", // Usa 'type' o 'rol' de Firestore
        })
        setUserType(data.type || data.rol || "client") // Usa 'type' o 'rol' de Firestore
      } else {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          type: "client", // Asigna un rol por defecto
          createdAt: new Date().toISOString(),
        })
        console.log("Nuevo usuario guardado en Firestore.")
        setCurrentUser({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          type: "client",
        })
        setUserType("client")
      }
    } catch (error) {
      console.error("Error guardando usuario en Firestore:", error)
    }

  const logout = () => {
    setCurrentUser(null)
    setDatosUsuariosGoogle(null)
    setCompletarDatosGoogle(null)
    setUserType(null)
    setCart([])
    setCurrentView("home")

  }

  // Listener de autenticación de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await guardarDatosUsuario(user)
      } else {
        setCurrentUser(null)
        setUserType(null)
        setCart({ userId: "", items: [] })
        console.log("Usuario deslogueado.")
      }
    })
    return () => unsubscribe()
  }, [])

  // Función de logout que usa Firebase Auth
  const logout = async () => {
    try {
      await signOut(auth)
      navigateTo("home")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  // Cargar productos al iniciar la aplicación
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts()
        setProducts(fetchedProducts)
      } catch (error) {
        console.error("Fallo al cargar productos:", error)
      }
    }
    loadProducts()
  }, [])

  // Cargar carrito del usuario actual cuando el usuario cambia
  useEffect(() => {
    const loadCart = async () => {
      if (currentUser?.uid) {
        try {
          const fetchedCart = await fetchCart(currentUser.uid)
          setCart(fetchedCart)
        } catch (error) {
          console.error("Fallo al cargar el carrito:", error)
        }
      } else {
        setCart({ userId: "", items: [] })
      }
    }
    loadCart()
  }, [currentUser?.uid])

  // Funciones CRUD de Productos (integrando Firestore y Cloudinary)
  const addProduct = async (product: Omit<Product, "id">, imageFile?: File) => {
    try {
      let imageUrl = product.image
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile)
      }
      await addProductFirestore({ ...product, image: imageUrl })
      setProducts(await fetchProducts())
    } catch (error) {
      console.error("Error en addProduct (context):", error)
      throw error
    }
  }

  const updateProduct = async (product: Product, imageFile?: File) => {
    try {
      let imageUrl = product.image
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile)
      }
      await updateProductFirestore({ ...product, image: imageUrl })
      setProducts(await fetchProducts())
    } catch (error) {
      console.error("Error en updateProduct (context):", error)
      throw error
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      await deleteProductFirestore(id)
      setProducts(await fetchProducts())
    } catch (error) {
      console.error("Error al eliminar producto en el contexto:", error)
      throw error
    }
  }

  // Funciones de Carrito (integrando Firestore)
  const addToCart = async (productId: string, quantity: number) => {
    if (!currentUser?.uid) {
      console.warn("No hay usuario logueado para añadir al carrito.")
      return
    }

    const existingItemIndex = cart.items.findIndex((item) => item.productId === productId)
    let updatedItems: CartItem[]

    if (existingItemIndex > -1) {
      updatedItems = cart.items.map((item, index) =>
        index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item,
      )
    } else {
      updatedItems = [...cart.items, { productId, quantity }]
    }

    try {
      await saveCart(currentUser.uid, updatedItems)
      setCart({ ...cart, items: updatedItems })
    } catch (error) {
      console.error("Error al añadir al carrito:", error)
      throw error
    }
  }

  const updateCartItemQuantity = async (productId: string, quantity: number) => {
    if (!currentUser?.uid) return

    const updatedItems = cart.items
      .map((item) => (item.productId === productId ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0)

    try {
      await saveCart(currentUser.uid, updatedItems)
      setCart({ ...cart, items: updatedItems })
    } catch (error) {
      console.error("Error al actualizar cantidad del carrito:", error)
      throw error
    }
  }

  const removeCartItem = async (productId: string) => {
    if (!currentUser?.uid) return

    const updatedItems = cart.items.filter((item) => item.productId !== productId)
    try {
      await saveCart(currentUser.uid, updatedItems)
      setCart({ ...cart, items: updatedItems })
    } catch (error) {
      console.error("Error al eliminar ítem del carrito:", error)
      throw error
    }
  }

  const clearCart = async () => {
    if (!currentUser?.uid) return

    try {
      await saveCart(currentUser.uid, [])
      setCart({ ...cart, items: [] })
    } catch (error) {
      console.error("Error al vaciar el carrito:", error)
      throw error
    }
  }

  const getCartTotal = () => {
    return cart.items.reduce((total: number, item: CartItem) => {
      const product = products.find((p) => p.id === item.productId)
      return total + (product ? product.price * item.quantity : 0)
    }, 0)
  }

  // Función para establecer usuario desde datos simplificados (ej: login Google)
  const setUser = (user: DatosUsuariosGoogle) => {
    const convertedUser: ClientUser = {
      id: user.id,
      name: user.nombre,
      email: user.email,
      password: "", // Puedes dejar vacío o un valor temporal
      type: "client", // Cambia según tu lógica si es admin
    }

    setCurrentUser(convertedUser)
    setDatosUsuariosGoogle(user)
    setUserType("client") // O "admin" según corresponda
  }
  const setCompleteDatosGoogle = (datos: CompletarDatosGoogle) => {
    setCompletarDatosGoogle(datos)
    setUserType("client")
  }

  const value: AppContextType = {
    // State
    currentView,
    userType,
    currentUser,
    datosUsuariosGoogle,
    completarDatosGoogle,
    setCompleteDatosGoogle,
    users,
    products,
    cart,
    orders,
    searchTerm,
    // Actions
    setCurrentView,
    navigateTo,
    logout,
    setUserType,
    setCurrentUser,
    setUsers,
    setProducts,
    setCart,
    setOrders,
    setSearchTerm,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    getCartTotal,

    setUser, // Aquí incluyes la función setUser para que esté disponible en el contexto
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

