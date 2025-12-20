import React, { useState, useRef, useEffect } from 'react';
import {
    Menu,
    Package,
    Users,
    Tag,
    Plus,
    Edit2,
    Trash2,
    Search,
    User,
    Home,
    BarChart3,
    ShoppingCart,
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
export default function AgregarProduct({ handleAddProductModal, onAddProduct, user, product }) {
    const [categorias, setCategorias] = useState([]);
    const [loadingCategorias, setLoadingCategorias] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stock_quantity: 20,
        guaranty: '',
        description: '',
        imagenes: [] // Array para múltiples imágenes
    });
    const [errors, setErrors] = useState({});
    const [previewImages, setPreviewImages] = useState([]);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const onClose = () => {
        console.log("Cerrando")
        handleAddProductModal(false)
    }
    console.log(product)
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

    // Función para obtener categorías
    const fetchCategorias = async () => {
        try {
            setLoadingCategorias(true);
            const { data, error } = await supabase
                .from('categories') // Nombre de tu tabla de categorías
                .select('id, name')
                .order('name');

            if (error) throw error;

            setCategorias(data || []);
        } catch (error) {
            console.error('Error al obtener categorías:', error);
        } finally {
            setLoadingCategorias(false);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    useEffect(() => {
        if (!loadingCategorias && product) {

            const updated = {
                name: product.name || "",
                category: product.categories.id || "",
                price: product.price || "",
                stock_quantity: parseInt(product.stock_quantity) || 0,
                guaranty: product.guaranty || "",
                description: product.short_description || "",
                imagenes: product.product_images || ""
            }
            setFormData(updated)
            setPreviewImages(product.product_images)
        }
    }, [product])

    // Ver imagen en grande
    const handleViewImage = (url) => {
        window.open(url, '_blank');
    };

    // Abrir selector de archivos
    const handleSelectImages = () => {
        fileInputRef.current.click();
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
        if (!formData.category) newErrors.category = 'La categoría es requerida';
        if (!formData.price) newErrors.price = 'El precio es requerido';
        if (formData.price && formData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
        //if (!formData.stock_quantity) newErrors.stock_quantity = 'El stock es requerido';
        if (formData.stock_quantity && formData.stock_quantity < 0) newErrors.stock_quantity = 'El stock no puede ser negativo';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Drag and Drop
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files);
            const event = { target: { files } };
            handleImageUpload(event);
        }
    };
    // Función para subir imágenes a Supabase Storage
    const uploadImagesToSupabase = async (files, productId) => {
        console.log('Subiendo', files.length, 'imágenes para producto ID:', productId);
        const uploadedImages = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            try {
                // 1. Generar nombre único
                const fileName = `${productId}_${Date.now()}_${i}_${file.name
                    .toLowerCase()
                    .replace(/[^a-z0-9.]/g, '_')}`;

                console.log('Subiendo archivo:', fileName, 'al bucket products-images');

                // 2. Subir a Storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false,
                        contentType: file.type
                    });

                if (uploadError) {
                    console.error('Error al subir a storage:', uploadError);
                    throw new Error(`Error al subir ${file.name}: ${uploadError.message}`);
                }

                console.log('Archivo subido a storage exitosamente:', uploadData);

                // 3. Obtener URL pública
                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(fileName);

                console.log('URL pública generada:', publicUrl);

                // 4. Guardar en la tabla products_imagenes
                const { data: imageData, error: dbError } = await supabase
                    .from('product_images')
                    .insert([{
                        product_id: productId,
                        url: publicUrl,
                        orden: i,
                        file_name: fileName,
                        file_size: file.size,
                        mime_type: file.type
                    }])
                    .select()
                    .single();

                if (dbError) {
                    console.error('Error al guardar en products_imagenes:', dbError);
                    await supabase.storage.from('product-images').remove([fileName]);
                    throw dbError;
                }

                console.log('Imagen guardada en products_imagenes:', imageData);
                uploadedImages.push(imageData);

            } catch (error) {
                console.error(`Error completo con ${file.name}:`, error);
                throw error;
            }
        }

        console.log('Subida completada. Total imágenes:', uploadedImages.length);
        return uploadedImages;
    };


    // Función para manejar la selección de imágenes
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);

        // Validaciones
        if (files.length + formData.imagenes.length > 5) {
            alert('Máximo 5 imágenes permitidas');
            return;
        }

        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                alert(`${file.name} no es una imagen válida`);
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert(`${file.name} es demasiado grande (máximo 5MB)`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        // Crear previews locales
        const newPreviews = validFiles.map(file => ({
            id: Date.now() + Math.random(),
            name: file.name,
            url: URL.createObjectURL(file),
            file: file
        }));

        setPreviewImages(prev => [...prev, ...newPreviews]);
        setFormData(prev => ({
            ...prev,
            imagenes: [...prev.imagenes, ...validFiles]
        }));

        e.target.value = '';
    };

    // Función para eliminar una imagen
    const handleRemoveImage = async (index, image) => {
        console.log(image);
        try {
            // Si la imagen ya está subida a Supabase, eliminarla de allí
            if (image && image.url && !image.file) {
                const fileName = image.url.split('/').pop();
                await supabase.storage.from('product-images').remove([fileName]);
            }
        } catch (error) {
            console.error('Error al eliminar imagen de Supabase:', error);
        }

        // Eliminar del estado local
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
            ...prev,
            imagenes: prev.imagenes.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        setLoading(true);

        try {
            let productId;
            let productData;

            // =========================
            // CREATE
            // =========================
            if (!product) {
                const { data, error } = await supabase
                    .from('products')
                    .insert([{
                        name: formData.name,
                        slug: formData.name.toLowerCase(),
                        category_id: formData.category,
                        price: parseFloat(formData.price),
                        stock_quantity: parseInt(formData.stock_quantity),
                        short_description: formData.description,
                        guaranty: formData.guaranty
                    }])
                    .select()
                    .single();

                if (error) throw error;

                productData = data;
                productId = data.id;
            }

            // =========================
            // UPDATE
            // =========================
            else {
                const { data, error } = await supabase
                    .from('products')
                    .update({
                        name: formData.name,
                        slug: formData.name.toLowerCase(),
                        category_id: formData.category,
                        price: parseFloat(formData.price),
                        stock_quantity: parseInt(formData.stock_quantity),
                        short_description: formData.description,
                        guaranty: formData.guaranty
                    })
                    .eq('id', product.id)
                    .select()
                    .single();

                if (error) throw error;

                productData = data;
                productId = product.id;
            }

            // =========================
            // IMÁGENES (solo si hay nuevas)
            // =========================
           
            if (formData.imagenes?.length > 0) {
                // Filtrar las imágenes que son de tipo 'File' (es decir, nuevas imágenes)
                const newImages = formData.imagenes.filter(item => item instanceof File);

                if (newImages.length > 0) {
                    // Subir solo las nuevas imágenes
                    await uploadImagesToSupabase(newImages, productId);
                }
            }
            // =========================
            // OBTENER CATEGORÍA
            // =========================
            const { data: categoryData } = await supabase
                .from('categories')
                .select('name')
                .eq('id', formData.category)
                .single();

            // =========================
            // OBJETO FINAL
            // =========================
            const productoCompleto = {
                ...productData,
                id: productId,
                categoria: categoryData?.name || '',
                categories: { id: productData.category_id },
                product_images: formData.imagenes
            };

            // =========================
            // CALLBACK
            // =========================
            product ? onAddProduct(productoCompleto, 'updated') : onAddProduct(productoCompleto, 'create');

            onClose();

        } catch (error) {
            console.error('Error al guardar producto:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };


    // Submit del formulario
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (!validateForm()) return;

    //     setLoading(true);

    //     if (!product) {
    //         try {
    //             // 1. Crear el producto en la tabla products
    //             const { data: productData, error: productError } = await supabase
    //                 .from('products')
    //                 .insert([{
    //                     name: formData.name,
    //                     slug: formData.name.toLowerCase(),
    //                     category_id: formData.category,
    //                     price: parseFloat(formData.price),
    //                     stock_quantity: parseInt(formData.stock_quantity),
    //                     short_description: formData.description,
    //                     guaranty: formData.guaranty
    //                 }])
    //                 .select();

    //             if (productError) throw productError;

    //             const newProduct = productData[0];
    //             const productId = newProduct.id;

    //             // 2. Subir imágenes a Storage y guardar en products_imagenes
    //             let uploadedImages = [];
    //             if (formData.imagenes.length > 0) {
    //                 uploadedImages = await uploadImagesToSupabase(formData.imagenes, productId);
    //             }

    //             // 3. Obtener la categoría completa (join)
    //             const { data: categoryData } = await supabase
    //                 .from('categories')
    //                 .select('*')
    //                 .eq('id', formData.category)
    //                 .single();

    //             // 4. Preparar objeto completo para el estado local
    //             const productoCompleto = {
    //                 ...newProduct,
    //                 categoria: categoryData.name,
    //                 //imagenes: uploadedImages,
    //                 //price: `$${parseFloat(formData.price).toFixed(2)}`
    //             };
    //             console.log(productoCompleto)
    //             // 5. Llamar callback
    //             onAddProduct(productoCompleto);

    //             // 6. Limpiar y cerrar
    //             onClose();

    //         } catch (error) {
    //             console.error('Error al crear producto:', error);
    //             alert(`Error: ${error.message}`);
    //         } finally {
    //             setLoading(false);
    //         }
    //     } else {
    //         try {
    //             // 1. Crear el producto en la tabla products
    //             const { data: productData, error: productError } = await supabase
    //                 .from('products')
    //                 .insert([{
    //                     name: formData.name,
    //                     slug: formData.name.toLowerCase(),
    //                     category_id: formData.category,
    //                     price: parseFloat(formData.price),
    //                     stock_quantity: parseInt(formData.stock_quantity),
    //                     short_description: formData.description,
    //                     guaranty: formData.guaranty
    //                 }])
    //                 .select();

    //             if (productError) throw productError;

    //             const newProduct = productData[0];
    //             const productId = newProduct.id;

    //             // 2. Subir imágenes a Storage y guardar en products_imagenes
    //             let uploadedImages = [];
    //             if (formData.imagenes.length > 0) {
    //                 uploadedImages = await uploadImagesToSupabase(formData.imagenes, productId);
    //             }

    //             // 3. Obtener la categoría completa (join)
    //             const { data: categoryData } = await supabase
    //                 .from('categories')
    //                 .select('*')
    //                 .eq('id', formData.category)
    //                 .single();

    //             // 4. Preparar objeto completo para el estado local
    //             const productoCompleto = {
    //                 ...newProduct,
    //                 categoria: categoryData.name,
    //                 //imagenes: uploadedImages,
    //                 //price: `$${parseFloat(formData.price).toFixed(2)}`
    //             };
    //             console.log(productoCompleto)
    //             // 5. Llamar callback
    //             onAddProduct(productoCompleto);

    //             // 6. Limpiar y cerrar
    //             onClose();

    //         } catch (error) {
    //             console.error('Error al crear producto:', error);
    //             alert(`Error: ${error.message}`);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    // };




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

    if (loadingCategorias) {
        return (
            <div className="absolute top-0 min-h-screen min-w-screen flex items-center justify-center bg-black/30">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando form productos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50" onClick={() => onClose()} />
            {/* Indicador de carga */}
            {loading && (
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Subiendo imágenes...</span>
                        <span className="text-sm font-medium">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                </div>
            )}

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
                                    <h2 className="text-2xl font-bold text-gray-800">Agregar Nuevo Producto</h2>
                                    <p className="text-gray-600 text-sm mt-1">Complete los datos del producto</p>
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
                        {/* Sección de Imágenes */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Image size={18} />
                                        <span>Imágenes del Producto</span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {previewImages.length}/5 imágenes
                                    </span>
                                </div>
                            </label>

                            {/* Vista previa de imágenes */}
                            {previewImages.length > 0 && (
                                <div className="mb-6">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                                        {previewImages.map((image, index) => (
                                            <div key={image.id} className="relative group">
                                                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                                                    <img
                                                        src={image.url}
                                                        alt={image.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleViewImage(image.url)}
                                                            className="p-2 bg-white rounded-full hover:bg-gray-100"
                                                            title="Ver imagen"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(index, image)}
                                                            className="p-2 bg-white rounded-full hover:bg-gray-100"
                                                            title="Eliminar"
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 truncate">
                                                    {image.name}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Área de carga */}
                            <div
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onClick={handleSelectImages}
                                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${previewImages.length === 0
                                    ? 'border-blue-300 bg-blue-50 hover:bg-blue-100'
                                    : 'border-gray-300 hover:border-blue-400'
                                    }`}
                            >
                                <Upload className={`mx-auto ${previewImages.length === 0 ? 'text-blue-500' : 'text-gray-400'}`} size={48} />
                                <p className="mt-3 text-lg font-medium">
                                    {previewImages.length === 0 ? 'Subir imágenes' : 'Agregar más imágenes'}
                                </p>
                                <p className="text-gray-600 mt-2">
                                    Arrastra imágenes aquí o haz clic para seleccionar
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Máximo 5 imágenes • PNG, JPG, JPEG hasta 5MB
                                </p>
                                <button
                                    type="button"
                                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                                >
                                    <Upload size={18} />
                                    Seleccionar Archivos
                                </button>
                            </div>

                            {/* Input de archivo oculto */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                multiple
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        {/* Resto del formulario */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nombre del Producto */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Type size={16} />
                                        Nombre del Producto
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

                            {/* Categoría */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Tag size={16} />
                                        Categoría
                                    </div>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.categoria ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Seleccione una categoría</option>
                                    {categorias.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-2 text-sm text-red-600">{errors.category}</p>
                                )}
                            </div>

                            {/* Precio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <DollarSign size={16} />
                                        Precio
                                    </div>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.precio ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                </div>
                                {errors.price && (
                                    <p className="mt-2 text-sm text-red-600">{errors.price}</p>
                                )}
                            </div>

                            {/* Stock */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Hash size={16} />
                                        Stock Disponible
                                    </div>
                                </label>
                                <input
                                    type="number"
                                    name="stock_quantity"
                                    value={formData.stock_quantity}
                                    onChange={handleChange}
                                    placeholder="Ej: 100"
                                    min="0"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.stock ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.stock_quantity && (
                                    <p className="mt-2 text-sm text-red-600">{errors.stock_quantity}</p>
                                )}
                            </div>

                            {/* Guaranty */}
                            <div className="">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Eye size={16} />
                                        Garantia del Producto
                                    </div>
                                </label>
                                <input
                                    type="text"
                                    name="guaranty"
                                    value={formData.guaranty}
                                    onChange={handleChange}
                                    placeholder="2 meses"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.guaranty ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.guaranty && (
                                    <p className="mt-2 text-sm text-red-600">{errors.guaranty}</p>
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

                                {product ? <> <Edit2 size={18} /> Editar Product </> : <> <Plus size={18} /> Agregar Product </>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};