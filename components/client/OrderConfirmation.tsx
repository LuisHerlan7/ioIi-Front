"use client"

import type React from "react"
import { useApp } from "@/context/AppContext"
import { ClientHeader } from "../shared/ClientHeader"

export const OrderConfirmation: React.FC = () => {
  const { navigateTo } = useApp()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <ClientHeader />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center border border-white/20">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                ¡Pedido Confirmado!
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Tu pedido ha sido enviado por WhatsApp. Nos pondremos en contacto contigo muy pronto para coordinar la
                entrega.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl p-4 border border-purple-100">
                <p className="text-sm text-gray-600 mb-2">Número de seguimiento</p>
                <p className="font-bold text-lg bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  #TS{Date.now().toString().slice(-6)}
                </p>
              </div>

              <button
                onClick={() => navigateTo("catalog")}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Continuar comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
