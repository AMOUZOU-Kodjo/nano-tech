const API_URL = import.meta.env.VITE_API_URL

// La base URL doit être définie dans .env, sinon aucun appel ne peut être formulé.
if (!API_URL) {
  throw new Error('VITE_API_URL est absent du fichier .env.')
}

// Clé locale du jeton anonyme renvoyé par GET /me et réutilisable entre onglets.
const ANON_ID_STORAGE_KEY = 'nanofile.anon_id'

// Lit le jeton anonyme déjà enregistré, sans échouer si le stockage est indisponible.
function readStoredAnonId() {
  try {
    return globalThis.localStorage?.getItem(ANON_ID_STORAGE_KEY) || null
  } catch {
    return null
  }
}

// Jeton anonyme courant, initialisé depuis le stockage local du navigateur.
let anonId = readStoredAnonId()

// Enregistre ou remplace le jeton anonyme reçu de l'API.
export function setAnonId(token) {
  if (typeof token !== 'string' || !token) {
    return
  }

  anonId = token

  try {
    globalThis.localStorage?.setItem(ANON_ID_STORAGE_KEY, token)
  } catch {
    // Le jeton reste disponible en mémoire même si le stockage est refusé.
  }
}

// Supprime le jeton anonyme courant et sa copie persistée.
export function clearAnonId() {
  anonId = null

  try {
    globalThis.localStorage?.removeItem(ANON_ID_STORAGE_KEY)
  } catch {
    // Aucune action supplémentaire : le stockage est facultatif.
  }
}

// Détermine la langue à envoyer à l'API à partir des préférences du navigateur.
function detectLanguage() {
  const candidates =
    typeof navigator === 'undefined'
      ? []
      : navigator.languages?.length
        ? navigator.languages
        : [navigator.language]

  for (const candidate of candidates) {
    if (typeof candidate !== 'string') {
      continue
    }

    const normalized = candidate.toLowerCase()
    if (normalized.startsWith('fr')) {
      return 'fr'
    }
    if (normalized.startsWith('en')) {
      return 'en'
    }
  }

  return 'fr'
}

// Mémorise le jeton anonyme dès qu'une réponse JSON en contient un.
function rememberAnonId(payload) {
  if (payload && typeof payload === 'object' && typeof payload.anon_token === 'string') {
    setAnonId(payload.anon_token)
  }
}

// Erreur uniforme renvoyée aux hooks : elle gère les trois formats décrits dans nos sources.
export class ApiError extends Error {
  constructor(status, payload) {
    const detail = payload?.detail
    const error = payload?.error
    // OpenAPI : detail[] ; curl 401 : detail.code/message ; FRONTEND.md : error.code/message/details.
    const firstMessage = Array.isArray(detail) ? detail[0]?.msg : detail?.message ?? error?.message
    const message = firstMessage ?? (typeof detail === 'string' ? detail : null) ?? `Erreur HTTP ${status}`

    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
    this.code = detail?.code ?? error?.code ?? null
    this.details = Array.isArray(detail) ? detail : error?.details ?? null
  }
}

// Construit l'URL complète à partir d'un chemin relatif à la base de l'API.
export function buildApiUrl(path) {
  const base = API_URL.replace(/\/$/, '')
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${base}${suffix}`
}

// Détecte un en-tête déjà fourni, quelle que soit la casse de son nom.
function hasHeader(headers, name) {
  return Object.keys(headers).some((key) => key.toLowerCase() === name.toLowerCase())
}

// Détecte un Content-Type déjà fourni, quelle que soit la casse de la clé.
function hasContentType(headers) {
  return hasHeader(headers, 'Content-Type')
}

// Appel HTTP centralisé : ajoute les en-têtes recommandés, sérialise le JSON et normalise les erreurs.
export async function apiFetch(path, options = {}) {
  const { method = 'GET', body, headers = {}, signal, ...rest } = options
  const requestHeaders = { ...headers }
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  if (!hasHeader(requestHeaders, 'Accept-Language')) {
    requestHeaders['Accept-Language'] = detectLanguage()
  }
  if (anonId && !hasHeader(requestHeaders, 'X-Anon-Id')) {
    requestHeaders['X-Anon-Id'] = anonId
  }
  if (body !== undefined && !isFormData && !hasContentType(requestHeaders)) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  const response = await fetch(buildApiUrl(path), {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    // Les sessions d'authentification sont transmises par cookies entre le front et l'API.
    credentials: 'include',
    signal,
    ...rest,
  })

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''
  const rawBody = await response.text()
  let payload = null

  if (rawBody) {
    payload = contentType.includes('application/json') ? JSON.parse(rawBody) : rawBody
  }

  rememberAnonId(payload)

  if (!response.ok) {
    throw new ApiError(response.status, payload)
  }

  return payload
}
