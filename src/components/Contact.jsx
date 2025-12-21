import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })
  const currentYear = new Date().getFullYear()
  
  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23c-1.48 0-2.93-.39-4.19-1.15l-.3-.17l-3.12.82l.83-3.04l-.2-.32a8.188 8.188 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31c-.22.25-.87.86-.87 2.07c0 1.22.89 2.39 1 2.56c.14.17 1.76 2.67 4.25 3.73c.59.27 1.05.42 1.41.53c.59.19 1.13.16 1.56.1c.48-.07 1.46-.6 1.67-1.18c.21-.58.21-1.07.15-1.18c-.07-.1-.23-.16-.48-.27c-.25-.14-1.47-.74-1.69-.82c-.23-.08-.37-.12-.56.12c-.16.25-.64.81-.78.97c-.15.17-.29.19-.53.07c-.26-.13-1.06-.39-2-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.12-.24-.01-.39.11-.5c.11-.11.27-.29.37-.44c.13-.14.17-.25.25-.41c.08-.17.04-.31-.02-.43c-.06-.11-.56-1.35-.77-1.84c-.2-.48-.4-.42-.56-.43c-.14 0-.3-.01-.47-.01z" />
        </svg>
      ),
      title: "WhatsApp",
      details: "+53 58912073",
      description: "Lunes a Viernes 9:00 - 18:00",
      href: "https://wa.me/5358912073"
    },
    {
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
      title: "Teléfono",
      details: "+53 58912073",
      description: "Lunes a Viernes 9:00 - 18:00",
      href: "tel:/5358912073"
    },
  ];

  const contactInfoCliente = [

    {
      icon: <MapPinIcon className="w-6 h-6" />,
      title: "Ubicación",
      details: "Cienfuegos, Cuba",
      description: "Trabajamos globalmente",
      href: "https://maps.google.com/?q=Cienfuegos+Cuba",
    },
    {
      icon: <ClockIcon className="w-6 h-6" />,
      title: "Horario",
      details: "24/7 Soporte",
      description: "Para todos los clientes"
    }
  ]

  return (
    <section className="py-4 px-4 bg-gradient-to-b from-gray-800 to-gray-900" id="contacto">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {contactInfo.map((info, index) => {
              // Solo hacer enlace si tiene href
              if (info.href) {
                return (
                  <a
                    key={index}
                    href={info.href}
                    target={info.href.startsWith('http') ? "_blank" : "_self"}
                    rel={info.href.startsWith('http') ? "noopener noreferrer" : undefined}
                    className="flex items-start space-x-4 group p-4 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer"
                  >
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <div className="text-white">
                          {info.icon}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1 group-hover:text-blue-300 transition-colors duration-300">
                        {info.title}
                      </h3>
                      <p className="text-blue-300 font-medium">{info.details}</p>
                      <p className="text-gray-400 text-sm mt-1">{info.description}</p>
                    </div>
                  </a>
                )
              }

              // Si no tiene href, es solo texto
              return (
                <div
                  key={index}
                  className="flex items-start space-x-4 group p-4 rounded-xl"
                >
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                      <div className="text-white">
                        {info.icon}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">
                      {info.title}
                    </h3>
                    <p className="text-blue-300 font-medium">{info.details}</p>
                    <p className="text-gray-400 text-sm mt-1">{info.description}</p>
                  </div>
                </div>
              )
            })}
          </motion.div>
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {contactInfoCliente.map((info, index) => {
              // Solo hacer enlace si tiene href
              if (info.href) {
                return (
                  <a
                    key={index}
                    href={info.href}
                    target={info.href.startsWith('http') ? "_blank" : "_self"}
                    rel={info.href.startsWith('http') ? "noopener noreferrer" : undefined}
                    className="flex items-start space-x-4 group p-4 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer"
                  >
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <div className="text-white">
                          {info.icon}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1 group-hover:text-blue-300 transition-colors duration-300">
                        {info.title}
                      </h3>
                      <p className="text-blue-300 font-medium">{info.details}</p>
                      <p className="text-gray-400 text-sm mt-1">{info.description}</p>
                    </div>
                  </a>
                )
              }

              // Si no tiene href, es solo texto
              return (
                <div
                  key={index}
                  className="flex items-start space-x-4 group p-4 rounded-xl"
                >
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                      <div className="text-white">
                        {info.icon}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">
                      {info.title}
                    </h3>
                    <p className="text-blue-300 font-medium">{info.details}</p>
                    <p className="text-gray-400 text-sm mt-1">{info.description}</p>
                  </div>
                </div>
              )
            })}
          </motion.div>

        </div>
        <p className='text-center text-gray-500'>© {currentYear} Todos los derechos reservados</p>
      </div>
    </section>
  )
}