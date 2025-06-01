document.addEventListener("DOMContentLoaded", function () {
    const cartBtn = document.querySelector("[data-cart-toggler]");
    const cartSidebar = document.querySelector("[data-cart-sidebar]");
    const cartOverlay = document.querySelector("[data-cart-overlay]");
    const closeCartBtn = cartSidebar.querySelector(".nav-close-btn");
  
    function toggleCart() {
      cartSidebar.classList.toggle("active");
      cartOverlay.classList.toggle("active");
    }
  
    cartBtn.addEventListener("click", toggleCart);
    closeCartBtn.addEventListener("click", toggleCart);
    cartOverlay.addEventListener("click", toggleCart);
  });






  