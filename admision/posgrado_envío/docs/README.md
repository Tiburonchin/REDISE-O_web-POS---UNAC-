# Sistema de Gestión de Postulantes - Escuela de Posgrado UNAC

[![Licencia](https://img.shields.io/badge/Licencia-MIT-blue.svg)](LICENSE)
[![PHP](https://img.shields.io/badge/PHP-7.4%2B-777BB4?logo=php)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)

Sistema web integral para la gestión del proceso de admisión de la Escuela de Posgrado de la Universidad Nacional del Callao (UNAC). Permite la inscripción en línea de postulantes, carga y validación de documentos, seguimiento del estado de postulación, y notificaciones automáticas vía WhatsApp y correo electrónico. Incluye panel de administración, consultas por token, y guías de ayuda para postulantes.

---

## 🚀 Características Principales

- **Inscripción en Línea**: Formulario moderno y responsivo para postulación.
- **Gestión de Documentos**: Subida y validación de archivos PDF e imágenes.
- **Validación Automática**: Verificación de requisitos y documentos en tiempo real.
- **Notificaciones**: Alertas automáticas por WhatsApp y correo electrónico.
- **Panel de Administración**: Gestión integral de postulantes y documentos.
- **Consulta por Token**: Seguimiento del estado de expediente mediante código único.
- **Guías y Ayuda**: Sección de ayuda con tutoriales y enlaces útiles.
- **Seguridad**: Protección contra inyecciones SQL/XSS, validación de formularios, hash de contraseñas.
- **Reportes**: Generación de reportes y exportación de datos.

---

## 📦 Estructura del Proyecto

```
posgrado_envío/
├── api/                # Lógica backend (PHP)
│   ├── api_postulantes.php
│   └── form_postulantes.php
├── assets/
│   └── img/           # Imágenes institucionales y logos
├── config/            # Configuración y credenciales
│   ├── credentials.json
│   └── programas_detalle_programa.json
├── css/
│   └── styles.css     # Estilos personalizados
├── docs/
│   └── README.md      # Documentación
├── js/                # Scripts frontend
│   ├── clipboard.js
│   ├── footer-scripts.js
│   ├── multiple-download.js
│   └── scripts.js
├── carpeta_de_postulante.html # Página principal de postulantes
└── ...
```

---

## ⚙️ Requisitos del Sistema

- Servidor web (Apache/Nginx)
- PHP 7.4 o superior
- MySQL 8.0 o superior
- Extensiones PHP: PDO, OpenSSL
- Espacio en disco: Mínimo 100MB (según documentos)

---

## 🛠 Instalación y Puesta en Marcha

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Tiburonchin/posgrado_carpetas.git
   cd posgrado_envío
   ```
2. **Configurar la base de datos**
   - Importa el archivo SQL correspondiente (si aplica)
   - Configura las credenciales en `config/credentials.json`
3. **Configurar el entorno**
   - Ajusta los parámetros necesarios en los archivos de configuración
4. **Permisos**
   - Asegúrate de que las carpetas de subida tengan permisos de escritura
5. **Acceso**
   - Ingresa a `carpeta_de_postulante.html` desde tu navegador

---

## 🖥️ Funcionalidades Destacadas

- **Búsqueda de postulantes por DNI, facultad y programa**
- **Subida de documentos (PDF, imagen) con validación de tamaño y formato**
- **Consulta de estado por código de expediente/token**
- **Sección de ayuda y enlaces rápidos a guías, requisitos y cronograma**
- **Panel de administración (no incluido en frontend, requiere acceso especial)**
- **Notificaciones automáticas (requiere configuración de API de WhatsApp y correo)**

---

## 🔒 Seguridad

- Contraseñas con hash seguro (bcrypt)
- Protección CSRF y validación de entradas
- Headers de seguridad HTTP
- Protección contra inyección SQL y XSS

---

## 📧 Configuración de Correo y WhatsApp

- Edita los archivos de configuración en `config/` para agregar credenciales SMTP y API de WhatsApp Business.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](../LICENSE) para más información.

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor, lee nuestras pautas de contribución antes de enviar un pull request.

---

## 📞 Soporte

- Soporte Técnico: earamost@unac.edu.pe
- Teléfono: +51 912 594 832

---

Desarrollado por el Departamento de Tecnologías de la Información - UNAC © 2025
