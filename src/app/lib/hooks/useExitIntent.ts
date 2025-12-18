import { useEffect, useState, useCallback } from 'react'

interface UseExitIntentOptions {
  enabled?: boolean
  delay?: number // Delay antes de mostrar (ms)
  showOnce?: boolean // Solo mostrar una vez por sesión
  sensitivity?: number // Sensibilidad del mouse (pixels desde el top)
}

const STORAGE_KEY = 'exit_intent_shown'

export function useExitIntent(options: UseExitIntentOptions = {}) {
  const {
    enabled = true,
    delay = 3000,
    showOnce = true,
    sensitivity = 20
  } = options

  const [shouldShow, setShouldShow] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Verificar si ya se mostró antes
  const hasBeenShown = useCallback(() => {
    if (typeof window === 'undefined') return false
    const shown = sessionStorage.getItem(STORAGE_KEY)
    return shown === 'true'
  }, [])

  // Marcar como mostrado
  const markAsShown = useCallback(() => {
    if (typeof window !== 'undefined' && showOnce) {
      sessionStorage.setItem(STORAGE_KEY, 'true')
    }
  }, [showOnce])

  // Reset manual (útil para testing)
  const reset = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY)
      setShouldShow(false)
    }
  }, [])

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    // Si ya se mostró antes y showOnce está activo, no hacer nada
    if (showOnce && hasBeenShown()) {
      return
    }

    // Esperar el delay antes de activar la detección
    const delayTimer = setTimeout(() => {
      setIsReady(true)
    }, delay)

    return () => clearTimeout(delayTimer)
  }, [enabled, delay, showOnce, hasBeenShown])

  useEffect(() => {
    if (!isReady || !enabled) return

    const handleMouseLeave = (e: MouseEvent) => {
      // Detectar cuando el mouse se mueve hacia arriba (saliendo del viewport)
      if (e.clientY <= sensitivity) {
        setShouldShow(true)
        markAsShown()
      }
    }

    // Detectar cuando el usuario está a punto de salir (desktop)
    document.addEventListener('mouseleave', handleMouseLeave)

    // Para mobile: detectar scroll rápido hacia arriba (comportamiento similar)
    let lastScrollY = window.scrollY
    let scrollTimer: NodeJS.Timeout

    const handleScroll = () => {
      clearTimeout(scrollTimer)

      scrollTimer = setTimeout(() => {
        const currentScrollY = window.scrollY

        // Si scrolled rápidamente hacia arriba y está cerca del top
        if (lastScrollY > currentScrollY && currentScrollY < 100) {
          setShouldShow(true)
          markAsShown()
        }

        lastScrollY = currentScrollY
      }, 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimer)
    }
  }, [isReady, enabled, sensitivity, markAsShown])

  return {
    shouldShow,
    setShouldShow,
    reset,
    hasBeenShown: hasBeenShown()
  }
}
