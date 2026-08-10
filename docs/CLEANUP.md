# Cleanup controlado y promoción de la landing

Fecha: 2026-08-10

## Resultado

La nueva landing de `/` queda como única landing oficial. Se conservaron las rutas de producto, autenticación, APP, profesor, legales e inglés temporal indicadas en la tarea. No se ejecutó el escenario B ni se podaron contenidos dinámicos inactivos de APP.

## Rutas conservadas

- `/`
- `/talleres/`
- `/programa/`
- `/financial-education/`
- `/app/**`
- `/profesor/**`
- `/splash.html`
- `/aviso-legal/`
- `/politica-privacidad/`
- `/politica-cookies/`
- `/api/**` productivas y middleware

## Rutas y directorios retirados

- SEO/legacy: `/educacion-financiera/`, `/metodologia/` y las páginas de programa de 4.º, 5.º y 6.º de Primaria.
- Redirect-only físicos: `/colegios/`, `/packs-tematicos/`, `/configuracion-flexible/`, `/preguntas-frecuentes/` y `/educacion-financiera-primaria/`.
- Huérfana: `/animación/`.
- Locales/no runtime: `adamis.zip`, `audit/`, `source-materials/` y `tmp_i18n_candidates.txt`.
- SAFE DELETE: 56 de 56 archivos del manifiesto, sin excepciones.

Las URLs públicas retiradas conservan redirects permanentes en `vercel.json`. Los 308 reales deben confirmarse en preview/producción porque la validación local fue estática.

## Nombres definitivos

- CSS público compartido: `public.css`
- CSS específico de HOME: `landing.css`
- JavaScript específico de HOME: `landing.js`
- Assets de HOME: `assets/landing/`
- Prefijo de componentes: `landing-*`
- Data attributes: `data-landing-*`
- Root de HOME: `landing-page`
- Navegación compartida: `public-nav-coherent`

No queda nomenclatura generacional de la landing en runtime. Los sufijos `-v1`, `-v2` y `safe-v1` de assets se mantienen cuando sirven como revisión/cache busting.

## Tamaño

| Medida | Antes | Después | Ahorro |
|---|---:|---:|---:|
| Working tree sin `.git/` | 813.677.117 B | 76.508.536 B | 737.168.581 B (90,60 %) |
| Deploy estimado según `.vercelignore` | 520.397.402 B | 76.500.209 B | 443.897.193 B (85,30 %) |

El deploy es una estimación local; no sustituye la medición del preview de Vercel.

## Validación

- 0 archivos restantes de los 56 SAFE DELETE.
- 0 referencias locales rotas en los 23 HTML y 5 CSS retenidos.
- `landing.js`, `script.js`, APP, profesor y middleware pasan comprobación sintáctica de Node.
- `vercel.json` y `sitemap.xml` parsean correctamente; 11 redirects, sin sources duplicados ni loops directos.
- Sitemap reducido a HOME, Talleres, Programa, inglés y las tres legales.
- Hreflang temporal recíproco: `/` (ES/x-default) ↔ `/financial-education/` (EN).
- Formulario conservado con POST a `/api/request-info`, mismos campos, consentimiento y fallback de WhatsApp; no se envió ningún POST.
- Smoke visual de HOME en 1440×900 y 390×844, además de Talleres, Programa, inglés, Splash, Profesor y legales.
- APP validada sin credenciales mediante HTTP/capa estática y análisis de dependencias: menú, mapa WebP, clase de ahorro, ranking, tienda WebP, ticket/manifest y APIs de eventos/collect preservados.

## Cambios previos preservados

El baseline ya contenía cambios no comprometidos en la nueva landing, `index.html`, `programa/`, `talleres/`, `script.js`, `.gitignore` y tres eliminaciones bajo `assets/colegios/`. No se restauraron ni se descartaron.

## Pendientes reales

- `assets/TUTORIAL-ADAMIS.mp4` sigue pesando 40.769.629 B; su optimización queda fuera de esta tarea.
- `encuesta_general` sigue enlazada desde menú pero ausente de `sets.json`; no se modificó.
- La nueva landing inglesa continúa pendiente; `/financial-education/` se mantiene temporalmente.
- Posible refactor futuro de `public.css` y `script.js`, sin purge/refactor en este cleanup.
- La ruta docente productiva sigue siendo `/profesor/index-profesor.html`; el acceso autenticado directo a `/profesor/` carece de `index.html`, incidencia preexistente no modificada.
