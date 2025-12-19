import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    Package,
    Tag,
    Plus,
    X,
    Image,
    DollarSign,
    Hash,
    Type,
    Upload,
    XCircle,
    Eye
} from 'lucide-react';
import { supabase } from '../../supabase/client';

// Componente para el modal de agregar producto
export default function AgregarCategory({ handleAddCategoryModal, onAddCategory, user }) {

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
    });
    const [errors, setErrors] = useState({});
    const [loading,setLoading] = useState(false)
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
        if (!formData.description) newErrors.category = 'La categoría es requerida';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onClose = () => {
        console.log("Cerrando")
        handleAddCategoryModal(false)
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);

        try {            

            // 1. Crear slug único
            const baseSlug = formData.name
                .toLowerCase()
                .trim()
                .normalize('NFD') // Eliminar acentos
                .replace(/[\u0300-\u036f]/g, '') // Eliminar diacríticos
                .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres especiales con guiones
                .replace(/^-+|-+$/g, ''); // Eliminar guiones al inicio y final

            // Verificar si el slug ya existe
            const { data: existingCategory, error: checkError } = await supabase
                .from('categories')
                .select('id')
                .eq('slug', baseSlug)
                .single();

            // Si el slug existe, agregar un número al final
            let finalSlug = baseSlug;
            if (existingCategory) {
                let counter = 1;
                while (true) {
                    const newSlug = `${baseSlug}-${counter}`;
                    const { data: checkData } = await supabase
                        .from('categories')
                        .select('id')
                        .eq('slug', newSlug)
                        .single();

                    if (!checkData) {
                        finalSlug = newSlug;
                        break;
                    }
                    counter++;
                }
            }

            // 2. Crear la categoría en la tabla categories
            const { data: categoryData, error: categoryError } = await supabase
                .from('categories')
                .insert([{
                    name: formData.name.trim(),
                    slug: finalSlug,
                    description: formData.description?.trim() || null,
                   // created_at: new Date().toISOString(),
                }])
                .select()
                .single(); // Usar .single() para obtener un solo objeto

            if (categoryError) throw categoryError;

            // 3. Mostrar mensaje de éxito
            toast.success('Categoría creada exitosamente!', {
                position: "top-right",
                autoClose: 3000,
            });

            // 4. Limpiar formulario si es necesario
            setFormData({
                name: '',
                description: '',
            });

            // 5. Cerrar modal y refrescar datos
            if (onClose) onClose();

            // // 6. Si hay callback para refrescar categorías, ejecutarlo
            // if (onCategoryCreated) {
            //     onCategoryCreated(categoryData);
            // }

        } catch (error) {
            console.error('Error al crear categoría:', error);

            // Mostrar error más específico
            let errorMessage = 'Error al crear categoría';
            if (error.message.includes('duplicate key')) {
                errorMessage = 'Ya existe una categoría con ese nombre';
            } else if (error.message.includes('violates unique constraint')) {
                errorMessage = 'El nombre de la categoría ya existe';
            } else {
                errorMessage = error.message || 'Error al crear categoría';
            }

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    // Función para eliminar un producto (incluyendo sus imágenes de Supabase)
    const handleDeleteProduct = async (productoId, imagenes) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            // 1. Eliminar las imágenes del storage
            if (imagenes && imagenes.length > 0) {
                const fileNames = imagenes.map(url => url.split('/').pop());
                await client.storage
                    .from('productos')
                    .remove(fileNames);
            }

            // 2. Eliminar el producto de la tabla
            const { error } = await client
                .from('productos')
                .delete()
                .eq('id', productoId);

            if (error) throw error;

            // 3. Actualizar estado local
            setProductos(prev => prev.filter(p => p.id !== productoId));

            alert('Producto eliminado exitosamente');

        } catch (error) {
            console.error('Error al eliminar producto:', error);
            alert('Error al eliminar producto');
        }
    };

    // Si no hay usuario, mostrar mensaje
    if (!user) {
        return (
            <div className="p-6 text-center">
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="font-medium text-red-800">Error de autenticación</p>
                    <p className="text-sm text-red-600 mt-1">
                        No estás autenticado. Por favor, recarga la página o inicia sesión nuevamente.
                    </p>
                </div>
                <button
                    onClick={() => onClose()}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                    Cerrar
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50" onClick={() => onClose()} />

            {/* Contenedor del modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    {/* Header del modal */}
                    <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Package className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Agregar Nueva Categoria</h2>
                                    <p className="text-gray-600 text-sm mt-1">Complete los datos de la categoria</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="p-6">

                        {/* Resto del formulario */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nombre del Producto */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Type size={16} />
                                        Nombre de la categoria
                                    </div>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ej: Laptop Gaming Pro"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.nombre ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            {/* Descripción */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe el producto..."
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                                />
                            </div>
                        </div>

                        {/* Botones del formulario */}
                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => onClose()}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Agregar Category
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};