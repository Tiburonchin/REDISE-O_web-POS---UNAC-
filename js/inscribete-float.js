/* Floating Inscríbete Component Logic (simplificado: sin arrastre, expansión hover/click) */
(function(){
  const el = document.getElementById('inscribete-float');
  if(!el) return;
  const core = el.querySelector('.inscribete-core');
  const icon = el.querySelector('.inscribete-icon');
  const text = el.querySelector('.inscribete-text');

  // Estado inicial: comprimido
  let manualToggle = false; // saber si usuario tocó en móviles

  function expand(){
    el.classList.add('expanded');
    el.setAttribute('aria-expanded','true');
  }
  function collapse(){
    el.classList.remove('expanded');
    el.setAttribute('aria-expanded','false');
  }
  function toggle(){ el.classList.contains('expanded') ? collapse() : expand(); }

  // Hover solo desktop
  const isTouch = matchMedia('(hover: none)').matches;
  if(!isTouch){
    el.addEventListener('mouseenter', expand);
    el.addEventListener('mouseleave', ()=>{ if(!manualToggle) collapse(); });
  }

  // Click / touch toggle
  core.addEventListener('click', ()=>{
    // Primer clic (colapsado) solo expande; segundo clic (ya expandido) redirige
    if(!el.classList.contains('expanded')) {
      manualToggle = true;
      expand();
    } else {
      window.open('https://wa.me/51900970371', '_blank');
    }
  });

  // Teclado accesible
  el.addEventListener('keydown',(e)=>{
    if(e.key==='Enter' || e.key===' '){ e.preventDefault(); toggle(); }
    if(e.key==='Escape'){ collapse(); manualToggle=false; }
  });

  // Auto atención inicial: pequeña expansión y regreso
  setTimeout(()=>{ expand(); setTimeout(()=>{ if(!manualToggle) collapse(); }, 3400); }, 900);

  /* =============================
     MODO POR SECCIONES SIN DETECCIÓN
     Secciones amarillas: hero, motivacional, info-contacto, footer
     Resto: azul
     ============================= */
  const YELLOW_SECTION_IDS = ['hero','motivacional','info-contacto','footer'];

  function isElementInSection(section){
    if(!section) return false;
    const rect = section.getBoundingClientRect();
    const floatRect = el.getBoundingClientRect();
    const centerY = floatRect.top + floatRect.height/2;
    // Ver si el centro vertical del botón está dentro de la sección
    return centerY >= rect.top && centerY <= rect.bottom;
  }

  function updateModeBySection(){
    const shouldBeYellow = YELLOW_SECTION_IDS.some(id=>{
      const node = document.getElementById(id);
      return isElementInSection(node);
    });
    el.classList.toggle('mode-yellow', shouldBeYellow);
    el.classList.toggle('mode-blue', !shouldBeYellow);
  }

  // Re-sample on load & on resize & after a delay (por si imágenes cargan luego)
  window.addEventListener('load', ()=>{ setTimeout(updateModeBySection, 200); });
  window.addEventListener('resize', ()=>{ updateModeBySection(); });
  document.addEventListener('scroll', ()=>{ updateModeBySection(); }, { passive:true });
  setInterval(updateModeBySection, 4000);

  // Exponer API mínima
  window.InscribeteFloat = { expand, collapse, toggle, updateModeBySection };
})();
