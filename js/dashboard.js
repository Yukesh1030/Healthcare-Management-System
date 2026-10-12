/**
 * STACKLY HEALTHCARE - DASHBOARDS SCRIPT (js/dashboard.js)
 * Sidebar drawer, tab switching across the 5 main menus, simulated refresh, search in tables
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardSidebar();
  initDashboardTabs();
  initRefreshControl();
  initTableSearch();
});

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
 * 5 Menu Tab Switching
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

      // Show target panel
      tabPanels.forEach(panel => {
        if (panel.id === `tab-${targetTab}`) {
          panel.style.display = 'block';
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
 * Refresh Controls & Live Metric Simulation
 */
function initRefreshControl() {
  const refreshBtn = document.getElementById('dashboard-refresh-btn');
  if (!refreshBtn) return;

  refreshBtn.addEventListener('click', () => {
    refreshBtn.classList.add('spinning');
    refreshBtn.disabled = true;

    setTimeout(() => {
      refreshBtn.classList.remove('spinning');
      refreshBtn.disabled = false;

      // Optional slight bump to counters for dynamic feel
      const kpis = document.querySelectorAll('.kpi-value');
      kpis.forEach(k => {
        k.style.opacity = '0.5';
        setTimeout(() => { k.style.opacity = '1'; }, 200);
      });

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
