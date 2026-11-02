# Huerto Vecino · Landing page

Sitio estático (HTML + CSS + JS, sin build) que presenta la app **Huerto Vecino** y ofrece la descarga
directa del APK. Pensado para publicarse en **GitHub Pages**.

```
landing/
├─ index.html                 # página completa (una sola)
├─ css/styles.css             # diseño (tokens tomados de hv_colors.dart de la app)
├─ js/main.js                 # animaciones GSAP, catálogo de especies, QR, tamaño/SHA del APK
├─ assets/img/*.jpg           # fotografías (Unsplash, licencia libre)
├─ assets/favicon.svg
├─ download/app-release.apk   # APK publicado (copiar desde ../huerto_vecino/dist)
├─ download/app-release.apk.sha1
├─ sync-apk.ps1               # copia el APK más reciente desde ../huerto_vecino/dist
├─ .github/workflows/pages.yml# despliegue automático a GitHub Pages
└─ .nojekyll                  # evita que Pages procese el sitio con Jekyll
```

## Probar en local

Cualquier servidor estático sirve (el QR y el tamaño del APK usan `fetch`, por eso no basta abrir el archivo):

```powershell
cd landing
python -m http.server 8080      # o: npx serve .
# abrir http://localhost:8080
```

## Actualizar el APK

1. Compila en `huerto_vecino` con `.\build_apk.ps1` (genera `dist\app-release.apk`).
2. Ejecuta `.\sync-apk.ps1` desde `landing\` para copiar el APK y su SHA-1 a `download\`.
3. Si cambia la versión, actualiza también la sección "Descarga" de `index.html` (versión, API mínima)
   y `apkFileName` en `js/main.js`.

## Publicar en GitHub Pages

```powershell
cd landing
git init
git add .
git commit -m "Landing page Huerto Vecino"
git branch -M main
git remote add origin https://github.com/USUARIO/huerto-vecino-landing.git
git push -u origin main
```

Luego en el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
El flujo `.github/workflows/pages.yml` publica el sitio en cada push a `main`.
(Alternativa sin Actions: Source **Deploy from a branch** → `main` / `/ (root)`.)

> **Tamaño del APK.** GitHub acepta archivos de hasta 100 MB por commit, pero avisa a partir de 50 MB.
> El APK actual pesa ~74 MB, así que funciona, aunque cada versión nueva suma peso al historial.
> Para repositorios ligeros publica el APK como *asset* en **GitHub Releases** y cambia `CONFIG.apkUrl`
> en `js/main.js` por la URL del release, por ejemplo
> `https://github.com/USUARIO/REPO/releases/latest/download/app-release.apk`.
> Otra opción es compilar con `.\build_apk.ps1 -SplitPerAbi` y publicar solo el APK `arm64-v8a` (más liviano).

## Personalizar

- Enlace al repositorio: `CONFIG.repoUrl` en `js/main.js`.
- Colores y tipografías: variables en `:root` de `css/styles.css`.
- Especies mostradas: arreglo `SPECIES` en `js/main.js` (datos de `lib/data/knowledge/species_catalog.dart`).
- Imágenes: reemplaza los archivos de `assets/img/` conservando los nombres o ajusta las rutas en `index.html`.

## Créditos

Fotografías de [Unsplash](https://unsplash.com) bajo la [Unsplash License](https://unsplash.com/license).
Animaciones con [GSAP](https://gsap.com) y códigos QR con [qrcodejs](https://github.com/davidshimjs/qrcodejs) (CDN de cdnjs).
