function downloadMultiplePDFs(event) {
    event.preventDefault();

    const urls = [
        "https://raw.githubusercontent.com/Tiburonchin/GUIAS-PDS/main/UNIVERSIDAD%20NACIONAL%20DEL%20CALLAO_guia%20de%20postulante.pdf",
        "https://raw.githubusercontent.com/Tiburonchin/GUIAS-PDS/main/manual-de-pago-postulantes.pdf"
    ];

    urls.forEach((url, index) => {
        setTimeout(() => {
            const a = document.createElement("a");
            a.href = url;
            a.download = `archivo${index + 1}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }, index * 1000); // 1000ms (1 segundo) entre cada descarga
    });
}