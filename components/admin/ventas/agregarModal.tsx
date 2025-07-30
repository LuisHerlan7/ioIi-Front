
import React, { useState } from 'react'
import './AgregarModal.css'

interface Product {
  id: string
  name: string
  price: number
  description: string
  color: string
  fragance: string
  stock: number
  image: string
}

interface AgregarModalProps {
  isOpen: boolean
  onClose: () => void
  onAgregar: (producto: Product) => void
}

const AgregarModal: React.FC<AgregarModalProps> = ({ isOpen, onClose, onAgregar }) => {
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState<number>(0)
  const [cantidad, setCantidad] = useState<number>(1)
  const [descripcion, setDescripcion] = useState('')
  const [categoria, setCategoria] = useState('')
  const [imagen, setImagen] = useState<File | null>(null)
  const [urlImagen, setUrlImagen] = useState('')
  const [color, setColor] = useState('')
  const [fragancia, setFragancia] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAgregar({
      name: nombre,
      price: precio,
      stock: cantidad,
      description: descripcion,
      color: color,
      fragance: fragancia,
      image: urlImagen,
      id: Date.now().toString()
    })
    setNombre('')
    setPrecio(0)
    setCantidad(1)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Registrar Producto</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Precio:</label>
            <input
              type="number"
              value={precio}
              onChange={e => setPrecio(Number(e.target.value))}
              min={0}
              required
            />
          </div>
          <div>
            <label>Cantidad:</label>
            <input
              type="number"
              value={cantidad}
              onChange={e => setCantidad(Number(e.target.value))}
              min={1}
              required
            />
          </div>
          <div>
            <label>Descripción:</label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Categoría:</label>
            <input
              type="text"
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Imagen:</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) {
                  setImagen(file)
                  const reader = new FileReader()
                  reader.onloadend = () => {
                    setUrlImagen(reader.result as string)
                  }
                  reader.readAsDataURL(file)
                }
              }}
            />
            {urlImagen && <img src={urlImagen} alt="Vista previa" />}
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Agregar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AgregarModal
