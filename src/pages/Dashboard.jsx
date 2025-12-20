import React, { useState, useEffect } from 'react';
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
  X
} from 'lucide-react';
import { supabase } from "../supabase/client"
import { useNavigate } from 'react-router-dom';
import AgregarProduct from '../components/Dashboard/AgregarProduct';
import AgregarCategory from '../components/Dashboard/AgregarCategory';
import Productos from '../components/Dashboard/Productos';
import Categorias from '../components/Dashboard/Categorias';


export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Inicialmente cerrado en móvil
  const [activeMenu, setActiveMenu] = useState('productos');
  const [addProductModal, setAddProductModal] = useState(false);
  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [editProduct, setEditProduct] = useState()

  const navigate = useNavigate()

  // Función para obtener productos con categorías e imágenes
  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Obtener todos los productos con sus categorías e imágenes
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
                     id,
                     name,
                     short_description,
                     price,
                     stock_quantity,
                     guaranty,
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
        // if (producto.categories) {
        //   const categoriaNombre = producto.categories.name;

        //   if (!categoriasUnicas[categoriaNombre]) {
        //     categoriasUnicas[categoriaNombre] = {
        //       nombre: categoriaNombre,
        //       cantidad: 1,
        //       description: producto.categories.description,
        //       id: producto.categories.id
        //     };
        //   } else {
        //     categoriasUnicas[categoriaNombre].cantidad++;
        //   }
        // }

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
      // // Convertir objeto de categorías a array
      // for (const nombre in categoriasUnicas) {
      //   categoriasConCantidad.push(categoriasUnicas[nombre]);
      // }

      setProducts(productosProcesados);
      //setProductosFiltrados(productosProcesados); // Inicialmente mostrar todos  
      //setCategories(categoriasConCantidad);

    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función separada para obtener solo categorías (si las necesitas por separado)
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, description')
        .order('name');

      if (error) throw error;

      // Agregar contador de productos por categoría
      const categoriasConContador = data.map(categoria => ({
        ...categoria,
        cantidad: products.filter(p => p.category_id === categoria.id).length
      }));

      setCategories(categoriasConContador);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Obtener usuario actual
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate("/");
        } else {
          setLoading(false)
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);


  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { id: 'productos', label: 'Productos', icon: <Package size={20} /> },
    { id: 'usuarios', label: 'Usuarios', icon: <Users size={20} /> },
    { id: 'categorias', label: 'Categorías', icon: <Tag size={20} /> },
    { id: 'ventas', label: 'Ventas', icon: <ShoppingCart size={20} /> },
  ];

  const handleAddProductModal = (estado, product) => {
    setAddProductModal(estado)
    if (product) {
      setEditProduct(product)
    } else {
      setEditProduct()
    }
  }
  const handleAddCategoryModal = (estado) => {
    console.log(estado)
    setAddCategoryModal(estado)
  }

  // // Función para agregar nuevo producto
  const handleAddProduct = (nuevoProducto) => {
    setProducts([...products, nuevoProducto]);
  };

  const handleAddCategory = (nuevaCategory) => {
    setCategories([...categories, nuevaCategory]);
  };

  // Función para eliminar producto
  const handleDeleteProduct = (id) => {
    setProducts(products.filter(producto => producto.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="relative flex h-dvh overflow-hidden bg-gray-100">
      {/* Sidebar para Desktop - Siempre visible */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white shadow-lg border-r border-gray-200 h-full">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          </div>
        </div>

        {/* Menú de navegación */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveMenu(item.id);
                setSidebarOpen(false); // Cerrar sidebar en móvil
              }}
              className={`
                w-full flex items-center rounded-lg px-4 py-3 
                transition-all duration-200 hover:bg-gray-50
                ${activeMenu === item.id
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                  : 'text-gray-700'
                }
              `}
            >
              <div className={`${activeMenu === item.id ? 'text-blue-600' : 'text-gray-500'}`}>
                {item.icon}
              </div>
              <span className="ml-3 font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Perfil de usuario */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="text-blue-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Admin User</p>
              <p className="text-sm text-gray-500">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar para Mobile - Solo cuando está abierto */}
      {sidebarOpen && (
        <>
          <aside className="flex lg:hidden flex-col w-64 bg-white shadow-lg border-r border-gray-200 h-full fixed left-0 top-0 z-40">
            {/* Header del sidebar móvil */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Home className="text-white" size={24} />
                </div>
                <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* Menú de navegación móvil */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center rounded-lg px-4 py-3 
                    transition-all duration-200 hover:bg-gray-50
                    ${activeMenu === item.id
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700'
                    }
                  `}
                >
                  <div className={`${activeMenu === item.id ? 'text-blue-600' : 'text-gray-500'}`}>
                    {item.icon}
                  </div>
                  <span className="ml-3 font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Perfil de usuario móvil */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="text-blue-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Admin User</p>
                  <p className="text-sm text-gray-500">Administrador</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Overlay para móvil - Solo se muestra cuando sidebar está abierto */}
          <div
            className="lg:hidden fixed inset-0 bg-black/20 bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        </>
      )}

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header fijo */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                >
                  <Menu size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800 capitalize">
                  {activeMenu}
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
                </div>
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full absolute top-2 right-2"></div>
                  <User size={22} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Productos</p>
                    <p className="text-3xl font-bold mt-2">{products.length}</p>
                    <p className="text-sm text-green-500 mt-1">+12% este mes</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Package className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Usuarios</p>
                    <p className="text-3xl font-bold mt-2">2</p>
                    <p className="text-sm text-green-500 mt-1">+3 nuevos</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Users className="text-green-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Categorías</p>
                    <p className="text-3xl font-bold mt-2">{categories.length}</p>
                    <p className="text-sm text-gray-500 mt-1">Total activas</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Tag className="text-purple-600" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido según menú seleccionado */}
            {activeMenu === 'productos' && (
              <Productos products={products} handleAddProductModal={handleAddProductModal} onDelete={handleDeleteProduct} />
            )}

            {activeMenu === 'usuarios' && (
              <div className="bg-white rounded-xl shadow border p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Gestión de Usuarios</h2>
                <p className="text-gray-600">Contenido de usuarios aquí...</p>
              </div>
            )}

            {activeMenu === 'categorias' && (
              <Categorias categories={categories} handleAddCategoryModal={handleAddCategoryModal} />
            )}

            {activeMenu === 'dashboard' && (
              <div className="bg-white rounded-xl shadow border p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Dashboard General</h2>
                <p className="text-gray-600">Resumen general del sistema...</p>
              </div>
            )}

            {activeMenu === 'ventas' && (
              <div className="bg-white rounded-xl shadow border p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Gestión de Ventas</h2>
                <p className="text-gray-600">Contenido de ventas aquí...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal Agregar Producto */}
      {addProductModal && (
        <AgregarProduct
          handleAddProductModal={handleAddProductModal}
          onAddProduct={handleAddProduct}
          user={user}
          product={editProduct}
        />
      )}
      {/* Modal Agregar Category */}
      {addCategoryModal && (
        <AgregarCategory
          handleAddCategoryModal={() => handleAddCategoryModal(false)}
          onAddProduct={handleAddCategory}
          user={user}
        />
      )}
    </div>
  );
}