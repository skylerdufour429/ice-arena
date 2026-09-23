const appListEl = document.getElementById('appList');
const statsEl = document.getElementById('stats');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const themeToggle = document.getElementById('themeToggle');
const template = document.getElementById('appCardTemplate');

let apps = [];

function normalizeFileSize(rawValue) {
  const trimmed = String(rawValue ?? '').trim();

  if (!trimmed) {
    return 'Unknown';
  }

  const numeric = Number.parseFloat(trimmed);
  if (Number.isNaN(numeric)) {
    return trimmed;
  }

  if (!/[a-z]/i.test(trimmed)) {
    return `${numeric} MB`;
  }

  return trimmed;
}

function safeSortValue(app, key) {
  if (key === 'size') {
    const value = Number.parseFloat((app.fileSize || '').replace(/[^0-9.]/g, ''));
    return Number.isFinite(value) ? value : 0;
  }

  if (key === 'version') {
    const value = Number.parseFloat((app.version || '').replace(/[^0-9.]/g, ''));
    return Number.isFinite(value) ? value : 0;
  }

  return String(app.appName || '').toLowerCase();
}

function renderStats(list) {
  const totalApps = list.length;
  const totalSize = list.reduce((sum, app) => {
    const size = Number.parseFloat((app.fileSize || '').replace(/[^0-9.]/g, ''));
    return sum + (Number.isFinite(size) ? size : 0);
  }, 0);

  const cards = [
    { label: 'Apps', value: totalApps },
    { label: 'Average size', value: totalApps ? `${(totalSize / totalApps).toFixed(1)} MB` : '0.0 MB' },
    { label: 'Largest', value: list.length ? list.reduce((max, app) => {
      const value = Number.parseFloat((app.fileSize || '').replace(/[^0-9.]/g, ''));
      return value > max ? value : max;
    }, 0).toFixed(1) + ' MB' : '0.0 MB' },
  ];

  statsEl.innerHTML = cards
    .map(
      (card) => `
        <div class="stat-card panel">
          <p>${card.label}</p>
          <strong>${card.value}</strong>
        </div>
      `,
    )
    .join('');
}

function filterAndSort(list) {
  const query = searchInput.value.trim().toLowerCase();
  const sortKey = sortSelect.value;

  const filtered = list.filter((app) => {
    const haystack = [
      app.appName,
      app.bundleId,
      app.version,
      app.platform,
      app.minimumOs,
      app.fileSize,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });

  const sorted = [...filtered].sort((a, b) => {
    const direction = sortKey.endsWith('desc') ? -1 : 1;

    switch (sortKey) {
      case 'name-asc':
        return a.appName.localeCompare(b.appName) * direction;
      case 'name-desc':
        return a.appName.localeCompare(b.appName) * -1;
      case 'size-desc':
        return (safeSortValue(b, 'size') - safeSortValue(a, 'size')) * direction;
      case 'size-asc':
        return (safeSortValue(a, 'size') - safeSortValue(b, 'size')) * direction;
      case 'version-desc':
        return (safeSortValue(b, 'version') - safeSortValue(a, 'version')) * direction;
      default:
        return 0;
    }
  });

  return sorted;
}

function renderAppCards(list) {
  if (!list.length) {
    appListEl.innerHTML = '<div class="empty-state panel">No apps match your filter.</div>';
    renderStats([]);
    return;
  }

  appListEl.innerHTML = '';

  list.forEach((app) => {
    const node = template.content.firstElementChild.cloneNode(true);
    const firstLetter = (app.appName || 'A').trim().charAt(0).toUpperCase() || 'A';

    node.querySelector('.app-icon').textContent = firstLetter;
    node.querySelector('.app-name').textContent = app.appName;
    node.querySelector('.bundle-id').textContent = app.bundleId;
    node.querySelector('.version').textContent = app.version;
    node.querySelector('.platform').textContent = app.platform;
    node.querySelector('.minimum-os').textContent = app.minimumOs;
    node.querySelector('.file-size').textContent = normalizeFileSize(app.fileSize);

    appListEl.appendChild(node);
  });

  renderStats(list);
}

async function loadApps() {
  try {
    const response = await fetch('apps.json');
    if (!response.ok) {
      throw new Error('Could not load app metadata.');
    }

    apps = await response.json();
    renderAppCards(filterAndSort(apps));
  } catch (error) {
    console.error(error);
    appListEl.innerHTML = '<div class="empty-state panel">Unable to load app archive metadata.</div>';
  }
}

searchInput.addEventListener('input', () => renderAppCards(filterAndSort(apps)));
sortSelect.addEventListener('change', () => renderAppCards(filterAndSort(apps)));

themeToggle.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light');
  themeToggle.textContent = isLight ? '☀️' : '🌙';
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((error) => {
      console.warn('Service worker registration failed:', error);
    });
  });
}

loadApps();
