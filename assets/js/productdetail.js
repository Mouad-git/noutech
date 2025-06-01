// État global
let currentImageIndex = 0;
let isLightboxOpen = false;
let productsData = null;

// Charger les données des produits
async function loadProductsData() {
    try {
        const response = await fetch('/api/index.php');
        productsData = await response.json();
        return productsData;
    } catch (error) {
        console.error('Error loading products data:', error);
        return null;
    }
}

// Fonction principale d'initialisation
async function initializeProductPage() {
    await loadProductsData();
    if (!productsData) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;
    const product = productsData.products.find(p => p.id === productId);

    if (product) {
        loadProductDetails(product);
        setupImageGallery(product);
        setupLightbox(product);
        initializeButtons(product);
        loadRelatedProducts();
        updateCartCount();
        updateFavoriteButton(product.id);
    }
}

// Chargement des détails du produit
function loadProductDetails(product) {
    // Fonction utilitaire pour mettre à jour sécurisée
    const safeUpdateElement = (selector, value, property = 'textContent') => {
        const element = document.querySelector(selector);
        if (!element) return;

        const parentElement = element.closest('.product-info-item') || element.parentElement;
        
        if (value === undefined || value === null || value === '') {
            if (parentElement) {
                // Si c'est un élément de prix/réduction, on cache uniquement l'élément lui-même
                if (selector.includes('price') || selector.includes('discount')) {
                    element.style.display = 'none';
                } else {
                    parentElement.style.display = 'none';
                }
            } else {
                element.style.display = 'none';
            }
        } else {
            if (parentElement) {
                parentElement.style.display = '';
            }
            element.style.display = '';
            element[property] = value;
        }
    };

    // Mise à jour des éléments avec gestion indépendante
    safeUpdateElement('.product-name', product.name);
    safeUpdateElement('.product-desc', product.description);

    // Prix actuel
    const currentPriceElement = document.querySelector('.current-price');
    if (currentPriceElement && product.currentPrice) {
        currentPriceElement.style.display = '';
        currentPriceElement.textContent = `MAD ${product.currentPrice.toFixed(2)}`;
    } else if (currentPriceElement) {
        currentPriceElement.style.display = 'none';
    }

    // "previousPrice":50.00,
    // "discount":30,

    // Prix précédent
    const prevPriceElement = document.querySelector('.prev-price');
    if (prevPriceElement && product.previousPrice) {
        prevPriceElement.style.display = '';
        prevPriceElement.textContent = `MAD ${product.previousPrice.toFixed(2)}`;
    } else if (prevPriceElement) {
        prevPriceElement.style.display = 'none';
    }

    // Réduction
    const discountElement = document.querySelector('.discount');
    if (discountElement && product.discount) {
        discountElement.style.display = '';
        discountElement.textContent = `${product.discount}%`;
    } else if (discountElement) {
        discountElement.style.display = 'none';
    }

    // Gestion du stock et des autres informations de manière indépendante
    const stockElements = {
        '.stock-text': product.stock,
        '.catégorie .stock-text': product.category,
        '.etat .stock-text': product.state
    };

    for (const [selector, value] of Object.entries(stockElements)) {
        const element = document.querySelector(selector);
        if (!element) continue;

        const container = element.closest('.product-info-item');
        
        if (value === undefined || value === null || value === '') {
            if (container) {
                container.style.display = 'none';
            } else {
                element.style.display = 'none';
            }
        } else {
            if (container) {
                container.style.display = '';
            }
            element.style.display = '';
            element.textContent = value;
        }
    }

}

function initializeButtons(product) {
    // Bouton Commander
    const commanderBtn = document.querySelector('.add-to-cart');
    if (commanderBtn) {
        commanderBtn.addEventListener('click', () => {
            const phoneNumber = '212721311213';
            
            // Construction de l'URL de l'image
            let imageUrl = '';
            if (product.images?.length > 0) {
                imageUrl = product.images[0].startsWith('http') 
                    ? product.images[0] 
                    : window.location.origin + product.images[0];
            }

            // Construction du message
            const message = [
                "Bonjour, je souhaite commander ce produit :",
                "",
                `*Nom :* ${product.name}`,
                `*Lien :* ${window.location.href}`,
                "",
                "Voici l'image du produit :",
                imageUrl // WhatsApp générera automatiquement un aperçu
            ].filter(line => line !== '').join('\n');

            // Encodage URL
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank');
        });
    }
}

// Configuration de la galerie d'images
function setupImageGallery(product) {
    const mainMedia = document.querySelector('.main-media');
    const thumbnailsContainer = document.querySelector('.thumbnails');
    
    if (!product.images || product.images.length === 0) {
        if (mainMedia) mainMedia.style.display = 'none';
        if (thumbnailsContainer) thumbnailsContainer.style.display = 'none';
        return;
    }

    thumbnailsContainer.innerHTML = '';

    // Charger les images
    product.images.forEach((imageUrl, index) => {
        if (!imageUrl) return;

        // Créer les miniatures
        const thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'thumbnail-container';
        
        const thumbnail = document.createElement('img');
        thumbnail.src = imageUrl;
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.alt = `Thumbnail ${index + 1}`;
        
        thumbnailDiv.appendChild(thumbnail);
        thumbnailsContainer.appendChild(thumbnailDiv);

        // Événement de clic sur la miniature
        thumbnail.addEventListener('click', () => {
            mainMedia.src = imageUrl;
            currentImageIndex = index;
            updateThumbnailsActive(index);
            updateLightboxImage(index);
        });
    });

    // Ajouter la miniature vidéo si elle existe
    if (product.video) {
        addVideoThumbnail(product.video, thumbnailsContainer);
    }

    // Définir l'image principale initiale
    if (product.images[0]) {
        mainMedia.src = product.images[0];
        mainMedia.style.display = '';
        mainMedia.addEventListener('', openLightbox);
    }
}

// Ajout de la miniature vidéo
function addVideoThumbnail(videoUrl, container) {
    if (!videoUrl || !container) return;

    const videoThumbDiv = document.createElement('div');
    videoThumbDiv.className = 'thumbnail-container';
    
    const videoThumb = document.createElement('video');
    videoThumb.className = 'thumbnail';
    videoThumb.muted = true;
    
    const source = document.createElement('source');
    source.src = videoUrl;
    source.type = 'video/mp4';
    
    const playIcon = document.createElement('div');
    playIcon.className = 'play-icon';
    playIcon.textContent = '▶';
    
    videoThumb.appendChild(source);
    videoThumbDiv.appendChild(videoThumb);
    videoThumbDiv.appendChild(playIcon);
    container.appendChild(videoThumbDiv);

    videoThumbDiv.addEventListener('click', () => {
        const mainVideo = document.querySelector('.main-video');
        if (mainVideo) {
            mainVideo.style.display = 'block';
            const mainMedia = document.querySelector('.main-media');
            if (mainMedia) mainMedia.style.display = 'none';
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            videoThumb.classList.add('active');
        }
    });
}

// Configuration de la lightbox
function setupLightbox(product) {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox || !product.images || product.images.length === 0) return;

    const mainImg = lightbox.querySelector('.main-img');
    if (!mainImg) return;
    
    // Réinitialiser la lightbox
    mainImg.innerHTML = `
        <span class="icon-prev">
            <svg width="12" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 1 3 9l8 8" stroke="#1D2026" stroke-width="3" fill="none" fill-rule="evenodd"/>
            </svg>
        </span>
        <span class="icon-next">
            <svg width="13" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="m2 1 8 8-8 8" stroke="#1D2026" stroke-width="3" fill="none" fill-rule="evenodd"/>
            </svg>
        </span>
    `;

    // Charger les images dans la lightbox
    product.images.forEach((imageUrl, index) => {
        if (!imageUrl) return;

        const img = document.createElement('img');
        img.src = imageUrl;
        img.className = index === 0 ? 'active' : '';
        img.alt = 'product-img';
        mainImg.appendChild(img);
    });

    // Ajouter la vidéo si elle existe
    if (product.video) {
        const video = document.createElement('video');
        video.className = 'main-video';
        video.style.display = 'none';
        video.controls = true;
        
        const source = document.createElement('source');
        source.src = product.video;
        source.type = 'video/mp4';
        
        video.appendChild(source);
        mainImg.appendChild(video);
    }

    // Événements de navigation
    const prevBtn = mainImg.querySelector('.icon-prev');
    const nextBtn = mainImg.querySelector('.icon-next');
    if (prevBtn) prevBtn.addEventListener('click', navigatePrevious);
    if (nextBtn) nextBtn.addEventListener('click', navigateNext);

    // Fermeture de la lightbox
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Navigation dans la lightbox
function navigatePrevious() {
    const images = document.querySelectorAll('.lightbox .main-img img');
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateLightboxImage(currentImageIndex);
    updateThumbnailsActive(currentImageIndex);
}

function navigateNext() {
    const images = document.querySelectorAll('.lightbox .main-img img');
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateLightboxImage(currentImageIndex);
    updateThumbnailsActive(currentImageIndex);
}

// Mise à jour des images
function updateLightboxImage(index) {
    const images = document.querySelectorAll('.lightbox .main-img img');
    const video = document.querySelector('.lightbox .main-video');
    
    images.forEach(img => img.classList.remove('active'));
    if (video) video.style.display = 'none';
    
    if (index < images.length) {
        images[index].classList.add('active');
    } else if (video) {
        video.style.display = 'block';
    }
}

function updateThumbnailsActive(index) {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    if (thumbnails[index]) {
        thumbnails[index].classList.add('active');
    }
}

// Fonctions de la lightbox
function openLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.style.display = 'flex';
        isLightboxOpen = true;
    }
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
        isLightboxOpen = false;
    }
}




// Fonction pour récupérer le panier depuis localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Fonction pour sauvegarder le panier dans localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Fonction pour mettre à jour l'affichage du compteur du panier
function updateCartCount() {
    const cart = getCart();
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
        cartCountElement.style.display = cart.length > 0 ? 'inline' : 'none';
    }
}

// Fonction pour ajouter un produit au panier
function addToCart(product) {
    let cart = getCart();
    
    // Vérifier si le produit est déjà dans le panier
    let existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        existingProduct.quantity += 1; // Augmenter la quantité
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    updateCartCount();
}

// Initialisation des boutons "Ajouter au panier"
function setupCartButtons() {
    document.querySelectorAll('.cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.target.closest('.product').dataset.id);
            const product = productsData.products.find(p => p.id === productId);
            
            if (product) {
                addToCart(product);
            }
        });
    });
}

// Appelle cette fonction après le chargement des produits
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount(); // Mettre à jour le compteur du panier
    setupCartButtons(); // Activer les boutons d'ajout au panier
});













// Navigation au clavier
document.addEventListener('keydown', (e) => {
    if (isLightboxOpen) {
        switch(e.key) {
            case 'ArrowLeft':
                navigatePrevious();
                break;
            case 'ArrowRight':
                navigateNext();
                break;
            case 'Escape':
                closeLightbox();
                break;
        }
    }
});

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', initializeProductPage);





class ProductManager {
    // ... autres méthodes existantes ...

    initializeLightbox() {
        const mainContainer = document.getElementById('mediaContainer');
        const lightbox = document.querySelector('.lightbox');
        const lightboxMainImg = lightbox.querySelector('.main-img');
        
        // Initialiser la lightbox avec les images du produit actuel
        this.updateLightboxGallery();

        // Gestionnaires d'événements pour la navigation
        const prevBtn = lightbox.querySelector('.icon-prev');
        const nextBtn = lightbox.querySelector('.icon-next');
        
        prevBtn.addEventListener('click', () => this.navigateLightbox('prev'));
        nextBtn.addEventListener('click', () => this.navigateLightbox('next'));

        // Ouvrir la lightbox au clic sur l'image principale
        mainContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                this.openLightbox(Array.from(mainContainer.querySelectorAll('img')).indexOf(e.target));
            }
        });

        // Fermer la lightbox
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeLightbox();
        });
    }

    updateLightboxGallery() {
        const lightboxMainImg = document.querySelector('.lightbox .main-img');
        lightboxMainImg.innerHTML = `
            <span class="icon-prev">
                <svg width="12" height="18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 1 3 9l8 8" stroke="#1D2026" stroke-width="3" fill="none" fill-rule="evenodd"/>
                </svg>
            </span>
            <span class="icon-next">
                <svg width="13" height="18" xmlns="http://www.w3.org/2000/svg">
                    <path d="m2 1 8 8-8 8" stroke="#1D2026" stroke-width="3" fill="none" fill-rule="evenodd"/>
                </svg>
            </span>
            ${this.currentProduct.images.map((src, index) => `
                <img 
                    src="${src}" 
                    alt="${this.currentProduct.name}" 
                    class="${index === 0 ? 'active' : ''}"
                />
            `).join('')}
            ${this.currentProduct.video ? `
                <video class="main-video" style="display: none;" controls>
                    <source src="${this.currentProduct.video}" type="video/mp4">
                    Votre navigateur ne supporte pas la lecture vidéo.
                </video>
            ` : ''}
        `;
    }

    openLightbox(index) {
        const lightbox = document.querySelector('.lightbox');
        lightbox.classList.add('active');
        this.showLightboxImage(index);
        document.body.style.overflow = 'hidden'; // Empêcher le défilement
    }

    closeLightbox() {
        const lightbox = document.querySelector('.lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Réactiver le défilement
    }

    showLightboxImage(index) {
        const images = document.querySelectorAll('.lightbox .main-img img');
        images.forEach(img => img.classList.remove('active'));
        images[index]?.classList.add('active');
        this.currentLightboxIndex = index;
    }

    navigateLightbox(direction) {
        const images = document.querySelectorAll('.lightbox .main-img img');
        let newIndex = this.currentLightboxIndex;

        if (direction === 'next') {
            newIndex = (newIndex + 1) % images.length;
        } else {
            newIndex = (newIndex - 1 + images.length) % images.length;
        }

        this.showLightboxImage(newIndex);
    }

    updateGallery() {
        // ... code existant de updateGallery ...

        // Ajouter l'initialisation de la lightbox
        this.initializeLightbox();
    }

    
    
    

    
}

// Initialisation


function RelatedProducts() {
    fetch('/assets/data/products.json')
        .then(response => response.json())
        .then(data => {
            const carousel = document.getElementById('product-carousel');
            carousel.innerHTML = ''; // Nettoyer le carrousel avant d'ajouter les produits

            // Récupérer l'ID du produit actuel depuis l'URL
            const urlParams = new URLSearchParams(window.location.search);
            const productId = parseInt(urlParams.get('id'), 10);

            // Trouver le produit actuel pour connaître sa catégorie
            const currentProduct = data.products.find(product => product.id === productId);
            if (!currentProduct) return;

            const currentCategory = currentProduct.category;

            // Filtrer les produits de la même catégorie (exclure le produit actuel)
            const relatedProducts = data.products.filter(product =>
                product.category === currentCategory && product.id !== productId
            );

            // Ajouter les produits filtrés au carrousel
            relatedProducts.forEach(product => {
                const productHTML = `
                    <div class="carousel-cell">
                        <li class="${product.category}">
                            <div class="product-card">
                                <a href="/assets/html/productdetail.html?id=${product.id}" class="card-banner img-holder has-before" style="--width: 300; --height: 300;">
                                    <img src="${product.images[0]}" width="300" height="300" loading="lazy" alt="${product.name}" class="img-cover">
                                    <ul class="card-action-list">
                                        <li><button class="card-action-btn" aria-label="add to cart" title="add to cart"><ion-icon name="add-outline" aria-hidden="true"></ion-icon></button></li>
                                        <li><button class="card-action-btn" aria-label="buy now" title="buy now"><ion-icon name="bag-handle-outline" aria-hidden="true"></ion-icon></button></li>
                                        <li><button class="card-action-btn" aria-label="add to wishlist" title="add to wishlist"><ion-icon name="heart-outline" aria-hidden="true"></ion-icon></button></li>
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

            // Initialiser Flickity après avoir ajouté les produits
            if (relatedProducts.length > 0) {
                new Flickity(carousel, {
                    wrapAround: true,
                    autoPlay: true,
                    prevNextButtons: true,
                    pageDots: false
                });
            }
        })
        .catch(error => console.error('Erreur lors du chargement des produits:', error));
}

// Exécuter la fonction lorsque la page est chargée
document.addEventListener('DOMContentLoaded', RelatedProducts);
