import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored shadcn/ui kit, kept upstream-clean — not course content.
    "components/ui/**",
    "hooks/**",
  ]),
  {
    rules: {
      // A book's prose lives in JSX text and uses real quotes by design.
      "react/no-unescaped-entities": "off",
      // React-Compiler-era strictness this codebase does not opt into: these
      // fire on deliberate mount/animation idioms, not on bugs.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
    },
  },
]);

export default eslintConfig;
