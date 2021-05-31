
/*
* @license
* Pipeline Theme (c) Groupthought Themes
*
* This file is included for advanced development by
* Shopify Agencies.  Modified versions of the theme
* code are not supported by Shopify or Groupthought.
*
* In order to use this file you will need to change
* theme.js to theme.dev.js in /layout/theme.liquid
*
*/

(function ($, MicroModal, Rellax, themeCurrency, themeImages, themeProductForm, slickCarousel, Poppy, Sqrl, AOS, themeA11y, themeRte) {
  'use strict';

  window.theme = window.theme || {};

  window.theme.sizes = {
    small: 480,
    medium: 768,
    large: 990,
    widescreen: 1400,
  };

  window.theme.keyboardKeys = {
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    LEFTARROW: 37,
    RIGHTARROW: 39,
  };

  function moveModals(container) {
    const modals = container.querySelectorAll('[data-modal]');
    const modalBin = document.querySelector('[data-modal-container]');
    modals.forEach(element => {
      const alreadyAdded = modalBin.querySelector(`[id="${element.id}"]`);
      if (!alreadyAdded) {
        modalBin.appendChild(element);
      }
    });
  }

  const classes = [
    'neighbor--white',
    'neighbor--light',
    'neighbor--dark',
    'neighbor--black',
  ];

  function moveTags(container) {
    container.querySelectorAll('shopify-section').forEach(element => {
      element.classList.remove(classes);
    });
    container.querySelectorAll('.section:not(.bg--accent)').forEach(element => {
      element.parentElement.classList.add('neighbor--white');
    });
    container.querySelectorAll('.section--light.bg--accent').forEach(element => {
      element.parentElement.classList.add('neighbor--light');
    });
    container.querySelectorAll('.section--dark:not(.bg--accent)').forEach(element => {
      element.parentElement.classList.add('neighbor--dark');
    });
    container.querySelectorAll('.section--dark.bg--accent').forEach(element => {
      element.parentElement.classList.add('neighbor--black');
    });
  }

  function floatLabels(container) {
    const floats = container.querySelectorAll('.float__wrapper');
    floats.forEach(element => {
      const label = element.querySelector('label');
      const input = element.querySelector('input, textarea');
      input.addEventListener('keyup', event => {
        if (event.target.value !== '') {
          label.classList.add('label--float');
        } else {
          label.classList.remove('label--float');
        }
      });
    });
  }

  function readHeights() {
    const h = {};
    h.windowHeight = window.innerHeight;
    h.announcementHeight = getHeight('[data-section-type*="announcement"]');
    h.footerHeight = getHeight('[data-section-type*="footer"]');
    h.menuHeight = getHeight('[data-header-height]');
    h.headerHeight = h.menuHeight + h.announcementHeight;
    h.logoHeight = getFooterLogoWithPadding();
    return h;
  }

  function setVarsOnResize() {
    document.addEventListener(
      'theme:resize',
      resizeVars,
    );
    setVars();
  }

  function setVars() {
    const { windowHeight, announcementHeight, headerHeight, logoHeight, menuHeight, footerHeight } = readHeights();
    document.documentElement.style.setProperty('--full-screen', `${windowHeight}px`);
    document.documentElement.style.setProperty('--three-quarters', `${(windowHeight * (3 / 4))}px`);
    document.documentElement.style.setProperty('--two-thirds', `${(windowHeight * (2 / 3))}px`);
    document.documentElement.style.setProperty('--one-half', `${(windowHeight / 2)}px`);
    document.documentElement.style.setProperty('--one-third', `${(windowHeight / 3)}px`);
    document.documentElement.style.setProperty('--one-fifth', `${(windowHeight / 5)}px`);

    document.documentElement.style.setProperty('--menu-height', `${menuHeight}px`);
    document.documentElement.style.setProperty('--announcement-height', `${announcementHeight}px`);
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);

    document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
    document.documentElement.style.setProperty('--content-full', `${(windowHeight - headerHeight - (logoHeight / 2))}px`);
    document.documentElement.style.setProperty('--content-min', `${(windowHeight - headerHeight - footerHeight)}px`);
  }

  function resizeVars() {
    // restrict the heights that are changed on resize to avoid iOS jump when URL bar is shown and hidden
    const { windowHeight, announcementHeight, headerHeight, logoHeight, menuHeight, footerHeight } = readHeights();
    document.documentElement.style.setProperty('--menu-height', `${menuHeight}px`);
    document.documentElement.style.setProperty('--announcement-height', `${announcementHeight}px`);
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);

    document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
    document.documentElement.style.setProperty('--content-full', `${(windowHeight - headerHeight - (logoHeight / 2))}px`);
    document.documentElement.style.setProperty('--content-min', `${(windowHeight - headerHeight - footerHeight)}px`);
  }

  function getHeight(selector) {
    const el = document.querySelector(selector);
    if (el) {
      return el.clientHeight;
    } else {
      return 0;
    }
  }

  function getFooterLogoWithPadding() {
    const height = getHeight('[data-footer-logo]');
    if (height > 0) {
      return height + 20;
    } else {
      return 0;
    }
  }

  function singles(frame, wrappers) {
    // sets the height of any frame passed in with the
    // tallest preventOverflowContent as well as any image in that frame
    const padding = 64;
    let tallest = 0;

    wrappers.forEach(wrap => {
      if (wrap.offsetHeight > tallest) {
        tallest = wrap.offsetHeight;
      }
    });
    const images = frame.querySelectorAll('[data-overflow-background]');
    const frames = [
      frame,
      ...images,
    ];
    frames.forEach(el => {
      el.style.setProperty('min-height', `${(tallest + padding)}px`);
    });
  }

  function doubles(section) {
    if (window.innerWidth <= window.theme.sizes.medium) {
      // if we are below the small breakpoint, the double section acts like two independent
      // single frames
      let singleFrames = section.querySelectorAll('[data-overflow-frame]');
      singleFrames.forEach(singleframe => {
        const wrappers = singleframe.querySelectorAll('[data-overflow-content]');
        singles(singleframe, wrappers);
      });
      return;
    }

    const padding = 64;
    let tallest = 0;

    const frames = section.querySelectorAll('[data-overflow-frame]');
    const contentWrappers = section.querySelectorAll('[data-overflow-content]');
    contentWrappers.forEach(content => {
      if (content.offsetHeight > tallest) {
        tallest = content.offsetHeight;
      }
    });
    const images = section.querySelectorAll('[data-overflow-background]');
    let applySizes = [
      section,
      ...frames,
      ...images,
    ];
    applySizes.forEach(el => {
      el.style.setProperty('min-height', `${(tallest + padding)}px`);
    });
  }


  function preventOverflow(container) {
    const singleFrames = container.querySelectorAll('.preventOverflow');
    if (singleFrames) {
      singleFrames.forEach(frame => {
        const wrappers = frame.querySelectorAll('.preventOverflowContent');
        singles(frame, wrappers);
        document.addEventListener('theme:resize', () => {
          singles(frame, wrappers);
        });
      });
    }

    const doubleSections = container.querySelectorAll('[data-overflow-wrapper]');
    if (doubleSections) {
      doubleSections.forEach(section => {
        doubles(section);
        document.addEventListener('theme:resize', () => {
          doubles(section);
        });
      });
    }
  }

  function debounce(fn, time) {
    let timeout;
    return function() {
      // eslint-disable-next-line prefer-rest-params
      const functionCall = () => fn.apply(this, arguments);
      clearTimeout(timeout);
      timeout = setTimeout(functionCall, time);
    };
  }

  function dispatch() {
    document.dispatchEvent(new CustomEvent('theme:resize', {
      bubbles: true,
    }));
  }

  function resizeListener() {
    window.addEventListener(
      'resize',
      debounce(function() {
        dispatch();
      }, 50),
    );
  }

  let prev = window.pageYOffset;
  let up = null;
  let down = null;
  let wasUp = null;
  let wasDown = null;

  function dispatch$1() {
    const position = window.pageYOffset;
    if (position > prev) {
      down = true;
      up = false;
    } else if (position < prev) {
      down = false;
      up = true;
    } else {
      up = null;
      down = null;
    }
    prev = position;
    document.dispatchEvent(new CustomEvent('theme:scroll', {
      detail: {
        up,
        down,
        position,
      },
      bubbles: false,
    }));
    if (up && !wasUp) {
      document.dispatchEvent(new CustomEvent('theme:scroll:up', {
        detail: {position},
        bubbles: false,
      }));
    }
    if (down && !wasDown) {
      document.dispatchEvent(new CustomEvent('theme:scroll:down', {
        detail: {position},
        bubbles: false,
      }));
    }
    wasDown = down;
    wasUp = up;
  }

  function lock() {
    document.body.style = 'overflow-y:hidden; position: relative;';
  }
  function unlock() {
    document.body.style = 'overflow-y:visible; position: static;';
  }


  function scrollListener() {
    let timeout;
    window.addEventListener('scroll', function() {
      if (timeout) { window.cancelAnimationFrame(timeout); }
      timeout = window.requestAnimationFrame(function() {
        dispatch$1();
      });
    }, {passive: true});

    window.addEventListener('theme:scroll:lock', lock);
    window.addEventListener('theme:scroll:unlock', unlock);
  }

  resizeListener();
  scrollListener();

  window.addEventListener('load', () => {
    setVarsOnResize();
    floatLabels(document);
    moveModals(document);
    moveTags(document);
    preventOverflow(document);
  });

  document.addEventListener('shopify:section:load', (e) => {
    const container = e.target;
    floatLabels(container);
    moveModals(container);
    moveTags(container);
    preventOverflow(container);
  });

  /**
   * Customer Addresses Script
   * ------------------------------------------------------------------------------
   * A file that contains code for the Customer Addresses template.
   *
   * @namespace customerAddresses
   */

  (function() {
    var $newAddressForm = $('#AddAddress');
    if ($newAddressForm.length) {
      customerAddresses();
    }
  })();

  function customerAddresses() {
    // Initialize observers on address selectors, defined in shopify_common.js
    if (Shopify) {
      new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
        hideElement: 'AddressProvinceContainerNew',
      });
    }

    // Initialize each edit form's country/province selector
    $('.address-country-option').each(function() {
      var formId = $(this).data('form-id');
      var countrySelector = 'AddressCountry_' + formId;
      var provinceSelector = 'AddressProvince_' + formId;
      var containerSelector = 'AddressProvinceContainer_' + formId;

      new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
        hideElement: containerSelector,
      });
    });

    // Toggle new/edit address forms
    $('.address-new-toggle').on('click', function() {
      $('#AddAddress').toggleClass('hide');
    });

    $('.address-edit-toggle').on('click', function() {
      var formId = $(this).data('form-id');
      $('#EditAddress_' + formId).toggleClass('hide');
    });

    $('.address-delete').on('click', function() {
      var $el = $(this);
      var formId = $el.data('form-id');
      var confirmMessage = $el.data('confirm-message');
      if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
        Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
      }
    });
  }

  /**
   * Password Template Script
   * ------------------------------------------------------------------------------
   * A file that contains code for the Password template.
   *
   * @namespace password
   */

  (function() {
    var $recoverPasswordForm = $('#RecoverPassword');
    if ($recoverPasswordForm.length) {
      customerLogin();
    }
  })();

  function customerLogin() {
    var config = {
      recoverPasswordForm: '#RecoverPassword',
      hideRecoverPasswordLink: '#HideRecoverPasswordLink',
    };

    checkUrlHash();
    resetPasswordSuccess();

    $(config.recoverPasswordForm).on('click', onShowHidePasswordForm);
    $(config.hideRecoverPasswordLink).on('click', onShowHidePasswordForm);

    function onShowHidePasswordForm(evt) {
      evt.preventDefault();
      toggleRecoverPasswordForm();
    }

    function checkUrlHash() {
      var hash = window.location.hash;

      // Allow deep linking to recover password form
      if (hash === '#recover') {
        toggleRecoverPasswordForm();
      }
    }

    /**
     *  Show/Hide recover password form
     */
    function toggleRecoverPasswordForm() {
      var emailValue = $('#CustomerEmail').val();
      $('#RecoverEmail').val(emailValue);
      $('#RecoverPasswordForm').toggleClass('hide');
      $('#CustomerLoginForm').toggleClass('hide');
    }

    /**
     *  Show reset password success message
     */
    function resetPasswordSuccess() {
      var $formState = $('.reset-password-success');

      // check if reset password form was successfully submited.
      if (!$formState.length) {
        return;
      }

      // show success message
      $('#ResetSuccess').removeClass('hide');
    }
  }

  const loaders = {};

  function loadScript(options = {}) {
    if (options.url) {
      if (loaders[options.url]) {
        return loaders[options.url];
      } else {
        return getScriptWithPromise(options.url);
      }
    } else if (options.json) {
      if (loaders[options.json]) {
        return Promise.resolve(loaders[options.json]);
      } else {
        return window.fetch(options.json).then(response => {
          return response.json();
        }).then((response) => {
          loaders[options.json] = response;
          return response;
        });
      }
    } else if (options.name) {
      const key = ''.concat(options.name, options.version);
      if (loaders[key]) {
        return loaders[key];
      } else {
        return loadShopifyWithPromise(options);
      }
    } else {
      return Promise.reject();
    }
  }

  function getScriptWithPromise(url) {
    const loader = new Promise((resolve, reject) => {
      $.getScript(url)
        .done(function(data) {
          resolve(data);
        })
        .fail(function(error) {
          reject(error);
        });
    });
    loaders[url] = loader;
    return loader;
  }

  function loadShopifyWithPromise(options) {
    const key = ''.concat(options.name, options.version);
    const loader = new Promise((resolve, reject) => {
      try {
        window.Shopify.loadFeatures([{
          name: options.name,
          version: options.version,
          onLoad: (err) => {
            onLoadFromShopify(resolve, reject, err);
          },
        }]);
      } catch (err) {
        reject(err);
      }
    });
    loaders[key] = loader;
    return loader;
  }

  function onLoadFromShopify(resolve, reject, err) {
    if (err) {
      return reject(err);
    } else {
      return resolve();
    }
  }

  function modal(unique) {
    MicroModal.init({
      openTrigger: `data-popup-${unique}`,
      disableScroll: true,
    });
  }

  function galleryZoom(container) {
    const $triggers = $(container).find('[data-image-zoom]');
    $.each($triggers, function(index, trigger) {
      const $trigger = $(trigger);
      const unique = $trigger.attr('data-unique');

      MicroModal.init({
        disableScroll: true,
        openTrigger: `data-popup-${unique}`,
        onShow: (modal) => {
          var $images = $('[data-src]', modal);
          $images.each(function () {
            var $image = $(this);
            if ($image.attr('src') === undefined) {
              $image.attr('src', $image.attr('data-src'));
            }
          });
        },
      });
    });
  }

  function productZoom(container, json) {

    const loadedPromise = loadScript({url: window.theme.assets.photoswipe});
    const returnZoom = loadedPromise.then(() => {

      const PhotoSwipe = window.pipelinePhotoswipe.PhotoSwipe.default;
      const PhotoSwipeUI = window.pipelinePhotoswipe.PhotoSwipeUI.default;

      const triggers = container.querySelectorAll('[data-zoom-button]');
      triggers.forEach((trigger) => {
        trigger.addEventListener('click', (event) => {
          const el = container.querySelector('[data-zoom-wrapper]');
          const dataId = event.target.closest('[data-media-id]').getAttribute('data-media-id').toString();
          const items = [];
          for (let i = 0; i < json.media.length; i++) {
            if (json.media[i].media_type === 'image') {
              items[items.length] = {
                src: json.media[i].src,
                w: json.media[i].width,
                h: json.media[i].height,
                id: json.media[i].id,
              };
            }
          }
          const findImage = (element) => element.id.toString() === dataId;
          const index = items.findIndex(findImage);
          const options = {
            index,
            showHideOpacity: true,
            showAnimationDuration: 150,
            hideAnimationDuration: 250,
            bgOpacity: 1,
            spacing: 0,
            allowPanToNext: false,
            maxSpreadZoom: 3,
            history: false,
            loop: true,
            pinchToClose: false,
            modal: false,
            closeOnScroll: false,
            closeOnVerticalDrag: true,
            getDoubleTapZoom: function getDoubleTapZoom(isMouseClick, item) {
              if (isMouseClick) {
                return 1.67;
              } else {
                return item.initialZoomLevel < 0.7 ? 1 : 1.3;
              }
            },
            getThumbBoundsFn: function getThumbBoundsFn() {
              const imageLocation = container.querySelector('[data-product-slideshow]');
              const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
              const rect = imageLocation.getBoundingClientRect();
              return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
            },
          };
          document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
          // Initializes and opens PhotoSwipe
          const gallery = new PhotoSwipe(el, PhotoSwipeUI, items, options);
          gallery.init();
          gallery.listen('close', function() {
            document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
          });
        });
      });
    }).catch((e) => console.error(e));
    return returnZoom;
  }

  /**
   * Password Page
   * ------------------------------------------------------------------------------
   * Login modal for the password page
   *
   */

  (function() {
    var $toggleLogin = $('.js-toggle-login-modal');
    if ($toggleLogin.length) {
      passwordPage();
    }
  })();

  function passwordPage() {
    modal('password');
    if ($('.storefront-password-form .errors').length) {
      $('.js-toggle-login-modal').click();
    }
  }

  /**
   * Gift Card Template Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the Gift Card template.
   */

  (function() {
    var $qrCode = $('#QrCode');
    if ($qrCode.length) {
      giftcards();
    }
  })();

  function giftcards() {
    var config = {
      qrCode: '#QrCode',
      printButton: '#PrintGiftCard',
      giftCardCode: '.giftcard__code',
    };

    var $qrCode = $(config.qrCode);

    new QRCode($qrCode[0], {
      text: $qrCode.attr('data-identifier'),
      width: 120,
      height: 120,
    });

    $(config.printButton).on('click', function() {
      window.print();
    });

    // Auto-select gift card code on click, based on ID passed to the function
    $(config.giftCardCode).on('click', {element: 'GiftCardDigits'}, selectText);

    function selectText(evt) {
      var text = document.getElementById(evt.data.element);
      var range = '';

      if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
      } else if (window.getSelection) {
        var selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  /* eslint-disable */

  var SECTION_ID_ATTR = 'data-section-id';

  function Section(container, properties) {
    this.container = validateContainerElement(container);
    this.id = container.getAttribute(SECTION_ID_ATTR);
    this.extensions = [];

    // eslint-disable-next-line es5/no-es6-static-methods
    Object.assign(this, validatePropertiesObject(properties));

    try {
      this.onLoad();
    } catch (e) {
      console.warn(`Error in section: ${this.id}`);
      console.warn(this);
      console.warn(e);
    }

  }

  Section.prototype = {
    onLoad: Function.prototype,
    onUnload: Function.prototype,
    onSelect: Function.prototype,
    onDeselect: Function.prototype,
    onBlockSelect: Function.prototype,
    onBlockDeselect: Function.prototype,

    extend: function extend(extension) {
      this.extensions.push(extension); // Save original extension

      // eslint-disable-next-line es5/no-es6-static-methods
      var extensionClone = Object.assign({}, extension);
      delete extensionClone.init; // Remove init function before assigning extension properties

      // eslint-disable-next-line es5/no-es6-static-methods
      Object.assign(this, extensionClone);

      if (typeof extension.init === 'function') {
        extension.init.apply(this);
      }
    }
  };

  function validateContainerElement(container) {
    if (!(container instanceof Element)) {
      throw new TypeError(
        'Theme Sections: Attempted to load section. The section container provided is not a DOM element.'
      );
    }
    if (container.getAttribute(SECTION_ID_ATTR) === null) {
      throw new Error(
        'Theme Sections: The section container provided does not have an id assigned to the ' +
          SECTION_ID_ATTR +
          ' attribute.'
      );
    }

    return container;
  }

  function validatePropertiesObject(value) {
    if (
      (typeof value !== 'undefined' && typeof value !== 'object') ||
      value === null
    ) {
      throw new TypeError(
        'Theme Sections: The properties object provided is not a valid'
      );
    }

    return value;
  }

  // Object.assign() polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
  if (typeof Object.assign != 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, 'assign', {
      value: function assign(target) {
        if (target == null) {
          // TypeError if undefined or null
          throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];

          if (nextSource != null) {
            // Skip over if undefined or null
            for (var nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true
    });
  }

  /*
   * @shopify/theme-sections
   * -----------------------------------------------------------------------------
   *
   * A framework to provide structure to your Shopify sections and a load and unload
   * lifecycle. The lifecycle is automatically connected to theme editor events so
   * that your sections load and unload as the editor changes the content and
   * settings of your sections.
   */

  var SECTION_TYPE_ATTR = 'data-section-type';
  var SECTION_ID_ATTR$1 = 'data-section-id';

  window.Shopify = window.Shopify || {};
  window.Shopify.theme = window.Shopify.theme || {};
  window.Shopify.theme.sections = window.Shopify.theme.sections || {};

  var registered = (window.Shopify.theme.sections.registered =
    window.Shopify.theme.sections.registered || {});
  var instances = (window.Shopify.theme.sections.instances =
    window.Shopify.theme.sections.instances || []);

  function register(type, properties) {
    if (typeof type !== 'string') {
      throw new TypeError(
        'Theme Sections: The first argument for .register must be a string that specifies the type of the section being registered'
      );
    }

    if (typeof registered[type] !== 'undefined') {
      throw new Error(
        'Theme Sections: A section of type "' +
          type +
          '" has already been registered. You cannot register the same section type twice'
      );
    }

    if(!Array.isArray(properties)){
      properties = [properties];
    }

    function TypedSection(container) {
      for (var i = 0; i < properties.length; i++) {
        Section.call(this, container, properties[i]);
      }
    }

    TypedSection.constructor = Section;
    TypedSection.prototype = Object.create(Section.prototype);
    TypedSection.prototype.type = type;

    return (registered[type] = TypedSection);
  }

  function load(types, containers) {
    types = normalizeType(types);

    if (typeof containers === 'undefined') {
      containers = document.querySelectorAll('[' + SECTION_TYPE_ATTR + ']');
    }

    containers = normalizeContainers(containers);

    types.forEach(function(type) {
      var TypedSection = registered[type];

      if (typeof TypedSection === 'undefined') {
        return;
      }

      containers = containers.filter(function(container) {
        // Filter from list of containers because container already has an instance loaded
        if (isInstance(container)) {
          return false;
        }

        // Filter from list of containers because container doesn't have data-section-type attribute
        if (container.getAttribute(SECTION_TYPE_ATTR) === null) {
          return false;
        }

        // Keep in list of containers because current type doesn't match
        if (container.getAttribute(SECTION_TYPE_ATTR) !== type) {
          return true;
        }

        instances.push(new TypedSection(container));

        // Filter from list of containers because container now has an instance loaded
        return false;
      });
    });
  }

  function unload(selector) {
    var instancesToUnload = getInstances(selector);

    instancesToUnload.forEach(function(instance) {
      var index = instances
        .map(function(e) {
          return e.id;
        })
        .indexOf(instance.id);
      instances.splice(index, 1);
      instance.onUnload();
    });
  }

  function getInstances(selector) {
    var filteredInstances = [];

    // Fetch first element if its an array
    if (NodeList.prototype.isPrototypeOf(selector) || Array.isArray(selector)) {
      var firstElement = selector[0];
    }

    // If selector element is DOM element
    if (selector instanceof Element || firstElement instanceof Element) {
      var containers = normalizeContainers(selector);

      containers.forEach(function(container) {
        filteredInstances = filteredInstances.concat(
          instances.filter(function(instance) {
            return instance.container === container;
          })
        );
      });

      // If select is type string
    } else if (typeof selector === 'string' || typeof firstElement === 'string') {
      var types = normalizeType(selector);

      types.forEach(function(type) {
        filteredInstances = filteredInstances.concat(
          instances.filter(function(instance) {
            return instance.type === type;
          })
        );
      });
    }

    return filteredInstances;
  }

  function getInstanceById(id) {
    var instance;

    for (var i = 0; i < instances.length; i++) {
      if (instances[i].id === id) {
        instance = instances[i];
        break;
      }
    }
    return instance;
  }

  function isInstance(selector) {
    return getInstances(selector).length > 0;
  }

  function normalizeType(types) {
    // If '*' then fetch all registered section types
    if (types === '*') {
      types = Object.keys(registered);

      // If a single section type string is passed, put it in an array
    } else if (typeof types === 'string') {
      types = [types];

      // If single section constructor is passed, transform to array with section
      // type string
    } else if (types.constructor === Section) {
      types = [types.prototype.type];

      // If array of typed section constructors is passed, transform the array to
      // type strings
    } else if (Array.isArray(types) && types[0].constructor === Section) {
      types = types.map(function(TypedSection) {
        return TypedSection.prototype.type;
      });
    }

    types = types.map(function(type) {
      return type.toLowerCase();
    });

    return types;
  }

  function normalizeContainers(containers) {
    // Nodelist with entries
    if (NodeList.prototype.isPrototypeOf(containers) && containers.length > 0) {
      containers = Array.prototype.slice.call(containers);

      // Empty Nodelist
    } else if (
      NodeList.prototype.isPrototypeOf(containers) &&
      containers.length === 0
    ) {
      containers = [];

      // Handle null (document.querySelector() returns null with no match)
    } else if (containers === null) {
      containers = [];

      // Single DOM element
    } else if (!Array.isArray(containers) && containers instanceof Element) {
      containers = [containers];
    }

    return containers;
  }

  if (window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', function(event) {
      var id = event.detail.sectionId;
      var container = event.target.querySelector(
        '[' + SECTION_ID_ATTR$1 + '="' + id + '"]'
      );

      if (container !== null) {
        load(container.getAttribute(SECTION_TYPE_ATTR), container);
      }
    });

    document.addEventListener('shopify:section:unload', function(event) {
      var id = event.detail.sectionId;
      var container = event.target.querySelector(
        '[' + SECTION_ID_ATTR$1 + '="' + id + '"]'
      );
      var instance = getInstances(container)[0];

      if (typeof instance === 'object') {
        unload(container);
      }
    });

    document.addEventListener('shopify:section:select', function(event) {
      var instance = getInstanceById(event.detail.sectionId);

      if (typeof instance === 'object') {
        instance.onSelect(event);
      }
    });

    document.addEventListener('shopify:section:deselect', function(event) {
      var instance = getInstanceById(event.detail.sectionId);

      if (typeof instance === 'object') {
        instance.onDeselect(event);
      }
    });

    document.addEventListener('shopify:block:select', function(event) {
      var instance = getInstanceById(event.detail.sectionId);

      if (typeof instance === 'object') {
        instance.onBlockSelect(event);
      }
    });

    document.addEventListener('shopify:block:deselect', function(event) {
      var instance = getInstanceById(event.detail.sectionId);

      if (typeof instance === 'object') {
        instance.onBlockDeselect(event);
      }
    });
  }

  var sections = {};

  const parallaxImage = {
    onLoad() {
      sections[this.id] = [];
      const frames = this.container.querySelectorAll('[data-parallax-wrapper]');
      frames.forEach(frame => {
        const inner = frame.querySelector('[data-parallax-img]');
        sections[this.id].push(new Rellax(inner, {
          center: true,
          round: true,
          frame: frame,
        }));
      });
    },
    onUnload: function() {
      sections[this.id].forEach(image => {
        if (typeof image.destroy === 'function') {
          image.destroy();
        }
      });
    },
  };

  register('article', parallaxImage);

  const selectors = {
    popdownTrigger: 'data-popdown-toggle',
    close: '[data-close-popdown]',
    input: '[data-focus-input]',
  };

  const classes$1 = {
    isVisible: 'is-visible',
  };

  let sections$1 = {};

  class SearchPopdownTriggers {
    constructor(trigger) {
      this.trigger = trigger;
      this.key = this.trigger.getAttribute(selectors.popdownTrigger);

      const popdownSelector = `[id='${this.key}']`;
      this.popdown = document.querySelector(popdownSelector);
      this.input = this.popdown.querySelector(selectors.input);
      this.close = this.popdown.querySelector(selectors.close);

      this.initTriggerEvents();
      this.initPopdownEvents();
    }
    initTriggerEvents() {
      this.trigger.setAttribute('aria-haspopup', true);
      this.trigger.setAttribute('aria-expanded', false);
      this.trigger.setAttribute('aria-controls', this.key);
      this.trigger.addEventListener('click', function(evt) {
        evt.preventDefault();
        this.showPopdown();
      }.bind(this));
      this.trigger.addEventListener('keyup', function(evt) {
        if (evt.which !== window.theme.keyboardKeys.SPACE) { return; }
        this.showPopdown();
      }.bind(this));
    }
    initPopdownEvents() {
      this.popdown.addEventListener('keyup', function(evt) {
        if (evt.which !== window.theme.keyboardKeys.ESCAPE) { return; }
        this.hidePopdown();
      }.bind(this));
      this.close.addEventListener('click', function() {
        this.hidePopdown();
      }.bind(this));
    }
    hidePopdown() {
      this.popdown.classList.remove(classes$1.isVisible);
      this.trigger.focus();
    }
    showPopdown() {
      this.popdown.classList.add(classes$1.isVisible);
      this.input.focus();
    }
  }

  const searchPopdown = {
    onLoad() {
      sections$1[this.id] = {};
      const trigger = this.container.querySelector(`[${selectors.popdownTrigger}]`);
      if (trigger) {
        sections$1[this.id] = new SearchPopdownTriggers(trigger);
      }
    },
    onUnload: function() {
      if (typeof sections$1[this.id].unload === 'function') {
        sections$1[this.id].unload();
      }
    },
  };

  const selectors$1 = {
    frame: '[data-ticker-frame]',
    scale: '[data-ticker-scale]',
    text: '[data-ticker-text]',
    clone: 'data-clone',
    animationClass: 'ticker--animated',
    unloadedClass: 'ticker--unloaded',
    comparitorClass: 'ticker__comparitor',
  };

  const sections$2 = {};

  class Ticker {
    constructor(el) {
      this.frame = el;
      this.scale = this.frame.querySelector(selectors$1.scale);
      this.text = this.frame.querySelector(selectors$1.text);

      this.comparitor = this.text.cloneNode(true);
      this.comparitor.classList.add(selectors$1.comparitorClass);
      this.frame.appendChild(this.comparitor);
      this.scale.classList.remove(selectors$1.unloadedClass);
      this.listen();
    }
    unload() {
      document.removeEventListener('theme:resize', this.checkWidth);
    }
    listen() {
      document.addEventListener('theme:resize', this.checkWidth.bind(this));
      this.checkWidth();
    }
    checkWidth() {
      if (this.frame.clientWidth < this.comparitor.clientWidth) {
        this.text.classList.add(selectors$1.animationClass);
        if (this.scale.childElementCount === 1) {
          this.clone = this.text.cloneNode(true);
          this.clone.setAttribute('aria-hidden', true);
          this.clone.setAttribute(selectors$1.clone, '');
          this.scale.appendChild(this.clone);
        }
      } else {
        let clone = this.scale.querySelector(`[${selectors$1.clone}]`);
        if (clone) {
          this.scale.removeChild(clone);
        }
        this.text.classList.remove(selectors$1.animationClass);
      }
    }
  }

  const ticker = {
    onLoad() {
      sections$2[this.id] = [];
      const el = this.container.querySelectorAll(selectors$1.frame);
      el.forEach(el => {
        sections$2[this.id].push(new Ticker(el));
      });
    },
    onUnload: function() {
      sections$2[this.id].forEach(el => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
    },
  };

  register('announcement', [ticker, searchPopdown]);

  register('blog', parallaxImage);

  var selectors$2 = {
    drawerWrappper: '[data-drawer]',
    underlay: '[data-drawer-underlay]',
    stagger: '[data-stagger-animation]',
    drawerToggle: 'data-drawer-toggle',
    focusable: 'button, [href], select, textarea, [tabindex]:not([tabindex="-1"])',
  };

  var classes$2 = {
    isVisible: 'drawer--visible',
    displayNone: 'display-none',
  };

  var sections$3 = {};

  class Drawer {
    constructor(el) {
      this.drawer = el;
      this.underlay = this.drawer.querySelector(selectors$2.underlay);
      this.key = this.drawer.dataset.drawer;
      const btnSelector = `[${selectors$2.drawerToggle}='${this.key}']`;
      this.buttons = document.querySelectorAll(btnSelector);
      this.staggers = this.drawer.querySelectorAll(selectors$2.stagger);

      this.connectToggle();
      this.connectDrawer();
      this.closers();
      this.staggerChildAnimations();

    }

    unload() {
      // wipe listeners
    }

    connectToggle() {
      this.buttons.forEach(btn => {
        btn.addEventListener('click', function() {
          this.drawer.dispatchEvent(new CustomEvent('theme:menu:toggle', {
            bubbles: false,
          }));
        }.bind(this));
      });
    }

    connectDrawer() {
      this.drawer.addEventListener('theme:menu:toggle', function() {
        if (this.drawer.classList.contains(classes$2.isVisible)) {
          this.hideDrawer();
        } else {
          this.showDrawer();
        }
      }.bind(this));
    }

    staggerChildAnimations() {
      this.staggers.forEach((el) => {
        const children = el.querySelectorAll(':scope > * > [data-animates]');
        children.forEach((child, index) => {
          child.style.transitionDelay = `${((index * 50) + 10)}ms`;
        });
      });
    }

    watchFocus(evt) {
      let drawerInFocus = this.drawer.contains(evt.target);
      if (!drawerInFocus) {
        this.hideDrawer();
      }
    }

    closers() {
      this.drawer.addEventListener('keyup', function(evt) {
        if (evt.which !== window.theme.keyboardKeys.ESCAPE) { return; }
        this.hideDrawer();
        this.buttons[0].focus();
      }.bind(this));

      this.underlay.addEventListener('click', function() {
        this.hideDrawer();
      }.bind(this));
    }

    showDrawer() {
      this.drawer.classList.remove(classes$2.displayNone);
      // animates after display none is removed
      setTimeout(() => {
        this.buttons.forEach((el) => el.setAttribute('aria-expanded', true));
        this.drawer.classList.add(classes$2.isVisible);
        this.drawer.querySelector(selectors$2.focusable).focus();
        document.addEventListener('focusin', this.watchFocus.bind(this));
        document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
      }, 1);
    }

    hideDrawer() {
      this.buttons.forEach((el) => el.setAttribute('aria-expanded', true));
      this.drawer.classList.remove(classes$2.isVisible);
      document.removeEventListener('focusin', this.watchFocus);
      document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
      // adds display none after animations
      setTimeout(() => {
        if (!this.drawer.classList.contains(classes$2.isVisible)) {
          this.drawer.classList.add(classes$2.displayNone);
        }
      }, 1200);
    }
  }

  const drawer = {
    onLoad() {
      sections$3[this.id] = [];
      const els = this.container.querySelectorAll(selectors$2.drawerWrappper);
      els.forEach(el => {
        sections$3[this.id].push(new Drawer(el));
      });
    },
    onUnload: function() {
      sections$3[this.id].forEach(el => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
    },
  };

  var selectors$3 = {
    popoutWrappper: '[data-popout]',
    popoutList: '[data-popout-list]',
    popoutToggle: '[data-popout-toggle]',
    popoutInput: '[data-popout-input]',
    popoutOptions: '[data-popout-option]',
  };

  var classes$3 = {
    listVisible: 'popout-list--visible',
  };

  var sections$4 = {};

  class Popout {
    constructor($popout) {
      this.$container = $popout;
      this.$popoutList = this.$container.find(selectors$3.popoutList);
      this.$popoutToggle = this.$container.find(selectors$3.popoutToggle);
      this.$popoutInput = this.$container.find(selectors$3.popoutInput);
      this.$popoutOptions = this.$container.find(selectors$3.popoutOptions);
      this._connectOptions();
      this._connectToggle();
      this._onFocusOut();
    }
    unload() {
      this.$popoutOptions.off();
      this.$popoutToggle.off();
      this.$popoutList.off();
      this.$container.off();
    }

    _connectToggle() {
      this.$popoutToggle.on(
        'click',
        function(evt) {
          var ariaExpanded = ($(evt.currentTarget).attr('aria-expanded') === 'true');
          $(evt.currentTarget).attr('aria-expanded', !ariaExpanded);
          this.$popoutList.toggleClass(classes$3.listVisible);
        }.bind(this),
      );
    }

    _connectOptions() {
      this.$popoutOptions.on(
        'click',
        function(evt) {
          var $link = $(evt.target).closest('[data-popout-option]');
          if ($link[0].attributes.href.value === '#') {
            evt.preventDefault();
            this._submitForm($(evt.currentTarget).data('value'));
          }
        }.bind(this),
      );
    }

    _onFocusOut() {
      this.$popoutToggle.on(
        'focusout',
        function(evt) {
          var popoutLostFocus = (this.$container.has(evt.relatedTarget).length === 0);

          if (popoutLostFocus) {
            this._hideList();
          }
        }.bind(this),
      );

      this.$popoutList.on(
        'focusout',
        function(evt) {
          var childInFocus = ($(evt.currentTarget).has(evt.relatedTarget).length > 0);
          var isVisible = this.$popoutList.hasClass(classes$3.listVisible);

          if (isVisible && !childInFocus) {
            this._hideList();
          }
        }.bind(this),
      );

      this.$container.on(
        'keyup',
        function(evt) {
          if (evt.which !== window.theme.keyboardKeys.ESCAPE) { return; }
          this._hideList();
          this.$popoutToggle.focus();
        }.bind(this),
      );

      $('body').on(
        'click',
        function(evt) {
          var isOption = (this.$container.has(evt.target).length > 0);
          var isVisible = this.$popoutList.hasClass(classes$3.listVisible);

          if (isVisible && !isOption) {
            this._hideList();
          }
        }.bind(this),
      );
    }

    _submitForm(value) {
      this.$popoutInput.val(value);
      this.$container.parents('form').submit();
    }

    _hideList() {
      this.$popoutList.removeClass(classes$3.listVisible);
      this.$popoutToggle.attr('aria-expanded', false);
    }
  }

  const popoutSection = {
    onLoad() {
      sections$4[this.id] = [];
      const wrappers = this.container.querySelectorAll(selectors$3.popoutWrappper);
      wrappers.forEach(wrapper => {
        const $wrapper = $(wrapper);
        sections$4[this.id].push(new Popout($wrapper));
      });
    },
    onUnload: function() {
      sections$4[this.id].forEach(popout => {
        if (typeof popout.unload === 'function') {
          popout.unload();
        }
      });
    },
  };

  const selectors$4 = {
    slideruleOpen: 'data-sliderule-open',
    slideruleClose: 'data-sliderule-close',
    sliderulePane: 'data-sliderule-pane',
    slideruleWrappper: '[data-sliderule]',
    focusable: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    children: `:scope > [data-animates],
             :scope > * > [data-animates],
             :scope > * > * >[data-animates],
             :scope > .sliderule-grid  > *`,
  };

  const classes$4 = {
    isVisible: 'is-visible',
  };

  let sections$5 = {};

  class HeaderMobileSliderule {
    constructor(el) {
      this.sliderule = el;
      this.wrapper = el.closest(selectors$4.wrapper);
      this.key = this.sliderule.id;
      const btnSelector = `[${selectors$4.slideruleOpen}='${this.key}']`;
      const exitSelector = `[${selectors$4.slideruleClose}='${this.key}']`;
      this.trigger = document.querySelector(btnSelector);
      this.exit = document.querySelector(exitSelector);
      this.pane = document.querySelector(`[${selectors$4.sliderulePane}]`);
      this.children = this.sliderule.querySelectorAll(selectors$4.children);

      this.trigger.setAttribute('aria-haspopup', true);
      this.trigger.setAttribute('aria-expanded', false);
      this.trigger.setAttribute('aria-controls', this.key);

      this.clickEvents();
      this.staggerChildAnimations();
    }
    clickEvents() {
      this.trigger.addEventListener('click', function() {
        this.showSliderule();
      }.bind(this));
      this.exit.addEventListener('click', function() {
        this.hideSliderule();
      }.bind(this));
    }
    keyboardEvents() {
      this.trigger.addEventListener('keyup', function(evt) {
        if (evt.which !== window.theme.keyboardKeys.SPACE) { return; }
        this.showSliderule();
      }.bind(this));
      this.sliderule.addEventListener('keyup', function(evt) {
        if (evt.which !== window.theme.keyboardKeys.ESCAPE) { return; }
        this.hideSliderule();
        this.buttons[0].focus();
      }.bind(this));
    }
    staggerChildAnimations() {
      this.children.forEach((child, index) => {
        child.style.transitionDelay = `${((index * 50) + 10)}ms`;
      });
    }
    hideSliderule() {
      this.sliderule.classList.remove(classes$4.isVisible);
      this.children.forEach((el) => { el.classList.remove(classes$4.isVisible); });
      const newPosition = parseInt(this.pane.dataset.sliderulePane, 10) - 1;
      this.pane.setAttribute(selectors$4.sliderulePane, newPosition);
    }
    showSliderule() {
      this.sliderule.classList.add(classes$4.isVisible);
      this.children.forEach((el) => { el.classList.add(classes$4.isVisible); });
      const newPosition = parseInt(this.pane.dataset.sliderulePane, 10) + 1;
      this.pane.setAttribute(selectors$4.sliderulePane, newPosition);
    }
  }

  const headerMobileSliderule = {
    onLoad() {
      sections$5[this.id] = [];
      const els = this.container.querySelectorAll(selectors$4.slideruleWrappper);
      els.forEach(el => {
        sections$5[this.id].push(new HeaderMobileSliderule(el));
      });
    },
    onUnload: function() {
      sections$5[this.id].forEach(el => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
    },
  };

  const selectors$5 = {
    announcement: '[data-announcement-wrapper]',
    transparent: 'data-header-transparent',
    header: '[data-header-wrapper] header',
  };

  const classes$5 = {
    stuck: 'js__header__stuck',
    stuckAnimated: 'js__header__stuck--animated',
    triggerAnimation: 'js__header__stuck--trigger-animation',
    stuckBackdrop: 'js__header__stuck__backdrop',
  };

  let sections$6 = {};

  class Sticky {
    constructor(el) {
      this.wrapper = el;
      this.type = this.wrapper.dataset.headerSticky;
      this.transparent = this.wrapper.dataset.headerTransparent;
      this.sticks = (this.type === 'sticky');
      this.animated = (this.type === 'directional');
      this.currentlyStuck = false;
      this.cls = this.wrapper.classList;
      const announcementEl = document.querySelector(selectors$5.announcement);
      const announcementHeight = announcementEl ? announcementEl.clientHeight : 0;
      const headerHeight = document.querySelector(selectors$5.header).clientHeight;
      this.blur = headerHeight + announcementHeight;
      this.stickDown = headerHeight + announcementHeight;
      this.stickUp = announcementHeight;
      if (this.wrapper.getAttribute(selectors$5.transparent) !== 'false') {
        this.blur = announcementHeight;
      }
      if (this.sticks) {
        this.stickDown = announcementHeight;
        this.scrollDownInit();
      }
      this.listen();
    }
    unload() {
      document.removeEventListener('theme:scroll', this.listen);
      document.removeEventListener('theme:scroll:up', this.scrollUpDirectional);
      document.removeEventListener('theme:scroll:down', this.scrollDownDirectional);
    }
    listen() {
      if (this.sticks || this.animated) {
        document.addEventListener('theme:scroll', (e) => {
          if (e.detail.down) {
            if (!this.currentlyStuck && e.detail.position > this.stickDown) {
              this.stickSimple();
            }
            if (!this.currentlyBlurred && e.detail.position > this.blur) {
              this.addBlur();
            }
          } else {
            if (e.detail.position <= this.stickUp) {
              this.unstickSimple();
            }
            if (e.detail.position <= this.blur) {
              this.removeBlur();
            }
          }
        });
      }
      if (this.animated) {
        document.addEventListener('theme:scroll:up', this.scrollUpDirectional.bind(this));
        document.addEventListener('theme:scroll:down', this.scrollDownDirectional.bind(this));
      }
    }
    stickSimple() {
      if (this.animated) {
        this.cls.add(classes$5.stuckAnimated);
      }
      this.cls.add(classes$5.stuck);
      this.wrapper.setAttribute(selectors$5.transparent, false);
      this.currentlyStuck = true;
    }
    unstickSimple() {
      this.cls.remove(classes$5.stuck);
      this.wrapper.setAttribute(selectors$5.transparent, this.transparent);
      if (this.animated) {
        this.cls.remove(classes$5.stuckAnimated);
      }
      this.currentlyStuck = false;
    }
    scrollDownInit() {
      if (window.scrollY > this.stickDown) {
        this.stickSimple();
      }
      if (window.scrollY > this.blur) {
        this.addBlur();
      }
    }
    stickDirectional() {
      this.cls.add(classes$5.triggerAnimation);
    }
    unstickDirectional() {
      this.cls.remove(classes$5.triggerAnimation);
    }
    scrollDownDirectional() {
      this.unstickDirectional();
    }
    scrollUpDirectional() {
      if (window.scrollY <= this.stickDown) {
        this.unstickDirectional();
      } else {
        this.stickDirectional();
      }
    }
    addBlur() {
      this.cls.add(classes$5.stuckBackdrop);
      this.currentlyBlurred = true;
    }
    removeBlur() {
      this.cls.remove(classes$5.stuckBackdrop);
      this.currentlyBlurred = false;
    }
  }

  const stickyHeader = {
    onLoad() {
      sections$6 = new Sticky(this.container);
    },
    onUnload: function() {
      if (typeof sections$6.unload === 'function') {
        sections$6.unload();
      }
    },
  };

  const selectors$6 = {
    disclosureToggle: 'data-hover-disclosure-toggle',
    disclosureWrappper: '[data-hover-disclosure]',
    link: '[data-top-link]',
    meganavVisible: 'meganav--visible',
    wrapper: '[data-header-wrapper]',
    stagger: '[data-stagger]',
    staggerPair: '[data-stagger-first]',
    staggerAfter: '[data-stagger-second]',
    staggerImage: '[data-grid-item], [data-header-image]',
    focusable: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  };

  const classes$6 = {
    isVisible: 'is-visible',
  };

  let sections$7 = {};
  let disclosures = {};

  class HoverDisclosure {
    constructor(el) {
      this.disclosure = el;
      this.wrapper = el.closest(selectors$6.wrapper);
      this.key = this.disclosure.id;
      const btnSelector = `[${selectors$6.disclosureToggle}='${this.key}']`;
      this.trigger = document.querySelector(btnSelector);
      this.link = this.trigger.querySelector(selectors$6.link);
      this.grandparent = this.trigger.classList.contains('grandparent');

      this.trigger.setAttribute('aria-haspopup', true);
      this.trigger.setAttribute('aria-expanded', false);
      this.trigger.setAttribute('aria-controls', this.key);

      this.connectHoverToggle();
      this.handleTablets();
      this.staggerChildAnimations();
    }
    onBlockSelect(evt) {
      if (this.disclosure.contains(evt.target)) {
        this.showDisclosure();
      }
    }
    onBlockDeselect(evt) {
      if (this.disclosure.contains(evt.target)) {
        this.hideDisclosure();
      }
    }
    showDisclosure() {
      if (this.grandparent) {
        this.wrapper.classList.add(selectors$6.meganavVisible);
      } else {
        this.wrapper.classList.remove(selectors$6.meganavVisible);
      }
      this.trigger.setAttribute('aria-expanded', true);
      this.trigger.classList.add(classes$6.isVisible);
      this.disclosure.classList.add(classes$6.isVisible);
    }

    hideDisclosure() {
      this.disclosure.classList.remove(classes$6.isVisible);
      this.trigger.classList.remove(classes$6.isVisible);
      this.trigger.setAttribute('aria-expanded', false);
      this.wrapper.classList.remove(selectors$6.meganavVisible);
    }
    staggerChildAnimations() {
      const simple = this.disclosure.querySelectorAll(selectors$6.stagger);
      simple.forEach((el, index) => {
        el.style.transitionDelay = `${((index * 50) + 10)}ms`;
      });

      const pairs = this.disclosure.querySelectorAll(selectors$6.staggerPair);
      pairs.forEach((child, i) => {
        const d1 = (i * 150);
        child.style.transitionDelay = `${d1}ms`;
        child.parentElement.querySelectorAll(selectors$6.staggerAfter).forEach((grandchild, i2) => {
          const di1 = i2 + 1;
          const d2 = di1 * (20);
          grandchild.style.transitionDelay = `${(d1 + d2)}ms`;
        });
      });

      const images = this.disclosure.querySelectorAll(selectors$6.staggerImage);
      images.forEach((el, index) => {
        el.style.transitionDelay = `${((index + 1) * 80)}ms`;
      });
    }
    handleTablets() {
      // first click opens the popup, second click opens the link
      this.trigger.addEventListener('touchstart', function(e) {
        const isOpen = this.disclosure.classList.contains(classes$6.isVisible);
        if (!isOpen) {
          e.preventDefault();
          this.showDisclosure();
        }
      }.bind(this), {passive: true});
    }
    connectHoverToggle() {
      this.trigger.addEventListener('mouseenter', this.showDisclosure.bind(this));
      this.link.addEventListener('focus', this.showDisclosure.bind(this));

      this.trigger.addEventListener('mouseleave', this.hideDisclosure.bind(this));
      this.trigger.addEventListener('focusout', function(e) {
        const inMenu = this.trigger.contains(e.relatedTarget);
        if (!inMenu) {
          this.hideDisclosure();
        }
      }.bind(this));
      this.disclosure.addEventListener('keyup', function(evt) {
        if (evt.which !== window.theme.keyboardKeys.ESCAPE) { return; }
        this.hideDisclosure();
      }.bind(this));
    }
  }

  const hoverDisclosure = {
    onLoad() {
      sections$7[this.id] = [];
      disclosures = this.container.querySelectorAll(selectors$6.disclosureWrappper);
      disclosures.forEach(el => {
        sections$7[this.id].push(new HoverDisclosure(el));
      });
    },
    onBlockSelect(evt) {
      sections$7[this.id].forEach(el => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockSelect(evt);
        }
      });
    },
    onBlockDeselect(evt) {
      sections$7[this.id].forEach(el => {
        if (typeof el.onBlockDeselect === 'function') {
          el.onBlockDeselect(evt);
        }
      });
    },
    onUnload: function() {
      sections$7[this.id].forEach(el => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
    },
  };

  const selectors$7 = {
    item: '[data-main-menu-text-item]',
    wrapper: '[data-text-items-wrapper]',
    text: '.navtext',
    isActive: 'data-menu-active',
    sectionOuter: '[data-header-wrapper]',
  };

  let sections$8 = {};

  class HoverLine {
    constructor(el) {
      this.wrapper = el;
      this.itemList = this.wrapper.querySelectorAll(selectors$7.item);
      this.sectionOuter = document.querySelector(selectors$7.sectionOuter);

      if (this.itemList.length) {
        this.listen();

        this.textBottom = null;
        this.setHeight();

        // initialize at left edge of first item im menu
        const startingLeft = this.sectionOuter.querySelector(selectors$7.item).offsetLeft;
        this.sectionOuter.style.setProperty('--bar-left', `${startingLeft}px`);
        this.sectionOuter.style.setProperty('--bar-width', '0px');
      }
    }
    setHeight() {
      const height = this.wrapper.clientHeight;
      const text = this.itemList[0].querySelector(selectors$7.text);
      const textHeight = text.clientHeight;
      const textBottom = (Math.floor((height / 2) - (textHeight / 2)) - 4);
      if (this.textBottom !== textBottom) {
        this.sectionOuter.style.setProperty('--bar-bottom', `${textBottom}px`);
        this.textBottom = textBottom;
      }
    }
    listen() {
      this.itemList.forEach(element => {
        element.addEventListener('mouseenter', (evt) => {
          const item = evt.target.querySelector(selectors$7.text);
          this.startBar(item);
        });
      });
      this.wrapper.addEventListener('mouseleave', this.clearBar.bind(this));
    }
    startBar(item) {
      this.setHeight();
      let active = (this.sectionOuter.getAttribute(selectors$7.isActive) !== 'false');
      let left = item.offsetLeft;
      let width = item.clientWidth;
      if (active) {
        this.render(width, left);
      } else {
        this.sectionOuter.setAttribute(selectors$7.isActive, true);
        this.render(0, left);
        setTimeout(() => {
          this.render(width, left);
        }, 10);
      }
    }
    render(width, left) {
      this.sectionOuter.style.setProperty('--bar-left', `${left}px`);
      this.sectionOuter.style.setProperty('--bar-width', `${width}px`);
    }
    clearBar() {
      // allow the bar to jump between text sections for cart and main menu
      this.sectionOuter.setAttribute(selectors$7.isActive, false);
      setTimeout(() => {
        let active = (this.sectionOuter.getAttribute(selectors$7.isActive) !== 'false');
        if (!active) {
          this.sectionOuter.style.setProperty('--bar-width', '0px');
        }
      }, 350);
    }
  }

  const hoverUnderline = {
    onLoad() {
      sections$8[this.id] = [];
      const els = this.container.querySelectorAll(selectors$7.wrapper);
      els.forEach(el => {
        sections$8[this.id].push(new HoverLine(el));
      });
    },
    onUnload: function() {
      sections$8[this.id].forEach(el => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
    },
  };

  const selectors$8 = {
    price: 'data-header-cart-price',
    count: 'data-header-cart-count',
    dot: 'data-header-cart-full',
  };

  class Totals {
    constructor(el) {
      this.section = el;
      this.counts = this.section.querySelectorAll(`[${selectors$8.count}]`);
      this.prices = this.section.querySelectorAll(`[${selectors$8.price}]`);
      this.dots = this.section.querySelectorAll(`[${selectors$8.dot}]`);
      this.cart = null;
      this.listen();
    }
    listen() {
      document.addEventListener('theme:cart:change', function(event) {
        this.cart = event.detail.cart;
        this.update();
      }.bind(this));
    }
    update() {
      console.log(this.cart);
      if (this.cart) {
        this.prices.forEach(price => {
          price.setAttribute(selectors$8.price, this.cart.total_price);
          const newTotal = themeCurrency.formatMoney(this.cart.total_price, theme.moneyFormat);
          price.innerHTML = newTotal;
        });
        this.counts.forEach(count => {
          count.setAttribute(selectors$8.count, this.cart.item_count);
          count.innerHTML = `(${this.cart.item_count})`;
        });
        this.dots.forEach(dot => {
          const full = (this.cart.item_count > 0);
          dot.setAttribute(selectors$8.dot, full);
        });
      }
    }
  }
  const headerTotals = {
    onLoad() {
      new Totals(this.container);
    },
  };

  function getProductJson(handle) {
    let root = window.theme.routes.root_url || '';
    if (root[root.length - 1] !== '/') {
      root = `${root}/`;
    }
    const requestRoute = `${root}products/${handle}.js` || '/recommendations/products/';
    return window.fetch(requestRoute).then((response) => {
      return response.json();
    }).catch((e) => {
      console.error(e);
    });
  }

  function getSwatch(name) {
    const getColors = loadScript({json: window.theme.assets.swatches});
    return getColors.then((colors) => {
      const swatch = buildSwatch(colors, name);
      return swatch;
    }).catch((e) => {
      console.log('failed to load swatch colors script');
      console.log(e);
    });
  }

  function buildSwatch(colors, name) {
    let bg = '#E5E5E5';
    let img = null;
    const path = window.theme.assets.base || '/';
    const comparisonName = name.toLowerCase().replace(/\s/g, '');
    const array = colors.colors;
    if (array) {
      const variantNameMatch = (nameObject) => {
        const indexName = Object.keys(nameObject).toString();
        const neatName = indexName.toLowerCase().replace(/\s/g, '');
        return neatName === comparisonName;
      };
      const position = array.findIndex(variantNameMatch);
      if (position > -1) {
        const value = Object.values(array[position])[0];
        if (value.includes('.jpg') || value.includes('.jpeg') || value.includes('.png') || value.includes('.svg')) {
          img = `${path}${value}`;
          bg = '#888888';
        } else {
          bg = value;
        }
      }
    }
    return {
      path: img,
      hex: bg,
    };
  }

  async function gridSwatches(element) {
    var handle = element.getAttribute('data-swatch-handle');
    var label = element.getAttribute('data-swatch-label').trim().toLowerCase();
    var product = await getProductJson(handle);
    var colorOption = product.options.find(function(element) {
      return element.name.toLowerCase() === label || null;
    });
    if (colorOption) {
      var swatches = colorOption.values;
      var swatchElement = document.createElement('fieldset');
      swatchElement.setAttribute('class', 'radio__fieldset radio__fieldset--swatch');
      element.appendChild(swatchElement);
      for (var i = 0; i < swatches.length; i++) {
        var value = swatches[i];
        var swatch = await getSwatch(value);
        var hex = swatch.hex;
        let swatchImage = '';
        if (swatch.path) {
          swatchImage = ` background-image: url('${swatch.path}'); background-size: cover;`;
        }
        var image = '';
        var variant = product.variants.find((variant) => variant.options.includes(value) && variant.featured_media);
        if (typeof variant === 'undefined') {
          variant = product.variants.find((variant) => variant.options.includes(value));
        } else {
          image = variant.featured_media.preview_image.src;
        }
        var variantId = `${variant.id}`;
        var id = `swatch-${variant.id}-${getRandomInt(1, 500)}`;
        var option = `<span class="swatch__button" data-swatch-button data-variant="${variantId}" data-image="${image}">
        <input type="radio" name="options[${label}]" value="${value}" id="${id}">
        <label for="${id}" style="--swatch: ${hex}; ${swatchImage}">
          <span class="visually-hidden">${value}</span>
        </label>
      </span>`;
        swatchElement.innerHTML += option;
      }
    }

    return Promise.resolve();
  }


  function swatchClicks(container) {
    var $container = $(container);
    var $swatches = $('[data-swatch-button]', $container);
    $swatches.off().click(function() {
      var $swatch = $(this);
      var variant = $swatch.attr('data-variant');
      var image = $swatch.attr('data-image');
      $swatch.closest('[data-grid-item]').find('[data-grid-link]').attr('href', function(i, val) {
        return themeProductForm.getUrlWithVariant(val, variant);
      });
      var $imageContainer = $swatch.closest('[data-grid-item]').find('[data-grid-slide]');
      if (image) {
        var width = round180($imageContainer[0].offsetWidth);
        var sizedImage = themeImages.getSizedImageUrl(image, `${width}x`);
        window.fetch(sizedImage)
          .then(response => {
            return response.blob();
          })
          .then(blob => {
            var objectURL = URL.createObjectURL(blob);
            $imageContainer.css('background-color', '#fff');
            $imageContainer.css('background-image', `url("${objectURL}")`);
            return objectURL;
          })
          .catch(error => {
            console.log(`Error: ${error}`);
          });
      }
    });
  }


  function round180(x) {
    return Math.ceil(x / 180) * 180;
  }

  function getRandomInt(minimum, maximum) {
    var min = Math.ceil(minimum);
    var max = Math.floor(maximum);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  const swatchSection = {
    onLoad() {
      const swatches = this.container.querySelectorAll('[data-grid-swatches]');
      swatches.forEach(swatch => {
        gridSwatches(swatch).then(() => {
          swatchClicks(swatch);
        });
      });
    },
  };

  const selectors$9 = {
    wrapper: '[data-header-wrapper]',
    style: 'data-header-style',
    widthContent: '[data-takes-space]',
    desktop: '[data-header-desktop]',
    cloneClass: 'js__header__clone',
    showMobileClass: 'js__show__mobile',
    backfill: '[data-header-backfill]',
    transparent: 'data-header-transparent',
    overrideBorder: 'header-override-border',
    firstSectionHasImage: '.main-content > .shopify-section:first-child [data-overlay-header]',
    deadLink: '.navlink[href="#"]',
  };

  let sections$9 = {};

  class Header {
    constructor(el) {
      this.wrapper = el;
      this.style = this.wrapper.dataset.style;
      this.desktop = this.wrapper.querySelector(selectors$9.desktop);
      this.transparent = (this.wrapper.getAttribute(selectors$9.transparent) !== 'false');
      this.overlayedImages = document.querySelectorAll(selectors$9.firstSectionHasImage);
      this.deadLinks = document.querySelectorAll(selectors$9.deadLink);

      this.killDeadLinks();
      if (this.style !== 'drawer' && this.desktop) {
        this.minWidth = this.getMinWidth();
        this.listenWidth();
      }
      this.checkForImage();
    }
    unload() {
      document.removeEventListener('theme:resize', this.checkWidth);
    }
    checkForImage() {
      if (this.overlayedImages.length > 0 && this.transparent) {
        // is transparent and has image, overlay the image
        document.querySelector(selectors$9.backfill).style.display = 'none';
        this.listenOverlay();
      } else {
        this.wrapper.setAttribute(selectors$9.transparent, false);
      }

      if (this.overlayedImages.length > 0 && !this.transparent) {
        // Have image but not transparent, remove border bottom
        this.wrapper.classList.add(selectors$9.overrideBorder);
        this.subtractHeaderHeight();
      }
    }
    listenOverlay() {
      document.addEventListener('theme:resize', this.checkWidth.bind(this));
      this.subtractAnnouncementHeight();
    }
    listenWidth() {
      document.addEventListener('theme:resize', this.checkWidth.bind(this));
      this.checkWidth();
    }
    killDeadLinks() {
      this.deadLinks.forEach(el => {
        el.onclick = (e) => {
          e.preventDefault();
        };
      });
    }
    subtractAnnouncementHeight() {
      const {windowHeight, announcementHeight} = readHeights();
      this.overlayedImages.forEach(el => {
        el.style.setProperty('--full-screen', `${windowHeight - announcementHeight}px`);
        el.classList.add('has-overlay');
      });
    }
    subtractHeaderHeight() {
      const {windowHeight, headerHeight} = readHeights();
      this.overlayedImages.forEach(el => {
        el.style.setProperty('--full-screen', `${windowHeight - headerHeight}px`);
      });
    }
    checkWidth() {
      if (document.body.clientWidth < this.minWidth) {
        this.wrapper.classList.add(selectors$9.showMobileClass);
      } else {
        this.wrapper.classList.remove(selectors$9.showMobileClass);
      }
    }
    getMinWidth() {
      const comparitor = this.wrapper.cloneNode(true);
      comparitor.classList.add(selectors$9.cloneClass);
      document.body.appendChild(comparitor);
      const wideElements = comparitor.querySelectorAll(selectors$9.widthContent);
      let minWidth = 0;
      if (wideElements.length === 3) {
        minWidth = _sumSplitWidths(wideElements);
      } else {
        minWidth = _sumWidths(wideElements);
      }
      document.body.removeChild(comparitor);
      return minWidth + (wideElements.length * 20);
    }
  }

  function _sumSplitWidths(nodes) {
    let arr = [];
    nodes.forEach(el => {
      arr.push(el.clientWidth);
    });
    if (arr[0] > arr[2]) {
      arr[2] = arr[0];
    } else {
      arr[0] = arr[2];
    }
    const width = arr.reduce((a, b) => a + b);
    return width;
  }
  function _sumWidths(nodes) {
    let width = 0;
    nodes.forEach(el => {
      width += el.clientWidth;
    });
    return width;
  }

  const header = {
    onLoad() {
      sections$9 = new Header(this.container);
    },
    onUnload: function() {
      if (typeof sections$9.unload === 'function') {
        sections$9.unload();
      }
    },
  };

  register('header', [
    header,
    drawer,
    popoutSection,
    headerMobileSliderule,
    stickyHeader,
    hoverDisclosure,
    hoverUnderline,
    headerTotals,
    searchPopdown,
    swatchSection,
  ]);

  const footerSection = {
    onLoad() {

      // Lighthouse fires security warning for the Shopify link.
      var shopifyLink = document.querySelector('[data-powered-link] a');

      if (shopifyLink) {
        shopifyLink.setAttribute('rel', 'noopener');
      }

      $('[data-accordion-toggle]').on("click", function(event){

        var accordionLink = $(event.currentTarget);
        var accordion = accordionLink.closest(".footer-accordion");
        var isCollapsed = accordion.hasClass("footer-accordion--collapsed") ? true : false;

        if (isCollapsed == true) {
          accordion
            .addClass("footer-accordion--expanded")
            .removeClass("footer-accordion--collapsed")
            .attr('aria-expanded', "true");
        }
        else {
          accordion
            .addClass("footer-accordion--collapsed")
            .removeClass("footer-accordion--expanded")
            .attr('aria-expanded', "false");
        }


      });

    },
  };

  register('footer', [popoutSection, footerSection]);

  var touched = false;

  function isTouch() {
    return touched;
  }

  function wasTouched() {
    touched = true;
    document.removeEventListener('touchstart', wasTouched, {passive: true});
    document.querySelector('body').classList.add('supports-touch');
    document.dispatchEvent(new CustomEvent('theme:touch', {
      bubbles: true,
    }));
  }

  document.addEventListener('touchstart', wasTouched, {passive: true});

  const defaultOptions = {
    cc_load_policy: 1,
    iv_load_policy: 3,
    modestbranding: 1,
    playsinline: 1,
    controls: 1,
    showinfo: 0,
    ecver: 2,
    fs: 1,
    rel: 0,
  };

  function embedYoutube(uniqueKey, options) {
    const playerOptions = {
      ...defaultOptions,
      ...options,
    };
    const $player = $(`[data-player="${uniqueKey}"]`);
    const $playerElement = $player.find('iframe, [data-replace]');
    const youtubeKey = $player.find('[data-video-id]').attr('data-video-id');
    loadScript({url: 'https://www.youtube.com/iframe_api'});

    const playerPromise = window.youtubeLoaderPromise.then(function() {
      let player = new window.YT.Player($playerElement[0], {
        videoId: youtubeKey,
        playerVars: {
          ...playerOptions,
        },
      });
      $player.on('pause', function() {
        try {
          if (player.pauseVideo) {
            player.pauseVideo();
          }
        } catch (e) {
          console.warn(e);
        }
      });
      $player.on('play-desktop', function() {
        if (!isTouch()) {
          $player.trigger('play');
        }
      });
      $player.on('play', function() {
        try {
          if (player.playVideo) {
            player.playVideo();
          } else {
            player.addEventListener('onReady', function(event) {
              event.target.playVideo();
            });
          }
        } catch (e) {
          console.warn(e);
        }
      });
      $player.on('destroy', function() {
        try {
          if (player.destroy) {
            player.destroy();
          }
        } catch (e) {
          console.warn(e);
        }
      });
      return player;
    }).catch(function(err) {
      console.error(err);
    });
    return playerPromise;
  }

  window.youtubeLoaderPromise = new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = function() {
      resolve();
    };
  });

  const defaultOptions$1 = {
    autoplay: true,
    loop: true,
    controls: true,
    muted: false,
    playsinline: true,
  };

  function embedVimeo(uniqueKey, options) {
    const playerOptions = {
      ...defaultOptions$1,
      ...options,
    };
    const $player = $(`[data-player="${uniqueKey}"]`);
    const $playerElement = $player.find('iframe, [data-replace]');
    const vimeoKey = $player.find('[data-video-id]').attr('data-video-id');
    const loadedPromise = loadScript({url: 'https://player.vimeo.com/api/player.js'});
    const vimeoSelector = `select-${uniqueKey}`;
    $playerElement.attr('id', vimeoSelector);
    const returnPlayer = loadedPromise.then(function() {
      const player = new window.Vimeo.Player(vimeoSelector, {
        ...playerOptions,
        id: vimeoKey,
      });
      $player.on('pause', function() {
        try {
          if (player.pause) {
            player.pause();
          }
        } catch (e) {
          console.warn(e);
        }
      });
      $player.on('play-desktop', function() {
        if (!isTouch()) {
          $player.trigger('play');
        }
      });
      $player.on('play', function() {
        if (player.play) {
          player.play();
        }
      });
      $player.on('destroy', function() {
        try {
          if (player.destroy) {
            player.destroy();
          }
        } catch (e) {
          console.log(e);
        }
      });
      return player;
    }).catch(function(err) {
      console.error(err);
    });
    return returnPlayer;
  }

  function popupVideo(container) {
    const $triggers = $(container).find('[data-video-popup]');
    const $backgroundVideo = $(container).find('[data-video-autoplay]');

    $.each($triggers, function(index, trigger) {
      // Extract the video information from the button trigger
      const $trigger = $(trigger);
      const unique = $trigger.attr('data-unique');
      const video = $trigger.attr('data-video-id');
      const type = $trigger.attr('data-video-type');

      // Find the modal body, which has been moved to the document root
      // and append a unique ID for youtube and vimeo to init players.
      const uniqueKey = `${video}-${unique}`;
      const $player = $(document).find(`[data-player="${uniqueKey}"]`);

      // Modal Event Logic:
      // When a modal opens it creates and plays the video
      // When a modal opens it pauses background videos in this section
      // --
      // When a modal closes it destroys the player
      // When a modal closes it plays background videos anywhere on the page

      MicroModal.init({
        onShow: () => {
          $backgroundVideo.trigger('pause');
          let playerPromise = {};
          if (type === 'youtube') {
            playerPromise = embedYoutube(uniqueKey);
          } else if (type === 'vimeo') {
            playerPromise = embedVimeo(uniqueKey);
          }
          playerPromise.then(() => {
            $player.trigger('play');
          });
        },
        onClose: () => {
          $player.trigger('destroy');
          $backgroundVideo.trigger('play');
        },
        openTrigger: `data-trigger-${video}-${unique}`,
      });
    });
  }

  const selectors$a = {
    button: '[data-scroll-down]',
  };

  class ScrollButton {
    constructor(el) {
      this.wrapper = el;
      this.init();
    }
    init() {
      const buttons = this.wrapper.querySelectorAll(selectors$a.button);
      if (buttons) {
        buttons.forEach(btn => {
          btn.addEventListener('click', this.scroll.bind(this));
        });
      }
    }
    scroll() {
      const bottom = this.wrapper.offsetTop + this.wrapper.clientHeight;
      window.scroll({
        top: bottom,
        left: 0,
        behavior: 'smooth',
      });
    }
  }

  const scrollButton = {
    onLoad() {
      this.scrollButton = new ScrollButton(this.container);
    },
    onUnload: function() {
      delete this.scrollButton;
    },
  };

  var selectors$b = {
    autoplay: '[data-video-autoplay]',
    player: '[data-player]',
  };

  const vimeoOptions = {
    autoplay: false,
    loop: true,
    controls: false,
    muted: true,
    playsinline: true,
  };

  const youtubeOptions = {
    autoplay: 1,
    cc_load_policy: 0,
    iv_load_policy: 0,
    modestbranding: 1,
    playsinline: 1,
    fs: 0,
    controls: 0,
  };

  const videoSection = {
    onLoad() {
      initAutoplay(this.container);
      popupVideo(this.container, this.id);
    },
    onUnload() {
      $(selectors$b.player, this.container).trigger('destroy');
    },
  };

  function initAutoplay(container) {
    const autoplay = container.querySelectorAll(selectors$b.autoplay);

    if (autoplay.length) {
      var videoType = autoplay[0].dataset.videoType;
      const uniqueKey = autoplay[0].dataset.player;
      if (videoType == 'vimeo') {
        let vimeoPlayerPromise = embedVimeo(uniqueKey, vimeoOptions);
        vimeoPlayerPromise.then((vimeoPlayer) => {
          return _vimeoBackground(vimeoPlayer);
        }).catch((err) => {
          console.error(err);
        });
      } else if (videoType == 'youtube') {
        let youtubePlayerPromise = embedYoutube(uniqueKey, youtubeOptions);
        youtubePlayerPromise.then((youtubePlayer) => {
          return _youtubeBackground(youtubePlayer);
        }).catch((err) => {
          console.error(err);
        });
      }
    }
  }

  function _youtubeBackground(youtubePlayer) {
    youtubePlayer.addEventListener('onReady', function(event) {
      event.target.mute();
      event.target.playVideo();
    });
    youtubePlayer.addEventListener('onStateChange', function(event) {
      switch (event.data) {
        case -1:
          // unstarted
          event.target.mute();
          break;
        case 0:
          // video is over, replay
          event.target.playVideo();
          break;
        case 1:
          // video is playing, set wrapepr opecity to 1
          $(event.target.getIframe())
            .closest('[data-video-autoplay]')
            .css('opacity', '1');
          break;
      }
    });
    return youtubePlayer;
  }

  function _vimeoBackground(player) {
    player.play().then(() => {
      // The video is playing
      $(player.element)
        .closest('[data-video-autoplay]')
        .css('opacity', '1');
    }).catch((e) => {
      console.log(e);
    });
    player.setLoop(true);
    return player;
  }

  register('video', [videoSection, parallaxImage, scrollButton]);

  const selectors$c = {
    imageTitle: '[data-page-image-title]',
    defaultTitle: '[data-page-default-title]',
    noTitleClass: 'has-no-title',
  };

  class Page {
    constructor(el) {
      this.container = el;
      this.imageTitle = this.container.querySelector(selectors$c.imageTitle);
      if (!this.imageTitle) {
        this.container.parentElement.classList.add(selectors$c.noTitleClass);
      }
    }
  }

  const pageSection = {
    onLoad() {
      new Page(this.container);
    },
  };

  register('page', [pageSection, parallaxImage]);

  const selectors$d = {
    accordionToggle: 'data-accordion-toggle',
    accordionWrappper: '[data-accordion]',
    block: 'data-accordion-block',
    focusable: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  };

  const classes$7 = {
    isVisible: 'is-visible',
  };

  let sections$a = {};

  class Accordion {
    constructor(el) {
      this.accordion = el;
      this.wrapper = el.closest(selectors$d.wrapper);
      this.key = this.accordion.id;
      const btnSelector = `[${selectors$d.accordionToggle}='${this.key}']`;
      this.trigger = document.querySelector(btnSelector);
      this.children = this.accordion.querySelectorAll(':scope > *');

      this.trigger.setAttribute('aria-haspopup', true);
      this.trigger.setAttribute('aria-expanded', false);
      this.trigger.setAttribute('aria-controls', this.key);

      this.clickEvents();
      this.staggerChildAnimations();
    }
    clickEvents() {
      this.trigger.addEventListener('click', function() {
        this.toggleState();
      }.bind(this));
    }
    keyboardEvents() {
      this.trigger.addEventListener('keyup', function(evt) {
        if (evt.which !== window.theme.keyboardKeys.SPACE) { return; }
        this.showAccordion();
      }.bind(this));
      this.accordion.addEventListener('keyup', function(evt) {
        if (evt.which !== window.theme.keyboardKeys.ESCAPE) { return; }
        this.hideAccordion();
        this.buttons[0].focus();
      }.bind(this));
    }
    staggerChildAnimations() {
      this.children.forEach((child, index) => {
        child.style.transitionDelay = `${((index * 80) + 10)}ms`;
      });
    }
    toggleState() {
      if (this.accordion.classList.contains(classes$7.isVisible)) {
        this.hideAccordion();
      } else {
        this.showAccordion();
      }
    }
    hideAccordion() {
      this.accordion.classList.remove(classes$7.isVisible);
      this.trigger.classList.remove(classes$7.isVisible);
    }
    showAccordion() {
      this.accordion.classList.add(classes$7.isVisible);
      this.trigger.classList.add(classes$7.isVisible);
    }
    onBlockSelect(evt) {
      console.log(evt);
      if (this.accordion.contains(evt.target)) {
        this.showAccordion();
      }
    }
    onBlockDeselect(evt) {
      if (this.accordion.contains(evt.target)) {
        this.hideAccordion();
      }
    }
  }

  const accordion = {
    onLoad() {
      sections$a[this.id] = [];
      const els = this.container.querySelectorAll(selectors$d.accordionWrappper);
      els.forEach(el => {
        sections$a[this.id].push(new Accordion(el));
      });
    },
    onUnload: function() {
      sections$a[this.id].forEach(el => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
    },
    onBlockSelect(evt) {
      sections$a[this.id].forEach(el => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockSelect(evt);
        }
      });
    },
    onBlockDeselect(evt) {
      sections$a[this.id].forEach(el => {
        if (typeof el.onBlockDeselect === 'function') {
          el.onBlockDeselect(evt);
        }
      });
    },
  };

  register('page-faq', accordion);

  register('hero', [parallaxImage, scrollButton]);

  register('double', parallaxImage);

  const slideshowSection = {
    onLoad() {
      let slideshowSelector = '#slideshow-' + this.id;
      const $slideshow = $(slideshowSelector);
      const $container = $(this.container);

      $slideshow.slick({
        autoplay: $slideshow.data('autoplay'),
        autoplaySpeed: $slideshow.data('speed'),
        prevArrow: $container.find('[data-prev-arrow]'),
        nextArrow: $container.find('[data-next-arrow]'),
        adaptiveHeight: false,
        dots: false,
      });
    },
    onUnload() {
      // let slideshowSelector = '#slideshow-' + this.id;
      // delete theme.slideshows[this.slideshowSelector];
    },
    onBlockSelect(evt) {
      let $slideshow = $('#slideshow-' + this.id);

      // Ignore the cloned version
      let $slide = $(
        '.slideshow__slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      let slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      $slideshow.slick('slickGoTo', slideIndex).slick('slickPause');
    },
  };

  register('slideshow', [slideshowSection, parallaxImage, scrollButton]);

  const collectionSliderSection = {

    onLoad() {

      let collectionSliderSelector = '.collection-slider';

      const $collectionSlider = $(collectionSliderSelector);
      const $container = $(this.container);

      $collectionSlider.each(function(index, element){

        var slickOptions = {
          autoplay: $(element).data('autoplay'),
          autoplaySpeed: $(element).data('speed'),
          prevArrow: $(element).parent().find('[data-prev-arrow]'),
          nextArrow: $(element).parent().find('[data-next-arrow]'),
          arrows: true,
          adaptiveHeight: false,
          dots: false
        };

        if (window.innerWidth < 480) {
          slickOptions.slidesToShow = 2;
          slickOptions.slidesToScroll = 1;
        }
        else {
          slickOptions.slidesToShow = 4;
          slickOptions.slidesToScroll = 4;
        };

        $(element).slick(slickOptions);

      });

      tabs(this.container);

    },

    onUnload() {
      // let collectionSliderSelector = '#collection-slider-' + this.id;
      // delete theme.slideshows[this.collectionSliderSelector];
    },

    onBlockSelect(evt) {

      console.log(evt);

    },
  };

  register('collection-slider', [collectionSliderSection]);

  const selectors$e = {
    padding: 'data-padding',
    active: 'isActive',
    disabled: 'gallery--disabled',
    section: '[data-section-type]',
    enabled: '[data-gallery-enabled]',
  };

  class Lookbook {
    constructor(el) {
      this.section = el;

      this.outer = this.section.parentNode;
      this.inner = this.section.querySelector(selectors$e.enabled);
      if (this.inner) {
        // section is enabled
        this.outer.classList.add(selectors$e.active);
      }
      this.findNext(this.outer);
    }
    findNext(startingPoint) {
      const outer = startingPoint.nextElementSibling;
      if (outer === null) {
        // last section on page
        return;
      }
      const inner = outer.querySelector(selectors$e.enabled);
      if (inner === null) {
        // next section is diabled keep going
        outer.classList.add(selectors$e.disabled);
        this.findNext(outer);
      } else {
        // Found a neighbor
        this.nextOuter = outer;
        this.subtractPadding();
      }
    }
    subtractPadding() {
      this.padded = (this.section.getAttribute(selectors$e.padding) !== 'false');
      this.nextPadded = (this.nextOuter.querySelector(selectors$e.section).getAttribute(selectors$e.padding) !== 'false');
      if (this.padded && this.nextPadded) {
        const paddedSection = this.nextOuter.querySelector(selectors$e.enabled);
        if (paddedSection) {
          paddedSection.style.setProperty('padding-top', '0px');
        }
      }
    }
  }

  const lookbookSection = {
    onLoad() {
      new Lookbook(this.container);
    },
  };

  const gallerySection = {
    onLoad() {
      popupVideo(this.container);
      galleryZoom(this.container);
    },
  };

  register('gallery', [lookbookSection, gallerySection]);
  register('gallery-text', lookbookSection);

  function Listeners() {
    this.entries = [];
  }

  Listeners.prototype.add = function(element, event, fn) {
    this.entries.push({ element: element, event: event, fn: fn });
    element.addEventListener(event, fn);
  };

  Listeners.prototype.removeAll = function() {
    this.entries = this.entries.filter(function(listener) {
      listener.element.removeEventListener(listener.event, listener.fn);
      return false;
    });
  };

  /**
   * Returns a product JSON object when passed a product URL
   * @param {*} url
   */

  /**
   * Convert the Object (with 'name' and 'value' keys) into an Array of values, then find a match & return the variant (as an Object)
   * @param {Object} product Product JSON object
   * @param {Object} collection Object with 'name' and 'value' keys (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
   * @returns {Object || null} The variant object once a match has been successful. Otherwise null will be returned
   */
  function getVariantFromSerializedArray(product, collection) {
    _validateProductStructure(product);

    // If value is an array of options
    var optionArray = _createOptionArrayFromOptionCollection(product, collection);
    return getVariantFromOptionArray(product, optionArray);
  }

  /**
   * Find a match in the project JSON (using Array with option values) and return the variant (as an Object)
   * @param {Object} product Product JSON object
   * @param {Array} options List of submitted values (e.g. ['36', 'Black'])
   * @returns {Object || null} The variant object once a match has been successful. Otherwise null will be returned
   */
  function getVariantFromOptionArray(product, options) {
    _validateProductStructure(product);
    _validateOptionsArray(options);

    var result = product.variants.filter(function(variant) {
      return options.every(function(option, index) {
        return variant.options[index] === option;
      });
    });

    return result[0] || null;
  }

  /**
   * Creates an array of selected options from the object
   * Loops through the project.options and check if the "option name" exist (product.options.name) and matches the target
   * @param {Object} product Product JSON object
   * @param {Array} collection Array of object (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
   * @returns {Array} The result of the matched values. (e.g. ['36', 'Black'])
   */
  function _createOptionArrayFromOptionCollection(product, collection) {
    _validateProductStructure(product);
    _validateSerializedArray(collection);

    var optionArray = [];

    collection.forEach(function(option) {
      for (var i = 0; i < product.options.length; i++) {
        var name = product.options[i].name || product.options[i];
        if (name.toLowerCase() === option.name.toLowerCase()) {
          optionArray[i] = option.value;
          break;
        }
      }
    });

    return optionArray;
  }

  /**
   * Check if the product data is a valid JS object
   * Error will be thrown if type is invalid
   * @param {object} product Product JSON object
   */
  function _validateProductStructure(product) {
    if (typeof product !== 'object') {
      throw new TypeError(product + ' is not an object.');
    }

    if (Object.keys(product).length === 0 && product.constructor === Object) {
      throw new Error(product + ' is empty.');
    }
  }

  /**
   * Validate the structure of the array
   * It must be formatted like jQuery's serializeArray()
   * @param {Array} collection Array of object [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }]
   */
  function _validateSerializedArray(collection) {
    if (!Array.isArray(collection)) {
      throw new TypeError(collection + ' is not an array.');
    }

    if (collection.length === 0) {
      throw new Error(collection + ' is empty.');
    }

    if (collection[0].hasOwnProperty('name')) {
      if (typeof collection[0].name !== 'string') {
        throw new TypeError(
          'Invalid value type passed for name of option ' +
            collection[0].name +
            '. Value should be string.'
        );
      }
    } else {
      throw new Error(collection[0] + 'does not contain name key.');
    }
  }

  /**
   * Validate the structure of the array
   * It must be formatted as list of values
   * @param {Array} collection Array of object (e.g. ['36', 'Black'])
   */
  function _validateOptionsArray(options) {
    if (Array.isArray(options) && typeof options[0] === 'object') {
      throw new Error(options + 'is not a valid array of options.');
    }
  }

  var selectors$f = {
    idInput: '[name="id"]',
    optionInput: '[name^="options"]',
    quantityInput: '[name="quantity"]',
    propertyInput: '[name^="properties"]'
  };

  // Public Methods
  // -----------------------------------------------------------------------------

  /**
   * Returns a URL with a variant ID query parameter. Useful for updating window.history
   * with a new URL based on the currently select product variant.
   * @param {string} url - The URL you wish to append the variant ID to
   * @param {number} id  - The variant ID you wish to append to the URL
   * @returns {string} - The new url which includes the variant ID query parameter
   */

  function getUrlWithVariant(url, id) {
    if (/variant=/.test(url)) {
      return url.replace(/(variant=)[^&]+/, '$1' + id);
    } else if (/\?/.test(url)) {
      return url.concat('&variant=').concat(id);
    }

    return url.concat('?variant=').concat(id);
  }

  /**
   * Constructor class that creates a new instance of a product form controller.
   *
   * @param {Element} element - DOM element which is equal to the <form> node wrapping product form inputs
   * @param {Object} product - A product object
   * @param {Object} options - Optional options object
   * @param {Function} options.onOptionChange - Callback for whenever an option input changes
   * @param {Function} options.onQuantityChange - Callback for whenever an quantity input changes
   * @param {Function} options.onPropertyChange - Callback for whenever a property input changes
   * @param {Function} options.onFormSubmit - Callback for whenever the product form is submitted
   */
  function ProductForm(element, product, options) {
    this.element = element;
    this.product = _validateProductObject(product);

    options = options || {};

    this._listeners = new Listeners();
    this._listeners.add(
      this.element,
      'submit',
      this._onSubmit.bind(this, options)
    );

    this.optionInputs = this._initInputs(
      selectors$f.optionInput,
      options.onOptionChange
    );

    this.quantityInputs = this._initInputs(
      selectors$f.quantityInput,
      options.onQuantityChange
    );

    this.propertyInputs = this._initInputs(
      selectors$f.propertyInput,
      options.onPropertyChange
    );
  }

  /**
   * Cleans up all event handlers that were assigned when the Product Form was constructed.
   * Useful for use when a section needs to be reloaded in the theme editor.
   */
  ProductForm.prototype.destroy = function() {
    this._listeners.removeAll();
  };

  /**
   * Getter method which returns the array of currently selected option values
   *
   * @returns {Array} An array of option values
   */
  ProductForm.prototype.options = function() {
    return _serializeInputValues(this.optionInputs, function(item) {
      var regex = /(?:^(options\[))(.*?)(?:\])/;
      item.name = regex.exec(item.name)[2]; // Use just the value between 'options[' and ']'
      return item;
    });
  };

  /**
   * Getter method which returns the currently selected variant, or `null` if variant
   * doesn't exist.
   *
   * @returns {Object|null} Variant object
   */
  ProductForm.prototype.variant = function() {
    return getVariantFromSerializedArray(this.product, this.options());
  };

  /**
   * Getter method which returns a collection of objects containing name and values
   * of property inputs
   *
   * @returns {Array} Collection of objects with name and value keys
   */
  ProductForm.prototype.properties = function() {
    return _serializeInputValues(this.propertyInputs, function(item) {
      var regex = /(?:^(properties\[))(.*?)(?:\])/;
      item.name = regex.exec(item.name)[2]; // Use just the value between 'properties[' and ']'
      return item;
    });
  };

  /**
   * Getter method which returns the current quantity or 1 if no quantity input is
   * included in the form
   *
   * @returns {Array} Collection of objects with name and value keys
   */
  ProductForm.prototype.quantity = function() {
    return this.quantityInputs[0]
      ? Number.parseInt(this.quantityInputs[0].value, 10)
      : 1;
  };

  // Private Methods
  // -----------------------------------------------------------------------------
  ProductForm.prototype._setIdInputValue = function(value) {
    var idInputElement = this.element.querySelector(selectors$f.idInput);

    if (!idInputElement) {
      idInputElement = document.createElement('input');
      idInputElement.type = 'hidden';
      idInputElement.name = 'id';
      this.element.appendChild(idInputElement);
    }

    idInputElement.value = value.toString();
  };

  ProductForm.prototype._onSubmit = function(options, event) {
    event.dataset = this._getProductFormEventData();

    this._setIdInputValue(event.dataset.variant.id);

    if (options.onFormSubmit) {
      options.onFormSubmit(event);
    }
  };

  ProductForm.prototype._onFormEvent = function(cb) {
    if (typeof cb === 'undefined') {
      return Function.prototype;
    }

    return function(event) {
      event.dataset = this._getProductFormEventData();
      cb(event);
    }.bind(this);
  };

  ProductForm.prototype._initInputs = function(selector, cb) {
    var elements = Array.prototype.slice.call(
      this.element.querySelectorAll(selector)
    );

    return elements.map(
      function(element) {
        this._listeners.add(element, 'change', this._onFormEvent(cb));
        return element;
      }.bind(this)
    );
  };

  ProductForm.prototype._getProductFormEventData = function() {
    return {
      options: this.options(),
      variant: this.variant(),
      properties: this.properties(),
      quantity: this.quantity()
    };
  };

  function _serializeInputValues(inputs, transform) {
    return inputs.reduce(function(options, input) {
      if (
        input.checked || // If input is a checked (means type radio or checkbox)
        (input.type !== 'radio' && input.type !== 'checkbox') // Or if its any other type of input
      ) {
        options.push(transform({ name: input.name, value: input.value }));
      }

      return options;
    }, []);
  }

  function _validateProductObject(product) {
    if (typeof product !== 'object') {
      throw new TypeError(product + ' is not an object.');
    }

    if (typeof product.variants[0].options === 'undefined') {
      throw new TypeError(
        'Product object is invalid. Make sure you use the product object that is output from {{ product | json }} or from the http://[your-product-url].js route'
      );
    }

    return product;
  }

  const selectors$g = {
    addDrawerWrapper: '[data-product-add-popdown-wrapper]',
    addDrawerTemplate: '[data-product-add-popdown-template]',
  };

  var $drawer = $(selectors$g.addDrawerWrapper);
  var source = $(selectors$g.addDrawerTemplate).html();
  var template = {};
  var globalTimer;

  function largePopdown(form_data) {
    $.ajax({
      type: 'POST',
      url: '/cart/add.js',
      dataType: 'json',
      data: form_data,
      error: addError,
      success: addSuccess,
      complete: updateHeaderTotal,
    });
  }

  var updateHeaderTotal = function() {
    window.fetch('/cart.js')
      .then(handleErrors)
      .then(response => {
        return response.json();
      })
      .then(response => {
        document.dispatchEvent(new CustomEvent('theme:cart:change', {
          detail: {
            cart: response,
          },
          bubbles: true,
        }));
      })
      .catch(e => {
        console.error(e);
      });
  };
  function handleErrors(response) {
    if (!response.ok) {
      return response.json().then(function(json) {
        const e = new FetchError({
          status: response.statusText,
          headers: response.headers,
          json: json,
        });
        throw e;
      });
    }
    return response;
  }
  function FetchError(object) {
    this.status = object.status || null;
    this.headers = object.headers || null;
    this.json = object.json || null;
    this.body = object.body || null;
  }
  FetchError.prototype = Error.prototype;


  var addError = function(object) {
    var errors = '<div class="errors">' + object.responseJSON.description + '</div>';
    $drawer.empty();
    $drawer.append(errors);
    $drawer.addClass('has-errors is-visible');
    popdown();
  };
  var addSuccess = function(variant) {
    var image = themeImages.getSizedImageUrl(variant.image, '360x360');
    var productObject = {
      product_title: variant.product_title,
      product_image: image,
      quantity: variant.quantity,
      price: themeCurrency.formatMoney(variant.price, theme.moneyFormat),
    };
    $drawer.empty();
    template = Sqrl.render(source, productObject);
    $drawer.append(template);

    // Popover should be just below header
    var minHeight = $('[data-header-wrapper').outerHeight() + $('[data-announcement-wrapper]').outerHeight();
    $drawer.attr('style', '');
    $drawer.css('min-height', minHeight);

    $drawer.addClass('is-visible');
    popdown();
  };
  var popdown = function() {
    clearTimeout(globalTimer);
    globalTimer = setTimeout(() => {
      $drawer.removeClass('is-visible').removeClass('has-errors');
    }, 5000);
  };
  $drawer.on('click', '[data-close-popdown]', () => {
    $drawer.removeClass('is-visible').removeClass('has-errors');
  });

  function tabs(container) {

    tabsListener(container);
    accordion$1(container);
    tabsSpaceCheck(container);

    $(window).on(
      'resize',
      debounce(function() {
        tabsSpaceCheck(container);
      }, 200),
    );
  }

  function destroyTabs(container) {
    $('ul.tabs > li', container).off();
    $('.accordion-toggle', container).off();
  }

  function tabsListener(container) {
    $('.tab-content-0', container).addClass('current');
    $('.tab-link-0', container).addClass('current');

    $('ul.tabs > li', container).click(function() {

      var tab_id = $(this).attr('data-tab');

      $('ul.tabs > li', container).removeClass('current');
      $('.tab-content', container).removeClass('current');
      $(this).addClass('current');

      $('.tab-content-' + tab_id, container).addClass('current');
      $('.tab-content-' + tab_id, container).find('.collection-slider').get(0).slick.setPosition()

    });
  }
  function accordion$1(container) {
    // mobile accordion for tabs content
    $('.accordion-toggle', container).click(function() {
      if (
        $(this)
          .next('div')
          .is(':visible')
      ) {
        $(this)
          .next('div')
          .slideUp('fast');
        $(this).removeClass('accordionExpanded');
      } else {
        $(this)
          .next('div')
          .slideDown('fast');
        $(this).addClass('accordionExpanded');
      }
    });
  }
  function tabsSpaceCheck(container) {
    var tabsWidth = 0;
    $('.tab-link').each(function() {
      tabsWidth += parseInt($(this).width(), 10);
    });
    // 10 is our padding buffer, if it's that close go for accordion
    var tabsWrapper = $('.productTabsWrapper', container).width() - 10;
    if (tabsWidth >= tabsWrapper) {
      $('.product-tabs', container).css({
        position: 'absolute',
        left: '-9999px',
        display: 'table',
      });
      $('.product-accordion', container).show();
    } else {
      $('.product-tabs', container).removeAttr('style');
      $('.product-accordion', container).hide();
    }
  }

  var modelJsonSections = {};
  var models = {};

  function initSectionModels(modelViewerContainers, sectionId) {
    modelJsonSections[sectionId] = {
      loaded: false,
    };

    modelViewerContainers.each(function(index) {
      var $modelViewerContainer = $(this);
      var mediaId = $modelViewerContainer.data('media-id');
      var $modelViewerElement = $($modelViewerContainer.find('model-viewer')[0]);

      var modelId = $modelViewerElement.data('model-id');

      if (index === 0) {
        var $xrButton = $modelViewerContainer
          .closest('[data-product-wrapper]')
          .find('[data-shopify-xr]');
      }

      models[mediaId] = {
        modelId: modelId,
        mediaId: mediaId,
        sectionId: sectionId,
        $container: $modelViewerContainer,
        $element: $modelViewerElement,
      };
    });

    window.Shopify.loadFeatures([
      {
        name: 'shopify-xr',
        version: '1.0',
        onLoad: setupShopifyXr,
      },
      {
        name: 'model-viewer-ui',
        version: '1.0',
        onLoad: setupModelViewerUi,
      },
    ]);
  }

  function setupShopifyXr(errors) {
    if (errors) {
      console.warn(errors);
      return;
    }
    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', function() {
        setupShopifyXr();
      });
      return;
    }

    for (var sectionId in modelJsonSections) {
      if (modelJsonSections.hasOwnProperty(sectionId)) {
        var modelSection = modelJsonSections[sectionId];
        if (modelSection.loaded) { continue; }

        var $modelJson = $('#ModelJson-' + sectionId);
        if ($modelJson.length) {
          window.ShopifyXR.addModels(JSON.parse($modelJson.html()));
          modelSection.loaded = true;
        }
      }
    }
    window.ShopifyXR.setupXRElements();
  }

  function setupModelViewerUi(errors) {
    if (errors) {
      console.warn(errors);
      return;
    }

    for (var key in models) {
      if (models.hasOwnProperty(key)) {
        var model = models[key];
        if (!model.modelViewerUi) {
          model.modelViewerUi = new Shopify.ModelViewerUI(model.$element[0]);
        }
        setupModelViewerListeners(model);
      }
    }
  }

  function setupModelViewerListeners(model) {
    model.$container
      .on('pause', function() {
        if (model.modelViewerUi.pause) { model.modelViewerUi.pause(); }
      })
      .on('play-desktop', function() {
        if (model.modelViewerUi.play && !isTouch()) { model.modelViewerUi.play(); }
      })
      .on('play', function() {
        if (model.modelViewerUi.play) { model.modelViewerUi.play(); }
      });
  }

  async function productNativeVideo(uniqueKey) {
    const $player = $(`[data-player="${uniqueKey}"]`);
    const $playerElement = $player.find('video');
    const videoLoad = {
      name: 'video-ui',
      version: '1.0',
    };
    await loadScript(videoLoad);

    const player = new window.Shopify.Plyr($playerElement[0]);
    $player.on('pause', function() {
      if (player.pause) { player.pause(); }
    });
    $player.on('play-desktop', function() {
      if (player.play && !isTouch()) { $player.trigger('play'); }
    });
    $player.on('play', function() {
      try {
        if (player.play) {
          player.play();
        } else {
          player.addEventListener('onReady', function(event) {
            event.target.play();
          });
        }
      } catch (e) {
        console.warn(e);
      }
    });
    $player.on('destroy', function() {
      try {
        if (player.destroy) {
          player.destroy();
        }
      } catch (e) {
        console.warn(e);
      }
    });
    return player;
  }

  var selectors$h = {
    productSlideshow: '[data-product-slideshow]',
    productThumbs: '[data-product-thumbs]',
    productImage: '[data-product-image]',
    mediaSlide: '[data-media-slide]',
    videoPlayerExternal: '[data-type="external_video"]',
    videoPlayerNative: '[data-type="video"]',
    modelViewer: '[data-type="model"]',
    allPlayers: '[data-player]',
    xrButton: '[data-shopify-xr]',
    xrButtonId: 'data-shopify-model3d-id',
  };

  var thumbIcons = {
    model:
      '<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-media-model" viewBox="0 0 26 26"><path d="M1 25h24V1H1z"/><path class="icon-media-model-outline" d="M.5 25v.5h25V.5H.5z" fill="none"/><path class="icon-media-model-element" d="M19.13 8.28L14 5.32a2 2 0 0 0-2 0l-5.12 3a2 2 0 0 0-1 1.76V16a2 2 0 0 0 1 1.76l5.12 3a2 2 0 0 0 2 0l5.12-3a2 2 0 0 0 1-1.76v-6a2 2 0 0 0-.99-1.72zm-6.4 11.1l-5.12-3a.53.53 0 0 1-.26-.38v-6a.53.53 0 0 1 .27-.46l5.12-3a.53.53 0 0 1 .53 0l5.12 3-4.72 2.68a1.33 1.33 0 0 0-.67 1.2v6a.53.53 0 0 1-.26 0z" opacity=".6" style="isolation:isolate"/></svg>',
    video:
      '<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-media-video" viewBox="0 0 26 26"><path fill-rule="evenodd" clip-rule="evenodd" d="M1 25h24V1H1v24z"/><path class="icon-media-video-outline" d="M.5 25v.5h25V.5H.5V25z"/><path class="icon-media-video-element" fill-rule="evenodd" clip-rule="evenodd" d="M9.718 6.72a1 1 0 0 0-1.518.855v10.736a1 1 0 0 0 1.562.827l8.35-5.677a1 1 0 0 0-.044-1.682l-8.35-5.06z" opacity=".6"/></svg>',
    external_video:
      '<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-media-video" viewBox="0 0 26 26"><path fill-rule="evenodd" clip-rule="evenodd" d="M1 25h24V1H1v24z"/><path class="icon-media-video-outline" d="M.5 25v.5h25V.5H.5V25z"/><path class="icon-media-video-element" fill-rule="evenodd" clip-rule="evenodd" d="M9.718 6.72a1 1 0 0 0-1.518.855v10.736a1 1 0 0 0 1.562.827l8.35-5.677a1 1 0 0 0-.044-1.682l-8.35-5.06z" opacity=".6"/></svg>',
  };

  class Media {
    constructor(section) {
      this.section = section;
      this.$container = $(section.container);
      this.selectors = selectors$h;
    }
    init() {
      this.detectVideo();
      this.detectYouTube();
      this.detect3d();
      this.createSlider();
    }
    createSlider() {
      var instance = this;
      const $slideshow = $(selectors$h.productSlideshow, this.$container);
      $slideshow
        .on('beforeChange', function(event, slick, currentSlide) {
          const $currentMedia = $(slick.$slides[currentSlide]).find(selectors$h.mediaSlide);
          $currentMedia.trigger('pause');
        })
        .on('afterChange', function(event, slick, currentSlide) {
          const $currentMedia = $(slick.$slides[currentSlide]).find(selectors$h.mediaSlide);
          const mediaType = $currentMedia[0].dataset.type;
          const isFocusEnabled = $('body').hasClass('focus-enabled');
          $currentMedia.trigger('play-desktop');
          // disable swipe on 3d models and videos
          if (mediaType === 'image' && isTouch()) {
            // fisrt boolean sets value, second option false to prevent refresh
            slick.slickSetOption('swipe', true, false);
          } else {
            slick.slickSetOption('swipe', false, false);
          }

          if (mediaType === 'model') {
            // change button to launch new model
            var newModel = $currentMedia[0].dataset.mediaId;
            $(selectors$h.xrButton, instance.container).attr(selectors$h.xrButtonId, newModel);
          }

          // slick bug, don't hide inactive thumbs from tab-through
          $('.slick-dots li', this.$container).attr('aria-hidden', false);

          if (isFocusEnabled) {
            $currentMedia.focus();
          }
        });

      // if the first element is a model or video, disable swipe
      $slideshow.on('init', function(event, slick) {
        var firstType = $(slick.$slides[0]).find(selectors$h.mediaSlide)[0].dataset.type;
        const $productThumbImages = instance.$container.find('[data-thumbnail]');

        // slick bug, don't hide inactive thumbs from tab-through
        $('.slick-dots li', this.$container).attr('aria-hidden', false);

        // Only swipe on image slides when screen is small
        if (firstType === 'image' && window.innerWidth < 768) {
          slick.slickSetOption('swipe', true, false);
        }

        $productThumbImages
          .on('click', function(e) {
            e.preventDefault();
          })
          .on('keyup', function(e) {
            // On keypress Enter move the focus to the first focusable element in the related slide
            if (e.keyCode === 13) {
              var mediaId = $(this).data('media-id');
              $(slick.$slides)
                .filter(`[data-media-id="${mediaId}"]`)
                .find('model-viewer, video, iframe')
                .eq(0)
                .focus()
                .select();
            }
          });
      });
      $slideshow.slick({
        focusOnSelect: true,
        adaptiveHeight: true,
        dots: true,
        arrows: false,
        accessibility: false,
        fade: true,
        swipe: false,
        speed: 500,
        cssEase: 'linear',
        // eslint-disable-next-line
        appendDots: $(selectors$h.productThumbs, this.$container),
        customPaging: function(slider, i) {
          var $media = $(slider.$slides[i]).find(selectors$h.mediaSlide);
          var type = $media.data('type');
          var mediaId = $media.data('media-id');
          var thumb = $media.data('thumb');
          var thumbAlt = $media.attr('aria-label');
          var thumbIcon = thumbIcons[type] ? thumbIcons[type] : '';
          var tag = `<a href="${thumb}" class="thumb--${type}" data-thumbnail data-media-id="${mediaId}">
            <img alt="${thumbAlt}" src="${thumb}">${thumbIcon}
           </a>`;
          return tag;
        },
      });
    }
    detect3d() {
      var $modelViewerElements = $(selectors$h.modelViewer, this.$container);
      if ($modelViewerElements.length) {
        initSectionModels($modelViewerElements, this.section.id);
        const instance = this;
        $(document).on('shopify_xr_launch', function() {
          $(selectors$h.allPlayers, instance.container).trigger('pause');
        });
      }
    }
    detectVideo() {
      const playerElements = this.section.container.querySelectorAll(selectors$h.videoPlayerNative);
      for (var player of playerElements) {
        const uniqueKey = player.dataset.player;
        const nativePlayerPromise = productNativeVideo(uniqueKey);
        if (this.section.settings.enable_video_looping === true) {
          nativePlayerPromise.then((nativePlayer) => {
            nativePlayer.loop = true;
            return nativePlayer;
          }).catch((err) => {
            console.error(err);
          });
        }
      }
    }
    detectYouTube() {
      const playerElements = this.section.container.querySelectorAll(selectors$h.videoPlayerExternal);
      for (var player of playerElements) {
        const uniqueKey = player.dataset.player;
        const youtubePlayerPromise = embedYoutube(uniqueKey);
        if (this.section.settings.enable_video_looping === true) {
          youtubePlayerPromise.then((youtubePlayer) => {
            return _setToLoop(youtubePlayer);
          }).catch((err) => {
            console.error(err);
          });
        }
      }
    }
    pauseOtherMedia(uniqueKey) {
      const $currentMedia = $(`[data-media-slide][data-player="${uniqueKey}"]`, this.container);
      const $otherMedia = $('[data-media-slide]').not($currentMedia);
      $otherMedia.trigger('pause');
    }
    destroy() {
      $('[data-player]', this.container).trigger('destroy');
    }
  }

  function _setToLoop(youtubePlayer) {
    youtubePlayer.addEventListener('onStateChange', function(event) {
      if (event.data === 0) {
        // video is over, replay
        event.target.playVideo();
      }
    });
    return youtubePlayer;
  }

  const selectors$i = {
    productForm: '[data-product-form]',
    productJson: '[data-product-json]',
    optionsJson: '[data-product-options-json]',
    productImage: '[data-product-img]',
    productThumbs: '[data-product-thumbs]',
    addToCart: '[data-add-to-cart]',
    radioName: '[data-option-name]',
    addToCartText: '[data-add-to-cart-text]',
    productPrice: '[data-product-price]',
    buttonPrice: '[data-button-price]',
    comparePrice: '[data-compare-price]',
    productSlideshow: '[data-product-slideshow]',
    unitPrice: '[data-product-unit-price]',
    unitBase: '[data-product-base]',
    unitWrapper: '[data-product-unit]',
    quantityInput: '[data-quantity-input]',
    popupButton: '[data-toggle-product-modal]',
    idInput: '[name="id"]',
    trustMarks: '[data-trustmarks]',
    bestlook: '[data-bestlook]',
  };


  var variant = {};
  window.theme = window.theme || {};


  class ProductTemplate {
    constructor(section) {
      this.id = section.id;
      this.container = section.container;
      this.settings = section.settings;
      this.productFormElement = this.container.querySelector(selectors$i.productForm);

      const productJSON = this.container.querySelector(selectors$i.productJson);
      const optionsJSON = this.container.querySelector(selectors$i.optionsJson);
      if (productJSON && productJSON.innerHTML !== '') {
        this.product = JSON.parse(productJSON.innerHTML);
        this.options = JSON.parse(optionsJSON.innerHTML).options;
      } else {
        console.error('Missing product JSON');
        return;
      }

      this.init();
    }
    init() {

      this.initializeForm();
      this.quantitySelectors();

      this.initBestlook();

      this.hasUnitPricing = (this.container.querySelector(selectors$i.unitWrapper) !== null);

      if (this.settings.swatches_enable) {
        this.swatchButtons();
      }
      if (this.settings.zoom_enable) {
        productZoom(this.container, this.product);
      }

      this.ajaxAddListner();

      // for history state url load
      updateImages(variant, this.container);
      this.customHook(variant);
    }
    customHook(variant) {
      this.container.dispatchEvent(new CustomEvent('theme:variant:change', {
        detail: {
          variant: variant,
        },
        bubbles: true,
      }));
    }
    onOptionChange(event) {
      variant = event.dataset.variant;
      updatePrices(variant, this.container);
      if (this.hasUnitPricing) {
        updateProductUnits(variant, this.container);
      }
      updateImages(variant, this.container);
      updateButtonPrice(variant, this.container);
      updateHiddenSelect(variant, this.container);
      updateRadioNames(variant, this.container);
      updateRemaining(variant, this.container);
      updateHistoryState(variant);
      updateTrustBanners(variant);
      this.customHook(variant);
    }
    onQuantityChange(event) {
      variant = event.dataset.variant;
      updateButtonPrice(variant, this.container);
    }
    ajaxAddListner() {
      $(selectors$i.addToCart, this.container).on('click', function(evt) {
        var isFocusEnabled = $('body').hasClass('focus-enabled');
        if (isFocusEnabled) {
          return;
        }
        evt.preventDefault();
        var $form = $(this).closest('form');
        var form_serialized = $form.serializeArray();
        if ($form.find('[type="file"]').length) {
          return;
        }
        var form_object = {};
        $.map(form_serialized, function(val) {
          form_object[val.name] = val.value;
        });
        largePopdown(form_object);
      });
    }
    swatchButtons() {
      const labelsArray = window.theme.strings.swatchesKey
        .split(',')
        .map(s => s.trim());
      labelsArray.forEach(label => {
        var element = this.container.querySelector(`[data-select-label~="${label}" i]`);
        if (element) {
          this.newSwatch(label, element);
        }
      });
    }
    async newSwatch(label, element) {
      var position = parseInt(element.getAttribute('data-select-position'), 10);
      var tooltip = `data-tooltip-${this.product.id}-${getRandomInt$1(1, 20)}`;
      position--; // shopify positions are not zero based
      var legend = `<legend class="radio__legend">
                    <span class="radio__legend__label">${label}</span>
                    <span data-option-name>${variant.options[position]}</span>
                  </legend>`;
      var swatches = this.options[position].values;
      var swatchElement = document.createElement('fieldset');
      swatchElement.setAttribute('class', 'radio__fieldset radio__fieldset--swatch');
      swatchElement.innerHTML = legend;
      element.innerHTML = null;
      element.appendChild(swatchElement);
      for (var i = 0; i < swatches.length; i++) {
        var value = swatches[i];
        var swatch = await getSwatch(value);
        var hex = swatch.hex;
        let swatchImage = '';
        if (swatch.path) {
          swatchImage = ` background-image: url('${swatch.path}'); background-size: cover;`;
        }
        var id = `${label}[${value}]`;
        var checked = '';
        if (variant.options[position] === value) {
          checked = 'checked';
        }
        var option = `<span class="swatch__button" ${tooltip}>
        <input type="radio" name="options[${label}]" value="${value}" id="${id}" ${checked}>
        <label for="${id}" style="--swatch: ${hex}; ${swatchImage}" >
          <span class="visually-hidden">${value}</span>
        </label>
      </span>`;
        swatchElement.innerHTML += option;
      }
      const buttons = this.container.querySelectorAll(`[${tooltip}]`);
      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const pop = new Poppy({
          target: button,
          popover: `
          <div class="poppy__tooltip__wrapper">
            <div class="poppy__tooltip">
              ${swatches[i]}
            </div>
          </div>
        `,
          position: 'top',
          transitionSpeed: 200,
        });
        button.addEventListener('mouseenter', pop.pin);
        button.addEventListener('mouseleave', pop.unpin);
      }
      this.initializeForm();
      $('[data-split-select-wrapper]').removeClass('selector-wrapper--placeholder');
    }
    initBestlook() {

      const template = document.getElementById('bestlook-popover');

      tippy("#product-secondary-cta--bestlook", {
        content: template,
        theme: "brackish",
        placement: "bottom-end",
        trigger: "click",
        interactive: true
      });

      template.style.display = 'flex';

    }
    initializeForm() {
      if (typeof this.productForm !== 'undefined') {
        this.productForm.destroy();
      }
      this.productForm = new ProductForm(this.productFormElement, this.product, {
        onOptionChange: this.onOptionChange.bind(this),
        onQuantityChange: this.onQuantityChange.bind(this),
      });
      try {
        variant = this.productForm.variant();
      } catch (err) {
        // product has only one variant
        variant = this.productForm.product.variants[0];
      }
    }
    quantitySelectors() {
      // Setup listeners to add/subtract from the input
      $('.js-qty__adjust').off().on('click', function() {
        var $el = $(this);
        var $quantitySelector = $el.siblings('.js-qty__num');
        var quantity = getQuantity(this.quantity);
        if ($el.hasClass('js-qty__adjust--plus')) {
          quantity += 1;
        } else {
          quantity -= 1;
          if (quantity <= 1) {
            quantity = 1;
          }
        }
        // Update the input's number
        $quantitySelector.val(quantity).change();
        updateButtonPrice(variant, this.container);
      });
    }
  }


  function getQuantity(container) {
    var $quantityInput = $(selectors$i.quantityInput, container);
    var quantity = 1;
    if ($quantityInput.length) {
      quantity = parseInt($quantityInput.val().replace(/\D/g, ''), 10);
    }
    // Make sure we have a valid integer
    if (parseFloat(quantity) == parseInt(quantity, 10) && !isNaN(quantity)) ; else {
      // Not a number. Default to 1.
      quantity = 1;
    }
    return quantity;
  }

  function updateButtonPrice(variant, container) {
    if (variant) {
      var quantity = getQuantity(container);
      var quantityLabel = '';
      if (quantity > 1) {
        quantityLabel = `(${quantity})`;
      }
      var price = themeCurrency.formatMoney(variant.price * quantity, theme.moneyFormat);
      $(selectors$i.buttonPrice, container).html(`${price}&nbsp;${quantityLabel}`);
    }
  }

  function updateRadioNames(variant, container) {
    if (variant) {
      var $names = $(selectors$i.radioName, container);
      $names.each(function() {
        var $name = $(this);
        var position = $name.parents('[data-select-position]').attr('data-select-position');
        var index = parseInt(position, 10) - 1;
        var value = variant.options[index];
        $name.html(value);
      });
    }
  }

  function updateHiddenSelect(variant, container) {
    if (variant) {
      var idInputElement = container.querySelector(selectors$i.idInput);
      if (!idInputElement) {
        idInputElement = document.createElement('input');
        idInputElement.type = 'hidden';
        idInputElement.name = 'id';
        this.element.appendChild(idInputElement);
      }
      idInputElement.value = variant.id.toString();
    }
  }

  function updatePrices(variant, container) {

    if (variant) {
      // Select a valid variant if available
      if (variant.available) {
        // Available, enable the submit button, change text, show quantity elements
        $(selectors$i.addToCart, container).removeClass('disabled').prop('disabled', false);
        $(selectors$i.addToCartText, container).html(theme.strings.addToCart);
        $(container).removeClass('variant--soldout variant--unavailabe');
      } else {
        // Sold out, disable the submit button, change text, hide quantity elements
        $(selectors$i.addToCart, container).addClass('disabled').prop('disabled', true);
        $(selectors$i.addToCartText, container).html(theme.strings.soldOut);
        $(container).removeClass('variant--unavailabe').addClass('variant--soldout');
      }
      // Regardless of stock, update the product price
      $(selectors$i.productPrice, container).html(themeCurrency.formatMoney(variant.price, theme.moneyFormat));

      // Also update and show the product's compare price if necessary
      if (variant.compare_at_price > variant.price) {
        $(selectors$i.comparePrice, container).html(themeCurrency.formatMoney(variant.compare_at_price, theme.moneyFormat));
        $(selectors$i.comparePrice, container).closest('.compare-at').show();
        $(selectors$i.productPrice, container).closest('.product__price').addClass('on-sale');
      } else {
        $(selectors$i.comparePrice, container).closest('.compare-at').hide();
        $(selectors$i.productPrice, container).closest('.product__price').removeClass('on-sale');
      }
    } else {
      // The variant doesn't exist, disable submit button.
      // This may be an error or notice that a specific variant is not available.
      // To only show available variants, implement linked product options:
      //   - http://docs.shopify.com/manual/configuration/store-customization/advanced-navigation/linked-product-options
      $(selectors$i.addToCart, container).addClass('disabled').prop('disabled', true);
      $(selectors$i.addToCartText, container).html(theme.strings.unavailable);
      $(container).removeClass('variant--soldout').addClass('variant--unavailabe');
    }
  }

  // Change unit price for variants
  function updateProductUnits(variant, container) {
    if (typeof variant.unit_price !== 'undefined') {
      const price = themeCurrency.formatMoney(variant.unit_price, theme.moneyFormat);
      const base = getBaseUnit(variant);
      $(selectors$i.unitPrice, container).html(price);
      $(selectors$i.unitBase, container).html(base);
      $(selectors$i.unitWrapper, container).show();
    } else {
      $(selectors$i.unitWrapper, container).hide();
    }
  }

  function getBaseUnit(variant) {
    return variant.unit_price_measurement.reference_value === 1
    ? variant.unit_price_measurement.reference_unit
    : variant.unit_price_measurement.reference_value +
    variant.unit_price_measurement.reference_unit;
  }

  function updateImages(variant, container) {
    if (variant) {
      // Update variant image, if one is set
      if (variant.featured_media) {
        var $newImg = $('[data-image-id="' + variant.featured_media.id + '"]', container);
        var newPosition = $newImg.closest('.slick-slide:not(.slick-cloned)').attr('data-slick-index');
        // Slider not loaded
        if (newPosition === undefined) ; else {
          $(selectors$i.productSlideshow, container).slick('slickGoTo', newPosition);
        }
      }
    }
  }

  function updateHistoryState(variant) {
    const url = window.location.href;

    if (variant && url.includes('/product')) {
      const urlWithVariant = getUrlWithVariant(window.location.href, variant.id);
      window.history.replaceState({ path: urlWithVariant }, '', urlWithVariant);
    }
  }

  function updateTrustBanners(variant) {

    const copyInstock = $(selectors$i.trustMarks).data("trustmarks-copy-instock");
    const copyNostock = $(selectors$i.trustMarks).data("trustmarks-copy-nostock");
    const copyUnavailable = $(selectors$i.trustMarks).data("trustmarks-copy-unavailable");
    const copyShipsIn = $(selectors$i.trustMarks).data("trustmarks-copy-shipsin");

    const copySelector = $(selectors$i.trustMarks).find("[data-trustmarks-shipping-copy]");

    var copy = copyNostock;

    if (!variant) {
      copy = copyUnavailable;
    }
    else
    if (variant.available == false) {
      copy = copyUnavailable;
    }
    else
    if (variant.available == true && variant.inventory_quantity > 0) {
      copy = copyInstock;
    }
    else
    if (variant.available == true && variant.inventory_policy == "continue" ) {

      if (copyShipsIn != "") {
        copy = copyShipsIn;
      }
      else {
        copy = copyNostock;
      }

    }

    copySelector.text(copy);

  }

  function updateRemaining(variant, container) {
    var $remaining = $('[data-remaining-count]', container);
    var $remainingWrapper = $('[data-remaining-wrapper]', container);
    if (!variant) {
      $remainingWrapper.removeClass('variant__countdown--show');
      return;
    }
    if ($remaining.length) {
      var maxInventory = parseInt($remaining.attr('data-remaining-max'), 10);
      var sellout = (variant.inventory_policy === 'deny');
      if (variant.inventory_management && sellout) {
        var remainingInventory = variant.inventory_quantity;
        if (remainingInventory > 0 && remainingInventory <= maxInventory) {
          $remaining.html(variant.inventory_quantity);
          $remainingWrapper.addClass('variant__countdown--show');
        } else {
          $remainingWrapper.removeClass('variant__countdown--show');
        }
      } else {
        $remainingWrapper.removeClass('variant__countdown--show');
      }
    }
  }

  function getSectionSettings(container, id) {
    var rawJSON = $(container).find(`[data-settings='${id}']`).html();
    if (typeof rawJSON !== 'undefined') {
      return JSON.parse(rawJSON).settings;
    } else {
      return null;
    }
  }

  function getRandomInt$1(minimum, maximum) {
    var min = Math.ceil(minimum);
    var max = Math.floor(maximum);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  const productSection = {
    onLoad() {
      const sectionSettings = getSectionSettings(this.container, this.id);
      this.settings = { ...sectionSettings, ...window.theme.settings };
      this.productTemplate = new ProductTemplate(this);
      tabs(this.container);
      modal(this.id);
      this.media = new Media(this);
      this.media.init();
    },
    onUnload() {
      destroyTabs(this.container);
      this.media.destroy();
      this.productTemplate.destroy();
    },
    onBlockSelect(evt) {
      $('*[data-block-id="' + evt.detail.blockId + '"]').click();
    },
    onBlockDeselect(evt) {
      $('*[data-block-id="' + evt.detail.blockId + '"]').click();
    },
  };

  register('product', productSection);

  var selectors$j = {
    filtersWrappper: '[data-filters]',
    underlay: '[data-filters-underlay]',
    filtersHideDesktop: 'data-default-hide',
    filtersToggle: 'data-filters-toggle',
    focusable: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  };

  var classes$8 = {
    show: 'filters--visible',
    defaultVisible: 'filters--default-visible',
    hide: 'hidden',
  };

  var sections$b = {};

  class Filters {
    constructor($filters) {
      this.$container = $filters;
      this.$underlay = $(selectors$j.underlay, this.$container);
      const triggerKey = $filters.data().filters;
      this.$filtersToggle = this._findButtons(triggerKey);
      this._connectToggle();
      this._onFocusOut();
      if (this._getShowOnLoad()) {
        this._showFilters();
      } else {
        this._hideFilters();
      }
    }
    unload() {
      this.$container.off();
      this.$underlay.off();
      this.$filtersToggle.off();
    }

    _connectToggle() {
      this.$filtersToggle.on(
        'click',
        function(evt) {
          var ariaExpanded = ($(evt.currentTarget).attr('aria-expanded') === 'true');
          if (ariaExpanded) {
            this._hideFilters();
          } else {
            this._showFilters();
          }
        }.bind(this),
      );
    }

    _onFocusOut() {
      this.$container.on(
        'focusout',
        function(evt) {
          if (window.innerWidth >= window.theme.sizes.medium) { return; }

          var childInFocus = ($(evt.currentTarget).has(evt.relatedTarget).length > 0);
          var isVisible = this.$container.hasClass(classes$8.show);
          var isFocusEnabled = $('body').hasClass('focus-enabled');
          if (isFocusEnabled && isVisible && !childInFocus) {
            this._hideFilters();
          }
        }.bind(this),
      );

      this.$container.on(
        'keyup',
        function(evt) {
          if (evt.which !== window.theme.keyboardKeys.ESCAPE) { return; }
          this._hideFilters();
          this.$filtersToggle.focus();
        }.bind(this),
      );

      this.$underlay.on(
        'click',
        function() {
          this._hideFilters();
        }.bind(this),
      );
    }

    _findButtons(key) {
      // buttons to trigger the filters can be anywhere on the page
      const selector = `[${selectors$j.filtersToggle}='${key}']`;
      return $(selector);
    }

    _getShowOnLoad() {
      const selector = `[${selectors$j.filtersHideDesktop}='false']`;
      const showOnDesktop = ($(selector).length > 0);
      const isDesktop = (window.innerWidth >= window.theme.sizes.medium);
      if (showOnDesktop && isDesktop) {
        return true;
      } else {
        return false;
      }
    }

    _showFilters() {
      this.$container.removeClass(classes$8.hide);
      // animates after display none is removed
      setTimeout(() => {
        this.$filtersToggle.attr('aria-expanded', true);
        this.$filtersToggle.addClass(classes$8.show);
        this.$container.addClass(classes$8.show);
        this.$container.find(selectors$j.focusable).first().focus();
      }, 1);
    }

    _hideFilters() {
      this.$filtersToggle.attr('aria-expanded', false);
      this.$container.removeClass([classes$8.show, classes$8.defaultVisible]);
      this.$filtersToggle.removeClass([classes$8.show, classes$8.defaultVisible]);
      // adds display none after animations
      setTimeout(() => {
        if (!this.$container.hasClass(classes$8.show)) {
          this.$container.addClass(classes$8.hide);
        }
      }, 2000);
    }
  }

  const collectionFiltersSidebar = {
    onLoad() {
      sections$b[this.id] = [];
      const wrappers = this.container.querySelectorAll(selectors$j.filtersWrappper);
      wrappers.forEach(wrapper => {
        const $wrapper = $(wrapper);
        sections$b[this.id].push(new Filters($wrapper));
      });
    },
    onUnload: function() {
      sections$b[this.id].forEach(filters => {
        if (typeof filters.unload === 'function') {
          filters.unload();
        }
      });
    },
  };

  const selectors$k = {
    toggle: 'data-toggle-grid',
    large: 'data-grid-large',
    small: 'data-grid-small',
  };

  const options = {
    breakpoint: window.theme.sizes.small,
  };

  var sections$c = {};

  class Toggle {
    constructor($button) {
      this.$toggle = $button;
      this.value = this.$toggle.attr(selectors$k.toggle);
      this._listen();
    }
    unload() {
      this.$toggle.off();
    }
    _listen() {
      this.$toggle.on('click', () => {
        const isLarge = (window.innerWidth >= options.breakpoint);
        const selector = (isLarge) ? selectors$k.large : selectors$k.small;
        $(`[${selector}]`).attr(selector, this.value);
        if (window.lazySizes) {
          window.lazySizes.autoSizer.checkElems();
        }
      });
    }
    _getContianer() {
      // find grid wrappers in the same section
      return this.$toggle
        .closest('[data-section-type]')
        .find(selectors$k.wrapper);
    }
  }

  const toggleSection = {
    onLoad() {
      sections$c[this.id] = [];
      const buttons = this.container.querySelectorAll(`[${selectors$k.toggle}]`);
      buttons.forEach(button => {
        const $button = $(button);
        sections$c[this.id].push(new Toggle($button));
      });
    },
    onUnload: function() {
      sections$c[this.id].forEach(toggle => {
        if (typeof toggle.unload === 'function') {
          toggle.unload();
        }
      });
    },
  };

  const collectionSection = {
    onLoad() {
      const sortEnabled = (this.container.getAttribute('data-sort') !== 'false');
      if (sortEnabled) {
        this.sortingClick();
      }

      this._removeUnusableFilters();
    },
    sortingClick: function() {
      Shopify.queryParams = {};
      const location = window.location;
      if (location.search.length && location.search.indexOf('sort_by')) {
        for (
          var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&');
          i < aCouples.length;
          i++
        ) {
          aKeyValue = aCouples[i].split('=');
          if (aKeyValue.length > 1) {
            Shopify.queryParams[
              decodeURIComponent(aKeyValue[0])
            ] = decodeURIComponent(aKeyValue[1]);
          }
        }
      }
      $('[data-sort-link]', this.$container).click(function(evt) {
        evt.preventDefault();
        Shopify.queryParams.sort_by = $(this).data('value');
        location.search = $.param(Shopify.queryParams);
      });
    },
    _removeUnusableFilters() {
      $('.collection-nav--grouped', this.$container).each(function() {
        var $visibleChildren = $(this).children().filter('.link--add');
        var $activeChildren = $(this).children().filter('.link--remove');
        if ($visibleChildren.length == 0 && $activeChildren.length == 0) {
          $(this).hide();
          $(this)
            .prev('.sidebar__heading')
            .hide();
        }
        if ($activeChildren.length > 0) {
          $(this)
            .prev('.sidebar__heading')
            .addClass('has-filters');
        } else {
          $(this)
            .prev('.sidebar__heading')
            .find('.link--clear')
            .children()
            .unwrap();
        }
      });
    },
  };

  register('collection', [collectionSection, parallaxImage, popoutSection, collectionFiltersSidebar, toggleSection, swatchSection]);

  register('collection-row', swatchSection);

  var styles = {};
  styles.basic = [];
  /* eslint-disable */
  styles.light = [{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":"64"},{"hue":"#ff0000"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#bdbdbd"}]},{"featureType":"administrative","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f0f0f0"},{"visibility":"simplified"}]},{"featureType":"landscape.natural.landcover","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural.terrain","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"lightness":"100"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"saturation":"-41"},{"color":"#e8ede7"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":"-100"}]},{"featureType":"road","elementType":"labels","stylers":[{"lightness":"25"},{"gamma":"1.06"},{"saturation":"-100"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"gamma":"10.00"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"weight":"0.01"},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"weight":"0.01"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"weight":"0.01"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"weight":"0.8"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"weight":"0.01"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"weight":"0.01"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"gamma":"10.00"},{"lightness":"100"},{"weight":"0.4"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"simplified"},{"weight":"0.01"},{"lightness":"39"}]},{"featureType":"road.local","elementType":"labels.text.stroke","stylers":[{"weight":"0.50"},{"gamma":"10.00"},{"lightness":"100"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#cfe5ee"},{"visibility":"on"}]}];

  styles.light_blank =
  [{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"off"},{"lightness":"64"},{"hue":"#ff0000"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#bdbdbd"}]},{"featureType":"administrative","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f0f0f0"},{"visibility":"simplified"}]},{"featureType":"landscape.natural.landcover","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural.terrain","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"lightness":"100"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"saturation":"-41"},{"color":"#e8ede7"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":"-100"}]},{"featureType":"road","elementType":"labels","stylers":[{"lightness":"25"},{"gamma":"1.06"},{"saturation":"-100"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"gamma":"10.00"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"weight":"0.01"},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"weight":"0.01"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"weight":"0.01"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"weight":"0.8"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"weight":"0.01"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"weight":"0.01"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"gamma":"10.00"},{"lightness":"100"},{"weight":"0.4"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"off"},{"weight":"0.01"},{"lightness":"39"}]},{"featureType":"road.local","elementType":"labels.text.stroke","stylers":[{"weight":"0.50"},{"gamma":"10.00"},{"lightness":"100"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#cfe5ee"},{"visibility":"on"}]}];

  styles.white_blank =
  [{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"weight":"0.8"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"weight":"0.8"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"weight":"0.8"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"weight":"0.01"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"weight":"0"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"weight":"0.01"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#e4e4e4"},{"visibility":"on"}]}];

  styles.white_label =
  [{"featureType":"all","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"gamma":"3.86"},{"lightness":"100"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#cccccc"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"weight":"0.8"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"weight":"0.8"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"weight":"0.8"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"weight":"0.01"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"weight":"0"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"weight":"0.01"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#e4e4e4"},{"visibility":"on"}]}];

  styles.dark_blank =
  [{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17},{"weight":"0.8"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":"0.01"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"weight":"0.01"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"weight":"0.01"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];

  styles.dark_label =
  [{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"simplified"},{"lightness":"-82"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"invert_lightness":true},{"weight":"7.15"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17},{"weight":"0.8"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":"0.01"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"weight":"0.01"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"weight":"0.01"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];
  /* eslint-enable */

  function mapStyle(key) {
    return styles[key];
  }

  window.theme.apiPromise = window.theme.apiPromise || null;
  var apiPromise = window.theme.apiPromise;

  /* global google */

  function loadAPI(key) {
    if (apiPromise === null) {
      apiPromise = getScriptWithPromise$1('https://maps.googleapis.com/maps/api/js?key=' + key);
    }
    return apiPromise;
  }

  function createMap(container, options) {
    var map = new google.maps.Map(container, options);
    var center = map.getCenter();

    // eslint-disable-next-line no-unused-vars
    var marker = new google.maps.Marker({
      map: map,
      position: center,
    });

    google.maps.event.addDomListener(window, 'resize', function() {
      google.maps.event.trigger(map, 'resize');
      map.setCenter(center);
    });
    return map;
  }

  function destroyMap(map) {
    if (typeof window.google !== 'undefined') {
      google.maps.event.clearListeners(map, 'resize');
    }
  }

  function geocodeAddressPromise(address) {
    return new Promise((resolve, reject) => {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({address: address}, function(results, status) {
        if (status == 'OK') {
          var latLong = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          resolve(latLong);
        } else {
          reject(status);
        }
      });
    });
  }

  function getScriptWithPromise$1(url) {
    return new Promise((resolve, reject) => {
      $.getScript(url)
        .done(function(data) {
          resolve(data);
        })
        .fail(function(error) {
          reject(error);
        });
    });
  }

  window.theme.allMaps = window.theme.allMaps || {};
  var allMaps = window.theme.allMaps;

  const mapSection = {
    async onLoad() {
      var mapContainer = this.container.querySelector('[data-map-container]');
      var key = this.container.getAttribute('data-api-key');
      if (key) {
        try {
          await loadAPI(key);
        } catch (error) {
          console.log(error);
        }
        var styleString = this.container.getAttribute('data-style') || '';
        var zoomString = this.container.getAttribute('data-zoom') || 14;
        var address = this.container.getAttribute('data-address');
        var center = await geocodeAddressPromise(address);
        var zoom = parseInt(zoomString, 10);
        var styles = mapStyle(styleString);
        var mapOptions = {
          zoom,
          styles,
          center,
          draggable: true,
          clickableIcons: false,
          scrollwheel: false,
          zoomControl: false,
          disableDefaultUI: true,
        };
        var map = await createMap(mapContainer, mapOptions);
        allMaps[this.id] = map;
      }
    },
    onUnload() {
      destroyMap(allMaps[this.id]);
    },
  };

  register('index-map', mapSection);

  const columnSection = {
    onLoad() {
      popupVideo(this.container, this.id);
    },
  };

  register('index-columns', columnSection);

  const relatedSection = {
    onLoad: function() {
      var $relatedSection = $(this.container);
      var relatedSection = this.container;
      var productId = $relatedSection.data('product-id');
      var limit = $relatedSection.data('limit');
      var requestRoute = window.theme.routes.product_recommendations_url || '/recommendations/products/';
      var requestUrl = `${requestRoute}?section_id=related&limit=${limit}&product_id=${productId}`;

      $.get(requestUrl)
        .done(function(data) {
          var inner = $(data).find('[data-related-section]').html();
          $relatedSection.hide().html(inner).slideDown('slow');
          const swatches = relatedSection.querySelectorAll('[data-grid-swatches]');
          swatches.forEach(swatch => {
            gridSwatches(swatch).then(() => {
              swatchClicks(swatch);
            });
          });
        });
    },
  };

  register('related', relatedSection);

  const cartSection = {
    onLoad() {
      var $container = $(this.container);
      var ajaxEnabled = $container.attr('data-ajax-enable');
      if (ajaxEnabled == 'true') {
        initQuantity();
        initNotes();
      } else {
        initNoAjax();
      }
    },
  };

  function initQuantity() {
    $('.js-qty__adjust').off().on('click', function() {
      var $element = $(this);
      loadState($element);
      var newQuantity = parseInt($element.data('new-quantity'), 10);
      var clickedKey = $element.data('line-key');
      changeQuantity(newQuantity, clickedKey);
    });
    $('[data-quantity-input]').off().on('change', function() {
      var $element = $(this);
      loadState($element);
      var newQuantity = parseInt($element.val(), 10);
      var clickedKey = $element.data('line-key');
      changeQuantity(newQuantity, clickedKey);
    });
  }
  function loadState($element) {
    $element.prop('disabled', true)
      .parents('.js-qty').addClass('qty--disabled')
      .end()
      .siblings()
      .prop('disabled', true);
    $element.closest('.cart__row').find('.item--loadbar').show();
  }

  function changeQuantity(newQuantity, clickedKey) {
    let oldCount = null;
    let newCount = null;
    let newItem = null;
    window.fetch('/cart.js')
      .then(handleErrors$1)
      .then(response => {
        return response.json();
      })
      .then(response => {
        const matchKeys = (item) => item.key === clickedKey;
        const index = response.items.findIndex(matchKeys);
        oldCount = response.item_count;
        newItem = response.items[index].title;
        const data = {
          line: `${index + 1}`,
          quantity: newQuantity,
        };
        return window.fetch('/cart/change.js', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data),
        });
      })
      .then(handleErrors$1)
      .then(response => {
        return response.json();
      })
      .then(response => {
        newCount = response.item_count;
        if (oldCount === newCount) {
          stockoutError(newItem);
        } else {
          $('[data-form-errors]').slideUp('fast');
          document.dispatchEvent(new CustomEvent('theme:cart:change', {
            detail: {
              cart: response,
            },
            bubbles: true,
          }));
        }
        return window.fetch('/cart?view=ajax');
      })
      .then(handleErrors$1)
      .then(response => {
        return response.text();
      })
      .then(response => {
        $('[data-cart-form-wrapper]')
          .empty()
          .html(response);
        initQuantity();
        initNotes();
      })
      .catch(e => {
        console.error(e);
        let heading = '';
        if (typeof e.status !== 'undefined') {
          heading = `<p class="strong">${e.status}</p>`;
        }
        let paragraph = e.json.description || '';
        errors(`${heading} ${paragraph}`);
      });
  }

  function handleErrors$1(response) {
    if (!response.ok) {
      return response.json().then(function(json) {
        const e = new FetchError$1({
          status: response.statusText,
          headers: response.headers,
          json: json,
        });
        throw e;
      });
    }
    return response;
  }

  function FetchError$1(object) {
    this.status = object.status || null;
    this.headers = object.headers || null;
    this.json = object.json || null;
    this.body = object.body || null;
  }
  FetchError$1.prototype = Error.prototype;

  function stockoutError(itemTitle) {
    let heading = `<p class="h6--body strong">${window.theme.strings.stockout}</h6>`;
    let paragraph = `<p>${itemTitle}</p>`;
    errors(`${heading} ${paragraph}`);
  }

  function errors(message) {
    var $errors = $('[data-form-errors]');
    $errors.slideUp('fast');
    $errors
      .empty()
      .html(message)
      .slideDown('fast');
  }

  function initNotes() {
    var $notes = $('[data-cart-note]');

    $notes.off().on('change', function() {
      var noteValue = $notes.val().toString() || '';
      saveNotes(noteValue);
    });
  }

  function saveNotes(newNote) {
    var params = {
      type: 'POST',
      url: '/cart/update.js',
      data: 'note=' + newNote,
      dataType: 'json',
      error: function(XMLHttpRequest) {
        var $errors = $('[data-form-errors]');
        $errors.slideUp('fast');
        $errors.empty().html(XMLHttpRequest.responseJSON.description).slideDown('fast');
      },
    };
    $.ajax(params);
  }

  function initNoAjax() {
    $('.js-qty__adjust').off().on('click', function() {
      var $el = $(this);
      var $qtySelector = $el.siblings('.js-qty__num');
      var qty = parseInt($qtySelector.val().replace(/\D/g, ''), 10);

      // Make sure we have a valid integer
      if ((parseFloat(qty) == parseInt(qty, 10)) && !isNaN(qty)) ; else {
        // Not a number. Default to 1.
        qty = 1;
      }

      // Add or subtract from the current quantity
      if ($el.hasClass('js-qty__adjust--plus')) {
        qty++;
      } else {
        qty--;
        if (qty <= 0) { qty = 0; }
      }

      // Update the input's number
      $qtySelector.val(qty).trigger('change');

      $('[data-update]').addClass('cart--dirty');
      $('[data-update]').addClass('heartBeat');
      setTimeout(function() {
        $('[data-update]').removeClass('heartBeat');
      }, 1300);
    });
  }

  register('cart', cartSection);

  $(document).ready(function() {

    // Load all registered sections on the page.
    load('*');

    // Animate on scroll
    var showAnimations = $('body').data('animations');
    if (showAnimations) {
      AOS.init({ once: true });
      $('body').addClass('aos-initialized');
    }

    // When images load, clear the background color
    document.addEventListener('lazyloaded', function(event) {
      $(event.target)
        .parent('.lazy-image')
        .css('background-image', 'none');
    });

    // Target tables to make them scrollable
    var tableSelectors = '.rte table';
    themeRte.wrapTable({
      $tables: $(tableSelectors),
      tableWrapperClass: 'rte__table-wrapper',
    });

    // Target iframes to make them responsive
    var iframeSelectors =
      '.rte iframe[src*="youtube.com/embed"],' +
      '.rte iframe[src*="player.vimeo"],' +
      '.rte iframe#admin_bar_iframe';
    themeRte.wrapIframe({
      $iframes: $(iframeSelectors),
      iframeWrapperClass: 'rte__video-wrapper',
    });

    $(document).on('mousedown', function() {
      $('body').removeClass('focus-enabled');
    }).keyup(function(event) {
      // on TAB key press
      if (event.keyCode === 9) {
        $('body').addClass('focus-enabled');
      }
    });

    // Apply a specific class to the html element for browser support of cookies.
    if (window.navigator.cookieEnabled) {
      document.documentElement.className = document.documentElement.className.replace(
        'supports-no-cookies',
        'supports-cookies',
      );
    }

    // Common a11y fixes
    themeA11y.focusHash();
    themeA11y.bindInPageLinks();

    let hasNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    if (!hasNativeSmoothScroll) {
      loadScript({url: window.theme.assets.smoothscroll});
    }

    // Show Tooltips
    tippy("[data-tippy]", {
      theme: "brackish--dark",
      placement: "bottom",
      content: (reference) => reference.getAttribute('title'),
    });

    const tooltipElements = document.querySelectorAll('[data-tippy-content-element]');

    for (var i = 0; i < tooltipElements.length; i++) {

      var selector = tooltipElements[i].getAttribute("data-tippy-content-element");
      var element = document.querySelector(selector);

      tippy(tooltipElements[i], {
        theme: "brackish",
        content: element
      });

      element.style.display = "flex";

    }

  });

}(pipelineVendor.$, pipelineVendor.MicroModal, pipelineVendor.Rellax, pipelineVendor.themeCurrency, pipelineVendor.themeImages, pipelineVendor.themeProductForm, pipelineVendor.slick, pipelineVendor.Poppy, pipelineVendor.Sqrl, pipelineVendor.AOS, pipelineVendor.a11y, pipelineVendor.themeRte));
