document.addEventListener('DOMContentLoaded', () => {
    const adminContainer = document.getElementById('adminContainer');
    const searchInput = document.getElementById('searchInput');
    const noResults = document.getElementById('noResults');
    
    const facultyFilterBtn = document.getElementById('facultyFilterBtn');
    const facultyPanel = document.getElementById('facultyPanel');
    const closePanelBtn = document.getElementById('closePanelBtn');
    const facultyGrid = document.getElementById('facultyGrid');

    let allAdmins = [];
    let allFaculties = [];
    let activeFaculty = 'all';

    // --- 1. DATA FETCHING AND INITIALIZATION ---
    async function loadData() {
        try {
            const response = await fetch('./data/administrativos.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            allFaculties = data.facultades.map(f => ({ id: f.id, nombre: f.nombre }));
            allAdmins = data.facultades.flatMap(faculty => 
                faculty.administrativos.map(admin => ({
                    ...admin,
                    facultyName: faculty.nombre,
                    facultyId: faculty.id
                }))
            );
            
            initComponents();
        } catch (error) {
            console.error("Error loading administrative data:", error);
            if (adminContainer) {
                adminContainer.innerHTML = '<p class="error-message">No se pudo cargar la información. Por favor, intente más tarde.</p>';
            }
        }
    }

    function initComponents() {
        populateFacultyFilter();
        displayAdmins(allAdmins);
        setupEventListeners();
    }

    // --- 2. DYNAMIC ELEMENT CREATION ---
    function populateFacultyFilter() {
        if (!facultyGrid) return;
        facultyGrid.innerHTML = '';
        
        const allButton = createFacultyCard({ id: 'all', nombre: 'Mostrar Todos' });
        allButton.classList.add('active');
        facultyGrid.appendChild(allButton);

        allFaculties.forEach(faculty => {
            const facultyButton = createFacultyCard(faculty);
            facultyGrid.appendChild(facultyButton);
        });
    }

    function createFacultyCard(faculty) {
        const card = document.createElement('button');
        card.className = 'faculty-card';
        card.dataset.facultyId = faculty.id;
        card.textContent = faculty.nombre;
        return card;
    }

    function createAdminCard(admin) {
        const card = document.createElement('div');
        card.className = 'admin-card';
        card.dataset.adminId = admin.id; // Use a unique ID for the admin

        const initial = admin.nombre.charAt(0).toUpperCase();

        card.innerHTML = `
            <div class="admin-avatar">${initial}</div>
            <div class="admin-info">
                <h4 class="admin-name">${admin.nombre}</h4>
                <p class="admin-cargo">${admin.cargo}</p>
                <p class="admin-faculty">${admin.facultyName}</p>
            </div>
            <div class="contact-icons">
                ${admin.whatsapp ? `<a href="https://wa.me/${admin.whatsapp}" target="_blank" class="icon-circle whatsapp" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>` : ''}
                <button class="icon-circle btn-share" aria-label="Compartir">
                    <i class="fas fa-share-alt"></i>
                </button>
                ${admin.email ? `<a href="mailto:${admin.email}" class="icon-circle email" aria-label="Enviar correo"><i class="fas fa-envelope"></i></a>` : ''}
            </div>
        `;
        return card;
    }

    function displayAdmins(admins) {
        if (!adminContainer || !noResults) return;
        adminContainer.innerHTML = '';
        if (admins.length === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
            admins.forEach(admin => {
                const card = createAdminCard(admin);
                adminContainer.appendChild(card);
            });
        }
    }

    // --- 3. EVENT LISTENERS AND HANDLERS ---
    function setupEventListeners() {
        if (searchInput) {
            searchInput.addEventListener('input', handleFiltering);
        }
        if (facultyFilterBtn) {
            facultyFilterBtn.addEventListener('click', toggleFacultyPanel);
        }
        if (closePanelBtn) {
            closePanelBtn.addEventListener('click', closeFacultyPanel);
        }
        
        document.addEventListener('click', (e) => {
            if (facultyPanel && facultyFilterBtn && !facultyPanel.contains(e.target) && !facultyFilterBtn.contains(e.target)) {
                closeFacultyPanel();
            }
        });

        if (facultyGrid) {
            facultyGrid.addEventListener('click', (e) => {
                const target = e.target.closest('.faculty-card');
                if (target) {
                    activeFaculty = target.dataset.facultyId;
                    facultyGrid.querySelectorAll('.faculty-card').forEach(btn => btn.classList.remove('active'));
                    target.classList.add('active');
                    handleFiltering();
                    closeFacultyPanel();
                }
            });
        }

        // Event delegation for share buttons
        if (adminContainer) {
            adminContainer.addEventListener('click', handleAdminCardClicks);
        }
    }

    function handleAdminCardClicks(e) {
        const shareButton = e.target.closest('.btn-share');
        if (shareButton) {
            const card = e.target.closest('.admin-card');
            const adminId = parseInt(card.dataset.adminId, 10);
            const adminInfo = allAdmins.find(a => a.id === adminId);

            if (adminInfo) {
                copyAdminInfoToClipboard(adminInfo);
            }
        }
    }

    function copyAdminInfoToClipboard(admin) {
        const infoText = `
            Nombre: ${admin.nombre}

            Cargo: ${admin.cargo}

            Facultad: ${admin.facultyName}

            Teléfono: ${admin.telefono || 'No disponible'}

            Email: ${admin.email || 'No disponible'}
        `.trim().replace(/^ +/gm, '');

        navigator.clipboard.writeText(infoText).then(() => {
            showToast('¡Información copiada!');
        }).catch(err => {
            console.error('Error al copiar la información: ', err);
            showToast('Error al copiar', 'error');
        });
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger the animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Hide and remove the toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
    }

    function toggleFacultyPanel() {
        if (!facultyPanel || !facultyFilterBtn) return;
        const isActive = facultyPanel.classList.toggle('show');
        facultyFilterBtn.classList.toggle('active', isActive);
        facultyFilterBtn.setAttribute('aria-expanded', isActive);
    }

    function closeFacultyPanel() {
        if (!facultyPanel || !facultyFilterBtn) return;
        facultyPanel.classList.remove('show');
        facultyFilterBtn.classList.remove('active');
        facultyFilterBtn.setAttribute('aria-expanded', 'false');
    }

    // --- 4. FILTERING LOGIC ---
    function handleFiltering() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        let filteredAdmins = allAdmins;

        if (activeFaculty !== 'all') {
            filteredAdmins = filteredAdmins.filter(admin => admin.facultyId === activeFaculty);
        }

        if (searchTerm) {
            filteredAdmins = filteredAdmins.filter(admin => 
                admin.nombre.toLowerCase().includes(searchTerm) ||
                admin.cargo.toLowerCase().includes(searchTerm)
            );
        }

        displayAdmins(filteredAdmins);
    }

    // --- INITIAL KICK-OFF ---
    loadData();
});
