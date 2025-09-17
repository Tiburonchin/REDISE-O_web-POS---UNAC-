/**
 * SCRIPT DE VALIDACIÓN PARA PROGRAMAS JSON
 * Verifica que todos los programas tengan la información necesaria para el sidebar
 */

const fs = require('fs');
const path = require('path');

// Función para validar un programa individual
function validarPrograma(programa, facultadId, facultad) {
    const errores = [];
    const warnings = [];

    // Campos obligatorios
    if (!programa.id) errores.push(`Programa sin ID en facultad ${facultadId}`);
    if (!programa.nombre) errores.push(`Programa ${programa.id} sin nombre`);
    if (!programa.tipo) errores.push(`Programa ${programa.nombre} sin tipo`);
    if (!programa.slug) errores.push(`Programa ${programa.nombre} sin slug`);
    if (!programa.descripcion) errores.push(`Programa ${programa.nombre} sin descripción`);

    // Validar sidebar (nueva estructura recomendada)
    if (programa.sidebar) {
        if (!programa.sidebar.tipo) warnings.push(`Programa ${programa.nombre}: sidebar sin tipo`);
        if (!programa.sidebar.duracion) warnings.push(`Programa ${programa.nombre}: sidebar sin duración`);
        if (!programa.sidebar.modalidad) warnings.push(`Programa ${programa.nombre}: sidebar sin modalidad`);
        if (!programa.sidebar.facultad) warnings.push(`Programa ${programa.nombre}: sidebar sin facultad`);
    } else {
        // Validar estructura antigua
        warnings.push(`Programa ${programa.nombre}: usa estructura antigua, considera migrar a sidebar`);

        // Verificar si tiene duración específica o usa la de facultad
        if (!programa.duracion) {
            if (!facultad.duracion || !facultad.duracion[programa.tipo]) {
                errores.push(`Programa ${programa.nombre}: sin duración específica y facultad ${facultadId} sin duración para tipo ${programa.tipo}`);
            }
        }

        if (!facultad.modalidad) {
            errores.push(`Programa ${programa.nombre}: facultad ${facultadId} sin modalidad definida`);
        }
    }

    // Validar imágenes
    if (programa.imagenes) {
        if (programa.imagenes.principal && !fs.existsSync(path.join(__dirname, programa.imagenes.principal))) {
            warnings.push(`Programa ${programa.nombre}: imagen principal no existe: ${programa.imagenes.principal}`);
        }
        if (programa.imagenes.galeria) {
            programa.imagenes.galeria.forEach((img, idx) => {
                if (!fs.existsSync(path.join(__dirname, img))) {
                    warnings.push(`Programa ${programa.nombre}: imagen de galería ${idx + 1} no existe: ${img}`);
                }
            });
        }
    } else {
        // Verificar estructura antigua de imágenes
        let i = 1;
        while (programa[`imagen_${i}`]) {
            const imgPath = programa[`imagen_${i}`];
            if (!fs.existsSync(path.join(__dirname, imgPath))) {
                warnings.push(`Programa ${programa.nombre}: imagen_${i} no existe: ${imgPath}`);
            }
            i++;
        }
    }

    return { errores, warnings };
}

// Función principal de validación
function validarProgramasJSON(rutaArchivo) {
    try {
        const data = JSON.parse(fs.readFileSync(rutaArchivo, 'utf8'));
        const facultades = data.facultades;

        let totalErrores = 0;
        let totalWarnings = 0;
        const reporte = {
            resumen: {
                total_facultades: Object.keys(facultades).length,
                total_programas: 0,
                errores_totales: 0,
                warnings_totales: 0
            },
            facultades: {}
        };

        Object.keys(facultades).forEach(facultadId => {
            const facultad = facultades[facultadId];
            const programas = facultad.programas || [];

            reporte.facultades[facultadId] = {
                nombre: facultad.nombre,
                total_programas: programas.length,
                errores: [],
                warnings: []
            };

            programas.forEach(programa => {
                const { errores, warnings } = validarPrograma(programa, facultadId, facultad);

                if (errores.length > 0) {
                    reporte.facultades[facultadId].errores.push({
                        programa: programa.nombre,
                        errores: errores
                    });
                    totalErrores += errores.length;
                }

                if (warnings.length > 0) {
                    reporte.facultades[facultadId].warnings.push({
                        programa: programa.nombre,
                        warnings: warnings
                    });
                    totalWarnings += warnings.length;
                }
            });

            reporte.resumen.total_programas += programas.length;
        });

        reporte.resumen.errores_totales = totalErrores;
        reporte.resumen.warnings_totales = totalWarnings;

        return reporte;

    } catch (error) {
        console.error('Error al leer el archivo JSON:', error.message);
        return null;
    }
}

// Función para generar reporte
function generarReporte(reporte, rutaSalida) {
    let contenido = `# REPORTE DE VALIDACIÓN DE PROGRAMAS\n\n`;
    contenido += `## Resumen\n`;
    contenido += `- **Total de facultades:** ${reporte.resumen.total_facultades}\n`;
    contenido += `- **Total de programas:** ${reporte.resumen.total_programas}\n`;
    contenido += `- **Total de errores:** ${reporte.resumen.errores_totales}\n`;
    contenido += `- **Total de advertencias:** ${reporte.resumen.warnings_totales}\n\n`;

    if (reporte.resumen.errores_totales === 0 && reporte.resumen.warnings_totales === 0) {
        contenido += `✅ **Todo está correcto!**\n\n`;
    }

    Object.keys(reporte.facultades).forEach(facultadId => {
        const facultad = reporte.facultades[facultadId];
        contenido += `## ${facultad.nombre} (${facultadId})\n`;
        contenido += `- Programas: ${facultad.total_programas}\n`;

        if (facultad.errores.length > 0) {
            contenido += `### ❌ Errores\n`;
            facultad.errores.forEach(error => {
                contenido += `**${error.programa}:**\n`;
                error.errores.forEach(err => contenido += `- ${err}\n`);
            });
        }

        if (facultad.warnings.length > 0) {
            contenido += `### ⚠️ Advertencias\n`;
            facultad.warnings.forEach(warning => {
                contenido += `**${warning.programa}:**\n`;
                warning.warnings.forEach(warn => contenido += `- ${warn}\n`);
            });
        }

        contenido += `\n`;
    });

    fs.writeFileSync(rutaSalida, contenido);
    console.log(`✅ Reporte generado: ${rutaSalida}`);
}

// Uso del script
if (require.main === module) {
    const rutaJSON = process.argv[2] || './data/programas.json';
    const rutaReporte = process.argv[3] || './reporte_validacion.md';

    console.log('🔍 Validando programas...');
    const reporte = validarProgramasJSON(rutaJSON);

    if (reporte) {
        generarReporte(reporte, rutaReporte);
        console.log('✅ Validación completada');
    } else {
        console.error('❌ Error en la validación');
        process.exit(1);
    }
}

module.exports = { validarProgramasJSON, validarPrograma };