// utils/firestoreCarts.ts

import { doc, getDoc, setDoc, type DocumentData } from "firebase/firestore"
import { db } from "../backend/firebase" 

// Items individuales dentro del carrito.
export interface CartItem {
  productId: string
  quantity: number
}

// Estructura del carrito.
export interface Cart extends DocumentData {
  userId: string
  items: CartItem[]
}

/**
 * Obtiene el carrito de un usuario específico de la colección 'carts' en Firestore.
 * Si el carrito no existe, retorna un objeto de carrito vacío para ese usuario.
 * @param {string} userId El ID del usuario
 * @returns {Promise<Cart>} 
 */
export async function fetchCart(userId: string): Promise<Cart> {
  try {
    const cartRef = doc(db, "carts", userId) // El ID del documento del carrito es el userId
    const cartSnap = await getDoc(cartRef)
    if (cartSnap.exists()) {
      return cartSnap.data() as Cart
    } else {
      // Si el carrito no existe para este usuario, retorna un carrito vacío.
      return { userId, items: [] }
    }
  } catch (error) {
    console.error(`Error al obtener el carrito para el usuario ${userId}:`, error)
    throw error
  }
}

/**
 * Guarda (o actualiza) el carrito de un usuario en la colección 'carts' en Firestore.
 * Utiliza `setDoc` con `merge: true` para no sobrescribir otros campos si es que hubiera en el documento
 * @param {string} userId El ID del usuario cuyo carrito se va a guardar.
 * @param {CartItem[]} El array de productos en el carrito.
 * @returns {Promise<void>} 
 */
export async function saveCart(userId: string, items: CartItem[]): Promise<void> {
  try {
    const cartRef = doc(db, "carts", userId)
    await setDoc(cartRef, { userId, items }, { merge: true }) // `merge: true` para no borrar otros campos si se añaden después.
    console.log(`Carrito guardado con éxito para el usuario ${userId}.`)
  } catch (error) {
    console.error(`Error al guardar el carrito para el usuario ${userId}:`, error)
    throw error
  }
}
