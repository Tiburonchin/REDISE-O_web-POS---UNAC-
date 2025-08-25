document.addEventListener("DOMContentLoaded", () => {
  // Variables globales
  let facultadesData = [];
  let administrativosData = []; // Array plano para facilitar búsquedas
  
  // Elementos del DOM
  const searchInput = document.getElementById("searchInput");
  const facultyFilters = document.querySelector(".faculty-filter");
  const adminContainer = document.getElementById("adminContainer");
  const noResults = document.getElementById("noResults");
  const filterToggle = document.getElementById("filterToggle");
  const facultySection = document.getElementById("facultySection");

  // Cargar datos desde JSON
  async function loadAdministrativosData() {
    try {
      const response = await fetch('data/administrativos.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      facultadesData = data.facultades;
      
      // Convertir estructura anidada a array plano para facilitar búsquedas
      administrativosData = [];
      facultadesData.forEach(facultad => {
        facultad.administrativos.forEach(admin => {
          administrativosData.push({
            ...admin,
            facultad: facultad.nombre,
            facultadId: facultad.id
          });
        });
      });
      
      console.log('✅ Datos cargados:', facultadesData.length, 'facultades y', administrativosData.length, 'administrativos');
      
      // Inicializar la interfaz
      renderFacultyFilters();
      renderAdministrativos();
      setupEventListeners();
      setInitialCollapse();
      
    } catch (error) {
      console.error('❌ Error al cargar datos de administrativos:', error);
      showErrorMessage();
    }
  }

  // Renderizar filtros de facultades
  function renderFacultyFilters() {
    if (!facultyFilters) return;
    
    // Limpiar filtros existentes
    facultyFilters.innerHTML = '';
    
    // Agregar opción "Todas"
    const allOption = document.createElement('li');
    allOption.dataset.facultad = 'all';
    allOption.classList.add('active');
    allOption.textContent = 'Todas';
    facultyFilters.appendChild(allOption);
    
    // Agregar facultades dinámicamente
    facultadesData.forEach(facultad => {
      const li = document.createElement('li');
      li.dataset.facultad = facultad.id;
      li.textContent = facultad.nombre;
      
      facultyFilters.appendChild(li);
    });
    
    console.log('✅ Filtros de facultades renderizados');
  }

  // Renderizar tarjetas de administrativos
  function renderAdministrativos(filteredData = administrativosData) {
    if (!adminContainer) return;
    
    // Limpiar contenedor (mantener el mensaje de "no results")
    const existingNoResults = adminContainer.querySelector('#noResults');
    adminContainer.innerHTML = '';
    if (existingNoResults) {
      adminContainer.appendChild(existingNoResults);
    }
    
    // Si no hay datos, mostrar mensaje
    if (filteredData.length === 0) {
      showNoResults(true);
      return;
    }
    
    showNoResults(false);
    
    // Mostrar todas las tarjetas de forma simple
    renderIndividualCards(filteredData);
  }

  // Renderizar tarjetas individuales
  function renderIndividualCards(data) {
    data.forEach(admin => {
      const adminCard = createAdminCard(admin);
      adminContainer.appendChild(adminCard);
    });
  }

  // Crear tarjeta individual de administrativo
    function createAdminCard(admin) {
    const card = document.createElement('div');
    card.className = 'admin-card';
    card.dataset.nombre = admin.nombre;
    card.dataset.facultad = admin.facultadId;
    
    card.innerHTML = `
      <div class="admin-avatar">
        <i class="fas fa-user-tie"></i>
      </div>
      <div class="admin-info">
        <h4>${admin.nombre}</h4>
        <p class="cargo">${admin.cargo}</p>
        <p class="faculty">${admin.facultad}</p>
      </div>
      <div class="contact-icons">
        <a href="https://wa.me/${admin.whatsapp}" target="_blank" class="icon-circle whatsapp" title="WhatsApp">
          <i class="fab fa-whatsapp"></i>
        </a>
        <button class="icon-circle share" title="Copiar información">
          <i class="fas fa-share-alt"></i>
        </button>
        <a href="mailto:${admin.email}" class="icon-circle email" title="Correo">
          <i class="fas fa-envelope"></i>
        </a>
      </div>
    `;

    const shareButton = card.querySelector('.share');
    shareButton.addEventListener('click', () => {
      const infoToCopy = `Nombre: ${admin.nombre}\nCargo: ${admin.cargo}\nFacultad: ${admin.facultad}\nTeléfono: ${admin.telefono}\nCorreo: ${admin.email}`;
      
      navigator.clipboard.writeText(infoToCopy)
        .then(() => {
          showToastNotification('¡Información copiada al portapapeles!');
        })
        .catch(err => {
          console.error('Error al copiar la información: ', err);
          showToastNotification('Error al copiar la información', true);
        });
    });
    
    return card;
  }

  // Configurar event listeners
  function setupEventListeners() {
    // Búsqueda por texto
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const y = window.scrollY;
        filterAdmins();
        window.scrollTo(0, y);
      });
    }

    // Filtro por facultad
    if (facultyFilters) {
      facultyFilters.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI' || e.target.parentElement.tagName === 'LI') {
          const clickedLi = e.target.tagName === 'LI' ? e.target : e.target.parentElement;
          
          // Remover clase active de todos
          facultyFilters.querySelectorAll('li').forEach(li => li.classList.remove('active'));
          // Agregar clase active al clickeado
          clickedLi.classList.add('active');
          
          const y = window.scrollY;
          filterAdmins();
          window.scrollTo(0, y);
        }
      });
    }

    // Toggle del filtro en móviles
    if (filterToggle) {
      filterToggle.addEventListener("click", () => {
        facultySection?.classList.toggle("collapsed");
        const expanded = !(facultySection?.classList.contains("collapsed"));
        filterToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
        const icon = filterToggle.querySelector("i");
        if (icon) {
          icon.classList.toggle("fa-chevron-up", expanded);
          icon.classList.toggle("fa-chevron-down", !expanded);
        }
      });
    }

    // Responsive: colapsar en móviles
    window.addEventListener("resize", setInitialCollapse);
  }

  // Función de filtrado
  function filterAdmins() {
    const query = (searchInput?.value || "").toLowerCase().trim();
    const activeEl = facultyFilters?.querySelector('.active');
    const selectedFaculty = activeEl ? activeEl.dataset.facultad : "all";

    const filteredData = administrativosData.filter(admin => {
      // Filtro por texto (nombre, cargo o facultad)
      const matchesText = query === "" || 
        admin.nombre.toLowerCase().includes(query) ||
        admin.cargo.toLowerCase().includes(query) ||
        admin.facultad.toLowerCase().includes(query);
      
      // Filtro por facultad
      const matchesFaculty = selectedFaculty === "all" || admin.facultadId === selectedFaculty;
      
      return matchesText && matchesFaculty;
    });

    renderAdministrativos(filteredData);
    
    console.log(`🔍 Filtrado: ${filteredData.length} administrativos encontrados`);
  }

  // Estado inicial responsive
  function setInitialCollapse() {
    const isMobile = window.matchMedia("(max-width: 992px)").matches;
    
    if (isMobile) {
      facultySection?.classList.add("collapsed");
      if (filterToggle) {
        filterToggle.setAttribute("aria-expanded", "false");
        const icon = filterToggle.querySelector("i");
        if (icon) {
          icon.classList.remove("fa-chevron-up");
          icon.classList.add("fa-chevron-down");
        }
      }
    } else {
      facultySection?.classList.remove("collapsed");
      if (filterToggle) {
        filterToggle.setAttribute("aria-expanded", "true");
        const icon = filterToggle.querySelector("i");
        if (icon) {
          icon.classList.remove("fa-chevron-down");
          icon.classList.add("fa-chevron-up");
        }
      }
    }
  }

  // Mostrar/ocultar mensaje de "no results"
  function showNoResults(show) {
    if (noResults) {
      noResults.style.display = show ? "block" : "none";
    }
  }

  // Mostrar mensaje de error
  function showErrorMessage() {
    if (adminContainer) {
      adminContainer.innerHTML = `
        <div class="error-message" style="text-align: center; padding: 2rem; color: #666;">
          <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; color: #ffc107;"></i>
          <h3>Error al cargar datos</h3>
          <p>No se pudieron cargar los datos de los administrativos. Por favor, recarga la página.</p>
          <button onclick="location.reload()" class="btn btn-primary mt-3">
            <i class="fas fa-refresh"></i> Recargar página
          </button>
        </div>
      `;
    }
  }

  function showToastNotification(message, isError = false) {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    if (isError) {
      toast.style.backgroundColor = 'var(--bs-danger)';
    }
    
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  // Inicializar la aplicación
  loadAdministrativosData();
});