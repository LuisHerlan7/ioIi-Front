"use client"
import { useState } from "react"
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
import {CompletedRegisterForm} from "../components/auth/CompletarRegistro"

// Main App Component
export default function ECommerceApp() {
  const [currentView, setCurrentView] = useState<string>("home")

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
      default:
        return <HomePage />
    }
  }

  return (
    <AppProvider currentView={currentView} setCurrentView={setCurrentView}>
      <div className="min-h-screen">{renderCurrentView()}</div>
    </AppProvider>
  )
}
