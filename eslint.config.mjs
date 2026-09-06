import js from "@eslint/js";
import eslintPluginAstro from "eslint-plugin-astro";
import nounsanitized from "eslint-plugin-no-unsanitized";
import prettierConfig from "eslint-config-prettier";
import pluginPromise from "eslint-plugin-promise";
import regexpPlugin from "eslint-plugin-regexp";
import securityPlugin from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import eslintPluginVue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";
import globals from "globals";

export default tseslint.config(
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. Core JS recommended — enables ~30 essential rules (no-undef, etc.)
  // ═══════════════════════════════════════════════════════════════════════════
  js.configs.recommended,

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. TypeScript — strictest type-checked config (~100+ rules)
  //    Scoped to .ts/.tsx only — .astro and .vue use their own parsers
  // ═══════════════════════════════════════════════════════════════════════════
  ...tseslint.configs.strictTypeChecked.map((config) => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
  })),
  ...tseslint.configs.stylisticTypeChecked.map((config) => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
  })),

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. Astro — recommended + accessibility
  // ═══════════════════════════════════════════════════════════════════════════
  ...eslintPluginAstro.configs["flat/recommended"],
  ...eslintPluginAstro.configs["flat/jsx-a11y-recommended"],

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. Vue — recommended
  // ═══════════════════════════════════════════════════════════════════════════
  ...eslintPluginVue.configs["flat/recommended"],

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. Unicorn — 300+ modern JS best-practice rules
  // ═══════════════════════════════════════════════════════════════════════════
  unicorn.configs.recommended,

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. Security — detect unsafe patterns
  // ═══════════════════════════════════════════════════════════════════════════
  securityPlugin.configs.recommended,
  nounsanitized.configs.recommended,

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. Regexp — validate regex patterns
  // ═══════════════════════════════════════════════════════════════════════════
  regexpPlugin.configs["flat/recommended"],

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. Promise — enforce promise best practices
  // ═══════════════════════════════════════════════════════════════════════════
  pluginPromise.configs["flat/recommended"],

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. SonarJS — cognitive complexity & code smells
  // ═══════════════════════════════════════════════════════════════════════════
  sonarjs.configs.recommended,

  // ─── SonarJS tuning (warn-only for cognitive complexity) ────────────────
  { rules: { "sonarjs/cognitive-complexity": "warn", "sonarjs/no-duplicate-string": "warn" } },

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. Unicorn overrides — only disable what's genuinely incompatible
  // ═══════════════════════════════════════════════════════════════════════════
  {
    rules: {
      // Astro/Vue use mixed casing for component files
      "unicorn/filename-case": "off",
      // Custom names are fine (Props, etc.)
      "unicorn/name-replacements": "off",
      // null is valid in many APIs (DOM, JSON, Zod, etc.)
      "unicorn/no-null": "off",
      // reduce() is fine for aggregation patterns
      "unicorn/no-array-reduce": "off",
      // Math.trunc vs bitwise — preference
      "unicorn/prefer-math-trunc": "off",
      // Top-level await not supported in all Astro contexts
      "unicorn/prefer-top-level-await": "off",
      // Empty files are valid in Astro (layout stubs, etc.)
      "unicorn/no-empty-file": "off",
      // text-encoding casing — not worth enforcing
      "unicorn/text-encoding-identifier-case": "off",
      // Boolean naming convention — too opinionated for component props
      "unicorn/consistent-boolean-name": "off",
      // Astro components have top-level side effects by design
      "unicorn/no-top-level-side-effects": "off",
      // globalThis usage — sometimes necessary
      "unicorn/no-unnecessary-global-this": "off",
      // Computed property existence checks — valid pattern
      "unicorn/no-computed-property-existence-check": "off",
      // Top-level assignment in functions — Astro frontmatter pattern
      "unicorn/no-top-level-assignment-in-function": "off",
      // ── Re-enabled for strictness (were previously off) ──
      "unicorn/prefer-at": "error",
      "unicorn/prefer-string-slice": "error",
      "unicorn/prefer-ternary": "warn",
      "unicorn/prefer-logical-operator-over-ternary": "warn",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 11. TypeScript strict overrides — scoped to .ts/.tsx files
  // ═══════════════════════════════════════════════════════════════════════════
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: { parserOptions: { project: true, tsconfigRootDir: import.meta.dirname } },
    rules: {
      // ── Existing rules — escalated to error ──
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/array-type": ["error", { default: "array" }],
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/return-await": ["error", "in-try-catch"],
      "@typescript-eslint/prefer-promise-reject-errors": "error",

      // ── Escalated from warn → error (ultimate strictness) ──
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-argument": "error",

      // ── New strict rules ──
      "@typescript-eslint/no-deprecated": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-confusing-void-expression": "error",
      "@typescript-eslint/restrict-template-expressions": "error",
      "@typescript-eslint/strict-boolean-expressions": "warn",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 12. Vue overrides
  // ═══════════════════════════════════════════════════════════════════════════
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tseslint.parser, extraFileExtensions: [".vue"] },
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "warn",
      "vue/require-default-prop": "off",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 13. General quality — strict core JS rules
  // ═══════════════════════════════════════════════════════════════════════════
  {
    languageOptions: { globals: { ...globals.browser, ...globals.es2024 } },
    rules: {
      // ── Existing rules ──
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "prefer-const": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-nested-ternary": "off",
      "no-implicit-coercion": "error",
      "no-return-assign": "error",
      "no-throw-literal": "error",
      "no-unused-expressions": ["error", { allowShortCircuit: true, allowTernary: true }],
      "no-void": ["error", { allowAsStatement: true }],

      // ── New strict rules ──
      curly: ["error", "all"],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-wrappers": "error",
      "no-param-reassign": ["error", { props: false }],
      "no-self-compare": "error",
      "no-useless-concat": "error",
      "no-lone-blocks": "error",
      "default-case-last": "error",
      "guard-for-in": "error",
      "no-sequences": "error",
      "no-unmodified-loop-condition": "error",
      "no-constructor-return": "error",
      "symbol-description": "error",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 14. Security tuning
  // ═══════════════════════════════════════════════════════════════════════════
  {
    rules: {
      "security/detect-object-injection": "off",
      "security/detect-non-literal-regexp": "warn",
      "no-unsanitized/method": "error",
      "no-unsanitized/property": "error",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 15. Astro-specific strict rules
  // ═══════════════════════════════════════════════════════════════════════════
  {
    files: ["**/*.astro"],
    rules: {
      "unicorn/name-replacements": ["error", { allowList: { Props: true } }],
      "astro/no-set-html-directive": "error",
      "astro/no-unsafe-inline-scripts": ["error", { allowModuleScripts: true }],
      "astro/no-exports-from-components": "error",
      "astro/no-prerender-export-outside-pages": "error",
      "astro/no-set-text-directive": "error",
      "astro/no-unused-css-selector": "warn",
      "astro/prefer-class-list-directive": "error",
      "astro/prefer-object-class-list": "error",
      "astro/prefer-split-class-list": "error",
      "astro/sort-attributes": ["warn", { type: "alphabetical", ignoreCase: true }],
    },
  },

  // ─── JsonLd component — safe set:html for pre-sanitized JSON-LD ─────────
  {
    files: ["src/shared/ui/JsonLd.astro"],
    rules: {
      "astro/no-set-html-directive": "off",
      "unicorn/prefer-module": "off",
      "unicorn/no-await-expression-member": "off",
      "unicorn/prefer-top-level-await": "off",
      "no-unsanitized/method": "off",
      "security/detect-object-injection": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // ─── Resume page — safe set:html for static description rendering ────────
  { files: ["src/pages/resume.astro"], rules: { "astro/no-set-html-directive": "off" } },

  // ─── Server actions / API routes ──────────────────────────────────────────
  {
    files: ["src/actions/**/*.ts", "src/pages/api/**/*.ts"],
    rules: {
      "no-unsanitized/method": "off",
      "unicorn/no-await-expression-member": "off",
      "security/detect-object-injection": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
    },
  },

  // ─── Root config files — disable unicorn comment rule that conflicts with Prettier JSDoc ──
  {
    files: ["*.config.mjs", "*.config.ts", "*.config.js"],
    rules: { "unicorn/single-line-block-comment-style": "off" },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 16. Prettier — MUST be last (disables conflicting formatting rules)
  // ═══════════════════════════════════════════════════════════════════════════
  prettierConfig,

  // ═══════════════════════════════════════════════════════════════════════════
  // 17. Global ignores
  // ═══════════════════════════════════════════════════════════════════════════
  {
    ignores: [
      "dist/**",
      ".astro/**",
      "node_modules/**",
      "public/**",
      ".gemini/**",
      ".kiro/**",
      ".agent/**",
      ".agents/**",
      "*.md",
      "*.json",
      "*.lock",
      "tsconfig.tsbuildinfo",
    ],
  },
);
