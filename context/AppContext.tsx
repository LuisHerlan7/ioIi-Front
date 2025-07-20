"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { onAuthStateChanged, User as Firebaseuser } from "firebase/auth"
import { auth, db } from "../backend/firebase"
import { doc, getDoc } from "firebase/firestore"
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
export interface DatosCliente{
  id: string,
  nombre: string,
  email: string,
  celular: string,
  dirección: string,
  fotoURL: string
}
export interface ClientUser {
  id: string
  name: string
  email: string
  password: string
  type: "client" | "admin"
}

export interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  stock: number
  rating?: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  clientId: string
  clientName: string
  items: CartItem[]
  total: number
  date: string
  status: "pending" | "confirmed" | "delivered"
}

// Mock data for soap products
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Jabón de Lavanda Premium",
    price: 25,
    image: "/placeholder.svg?height=300&width=300",
    description: "Jabón artesanal con aceite esencial de lavanda orgánica, ideal para relajar y nutrir la piel",
    category: "Jabones Aromáticos",
    stock: 15,
    rating: 4.9,
  },
  {
    id: "2",
    name: "Jabón de Rosa Mosqueta",
    price: 32,
    image: "/placeholder.svg?height=300&width=300",
    description: "Enriquecido con aceite de rosa mosqueta, perfecto para pieles maduras y regeneración celular",
    category: "Jabones Anti-edad",
    stock: 8,
    rating: 4.8,
  },
  {
    id: "3",
    name: "Jabón de Miel y Avena",
    price: 28,
    image: "/placeholder.svg?height=300&width=300",
    description: "Suave exfoliante natural con miel pura y avena, ideal para pieles sensibles",
    category: "Jabones Exfoliantes",
    stock: 25,
    rating: 4.7,
  },
  {
    id: "4",
    name: "Jabón de Aceite de Oliva",
    price: 22,
    image: "/placeholder.svg?height=300&width=300",
    description: "Jabón tradicional con aceite de oliva virgen extra, hidratante y nutritivo",
    category: "Jabones Hidratantes",
    stock: 12,
    rating: 4.6,
  },
  {
    id: "5",
    name: "Jabón de Carbón Activado",
    price: 30,
    image: "/placeholder.svg?height=300&width=300",
    description: "Purificante y desintoxicante, ideal para pieles grasas y con impurezas",
    category: "Jabones Purificantes",
    stock: 18,
    rating: 4.8,
  },
  {
    id: "6",
    name: "Jabón de Coco y Karité",
    price: 26,
    image: "/placeholder.svg?height=300&width=300",
    description: "Ultra hidratante con manteca de karité y aceite de coco, para pieles muy secas",
    category: "Jabones Hidratantes",
    stock: 20,
    rating: 4.9,
  },
]

const mockUsers: ClientUser[] = [
  {
    id: "1",
    name: "Admin",
    email: "admin@lerbolario.com",
    password: "admin123",
    type: "admin",
  },
  {
    id: "2",
    name: "Cliente Demo",
    email: "cliente@demo.com",
    password: "cliente123",
    type: "client",
  },
]

const mockOrders: Order[] = [
  {
    id: "1",
    clientId: "2",
    clientName: "María González",
    items: [
      { product: mockProducts[0], quantity: 2 },
      { product: mockProducts[2], quantity: 1 },
    ],
    total: 78,
    date: "2024-01-15",
    status: "confirmed",
  },
]

interface AppContextType {
  // State
  currentView: string
  userType: "client" | "admin" | null
  datosUsuariosGoogle: DatosUsuariosGoogle | null
  completarDatosGoogle: CompletarDatosGoogle | null
  datosCliente: DatosCliente | null
  currentUser: ClientUser | null
  users: ClientUser[]
  products: Product[]
  cart: CartItem[]
  orders: Order[]
  searchTerm: string

  // Actions
  setCurrentView: (view: string) => void
  navigateTo: (view: string) => void
  logout: () => void
  setUserType: (type: "client" | "admin" | null) => void
  setCurrentUser: (user: ClientUser | null) => void
  setUsers: React.Dispatch<React.SetStateAction<ClientUser[]>>
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
  setSearchTerm: (term: string) => void
  addToCart: (product: Product) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  getCartTotal: () => number
  setUser: (user: DatosUsuariosGoogle) => void
  setCompleteDatosGoogle: (datos: CompletarDatosGoogle) => void
  setDatosCliente: (datos: DatosCliente) => void 
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

export const AppProvider: React.FC<AppProviderProps> = ({ children, currentView, setCurrentView }: AppProviderProps) => {
  const [userType, setUserType] = useState<"client" | "admin" | null>(null)
  const [currentUser, setCurrentUser] = useState<ClientUser | null>(null)
  const [users, setUsers] = useState<ClientUser[]>(mockUsers)
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [datosUsuariosGoogle, setDatosUsuariosGoogle] = useState<DatosUsuariosGoogle | null>(null)
  const [completarDatosGoogle, setCompletarDatosGoogle] = useState<CompletarDatosGoogle | null>(null)
  const [datosCliente, setDatosCliente] = useState<DatosCliente | null>(null)

  const navigateTo = (view: string) => {
    setCurrentView(view)
  }
  

  const logout = () => {
    setCurrentUser(null)
    setDatosUsuariosGoogle(null)
    setCompletarDatosGoogle(null)
    setDatosCliente(null)
    setUserType(null)
    setCart([])
    setCurrentView("home")
  }

  const addToCart = (product: Product) => {
    setCart((prev: CartItem[]) => {
      const existing = prev.find((item: CartItem) => item.product.id === product.id)
      if (existing) {
        return prev.map((item: CartItem) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { product, quantity: 1 }]
    })
    navigateTo("cart")
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev: CartItem[]) => prev.filter((item: CartItem) => item.product.id !== productId))
    } else {
      setCart((prev: CartItem[]) => prev.map((item: CartItem) => (item.product.id === productId ? { ...item, quantity } : item)))
    }
  }

  const getCartTotal = () => {
    return cart.reduce((total: number, item: CartItem) => total + item.product.price * item.quantity, 0)
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
  const setDateCliente = (datos: DatosCliente) => {
    setDatosCliente(datos)
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
    datosCliente,
    setDatosCliente,
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
    addToCart,
    updateCartQuantity,
    getCartTotal,

    setUser, // Aquí incluyes la función setUser para que esté disponible en el contexto
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

