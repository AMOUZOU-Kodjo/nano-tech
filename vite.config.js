import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { TOOLS } from './src/config/tools.js'

// Configuration Vite : React, Tailwind CSS v4 et alias court vers le dossier source.
const SITE_URL = 'https://nanofile.tech'
const INDEXABLE_ROBOTS = 'index, follow, max-image-preview:large'
const PRIVATE_ROBOTS = 'noindex, nofollow'

const PUBLIC_PAGES = {
  '/': {
    title: 'NanoFile — Traitement de fichiers en ligne',
    description: 'Compressez, convertissez et réorganisez vos fichiers PDF, images et documents en ligne avec NanoFile.',
  },
  '/catalogue': {
    title: 'Catalogue des outils — NanoFile',
    description: 'Découvrez tous les outils NanoFile pour traiter vos fichiers PDF, images et documents.',
  },
  '/terms': {
    title: 'Conditions générales — NanoFile',
    description: 'Conditions générales d’utilisation de NanoFile.',
  },
  '/privacy': {
    title: 'Confidentialité — NanoFile',
    description: 'Politique de confidentialité de NanoFile.',
  },
  '/cookies': {
    title: 'Cookies — NanoFile',
    description: 'Politique de gestion des cookies de NanoFile.',
  },
  '/legal': {
    title: 'Mentions légales — NanoFile',
    description: 'Mentions légales de NanoFile.',
  },
}

const PRIVATE_PATHS = [
  '/dashboard',
  '/profile',
  '/account',
  '/documents',
  '/studio',
  '/jobs',
  '/billing',
  '/billing/success',
  '/billing/cancel',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/auth/verify',
  '/admin',
]

// Échappe les caractères spéciaux avant injection dans les balises HTML.
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Remplace une balise SEO une seule fois et signale toute dérive du index.html source.
function replaceOnce(html, pattern, replacement, label) {
  if (!pattern.test(html)) {
    throw new Error(`SEO : ${label} introuvable dans index.html`)
  }
  return html.replace(pattern, replacement)
}

// Génère un HTML statique par route pour éviter les doublons et les noindex involontaires.
function applySeo(html, path, title, description, robots) {
  const canonical = `${SITE_URL}${path}`
  const escapedTitle = escapeHtml(title)
  const escapedDescription = escapeHtml(description)

  return [
    [/<title>[\s\S]*?<\/title>/, `<title>${escapedTitle}</title>`, 'title'],
    [/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${escapedDescription}" />`, 'description'],
    [/<meta\s+name="robots"[^>]*\/>/, `<meta name="robots" content="${robots}" />`, 'robots'],
    [/<link\s+rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${canonical}" />`, 'canonical'],
    [/<meta\s+property="og:url"[^>]*\/>/, `<meta property="og:url" content="${canonical}" />`, 'og:url'],
    [/<meta\s+property="og:title"[^>]*\/>/, `<meta property="og:title" content="${escapedTitle}" />`, 'og:title'],
    [/<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${escapedDescription}" />`, 'og:description'],
  ].reduce(
    (output, [pattern, replacement, label]) => replaceOnce(output, pattern, replacement, label),
    html,
  )
}

// Plugin de prérendu SEO : écrit les variantes de index.html après le build Vite.
function seoPrerender() {
  let outDir

  return {
    name: 'nanofile-seo-prerender',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const indexPath = join(outDir, 'index.html')
      if (!existsSync(indexPath)) {
        return
      }

      const html = readFileSync(indexPath, 'utf8')

      function writePage(path, title, description, robots) {
        const output = applySeo(html, path, title, description, robots)
        const filePath = path === '/' ? indexPath : join(outDir, path.slice(1), 'index.html')
        mkdirSync(dirname(filePath), { recursive: true })
        writeFileSync(filePath, output, 'utf8')
      }

      Object.entries(PUBLIC_PAGES).forEach(([path, meta]) => {
        writePage(path, meta.title, meta.description, INDEXABLE_ROBOTS)
      })

      TOOLS.forEach((tool) => {
        writePage(
          `/tools/${tool.tool}`,
          `${tool.name} — NanoFile`,
          tool.description,
          INDEXABLE_ROBOTS,
        )
      })

      PRIVATE_PATHS.forEach((path) => {
        writePage(
          path,
          'NanoFile — Espace utilisateur',
          'Espace personnel NanoFile, réservé aux utilisateurs connectés.',
          PRIVATE_ROBOTS,
        )
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoPrerender()],
  resolve: {
    alias: {
      // « @ » pointe vers src pour éviter les chemins relatifs longs.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
