// Catégories d'affichage du catalogue ; elles servent uniquement au filtrage du front.
export const TOOL_CATEGORIES = [
  { id: 'all', label: 'Tous' },
  { id: 'optimize', label: 'Optimiser' },
  { id: 'convert', label: 'Convertir' },
  { id: 'organize', label: 'Organiser' },
  { id: 'security', label: 'Sécurité' },
  { id: 'photo', label: 'Photo' },
]

// Outils strictement documentés dans FRONTEND.md ; aucun outil supplémentaire n'est ajouté.
export const TOOLS = [
  {
    tool: 'compress',
    name: 'Compresser un fichier',
    description: 'Réduire la taille des images, PDF, vidéos et documents bureautiques.',
    category: 'optimize',
  },
  {
    tool: 'pdf_to_word',
    name: 'PDF vers Word',
    description: 'Convertir un PDF en document DOC ou DOCX modifiable.',
    category: 'convert',
  },
  {
    tool: 'pdf_to_images',
    name: 'PDF vers images',
    description: 'Convertir les pages d’un PDF en images PNG ou JPG.',
    category: 'convert',
  },
  {
    tool: 'images_to_pdf',
    name: 'Images vers PDF',
    description: 'Assembler plusieurs images dans un seul PDF.',
    category: 'convert',
  },
  {
    tool: 'zip',
    name: 'Archiver en ZIP',
    description: 'Regrouper plusieurs fichiers dans une archive ZIP.',
    category: 'organize',
  },
  {
    tool: 'pdf_merge',
    name: 'Fusionner des PDF',
    description: 'Assembler plusieurs PDF en un seul document.',
    category: 'organize',
  },
  {
    tool: 'pdf_split',
    name: 'Scinder un PDF',
    description: 'Extraire une ou plusieurs plages de pages.',
    category: 'organize',
  },
  {
    tool: 'pdf_reorder',
    name: 'Réorganiser un PDF',
    description: 'Changer l’ordre des pages d’un PDF.',
    category: 'organize',
  },
  {
    tool: 'pdf_sign',
    name: 'Signer un PDF',
    description: 'Ajouter une signature à un PDF.',
    category: 'security',
  },
  {
    tool: 'pdf_protect',
    name: 'Protéger un PDF',
    description: 'Ajouter un mot de passe à un PDF.',
    category: 'security',
  },
  {
    tool: 'pdf_watermark',
    name: 'Ajouter un filigrane',
    description: 'Ajouter un texte en filigrane sur un PDF.',
    category: 'security',
  },
  {
    tool: 'photo_id',
    name: 'Photo d’identité',
    description: 'Préparer une photo selon les pays et documents disponibles.',
    category: 'photo',
  },
]
