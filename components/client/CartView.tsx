"use client"

import type React from "react"
import { ShoppingCart, Trash2 } from "lucide-react"
import { useApp } from "@/context/AppContext"
import { ClientHeader } from "../shared/ClientHeader"

export const CartView: React.FC = () => {
  const { cart, updateCartQuantity, getCartTotal, navigateTo, setOrders, setCart, currentUser } = useApp()
  const total = getCartTotal()

  const confirmPurchase = () => {
    const orderDetails = cart.map((item) => `${item.product.name} x${item.quantity}`).join(", ")

    const message = `🛒 *Nueva Orden de L'ERBOLARIO* 🛒\n\n📱 Productos:\n${orderDetails}\n\n💰 Total: $${total}\n\n👤 Cliente: ${currentUser?.name}\n📧 Email: ${currentUser?.email}`
    const whatsappUrl = `https://wa.me/59165747121?text=${encodeURIComponent(message)}`

    // Create order
    const newOrder = {
      id: Date.now().toString(),
      clientId: currentUser?.id || "",
      clientName: currentUser?.name || "",
      items: [...cart],
      total,
      date: new Date().toISOString().split("T")[0],
      status: "pending" as const,
    }

    setOrders((prev) => [...prev, newOrder])
    setCart([])

    window.open(whatsappUrl, "_blank")
    navigateTo("order-confirmation")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <ClientHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Carrito de Compras
          </h2>
          <p className="text-gray-600">Revisa tus productos antes de finalizar</p>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={48} className="text-gray-400" />
            </div>
            <p className="text-gray-600 mb-6 text-lg">Tu carrito está vacío</p>
            <button
              onClick={() => navigateTo("catalog")}
              className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Explorar productos
            </button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl border border-purple-100"
                  >
                    <div className="flex items-center space-x-6">
                      <img
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-xl shadow-lg"
                      />
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{item.product.name}</h3>
                        <p className="text-gray-600">{item.product.description}</p>
                        <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                          ${item.product.price}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3 bg-white rounded-xl p-2 shadow-lg">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-full hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-full hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, 0)}
                        className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-r from-purple-100 to-cyan-100 rounded-xl p-6 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-800">Total:</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                      ${total}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => navigateTo("catalog")}
                    className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                  >
                    Continuar comprando
                  </button>
                  <button
                    onClick={confirmPurchase}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Confirmar compra 🚀
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
