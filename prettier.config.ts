import type { PluginConfig as SortImportsPluginConfig } from "@ianvs/prettier-plugin-sort-imports";
import type { Config } from "prettier";
import type { PluginOptions as TailwindPluginOptions } from "prettier-plugin-tailwindcss";

/**
 * Modern 2026 Prettier Configuration for Astro, Vue 3, Tailwind CSS v4, and TypeScript.
 *
 * Fully typed config combining core Prettier, Tailwind v4 class sorting, natural Feature-Sliced
 * Design import sorting, and Astro language service utilities.
 */
type PrettierConfig = Config
  & TailwindPluginOptions
  & SortImportsPluginConfig & {
    /** Astro organize imports mode ('All' | 'SortAndCombine' | 'RemoveUnused') */
    astroOrganizeImportsMode?: "All" | "SortAndCombine" | "RemoveUnused";
    /** Whether to organize imports within <script> tags inside Astro templates */
    astroOrganizeImportsInScriptTags?: boolean;
  };

const config: PrettierConfig = {
  // ─── Core Formatting ──────────────────────────────────────────────────────
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  jsxSingleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  endOfLine: "lf",

  // ─── HTML & Template Formatting ───────────────────────────────────────────
  // Respect CSS display rules for whitespace (critical for Tailwind inline elements)
  htmlWhitespaceSensitivity: "css",
  // One attribute per line for clean git diffs and visual clarity
  singleAttributePerLine: true,
  // Always wrap prose in markdown
  proseWrap: "always",
  // Format embedded code blocks in markdown or template literals
  embeddedLanguageFormatting: "auto",

  // ─── Modern & Experimental Syntax Features ────────────────────────────────
  // Curious ternaries formatting: condition ? consequent : alternate
  experimentalTernaries: true,
  // Collapse short object wrapping on single lines when under printWidth
  objectWrap: "collapse",
  // Operators go at the start of new lines (math convention)
  experimentalOperatorPosition: "start",

  // ─── Plugin Pipeline ──────────────────────────────────────────────────────
  // Strict execution order to ensure parser wrapping and class sorting succeed:
  // 1. package.json key sorter
  // 2. Import statement organizer
  // 3. JSDoc comment formatter
  // 4. Astro parser & printer
  // 5. Tailwind v4 class sorter (must wrap astro printer)
  // 6. Astro organize imports (must be loaded last per plugin docs)
  plugins: [
    "prettier-plugin-packagejson",
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-jsdoc",
    "prettier-plugin-astro",
    "prettier-plugin-tailwindcss",
    "prettier-plugin-astro-organize-imports",
  ],

  // ─── Import Sorting (@ianvs/prettier-plugin-sort-imports) ───────────────────
  importOrder: [
    // 1. Framework core
    "^(astro(/.*)?|astro:.*)$",
    "^(vue(/.*)?)$",
    "",
    // 2. Node.js built-ins
    "<BUILTIN_MODULES>",
    "",
    // 3. Third-party packages
    "<THIRD_PARTY_MODULES>",
    "",
    // 4. Type imports (explicitly isolated)
    "<TYPES>",
    "<TYPES>^[.]",
    "",
    // 5. Internal module aliases
    "^@/(.*)$",
    "^@components/(.*)$",
    "^@layouts/(.*)$",
    "^@sections/(.*)$",
    "^@features/(.*)$",
    "^@ui/(.*)$",
    "^@data/(.*)$",
    "^@type/(.*)$",
    "^@scripts/(.*)$",
    "^@assets/(.*)$",
    "",
    // 6. Relative local module imports
    "^[./]",
    "",
    // 7. Stylesheets (always last to preserve CSS cascade)
    String.raw`^.+\.css$`,
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "6.0.0",
  importOrderCaseSensitive: false,

  // ─── Tailwind CSS v4 Integration ──────────────────────────────────────────
  // Path to main CSS entry point containing @import "tailwindcss"
  tailwindStylesheet: "./src/styles/globals.css",
  // Custom helper functions receiving Tailwind utility classes
  tailwindFunctions: ["cn", "cva", "clsx", "twMerge"],

  // ─── Astro Language Service Import Organization ───────────────────────────
  astroOrganizeImportsMode: "All",
  astroOrganizeImportsInScriptTags: true,

  // ─── Language-Specific Overrides ──────────────────────────────────────────
  overrides: [
    { files: "*.astro", options: { parser: "astro" } },
    { files: ["*.json", "*.jsonc"], options: { printWidth: 80 } },
    { files: ["*.md", "*.mdx"], options: { proseWrap: "always" } },
    { files: ["*.svg"], options: { parser: "html" } },
    { files: ["*.yml", "*.yaml"], options: { singleQuote: false, tabWidth: 2 } },
  ],
};

export default config;
