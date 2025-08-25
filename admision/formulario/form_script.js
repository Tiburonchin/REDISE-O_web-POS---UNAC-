let datosProgramas = {};

fetch('programas.json')
  .then(res => res.json())
  .then(data => {
    datosProgramas = data;
    cargarUnidades();
  });

function cargarUnidades() {
  const unidadSelect = document.getElementById('unidad');
  unidadSelect.innerHTML = '<option value="">Seleccione</option>';
  for (const unidad in datosProgramas) {
    const option = document.createElement('option');
    option.value = unidad;
    option.textContent = unidad;
    unidadSelect.appendChild(option);
  }
  document.getElementById('programa').innerHTML = '<option value="">Seleccione</option>';
  cargarDetalles(); // Para que detalle_programa muestre "--------" al inicio
}

function cargarProgramas() {
  const unidad = document.getElementById('unidad').value;
  const programaSelect = document.getElementById('programa');
  programaSelect.innerHTML = '<option value="">Seleccione</option>';
  cargarDetalles(); // Limpia y actualiza detalle_programa

  if (unidad && datosProgramas[unidad]) {
    for (const tipoPrograma in datosProgramas[unidad]) {
      // Solo mostrar si es un array (es decir, un programa, no un link)
      if (Array.isArray(datosProgramas[unidad][tipoPrograma])) {
        const option = document.createElement('option');
        option.value = tipoPrograma;
        option.textContent = tipoPrograma;
        programaSelect.appendChild(option);
      }
    }
  }
}

function cargarDetalles() {
  const unidad = document.getElementById('unidad').value;
  const programa = document.getElementById('programa').value;
  const detalleSelect = document.getElementById('detalle_programa');
  detalleSelect.innerHTML = '';

  if (unidad && programa && datosProgramas[unidad] && datosProgramas[unidad][programa]) {
    datosProgramas[unidad][programa].forEach(detalle => {
      const option = document.createElement('option');
      option.value = detalle;
      option.textContent = detalle;
      detalleSelect.appendChild(option);
    });
    detalleSelect.size = 5;
  } else {
    // Si no hay selección, muestra solo "--------"
    const option = document.createElement('option');
    option.value = "";
    option.textContent = " ";
    detalleSelect.appendChild(option);
    detalleSelect.size = 5;
  }
}

document.addEventListener('DOMContentLoaded', function() {
    const detallePrograma = document.getElementById('detalle_programa');
    const detalleSeleccionado = document.getElementById('detalle_seleccionado');

    function actualizarDetalleSeleccionado() {
        if (detallePrograma && detalleSeleccionado) {
            const texto = detallePrograma.value ? detallePrograma.value : 'Ninguno seleccionado';
            detalleSeleccionado.textContent = texto;
            detalleSeleccionado.classList.toggle('activo', !!detallePrograma.value);
        }
    }

    if (detallePrograma) {
        detallePrograma.addEventListener('change', actualizarDetalleSeleccionado);
        // Inicializa al cargar
        actualizarDetalleSeleccionado();
    }

    document.querySelectorAll('input[required], select[required]').forEach(input => {
        input.addEventListener('input', function() {
            if (input.value.trim()) {
                input.classList.remove('input-error');
                input.classList.add('input-success');
            } else {
                input.classList.remove('input-success');
            }
        });
        input.addEventListener('blur', function() {
            if (input.value.trim()) {
                input.classList.remove('input-error');
                input.classList.add('input-success');
            } else {
                input.classList.remove('input-success');
            }
        });
    });

    // Bloquear botón y mostrar spinner al enviar (AJAX)
    const form = document.querySelector('form');
    const btnEnviar = document.getElementById('btn-enviar');
    if (form && btnEnviar) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            btnEnviar.disabled = true;
            btnEnviar.querySelector('.spinner').style.display = 'inline-block';
            btnEnviar.querySelector('.btn-text').textContent = 'Enviando...';

            const formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: formData
            })
            .then(res => res.text())
            .then(response => {
                console.log('Respuesta del servidor:', response); // <-- Agrega esto
                if (response.trim() === 'OK_REDIRECT') {
                    btnEnviar.querySelector('.btn-text').textContent = 'Redireccionando...';
                    setTimeout(function() {
                        window.location.href = "https://posgrado.unac.edu.pe/index.html";
                    }, 1200);
                } else {
                    btnEnviar.querySelector('.btn-text').textContent = 'Error al enviar';
                    btnEnviar.querySelector('.spinner').style.display = 'none';
                    let errorDiv = document.getElementById('form-error');
                    if (!errorDiv) {
                        errorDiv = document.createElement('div');
                        errorDiv.id = 'form-error';
                        errorDiv.style.color = 'red';
                        errorDiv.style.textAlign = 'center';
                        form.prepend(errorDiv);
                    }
                    errorDiv.innerHTML = response;
                }
            })
            .catch(() => {
                btnEnviar.querySelector('.btn-text').textContent = 'Error de conexión';
                btnEnviar.querySelector('.spinner').style.display = 'none';
            });
        });
    }
});

