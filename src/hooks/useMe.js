import { useCallback, useEffect, useState } from 'react'
import { getMe } from '@/api/meApi.js'

// Retient la première valeur réellement définie, en préservant les null explicites de l'API.
function firstDefined(...values) {
  return values.find((value) => value !== undefined)
}

// Fusionne le quota invité et les compteurs documentés à la racine de la réponse riche.
function extractQuota(payload) {
  const embedded = payload?.quota && typeof payload.quota === 'object' ? payload.quota : {}

  return {
    ...embedded,
    plan: firstDefined(payload?.plan, embedded.plan),
    credits: firstDefined(payload?.credits, embedded.credits),
    paywall_enabled: firstDefined(payload?.paywall_enabled, embedded.paywall_enabled),
    free_uses_left: firstDefined(payload?.free_uses_left, embedded.free_uses_left),
    ai_uses_left_today: firstDefined(payload?.ai_uses_left_today, embedded.ai_uses_left_today),
    daily_jobs_left: firstDefined(payload?.daily_jobs_left, embedded.daily_jobs_left),
    daily_renders_left: firstDefined(payload?.daily_renders_left, embedded.daily_renders_left),
    limits: firstDefined(payload?.limits, embedded.limits),
  }
}

// Hook métier : charge le profil et expose les états user, quota, loading et error.
export function useMe() {
  const [data, setData] = useState(null)
  const [user, setUser] = useState(null)
  const [quota, setQuota] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Recharge le profil ; un utilisateur null n'est un invité que si la réponse est fiable.
  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const payload = await getMe()
      setData(payload)
      setUser(payload?.user ?? null)
      setQuota(extractQuota(payload))
      return payload
    } catch (caughtError) {
      setError(caughtError)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Chargement initial : la réponse est traitée dans un callback asynchrone, sans setState synchrone.
  useEffect(() => {
    let mounted = true

    getMe().then(
      (payload) => {
        if (mounted) {
          setData(payload)
          setUser(payload?.user ?? null)
          setQuota(extractQuota(payload))
          setLoading(false)
        }
      },
      (caughtError) => {
        if (mounted) {
          setError(caughtError)
          setLoading(false)
        }
      },
    )

    return () => {
      mounted = false
    }
  }, [])

  const isResolved = !loading && !error

  return {
    data,
    user,
    quota,
    loading,
    error,
    reload,
    isResolved,
    isUnknown: !loading && !isResolved,
    isGuest: isResolved && user === null,
  }
}
