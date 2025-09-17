# Estructura de Datos para Programas - UNAC EPG

## Resumen
Este documento describe la nueva estructura de datos para organizar los 120+ programas académicos de la Escuela de Posgrado UNAC, con énfasis en la información del sidebar.

## Estructura Recomendada (v2.0)

```json
{
  "metadata": {
    "version": "2.0",
    "last_updated": "2025-09-17",
    "total_programas": 120,
    "total_facultades": 11
  },
  "facultades": {
    "fcs": {
      "codigo": "fcs",
      "nombre": "Ciencias de la Salud",
      "contacto": {
        "correo": "fcs.posgrado@unac.pe",
        "telefono": "+51 961 995 725"
      },
      "programas": [
        {
          "id": 1,
          "nombre": "Maestría en Salud Pública",
          "tipo": "maestria",
          "slug": "maestria-en-salud-publica",
          "descripcion": "Programa orientado a formar profesionales en el ámbito de la salud pública",
          "descripcion_detallada": "Este programa está diseñado para capacitar a profesionales...",
          "sidebar": {
            "tipo": "Maestría",
            "duracion": "1 año y 6 meses",
            "modalidad": "Presencial / Virtual",
            "facultad": "Ciencias de la Salud"
          },
          "imagenes": {
            "principal": "img/img-programas/ciencias-de-la-salud/maestria-en-salud-publica/maestria-en-salud-publica_1.jpg",
            "galeria": [
              "img/img-programas/ciencias-de-la-salud/maestria-en-salud-publica/maestria-en-salud-publica_1.jpg",
              "img/img-programas/ciencias-de-la-salud/maestria-en-salud-publica/maestria-en-salud-publica_2.jpg",
              "img/img-programas/ciencias-de-la-salud/maestria-en-salud-publica/maestria-en-salud-publica_3.jpg"
            ]
          },
          "informacion_adicional": {
            "creditos": 60,
            "requisitos": ["Título profesional", "Experiencia mínima 2 años"],
            "costo": "S/ 15,000",
            "fecha_inicio": "Marzo 2025"
          }
        }
      ]
    }
  }
}
```

## Campos Obligatorios

### Programa
- `id`: Número único del programa
- `nombre`: Nombre completo del programa
- `tipo`: "maestria", "doctorado", o "especialidad"
- `slug`: URL-friendly identifier
- `descripcion`: Descripción corta
- `descripcion_detallada`: Descripción completa

### Sidebar (Información para mostrar)
- `tipo`: "Maestría", "Doctorado", o "Especialidad"
- `duracion`: Duración del programa
- `modalidad`: "Presencial", "Virtual", "Presencial / Virtual"
- `facultad`: Nombre de la facultad

### Imágenes
- `imagenes.principal`: Imagen principal del programa
- `imagenes.galeria`: Array de imágenes para la galería

## Compatibilidad con Estructura Antigua

El sistema JavaScript actualizado es compatible con ambas estructuras:

### Antigua (aún soportada)
```json
{
  "facultades": {
    "fcs": {
      "codigo": "fcs",
      "nombre": "Ciencias de la Salud",
      "correo": "fcs.posgrado@unac.pe",
      "telefono": "+51 961 995 725",
      "modalidad": "Presencial / Virtual",
      "duracion": {
        "maestria": "1 año y 6 meses",
        "doctorado": "3 años"
      },
      "programas": [
        {
          "id": 1,
          "nombre": "Maestría en Salud Pública",
          "tipo": "maestria",
          "slug": "maestria-en-salud-publica",
          "descripcion": "Programa orientado...",
          "descripcion_detallada": "Este programa está diseñado...",
          "imagen_1": "img/img-programas/...",
          "imagen_2": "img/img-programas/...",
          "imagen_3": "img/img-programas/..."
        }
      ]
    }
  }
}
```

## Validación

Usa el script `validar_programas.js` para verificar la integridad de los datos:

```bash
node validar_programas.js data/programas.json reporte_validacion.md
```

## Beneficios de la Nueva Estructura

1. **Consistencia**: Toda la información del sidebar está centralizada en el objeto `sidebar`
2. **Escalabilidad**: Fácil agregar nuevos campos sin afectar el código existente
3. **Mantenibilidad**: Separación clara entre datos de contacto de facultad y datos específicos del programa
4. **Flexibilidad**: Soporte para información adicional por programa
5. **Compatibilidad**: Funciona con la estructura antigua durante la migración

## Migración Recomendada

1. Crear backup del archivo `data/programas.json` actual
2. Ejecutar validación: `node validar_programas.js`
3. Migrar programas uno por uno o por facultad
4. Probar cada cambio en el detalle del programa
5. Una vez completada la migración, actualizar el archivo principal

## Ejemplo de Migración

### Antes (Antigua)
```json
{
  "id": 1,
  "nombre": "Maestría en Salud Pública",
  "tipo": "maestria",
  "duracion": "2 años",
  "imagen_1": "img/...",
  "imagen_2": "img/...",
  "imagen_3": "img/..."
}
```

### Después (Nueva)
```json
{
  "id": 1,
  "nombre": "Maestría en Salud Pública",
  "tipo": "maestria",
  "sidebar": {
    "tipo": "Maestría",
    "duracion": "2 años",
    "modalidad": "Presencial / Virtual",
    "facultad": "Ciencias de la Salud"
  },
  "imagenes": {
    "principal": "img/...",
    "galeria": ["img/...", "img/...", "img/..."]
  }
}
```

## Soporte

Si encuentras problemas durante la migración o necesitas ayuda con la estructura, revisa:
- El script de validación `validar_programas.js`
- Los archivos de ejemplo `data/programas_v2_ejemplo.json`
- El código JavaScript actualizado en `js/detalle_programa.js`