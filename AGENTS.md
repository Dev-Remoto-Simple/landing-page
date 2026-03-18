# AGENTS.md

Instructions for agentic coding agents working in this repository.

## Project Overview

Next.js 16 landing page for "Dev Remoto Simple" — a tech community in Bolivia. Built with React 19, TypeScript, Tailwind CSS v4, shadcn/ui components, Framer Motion, and Three.js for 3D effects.

## Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint (eslint-config-next/core-web-vitals + typescript)
```

**No test framework is configured.** Do not create test files unless tests are explicitly requested.

## Tech Stack & Path Aliases

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5, strict mode enabled
- **Styling**: Tailwind CSS v4 (CSS-first config via `@theme`), CSS variables, `oklch()` colors
- **Components**: shadcn/ui (base-nova style), `@base-ui/react`
- **Animation**: Framer Motion, `motion` package, `tw-animate-css`
- **Icons**: Lucide React
- **3D**: Three.js, `@react-three/fiber`, `@react-three/drei`, `three-globe`
- **Fonts**: Next.js `next/font/google` (`Space_Grotesk`, `DM_Sans`)
- **Theme**: `next-themes` (dark mode via `class` attribute)

```typescript
// Path aliases (tsconfig.json)
"@/*": ["./src/*"]
// Component aliases (components.json)
"@/components"   -> src/components
"@/components/ui" -> src/components/ui
"@/lib"           -> src/lib
"@/lib/utils"     -> src/lib/utils
"@/hooks"         -> src/hooks
```

## Code Style Guidelines

### General

- **React 19** is used. Prefer `function` components over `React.FC`. Do not explicitly type `children` prop unless needed.
- **Server Components** are the default. Add `"use client"` at the very top of the file for client-side interactivity.
- **TypeScript strict mode** is on — avoid `any`, use explicit types for function parameters and return values.
- Use **ES modules** (`import/export`) — this is a Next.js App Router project.

### Imports

Organize imports in this order (enforced by ESLint/prettier defaults):

1. Node.js built-ins (if any)
2. External packages (React, Next.js, UI libraries)
3. Internal imports (`@/` aliases — components, lib, hooks)
4. Relative imports (`./`, `../`)
5. Type imports last (`import type { ... }`)

```typescript
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MyComponent } from "./my-component"
import type { MyType } from "./types"
```

### Component Patterns

#### Utility function (`src/lib/utils.ts`)
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
Always use `cn()` instead of template literals for className composition.

#### Component files (`src/components/ui/*.tsx`)
- Each component is a separate file
- Default export the component, named export the variants
- Use `class-variance-authority` (CVA) for variant systems
- Props interface above the component function

```typescript
"use client"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva("base classes", {
  variants: { variant: {...}, size: {...} },
  defaultVariants: { variant: "default", size: "default" },
})

function Button({ className, variant, size, ...props }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
```

### Naming Conventions

- **Files**: kebab-case for components (`shiny-button.tsx`), camelCase for utilities (`utils.ts`)
- **Components**: PascalCase (`ShinyButton`, `BackgroundBeams`)
- **Functions/hooks**: camelCase (`useCounter`, `useInView`)
- **CSS variables**: kebab-case, prefixed (e.g., `--drs-navy-dark`)
- **Tailwind classes**: follow Tailwind's convention (no strict enforcement)

### Styling

- **CSS variables** are defined in `src/app/globals.css` under `@theme inline` for design tokens
- **Brand colors** (custom): defined as CSS variables (e.g., `--drs-navy`, `--drs-cyan`)
- **Dark mode**: use `.dark` class on `<html>` via `next-themes`; do NOT use `data-theme`
- **Inline styles**: acceptable for dynamic values (colors, fonts); prefer Tailwind classes for static layout
- **Font variables**: `--font-space-grotesk` and `--font-dm-sans` are available

### Error Handling

- No error boundaries are currently used
- Prefer early returns for null/undefined checks
- Use optional chaining (`?.`) and nullish coalescing (`??`) instead of type assertions

### File Structure

```
src/
  app/                    # Next.js App Router pages and layouts
    layout.tsx            # Root layout with ThemeProvider, fonts, metadata
    page.tsx              # Main landing page ("use client")
    globals.css           # Tailwind v4 config, CSS variables, brand tokens
  components/
    ui/                   # shadcn/ui components (BackgroundBeams, Vortex, etc.)
  lib/
    utils.ts              # cn() utility only
  data/
    globe.json            # Static data for 3D globe
```

### Important Notes

- **Unicorn Studio SDK** is installed (`unicornstudio-react`) — watermark is hidden via CSS in `globals.css`
- The landing page (`page.tsx`) is a large single file (~600 lines) — prefer keeping new sections in that file or extracting shared UI components to `src/components/ui/`
- No API routes exist currently
- Do NOT commit `.env` files or any file containing secrets
