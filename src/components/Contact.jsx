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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // REEMPLAZA ESTA URL CON TU ENDPOINT DE FORMSPREE
      const response = await fetch('https://formspree.io/f/mgvgrzvj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
          _subject: `Nuevo mensaje de contacto de ${formData.name}`,
          _replyto: formData.email,
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', company: '', message: '' })

        // Resetear mensaje de éxito después de 5 segundos
        setTimeout(() => {
          setSubmitStatus(null)
        }, 5000)
      } else {
        throw new Error('Error en la respuesta')
      }
    } catch (error) {
      console.error('Error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: <EnvelopeIcon className="w-6 h-6" />,
      title: "Email",
      details: "estrellaglm96@gmail.com",
      description: "Respondemos en menos de 24 horas",
      href: "mailto:estrellaglm96@gmail.com"
    },
    {
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
      title: "Telefono/WhatsApp",
      details: "+53 63835837",
      description: "Lunes a Viernes 9:00 - 18:00",
      href: "https://wa.me/5363835837"
    },
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
    <section className="py-20 px-4 bg-gradient-to-b from-gray-800 to-gray-900" id="contacto">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Contáctanos</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            ¿Listo para transformar tu negocio? Hablemos sobre cómo podemos ayudarte a alcanzar tus objetivos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            className="space-y-8"
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
         
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50"
                    placeholder="Nombre de tu empresa"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    rows="5"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 resize-none"
                    placeholder="Cuéntanos sobre tu proyecto o necesidades..."
                  />
                </div>

                <div className="pt-4">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium py-4 rounded-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] group ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    whileHover={isSubmitting ? {} : { scale: 1.02 }}
                    whileTap={isSubmitting ? {} : { scale: 0.98 }}
                  >
                    <span className="flex items-center justify-center">
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 mr-3 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar mensaje
                          <svg
                            className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 group-hover:ml-3 transition-all duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </span>
                  </motion.button>

                  {/* Mensaje de éxito o error */}
                  {submitStatus === 'success' && (
                    <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <p className="text-green-400 text-center">
                        ¡Mensaje enviado con éxito! Te contactaremos pronto.
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-center">
                        Hubo un error al enviar. Por favor, intenta nuevamente.
                      </p>
                    </div>
                  )}

                  <p className="text-gray-400 text-sm text-center mt-4">
                    * Campos obligatorios. Te contactaremos en menos de 24 horas.
                  </p>
                </div>
              </form>

              {/* Form Decoration */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
              <div className="absolute -bottom-1 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}