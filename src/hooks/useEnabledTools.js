import { useCallback, useEffect, useState } from 'react'
import { getUsage } from '@/api/meApi.js'

let cachedTools = null
let pendingRequest = null

// Ne garde que les drapeaux booléens renvoyés par l'API pour éviter les valeurs parasites.
function normalizeEnabledTools(value) {
  if (!value || typeof value !== 'object') return null

  const normalized = {}
  for (const [tool, enabled] of Object.entries(value)) {
    if (typeof enabled === 'boolean') normalized[tool] = enabled
  }
  return normalized
}

// Charge une seule fois les outils activés, puis réutilise le résultat entre les composants.
function loadEnabledTools(force = false) {
  if (!force && cachedTools) return Promise.resolve(cachedTools)
  if (!force && pendingRequest) return pendingRequest

  pendingRequest = getUsage()
    .then((data) => {
      cachedTools = normalizeEnabledTools(data?.tools_enabled)
      return cachedTools
    })
    .catch(() => {
      cachedTools = null
      return null
    })
    .finally(() => {
      pendingRequest = null
    })

  return pendingRequest
}

// Invalide le cache après une modification administrative des outils activés.
export function clearEnabledToolsCache() {
  cachedTools = null
  pendingRequest = null
}

// Hook métier : expose l'état des outils et un test d'activation par identifiant.
export function useEnabledTools() {
  const [enabledTools, setEnabledTools] = useState(cachedTools)
  const [loading, setLoading] = useState(!cachedTools)

  useEffect(() => {
    let mounted = true

    loadEnabledTools().then((value) => {
      if (!mounted) return
      setEnabledTools(value)
      setLoading(false)
    })

    return () => {
      mounted = false
    }
  }, [])

  // Une clé absente est considérée active : seule la valeur false désactive un outil.
  const isEnabled = useCallback(
    (tool) => !enabledTools || enabledTools[tool] !== false,
    [enabledTools],
  )

  const refresh = useCallback(async () => {
    setLoading(true)
    const value = await loadEnabledTools(true)
    setEnabledTools(value)
    setLoading(false)
    return value
  }, [])

  return { enabledTools, isEnabled, loading, refresh }
}
