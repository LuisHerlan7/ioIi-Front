// utils/firestoreProducts.ts

import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, type DocumentData } from "firebase/firestore"
import { db } from "../backend/firebase"

// Estructura de tus productos
export interface Product extends DocumentData {
  id?: string
  name: string | null 
  price: number
  description: string | null 
  category: string | null 
  stock: number
  image: string | null 
  rating?: number // xd, solo esta aqui porque esta en el front
}

/**
 * Obtiene todos los productos de la colección 'products' en Firestore
 * @returns {Promise<Product[]>} 
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "products"))
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Product),
    }))
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return []
  }
}

/**
 * Agrega un nuevo producto a la colección 'products' en Firestore.
 * @param {Omit<Product, 'id'>} Datos del producto a agregar (sin el ID, ya que Firestore lo genera).
 * @returns {Promise<void>} 
 */
export async function addProduct(product: Omit<Product, "id">): Promise<void> {
  try {
    await addDoc(collection(db, "products"), product)
    console.log("Producto agregado con éxito:", product.name)
  } catch (error) {
    console.error("Error al agregar producto:", error)
    throw error
  }
}

/**
 * Actualiza un producto existente en la colección 'products' en Firestore.
 * @param {Product} Datos del producto a actualizar (debe incluir el ID).
 * @returns {Promise<void>} 
 */
export async function updateProduct(product: Product): Promise<void> {
  if (!product.id) {
    console.error("Error: El producto a actualizar debe tener un ID.")
    throw new Error("Product ID is required for update.")
  }
  try {
    const productRef = doc(db, "products", product.id)
    const { id, ...dataToUpdate } = product
    await updateDoc(productRef, dataToUpdate)
    console.log("Producto actualizado con éxito:", product.name)
  } catch (error) {
    console.error("Error al actualizar producto:", error)
    throw error
  }
}

/**
 * Elimina un producto de la colección 'products' en Firestore.
 * @param {string} ID del producto a eliminar.
 * @returns {Promise<void>} 
 */
export async function deleteProduct(id: string): Promise<void> {
  try {
    const productRef = doc(db, "products", id)
    await deleteDoc(productRef)
    console.log("Producto eliminado con éxito. ID:", id)
  } catch (error) {
    console.error("Error al eliminar producto:", error)
    throw error
  }
}
