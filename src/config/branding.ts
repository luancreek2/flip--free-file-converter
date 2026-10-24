/**
 * Flip - Centralized Branding Configuration
 *
 * Single source of truth for all brand identity. Change values here to rebrand the entire
 * application.
 */

export const branding = {
  // Product identity
  name: "Flip",
  shortName: "Flip",
  description:
    "Free, fast, and simple file converter for PDFs, images, videos, audio, documents, and more.",
  tagline: "Convert Your Files",

  // Visual identity
  logo: {
    path: "M9 16.5 14 21.5 23 11",
    width: 32,
    height: 32,
    alt: "Flip",
  },
  favicon: {
    // Paths relative to /public
    svg: "/flip-icon.svg",
  },

  // Color palette (OKLCH) - used in theme.css
  colors: {
    // Primary brand color - Purple
    primary: {
      600: "oklch(50% 0.22 295)", // Darker purple for hover
      500: "oklch(58% 0.26 295)", // Main brand purple
      400: "oklch(68% 0.22 295)", // Lighter purple
    },
    // Category accents for visual distinction
    category: {
      pdf: "oklch(55% 0.22 25)", // Red-orange
      image: "oklch(60% 0.2 145)", // Green
      video: "oklch(55% 0.25 280)", // Purple-blue
      audio: "oklch(60% 0.18 45)", // Orange
      document: "oklch(50% 0.18 220)", // Blue
      archive: "oklch(45% 0.15 65)", // Amber
      other: "oklch(50% 0.15 200)", // Teal
    },
  },

  // Metadata for SEO and social
  metadata: {
    title: "Flip — Free File Converter",
    description:
      "Convert PDFs, images, videos, audio, documents, and more. Free, fast, and simple.",
    ogImage: "", // Set after creating the social image.
    twitterHandle: "", // Set only for a real project account.
    url: "", // Set to the public origin before deployment.
  },

  // Legal / Attribution (AGPL-3.0 compliance)
  legal: {
    copyrightHolder: "Flip Contributors",
    originalProject: "ConvertX",
    originalUrl: "https://github.com/C4illin/ConvertX",
    sourceUrl: "https://github.com/luancreek2/flip--free-file-converter",
    license: "AGPL-3.0",
    licenseUrl: "https://www.gnu.org/licenses/agpl-3.0.html",
    showAttribution: true,
    showSourceLink: true,
  },

  // Feature flags
  features: {
    showPoweredBy: true,
    showSourceLink: true,
    showCategoryColors: true,
  },

  // UI constraints
  limits: {
    maxBrandingLength: 26, // Max chars in header (from ConvertX)
  },
} as const;
