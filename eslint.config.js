import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

// Configuration ESLint "plate" : JavaScript recommandé, navigateur, React Hooks et JSX.
export default defineConfig([
  // Dossiers générés exclus du lint.
  { ignores: ['dist', 'node_modules'] },

  // Preset officiel des règles React Hooks en configuration plate.
  reactHooks.configs.flat.recommended,

  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      // Préfixer un argument inutilisé par « _ » indique qu'il est volontairement ignoré.
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Les fichiers de composants ne doivent exporter que des composants.
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
])
