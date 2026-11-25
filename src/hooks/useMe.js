import { useCallback, useEffect, useState } from 'react'
import { getMe, getUsage } from '@/api/meApi.js'

// Retient la première valeur réellement définie, en préservant les null explicites de l'API.
function firstDefined(...values) {
  return values.find((value) => value !== undefined)
}

// Fusionne le quota de /me avec les compteurs réels de /v1/usage, source de vérité des essais.
function extractQuota(payload, usage) {
  const embedded = payload?.quota && typeof payload.quota === 'object' ? payload.quota : {}

  return {
    ...embedded,
    plan: firstDefined(usage?.plan, payload?.plan, embedded.plan),
    credits: firstDefined(usage?.credits, payload?.credits, embedded.credits),
    paywall_enabled: firstDefined(
      usage?.paywall_enabled,
      payload?.paywall_enabled,
      embedded.paywall_enabled,
    ),
    free_uses_left: firstDefined(
      usage?.free_uses_left,
      payload?.free_uses_left,
      embedded.free_uses_left,
    ),
    ai_uses_left_today: firstDefined(
      usage?.ai_uses_left_today,
      payload?.ai_uses_left_today,
      embedded.ai_uses_left_today,
    ),
    daily_jobs_left: firstDefined(
      usage?.daily_jobs_left,
      payload?.daily_jobs_left,
      embedded.daily_jobs_left,
    ),
    daily_renders_left: firstDefined(
      usage?.daily_renders_left,
      payload?.daily_renders_left,
      embedded.daily_renders_left,
    ),
    limits: firstDefined(usage?.limits, payload?.limits, embedded.limits),
  }
}

async function loadProfile() {
  const [payload, usage] = await Promise.all([getMe(), getUsage().catch(() => null)])
  return { payload, usage }
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
      const { payload, usage } = await loadProfile()
      setData(payload)
      setUser(payload?.user ?? null)
      setQuota(extractQuota(payload, usage))
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

    loadProfile().then(
      ({ payload, usage }) => {
        if (mounted) {
          setData(payload)
          setUser(payload?.user ?? null)
          setQuota(extractQuota(payload, usage))
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
