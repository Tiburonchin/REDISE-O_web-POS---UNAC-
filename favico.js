// Script para generar favicon robusto
function setFavicon(iconURL) {
    let link = document.querySelector("link[rel~='icon']");
    
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }

    link.href = iconURL;
}

// Ejemplo de uso:
setFavicon('https://posgrado.unac.edu.pe/img/cropped-Logo_UNAC_Encabezado_icon-180x180.png');
