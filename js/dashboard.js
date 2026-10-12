/**
 * STACKLY HEALTHCARE - DASHBOARDS SCRIPT (js/dashboard.js)
 * Sidebar drawer, tab switching across the 5 main menus, simulated refresh, search in tables,
 * and GSAP signature dashboard animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardSidebar();
  initDashboardTabs();
  initRefreshControl();
  initTableSearch();
  initDashboardGsapEntrance();
});

/**
 * GSAP Dashboard Initial Entrance Animation
 */
function initDashboardGsapEntrance() {
  if (typeof gsap === 'undefined') return;

  const kpis = document.querySelectorAll('.kpi-card');
  const panels = document.querySelectorAll('.dashboard-tab-panel.active, .dashboard-tab-panel[style*="display: block"]');

  if (kpis.length > 0) {
    gsap.fromTo(kpis,
      { opacity: 0, y: 20, scale: 0.96 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        stagger: 0.07, 
        duration: 0.45, 
        ease: 'back.out(1.4)', 
        clearProps: 'all' 
      }
    );
  }

  const panelCards = document.querySelectorAll('.panel-card');
  if (panelCards.length > 0) {
    gsap.fromTo(panelCards,
      { opacity: 0, y: 15 },
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.06, 
        duration: 0.4, 
        ease: 'power2.out', 
        clearProps: 'all' 
      }
    );
  }
}

/**
 * Mobile Sidebar Drawer
 */
function initDashboardSidebar() {
  const sidebar = document.querySelector('.dashboard-sidebar');
  const toggleBtn = document.querySelector('.mobile-sidebar-toggle');
  const closeBtn = document.querySelector('.sidebar-close-btn');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(sidebar, { x: -30, opacity: 0.8 }, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
      }
    });
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }

  // Close when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (sidebar && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });
}

/**
 * 5 Menu Tab Switching with GSAP transitions
 */
function initDashboardTabs() {
  const navItems = document.querySelectorAll('.sidebar-nav-item');
  const tabPanels = document.querySelectorAll('.dashboard-tab-panel');
  const pageTitle = document.getElementById('dashboard-page-title');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = item.getAttribute('data-tab');
      if (!targetTab) return;

      // Update sidebar active class
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      // Update page title
      const label = item.querySelector('span')?.innerText || 'Dashboard';
      if (pageTitle) pageTitle.innerText = label;

      // Show target panel with GSAP glide
      tabPanels.forEach(panel => {
        if (panel.id === `tab-${targetTab}`) {
          panel.style.display = 'block';
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(panel, 
              { opacity: 0, y: 16 }, 
              { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'all' }
            );
            const cards = panel.querySelectorAll('.panel-card, .kpi-card');
            if (cards.length > 0) {
              gsap.fromTo(cards,
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, stagger: 0.05, duration: 0.35, ease: 'power2.out', clearProps: 'all' }
              );
            }
          }
        } else {
          panel.style.display = 'none';
        }
      });

      // Close mobile sidebar if open
      const sidebar = document.querySelector('.dashboard-sidebar');
      if (sidebar) sidebar.classList.remove('open');
    });
  });
}

/**
 * Refresh Controls & Live Metric Simulation with GSAP
 */
function initRefreshControl() {
  const refreshBtn = document.getElementById('dashboard-refresh-btn');
  if (!refreshBtn) return;

  refreshBtn.addEventListener('click', () => {
    refreshBtn.classList.add('spinning');
    refreshBtn.disabled = true;

    const icon = refreshBtn.querySelector('i');
    if (typeof gsap !== 'undefined' && icon) {
      gsap.to(icon, { rotation: '+=360', duration: 0.7, ease: 'power2.inOut' });
    }

    setTimeout(() => {
      refreshBtn.classList.remove('spinning');
      refreshBtn.disabled = false;

      // Bump counters for dynamic feel
      const kpis = document.querySelectorAll('.kpi-value');
      if (typeof gsap !== 'undefined' && kpis.length > 0) {
        gsap.fromTo(kpis,
          { scale: 1.1, color: '#42BFA5' },
          { scale: 1, color: '', duration: 0.5, ease: 'back.out(2)', clearProps: 'color' }
        );
      } else {
        kpis.forEach(k => {
          k.style.opacity = '0.5';
          setTimeout(() => { k.style.opacity = '1'; }, 200);
        });
      }

      if (typeof showToast === 'function') {
        showToast('System operational metrics refreshed successfully.', 'fa-rotate');
      }
    }, 700);
  });
}

/**
 * Live Table Filter / Search
 */
function initTableSearch() {
  const searchInputs = document.querySelectorAll('.table-search-input');
  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const table = input.closest('.panel-card')?.querySelector('.data-table');
      if (!table) return;

      const rows = table.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
      });
    });
  });
}
