// State
let products = [];
let selectedCategory = '';
let searchDebounceTimer = null;

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const searchInput = document.getElementById('search-input');
const minPriceInput = document.getElementById('min-price-input');
const maxPriceInput = document.getElementById('max-price-input');
const categoryChipsContainer = document.getElementById('category-chips-container');

// Stats Elements
const statTotalProducts = document.getElementById('stat-total-products');
const statTotalStock = document.getElementById('stat-total-stock');
const statCatalogValue = document.getElementById('stat-catalog-value');
const statCategoriesCount = document.getElementById('stat-categories-count');

// Modal Elements
const productModal = document.getElementById('product-modal');
const modalTitle = document.getElementById('modal-title');
const productForm = document.getElementById('product-form');
const btnOpenCreateModal = document.getElementById('btn-open-create-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancelModal = document.getElementById('btn-cancel-modal');

// Form Fields
const formId = document.getElementById('form-product-id');
const formName = document.getElementById('form-name');
const formDescription = document.getElementById('form-description');
const formPrice = document.getElementById('form-price');
const formStock = document.getElementById('form-stock');
const formCategory = document.getElementById('form-category');

// Toast Container
const toastContainer = document.getElementById('toast-container');

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  setupEventListeners();
});

function setupEventListeners() {
  // Search and Filters
  searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(loadProducts, 300);
  });

  minPriceInput.addEventListener('input', () => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(loadProducts, 350);
  });

  maxPriceInput.addEventListener('input', () => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(loadProducts, 350);
  });

  // Modal Controls
  btnOpenCreateModal.addEventListener('click', openCreateModal);
  btnCloseModal.addEventListener('click', closeModal);
  btnCancelModal.addEventListener('click', closeModal);
  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) closeModal();
  });

  // Form Submission
  productForm.addEventListener('submit', handleFormSubmit);
}

// Fetch products from API
async function loadProducts() {
  try {
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (searchInput.value.trim()) params.append('search', searchInput.value.trim());
    if (minPriceInput.value) params.append('minPrice', minPriceInput.value);
    if (maxPriceInput.value) params.append('maxPrice', maxPriceInput.value);

    const url = `/products${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    products = await res.json();
    renderProducts();
    updateStats();
    updateCategoryChips();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Render Products Grid
function renderProducts() {
  if (products.length === 0) {
    productsGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <h3 class="empty-title">No products found</h3>
        <p class="empty-subtitle">Try adjusting your filters or add a new product to PostgreSQL.</p>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = products
    .map((p) => {
      let stockClass = 'stock-in';
      let stockLabel = `${p.stock} in stock`;
      if (p.stock === 0) {
        stockClass = 'stock-out';
        stockLabel = 'Out of Stock';
      } else if (p.stock <= 5) {
        stockClass = 'stock-low';
        stockLabel = `Low Stock (${p.stock})`;
      }

      return `
        <article class="product-card" data-id="${p.id}">
          <div>
            <div class="card-top">
              <span class="category-tag">${escapeHtml(p.category)}</span>
              <span class="stock-pill ${stockClass}">
                ● ${stockLabel}
              </span>
            </div>
            <h3 class="product-title">${escapeHtml(p.name)}</h3>
            <p class="product-desc">${escapeHtml(p.description || 'No description provided.')}</p>
          </div>

          <div>
            <div class="card-pricing">
              <span class="price-val">$${Number(p.price).toFixed(2)}</span>
              <span class="stock-val">ID: #${p.id}</span>
            </div>

            <div class="card-actions">
              <div class="stock-quick-controls" title="Quick adjust stock in PostgreSQL">
                <button class="btn-ctrl" onclick="adjustStock(${p.id}, -1)">-</button>
                <span style="font-size:0.8rem; font-weight:600; padding:0 4px;">Qty</span>
                <button class="btn-ctrl" onclick="adjustStock(${p.id}, 1)">+</button>
              </div>

              <div style="display:flex; gap:8px;">
                <button class="btn-action btn-edit" onclick="openEditModal(${p.id})">Edit</button>
                <button class="btn-action btn-delete" onclick="deleteProduct(${p.id}, '${escapeHtml(p.name)}')">Delete</button>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

// Update Stats Dashboard
function updateStats() {
  const total = products.length;
  const totalUnits = products.reduce((acc, p) => acc + Number(p.stock), 0);
  const totalVal = products.reduce((acc, p) => acc + Number(p.price) * Number(p.stock), 0);
  const uniqueCats = new Set(products.map((p) => p.category)).size;

  statTotalProducts.textContent = total;
  statTotalStock.textContent = totalUnits;
  statCatalogValue.textContent = `$${totalVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  statCategoriesCount.textContent = uniqueCats;
}

// Update Category Filter Chips
function updateCategoryChips() {
  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  let chipsHtml = `
    <button class="chip ${selectedCategory === '' ? 'active' : ''}" onclick="selectCategory('')">
      All Products
    </button>
  `;

  categories.forEach((cat) => {
    chipsHtml += `
      <button class="chip ${selectedCategory === cat ? 'active' : ''}" onclick="selectCategory('${escapeHtml(cat)}')">
        ${escapeHtml(cat)}
      </button>
    `;
  });

  categoryChipsContainer.innerHTML = chipsHtml;
}

window.selectCategory = function (cat) {
  selectedCategory = cat;
  loadProducts();
};

// Modal Operations
function openCreateModal() {
  modalTitle.textContent = 'Add New Product';
  formId.value = '';
  productForm.reset();
  productModal.classList.add('active');
}

window.openEditModal = function (id) {
  const p = products.find((prod) => prod.id === id);
  if (!p) return;

  modalTitle.textContent = `Edit Product #${p.id}`;
  formId.value = p.id;
  formName.value = p.name;
  formDescription.value = p.description || '';
  formPrice.value = p.price;
  formStock.value = p.stock;
  formCategory.value = p.category;

  productModal.classList.add('active');
};

function closeModal() {
  productModal.classList.remove('active');
}

// Form Submission (Create or Update)
async function handleFormSubmit(e) {
  e.preventDefault();

  const id = formId.value;
  const payload = {
    name: formName.value.trim(),
    description: formDescription.value.trim() || undefined,
    price: parseFloat(formPrice.value),
    stock: parseInt(formStock.value, 10),
    category: formCategory.value.trim(),
  };

  try {
    let res;
    if (id) {
      // Update
      res = await fetch(`/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      // Create
      res = await fetch('/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    const data = await res.json();

    if (!res.ok) {
      const msg = Array.isArray(data.message) ? data.message.join(' | ') : data.message;
      throw new Error(msg || 'Request failed');
    }

    showToast(
      id ? `Product #${id} updated successfully!` : `Created product "${data.name}" in PostgreSQL!`,
      'success',
    );
    closeModal();
    loadProducts();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Quick Stock Adjustment (+1 or -1)
window.adjustStock = async function (id, delta) {
  const p = products.find((prod) => prod.id === id);
  if (!p) return;

  const newStock = p.stock + delta;
  if (newStock < 0) {
    showToast('Stock quantity cannot be negative!', 'error');
    return;
  }

  try {
    const res = await fetch(`/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: newStock }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to adjust stock');
    }

    showToast(`Stock updated to ${newStock} for "${p.name}"`, 'success');
    loadProducts();
  } catch (err) {
    showToast(err.message, 'error');
  }
};

// Delete Product
window.deleteProduct = async function (id, name) {
  if (!confirm(`Are you sure you want to delete "${name}" (ID #${id})?`)) {
    return;
  }

  try {
    const res = await fetch(`/products/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Failed to delete product');
    }

    showToast(`Product #${id} deleted from PostgreSQL`, 'success');
    loadProducts();
  } catch (err) {
    showToast(err.message, 'error');
  }
};

// Toast Notifications
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : '⚠️'}</span>
    <span>${escapeHtml(message)}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Utility: Escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
