window.theme = window.theme || {};

/* ==============================
  UTILITIES
  ============================== */

theme.utils = {

  // _.compact from lodash
  // Creates an array with all falsey values removed. The values `false`, `null`,
  // `0`, `""`, `undefined`, and `NaN` are falsey.
  // _.compact([0, 1, false, 2, '', 3]);
  // => [1, 2, 3]

  compact: function(array) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;

  }

};

Shopify.Theme = {

  selectors: {

    productForm: '.product-form',

  },

  sections: {

    sectionName: {

      _init: function() {

        // Custom private section method

        var section = this.container;

        console.log(section);

      },

      // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
      onLoad: function() {

        this._init();

      }

    }

  },

  functions: {

    fadeOut: function( elem, ms ) {
      if( ! elem )
        return;

      if( ms )
      {
        var opacity = 1;
        var timer = setInterval( function() {
          opacity -= 50 / ms;
          if( opacity <= 0 )
          {
            clearInterval(timer);
            opacity = 0;
            elem.style.display = "none";
            elem.style.visibility = "hidden";
          }
          elem.style.opacity = opacity;
          elem.style.filter = "alpha(opacity=" + opacity * 100 + ")";
        }, 50 );
      }
      else
      {
        elem.style.opacity = 0;
        elem.style.filter = "alpha(opacity=0)";
        elem.style.display = "none";
        elem.style.visibility = "hidden";
      }
    }

  },

  components: {

    tooltips: function(){

      tippy("[data-tippy-content]", {
        theme: "kooshoo--dark",
        placement: "bottom"
      });

    },

    interstitial: function() {



    },

    accordions: function(container) {

      if (typeof container == "undefined") {
        container = document;
      }

      var accordions = container.querySelectorAll('[data-accordion]');

      accordions.forEach(element => {

        var accordion = element;
        var accordionHeader = element.querySelector(".accordion__header");

        accordionHeader.addEventListener("click", function(event){

          var expanded = accordion.classList.contains("accordion--expanded");

          if (expanded == true) {
            accordion.classList.add("accordion--collapsed");
            accordion.classList.remove("accordion--expanded");
          }
          else {
            accordion.classList.add("accordion--expanded");
            accordion.classList.remove("accordion--collapsed");
          }

        });

      });

    }

  }

};

/* ==============================

  SECTIONS

  1.1. Global
  1.2. Home Page
  1.3. Collection
  1.4. Product
  1.5. Cart
  1.6. Blog
  1.7. Article
  1.8. Pages
  1.9. Search
  1.10. Misc. Sections
  1.11. Account
  1.12. Other

  ============================== */


/* ---- 1. Global ----- */



/* ---- 2. Home Page ----- */



/* ---- 3. Collection ----- */



/* ---- 4. Product ----- */



/* ---- 5. Cart ----- */



/* ---- 6. Blog ----- */



/* ---- 7. Article ----- */



/* ---- 8. Pages ----- */



/* ---- 9. Search ----- */



/* ---- 10. Misc. Sections ----- */



/* ---- 11. Account ----- */


/*  ==============================
    COMPONENTS
    ============================== */

// Shopify.Theme.components.tooltips();
Shopify.Theme.components.accordions();
Shopify.Theme.components.interstitial();

window.addEventListener('beforeunload', (event) => {

  var interstitial = document.querySelector(".loading-interstitial");

  // Cancel the event as stated by the standard.
  event.preventDefault();

  // Chrome requires returnValue to be set.
  // event.returnValue = '';

  console.log("unload");
  interstitial.classList.add("loading-interstitial--enter");

});
