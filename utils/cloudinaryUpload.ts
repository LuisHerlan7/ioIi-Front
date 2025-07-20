const CLOUDINARY_CLOUD_NAME = "dbzbkewmf"
const CLOUDINARY_UPLOAD_PRESET = "IO2WebApp" // Tu preset de carga sin firmar, como lo especificaste.

/**
 * Sube un archivo de imagen a Cloudinary.
 * @param {File} 
 * @returns {Promise<string>} 
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error("CLOUDINARY_CLOUD_NAME no está configurado en las variables de entorno.")
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Error al subir imagen a Cloudinary:", errorData)
      throw new Error(`Error al subir imagen: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    return data.secure_url // Retorna la URL segura de la imagen subida.
  } catch (error) {
    console.error("Fallo en la subida de imagen a Cloudinary:", error)
    throw error
  }
}
