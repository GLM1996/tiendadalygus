const ProductCard = ({ producto, contactoWhatsApp }) => {
  // Función para abrir WhatsApp con el mensaje del producto
  const contactarWhatsApp = () => {
    console.log("asd")
    const mensaje = `Hola, estoy interesado en el producto:
    
📱 *${producto.name}*
💰 Precio: $${producto.price.toLocaleString()}
📋 Descripcion: ${producto.short_description}

¿Podrían darme más información?`;

    const url = `https://wa.me/${contactoWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    // Contenedor principal con posicionamiento relativo para el borde
    <div className="relative group">
      {/* Borde con gradiente animado - detrás del contenido */}
      <div className="absolute -inset-1 rounded-xl bg-linear-to-r from-pink-500 via-purple-500 to-blue-500 opacity-75 group-hover:opacity-100 transition-all duration-1000 group-hover:duration-200 animate-gradient-x "></div>

      {/* Contenido de la tarjeta */}
      <div className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full z-10">
        {/* Imagen del producto */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={producto.imagen}
            alt={producto.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {/* Badge de categoría */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full backdrop-blur-sm">
              {producto.categoria}
            </span>
          </div>
          {/* Badge de Category */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${producto.guaranty
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
              }`}>
              {producto.guaranty ? producto.guaranty : 'No Garantia'}
            </span>
          </div>
          {/* Badge de stock */}
          {/* <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${
              producto.stock_quantity
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {producto.stock_quantity ? 'En stock' : 'Agotado'}
            </span>
          </div> */}
        </div>

        {/* Información del producto */}
        <div className="p-4 flex flex-col grow">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
            {producto.name}
          </h3>

          <p className="text-gray-600 mb-2 grow line-clamp-2">
            {producto.short_description}
          </p>

          {/* Detalles del producto */}
          <div className="mt-auto">
            {/* Precio */}
            <div className="flex items-center gap-3 mb-2">
              <span className="font-bold text-gray-600">
                <b>Precio:</b> {producto.price.toLocaleString()} USD
              </span>
              {/* {producto.precioAnterior && (
                <span className="text-lg text-gray-500 line-through">
                  ${producto.precioAnterior.toLocaleString()}
                </span>
              )} */}
              {/* {producto.descuento && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded">
                  -{producto.descuento}%
                </span>
              )} */}
            </div>


            {/* Botón de WhatsApp */}
            <button
              className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer ${producto.stock_quantity
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              onClick={contactarWhatsApp}
              //disabled={!producto.stock_quantity}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23c-1.48 0-2.93-.39-4.19-1.15l-.3-.17l-3.12.82l.83-3.04l-.2-.32a8.188 8.188 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31c-.22.25-.87.86-.87 2.07c0 1.22.89 2.39 1 2.56c.14.17 1.76 2.67 4.25 3.73c.59.27 1.05.42 1.41.53c.59.19 1.13.16 1.56.1c.48-.07 1.46-.6 1.67-1.18c.21-.58.21-1.07.15-1.18c-.07-.1-.23-.16-.48-.27c-.25-.14-1.47-.74-1.69-.82c-.23-.08-.37-.12-.56.12c-.16.25-.64.81-.78.97c-.15.17-.29.19-.53.07c-.26-.13-1.06-.39-2-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.12-.24-.01-.39.11-.5c.11-.11.27-.29.37-.44c.13-.14.17-.25.25-.41c.08-.17.04-.31-.02-.43c-.06-.11-.56-1.35-.77-1.84c-.2-.48-.4-.42-.56-.43c-.14 0-.3-.01-.47-.01z" />
              </svg>
              {/* {producto.stock_quantity ? 'Consultar por WhatsApp' : 'Producto agotado'} */}
              Consultar por Whatsapp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;