document.addEventListener('DOMContentLoaded', () => {
  const productList = document.querySelector('.product-list');
  const filterSelect = document.getElementById('filter-select');

  // Charger les produits depuis le JSON
  fetch('/api/index.php')
    .then(response => response.json())
    .then(data => {
      // Générer le HTML pour chaque produit
      const productsHTML = data.products.map(product => `
        <li class="product-item" data-category="${product.category.trim()}">
          <div class="product-card">
            <a href="/assets/html/productdetail.html?id=${product.id}" class="card-banner img-holder has-before" style="--width: 300; --height: 300;">
              <img src="${product.images[0]}" width="300" height="300" loading="lazy" alt="${product.name}" class="img-cover">
              
              <ul class="card-action-list">
                <li>
                  <button class="card-action-btn" aria-label="add to cart">
                    <ion-icon name="add-outline"></ion-icon>
                  </button>
                </li>
                <li><button class="card-action-btn" aria-label="add to cart" title="add to cart"><ion-icon name="bag-handle-outline" aria-hidden="true"></ion-icon></button></li>
                <li>
                  <button class="card-action-btn" aria-label="add to whishlist" title="add to whishlist">
                    <ion-icon name="heart-outline" aria-hidden="true"></ion-icon>
                  </button>
                </li>
              </ul>

              ${product.stock === "En stock" ? 
                `<ul class="badge-list">
                  <li><div class="badge cyan" style="display:none;">New</div></li>
                </ul>` : 
                `<div class="card-badge">Out of Stock</div>`}
            </a>

            <div class="card-content">
              <h3 class="h3">
                <a href="/assets/html/productdetail.html?id=${product.id}" class="card-title">${product.name}</a>
              </h3>
              <div class="card-price">
                <data class="price" value="${product.currentPrice}">MAD ${product.currentPrice.toFixed(2)}</data>
              </div>
            </div>
          </div>
        </li>
      `).join('');

      // Injecter les produits dans la liste
      productList.innerHTML = productsHTML;

      // Initialiser le filtrage
      filterProducts('Tous les produits');
    })
    .catch(error => console.error('Erreur lors du chargement des produits:', error));

  // Fonction de filtrage
  function filterProducts(selectedCategory) {
    const allProducts = document.querySelectorAll('.product-item');
    const category = selectedCategory === 'Tous les produits' ? 'all' : selectedCategory;
    
    allProducts.forEach(product => {
      const productCategory = product.dataset.category.trim();
      product.style.display = (category === 'all' || productCategory === category) ? 'block' : 'none';
    });
  }

  // Configuration du dropdown
  const options = [
    "Tous les produits",
    "Prise",
    "Caméra",
    "Interrupteur",
    "Hygromètre et station météo"
  ];

  const dropdown = document.querySelector('.dropdown');
  const toggle = dropdown.querySelector('.dropdown-toggle');
  const menu = dropdown.querySelector('.dropdown-menu');
  const searchInput = document.getElementById('search-input');
  const itemsContainer = document.getElementById('dropdown-items');

  // Génération dynamique des options
  function populateDropdownItems(filter = '') {
    itemsContainer.innerHTML = '';
    const filteredOptions = options.filter(option => 
      option.toLowerCase().includes(filter.toLowerCase())
    );

    filteredOptions.forEach(option => {
      const item = document.createElement('div');
      item.classList.add('dropdown-item');
      item.textContent = option;
      item.addEventListener('click', () => {
        toggle.textContent = option;
        dropdown.classList.remove('open');
        filterProducts(option); // Appliquer le filtrage
      });
      itemsContainer.appendChild(item);
    });
  }

  // Initialisation des options
  populateDropdownItems();

  // Gestion de l'ouverture/fermeture
  toggle.addEventListener('click', () => {
    dropdown.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });

  // Recherche dans le dropdown
  searchInput.addEventListener('input', () => {
    populateDropdownItems(searchInput.value);
  });
});


