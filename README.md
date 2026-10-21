# Rosela Miranda — Digital Experience V2

Sitio editorial estático, sin frameworks de interfaz, publicado en GitHub Pages.

## Arquitectura

- `/`: Main con **solo dos secciones**: presentación y respaldo profesional/audio.
- `/cv/`: perfil profesional independiente, formación, trayectoria y futuros CV PDF ES/EN.
- **START**: test no clínico en modal accesible en cualquier página, sin registro y con tarjeta PNG para guardar.
- `/blog/`: journal personal de Rosela, con artículos estáticos generados desde el CMS.
- `/privacidad/`: aviso provisional que debe reemplazarse antes de habilitar el formulario.
- `/start/`: redirección de enlaces antiguos hacia el modal START.

## Blog: panel para Rosela

El repositorio incluye `.pages.yml` para [Pages CMS](https://app.pagescms.org/) (servicio externo gratuito).
Para activarlo:
1. Entrar a https://app.pagescms.org/ e iniciar sesión.
2. Instalar/autorizar la aplicación de GitHub **solo para este repositorio**.
3. Elegir `axelcruzcv/rosela-miranda-web` y `main`.
4. Abrir **Blog de Rosela**; crear una nota con título, slug, fecha, resumen, foto y texto.
5. Marcar **Mostrar en el blog** cuando la nota esté aprobada y guardar.
6. GitHub Actions compila `blog/posts.json` y publica artículos en `/blog/<slug>/`.

Los borradores con `published: false` no salen en la web, **pero su texto seguirá visible en `blog/posts.json` del repositorio público**. No guardar información sensible ni borradores privados ahí. El CMS es un editor externo, no un backend de usuarios/pacientes.

## GitHub Pages

`.github/workflows/pages.yml` despliega automáticamente cada commit en `main`. El build de publicaciones ocurre únicamente durante el despliegue; el navegador recibe HTML estático, sin llamadas a GitHub ni bases de datos.
URL de revisión: https://axelcruzcv.github.io/rosela-miranda-web/

## Experiencia START

Cuatro preguntas de hábitos (no clínicas). Las respuestas solo permanecen en memoria hasta cerrar o reiniciar el modal.
Al concluir se crea una tarjeta PNG local mediante Canvas API. No hay almacenamiento de datos personales ni envío de las respuestas.
La copia de preguntas y resultados necesita aprobación final de Rosela.

## Contacto — sigue DESHABILITADO

El modal de contacto está listo a nivel UX, pero no puede enviar mensajes hasta:
- Validar correo receptor y verificar el proveedor de entrega (por ejemplo, Formspree).
- Aprobar aviso de privacidad completo y consentimiento aplicable.
- Completar `assets/js/config.js` con un endpoint verificado; nunca agregar secretos.
- Probar envío, spam, validaciones y mensajes de confirmación.

El formulario **no** sustituye una consulta ni debe captar historias clínicas.

## Pendientes de contenido (no inventar)

- Fotografía formal y biografía validadas para `/cv/`.
- Instituciones, estudios, cédula, experiencia y educación continua comprobables.
- Dos one-pagers ATS en español e inglés, después de recibir documentos reales; ningún CV puede garantizar 100% de aceptación de todos los ATS.
- Enlace real al podcast de Spotify. Hasta entonces el bloque de audio es un adelanto sin CTA falso.
- Aviso de privacidad, email receptor y textos del test aprobados por Rosela.

## Desarrollo local

```bash
python3 -m http.server 8080
# abrir http://localhost:8080/rosela-miranda-web/ si está un directorio arriba
```

Para simular el build del blog con dependencias locales:
```bash
python3 -m pip install Markdown==3.9 bleach==6.2.0
python3 scripts/build_blog.py
```

Identidad: Instrument Serif + Geist; salvia #898F82 y acentos terracota.


## Gestión editorial V5 (Pages CMS)

**Todo el mosaico del Blog, incluyendo las tres notas de ejemplo, está controlado por `blog/posts.json`.** Antes eran tres enlaces codificados manualmente en `blog/index.html` y no podían editarse desde el CMS; esa limitación se eliminó.

- Abrir https://app.pagescms.org/ y acceder con la cuenta de GitHub autorizada para este repositorio.
- Entrar en `axelcruzcv/rosela-miranda-web` → `main` → **Blog de Rosela · Notas y orden**.
- Cada entrada admite título, enlace corto, categoría, resumen, fecha, imagen de portada, segunda imagen, texto enriquecido, visibilidad y **orden de aparición**.
- El campo **Orden de aparición** controla el mosaico: `1` ocupa el bloque grande, `2` el siguiente, `3` el tercero; números menores aparecen primero. Guardar publica un commit y GitHub Pages recompila la web.
- Las tres notas iniciales están marcadas como **NOTA DE MUESTRA**; Rosela puede editar su contenido o desactivar su publicación.
- Se puede cargar una fotografía desde Pages CMS en `assets/images/blog`; el sitio utiliza ese archivo directamente sin base de datos ni hosting de pago.
- La creación del panel está preparada en el repositorio, pero **la autorización de Pages CMS debe completarla el propietario de GitHub**. No se han verificado permisos ni sesiones de Rosela.
- Advertencia: `published: false` oculta la entrada del sitio, **no la oculta del repositorio público**. No escribir borradores confidenciales, datos de pacientes ni información clínica en este CMS público.
