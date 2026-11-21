# Videojuego Space Shooter - Phaser JS

Proyecto de videojuego arcade 2D desarrollado en JavaScript utilizando el framework **Phaser**.

## 👤 Datos del Autor
- **Estudiante:** Andre Alvarado Lira
- **Curso:** Juegos Interactivos / Programación Web
- **Institución:** UTP

---

## 🎮 Características Implementadas (Versión Preliminar)
- **Pantalla de Portada:**
  - Título con animación flotante de nave y enemigos.
  - Nombre y apellido del estudiante visible.
  - Fondo animado de estrellas.
  - Inicio mediante tecla `[ESPACIO]` o `[ENTER]`.
- **Nivel 1:**
  - Nave del jugador con spritesheet personalizado y movimiento suave con flechas (`←`, `→`, `↑`, `↓`).
  - Formación de enemigos alienígenas con animación tween lateral oscilante.
  - Sistema de disparo láser continuo con la barra espaciadora (`[ESPACIO]`).
  - Detección física de colisiones bala-enemigo con `Phaser.Physics.ARCADE`.
  - Animación de explosión con spritesheet al impactar un enemigo.
  - Efectos de sonido sintetizados en tiempo real (disparo láser y explosión) mediante Web Audio API.
  - Marcador de puntaje en pantalla y detección de superación de nivel.
- **Nivel 2 (Flota Élite Invasora):**
  - Fondo espacial en alerta con desplazamiento acelerado.
  - Escuadrón enemigo mixto: 3 Naves Élite de alto puntaje (dorado/púrpura) y 8 Naves Estándar.
  - Movimiento oscilante aumentado y descenso progresivo de la flota hacia la posición del jugador.
  - Detección de colisiones y efectos de explosión continua con sonidos retro.
  - Condición de invasión (Game Over si alcanzan la base) y condición de Victoria Total al eliminar todas las naves.
  - Opción de reinicio con la tecla `[R]` acumulando puntaje final.

---

## 🚀 Cómo Ejecutar Localmente
1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Abrir el archivo `index.html` en un navegador web o mediante un servidor local (por ejemplo con la extensión Live Server de VS Code o `npx serve`).

---

## 🌐 Despliegue en GitHub Pages
Para habilitar GitHub Pages:
1. Ir a **Settings** > **Pages** en este repositorio de GitHub.
2. En **Branch**, seleccionar `main` (o `master`) y la carpeta `/ (root)`.
3. Hacer clic en **Save** para obtener el enlace público en la web.
