# adamis-landing — sitio comercial de ADAMIS

Este repositorio contiene la landing comercial: 16 páginas en español e inglés,
tres páginas legales, sus estilos, scripts y assets. La demo es independiente y
se accede desde https://adamis-demo.vercel.app/; no requiere una copia local de
su repositorio.

## Desarrollo y despliegue

- HTML estático en `index.html` y los directorios de páginas; CSS y JavaScript
  en la raíz, recursos en `assets/`.
- Para revisar las páginas localmente desde la raíz: `python -m http.server 8000 --bind 127.0.0.1`.
  Abrir `http://127.0.0.1:8000/`. Este servidor no ejecuta la API ni los redirects.
- `api/request-info.js` es la única API: recibe solicitudes comerciales por POST
  y envía el correo mediante Resend. Para probar la integración local en Vercel,
  usar `vercel dev`; para QA de formularios, interceptar las solicitudes y no
  enviar leads reales.
- `.env.example` enumera las variables: `RESEND_API_KEY` y `CONTACT_FROM_EMAIL`
  son necesarias para enviar correo; `CONTACT_TO_EMAIL` es opcional y por defecto
  usa `contacto@adamis.es`. No compartir valores privados.
- El despliegue existente en Vercel usa `vercel.json` y `.vercelignore`.
  Conservar los redirects temporales de las antiguas URLs de demo y `sw.js`,
  que retira caches y registros antiguos. `styles.css` sigue sirviendo a las legales.
- El nombre conceptual es `adamis-landing`. El renombrado de GitHub y de la carpeta,
  y la actualización de `origin`, se realizan después de integrar la limpieza;
  el proyecto y dominio existentes de Vercel se conservan.

## Guía de flujo de trabajo (Git Workflow)

**REGLA DE ORO:** NUNCA trabajar directamente en la rama `main`.
* `main`: Producción (Código estable/sagrado).
* `develop`: Desarrollo (Tu zona de trabajo).

---

## 1. Empezar a trabajar (Inicio del día)
Objetivo: Sincronizar tu entorno local con el servidor.

```bash
git checkout develop
git pull origin develop
```

## 2. Guardar cambios (Durante el día)
Objetivo: Guardar progreso localmente.

```bash
git status
git add .
git commit -m "Descripción breve del cambio"
```

## 3. Subir cambios (Final de tarea/día)
Objetivo: Enviar código al repositorio remoto.

```bash
git push origin develop
```

## 4. Despliegue a Producción
Objetivo: Fusionar `develop` en `main` cuando el código es estable.

```bash
# 1. Moverse a producción y actualizar
git checkout main
git pull origin main

# 2. Fusionar cambios de desarrollo
git merge develop

# 3. Subir a producción
git push origin main

# 4. IMPORTANTE: Volver a desarrollo para seguir trabajando
git checkout develop
```

## 5. Solución de Problemas

### Descartar cambios locales (Reset)
Si has roto algo y quieres volver a como estaba en el último commit:
```bash
git checkout -- nombre_del_archivo
# O para descartar todo: git checkout .
```

### Conflictos de Merge
1. Git te avisará si hay conflictos.
2. Abre los archivos marcados en el editor.
3. Elige qué líneas conservar y borra las marcas de conflicto (`<<<<<<<`, `=======`, `>>>>>>>`).
4. Guarda y finaliza:
   ```bash
   git add .
   git commit -m "Conflictos resueltos"
   ```
