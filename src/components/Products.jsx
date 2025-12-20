import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { supabase } from '../supabase/client';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
    const [paginaActual, setPaginaActual] = useState(1);
    const [productosPorPagina] = useState(8);
    const [productosFiltrados, setProductosFiltrados] = useState([]);

    // Función para obtener productos con categorías e imágenes
    const fetchProducts = async () => {
        try {
            setCargando(true);
            // Obtener todos los productos con sus categorías e imágenes
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select(`
                    id,
                    name,
                    short_description,
                    price,
                    stock_quantity,
                    categories (
                        id,
                        name,
                        description
                    ),
                    product_images (
                        id,
                        url,
                        product_id
                    )
                `)
                .order('name');

            if (productsError) throw productsError;

            // Obtener categorías únicas para los filtros
            const categoriasUnicas = {};
            const categoriasConCantidad = [];

            // Procesar productos y contar categorías
            const productosProcesados = productsData.map(producto => {
                // Contar categorías para el filtro
                if (producto.categories) {
                    const categoriaNombre = producto.categories.name;

                    if (!categoriasUnicas[categoriaNombre]) {
                        categoriasUnicas[categoriaNombre] = {
                            nombre: categoriaNombre,
                            cantidad: 1,
                            id: producto.categories.id
                        };
                    } else {
                        categoriasUnicas[categoriaNombre].cantidad++;
                    }
                }

                // Asegurar que product_images sea un array
                const imagenes = producto.product_images || [];

                // Encontrar la imagen principal o usar la primera
                const imagenPrincipal = imagenes.find(img => img.is_primary) || imagenes[0];

                return {
                    ...producto,
                    categoria: producto.categories ? producto.categories.name : 'Sin categoría',
                    imagen: imagenPrincipal ? imagenPrincipal.url : null,
                    imagenes: imagenes
                };
            });
            // Convertir objeto de categorías a array
            for (const nombre in categoriasUnicas) {
                categoriasConCantidad.push(categoriasUnicas[nombre]);
            }
           

            setProductos(productosProcesados);
            setProductosFiltrados(productosProcesados); // Inicialmente mostrar todos  
            setCategorias(categoriasConCantidad);

        } catch (error) {
            console.error('Error al obtener productos:', error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filtrar productos cuando cambia la categoría seleccionada
    useEffect(() => {
        if (categoriaSeleccionada === 'Todos' || categoriaSeleccionada === 'todos') {
            setProductosFiltrados(productos);
        } else {
            const filtrados = productos.filter(producto =>
                producto.categoria === categoriaSeleccionada
            );
            setProductosFiltrados(filtrados);
        }
        setPaginaActual(1); // Reiniciar a la primera página al cambiar categoría
    }, [categoriaSeleccionada, productos]);

    // Scroll al cambiar página
    useEffect(() => {
        if (paginaActual !== 1) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [paginaActual]);

    // Calcular productos para la página actual
    const indiceUltimoProducto = paginaActual * productosPorPagina;
    const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;
    const productosActuales = productosFiltrados.slice(indicePrimerProducto, indiceUltimoProducto);

    // Calcular total de páginas
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

    // Cambiar página
    const cambiarPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina);
    };

    // Generar números de página
    const getNumerosPagina = () => {
        const numeros = [];
        const maxPaginasVisibles = 5;

        let inicio = Math.max(1, paginaActual - Math.floor(maxPaginasVisibles / 2));
        let fin = Math.min(totalPaginas, inicio + maxPaginasVisibles - 1);

        if (fin - inicio + 1 < maxPaginasVisibles) {
            inicio = Math.max(1, fin - maxPaginasVisibles + 1);
        }

        for (let i = inicio; i <= fin; i++) {
            numeros.push(i);
        }

        return numeros;
    };

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando productos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 mt-16">
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Tienda de Electrónica
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Paneles solares, baterías, motocicletas eléctricas, ventiladores y más
                    </p>
                </header>

                {/* Filtro por categorías */}
                {categorias.length > 0 && (
                    <div className="mb-10 bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Filtrar por categoría:
                            </h3>
                            <div className="block sm:hidden text-sm text-gray-500">
                                {categorias.length} categorías
                            </div>
                        </div>

                        <div className="relative">
                            {/* Para móviles */}
                            <div className="flex sm:hidden items-center justify-between mb-2">
                                <div className="text-sm text-gray-500">
                                    Desliza para ver más →
                                </div>
                                <button
                                    onClick={() => setCategoriaSeleccionada('Todos')}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Limpiar filtro
                                </button>
                            </div>

                            {/* Scroll horizontal para móviles */}
                            <div className="flex sm:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin">
                                <div className="flex space-x-2">
                                    <button
                                        className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all ${categoriaSeleccionada === 'Todos'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        onClick={() => setCategoriaSeleccionada('Todos')}
                                    >
                                        Todos ({productos.length})
                                    </button>
                                    {categorias.map((categoria, index) => (
                                        <button
                                            key={categoria.id || index}
                                            className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all ${categoriaSeleccionada === categoria.nombre
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            onClick={() => setCategoriaSeleccionada(categoria.nombre)}
                                        >
                                            {categoria.nombre} ({categoria.cantidad || 0})
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Para desktop */}
                            <div className="hidden sm:flex flex-wrap gap-2">
                                <button
                                    className={`px-4 py-2 rounded-full font-medium ${categoriaSeleccionada === 'Todos'
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    onClick={() => setCategoriaSeleccionada('Todos')}
                                >
                                    Todos ({productos.length})
                                </button>
                                {console.log(categorias)}
                                {categorias.map((categoria, index) => (
                                    <button
                                        key={categoria.id || index}
                                        className={`px-4 py-2 rounded-full font-medium ${categoriaSeleccionada === categoria.nombre
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        onClick={() => setCategoriaSeleccionada(categoria.nombre)}
                                    >
                                        {categoria.nombre} ({categoria.cantidad || 0})
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Grid de productos */}
                {productosActuales.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
                            {productosActuales.map((producto) => (
                                <ProductCard
                                    key={producto.id}
                                    producto={{
                                        ...producto,
                                        // Asegurar que el producto tenga la estructura esperada
                                        categoria: producto.categoria || 'Sin categoría',
                                        imagen: producto.imagen || null
                                    }}
                                    contactoWhatsApp="5358912073"
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-lg">
                            No hay productos disponibles en esta categoría.
                        </p>
                        <button
                            onClick={() => setCategoriaSeleccionada('Todos')}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Ver todos los productos
                        </button>
                    </div>
                )}

                {/* Paginación */}
                {totalPaginas > 1 && (
                    <div className="mt-12 bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-gray-600">
                                Mostrando <span className="font-semibold">{productosActuales.length}</span> de{' '}
                                <span className="font-semibold">{productosFiltrados.length}</span> productos
                                {categoriaSeleccionada !== 'Todos' && (
                                    <span> en "<span className="font-semibold">{categoriaSeleccionada}</span>"</span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    className={`px-4 py-2 rounded-lg font-medium ${paginaActual === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    onClick={() => cambiarPagina(paginaActual - 1)}
                                    disabled={paginaActual === 1}
                                >
                                    &laquo; Anterior
                                </button>

                                {getNumerosPagina().map((numero) => (
                                    <button
                                        key={numero}
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium ${paginaActual === numero
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        onClick={() => cambiarPagina(numero)}
                                    >
                                        {numero}
                                    </button>
                                ))}

                                <button
                                    className={`px-4 py-2 rounded-lg font-medium ${paginaActual === totalPaginas
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    onClick={() => cambiarPagina(paginaActual + 1)}
                                    disabled={paginaActual === totalPaginas}
                                >
                                    Siguiente &raquo;
                                </button>
                            </div>

                            <div className="text-sm text-gray-600">
                                Página <span className="font-semibold">{paginaActual}</span> de{' '}
                                <span className="font-semibold">{totalPaginas}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Productos;