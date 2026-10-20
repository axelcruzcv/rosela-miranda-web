# Rosela Miranda — Digital Experience

Sitio editorial para Rosela Miranda, nutrióloga. MVP estático, adaptable a GitHub Pages. HTML semántico, CSS y JavaScript nativos; cero dependencias de compilación.

## Páginas

- `/`: Main con hero editorial, presentación, acceso a START y contacto.
- `/cv/`: perfil profesional; credenciales pendientes de aprobación.
- `/start/`: test reflexivo de cuatro preguntas, sin recolección ni almacenamiento de respuestas.
- `/blog/`: landing editorial, contenido pendiente.
- `/privacidad/`: aviso pendiente de validación. **No apto para lanzamiento público definitivo.**

## Vista local

```bash
python3 -m http.server 8080
# Abrir http://localhost:8080
```

No hace falta instalar npm ni compilar.

## Despliegue en GitHub Pages

1. Crear repositorio `rosela-miranda-web` en la cuenta GitHub correspondiente.
2. Subir el contenido de este directorio a la rama `main`.
3. En Settings → Pages → Build and deployment → Source: **GitHub Actions**.
4. El workflow `.github/workflows/pages.yml` publica automáticamente tras cada `push` a `main`.
5. En caso de usar subruta (`/rosela-miranda-web/`), los links relativos ya están preparados.

## Formulario de contacto: bloqueo intencional

GitHub Pages es hosting estático: **no puede enviar correos por sí mismo**. Antes de habilitar el formulario:

1. Confirmar el correo receptor con Rosela.
2. Dar de alta un formulario en Formspree (o integrar un backend controlado) con el correo de Rosela y completar la verificación del proveedor.
3. Revisar y publicar el aviso de privacidad definitivo y verificar el tratamiento de datos con Rosela.
4. Configurar `CONTACT_ENDPOINT` en `assets/js/config.js` y cambiar `PRIVACY_APPROVED` a `true` únicamente después de esa revisión.
5. Probar envío real, acuse, spam, límites/rate-limiting y errores. **No marcar como operativo antes de la prueba end-to-end.**

No incluir claves SMTP ni secretos en archivos públicos. El proveedor debe actuar como intermediario seguro.

## Privacidad y salud

- El test es educativo; no proporciona diagnóstico ni asesoría clínica.
- Las respuestas son efímeras, exclusivamente en la memoria del navegador. No se envían al backend, ni se incluyen en mensajes de contacto, ni se guardan en localStorage.
- El formulario solo contempla `name`, `email`, `message`, `source`, y solicita expresamente no introducir datos médicos.
- No hay seguimiento GA4 por defecto. Incorporar analítica solo con configuración de privacidad apropiada, sin parámetros personales.
- Cualquier copy sobre formación, servicios, especialidad o resultados profesionales requiere confirmación de Rosela.

## Identidad

- Verde salvia: `#898F82`
- Terracota de marca: `#D4A084`
- Textos principales: `#343B34`
- CTA con contraste: `#9D5F49`
- Fuentes gratuitas: Instrument Serif + Geist, vía Google Fonts. Considerar autoalojamiento al preparar la versión definitiva.

## Pendientes antes del lanzamiento

- [ ] Aprobar fotografías e identidad con Rosela.
- [ ] Validar todos los textos de salud y resultados del test.
- [ ] Validar formación profesional, cédula, servicios y CV PDF.
- [ ] Decidir si se publica Blog con contenido o se retira temporalmente del header.
- [ ] Validar aviso de privacidad, correo receptor y canal de respuestas.
- [ ] Configurar y probar formulario real de principio a fin.
- [ ] Configurar dominio, Search Console y analítica con controles de privacidad.
- [ ] Comprobar acceso por teclado, screen reader, responsive, Lighthouse y Core Web Vitals en deployment final.

---
Versión 1.0 · Diseñado para despliegue incremental y rendimiento.
