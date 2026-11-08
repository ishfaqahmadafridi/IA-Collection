---
name: expert-ui-ux-design
description: Expert-level UI/UX design system architecture, atomic design tokens, WCAG 2.2 AAA accessibility auditing, Nielsen heuristics, modern visual aesthetics, glassmorphism, fluid typography, and micro-animation systems.
---

# Expert UI/UX Design System & Architectural Skill

This skill transforms the agent into an **Expert Senior UI/UX Architect**. It provides rigorous frameworks for design token generation, atomic component hierarchy, visual elegance, accessibility compliance (WCAG 2.2 AAA), usability heuristics, and fluid micro-interactions.

---

## 🎨 1. Core Visual Aesthetic Standards

Every interface designed using this skill must satisfy the **Production-Grade Design Principles**:

### Color System & Palette Engineering
Never use browser-default saturated colors (`#ff0000`, `#0000ff`). Always construct a structured HSL-based palette with semantic layers:

```css
:root {
  /* Brand Primitives */
  --hue-primary: 250;   /* Indigo/Violet core */
  --hue-accent: 190;    /* Cyan highlight */
  --hue-success: 155;   /* Emerald */
  --hue-warning: 38;    /* Amber */
  --hue-danger: 350;    /* Rose/Crimson */

  /* Surface Hierarchy (Dark Mode First) */
  --bg-app: hsl(var(--hue-primary), 20%, 6%);
  --bg-surface-1: hsl(var(--hue-primary), 18%, 10%);
  --bg-surface-2: hsl(var(--hue-primary), 16%, 14%);
  --bg-surface-glass: hsla(var(--hue-primary), 20%, 12%, 0.65);

  /* Border & Elevation */
  --border-subtle: hsla(var(--hue-primary), 20%, 100%, 0.08);
  --border-strong: hsla(var(--hue-primary), 20%, 100%, 0.18);
  --shadow-glow: 0 0 25px -5px hsla(var(--hue-primary), 80%, 65%, 0.25);
  --shadow-elevation: 0 10px 30px -10px rgba(0, 0, 0, 0.5);

  /* Typography */
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-display: 'Outfit', var(--font-sans);

  /* Fluid Typography Scale */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
  --text-base: clamp(1rem, 0.95rem + 0.4vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1.05rem + 0.5vw, 1.35rem);
  --text-xl: clamp(1.35rem, 1.2rem + 0.75vw, 1.75rem);
  --text-2xl: clamp(1.75rem, 1.5rem + 1.25vw, 2.5rem);
  --text-3xl: clamp(2.5rem, 2rem + 2vw, 3.75rem);
}
```

### Glassmorphism & Depth System
Apply GPU-accelerated frosted glass for overlays, sidebars, and elevated cards:
```css
.glass-panel {
  background: var(--bg-surface-glass);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-elevation);
  border-radius: 16px;
}
```

---

## ⚛️ 2. Atomic Design Architecture

Organize all UI code cleanly into 5 atomic tiers:

```
src/components/
├── 01-atoms/         # Buttons, Badges, Inputs, Icons, Typography
├── 02-molecules/     # Form Fields, Search Bars, Nav Items, Stat Cards
├── 03-organisms/     # Navigation Headers, Data Tables, Modal Dialogs, Hero Blocks
├── 04-templates/     # Dashboard Layouts, Canvas Workspaces, Settings Grids
└── 05-pages/         # Route implementations with state integration
```

### Atom Rule: Component Interface Contract
Every component must support standard props: `aria-label`, `className`, `disabled`, and `loading` states.

---

## ♿ 3. Accessibility & WCAG 2.2 AAA Compliance

1. **Color Contrast**: Text on background must achieve at least **4.5:1** (AA) or **7:1** (AAA).
2. **Focus Indicator Rings**: Never remove focus rings without replacing them:
   ```css
   :focus-visible {
     outline: 2px solid hsl(var(--hue-primary), 90%, 65%);
     outline-offset: 3px;
   }
   ```
3. **Screen Reader Support**: Use semantic tags (`<nav>`, `<main>`, `<header>`, `<footer>`, `<article>`). Provide fallback `aria-live="polite"` regions for dynamic status updates.

---

## 📋 4. Nielsen's 10 Usability Heuristics Checklist

Before finalizing any UI/UX implementation, audit against:

| Heuristic | Implementation Pattern |
| :--- | :--- |
| **1. Visibility of System Status** | Show loading spinners, skeleton loaders, and progress bars during asynchronous operations. |
| **2. Match Between System & Real World** | Use natural industry terms, clear icons, and logical metaphors. |
| **3. User Control & Freedom** | Provide explicit "Cancel", "Undo", and modal close (`Esc` key) mechanisms. |
| **4. Consistency & Standards** | Follow platform UI conventions (standard button positions, consistent placement). |
| **5. Error Prevention** | Use confirmation steps for destructive actions (e.g., delete buttons with confirmation modals). |
| **6. Recognition Over Recall** | Make options, field labels, and contextual help visible rather than hidden in sub-menus. |
| **7. Flexibility & Efficiency** | Offer keyboard shortcuts (`Cmd+K` command palettes) for power users. |
| **8. Aesthetic & Minimalist Design** | Eliminate clutter; display high-priority information first with collapsible sub-sections. |
| **9. Help Users Recognize Errors** | Inline error validation messages in red near the input field with resolution guidance. |
| **10. Documentation & Help** | Contextual tooltips (`?` icons) and accessible documentation panels. |

---

## 💫 5. Dynamic Micro-Animations & Transitions

Use subtle easing functions for interactive states:

```css
:root {
  --ease-out-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-in-out-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: 150ms var(--ease-in-out-smooth);
  --transition-normal: 250ms var(--ease-in-out-smooth);
  --transition-bounce: 350ms var(--ease-out-spring);
}

.interactive-card {
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
}

.interactive-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-strong);
  box-shadow: var(--shadow-glow), var(--shadow-elevation);
}
```

---

## 🔍 Audit & Verification Procedure

When asked to audit or design a UI:
1. Inspect the layout for mobile & desktop responsiveness (`@media (max-width: 768px)`).
2. Check color contrast ratios across dark/light themes.
3. Validate keyboard navigation (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`).
4. Ensure no empty states exist without helpful visual illustration and Call-to-Action.
