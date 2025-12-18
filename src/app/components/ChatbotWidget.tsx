"use client"

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, RefreshCw, Minimize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  quickReplies?: string[]
}

const STORAGE_KEY = 'torressantiago_chat_history'

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Auto-scroll al final de mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 💾 Cargar conversación desde localStorage al iniciar
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          // Convertir timestamps de string a Date
          const messagesWithDates = parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
          setMessages(messagesWithDates)
        }
        setIsInitialized(true)
      } catch (error) {
        console.error('Error al cargar historial:', error)
        setIsInitialized(true)
      }
    }
  }, [isInitialized])

  // 💾 Guardar conversación en localStorage cuando cambie
  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
      } catch (error) {
        console.error('Error al guardar historial:', error)
      }
    }
  }, [messages, isInitialized])

  // Focus en input cuando abre el chat
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  // Mensaje inicial de bienvenida
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: '¡Hola! 👋 Soy Alex, tu asistente virtual de Torres Santiago.\n\n¿En qué puedo ayudarte hoy? Puedo asesorarte sobre desarrollo web, apps móviles, chatbots con IA y más.',
        timestamp: new Date()
      }])
    }
  }, [isOpen, messages.length])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Crear mensaje del asistente vacío para ir llenando con streaming
    const assistantMessageIndex = messages.length + 1
    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, assistantMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      if (!response.ok) throw new Error('Error al obtener respuesta')

      // 🚀 STREAMING: Leer respuesta en tiempo real
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No se pudo iniciar streaming')

      let fullContent = ''
      let debugData: any = null
      let leadData: any = null

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))

              if (data.type === 'chunk') {
                // Agregar contenido incrementalmente
                fullContent += data.content
                setMessages(prev => {
                  const newMessages = [...prev]
                  newMessages[assistantMessageIndex] = {
                    ...newMessages[assistantMessageIndex],
                    content: fullContent
                  }
                  return newMessages
                })
              } else if (data.type === 'done') {
                // Guardar metadata final
                debugData = data._debug
                leadData = {
                  isHotLead: data.isHotLead,
                  leadScore: data.leadScore,
                  leadInfo: data.leadInfo
                }
              }
            } catch (e) {
              console.error('Error parsing chunk:', e)
            }
          }
        }
      }

      // Actualizar mensaje final
      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[assistantMessageIndex] = {
          ...newMessages[assistantMessageIndex],
          content: fullContent,
          quickReplies: undefined
        }
        return newMessages
      })

      // 📊 DEBUG: Métricas de optimización
      if (debugData) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('📊 MÉTRICAS DE OPTIMIZACIÓN')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('Total tokens:', debugData.totalTokens)
        console.log('Prompt tokens:', debugData.promptTokens)
        console.log('Completion tokens:', debugData.completionTokens)
        console.log('Secciones inyectadas:', debugData.sectionsInjected)
        console.log('Tokens del prompt dinámico:', debugData.dynamicPromptTokens)
        console.log('Optimización:', debugData.optimization)
        console.log('Source:', debugData.source)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      }

      // Si es lead caliente, notificar (el backend ya guardó el lead)
      if (leadData?.isHotLead) {
        console.log('🔥 Lead caliente detectado!', leadData)
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Disculpa, tuve un problema técnico. ¿Podrías intentarlo de nuevo? Si el problema persiste, escríbenos a WhatsApp: +52 951 318 3885',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Manejar click en Quick Reply
  const handleQuickReply = (reply: string) => {
    setInput(reply)
    // Auto-enviar después de un pequeño delay para que el usuario vea qué se envió
    setTimeout(() => {
      sendMessage()
    }, 100)
  }

  const resetChat = () => {
    setMessages([])
    setShowResetConfirm(false)
    setInput('')
    // Limpiar localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    // El useEffect se encargará de mostrar el mensaje de bienvenida nuevamente
  }

  return (
    <>
      {/* Botón flotante */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 bg-gradient-to-r from-accent to-yellow-600 hover:from-yellow-600 hover:to-accent text-white rounded-full p-3 sm:p-4 shadow-2xl transition-all duration-300 group hover:scale-110"
            aria-label="Abrir chat"
          >
            <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7" />
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <div className="absolute -top-12 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
              ¿Necesitas ayuda? 💬
              <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Ventana del chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed z-50 bg-white shadow-2xl flex flex-col transition-all duration-300
              ${isMinimized
                ? 'bottom-6 right-6 sm:bottom-8 sm:right-8 w-[280px] sm:w-[320px] h-auto rounded-full cursor-pointer hover:scale-105 overflow-hidden border border-gray-200'
                : 'inset-0 sm:inset-auto sm:bottom-8 sm:right-8 sm:w-[420px] sm:h-[650px] sm:max-w-md sm:rounded-2xl sm:border sm:border-gray-200 overflow-hidden'}`}
            onClick={() => isMinimized && setIsMinimized(false)}
          >
            {/* Header mejorado con diseño condicional */}
            <div className={`bg-gradient-to-r from-accent to-yellow-600 text-white flex justify-between items-center shadow-lg
              ${isMinimized ? 'p-3 rounded-full' : 'p-4'}`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-2 ring-white/30
                    ${isMinimized ? 'w-9 h-9' : 'w-10 h-10'}`}>
                    <MessageSquare className={`${isMinimized ? 'w-5 h-5' : 'w-6 h-6'}`} />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                </div>
                <div className={isMinimized ? '' : ''}>
                  <h3 className={`font-bold ${isMinimized ? 'text-sm' : 'text-base'}`}>
                    {isMinimized ? 'Alex' : 'Alex - Torres Santiago'}
                  </h3>
                  {!isMinimized && (
                    <p className="text-xs opacity-90 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      En línea ahora
                    </p>
                  )}
                  {isMinimized && (
                    <p className="text-xs opacity-90">
                      Clic para abrir
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                {!isMinimized && (
                  <>
                    {/* Botón reset */}
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="hover:bg-white/20 p-2 rounded-full transition-colors group relative"
                      aria-label="Reiniciar chat"
                      title="Nueva conversación"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    {/* Botón minimizar (solo desktop) */}
                    <button
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="hover:bg-white/20 p-2 rounded-full transition-colors hidden sm:block"
                      aria-label={isMinimized ? "Maximizar" : "Minimizar"}
                    >
                      <Minimize2 className="w-4 h-4" />
                    </button>
                  </>
                )}
                {/* Botón cerrar */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 p-2 rounded-full transition-colors"
                  aria-label="Cerrar chat"
                >
                  <X className={`${isMinimized ? 'w-4 h-4' : 'w-5 h-5'}`} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages con mejor diseño */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-b from-stone-50 to-stone-100">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-accent to-yellow-600 text-white shadow-md'
                            : 'bg-white text-gray-800 shadow-md border border-gray-200'
                        }`}
                      >
                        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                        <p className={`text-[10px] sm:text-xs mt-1.5 sm:mt-2 ${
                          message.role === 'user' ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {/* Quick Replies - Mostrar solo del último mensaje del asistente */}
                  {messages.length > 0 &&
                   messages[messages.length - 1].role === 'assistant' &&
                   messages[messages.length - 1].quickReplies &&
                   messages[messages.length - 1].quickReplies!.length > 0 &&
                   !isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap gap-2 px-1 sm:px-2"
                    >
                      {messages[messages.length - 1].quickReplies!.map((reply, idx) => (
                        <motion.button
                          key={idx}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4 + idx * 0.1, type: 'spring', stiffness: 200 }}
                          onClick={() => handleQuickReply(reply)}
                          className="px-3 py-2 sm:px-4 sm:py-2 bg-white border-2 border-accent/30 text-accent rounded-full text-xs sm:text-sm font-medium active:bg-accent active:text-white active:border-accent transition-all duration-200 shadow-sm active:shadow-md min-h-[44px] sm:min-h-0 flex items-center justify-center"
                        >
                          {reply}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white rounded-2xl px-3 py-3 sm:px-5 sm:py-4 shadow-md border border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm text-gray-500">
                            <span className="hidden sm:inline">Alex está escribiendo</span>
                            <span className="sm:hidden">Escribiendo</span>
                          </span>
                          <div className="flex gap-1">
                            <motion.div
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"
                              animate={{ y: [0, -6, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                            <motion.div
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"
                              animate={{ y: [0, -6, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.2
                              }}
                            />
                            <motion.div
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"
                              animate={{ y: [0, -6, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.4
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input mejorado con mejor visibilidad y táctil en móvil */}
                <div className="p-3 sm:p-4 bg-white border-t-2 border-gray-200 shadow-inner safe-area-bottom">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Escribe tu mensaje..."
                      className="flex-1 px-3 py-3 sm:px-4 sm:py-3 border-2 border-accent/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-white text-gray-900 text-base placeholder:text-gray-400 shadow-sm transition-all"
                      disabled={isLoading}
                      maxLength={500}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      className="bg-gradient-to-r from-accent to-yellow-600 text-white p-3 sm:p-3.5 rounded-xl hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                      aria-label="Enviar mensaje"
                    >
                      <Send className="w-5 h-5 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                  {input.length > 0 && (
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2 text-right">
                      {input.length}/500
                    </p>
                  )}
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2 text-center flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="hidden sm:inline">Powered by IA • Torres Santiago</span>
                    <span className="sm:hidden">Powered by IA</span>
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de confirmación de reset */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Nueva conversación</h3>
                  <p className="text-sm text-gray-600">¿Quieres reiniciar el chat?</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Se borrará todo el historial de la conversación actual.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={resetChat}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-accent to-yellow-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  Reiniciar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
