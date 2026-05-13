# LALAND Football — Design System Tokens

## Paleta de Colores

### Fondos
| Token | Valor | Uso |
|---|---|---|
| `--color-bg-primary` | `#0a0e1a` | Fondo base de la aplicación |
| `--color-bg-secondary` | `#111827` | Cards, panels, sidebar |
| `--color-bg-tertiary` | `#1f2937` | Hover states, inputs, chips |

### Acentos
| Token | Valor | Uso |
|---|---|---|
| `--color-accent-green` | `#00d4a1` | Marca, CTAs, indicador live, éxito |
| `--color-accent-green-dark` | `#00a880` | Hover de botones primarios |
| `--color-accent-blue` | `#3b82f6` | Links, información, equipos visitante |
| `--color-accent-amber` | `#f59e0b` | Tarjeta amarilla, advertencia |
| `--color-accent-red` | `#ef4444` | Tarjeta roja, error, derrota |

### Texto
| Token | Valor | Uso |
|---|---|---|
| `--color-text-primary` | `#f9fafb` | Títulos, contenido principal |
| `--color-text-secondary` | `#9ca3af` | Subtítulos, metadata |
| `--color-text-muted` | `#4b5563` | Placeholders, texto deshabilitado |

### Bordes
| Token | Valor | Uso |
|---|---|---|
| `--color-border` | `#1f2937` | Bordes por defecto de cards |
| `--color-border-light` | `#374151` | Bordes en hover / focus |

---

## Tipografía

**Fuente:** Inter (Google Fonts) — pesos: 300, 400, 500, 600, 700, 800, 900

| Token | Tamaño | Uso |
|---|---|---|
| `--text-2xs` | 12px | Labels muy pequeños, estadísticas compactas |
| `--text-xs` | 14px | Texto de apoyo, badges, metadata |
| `--text-sm` | 16px | Texto de cuerpo estándar |
| `--text-base` | 18px | Cuerpo de lectura, párrafos |
| `--text-lg` | 24px | Títulos de sección |
| `--text-xl` | 32px | Títulos de página |
| `--text-2xl` | 48px | Marcadores, números grandes |

---

## Espaciado

Escala basada en múltiplos de 4px (compatible con Tailwind):

| Token | Valor | Equivalente Tailwind |
|---|---|---|
| `--space-1` | 4px | `p-1` |
| `--space-2` | 8px | `p-2` |
| `--space-3` | 12px | `p-3` |
| `--space-4` | 16px | `p-4` |
| `--space-6` | 24px | `p-6` |
| `--space-8` | 32px | `p-8` |
| `--space-12` | 48px | `p-12` |
| `--space-16` | 64px | `p-16` |

---

## Radios de Borde

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | 4px | Badges, chips pequeños |
| `--radius-md` | 8px | Cards, botones, inputs |
| `--radius-lg` | 16px | Modales, panels grandes |
| `--radius-full` | 9999px | Avatares, indicadores pill |

---

## Sombras

| Token | Valor | Uso |
|---|---|---|
| `--shadow-card` | `0 4px 24px rgba(0,0,0,0.4)` | Cards en estado normal |
| `--shadow-card-hover` | `0 8px 32px rgba(0,0,0,0.6)` | Cards en hover |
| `--shadow-glow` | `0 0 20px rgba(0,212,161,0.3)` | Elementos live, CTAs destacados |

---

## Transiciones

| Token | Valor | Uso |
|---|---|---|
| `--transition-fast` | `150ms ease` | Hovers rápidos, estados activos |
| `--transition-base` | `250ms ease` | Transiciones estándar |
| `--transition-slow` | `400ms ease` | Cambios de vista, animaciones |

---

## Componentes Base (clases Tailwind personalizadas)

| Clase | Descripción |
|---|---|
| `.card` | Card base: bg-secondary, borde, sombra |
| `.card-hover` | Card con efecto hover interactivo |
| `.btn-primary` | Botón verde sólido (CTA principal) |
| `.btn-secondary` | Botón con fondo terciario y borde |
| `.btn-ghost` | Botón sin fondo, solo texto |
| `.input-base` | Input estándar del sistema |
| `.badge` | Badge genérico |
| `.badge-live` | Badge rojo pulsante para partidos en vivo |
| `.badge-green` | Badge verde translúcido |
| `.skeleton` | Placeholder animado de carga |
| `.section-title` | Título de sección estándar |
| `.text-gradient` | Texto con gradiente verde→azul |
| `.glow-green` | Sombra de brillo verde |

---

## Convenciones de Uso

1. **Siempre usar los tokens CSS** para colores críticos — nunca hardcodear hex en componentes.
2. **Tailwind primero** para espaciados y layouts — CSS custom solo para lo que Tailwind no cubre.
3. **Framer Motion** para todas las animaciones de entrada/salida — nunca CSS `transition` para cambios de vista.
4. **Mobile-first** — comenzar con estilos mobile y escalar con `md:`, `lg:`, `xl:`.
5. **Contraste mínimo WCAG AA** — verificar con herramienta antes de aprobar cualquier combinación nueva.
