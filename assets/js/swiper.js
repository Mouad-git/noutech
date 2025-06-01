// Initialisation de Swiper
var mySwiper = new Swiper(".swiper-container", {
  direction: "horizontal",
  loop: true,
  speed: 1000,
  grabCursor: true,
  autoplay: {
    delay: 2000,
  },

  // Pagination
  pagination: {
    el: ".swiper-pagination",
    type: "bullets",
    clickable: true
  },

  // Navigation
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },

  // Désactiver le scroll pour changer de slide
  mousewheel: false,

  on: {
    slideChangeTransitionStart: function () {
      var swiper = this;
      setTimeout(function () {
        var currentTitle = $(swiper.slides[swiper.activeIndex]).attr("data-title");
        var currentThumb = $(swiper.slides[swiper.activeIndex]).attr("data-thumb");
        var currentThumbTitle = $(swiper.slides[swiper.activeIndex]).attr("data-thumbtitle");
        var currentSubtitle = $(swiper.slides[swiper.activeIndex]).attr("data-subtitle");
      }, 500);
      
      gsap.to($(".current-title"), 0.4, { autoAlpha: 0, y: -40, ease: Power1.easeIn });
      gsap.to($(".current-thumb"), 0.3, { autoAlpha: 1, x: "-100%", ease: Power1.easeIn });
      gsap.to($(".thumb-title"), 0.2, { autoAlpha: 0, y: -40, ease: Power1.easeIn });
      gsap.to($(".current-subtitle"), 0.4, { autoAlpha: 0, y: -40, delay: 0.15, ease: Power1.easeIn });
    },

    slideChangeTransitionEnd: function () {
      var swiper = this;
      var currentTitle = $(swiper.slides[swiper.activeIndex]).attr("data-title");
      var currentThumb = $(swiper.slides[swiper.activeIndex]).attr("data-thumb");
      var currentThumbtitle = $(swiper.slides[swiper.activeIndex]).attr("data-thumbtitle");
      var currentSubtitle = $(swiper.slides[swiper.activeIndex]).attr("data-subtitle");

      $(".slide-captions").html(function () {
        return `<h2 class='current-title'>${currentTitle}</h2><h3 class='current-subtitle'>${currentSubtitle}</h3>`;
      });

      $(".slide-thumb").html(function () {
        return `<img class="current-thumb" src="${currentThumb}"/><h3 class="thumb-title">${currentThumbtitle}</h3>`;
      });

      gsap.from($(".current-title"), 0.4, { autoAlpha: 0, y: 40, ease: Power1.easeOut });
      gsap.from($(".current-thumb"), 0.3, { autoAlpha: 0, x: "100%", ease: Power1.easeOut });
      gsap.from($(".thumb-title"), 0.35, { autoAlpha: 0, y: 40, delay: 0.35, ease: Power1.easeOut });
      gsap.from($(".current-subtitle"), 0.4, { autoAlpha: 0, y: 40, delay: 0.15, ease: Power1.easeOut });
    }
  }
});

// Désactiver le changement de slide avec la molette et permettre un scroll normal sur la page
window.addEventListener("wheel", function (event) {
  event.stopPropagation(); // Empêche Swiper d'intercepter l'événement
}, { passive: false });
