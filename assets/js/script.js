'use strict';



/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);







/**
 * header & back top btn active when window scroll down to 100px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const showElemOnScroll = function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", showElemOnScroll);

backTopBtn.addEventListener('click', function(e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});



/**
 * product filter
 */

const filterBtns = document.querySelectorAll("[data-filter-btn]");
const filterBox = document.querySelector("[data-filter]");

let lastClickedFilterBtn = filterBtns[0];

const filter = function () {
  lastClickedFilterBtn.classList.remove("active");
  this.classList.add("active");
  lastClickedFilterBtn = this;

  filterBox.setAttribute("data-filter", this.dataset.filterBtn)
}

addEventOnElem(filterBtns, "click", filter);


document.addEventListener("DOMContentLoaded", () => {
  const ease = "power4.inOut";

  document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (event) => {
  event.preventDefault();
  const href = link.getAttribute("href");

  if (href && !href.startsWith("#") && href !== window.location.pathname) {
    animateTransition().then(() => {
    window. location.href = href;

      });
    }
  });
});

revealTransition() .then(() =>{
  gsap.set(".block", { visibility: "hidden" });
});

function revealTransition() {

  return new Promise((resolve) => {
  
  gsap.set(".block",{ scaleY: 1 }) ;
  gsap.to(".block",{
  scaleY: 0,
  duration: 1,
  stagger: {
  each: 0.1,
  from: "start",
  grid: "auto",
  axis: "x",
}, 
  ease: ease,
  onComplete: resolve,
});
});
}

function animateTransition() {
  return new Promise((resolve) => {
  gsap.set(".block", { visibility: "visible", scaleY: 0 });
  gsap.to(".block",{
  scaleY: 1,
  duration: 1,
  stagger: {
  each: 0.1,
  from: "start",
  grid: [2, 5],
  axis: "x",
  },
  ease: ease,
  onComplete: resolve,
});
});
}
});


let slider = document.querySelector('.slider .list');
let items = document.querySelectorAll('.slider .list .item');
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let dots = document.querySelectorAll('.slider .dots li');

let lengthItems = items.length - 1;
let active = 0;
next.onclick = function(){
    active = active + 1 <= lengthItems ? active + 1 : 0;
    reloadSlider();
}
prev.onclick = function(){
    active = active - 1 >= 0 ? active - 1 : lengthItems;
    reloadSlider();
}
let refreshInterval = setInterval(()=> {next.click()}, 3000);
function reloadSlider(){
    slider.style.left = -items[active].offsetLeft + 'px';
    // 
    let last_active_dot = document.querySelector('.slider .dots li.active');
    last_active_dot.classList.remove('active');
    dots[active].classList.add('active');

    clearInterval(refreshInterval);
    refreshInterval = setInterval(()=> {next.click()}, 3000);

    
}

dots.forEach((li, key) => {
    li.addEventListener('click', ()=>{
         active = key;
         reloadSlider();
    })
})
window.onresize = function(event) {
    reloadSlider();
};

const cart = document.querySelector("[data-cart]");
const cartLinks = document.querySelectorAll("[data-cart-link]");
const cartTogglers = document.querySelectorAll("[data-cart-toggler]");

const toggleCart = function () {
  cart.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("active");
}

addEventOnElem(cartTogglers, "click", toggleCart);

const closeCart = function () {
  cart.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("active");
}

addEventOnElem(cartLinks, "click", closeCart);





// ... code existant ...

const cartItems = []; // Tableau pour stocker les articles du panier

const addToCart = function (product) {
    cartItems.push(product); // Ajoute le produit au tableau
    updateCartDisplay(); // Met à jour l'affichage du panier
}

const updateCartDisplay = function () {
    const cartWrapper = cart.querySelector('.wrapper'); // Sélectionnez le conteneur du panier
    cartWrapper.innerHTML = ''; // Réinitialise le contenu

    cartItems.forEach(item => {
        const itemHTML = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" />
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Qty: ${item.quantity}</p>
                    <p>Price: $${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.name}')">×</button>
            </div>
        `;
        cartWrapper.innerHTML += itemHTML; // Ajoute chaque article au panier
    });

    // Met à jour le sous-total
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    cartWrapper.innerHTML += `<div class="cart-subtotal">Subtotal: $${subtotal.toFixed(2)}</div>`;
}

const removeFromCart = function (itemName) {
    const index = cartItems.findIndex(item => item.name === itemName);
    if (index > -1) {
        cartItems.splice(index, 1); // Retire l'article du tableau
        updateCartDisplay(); // Met à jour l'affichage du panier
    }
}

// Ajoutez un gestionnaire d'événements pour les boutons "Ajouter au panier"
const addToCartButtons = document.querySelectorAll('.card-action-btn[aria-label="add to cart"]');
addToCartButtons.forEach(button => {
    button.addEventListener('click', function () {
        const productCard = button.closest('.product-card');
        const product = {
            name: productCard.querySelector('.card-title').innerText,
            price: parseFloat(productCard.querySelector('.price').getAttribute('value')),
            image: productCard.querySelector('img').src,
            quantity: 1 // Vous pouvez ajuster la quantité selon vos besoins
        };
        addToCart(product); // Appelle la fonction pour ajouter au panier
        toggleCart(); // Ouvre le panier
    });
});




// Media Gallery Functionality
const mediaContainer = document.getElementById('mediaContainer');
const thumbnailContainers = document.querySelectorAll('.thumbnail-container');

// Handle thumbnail clicks
thumbnailContainers.forEach(container => {
    container.addEventListener('click', () => {
        // Remove active class from all thumbnails
        thumbnailContainers.forEach(c => c.querySelector('.thumbnail').classList.remove('active'));
        
        // Get clicked media element
        const media = container.querySelector('.thumbnail');
        media.classList.add('active');

        // Clear media container
        mediaContainer.innerHTML = '';

        if(media.tagName === 'VIDEO') {
            // Clone video element and add controls
            const videoClone = media.cloneNode(true);
            videoClone.classList.add('main-media', 'main-video');
            videoClone.controls = true;
            videoClone.muted = false;
            mediaContainer.appendChild(videoClone);
            videoClone.play();
        } else {
            // Create new image element
            const img = document.createElement('img');
            img.src = media.src;
            img.classList.add('main-media');
            img.alt = media.alt;
            mediaContainer.appendChild(img);
        }
    });
});

// Video thumbnail hover effects
document.querySelectorAll('video.thumbnail').forEach(video => {
    video.addEventListener('mouseenter', () => {
        video.play();
    });

    video.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
    });
});





