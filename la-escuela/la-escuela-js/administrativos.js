document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const facultyFilters = document.querySelectorAll(".faculty-filter li");
  const adminCards = document.querySelectorAll(".admin-card");
  const noResults = document.getElementById("noResults");
  const filterToggle = document.getElementById("filterToggle");
  const facultySection = document.getElementById("facultySection");

  // Buscar por texto
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const y = window.scrollY;
      filterAdmins();
      window.scrollTo(0, y);
    });
  }

  // Filtro por facultad
  facultyFilters.forEach(filter => {
    filter.addEventListener("click", () => {
      facultyFilters.forEach(f => f.classList.remove("active"));
      filter.classList.add("active");
      const y = window.scrollY;
      filterAdmins();
      window.scrollTo(0, y);
    });
  });

  // Estado inicial responsive: colapsar en <= 992px
  function setInitialCollapse() {
    const isMobile = window.matchMedia("(max-width: 992px)").matches;
    if (isMobile) {
      facultySection?.classList.add("collapsed");
      if (filterToggle) {
        filterToggle.setAttribute("aria-expanded", "false");
        const icon = filterToggle.querySelector("i");
        if (icon) icon.classList.remove("fa-chevron-up"), icon.classList.add("fa-chevron-down");
      }
    } else {
      facultySection?.classList.remove("collapsed");
      if (filterToggle) {
        filterToggle.setAttribute("aria-expanded", "true");
        const icon = filterToggle.querySelector("i");
        if (icon) icon.classList.remove("fa-chevron-down"), icon.classList.add("fa-chevron-up");
      }
    }
  }

  setInitialCollapse();
  window.addEventListener("resize", setInitialCollapse);

  // Toggle manual
  filterToggle?.addEventListener("click", () => {
    facultySection?.classList.toggle("collapsed");
    const expanded = !(facultySection?.classList.contains("collapsed"));
    filterToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    const icon = filterToggle.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-chevron-up", expanded);
      icon.classList.toggle("fa-chevron-down", !expanded);
    }
  });

  function filterAdmins() {
    const query = (searchInput?.value || "").toLowerCase();
    const activeEl = document.querySelector(".faculty-filter .active");
    const selectedFaculty = activeEl ? activeEl.dataset.facultad : "all";

    let visibleCount = 0;
    adminCards.forEach(card => {
      const name = (card.dataset.nombre || "").toLowerCase();
      const faculty = card.dataset.facultad || "";

      const matchesText = name.includes(query);
      const matchesFaculty = selectedFaculty === "all" || faculty === selectedFaculty;

      const show = matchesText && matchesFaculty;
      card.style.display = show ? "flex" : "none";
      if (show) visibleCount++;
    });

    if (noResults) {
      noResults.style.display = visibleCount === 0 ? "block" : "none";
    }
  }

  // Primera aplicación de filtro
  filterAdmins();
});