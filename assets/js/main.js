(function ($) {
  "use strict";

  // Initialize Lenis Smooth Scroll
  let lenis;
  
  function initLenis() {
    if (typeof Lenis !== 'undefined') {
      try {
        lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 1.0,
          touchMultiplier: 1.5,
          infinite: false,
        });

        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Integrate Lenis scroll with AOS animation library
        lenis.on('scroll', () => {
          AOS.refresh();
        });

        console.log('Lenis Smooth Scroll initialized successfully');
      } catch (error) {
        console.error('Error initializing Lenis:', error);
        lenis = null;
      }
    }
  }

  // Wait for DOM to be ready
  $(document).ready(function() {
    initLenis();
    
    // Initialize after DOM is ready
    initializePageFeatures();
  });

  function initializePageFeatures() {
    var $window = $(window);
    /*----------------------------------
# header sticky 
    -----------------------------------*/
    $.fn.elExists = function () {
      return this.length > 0;
    };

    var activeSticky = $("#sticky-header"),
      $winDow = $($window);

    // Handle sticky header scroll
    function handleScroll() {
      var scroll = $(window).scrollTop();

      if (scroll < 1) {
        activeSticky.removeClass("is-sticky");
      } else {
        activeSticky.addClass("is-sticky");
      }
    }

    // Listen to scroll event
    $(window).on("scroll", function () {
      handleScroll();
    });

    if ($(".testimonial").elExists()) {
      const testimonialCarousel = new Swiper(".testimonial .swiper", {
        pagination: false,
        breakpoints: {
          576: {
            slidesPerView: 2,
            spaceBetween: 45,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1200: {
            slidesPerView: 3,
            spaceBetween: 45,
          },
        },
      });
    }

    if ($(".brandCarousel").elExists()) {
      const brandCarousel = new Swiper(".brandCarousel .swiper", {
        pagination: false,
        spaceBetween: 24,
        loop: true,
        speed: 2000,
        autoplay: {
          delay: 2000,
        },
        breakpoints: {
          0: {
            slidesPerView: 1
          },
          480: {
            slidesPerView: 2
          },
          768: {
            slidesPerView: 3,
          },
          992: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 6
          },
        },
      });
    }

    if ($(".play-button").elExists()) {
    $(".play-button").magnificPopup({
      disableOn: 700,
      type: "iframe",
      mainClass: "mfp-fade",
      removalDelay: 160,
      preloader: true,
      fixedContentPos: true,
    });
  }




  if ($(".counter").elExists()) {
    const counterUp = window.counterUp.default

    const callback = entries => {
      entries.forEach(entry => {
        const el = entry.target
        if (entry.isIntersecting && !el.classList.contains('is-visible')) {
          counterUp(el, {
            duration: 3000,
            delay: 15,
          })
          el.classList.add('is-visible')
        }
      })
    }

    const IO = new IntersectionObserver(callback, { threshold: 1 })

    const el = document.querySelector('.counter')
    IO.observe(el)
  }



  // You can also pass an optional settings object
  // below listed default settings
    AOS.init({
    // Global settings:
    disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
    initClassName: 'aos-init', // class applied after initialization
    animatedClassName: 'aos-animate', // class applied on animation
    useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
    disableMutationObserver: false, // disables automatic mutations' detections (advanced)
    debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)


    // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    offset: 120, // offset (in px) from the original trigger point
    delay: 100, // values from 0 to 3000, with step 50ms
    duration: 600, // values from 0 to 3000, with step 50ms
    easing: 'ease', // default easing for AOS animations
    once: true, // whether animation should happen only once - while scrolling down
    mirror: false, // whether elements should animate out while scrolling past them
    anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation

    });
    /*---------------------------------
          Scroll Up
    -----------------------------------*/
    function scrollToTop() {
      var $scrollUp = $("#scrollUp"),
        $lastScrollTop = 0;

      function updateScrollUpButton() {
        var scrollPosition = $(window).scrollTop();

        if (scrollPosition > $lastScrollTop) {
          $scrollUp.css({ bottom: "-60px" });
        } else {
          if (scrollPosition > 200) {
            $scrollUp.css({ bottom: "60px" });
          } else {
            $scrollUp.css({ bottom: "-60px" });
          }
        }
        $lastScrollTop = scrollPosition;
      }

      // Listen to scroll event
      $(window).on("scroll", function () {
        updateScrollUpButton();
      });

      // Smooth scroll to top
      $scrollUp.on("click", function (evt) {
        evt.preventDefault();
        if (typeof lenis !== 'undefined' && lenis) {
          lenis.scrollTo(0, { duration: 1200 });
        } else {
          $("html, body").animate({ scrollTop: 0 }, 1000);
        }
      });
    }
    scrollToTop();

  }

})(jQuery);


// Contact form JS
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contact-form");
  const formMessage = document.querySelector(".form-message");

  if (!contactForm) {
    return;
  }

  if (typeof emailjs === "undefined") {
    if (formMessage) {
      formMessage.classList.add("error", "text-danger", "mt-3");
      formMessage.textContent = "Email service failed to load. Please refresh and try again.";
    }
    return;
  }

  emailjs.init({
    publicKey: "srGoCYrUAyz4ieO3w",
  });

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    if (formMessage) {
      formMessage.classList.remove("error", "text-danger", "success", "text-success");
      formMessage.classList.add("mt-3");
      formMessage.textContent = "Sending...";
    }

    emailjs.sendForm("service_l17w14j", "template_d21b2cv", contactForm)
      .then(function () {
        if (formMessage) {
          formMessage.classList.remove("error", "text-danger");
          formMessage.classList.add("success", "text-success", "mt-3");
          formMessage.textContent = "Message sent successfully!";
        }
        contactForm.reset();
      })
      .catch(function (error) {
        console.log(error);
        if (formMessage) {
          formMessage.classList.remove("success", "text-success");
          formMessage.classList.add("error", "text-danger", "mt-3");
          formMessage.textContent = "Failed to send message. Please try again.";
        }
      });
  });
});
