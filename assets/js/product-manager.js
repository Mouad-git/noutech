// Fonction pour charger les produits
function loadProducts() {
  fetch('/assets/data/products.json') // Remplacez par le chemin correct vers votre fichier JSON
    .then(response => response.json())
    .then(data => {
      const carousel = document.getElementById('product-carousel');

      // Liste des IDs des produits à afficher
      const productIdsToDisplay = [1, 2, 3, 4, 20];

      // Filtrer les produits pour n'afficher que ceux avec les IDs spécifiés
      const filteredProducts = data.products.filter(product => 
        productIdsToDisplay.includes(product.id)
      );

      // Ajouter les produits filtrés au carrousel
      filteredProducts.forEach(product => {
        const productHTML = `
          <div class="carousel-cell">
            <li class="${product.category}">
              <div class="product-card">
                <a href="/assets/html/productdetail.html?id=${product.id}" class="card-banner img-holder has-before" style="--width: 300; --height: 300;">
                  <img src="${product.images[0]}" width="300" height="300" loading="lazy" alt="${product.name}" class="img-cover">
                  <ul class="card-action-list">
                    <li><button class="card-action-btn" aria-label="add to cart" title="add to cart"><ion-icon name="add-outline" aria-hidden="true"></ion-icon></button></li>
                    <li><button class="card-action-btn" aria-label="add to cart" title="add to cart"><ion-icon name="bag-handle-outline" aria-hidden="true"></ion-icon></button></li>
                    <li><button class="card-action-btn" aria-label="add to whishlist" title="add to whishlist"><ion-icon name="heart-outline" aria-hidden="true"></ion-icon></button></li>
                  </ul>
                </a>
                <div class="card-content">
                  <h3 class="h3"><a href="/assets/html/productdetail.html?id=${product.id}" class="card-title">${product.name}</a></h3>
                  <div class="card-price"><data class="price" value="${product.currentPrice}">MAD ${product.currentPrice.toFixed(2)}</data></div>
                </div>
              </div>
            </li>
          </div>
        `;
        carousel.insertAdjacentHTML('beforeend', productHTML);
      });

      // Initialiser Flickity ici, après avoir ajouté les produits
      new Flickity(carousel, {
        wrapAround: true,
        autoPlay: true,
        prevNextButtons: true,
        pageDots: false
      });
    })
    .catch(error => console.error('Erreur lors du chargement des produits:', error));
}

// Fonction pour charger les caméras
function loadCameras() {
  fetch('/assets/data/products.json') // Remplacez par le chemin correct vers votre fichier JSON
    .then(response => response.json())
    .then(data => {
      const carousel = document.getElementById('camera-carousel');

      // Filtrer les produits pour n'afficher que ceux de la catégorie "Caméra"
      const filteredProducts = data.products.filter(product => 
        product.category === "Caméra"
      );

      // Ajouter les produits filtrés au carrousel
      filteredProducts.forEach(product => {
        const productHTML = `
          <div class="carousel-cell">
            <li class="${product.category}">
              <div class="product-card">
                <a href="/assets/html/productdetail.html?id=${product.id}" class="card-banner img-holder has-before" style="--width: 300; --height: 300;">
                  <img src="${product.images[0]}" width="300" height="300" loading="lazy" alt="${product.name}" class="img-cover">
                  <ul class="card-action-list">
                    <li><button class="card-action-btn" aria-label="add to cart" title="add to cart"><ion-icon name="add-outline" aria-hidden="true"></ion-icon></button></li>
                    <li><button class="card-action-btn" aria-label="add to cart" title="add to cart"><ion-icon name="bag-handle-outline" aria-hidden="true"></ion-icon></button></li>
                    <li><button class="card-action-btn" aria-label="add to whishlist" title="add to whishlist"><ion-icon name="heart-outline" aria-hidden="true"></ion-icon></button></li>
                  </ul>
                </a>
                <div class="card-content">
                  <h3 class="h3"><a href="/assets/html/productdetail.html?id=${product.id}" class="card-title">${product.name}</a></h3>
                  <div class="card-price"><data class="price" value="${product.currentPrice}">MAD ${product.currentPrice.toFixed(2)}</data></div>
                </div>
              </div>
            </li>
          </div>
        `;
        carousel.insertAdjacentHTML('beforeend', productHTML);
      });

      // Initialiser Flickity ici, après avoir ajouté les produits
      new Flickity(carousel, {
        wrapAround: true,
        autoPlay: true,
        prevNextButtons: true,
        pageDots: false
      });
    })
    .catch(error => console.error('Erreur lors du chargement des caméras:', error));
}



function loadPrise() {
  fetch('/assets/data/products.json') // Remplacez par le chemin correct vers votre fichier JSON
    .then(response => response.json())
    .then(data => {
      const carousel = document.getElementById('Prise-carousel');

      // Filtrer les produits pour n'afficher que ceux de la catégorie "Caméra"
      const filteredProducts = data.products.filter(product => 
        product.category === "Prise"
      );

      // Ajouter les produits filtrés au carrousel
      filteredProducts.forEach(product => {
        const productHTML = `
          <div class="carousel-cell">
            <li class="${product.category}">
              <div class="product-card">
                <a href="/assets/html/productdetail.html?id=${product.id}" class="card-banner img-holder has-before" style="--width: 300; --height: 300;">
                  <img src="${product.images[0]}" width="300" height="300" loading="lazy" alt="${product.name}" class="img-cover">
                  <ul class="card-action-list">
                    <li><button class="card-action-btn" aria-label="add to cart" title="add to cart"><ion-icon name="add-outline" aria-hidden="true"></ion-icon></button></li>
                    <li><button class="card-action-btn" aria-label="add to cart" title="add to cart"><ion-icon name="bag-handle-outline" aria-hidden="true"></ion-icon></button></li>
                    <li><button class="card-action-btn" aria-label="add to whishlist" title="add to whishlist"><ion-icon name="heart-outline" aria-hidden="true"></ion-icon></button></li>
                  </ul>
                </a>
                <div class="card-content">
                  <h3 class="h3"><a href="/assets/html/productdetail.html?id=${product.id}" class="card-title">${product.name}</a></h3>
                  <div class="card-price"><data class="price" value="${product.currentPrice}">MAD ${product.currentPrice.toFixed(2)}</data></div>
                </div>
              </div>
            </li>
          </div>
        `;
        carousel.insertAdjacentHTML('beforeend', productHTML);
      });

      // Initialiser Flickity ici, après avoir ajouté les produits
      new Flickity(carousel, {
        wrapAround: true,
        autoPlay: true,
        prevNextButtons: true,
        pageDots: false
      });
    })
    .catch(error => console.error('Erreur lors du chargement des caméras:', error));
}


function loadInterrupteur() {
  fetch('/assets/data/products.json') // Remplacez par le chemin correct vers votre fichier JSON
    .then(response => response.json())
    .then(data => {
      const carousel = document.getElementById('interrupteur-carousel');

      // Filtrer les produits pour n'afficher que ceux de la catégorie "Caméra"
      const filteredProducts = data.products.filter(product => 
        product.category === "Interrupteur"
      );

      // Ajouter les produits filtrés au carrousel
      filteredProducts.forEach(product => {
        const productHTML = `
          <div class="carousel-cell">
            <li class="${product.category}">
              <div class="product-card">
                <a href="/assets/html/productdetail.html?id=${product.id}" class="card-banner img-holder has-before" style="--width: 300; --height: 300;">
                  <img src="${product.images[0]}" width="300" height="300" loading="lazy" alt="${product.name}" class="img-cover">
                  <ul class="card-action-list">
                    <li><button class="card-action-btn" aria-label="add to cart" title="add to cart"><ion-icon name="add-outline" aria-hidden="true"></ion-icon></button></li>
                    <li><button class="card-action-btn" aria-label="add to cart" title="add to cart"><ion-icon name="bag-handle-outline" aria-hidden="true"></ion-icon></button></li>
                    <li><button class="card-action-btn" aria-label="add to whishlist" title="add to whishlist"><ion-icon name="heart-outline" aria-hidden="true"></ion-icon></button></li>
                  </ul>
                </a>
                <div class="card-content">
                  <h3 class="h3"><a href="/assets/html/productdetail.html?id=${product.id}" class="card-title">${product.name}</a></h3>
                  <div class="card-price"><data class="price" value="${product.currentPrice}">MAD ${product.currentPrice.toFixed(2)}</data></div>
                </div>
              </div>
            </li>
          </div>
        `;
        carousel.insertAdjacentHTML('beforeend', productHTML);
      });

      // Initialiser Flickity ici, après avoir ajouté les produits
      new Flickity(carousel, {
        wrapAround: true,
        autoPlay: true,
        prevNextButtons: true,
        pageDots: false
      });
    })
    .catch(error => console.error('Erreur lors du chargement des caméras:', error));
}



function loadHygromètre() {
  fetch('/assets/data/products.json') // Remplacez par le chemin correct vers votre fichier JSON
    .then(response => response.json())
    .then(data => {
      const carousel = document.getElementById('hygromètre-carousel');

      // Filtrer les produits pour n'afficher que ceux de la catégorie "Caméra"
      const filteredProducts = data.products.filter(product => 
        product.category === "Hygromètre et station météo"
      );

      // Ajouter les produits filtrés au carrousel
      filteredProducts.forEach(product => {
        const productHTML = `
          <div class="carousel-cell">
            <li class="${product.category}">
              <div class="product-card">
                <a href="/assets/html/productdetail.html?id=${product.id}" class="card-banner img-holder has-before" style="--width: 300; --height: 300;">
                  <img src="${product.images[0]}" width="300" height="300" loading="lazy" alt="${product.name}" class="img-cover">
                  <ul class="card-action-list">
                    <li><button class="card-action-btn" aria-label="add to cart" title="add to cart"><ion-icon name="add-outline" aria-hidden="true"></ion-icon></button></li>
                    <li><button class="card-action-btn" aria-label="add to cart" title="add to cart"><ion-icon name="bag-handle-outline" aria-hidden="true"></ion-icon></button></li>
                    <li><button class="card-action-btn" aria-label="add to whishlist" title="add to whishlist"><ion-icon name="heart-outline" aria-hidden="true"></ion-icon></button></li>
                  </ul>
                </a>
                <div class="card-content">
                  <h3 class="h3"><a href="/assets/html/productdetail.html?id=${product.id}" class="card-title">${product.name}</a></h3>
                  <div class="card-price"><data class="price" value="${product.currentPrice}">MAD ${product.currentPrice.toFixed(2)}</data></div>
                </div>
              </div>
            </li>
          </div>
        `;
        carousel.insertAdjacentHTML('beforeend', productHTML);
      });

      // Initialiser Flickity ici, après avoir ajouté les produits
      new Flickity(carousel, {
        wrapAround: true,
        autoPlay: true,
        prevNextButtons: true,
        pageDots: false
      });
    })
    .catch(error => console.error('Erreur lors du chargement des caméras:', error));
}

// Appeler les fonctions pour charger les produits et les caméras lorsque la page est chargée
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadCameras();
  loadPrise();
  loadInterrupteur();
  loadHygromètre();
});



document.addEventListener('DOMContentLoaded', () => {
  const productList = document.querySelector('.product-list');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // Charger les produits depuis le JSON
  fetch('/assets/data/products.json')
    .then(response => response.json())
    .then(data => {
      // Générer le HTML pour chaque produit
      const productsHTML = data.products.map(product => `
        <li class="${product.category}">
          <div class="product-card">
            <a href="/assets/html/productdetail.html?id=${product.id}" class="card-banner img-holder has-before" style="--width: 300; --height: 300;">
              <img src="${product.images[0]}" width="300" height="300" loading="lazy" alt="${product.name}" class="img-cover">
              
              <ul class="card-action-list">
                <li>
                  <button class="card-action-btn" aria-label="add to cart">
                    <ion-icon name="add-outline"></ion-icon>
                  </button>
                </li>
                <li>
                  <button class="card-action-btn" aria-label="add to whishlist">
                    <ion-icon name="heart-outline"></ion-icon>
                  </button>
                </li>
              </ul>

              ${product.stock === "En stock" ? 
                `<ul class="badge-list">
                  <li><div class="badge cyan">New</div></li>
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

      productList.innerHTML = productsHTML;

      // Gestion des filtres
      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          const filterValue = button.dataset.filterBtn;
          
          // Mettre à jour les classes actives
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');

          // Filtrer les produits
          const allProducts = productList.querySelectorAll('li');
          allProducts.forEach(product => {
            const category = product.className;
            if(filterValue === 'all' || category === filterValue) {
              product.style.display = 'block';
            } else {
              product.style.display = 'none';
            }
          });
        });
      });
    })
    .catch(error => console.error('Error loading products:', error));
});


