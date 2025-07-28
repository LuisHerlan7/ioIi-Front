# Integración del Carrito con Firebase

## Descripción General

El carrito de compras está completamente integrado con Firebase Firestore para persistir los datos del usuario entre sesiones.

## Estructura de Datos

### Carrito en Firestore
```typescript
interface Cart {
  userId: string
  items: CartItem[]
}

interface CartItem {
  productId: string
  quantity: number
}
```

### Ubicación en Firestore
- **Colección**: `carts`
- **Documento**: El ID del documento es el `userId`
- **Estructura**: `carts/{userId}`

## Funciones Principales

### 1. `fetchCart(userId: string)`
- **Ubicación**: `utils/firestoreCarts.ts`
- **Función**: Obtiene el carrito de un usuario desde Firestore
- **Retorna**: Promise<Cart>

### 2. `saveCart(userId: string, items: CartItem[])`
- **Ubicación**: `utils/firestoreCarts.ts`
- **Función**: Guarda/actualiza el carrito en Firestore
- **Usa**: `setDoc` con `merge: true` para no sobrescribir otros campos

### 3. `addToCart(product: Product, quantity?: number)`
- **Ubicación**: `context/AppContext.tsx`
- **Función**: Añade un producto al carrito y sincroniza con Firebase
- **Comportamiento**: 
  - Si el producto ya existe, suma la cantidad
  - Si no existe, lo añade como nuevo item

### 4. `updateCartItemQuantity(productId: string, quantity: number)`
- **Función**: Actualiza la cantidad de un producto en el carrito
- **Comportamiento**: Si quantity = 0, elimina el producto

### 5. `removeCartItem(productId: string)`
- **Función**: Elimina completamente un producto del carrito

### 6. `clearCart()`
- **Función**: Vacía completamente el carrito

## Sincronización Automática

### Hook `useCartSync`
- **Ubicación**: `hooks/useCartSync.ts`
- **Función**: Maneja la sincronización automática entre el estado local y Firebase

### Comportamiento
1. **Al iniciar sesión**: Carga el carrito desde Firebase
2. **Al cambiar el carrito**: Guarda automáticamente en Firebase
3. **Al cerrar sesión**: Limpia el carrito local

## Flujo de Datos

```
Usuario añade producto → Context → Firebase → Persistencia
Usuario inicia sesión → Firebase → Context → UI actualizada
```

## Componentes Integrados

### 1. ProductCatalog
- Usa `addToCart(product)` para añadir productos
- Muestra estado de stock en tiempo real

### 2. CartView
- Muestra productos del carrito con detalles completos
- Permite modificar cantidades
- Calcula total automáticamente

### 3. CartDebug (Solo desarrollo)
- Muestra información de debug del carrito
- Útil para verificar la sincronización

## Manejo de Errores

### Errores Comunes
1. **Usuario no autenticado**: Muestra warning y no permite añadir al carrito
2. **Error de red**: Intenta reintentar la operación
3. **Producto no encontrado**: Muestra "Producto no encontrado" en el carrito

### Logs de Debug
- Todos los errores se registran en la consola
- Incluye información detallada para debugging

## Configuración de Firebase

### Requisitos
1. Firebase configurado en `backend/firebase.ts`
2. Firestore habilitado en el proyecto
3. Reglas de seguridad configuradas para la colección `carts`

### Reglas de Seguridad Sugeridas
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /carts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Testing

### Verificar Integración
1. Abrir la aplicación
2. Iniciar sesión con un usuario
3. Añadir productos al carrito
4. Recargar la página
5. Verificar que los productos persisten
6. Cambiar cantidades y verificar sincronización

### Debug Component
El componente `CartDebug` muestra en tiempo real:
- Estado del usuario
- Número de items en carrito
- Productos disponibles
- Detalles de cada item

## Mejoras Futuras

1. **Optimistic Updates**: Actualizar UI inmediatamente, luego sincronizar
2. **Offline Support**: Cache local para operaciones offline
3. **Batch Operations**: Operaciones en lote para mejor rendimiento
4. **Real-time Updates**: Suscripción en tiempo real a cambios del carrito 