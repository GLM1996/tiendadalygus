import {
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';

import { supabase } from '../../supabase/client';


export default function Productos({ products, handleAddProductModal }) {


  // Función para eliminar un producto (incluyendo sus imágenes de Supabase)
  const handleDeleteProduct = async (productoId, imagenes) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    console.log(imagenes)
    try {
      // 1. Eliminar las imágenes del storage
      if (imagenes && imagenes.length > 0) {
        const fileNames = imagenes.map(item => item.url.split('/').pop());        
        await supabase.storage
          .from('product-images')
          .remove(fileNames);
      }

      // 2. Eliminar el producto de la tabla
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productoId);

      if (error) throw error;

      // 3. Actualizar estado local
      //setProductos(prev => prev.filter(p => p.id !== productoId));

      alert('Producto eliminado exitosamente');

    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar producto');
    }
  };


  return (
    <div className="bg-white rounded-xl shadow border overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Lista de Productos</h2>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={() => handleAddProductModal(true)}>
            <Plus size={18} />
            Agregar Producto
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">Producto</th>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">Categoría</th>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">Precio</th>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">Stock</th>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((producto) => (
              <tr key={producto.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">{producto.name}</td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {producto.categoria}
                  </span>
                </td>
                <td className="py-4 px-6 font-medium">{producto.price}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${producto.stock > 50
                    ? 'bg-green-100 text-green-800'
                    : producto.stock_quantity > 20
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                    {producto.stock_quantity} unidades
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" onClick={() => handleDeleteProduct(producto.id, producto.imagenes)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
