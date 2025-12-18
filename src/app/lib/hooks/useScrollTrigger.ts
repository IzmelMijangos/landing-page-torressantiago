import { useEffect, useState, useCallback } from 'react'

interface UseScrollTriggerOptions {
  enabled?: boolean
  percentage?: number // Porcentaje de scroll para activar (0-100)
  delay?: number // Delay antes de poder activar (ms)
  showOnce?: boolean // Solo mostrar una vez por sesión
  element?: HTMLElement | null // Elemento específico a observar (default: document)
}

const STORAGE_KEY_PREFIX = 'scroll_trigger_shown_'

export function useScrollTrigger(
  triggerId: string = 'default',
  options: UseScrollTriggerOptions = {}
) {
  const {
    enabled = true,
    percentage = 50,
    delay = 5000,
    showOnce = true,
    element
  } = options

  const [shouldShow, setShouldShow] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [scrollPercentage, setScrollPercentage] = useState(0)

  const storageKey = `${STORAGE_KEY_PREFIX}${triggerId}`

  // Verificar si ya se mostró antes
  const hasBeenShown = useCallback(() => {
    if (typeof window === 'undefined') return false
    const shown = sessionStorage.getItem(storageKey)
    return shown === 'true'
  }, [storageKey])

  // Marcar como mostrado
  const markAsShown = useCallback(() => {
    if (typeof window !== 'undefined' && showOnce) {
      sessionStorage.setItem(storageKey, 'true')
    }
  }, [showOnce, storageKey])

  // Reset manual (útil para testing)
  const reset = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(storageKey)
      setShouldShow(false)
    }
  }, [storageKey])

  // Calcular porcentaje de scroll
  const calculateScrollPercentage = useCallback(() => {
    if (element) {
      // Scroll de un elemento específico
      const scrollTop = element.scrollTop
      const scrollHeight = element.scrollHeight - element.clientHeight
      return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
    } else {
      // Scroll del documento
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop

      const scrollableHeight = documentHeight - windowHeight
      return scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0
    }
  }, [element])

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

    const handleScroll = () => {
      const currentPercentage = calculateScrollPercentage()
      setScrollPercentage(currentPercentage)

      // Si alcanzó el porcentaje objetivo
      if (currentPercentage >= percentage) {
        setShouldShow(true)
        markAsShown()
      }
    }

    // Ejecutar una vez al montar para verificar estado inicial
    handleScroll()

    // Escuchar scroll
    if (element) {
      element.addEventListener('scroll', handleScroll, { passive: true })
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true })
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll)
      } else {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [isReady, enabled, percentage, element, calculateScrollPercentage, markAsShown])

  return {
    shouldShow,
    setShouldShow,
    scrollPercentage,
    reset,
    hasBeenShown: hasBeenShown()
  }
}
