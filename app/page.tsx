"use client"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/backend/firebase"

import { HomePage } from "../components/home/HomePage"
import { LoginForm } from "../components/auth/LoginForm"
import { RegisterForm } from "../components/auth/RegisterForm"
import { ProductCatalog } from "../components/client/ProductCatalog"
import { CartView } from "../components/client/CartView"
import { OrderConfirmation } from "../components/client/OrderConfirmation"
import { ProfileView } from "../components/client/ProfileView"
import { AdminDashboard } from "../components/admin/AdminDashboard"
import { AdminReports } from "../components/admin/AdminReports"
import { AdminProducts } from "../components/admin/AdminProducts"
import { AdminOrders } from "../components/admin/AdminOrders"
import { AppProvider } from "../context/AppContext"
import { CompletedRegisterForm } from "../components/auth/CompletarRegistro"

export default function ECommerceApp() {
  const [currentView, setCurrentView] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("currentView") || "home"
    }
    return "home"
  })

  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    // Persistir la vista
    if (typeof window !== "undefined") {
      localStorage.setItem("currentView", currentView)
    }
  }, [currentView])

  useEffect(() => {
    // Restaurar sesión Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          const data = userSnap.data()
          const rol = data.rol ?? "cliente"

          if (rol === "cliente") {
            setCurrentView("catalog")
          } else {
            setCurrentView("no-autorizado") // Si tienes esta vista
          }
        } else {
          setCurrentView("completar-registro")
        }
      }

      setInitialLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const renderCurrentView = () => {
    switch (currentView) {
      case "home":
        return <HomePage />
      case "client-login":
        return <LoginForm type="client" />
      case "admin-login":
        return <LoginForm type="admin" />
      case "register":
        return <RegisterForm />
      case "catalog":
        return <ProductCatalog />
      case "cart":
        return <CartView />
      case "order-confirmation":
        return <OrderConfirmation />
      case "profile":
        return <ProfileView />
      case "admin-dashboard":
        return <AdminDashboard />
      case "admin-reports":
        return <AdminReports />
      case "admin-products":
        return <AdminProducts />
      case "admin-orders":
        return <AdminOrders />
      case "completar-registro":
        return <CompletedRegisterForm />
      case "no-autorizado":
        return <div>No tienes autorización para acceder a esta página</div>
      default:
        return <HomePage />
    }
  }

  if (initialLoading) {
    return <div className="text-center mt-10">Cargando sesión...</div>
  }

  return (
    <AppProvider currentView={currentView} setCurrentView={setCurrentView}>
      <div className="min-h-screen">{renderCurrentView()}</div>
    </AppProvider>
  )
}
