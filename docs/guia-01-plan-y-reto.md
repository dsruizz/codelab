# CodeLab · Guía 01: plan de funciones y Reto 01

## 1. Qué hace falta para cada función

| Función | Nivel | Tecnología | Qué aprendes antes |
|---|---|---|---|
| Fondo de puntos reactivo | Sencillo (hecho) | `<canvas>` + JS | Ver `seccion-entrada/js/dot-grid.js` |
| Tarjetas con título, descripción y "Acceder" | Sencillo (hecho) | HTML + CSS Grid | Enlace estirado, `auto-fill` + `minmax()` |
| Páginas internas de apuntes | Sencillo | HTML estático por ahora | Rutas relativas (`../css/...`) |
| Botón "copiar código" | Sencillo | Clipboard API (`navigator.clipboard.writeText`) | Eventos y promesas (`async/await`) |
| Demo editable con vista previa en vivo (estilo GSAP) | Intermedio | `<textarea>` + `<iframe srcdoc>` con `sandbox` | Reto 03 (ver abajo) |
| Editor con resaltado de sintaxis | Avanzado | CodeMirror 6 + Vite | Módulos ES, npm, Vite |
| Notas editables y persistentes (solo tu navegador) | Intermedio | `localStorage` + JSON | CRUD, `JSON.stringify/parse` |
| Notas sincronizadas entre dispositivos y privadas | Avanzado (Full Stack) | Supabase (Postgres + autenticación) | SQL básico, `fetch`, API REST |

**Persistencia, sin engaños:**
- **`localStorage`** — "almacén de texto del navegador". Solo existe en ese navegador y ese dispositivo; si borras datos del sitio, se pierde. Sirve para empezar y para el progreso de retos.
- **Exportar/importar JSON** — "copia de seguridad en un archivo". Paso intermedio barato.
- **Backend** — "servidor que guarda los datos en una base de datos". Necesario si quieres editar desde cualquier dispositivo. Como `codelab.dsruiz.com` es público, editar exige **autenticación** ("iniciar sesión") o cualquiera podría modificar tus notas.

**Recomendación:** HTML/CSS/JS sin framework hasta el editor con resaltado; ahí entra **Vite** ("servidor de desarrollo y empaquetador"). **Supabase** cuando quieras sincronizar notas. React solo cuando el estado de la interfaz se vuelva difícil de manejar a mano.

## 2. Camino a Full Stack (cada paso deja algo funcionando en CodeLab)

1. **Módulos ES** (`import`/`export`) — ya en `main.js`.
2. **Reto 02: copiar código** — eventos, Clipboard API, `async/await`.
3. **Reto 03: vista previa en vivo** — `iframe srcdoc`, `sandbox`, *debounce* ("esperar a que dejes de escribir antes de actualizar").
4. **Reto 04: notas con `localStorage`** — CRUD ("crear, leer, actualizar, borrar") y JSON.
5. **Contenido como datos** — notas en `data/notas.json` y `fetch` para pintarlas. Aquí nace la idea de API.
6. **Vite + CodeMirror** — npm, dependencias, *build* ("versión optimizada para publicar").
7. **Supabase** — tabla `notes`, SQL básico, reglas de acceso, login.
8. **Git con ramas y PR** — cada reto en su rama, revisión antes de fusionar.

---

## 3. Reto 01 · Arranque profesional de un proyecto

**Objetivo:** crear desde una carpeta vacía, sin copiar, la base de cualquier proyecto: `index.html`, `css/styles.css`, `js/script.js`, y comprobar que el JS se ejecuta. Repítelo hasta hacerlo en menos de 5 minutos.

**Concepto (chuleta):**
- **Boilerplate** — "estructura mínima que se repite en cada proyecto".
- **Reset CSS** — "anular estilos por defecto del navegador para partir de cero".
- **Custom properties** — "variables de CSS": `--color-bg: #0b0d0c;` y se usan con `var(--color-bg)`.
- **`box-sizing: border-box`** — "el ancho incluye padding y borde".
- **`type="module"`** — "el archivo JS es un módulo: puede usar `import`/`export`".
- **`defer`** — "descarga el JS sin bloquear y lo ejecuta cuando el HTML ya está leído".
- **DevTools / Consola** — "herramientas del navegador" (F12 o Cmd+Opt+I). Ahí ves `console.log` y los errores.

**Prueba (ejemplo mínimo, incompleto a propósito):**

```html
<!doctype html>
<html lang="es">
<head>
  <!-- 1. codificación de caracteres -->
  <!-- 2. viewport para móvil -->
  <title>Mi proyecto</title>
  <!-- 3. enlazar CSS -->
  <!-- 4. enlazar JS como módulo -->
</head>
<body>
  <h1>Funciona</h1>
</body>
</html>
```

**Requisitos:**
1. `index.html` con los 4 huecos resueltos y `lang` correcto.
2. `css/styles.css` con: bloque `:root` (mínimo 3 variables: fondo, texto, acento), reset aplicado a `*`, `*::before`, `*::after`, y un `body` que use las variables.
3. `js/script.js` que imprima en consola un mensaje que identifique el archivo.
4. Responde: ¿`type="module"` necesita `defer`? ¿Por qué?

**Criterios para comprobar:**
- La consola muestra tu mensaje y ningún error en rojo.
- El `h1` no tiene margen por defecto y el fondo usa tu variable.
- En DevTools > Elements, al seleccionar `body`, ves tus variables en *Computed*.

<details>
<summary>Pista 1: si la consola dice "CORS" o el JS no carga</summary>

Los módulos no funcionan abriendo el archivo con doble clic (`file://`). Necesitas un **servidor local** ("un mini servidor en tu equipo"): extensión *Live Server* en VS Code, o en la terminal `npx serve` dentro de la carpeta.
</details>

<details>
<summary>Pista 2: el atributo que falta en el script</summary>

Busca en MDN "script type module". Fíjate en la tabla de cuándo se ejecuta cada tipo de script.
</details>

<details>
<summary>Solución (ábrela después de intentarlo)</summary>

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mi proyecto</title>
  <link rel="stylesheet" href="css/styles.css">
  <script type="module" src="js/main.js"></script>
</head>
<body>
  <h1>Funciona</h1>
</body>
</html>
```

```css
:root {
  --color-bg: #0b0d0c;
  --color-text: #e6ebe8;
  --color-accent: #3dff8b;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  min-height: 100dvh;
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: system-ui, sans-serif;
  line-height: 1.6;
}
```

```js
console.log('[mi-proyecto] main.js cargado');
```

**Por qué así:**
- El `<script type="module">` va en el `<head>`: los módulos ya son diferidos, así que **`defer` sobra**. Con un script clásico (sin `type="module"`) sí pondrías `defer`.
- El prefijo `[mi-proyecto]` en el `console.log` te deja filtrar tus mensajes cuando la consola se llene de otros.
- `margin: 0; padding: 0` en `*` es un reset agresivo pero claro; el día que te moleste (listas, por ejemplo), lo ajustas.
</details>

**Variación cuando lo domines:** añade `js/utils.js` con `export function saludar(nombre) {}` e impórtalo en `main.js`. Si funciona, entendiste los módulos.
