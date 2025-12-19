import {
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';


export default function Categorias({ categories, handleAddCategoryModal }) {

  return (
    <div className="bg-white rounded-xl shadow border overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Lista de Category</h2>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={() => handleAddCategoryModal(true)}>
            <Plus size={18} />
            Agregar Category
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">Nombre</th>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">Description</th>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">Cantidad</th>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">{category.name}</td>
                <td className="py-4 px-6 font-medium">{category.description}</td>                
                <td className="py-4 px-6 font-medium">{category.cantidad}</td>                
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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
