'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * Bootstrap v3.4.1 (https://getbootstrap.com/)
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery');
}

+function ($) {
  'use strict';

  var version = $.fn.jquery.split(' ')[0].split('.');
  if (version[0] < 2 && version[1] < 9 || version[0] == 1 && version[1] == 9 && version[2] < 1 || version[0] > 3) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4');
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: https://modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap');

    var transEndEventNames = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
      transition: 'transitionend'
    };

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] };
      }
    }

    return false; // explicit for ie8 (  ._.)
  }

  // https://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false;
    var $el = this;
    $(this).one('bsTransitionEnd', function () {
      called = true;
    });
    var callback = function callback() {
      if (!called) $($el).trigger($.support.transition.end);
    };
    setTimeout(callback, duration);
    return this;
  };

  $(function () {
    $.support.transition = transitionEnd();

    if (!$.support.transition) return;

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function handle(e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments);
      }
    };
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]';
  var Alert = function Alert(el) {
    $(el).on('click', dismiss, this.close);
  };

  Alert.VERSION = '3.4.1';

  Alert.TRANSITION_DURATION = 150;

  Alert.prototype.close = function (e) {
    var $this = $(this);
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    selector = selector === '#' ? [] : selector;
    var $parent = $(document).find(selector);

    if (e) e.preventDefault();

    if (!$parent.length) {
      $parent = $this.closest('.alert');
    }

    $parent.trigger(e = $.Event('close.bs.alert'));

    if (e.isDefaultPrevented()) return;

    $parent.removeClass('in');

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove();
    }

    $.support.transition && $parent.hasClass('fade') ? $parent.one('bsTransitionEnd', removeElement).emulateTransitionEnd(Alert.TRANSITION_DURATION) : removeElement();
  };

  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.alert');

      if (!data) $this.data('bs.alert', data = new Alert(this));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.alert;

  $.fn.alert = Plugin;
  $.fn.alert.Constructor = Alert;

  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old;
    return this;
  };

  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close);
}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function Button(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Button.DEFAULTS, options);
    this.isLoading = false;
  };

  Button.VERSION = '3.4.1';

  Button.DEFAULTS = {
    loadingText: 'loading...'
  };

  Button.prototype.setState = function (state) {
    var d = 'disabled';
    var $el = this.$element;
    var val = $el.is('input') ? 'val' : 'html';
    var data = $el.data();

    state += 'Text';

    if (data.resetText == null) $el.data('resetText', $el[val]());

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state]);

      if (state == 'loadingText') {
        this.isLoading = true;
        $el.addClass(d).attr(d, d).prop(d, true);
      } else if (this.isLoading) {
        this.isLoading = false;
        $el.removeClass(d).removeAttr(d).prop(d, false);
      }
    }, this), 0);
  };

  Button.prototype.toggle = function () {
    var changed = true;
    var $parent = this.$element.closest('[data-toggle="buttons"]');

    if ($parent.length) {
      var $input = this.$element.find('input');
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false;
        $parent.find('.active').removeClass('active');
        this.$element.addClass('active');
      } else if ($input.prop('type') == 'checkbox') {
        if ($input.prop('checked') !== this.$element.hasClass('active')) changed = false;
        this.$element.toggleClass('active');
      }
      $input.prop('checked', this.$element.hasClass('active'));
      if (changed) $input.trigger('change');
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'));
      this.$element.toggleClass('active');
    }
  };

  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.button');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.button', data = new Button(this, options));

      if (option == 'toggle') data.toggle();else if (option) data.setState(option);
    });
  }

  var old = $.fn.button;

  $.fn.button = Plugin;
  $.fn.button.Constructor = Button;

  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old;
    return this;
  };

  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    var $btn = $(e.target).closest('.btn');
    Plugin.call($btn, 'toggle');
    if (!$(e.target).is('input[type="radio"], input[type="checkbox"]')) {
      // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
      e.preventDefault();
      // The target component still receive the focus
      if ($btn.is('input,button')) $btn.trigger('focus');else $btn.find('input:visible,button:visible').first().trigger('focus');
    }
  }).on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type));
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function Carousel(element, options) {
    this.$element = $(element);
    this.$indicators = this.$element.find('.carousel-indicators');
    this.options = options;
    this.paused = null;
    this.sliding = null;
    this.interval = null;
    this.$active = null;
    this.$items = null;

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this));

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element.on('mouseenter.bs.carousel', $.proxy(this.pause, this)).on('mouseleave.bs.carousel', $.proxy(this.cycle, this));
  };

  Carousel.VERSION = '3.4.1';

  Carousel.TRANSITION_DURATION = 600;

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  };

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return;
    switch (e.which) {
      case 37:
        this.prev();break;
      case 39:
        this.next();break;
      default:
        return;
    }

    e.preventDefault();
  };

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false);

    this.interval && clearInterval(this.interval);

    this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));

    return this;
  };

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item');
    return this.$items.index(item || this.$active);
  };

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active);
    var willWrap = direction == 'prev' && activeIndex === 0 || direction == 'next' && activeIndex == this.$items.length - 1;
    if (willWrap && !this.options.wrap) return active;
    var delta = direction == 'prev' ? -1 : 1;
    var itemIndex = (activeIndex + delta) % this.$items.length;
    return this.$items.eq(itemIndex);
  };

  Carousel.prototype.to = function (pos) {
    var that = this;
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'));

    if (pos > this.$items.length - 1 || pos < 0) return;

    if (this.sliding) return this.$element.one('slid.bs.carousel', function () {
      that.to(pos);
    }); // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle();

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos));
  };

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true);

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end);
      this.cycle(true);
    }

    this.interval = clearInterval(this.interval);

    return this;
  };

  Carousel.prototype.next = function () {
    if (this.sliding) return;
    return this.slide('next');
  };

  Carousel.prototype.prev = function () {
    if (this.sliding) return;
    return this.slide('prev');
  };

  Carousel.prototype.slide = function (type, next) {
    var $active = this.$element.find('.item.active');
    var $next = next || this.getItemForDirection(type, $active);
    var isCycling = this.interval;
    var direction = type == 'next' ? 'left' : 'right';
    var that = this;

    if ($next.hasClass('active')) return this.sliding = false;

    var relatedTarget = $next[0];
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    });
    this.$element.trigger(slideEvent);
    if (slideEvent.isDefaultPrevented()) return;

    this.sliding = true;

    isCycling && this.pause();

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active');
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
      $nextIndicator && $nextIndicator.addClass('active');
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }); // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type);
      if ((typeof $next === 'undefined' ? 'undefined' : _typeof($next)) === 'object' && $next.length) {
        $next[0].offsetWidth; // force reflow
      }
      $active.addClass(direction);
      $next.addClass(direction);
      $active.one('bsTransitionEnd', function () {
        $next.removeClass([type, direction].join(' ')).addClass('active');
        $active.removeClass(['active', direction].join(' '));
        that.sliding = false;
        setTimeout(function () {
          that.$element.trigger(slidEvent);
        }, 0);
      }).emulateTransitionEnd(Carousel.TRANSITION_DURATION);
    } else {
      $active.removeClass('active');
      $next.addClass('active');
      this.sliding = false;
      this.$element.trigger(slidEvent);
    }

    isCycling && this.cycle();

    return this;
  };

  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.carousel');
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);
      var action = typeof option == 'string' ? option : options.slide;

      if (!data) $this.data('bs.carousel', data = new Carousel(this, options));
      if (typeof option == 'number') data.to(option);else if (action) data[action]();else if (options.interval) data.pause().cycle();
    });
  }

  var old = $.fn.carousel;

  $.fn.carousel = Plugin;
  $.fn.carousel.Constructor = Carousel;

  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old;
    return this;
  };

  // CAROUSEL DATA-API
  // =================

  var clickHandler = function clickHandler(e) {
    var $this = $(this);
    var href = $this.attr('href');
    if (href) {
      href = href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7
    }

    var target = $this.attr('data-target') || href;
    var $target = $(document).find(target);

    if (!$target.hasClass('carousel')) return;

    var options = $.extend({}, $target.data(), $this.data());
    var slideIndex = $this.attr('data-slide-to');
    if (slideIndex) options.interval = false;

    Plugin.call($target, options);

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex);
    }

    e.preventDefault();
  };

  $(document).on('click.bs.carousel.data-api', '[data-slide]', clickHandler).on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler);

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this);
      Plugin.call($carousel, $carousel.data());
    });
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function Collapse(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Collapse.DEFAULTS, options);
    this.$trigger = $('[data-toggle="collapse"][href="#' + element.id + '"],' + '[data-toggle="collapse"][data-target="#' + element.id + '"]');
    this.transitioning = null;

    if (this.options.parent) {
      this.$parent = this.getParent();
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger);
    }

    if (this.options.toggle) this.toggle();
  };

  Collapse.VERSION = '3.4.1';

  Collapse.TRANSITION_DURATION = 350;

  Collapse.DEFAULTS = {
    toggle: true
  };

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width');
    return hasWidth ? 'width' : 'height';
  };

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return;

    var activesData;
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing');

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse');
      if (activesData && activesData.transitioning) return;
    }

    var startEvent = $.Event('show.bs.collapse');
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return;

    if (actives && actives.length) {
      Plugin.call(actives, 'hide');
      activesData || actives.data('bs.collapse', null);
    }

    var dimension = this.dimension();

    this.$element.removeClass('collapse').addClass('collapsing')[dimension](0).attr('aria-expanded', true);

    this.$trigger.removeClass('collapsed').attr('aria-expanded', true);

    this.transitioning = 1;

    var complete = function complete() {
      this.$element.removeClass('collapsing').addClass('collapse in')[dimension]('');
      this.transitioning = 0;
      this.$element.trigger('shown.bs.collapse');
    };

    if (!$.support.transition) return complete.call(this);

    var scrollSize = $.camelCase(['scroll', dimension].join('-'));

    this.$element.one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize]);
  };

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return;

    var startEvent = $.Event('hide.bs.collapse');
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return;

    var dimension = this.dimension();

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight;

    this.$element.addClass('collapsing').removeClass('collapse in').attr('aria-expanded', false);

    this.$trigger.addClass('collapsed').attr('aria-expanded', false);

    this.transitioning = 1;

    var complete = function complete() {
      this.transitioning = 0;
      this.$element.removeClass('collapsing').addClass('collapse').trigger('hidden.bs.collapse');
    };

    if (!$.support.transition) return complete.call(this);

    this.$element[dimension](0).one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION);
  };

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']();
  };

  Collapse.prototype.getParent = function () {
    return $(document).find(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each($.proxy(function (i, element) {
      var $element = $(element);
      this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element);
    }, this)).end();
  };

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in');

    $element.attr('aria-expanded', isOpen);
    $trigger.toggleClass('collapsed', !isOpen).attr('aria-expanded', isOpen);
  };

  function getTargetFromTrigger($trigger) {
    var href;
    var target = $trigger.attr('data-target') || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7

    return $(document).find(target);
  }

  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.collapse');
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false;
      if (!data) $this.data('bs.collapse', data = new Collapse(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.collapse;

  $.fn.collapse = Plugin;
  $.fn.collapse.Constructor = Collapse;

  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old;
    return this;
  };

  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this = $(this);

    if (!$this.attr('data-target')) e.preventDefault();

    var $target = getTargetFromTrigger($this);
    var data = $target.data('bs.collapse');
    var option = data ? 'toggle' : $this.data();

    Plugin.call($target, option);
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop';
  var toggle = '[data-toggle="dropdown"]';
  var Dropdown = function Dropdown(element) {
    $(element).on('click.bs.dropdown', this.toggle);
  };

  Dropdown.VERSION = '3.4.1';

  function getParent($this) {
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    var $parent = selector !== '#' ? $(document).find(selector) : null;

    return $parent && $parent.length ? $parent : $this.parent();
  }

  function clearMenus(e) {
    if (e && e.which === 3) return;
    $(backdrop).remove();
    $(toggle).each(function () {
      var $this = $(this);
      var $parent = getParent($this);
      var relatedTarget = { relatedTarget: this };

      if (!$parent.hasClass('open')) return;

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return;

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this.attr('aria-expanded', 'false');
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget));
    });
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this);

    if ($this.is('.disabled, :disabled')) return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');

    clearMenus();

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div')).addClass('dropdown-backdrop').insertAfter($(this)).on('click', clearMenus);
      }

      var relatedTarget = { relatedTarget: this };
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this.trigger('focus').attr('aria-expanded', 'true');

      $parent.toggleClass('open').trigger($.Event('shown.bs.dropdown', relatedTarget));
    }

    return false;
  };

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return;

    var $this = $(this);

    e.preventDefault();
    e.stopPropagation();

    if ($this.is('.disabled, :disabled')) return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus');
      return $this.trigger('click');
    }

    var desc = ' li:not(.disabled):visible a';
    var $items = $parent.find('.dropdown-menu' + desc);

    if (!$items.length) return;

    var index = $items.index(e.target);

    if (e.which == 38 && index > 0) index--; // up
    if (e.which == 40 && index < $items.length - 1) index++; // down
    if (!~index) index = 0;

    $items.eq(index).trigger('focus');
  };

  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.dropdown');

      if (!data) $this.data('bs.dropdown', data = new Dropdown(this));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.dropdown;

  $.fn.dropdown = Plugin;
  $.fn.dropdown.Constructor = Dropdown;

  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old;
    return this;
  };

  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document).on('click.bs.dropdown.data-api', clearMenus).on('click.bs.dropdown.data-api', '.dropdown form', function (e) {
    e.stopPropagation();
  }).on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown);
}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#modals
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function Modal(element, options) {
    this.options = options;
    this.$body = $(document.body);
    this.$element = $(element);
    this.$dialog = this.$element.find('.modal-dialog');
    this.$backdrop = null;
    this.isShown = null;
    this.originalBodyPad = null;
    this.scrollbarWidth = 0;
    this.ignoreBackdropClick = false;
    this.fixedContent = '.navbar-fixed-top, .navbar-fixed-bottom';

    if (this.options.remote) {
      this.$element.find('.modal-content').load(this.options.remote, $.proxy(function () {
        this.$element.trigger('loaded.bs.modal');
      }, this));
    }
  };

  Modal.VERSION = '3.4.1';

  Modal.TRANSITION_DURATION = 300;
  Modal.BACKDROP_TRANSITION_DURATION = 150;

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  };

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget);
  };

  Modal.prototype.show = function (_relatedTarget) {
    var that = this;
    var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget });

    this.$element.trigger(e);

    if (this.isShown || e.isDefaultPrevented()) return;

    this.isShown = true;

    this.checkScrollbar();
    this.setScrollbar();
    this.$body.addClass('modal-open');

    this.escape();
    this.resize();

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true;
      });
    });

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade');

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body); // don't move modals dom position
      }

      that.$element.show().scrollTop(0);

      that.adjustDialog();

      if (transition) {
        that.$element[0].offsetWidth; // force reflow
      }

      that.$element.addClass('in');

      that.enforceFocus();

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget });

      transition ? that.$dialog // wait for modal to slide in
      .one('bsTransitionEnd', function () {
        that.$element.trigger('focus').trigger(e);
      }).emulateTransitionEnd(Modal.TRANSITION_DURATION) : that.$element.trigger('focus').trigger(e);
    });
  };

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault();

    e = $.Event('hide.bs.modal');

    this.$element.trigger(e);

    if (!this.isShown || e.isDefaultPrevented()) return;

    this.isShown = false;

    this.escape();
    this.resize();

    $(document).off('focusin.bs.modal');

    this.$element.removeClass('in').off('click.dismiss.bs.modal').off('mouseup.dismiss.bs.modal');

    this.$dialog.off('mousedown.dismiss.bs.modal');

    $.support.transition && this.$element.hasClass('fade') ? this.$element.one('bsTransitionEnd', $.proxy(this.hideModal, this)).emulateTransitionEnd(Modal.TRANSITION_DURATION) : this.hideModal();
  };

  Modal.prototype.enforceFocus = function () {
    $(document).off('focusin.bs.modal') // guard against infinite focus loop
    .on('focusin.bs.modal', $.proxy(function (e) {
      if (document !== e.target && this.$element[0] !== e.target && !this.$element.has(e.target).length) {
        this.$element.trigger('focus');
      }
    }, this));
  };

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide();
      }, this));
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal');
    }
  };

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this));
    } else {
      $(window).off('resize.bs.modal');
    }
  };

  Modal.prototype.hideModal = function () {
    var that = this;
    this.$element.hide();
    this.backdrop(function () {
      that.$body.removeClass('modal-open');
      that.resetAdjustments();
      that.resetScrollbar();
      that.$element.trigger('hidden.bs.modal');
    });
  };

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove();
    this.$backdrop = null;
  };

  Modal.prototype.backdrop = function (callback) {
    var that = this;
    var animate = this.$element.hasClass('fade') ? 'fade' : '';

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate;

      this.$backdrop = $(document.createElement('div')).addClass('modal-backdrop ' + animate).appendTo(this.$body);

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false;
          return;
        }
        if (e.target !== e.currentTarget) return;
        this.options.backdrop == 'static' ? this.$element[0].focus() : this.hide();
      }, this));

      if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

      this.$backdrop.addClass('in');

      if (!callback) return;

      doAnimate ? this.$backdrop.one('bsTransitionEnd', callback).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callback();
    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in');

      var callbackRemove = function callbackRemove() {
        that.removeBackdrop();
        callback && callback();
      };
      $.support.transition && this.$element.hasClass('fade') ? this.$backdrop.one('bsTransitionEnd', callbackRemove).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callbackRemove();
    } else if (callback) {
      callback();
    }
  };

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog();
  };

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight;

    this.$element.css({
      paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    });
  };

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    });
  };

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth;
    if (!fullWindowWidth) {
      // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect();
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
    this.scrollbarWidth = this.measureScrollbar();
  };

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt(this.$body.css('padding-right') || 0, 10);
    this.originalBodyPad = document.body.style.paddingRight || '';
    var scrollbarWidth = this.scrollbarWidth;
    if (this.bodyIsOverflowing) {
      this.$body.css('padding-right', bodyPad + scrollbarWidth);
      $(this.fixedContent).each(function (index, element) {
        var actualPadding = element.style.paddingRight;
        var calculatedPadding = $(element).css('padding-right');
        $(element).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + scrollbarWidth + 'px');
      });
    }
  };

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad);
    $(this.fixedContent).each(function (index, element) {
      var padding = $(element).data('padding-right');
      $(element).removeData('padding-right');
      element.style.paddingRight = padding ? padding : '';
    });
  };

  Modal.prototype.measureScrollbar = function () {
    // thx walsh
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'modal-scrollbar-measure';
    this.$body.append(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    this.$body[0].removeChild(scrollDiv);
    return scrollbarWidth;
  };

  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.modal');
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);

      if (!data) $this.data('bs.modal', data = new Modal(this, options));
      if (typeof option == 'string') data[option](_relatedTarget);else if (options.show) data.show(_relatedTarget);
    });
  }

  var old = $.fn.modal;

  $.fn.modal = Plugin;
  $.fn.modal.Constructor = Modal;

  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old;
    return this;
  };

  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this);
    var href = $this.attr('href');
    var target = $this.attr('data-target') || href && href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7

    var $target = $(document).find(target);
    var option = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data());

    if ($this.is('a')) e.preventDefault();

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return; // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus');
      });
    });
    Plugin.call($target, option, this);
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  var DISALLOWED_ATTRIBUTES = ['sanitize', 'whiteList', 'sanitizeFn'];

  var uriAttrs = ['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href'];

  var ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;

  var DefaultWhitelist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []

    /**
     * A pattern that recognizes a commonly useful subset of URLs that are safe.
     *
     * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
     */
  };var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;

  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */
  var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;

  function allowedAttribute(attr, allowedAttributeList) {
    var attrName = attr.nodeName.toLowerCase();

    if ($.inArray(attrName, allowedAttributeList) !== -1) {
      if ($.inArray(attrName, uriAttrs) !== -1) {
        return Boolean(attr.nodeValue.match(SAFE_URL_PATTERN) || attr.nodeValue.match(DATA_URL_PATTERN));
      }

      return true;
    }

    var regExp = $(allowedAttributeList).filter(function (index, value) {
      return value instanceof RegExp;
    });

    // Check if a regular expression validates the attribute.
    for (var i = 0, l = regExp.length; i < l; i++) {
      if (attrName.match(regExp[i])) {
        return true;
      }
    }

    return false;
  }

  function sanitizeHtml(unsafeHtml, whiteList, sanitizeFn) {
    if (unsafeHtml.length === 0) {
      return unsafeHtml;
    }

    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml);
    }

    // IE 8 and below don't support createHTMLDocument
    if (!document.implementation || !document.implementation.createHTMLDocument) {
      return unsafeHtml;
    }

    var createdDocument = document.implementation.createHTMLDocument('sanitization');
    createdDocument.body.innerHTML = unsafeHtml;

    var whitelistKeys = $.map(whiteList, function (el, i) {
      return i;
    });
    var elements = $(createdDocument.body).find('*');

    for (var i = 0, len = elements.length; i < len; i++) {
      var el = elements[i];
      var elName = el.nodeName.toLowerCase();

      if ($.inArray(elName, whitelistKeys) === -1) {
        el.parentNode.removeChild(el);

        continue;
      }

      var attributeList = $.map(el.attributes, function (el) {
        return el;
      });
      var whitelistedAttributes = [].concat(whiteList['*'] || [], whiteList[elName] || []);

      for (var j = 0, len2 = attributeList.length; j < len2; j++) {
        if (!allowedAttribute(attributeList[j], whitelistedAttributes)) {
          el.removeAttribute(attributeList[j].nodeName);
        }
      }
    }

    return createdDocument.body.innerHTML;
  }

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function Tooltip(element, options) {
    this.type = null;
    this.options = null;
    this.enabled = null;
    this.timeout = null;
    this.hoverState = null;
    this.$element = null;
    this.inState = null;

    this.init('tooltip', element, options);
  };

  Tooltip.VERSION = '3.4.1';

  Tooltip.TRANSITION_DURATION = 150;

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    },
    sanitize: true,
    sanitizeFn: null,
    whiteList: DefaultWhitelist
  };

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled = true;
    this.type = type;
    this.$element = $(element);
    this.options = this.getOptions(options);
    this.$viewport = this.options.viewport && $(document).find($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport);
    this.inState = { click: false, hover: false, focus: false };

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!');
    }

    var triggers = this.options.trigger.split(' ');

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i];

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));
      } else if (trigger != 'manual') {
        var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin';
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';

        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this));
      }
    }

    this.options.selector ? this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' }) : this.fixTitle();
  };

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS;
  };

  Tooltip.prototype.getOptions = function (options) {
    var dataAttributes = this.$element.data();

    for (var dataAttr in dataAttributes) {
      if (dataAttributes.hasOwnProperty(dataAttr) && $.inArray(dataAttr, DISALLOWED_ATTRIBUTES) !== -1) {
        delete dataAttributes[dataAttr];
      }
    }

    options = $.extend({}, this.getDefaults(), dataAttributes, options);

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      };
    }

    if (options.sanitize) {
      options.template = sanitizeHtml(options.template, options.whiteList, options.sanitizeFn);
    }

    return options;
  };

  Tooltip.prototype.getDelegateOptions = function () {
    var options = {};
    var defaults = this.getDefaults();

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value;
    });

    return options;
  };

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type);

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data('bs.' + this.type, self);
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true;
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in';
      return;
    }

    clearTimeout(self.timeout);

    self.hoverState = 'in';

    if (!self.options.delay || !self.options.delay.show) return self.show();

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show();
    }, self.options.delay.show);
  };

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true;
    }

    return false;
  };

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type);

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data('bs.' + this.type, self);
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false;
    }

    if (self.isInStateTrue()) return;

    clearTimeout(self.timeout);

    self.hoverState = 'out';

    if (!self.options.delay || !self.options.delay.hide) return self.hide();

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide();
    }, self.options.delay.hide);
  };

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type);

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e);

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
      if (e.isDefaultPrevented() || !inDom) return;
      var that = this;

      var $tip = this.tip();

      var tipId = this.getUID(this.type);

      this.setContent();
      $tip.attr('id', tipId);
      this.$element.attr('aria-describedby', tipId);

      if (this.options.animation) $tip.addClass('fade');

      var placement = typeof this.options.placement == 'function' ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;

      var autoToken = /\s?auto?\s?/i;
      var autoPlace = autoToken.test(placement);
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top';

      $tip.detach().css({ top: 0, left: 0, display: 'block' }).addClass(placement).data('bs.' + this.type, this);

      this.options.container ? $tip.appendTo($(document).find(this.options.container)) : $tip.insertAfter(this.$element);
      this.$element.trigger('inserted.bs.' + this.type);

      var pos = this.getPosition();
      var actualWidth = $tip[0].offsetWidth;
      var actualHeight = $tip[0].offsetHeight;

      if (autoPlace) {
        var orgPlacement = placement;
        var viewportDim = this.getPosition(this.$viewport);

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' : placement == 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' : placement == 'right' && pos.right + actualWidth > viewportDim.width ? 'left' : placement == 'left' && pos.left - actualWidth < viewportDim.left ? 'right' : placement;

        $tip.removeClass(orgPlacement).addClass(placement);
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

      this.applyPlacement(calculatedOffset, placement);

      var complete = function complete() {
        var prevHoverState = that.hoverState;
        that.$element.trigger('shown.bs.' + that.type);
        that.hoverState = null;

        if (prevHoverState == 'out') that.leave(that);
      };

      $.support.transition && this.$tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();
    }
  };

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip = this.tip();
    var width = $tip[0].offsetWidth;
    var height = $tip[0].offsetHeight;

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10);
    var marginLeft = parseInt($tip.css('margin-left'), 10);

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop)) marginTop = 0;
    if (isNaN(marginLeft)) marginLeft = 0;

    offset.top += marginTop;
    offset.left += marginLeft;

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function using(props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        });
      }
    }, offset), 0);

    $tip.addClass('in');

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth = $tip[0].offsetWidth;
    var actualHeight = $tip[0].offsetHeight;

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight;
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

    if (delta.left) offset.left += delta.left;else offset.top += delta.top;

    var isVertical = /top|bottom/.test(placement);
    var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

    $tip.offset(offset);
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical);
  };

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow().css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%').css(isVertical ? 'top' : 'left', '');
  };

  Tooltip.prototype.setContent = function () {
    var $tip = this.tip();
    var title = this.getTitle();

    if (this.options.html) {
      if (this.options.sanitize) {
        title = sanitizeHtml(title, this.options.whiteList, this.options.sanitizeFn);
      }

      $tip.find('.tooltip-inner').html(title);
    } else {
      $tip.find('.tooltip-inner').text(title);
    }

    $tip.removeClass('fade in top bottom left right');
  };

  Tooltip.prototype.hide = function (callback) {
    var that = this;
    var $tip = $(this.$tip);
    var e = $.Event('hide.bs.' + this.type);

    function complete() {
      if (that.hoverState != 'in') $tip.detach();
      if (that.$element) {
        // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element.removeAttr('aria-describedby').trigger('hidden.bs.' + that.type);
      }
      callback && callback();
    }

    this.$element.trigger(e);

    if (e.isDefaultPrevented()) return;

    $tip.removeClass('in');

    $.support.transition && $tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();

    this.hoverState = null;

    return this;
  };

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element;
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '');
    }
  };

  Tooltip.prototype.hasContent = function () {
    return this.getTitle();
  };

  Tooltip.prototype.getPosition = function ($element) {
    $element = $element || this.$element;

    var el = $element[0];
    var isBody = el.tagName == 'BODY';

    var elRect = el.getBoundingClientRect();
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top });
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement;
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset = isBody ? { top: 0, left: 0 } : isSvg ? null : $element.offset();
    var scroll = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() };
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null;

    return $.extend({}, elRect, scroll, outerDims, elOffset);
  };

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 } : placement == 'top' ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } : placement == 'left' ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
    /* placement == 'right' */{ top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width };
  };

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 };
    if (!this.$viewport) return delta;

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
    var viewportDimensions = this.getPosition(this.$viewport);

    if (/right|left/.test(placement)) {
      var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
      if (topEdgeOffset < viewportDimensions.top) {
        // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset;
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) {
        // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
      }
    } else {
      var leftEdgeOffset = pos.left - viewportPadding;
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
      if (leftEdgeOffset < viewportDimensions.left) {
        // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset;
      } else if (rightEdgeOffset > viewportDimensions.right) {
        // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
      }
    }

    return delta;
  };

  Tooltip.prototype.getTitle = function () {
    var title;
    var $e = this.$element;
    var o = this.options;

    title = $e.attr('data-original-title') || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title);

    return title;
  };

  Tooltip.prototype.getUID = function (prefix) {
    do {
      prefix += ~~(Math.random() * 1000000);
    } while (document.getElementById(prefix));
    return prefix;
  };

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template);
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!');
      }
    }
    return this.$tip;
  };

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow');
  };

  Tooltip.prototype.enable = function () {
    this.enabled = true;
  };

  Tooltip.prototype.disable = function () {
    this.enabled = false;
  };

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled;
  };

  Tooltip.prototype.toggle = function (e) {
    var self = this;
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type);
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions());
        $(e.currentTarget).data('bs.' + this.type, self);
      }
    }

    if (e) {
      self.inState.click = !self.inState.click;
      if (self.isInStateTrue()) self.enter(self);else self.leave(self);
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self);
    }
  };

  Tooltip.prototype.destroy = function () {
    var that = this;
    clearTimeout(this.timeout);
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type);
      if (that.$tip) {
        that.$tip.detach();
      }
      that.$tip = null;
      that.$arrow = null;
      that.$viewport = null;
      that.$element = null;
    });
  };

  Tooltip.prototype.sanitizeHtml = function (unsafeHtml) {
    return sanitizeHtml(unsafeHtml, this.options.whiteList, this.options.sanitizeFn);
  };

  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.tooltip');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data && /destroy|hide/.test(option)) return;
      if (!data) $this.data('bs.tooltip', data = new Tooltip(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.tooltip;

  $.fn.tooltip = Plugin;
  $.fn.tooltip.Constructor = Tooltip;

  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old;
    return this;
  };
}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function Popover(element, options) {
    this.init('popover', element, options);
  };

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js');

  Popover.VERSION = '3.4.1';

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  });

  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);

  Popover.prototype.constructor = Popover;

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS;
  };

  Popover.prototype.setContent = function () {
    var $tip = this.tip();
    var title = this.getTitle();
    var content = this.getContent();

    if (this.options.html) {
      var typeContent = typeof content === 'undefined' ? 'undefined' : _typeof(content);

      if (this.options.sanitize) {
        title = this.sanitizeHtml(title);

        if (typeContent === 'string') {
          content = this.sanitizeHtml(content);
        }
      }

      $tip.find('.popover-title').html(title);
      $tip.find('.popover-content').children().detach().end()[typeContent === 'string' ? 'html' : 'append'](content);
    } else {
      $tip.find('.popover-title').text(title);
      $tip.find('.popover-content').children().detach().end().text(content);
    }

    $tip.removeClass('fade top bottom left right in');

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide();
  };

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent();
  };

  Popover.prototype.getContent = function () {
    var $e = this.$element;
    var o = this.options;

    return $e.attr('data-content') || (typeof o.content == 'function' ? o.content.call($e[0]) : o.content);
  };

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow');
  };

  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.popover');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data && /destroy|hide/.test(option)) return;
      if (!data) $this.data('bs.popover', data = new Popover(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.popover;

  $.fn.popover = Plugin;
  $.fn.popover.Constructor = Popover;

  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old;
    return this;
  };
}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body = $(document.body);
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element);
    this.options = $.extend({}, ScrollSpy.DEFAULTS, options);
    this.selector = (this.options.target || '') + ' .nav li > a';
    this.offsets = [];
    this.targets = [];
    this.activeTarget = null;
    this.scrollHeight = 0;

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this));
    this.refresh();
    this.process();
  }

  ScrollSpy.VERSION = '3.4.1';

  ScrollSpy.DEFAULTS = {
    offset: 10
  };

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
  };

  ScrollSpy.prototype.refresh = function () {
    var that = this;
    var offsetMethod = 'offset';
    var offsetBase = 0;

    this.offsets = [];
    this.targets = [];
    this.scrollHeight = this.getScrollHeight();

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position';
      offsetBase = this.$scrollElement.scrollTop();
    }

    this.$body.find(this.selector).map(function () {
      var $el = $(this);
      var href = $el.data('target') || $el.attr('href');
      var $href = /^#./.test(href) && $(href);

      return $href && $href.length && $href.is(':visible') && [[$href[offsetMethod]().top + offsetBase, href]] || null;
    }).sort(function (a, b) {
      return a[0] - b[0];
    }).each(function () {
      that.offsets.push(this[0]);
      that.targets.push(this[1]);
    });
  };

  ScrollSpy.prototype.process = function () {
    var scrollTop = this.$scrollElement.scrollTop() + this.options.offset;
    var scrollHeight = this.getScrollHeight();
    var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height();
    var offsets = this.offsets;
    var targets = this.targets;
    var activeTarget = this.activeTarget;
    var i;

    if (this.scrollHeight != scrollHeight) {
      this.refresh();
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i);
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null;
      return this.clear();
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i] && scrollTop >= offsets[i] && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1]) && this.activate(targets[i]);
    }
  };

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target;

    this.clear();

    var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]';

    var active = $(selector).parents('li').addClass('active');

    if (active.parent('.dropdown-menu').length) {
      active = active.closest('li.dropdown').addClass('active');
    }

    active.trigger('activate.bs.scrollspy');
  };

  ScrollSpy.prototype.clear = function () {
    $(this.selector).parentsUntil(this.options.target, '.active').removeClass('active');
  };

  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.scrollspy');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.scrollspy', data = new ScrollSpy(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.scrollspy;

  $.fn.scrollspy = Plugin;
  $.fn.scrollspy.Constructor = ScrollSpy;

  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old;
    return this;
  };

  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this);
      Plugin.call($spy, $spy.data());
    });
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function Tab(element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element);
    // jscs:enable requireDollarBeforejQueryAssignment
  };

  Tab.VERSION = '3.4.1';

  Tab.TRANSITION_DURATION = 150;

  Tab.prototype.show = function () {
    var $this = this.element;
    var $ul = $this.closest('ul:not(.dropdown-menu)');
    var selector = $this.data('target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return;

    var $previous = $ul.find('.active:last a');
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    });
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    });

    $previous.trigger(hideEvent);
    $this.trigger(showEvent);

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return;

    var $target = $(document).find(selector);

    this.activate($this.closest('li'), $ul);
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      });
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      });
    });
  };

  Tab.prototype.activate = function (element, container, callback) {
    var $active = container.find('> .active');
    var transition = callback && $.support.transition && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length);

    function next() {
      $active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded', false);

      element.addClass('active').find('[data-toggle="tab"]').attr('aria-expanded', true);

      if (transition) {
        element[0].offsetWidth; // reflow for transition
        element.addClass('in');
      } else {
        element.removeClass('fade');
      }

      if (element.parent('.dropdown-menu').length) {
        element.closest('li.dropdown').addClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded', true);
      }

      callback && callback();
    }

    $active.length && transition ? $active.one('bsTransitionEnd', next).emulateTransitionEnd(Tab.TRANSITION_DURATION) : next();

    $active.removeClass('in');
  };

  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.tab');

      if (!data) $this.data('bs.tab', data = new Tab(this));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.tab;

  $.fn.tab = Plugin;
  $.fn.tab.Constructor = Tab;

  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old;
    return this;
  };

  // TAB DATA-API
  // ============

  var clickHandler = function clickHandler(e) {
    e.preventDefault();
    Plugin.call($(this), 'show');
  };

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler).on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler);
}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#affix
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function Affix(element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options);

    var target = this.options.target === Affix.DEFAULTS.target ? $(this.options.target) : $(document).find(this.options.target);

    this.$target = target.on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this)).on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this));

    this.$element = $(element);
    this.affixed = null;
    this.unpin = null;
    this.pinnedOffset = null;

    this.checkPosition();
  };

  Affix.VERSION = '3.4.1';

  Affix.RESET = 'affix affix-top affix-bottom';

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  };

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop = this.$target.scrollTop();
    var position = this.$element.offset();
    var targetHeight = this.$target.height();

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false;

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return scrollTop + this.unpin <= position.top ? false : 'bottom';
      return scrollTop + targetHeight <= scrollHeight - offsetBottom ? false : 'bottom';
    }

    var initializing = this.affixed == null;
    var colliderTop = initializing ? scrollTop : position.top;
    var colliderHeight = initializing ? targetHeight : height;

    if (offsetTop != null && scrollTop <= offsetTop) return 'top';
    if (offsetBottom != null && colliderTop + colliderHeight >= scrollHeight - offsetBottom) return 'bottom';

    return false;
  };

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset;
    this.$element.removeClass(Affix.RESET).addClass('affix');
    var scrollTop = this.$target.scrollTop();
    var position = this.$element.offset();
    return this.pinnedOffset = position.top - scrollTop;
  };

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1);
  };

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return;

    var height = this.$element.height();
    var offset = this.options.offset;
    var offsetTop = offset.top;
    var offsetBottom = offset.bottom;
    var scrollHeight = Math.max($(document).height(), $(document.body).height());

    if ((typeof offset === 'undefined' ? 'undefined' : _typeof(offset)) != 'object') offsetBottom = offsetTop = offset;
    if (typeof offsetTop == 'function') offsetTop = offset.top(this.$element);
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element);

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom);

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '');

      var affixType = 'affix' + (affix ? '-' + affix : '');
      var e = $.Event(affixType + '.bs.affix');

      this.$element.trigger(e);

      if (e.isDefaultPrevented()) return;

      this.affixed = affix;
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null;

      this.$element.removeClass(Affix.RESET).addClass(affixType).trigger(affixType.replace('affix', 'affixed') + '.bs.affix');
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      });
    }
  };

  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.affix');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.affix', data = new Affix(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.affix;

  $.fn.affix = Plugin;
  $.fn.affix.Constructor = Affix;

  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old;
    return this;
  };

  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this);
      var data = $spy.data();

      data.offset = data.offset || {};

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom;
      if (data.offsetTop != null) data.offset.top = data.offsetTop;

      Plugin.call($spy, data);
    });
  });
}(jQuery);
'use strict';

// |--------------------------------------------------------------------------
// | Flexy header
// |--------------------------------------------------------------------------
// |
// | This jQuery script is written by
// |
// | Morten Nissen
// | hjemmesidekongen.dk
// |

var flexy_header = function ($) {
    'use strict';

    var pub = {},
        $header_static = $('.flexy-header--static'),
        $header_sticky = $('.flexy-header--sticky'),
        options = {
        update_interval: 100,
        tolerance: {
            upward: 20,
            downward: 10
        },
        offset: _get_offset_from_elements_bottom($header_static),
        classes: {
            pinned: "flexy-header--pinned",
            unpinned: "flexy-header--unpinned"
        }
    },
        was_scrolled = false,
        last_distance_from_top = 0;

    /**
     * Instantiate
     */
    pub.init = function (options) {
        registerEventHandlers();
        registerBootEventHandlers();
    };

    /**
     * Register boot event handlers
     */
    function registerBootEventHandlers() {
        $header_sticky.addClass(options.classes.unpinned);

        setInterval(function () {

            if (was_scrolled) {
                document_was_scrolled();

                was_scrolled = false;
            }
        }, options.update_interval);
    }

    /**
     * Register event handlers
     */
    function registerEventHandlers() {
        $(window).scroll(function (event) {
            was_scrolled = true;
        });
    }

    /**
     * Get offset from element bottom
     */
    function _get_offset_from_elements_bottom($element) {
        var element_height = $element.outerHeight(true),
            element_offset = $element.offset().top;

        return element_height + element_offset;
    }

    /**
     * Document was scrolled
     */
    function document_was_scrolled() {
        var current_distance_from_top = $(window).scrollTop();

        // If past offset
        if (current_distance_from_top >= options.offset) {

            // Downwards scroll
            if (current_distance_from_top > last_distance_from_top) {

                // Obey the downward tolerance
                if (Math.abs(current_distance_from_top - last_distance_from_top) <= options.tolerance.downward) {
                    return;
                }

                $header_sticky.removeClass(options.classes.pinned).addClass(options.classes.unpinned);
            }

            // Upwards scroll
            else {

                    // Obey the upward tolerance
                    if (Math.abs(current_distance_from_top - last_distance_from_top) <= options.tolerance.upward) {
                        return;
                    }

                    // We are not scrolled past the document which is possible on the Mac
                    if (current_distance_from_top + $(window).height() < $(document).height()) {
                        $header_sticky.removeClass(options.classes.unpinned).addClass(options.classes.pinned);
                    }
                }
        }

        // Not past offset
        else {
                $header_sticky.removeClass(options.classes.pinned).addClass(options.classes.unpinned);
            }

        last_distance_from_top = current_distance_from_top;
    }

    return pub;
}(jQuery);
'use strict';

// |--------------------------------------------------------------------------
// | Flexy navigation
// |--------------------------------------------------------------------------
// |
// | This jQuery script is written by
// |
// | Morten Nissen
// | hjemmesidekongen.dk
// |

var flexy_navigation = function ($) {
    'use strict';

    var pub = {},
        layout_classes = {
        'navigation': '.flexy-navigation',
        'obfuscator': '.flexy-navigation__obfuscator',
        'dropdown': '.flexy-navigation__item--dropdown',
        'dropdown_megamenu': '.flexy-navigation__item__dropdown-megamenu',

        'is_upgraded': 'is-upgraded',
        'navigation_has_megamenu': 'has-megamenu',
        'dropdown_has_megamenu': 'flexy-navigation__item--dropdown-with-megamenu'
    };

    /**
     * Instantiate
     */
    pub.init = function (options) {
        registerEventHandlers();
        registerBootEventHandlers();
    };

    /**
     * Register boot event handlers
     */
    function registerBootEventHandlers() {

        // Upgrade
        upgrade();
    }

    /**
     * Register event handlers
     */
    function registerEventHandlers() {}

    /**
     * Upgrade elements.
     * Add classes to elements, based upon attached classes.
     */
    function upgrade() {
        var $navigations = $(layout_classes.navigation);

        // Navigations
        if ($navigations.length > 0) {
            $navigations.each(function (index, element) {
                var $navigation = $(this),
                    $megamenus = $navigation.find(layout_classes.dropdown_megamenu),
                    $dropdown_megamenu = $navigation.find(layout_classes.dropdown_has_megamenu);

                // Has already been upgraded
                if ($navigation.hasClass(layout_classes.is_upgraded)) {
                    return;
                }

                // Has megamenu
                if ($megamenus.length > 0) {
                    $navigation.addClass(layout_classes.navigation_has_megamenu);

                    // Run through all megamenus
                    $megamenus.each(function (index, element) {
                        var $megamenu = $(this),
                            has_obfuscator = $('html').hasClass('has-obfuscator') ? true : false;

                        $megamenu.parents(layout_classes.dropdown).addClass(layout_classes.dropdown_has_megamenu).hover(function () {

                            if (has_obfuscator) {
                                obfuscator.show();
                            }
                        }, function () {

                            if (has_obfuscator) {
                                obfuscator.hide();
                            }
                        });
                    });
                }

                // Is upgraded
                $navigation.addClass(layout_classes.is_upgraded);
            });
        }
    }

    return pub;
}(jQuery);
"use strict";

/*! sidr - v2.2.1 - 2016-02-17
 * http://www.berriart.com/sidr/
 * Copyright (c) 2013-2016 Alberto Varela; Licensed MIT */

(function () {
  'use strict';

  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  babelHelpers;

  var sidrStatus = {
    moving: false,
    opened: false
  };

  var helper = {
    // Check for valids urls
    // From : http://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-an-url

    isUrl: function isUrl(str) {
      var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

      if (pattern.test(str)) {
        return true;
      } else {
        return false;
      }
    },

    // Add sidr prefixes
    addPrefixes: function addPrefixes($element) {
      this.addPrefix($element, 'id');
      this.addPrefix($element, 'class');
      $element.removeAttr('style');
    },
    addPrefix: function addPrefix($element, attribute) {
      var toReplace = $element.attr(attribute);

      if (typeof toReplace === 'string' && toReplace !== '' && toReplace !== 'sidr-inner') {
        $element.attr(attribute, toReplace.replace(/([A-Za-z0-9_.\-]+)/g, 'sidr-' + attribute + '-$1'));
      }
    },

    // Check if transitions is supported
    transitions: function () {
      var body = document.body || document.documentElement,
          style = body.style,
          supported = false,
          property = 'transition';

      if (property in style) {
        supported = true;
      } else {
        (function () {
          var prefixes = ['moz', 'webkit', 'o', 'ms'],
              prefix = undefined,
              i = undefined;

          property = property.charAt(0).toUpperCase() + property.substr(1);
          supported = function () {
            for (i = 0; i < prefixes.length; i++) {
              prefix = prefixes[i];
              if (prefix + property in style) {
                return true;
              }
            }

            return false;
          }();
          property = supported ? '-' + prefix.toLowerCase() + '-' + property.toLowerCase() : null;
        })();
      }

      return {
        supported: supported,
        property: property
      };
    }()
  };

  var $$2 = jQuery;

  var bodyAnimationClass = 'sidr-animating';
  var openAction = 'open';
  var closeAction = 'close';
  var transitionEndEvent = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
  var Menu = function () {
    function Menu(name) {
      babelHelpers.classCallCheck(this, Menu);

      this.name = name;
      this.item = $$2('#' + name);
      this.openClass = name === 'sidr' ? 'sidr-open' : 'sidr-open ' + name + '-open';
      this.menuWidth = this.item.outerWidth(true);
      this.speed = this.item.data('speed');
      this.side = this.item.data('side');
      this.displace = this.item.data('displace');
      this.timing = this.item.data('timing');
      this.method = this.item.data('method');
      this.onOpenCallback = this.item.data('onOpen');
      this.onCloseCallback = this.item.data('onClose');
      this.onOpenEndCallback = this.item.data('onOpenEnd');
      this.onCloseEndCallback = this.item.data('onCloseEnd');
      this.body = $$2(this.item.data('body'));
    }

    babelHelpers.createClass(Menu, [{
      key: 'getAnimation',
      value: function getAnimation(action, element) {
        var animation = {},
            prop = this.side;

        if (action === 'open' && element === 'body') {
          animation[prop] = this.menuWidth + 'px';
        } else if (action === 'close' && element === 'menu') {
          animation[prop] = '-' + this.menuWidth + 'px';
        } else {
          animation[prop] = 0;
        }

        return animation;
      }
    }, {
      key: 'prepareBody',
      value: function prepareBody(action) {
        var prop = action === 'open' ? 'hidden' : '';

        // Prepare page if container is body
        if (this.body.is('body')) {
          var $html = $$2('html'),
              scrollTop = $html.scrollTop();

          $html.css('overflow-x', prop).scrollTop(scrollTop);
        }
      }
    }, {
      key: 'openBody',
      value: function openBody() {
        if (this.displace) {
          var transitions = helper.transitions,
              $body = this.body;

          if (transitions.supported) {
            $body.css(transitions.property, this.side + ' ' + this.speed / 1000 + 's ' + this.timing).css(this.side, 0).css({
              width: $body.width(),
              position: 'absolute'
            });
            $body.css(this.side, this.menuWidth + 'px');
          } else {
            var bodyAnimation = this.getAnimation(openAction, 'body');

            $body.css({
              width: $body.width(),
              position: 'absolute'
            }).animate(bodyAnimation, {
              queue: false,
              duration: this.speed
            });
          }
        }
      }
    }, {
      key: 'onCloseBody',
      value: function onCloseBody() {
        var transitions = helper.transitions,
            resetStyles = {
          width: '',
          position: '',
          right: '',
          left: ''
        };

        if (transitions.supported) {
          resetStyles[transitions.property] = '';
        }

        this.body.css(resetStyles).unbind(transitionEndEvent);
      }
    }, {
      key: 'closeBody',
      value: function closeBody() {
        var _this = this;

        if (this.displace) {
          if (helper.transitions.supported) {
            this.body.css(this.side, 0).one(transitionEndEvent, function () {
              _this.onCloseBody();
            });
          } else {
            var bodyAnimation = this.getAnimation(closeAction, 'body');

            this.body.animate(bodyAnimation, {
              queue: false,
              duration: this.speed,
              complete: function complete() {
                _this.onCloseBody();
              }
            });
          }
        }
      }
    }, {
      key: 'moveBody',
      value: function moveBody(action) {
        if (action === openAction) {
          this.openBody();
        } else {
          this.closeBody();
        }
      }
    }, {
      key: 'onOpenMenu',
      value: function onOpenMenu(callback) {
        var name = this.name;

        sidrStatus.moving = false;
        sidrStatus.opened = name;

        this.item.unbind(transitionEndEvent);

        this.body.removeClass(bodyAnimationClass).addClass(this.openClass);

        this.onOpenEndCallback();

        if (typeof callback === 'function') {
          callback(name);
        }
      }
    }, {
      key: 'openMenu',
      value: function openMenu(callback) {
        var _this2 = this;

        var $item = this.item;

        if (helper.transitions.supported) {
          $item.css(this.side, 0).one(transitionEndEvent, function () {
            _this2.onOpenMenu(callback);
          });
        } else {
          var menuAnimation = this.getAnimation(openAction, 'menu');

          $item.css('display', 'block').animate(menuAnimation, {
            queue: false,
            duration: this.speed,
            complete: function complete() {
              _this2.onOpenMenu(callback);
            }
          });
        }
      }
    }, {
      key: 'onCloseMenu',
      value: function onCloseMenu(callback) {
        this.item.css({
          left: '',
          right: ''
        }).unbind(transitionEndEvent);
        $$2('html').css('overflow-x', '');

        sidrStatus.moving = false;
        sidrStatus.opened = false;

        this.body.removeClass(bodyAnimationClass).removeClass(this.openClass);

        this.onCloseEndCallback();

        // Callback
        if (typeof callback === 'function') {
          callback(name);
        }
      }
    }, {
      key: 'closeMenu',
      value: function closeMenu(callback) {
        var _this3 = this;

        var item = this.item;

        if (helper.transitions.supported) {
          item.css(this.side, '').one(transitionEndEvent, function () {
            _this3.onCloseMenu(callback);
          });
        } else {
          var menuAnimation = this.getAnimation(closeAction, 'menu');

          item.animate(menuAnimation, {
            queue: false,
            duration: this.speed,
            complete: function complete() {
              _this3.onCloseMenu();
            }
          });
        }
      }
    }, {
      key: 'moveMenu',
      value: function moveMenu(action, callback) {
        this.body.addClass(bodyAnimationClass);

        if (action === openAction) {
          this.openMenu(callback);
        } else {
          this.closeMenu(callback);
        }
      }
    }, {
      key: 'move',
      value: function move(action, callback) {
        // Lock sidr
        sidrStatus.moving = true;

        this.prepareBody(action);
        this.moveBody(action);
        this.moveMenu(action, callback);
      }
    }, {
      key: 'open',
      value: function open(callback) {
        var _this4 = this;

        // Check if is already opened or moving
        if (sidrStatus.opened === this.name || sidrStatus.moving) {
          return;
        }

        // If another menu opened close first
        if (sidrStatus.opened !== false) {
          var alreadyOpenedMenu = new Menu(sidrStatus.opened);

          alreadyOpenedMenu.close(function () {
            _this4.open(callback);
          });

          return;
        }

        this.move('open', callback);

        // onOpen callback
        this.onOpenCallback();
      }
    }, {
      key: 'close',
      value: function close(callback) {
        // Check if is already closed or moving
        if (sidrStatus.opened !== this.name || sidrStatus.moving) {
          return;
        }

        this.move('close', callback);

        // onClose callback
        this.onCloseCallback();
      }
    }, {
      key: 'toggle',
      value: function toggle(callback) {
        if (sidrStatus.opened === this.name) {
          this.close(callback);
        } else {
          this.open(callback);
        }
      }
    }]);
    return Menu;
  }();

  var $$1 = jQuery;

  function execute(action, name, callback) {
    var sidr = new Menu(name);

    switch (action) {
      case 'open':
        sidr.open(callback);
        break;
      case 'close':
        sidr.close(callback);
        break;
      case 'toggle':
        sidr.toggle(callback);
        break;
      default:
        $$1.error('Method ' + action + ' does not exist on jQuery.sidr');
        break;
    }
  }

  var i;
  var $ = jQuery;
  var publicMethods = ['open', 'close', 'toggle'];
  var methodName;
  var methods = {};
  var getMethod = function getMethod(methodName) {
    return function (name, callback) {
      // Check arguments
      if (typeof name === 'function') {
        callback = name;
        name = 'sidr';
      } else if (!name) {
        name = 'sidr';
      }

      execute(methodName, name, callback);
    };
  };
  for (i = 0; i < publicMethods.length; i++) {
    methodName = publicMethods[i];
    methods[methodName] = getMethod(methodName);
  }

  function sidr(method) {
    if (method === 'status') {
      return sidrStatus;
    } else if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'function' || typeof method === 'string' || !method) {
      return methods.toggle.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sidr');
    }
  }

  var $$3 = jQuery;

  function fillContent($sideMenu, settings) {
    // The menu content
    if (typeof settings.source === 'function') {
      var newContent = settings.source(name);

      $sideMenu.html(newContent);
    } else if (typeof settings.source === 'string' && helper.isUrl(settings.source)) {
      $$3.get(settings.source, function (data) {
        $sideMenu.html(data);
      });
    } else if (typeof settings.source === 'string') {
      var htmlContent = '',
          selectors = settings.source.split(',');

      $$3.each(selectors, function (index, element) {
        htmlContent += '<div class="sidr-inner">' + $$3(element).html() + '</div>';
      });

      // Renaming ids and classes
      if (settings.renaming) {
        var $htmlContent = $$3('<div />').html(htmlContent);

        $htmlContent.find('*').each(function (index, element) {
          var $element = $$3(element);

          helper.addPrefixes($element);
        });
        htmlContent = $htmlContent.html();
      }

      $sideMenu.html(htmlContent);
    } else if (settings.source !== null) {
      $$3.error('Invalid Sidr Source');
    }

    return $sideMenu;
  }

  function fnSidr(options) {
    var transitions = helper.transitions,
        settings = $$3.extend({
      name: 'sidr', // Name for the 'sidr'
      speed: 200, // Accepts standard jQuery effects speeds (i.e. fast, normal or milliseconds)
      side: 'left', // Accepts 'left' or 'right'
      source: null, // Override the source of the content.
      renaming: true, // The ids and classes will be prepended with a prefix when loading existent content
      body: 'body', // Page container selector,
      displace: true, // Displace the body content or not
      timing: 'ease', // Timing function for CSS transitions
      method: 'toggle', // The method to call when element is clicked
      bind: 'touchstart click', // The event(s) to trigger the menu
      onOpen: function onOpen() {},
      // Callback when sidr start opening
      onClose: function onClose() {},
      // Callback when sidr start closing
      onOpenEnd: function onOpenEnd() {},
      // Callback when sidr end opening
      onCloseEnd: function onCloseEnd() {} // Callback when sidr end closing

    }, options),
        name = settings.name,
        $sideMenu = $$3('#' + name);

    // If the side menu do not exist create it
    if ($sideMenu.length === 0) {
      $sideMenu = $$3('<div />').attr('id', name).appendTo($$3('body'));
    }

    // Add transition to menu if are supported
    if (transitions.supported) {
      $sideMenu.css(transitions.property, settings.side + ' ' + settings.speed / 1000 + 's ' + settings.timing);
    }

    // Adding styles and options
    $sideMenu.addClass('sidr').addClass(settings.side).data({
      speed: settings.speed,
      side: settings.side,
      body: settings.body,
      displace: settings.displace,
      timing: settings.timing,
      method: settings.method,
      onOpen: settings.onOpen,
      onClose: settings.onClose,
      onOpenEnd: settings.onOpenEnd,
      onCloseEnd: settings.onCloseEnd
    });

    $sideMenu = fillContent($sideMenu, settings);

    return this.each(function () {
      var $this = $$3(this),
          data = $this.data('sidr'),
          flag = false;

      // If the plugin hasn't been initialized yet
      if (!data) {
        sidrStatus.moving = false;
        sidrStatus.opened = false;

        $this.data('sidr', name);

        $this.bind(settings.bind, function (event) {
          event.preventDefault();

          if (!flag) {
            flag = true;
            sidr(settings.method, name);

            setTimeout(function () {
              flag = false;
            }, 100);
          }
        });
      }
    });
  }

  jQuery.sidr = sidr;
  jQuery.fn.sidr = fnSidr;
})();
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
  var AjaxMonitor,
      Bar,
      DocumentMonitor,
      ElementMonitor,
      ElementTracker,
      EventLagMonitor,
      Evented,
      Events,
      NoTargetError,
      Pace,
      RequestIntercept,
      SOURCE_KEYS,
      Scaler,
      SocketRequestTracker,
      XHRRequestTracker,
      animation,
      avgAmplitude,
      bar,
      cancelAnimation,
      cancelAnimationFrame,
      defaultOptions,
      _extend,
      extendNative,
      getFromDOM,
      getIntercept,
      handlePushState,
      ignoreStack,
      init,
      now,
      options,
      requestAnimationFrame,
      result,
      runAnimation,
      scalers,
      shouldIgnoreURL,
      shouldTrack,
      source,
      sources,
      uniScaler,
      _WebSocket,
      _XDomainRequest,
      _XMLHttpRequest,
      _i,
      _intercept,
      _len,
      _pushState,
      _ref,
      _ref1,
      _replaceState,
      __slice = [].slice,
      __hasProp = {}.hasOwnProperty,
      __extends = function __extends(child, parent) {
    for (var key in parent) {
      if (__hasProp.call(parent, key)) child[key] = parent[key];
    }function ctor() {
      this.constructor = child;
    }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
  },
      __indexOf = [].indexOf || function (item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (i in this && this[i] === item) return i;
    }return -1;
  };

  defaultOptions = {
    catchupTime: 100,
    initialRate: .03,
    minTime: 250,
    ghostTime: 100,
    maxProgressPerFrame: 20,
    easeFactor: 1.25,
    startOnPageLoad: true,
    restartOnPushState: true,
    restartOnRequestAfter: 500,
    target: 'body',
    elements: {
      checkInterval: 100,
      selectors: ['body']
    },
    eventLag: {
      minSamples: 10,
      sampleCount: 3,
      lagThreshold: 3
    },
    ajax: {
      trackMethods: ['GET'],
      trackWebSockets: true,
      ignoreURLs: []
    }
  };

  now = function now() {
    var _ref;
    return (_ref = typeof performance !== "undefined" && performance !== null ? typeof performance.now === "function" ? performance.now() : void 0 : void 0) != null ? _ref : +new Date();
  };

  requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  if (requestAnimationFrame == null) {
    requestAnimationFrame = function requestAnimationFrame(fn) {
      return setTimeout(fn, 50);
    };
    cancelAnimationFrame = function cancelAnimationFrame(id) {
      return clearTimeout(id);
    };
  }

  runAnimation = function runAnimation(fn) {
    var last, _tick;
    last = now();
    _tick = function tick() {
      var diff;
      diff = now() - last;
      if (diff >= 33) {
        last = now();
        return fn(diff, function () {
          return requestAnimationFrame(_tick);
        });
      } else {
        return setTimeout(_tick, 33 - diff);
      }
    };
    return _tick();
  };

  result = function result() {
    var args, key, obj;
    obj = arguments[0], key = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if (typeof obj[key] === 'function') {
      return obj[key].apply(obj, args);
    } else {
      return obj[key];
    }
  };

  _extend = function extend() {
    var key, out, source, sources, val, _i, _len;
    out = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = sources.length; _i < _len; _i++) {
      source = sources[_i];
      if (source) {
        for (key in source) {
          if (!__hasProp.call(source, key)) continue;
          val = source[key];
          if (out[key] != null && _typeof(out[key]) === 'object' && val != null && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
            _extend(out[key], val);
          } else {
            out[key] = val;
          }
        }
      }
    }
    return out;
  };

  avgAmplitude = function avgAmplitude(arr) {
    var count, sum, v, _i, _len;
    sum = count = 0;
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      v = arr[_i];
      sum += Math.abs(v);
      count++;
    }
    return sum / count;
  };

  getFromDOM = function getFromDOM(key, json) {
    var data, e, el;
    if (key == null) {
      key = 'options';
    }
    if (json == null) {
      json = true;
    }
    el = document.querySelector("[data-pace-" + key + "]");
    if (!el) {
      return;
    }
    data = el.getAttribute("data-pace-" + key);
    if (!json) {
      return data;
    }
    try {
      return JSON.parse(data);
    } catch (_error) {
      e = _error;
      return typeof console !== "undefined" && console !== null ? console.error("Error parsing inline pace options", e) : void 0;
    }
  };

  Evented = function () {
    function Evented() {}

    Evented.prototype.on = function (event, handler, ctx, once) {
      var _base;
      if (once == null) {
        once = false;
      }
      if (this.bindings == null) {
        this.bindings = {};
      }
      if ((_base = this.bindings)[event] == null) {
        _base[event] = [];
      }
      return this.bindings[event].push({
        handler: handler,
        ctx: ctx,
        once: once
      });
    };

    Evented.prototype.once = function (event, handler, ctx) {
      return this.on(event, handler, ctx, true);
    };

    Evented.prototype.off = function (event, handler) {
      var i, _ref, _results;
      if (((_ref = this.bindings) != null ? _ref[event] : void 0) == null) {
        return;
      }
      if (handler == null) {
        return delete this.bindings[event];
      } else {
        i = 0;
        _results = [];
        while (i < this.bindings[event].length) {
          if (this.bindings[event][i].handler === handler) {
            _results.push(this.bindings[event].splice(i, 1));
          } else {
            _results.push(i++);
          }
        }
        return _results;
      }
    };

    Evented.prototype.trigger = function () {
      var args, ctx, event, handler, i, once, _ref, _ref1, _results;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if ((_ref = this.bindings) != null ? _ref[event] : void 0) {
        i = 0;
        _results = [];
        while (i < this.bindings[event].length) {
          _ref1 = this.bindings[event][i], handler = _ref1.handler, ctx = _ref1.ctx, once = _ref1.once;
          handler.apply(ctx != null ? ctx : this, args);
          if (once) {
            _results.push(this.bindings[event].splice(i, 1));
          } else {
            _results.push(i++);
          }
        }
        return _results;
      }
    };

    return Evented;
  }();

  Pace = window.Pace || {};

  window.Pace = Pace;

  _extend(Pace, Evented.prototype);

  options = Pace.options = _extend({}, defaultOptions, window.paceOptions, getFromDOM());

  _ref = ['ajax', 'document', 'eventLag', 'elements'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    source = _ref[_i];
    if (options[source] === true) {
      options[source] = defaultOptions[source];
    }
  }

  NoTargetError = function (_super) {
    __extends(NoTargetError, _super);

    function NoTargetError() {
      _ref1 = NoTargetError.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    return NoTargetError;
  }(Error);

  Bar = function () {
    function Bar() {
      this.progress = 0;
    }

    Bar.prototype.getElement = function () {
      var targetElement;
      if (this.el == null) {
        targetElement = document.querySelector(options.target);
        if (!targetElement) {
          throw new NoTargetError();
        }
        this.el = document.createElement('div');
        this.el.className = "pace pace-active";
        document.body.className = document.body.className.replace(/pace-done/g, '');
        document.body.className += ' pace-running';
        this.el.innerHTML = '<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>';
        if (targetElement.firstChild != null) {
          targetElement.insertBefore(this.el, targetElement.firstChild);
        } else {
          targetElement.appendChild(this.el);
        }
      }
      return this.el;
    };

    Bar.prototype.finish = function () {
      var el;
      el = this.getElement();
      el.className = el.className.replace('pace-active', '');
      el.className += ' pace-inactive';
      document.body.className = document.body.className.replace('pace-running', '');
      return document.body.className += ' pace-done';
    };

    Bar.prototype.update = function (prog) {
      this.progress = prog;
      return this.render();
    };

    Bar.prototype.destroy = function () {
      try {
        this.getElement().parentNode.removeChild(this.getElement());
      } catch (_error) {
        NoTargetError = _error;
      }
      return this.el = void 0;
    };

    Bar.prototype.render = function () {
      var el, key, progressStr, transform, _j, _len1, _ref2;
      if (document.querySelector(options.target) == null) {
        return false;
      }
      el = this.getElement();
      transform = "translate3d(" + this.progress + "%, 0, 0)";
      _ref2 = ['webkitTransform', 'msTransform', 'transform'];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        key = _ref2[_j];
        el.children[0].style[key] = transform;
      }
      if (!this.lastRenderedProgress || this.lastRenderedProgress | 0 !== this.progress | 0) {
        el.children[0].setAttribute('data-progress-text', "" + (this.progress | 0) + "%");
        if (this.progress >= 100) {
          progressStr = '99';
        } else {
          progressStr = this.progress < 10 ? "0" : "";
          progressStr += this.progress | 0;
        }
        el.children[0].setAttribute('data-progress', "" + progressStr);
      }
      return this.lastRenderedProgress = this.progress;
    };

    Bar.prototype.done = function () {
      return this.progress >= 100;
    };

    return Bar;
  }();

  Events = function () {
    function Events() {
      this.bindings = {};
    }

    Events.prototype.trigger = function (name, val) {
      var binding, _j, _len1, _ref2, _results;
      if (this.bindings[name] != null) {
        _ref2 = this.bindings[name];
        _results = [];
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          binding = _ref2[_j];
          _results.push(binding.call(this, val));
        }
        return _results;
      }
    };

    Events.prototype.on = function (name, fn) {
      var _base;
      if ((_base = this.bindings)[name] == null) {
        _base[name] = [];
      }
      return this.bindings[name].push(fn);
    };

    return Events;
  }();

  _XMLHttpRequest = window.XMLHttpRequest;

  _XDomainRequest = window.XDomainRequest;

  _WebSocket = window.WebSocket;

  extendNative = function extendNative(to, from) {
    var e, key, _results;
    _results = [];
    for (key in from.prototype) {
      try {
        if (to[key] == null && typeof from[key] !== 'function') {
          if (typeof Object.defineProperty === 'function') {
            _results.push(Object.defineProperty(to, key, {
              get: function get() {
                return from.prototype[key];
              },
              configurable: true,
              enumerable: true
            }));
          } else {
            _results.push(to[key] = from.prototype[key]);
          }
        } else {
          _results.push(void 0);
        }
      } catch (_error) {
        e = _error;
      }
    }
    return _results;
  };

  ignoreStack = [];

  Pace.ignore = function () {
    var args, fn, ret;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    ignoreStack.unshift('ignore');
    ret = fn.apply(null, args);
    ignoreStack.shift();
    return ret;
  };

  Pace.track = function () {
    var args, fn, ret;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    ignoreStack.unshift('track');
    ret = fn.apply(null, args);
    ignoreStack.shift();
    return ret;
  };

  shouldTrack = function shouldTrack(method) {
    var _ref2;
    if (method == null) {
      method = 'GET';
    }
    if (ignoreStack[0] === 'track') {
      return 'force';
    }
    if (!ignoreStack.length && options.ajax) {
      if (method === 'socket' && options.ajax.trackWebSockets) {
        return true;
      } else if (_ref2 = method.toUpperCase(), __indexOf.call(options.ajax.trackMethods, _ref2) >= 0) {
        return true;
      }
    }
    return false;
  };

  RequestIntercept = function (_super) {
    __extends(RequestIntercept, _super);

    function RequestIntercept() {
      var monitorXHR,
          _this = this;
      RequestIntercept.__super__.constructor.apply(this, arguments);
      monitorXHR = function monitorXHR(req) {
        var _open;
        _open = req.open;
        return req.open = function (type, url, async) {
          if (shouldTrack(type)) {
            _this.trigger('request', {
              type: type,
              url: url,
              request: req
            });
          }
          return _open.apply(req, arguments);
        };
      };
      window.XMLHttpRequest = function (flags) {
        var req;
        req = new _XMLHttpRequest(flags);
        monitorXHR(req);
        return req;
      };
      try {
        extendNative(window.XMLHttpRequest, _XMLHttpRequest);
      } catch (_error) {}
      if (_XDomainRequest != null) {
        window.XDomainRequest = function () {
          var req;
          req = new _XDomainRequest();
          monitorXHR(req);
          return req;
        };
        try {
          extendNative(window.XDomainRequest, _XDomainRequest);
        } catch (_error) {}
      }
      if (_WebSocket != null && options.ajax.trackWebSockets) {
        window.WebSocket = function (url, protocols) {
          var req;
          if (protocols != null) {
            req = new _WebSocket(url, protocols);
          } else {
            req = new _WebSocket(url);
          }
          if (shouldTrack('socket')) {
            _this.trigger('request', {
              type: 'socket',
              url: url,
              protocols: protocols,
              request: req
            });
          }
          return req;
        };
        try {
          extendNative(window.WebSocket, _WebSocket);
        } catch (_error) {}
      }
    }

    return RequestIntercept;
  }(Events);

  _intercept = null;

  getIntercept = function getIntercept() {
    if (_intercept == null) {
      _intercept = new RequestIntercept();
    }
    return _intercept;
  };

  shouldIgnoreURL = function shouldIgnoreURL(url) {
    var pattern, _j, _len1, _ref2;
    _ref2 = options.ajax.ignoreURLs;
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      pattern = _ref2[_j];
      if (typeof pattern === 'string') {
        if (url.indexOf(pattern) !== -1) {
          return true;
        }
      } else {
        if (pattern.test(url)) {
          return true;
        }
      }
    }
    return false;
  };

  getIntercept().on('request', function (_arg) {
    var after, args, request, type, url;
    type = _arg.type, request = _arg.request, url = _arg.url;
    if (shouldIgnoreURL(url)) {
      return;
    }
    if (!Pace.running && (options.restartOnRequestAfter !== false || shouldTrack(type) === 'force')) {
      args = arguments;
      after = options.restartOnRequestAfter || 0;
      if (typeof after === 'boolean') {
        after = 0;
      }
      return setTimeout(function () {
        var stillActive, _j, _len1, _ref2, _ref3, _results;
        if (type === 'socket') {
          stillActive = request.readyState < 2;
        } else {
          stillActive = 0 < (_ref2 = request.readyState) && _ref2 < 4;
        }
        if (stillActive) {
          Pace.restart();
          _ref3 = Pace.sources;
          _results = [];
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            source = _ref3[_j];
            if (source instanceof AjaxMonitor) {
              source.watch.apply(source, args);
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      }, after);
    }
  });

  AjaxMonitor = function () {
    function AjaxMonitor() {
      var _this = this;
      this.elements = [];
      getIntercept().on('request', function () {
        return _this.watch.apply(_this, arguments);
      });
    }

    AjaxMonitor.prototype.watch = function (_arg) {
      var request, tracker, type, url;
      type = _arg.type, request = _arg.request, url = _arg.url;
      if (shouldIgnoreURL(url)) {
        return;
      }
      if (type === 'socket') {
        tracker = new SocketRequestTracker(request);
      } else {
        tracker = new XHRRequestTracker(request);
      }
      return this.elements.push(tracker);
    };

    return AjaxMonitor;
  }();

  XHRRequestTracker = function () {
    function XHRRequestTracker(request) {
      var event,
          size,
          _j,
          _len1,
          _onreadystatechange,
          _ref2,
          _this = this;
      this.progress = 0;
      if (window.ProgressEvent != null) {
        size = null;
        request.addEventListener('progress', function (evt) {
          if (evt.lengthComputable) {
            return _this.progress = 100 * evt.loaded / evt.total;
          } else {
            return _this.progress = _this.progress + (100 - _this.progress) / 2;
          }
        }, false);
        _ref2 = ['load', 'abort', 'timeout', 'error'];
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          event = _ref2[_j];
          request.addEventListener(event, function () {
            return _this.progress = 100;
          }, false);
        }
      } else {
        _onreadystatechange = request.onreadystatechange;
        request.onreadystatechange = function () {
          var _ref3;
          if ((_ref3 = request.readyState) === 0 || _ref3 === 4) {
            _this.progress = 100;
          } else if (request.readyState === 3) {
            _this.progress = 50;
          }
          return typeof _onreadystatechange === "function" ? _onreadystatechange.apply(null, arguments) : void 0;
        };
      }
    }

    return XHRRequestTracker;
  }();

  SocketRequestTracker = function () {
    function SocketRequestTracker(request) {
      var event,
          _j,
          _len1,
          _ref2,
          _this = this;
      this.progress = 0;
      _ref2 = ['error', 'open'];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        event = _ref2[_j];
        request.addEventListener(event, function () {
          return _this.progress = 100;
        }, false);
      }
    }

    return SocketRequestTracker;
  }();

  ElementMonitor = function () {
    function ElementMonitor(options) {
      var selector, _j, _len1, _ref2;
      if (options == null) {
        options = {};
      }
      this.elements = [];
      if (options.selectors == null) {
        options.selectors = [];
      }
      _ref2 = options.selectors;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        selector = _ref2[_j];
        this.elements.push(new ElementTracker(selector));
      }
    }

    return ElementMonitor;
  }();

  ElementTracker = function () {
    function ElementTracker(selector) {
      this.selector = selector;
      this.progress = 0;
      this.check();
    }

    ElementTracker.prototype.check = function () {
      var _this = this;
      if (document.querySelector(this.selector)) {
        return this.done();
      } else {
        return setTimeout(function () {
          return _this.check();
        }, options.elements.checkInterval);
      }
    };

    ElementTracker.prototype.done = function () {
      return this.progress = 100;
    };

    return ElementTracker;
  }();

  DocumentMonitor = function () {
    DocumentMonitor.prototype.states = {
      loading: 0,
      interactive: 50,
      complete: 100
    };

    function DocumentMonitor() {
      var _onreadystatechange,
          _ref2,
          _this = this;
      this.progress = (_ref2 = this.states[document.readyState]) != null ? _ref2 : 100;
      _onreadystatechange = document.onreadystatechange;
      document.onreadystatechange = function () {
        if (_this.states[document.readyState] != null) {
          _this.progress = _this.states[document.readyState];
        }
        return typeof _onreadystatechange === "function" ? _onreadystatechange.apply(null, arguments) : void 0;
      };
    }

    return DocumentMonitor;
  }();

  EventLagMonitor = function () {
    function EventLagMonitor() {
      var avg,
          interval,
          last,
          points,
          samples,
          _this = this;
      this.progress = 0;
      avg = 0;
      samples = [];
      points = 0;
      last = now();
      interval = setInterval(function () {
        var diff;
        diff = now() - last - 50;
        last = now();
        samples.push(diff);
        if (samples.length > options.eventLag.sampleCount) {
          samples.shift();
        }
        avg = avgAmplitude(samples);
        if (++points >= options.eventLag.minSamples && avg < options.eventLag.lagThreshold) {
          _this.progress = 100;
          return clearInterval(interval);
        } else {
          return _this.progress = 100 * (3 / (avg + 3));
        }
      }, 50);
    }

    return EventLagMonitor;
  }();

  Scaler = function () {
    function Scaler(source) {
      this.source = source;
      this.last = this.sinceLastUpdate = 0;
      this.rate = options.initialRate;
      this.catchup = 0;
      this.progress = this.lastProgress = 0;
      if (this.source != null) {
        this.progress = result(this.source, 'progress');
      }
    }

    Scaler.prototype.tick = function (frameTime, val) {
      var scaling;
      if (val == null) {
        val = result(this.source, 'progress');
      }
      if (val >= 100) {
        this.done = true;
      }
      if (val === this.last) {
        this.sinceLastUpdate += frameTime;
      } else {
        if (this.sinceLastUpdate) {
          this.rate = (val - this.last) / this.sinceLastUpdate;
        }
        this.catchup = (val - this.progress) / options.catchupTime;
        this.sinceLastUpdate = 0;
        this.last = val;
      }
      if (val > this.progress) {
        this.progress += this.catchup * frameTime;
      }
      scaling = 1 - Math.pow(this.progress / 100, options.easeFactor);
      this.progress += scaling * this.rate * frameTime;
      this.progress = Math.min(this.lastProgress + options.maxProgressPerFrame, this.progress);
      this.progress = Math.max(0, this.progress);
      this.progress = Math.min(100, this.progress);
      this.lastProgress = this.progress;
      return this.progress;
    };

    return Scaler;
  }();

  sources = null;

  scalers = null;

  bar = null;

  uniScaler = null;

  animation = null;

  cancelAnimation = null;

  Pace.running = false;

  handlePushState = function handlePushState() {
    if (options.restartOnPushState) {
      return Pace.restart();
    }
  };

  if (window.history.pushState != null) {
    _pushState = window.history.pushState;
    window.history.pushState = function () {
      handlePushState();
      return _pushState.apply(window.history, arguments);
    };
  }

  if (window.history.replaceState != null) {
    _replaceState = window.history.replaceState;
    window.history.replaceState = function () {
      handlePushState();
      return _replaceState.apply(window.history, arguments);
    };
  }

  SOURCE_KEYS = {
    ajax: AjaxMonitor,
    elements: ElementMonitor,
    document: DocumentMonitor,
    eventLag: EventLagMonitor
  };

  (init = function init() {
    var type, _j, _k, _len1, _len2, _ref2, _ref3, _ref4;
    Pace.sources = sources = [];
    _ref2 = ['ajax', 'elements', 'document', 'eventLag'];
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      type = _ref2[_j];
      if (options[type] !== false) {
        sources.push(new SOURCE_KEYS[type](options[type]));
      }
    }
    _ref4 = (_ref3 = options.extraSources) != null ? _ref3 : [];
    for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
      source = _ref4[_k];
      sources.push(new source(options));
    }
    Pace.bar = bar = new Bar();
    scalers = [];
    return uniScaler = new Scaler();
  })();

  Pace.stop = function () {
    Pace.trigger('stop');
    Pace.running = false;
    bar.destroy();
    cancelAnimation = true;
    if (animation != null) {
      if (typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(animation);
      }
      animation = null;
    }
    return init();
  };

  Pace.restart = function () {
    Pace.trigger('restart');
    Pace.stop();
    return Pace.start();
  };

  Pace.go = function () {
    var start;
    Pace.running = true;
    bar.render();
    start = now();
    cancelAnimation = false;
    return animation = runAnimation(function (frameTime, enqueueNextFrame) {
      var avg, count, done, element, elements, i, j, remaining, scaler, scalerList, sum, _j, _k, _len1, _len2, _ref2;
      remaining = 100 - bar.progress;
      count = sum = 0;
      done = true;
      for (i = _j = 0, _len1 = sources.length; _j < _len1; i = ++_j) {
        source = sources[i];
        scalerList = scalers[i] != null ? scalers[i] : scalers[i] = [];
        elements = (_ref2 = source.elements) != null ? _ref2 : [source];
        for (j = _k = 0, _len2 = elements.length; _k < _len2; j = ++_k) {
          element = elements[j];
          scaler = scalerList[j] != null ? scalerList[j] : scalerList[j] = new Scaler(element);
          done &= scaler.done;
          if (scaler.done) {
            continue;
          }
          count++;
          sum += scaler.tick(frameTime);
        }
      }
      avg = sum / count;
      bar.update(uniScaler.tick(frameTime, avg));
      if (bar.done() || done || cancelAnimation) {
        bar.update(100);
        Pace.trigger('done');
        return setTimeout(function () {
          bar.finish();
          Pace.running = false;
          return Pace.trigger('hide');
        }, Math.max(options.ghostTime, Math.max(options.minTime - (now() - start), 0)));
      } else {
        return enqueueNextFrame();
      }
    });
  };

  Pace.start = function (_options) {
    _extend(options, _options);
    Pace.running = true;
    try {
      bar.render();
    } catch (_error) {
      NoTargetError = _error;
    }
    if (!document.querySelector('.pace')) {
      return setTimeout(Pace.start, 50);
    } else {
      Pace.trigger('start');
      return Pace.go();
    }
  };

  if (typeof define === 'function' && define.amd) {
    define(['pace'], function () {
      return Pace;
    });
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    module.exports = Pace;
  } else {
    if (options.startOnPageLoad) {
      Pace.start();
    }
  }
}).call(undefined);
'use strict';

/*
 * Slinky
 * A light-weight, responsive, mobile-like navigation menu plugin for jQuery
 * Built by Ali Zahid <ali.zahid@live.com>
 * Published under the MIT license
 */

;(function ($) {
  var lastClick;

  $.fn.slinky = function (options) {
    var settings = $.extend({
      label: 'Back',
      title: false,
      speed: 300,
      resize: true,
      activeClass: 'active',
      headerClass: 'header',
      headingTag: '<h2>',
      backFirst: false
    }, options);

    var menu = $(this),
        root = menu.children().first();

    menu.addClass('slinky-menu');

    var move = function move(depth, callback) {
      var left = Math.round(parseInt(root.get(0).style.left)) || 0;

      root.css('left', left - depth * 100 + '%');

      if (typeof callback === 'function') {
        setTimeout(callback, settings.speed);
      }
    };

    var resize = function resize(content) {
      menu.height(content.outerHeight());
    };

    var transition = function transition(speed) {
      menu.css('transition-duration', speed + 'ms');
      root.css('transition-duration', speed + 'ms');
    };

    transition(settings.speed);

    $('a + ul', menu).prev().addClass('next');

    $('li > ul', menu).prepend('<li class="' + settings.headerClass + '">');

    if (settings.title === true) {
      $('li > ul', menu).each(function () {
        var $link = $(this).parent().find('a').first(),
            label = $link.text(),
            title = $('<a>').addClass('title').text(label).attr('href', $link.attr('href'));

        $('> .' + settings.headerClass, this).append(title);
      });
    }

    if (!settings.title && settings.label === true) {
      $('li > ul', menu).each(function () {
        var label = $(this).parent().find('a').first().text(),
            backLink = $('<a>').text(label).prop('href', '#').addClass('back');

        if (settings.backFirst) {
          $('> .' + settings.headerClass, this).prepend(backLink);
        } else {
          $('> .' + settings.headerClass, this).append(backLink);
        }
      });
    } else {
      var backLink = $('<a>').text(settings.label).prop('href', '#').addClass('back');

      if (settings.backFirst) {
        $('.' + settings.headerClass, menu).prepend(backLink);
      } else {
        $('.' + settings.headerClass, menu).append(backLink);
      }
    }

    $('a', menu).on('click', function (e) {
      if (lastClick + settings.speed > Date.now()) {
        return false;
      }

      lastClick = Date.now();

      var a = $(this);

      if (a.hasClass('next') || a.hasClass('back')) {
        e.preventDefault();
      }

      if (a.hasClass('next')) {
        menu.find('.' + settings.activeClass).removeClass(settings.activeClass);

        a.next().show().addClass(settings.activeClass);

        move(1);

        if (settings.resize) {
          resize(a.next());
        }
      } else if (a.hasClass('back')) {
        move(-1, function () {
          menu.find('.' + settings.activeClass).removeClass(settings.activeClass);

          a.parent().parent().hide().parentsUntil(menu, 'ul').first().addClass(settings.activeClass);
        });

        if (settings.resize) {
          resize(a.parent().parent().parentsUntil(menu, 'ul'));
        }
      }
    });

    this.jump = function (to, animate) {
      to = $(to);

      var active = menu.find('.' + settings.activeClass);

      if (active.length > 0) {
        active = active.parentsUntil(menu, 'ul').length;
      } else {
        active = 0;
      }

      menu.find('ul').removeClass(settings.activeClass).hide();

      var menus = to.parentsUntil(menu, 'ul');

      menus.show();
      to.show().addClass(settings.activeClass);

      if (animate === false) {
        transition(0);
      }

      move(menus.length - active);

      if (settings.resize) {
        resize(to);
      }

      if (animate === false) {
        transition(settings.speed);
      }
    };

    this.home = function (animate) {
      if (animate === false) {
        transition(0);
      }

      var active = menu.find('.' + settings.activeClass),
          count = active.parentsUntil(menu, 'li').length;

      if (count > 0) {
        move(-count, function () {
          active.removeClass(settings.activeClass);
        });

        if (settings.resize) {
          resize($(active.parentsUntil(menu, 'li').get(count - 1)).parent());
        }
      }

      if (animate === false) {
        transition(settings.speed);
      }
    };

    this.destroy = function () {
      $('.' + settings.headerClass, menu).remove();
      $('a', menu).removeClass('next').off('click');

      menu.removeClass('slinky-menu').css('transition-duration', '');
      root.css('transition-duration', '');
    };

    var active = menu.find('.' + settings.activeClass);

    if (active.length > 0) {
      active.removeClass(settings.activeClass);

      this.jump(active, false);
    }

    return this;
  };
})(jQuery);
'use strict';

jQuery(function ($) {
  'use strict';

  // Flexy header

  flexy_header.init();

  // Sidr
  $('.slinky-menu').find('ul, li, a').removeClass();

  $('.sidr-toggle--right').sidr({
    name: 'sidr-main',
    side: 'right',
    renaming: false,
    body: '.layout__wrapper',
    source: '.sidr-source-provider'
  });

  // Slinky
  $('.sidr .slinky-menu').slinky({
    title: true,
    label: ''
  });

  // Enable / disable Bootstrap tooltips, based upon touch events
  if (Modernizr.touchevents) {
    $('[data-toggle="tooltip"]').tooltip('hide');
  } else {
    $('[data-toggle="tooltip"]').tooltip();
  }

  // Scroll to.
  $('[data-scroll-to]').on('click', function (event) {
    event.preventDefault();

    var $element = $(this);
    var target = $element.attr('data-scroll-to');
    var $target = $(target);

    // Scroll to target.
    $([document.documentElement, document.body]).animate({
      scrollTop: $target.offset().top
    }, 400, function () {

      // Add to URL.
      window.location.hash = target;
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJvb3RzdHJhcC5qcyIsImZsZXh5LWhlYWRlci5qcyIsImZsZXh5LW5hdmlnYXRpb24uanMiLCJqcXVlcnkuc2lkci5qcyIsInBhY2UuanMiLCJjdXN0b20tc2xpbmt5LmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbImpRdWVyeSIsIkVycm9yIiwiJCIsInZlcnNpb24iLCJmbiIsImpxdWVyeSIsInNwbGl0IiwidHJhbnNpdGlvbkVuZCIsImVsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwidHJhbnNFbmRFdmVudE5hbWVzIiwiV2Via2l0VHJhbnNpdGlvbiIsIk1velRyYW5zaXRpb24iLCJPVHJhbnNpdGlvbiIsInRyYW5zaXRpb24iLCJuYW1lIiwic3R5bGUiLCJ1bmRlZmluZWQiLCJlbmQiLCJlbXVsYXRlVHJhbnNpdGlvbkVuZCIsImR1cmF0aW9uIiwiY2FsbGVkIiwiJGVsIiwib25lIiwiY2FsbGJhY2siLCJ0cmlnZ2VyIiwic3VwcG9ydCIsInNldFRpbWVvdXQiLCJldmVudCIsInNwZWNpYWwiLCJic1RyYW5zaXRpb25FbmQiLCJiaW5kVHlwZSIsImRlbGVnYXRlVHlwZSIsImhhbmRsZSIsImUiLCJ0YXJnZXQiLCJpcyIsImhhbmRsZU9iaiIsImhhbmRsZXIiLCJhcHBseSIsImFyZ3VtZW50cyIsImRpc21pc3MiLCJBbGVydCIsIm9uIiwiY2xvc2UiLCJWRVJTSU9OIiwiVFJBTlNJVElPTl9EVVJBVElPTiIsInByb3RvdHlwZSIsIiR0aGlzIiwic2VsZWN0b3IiLCJhdHRyIiwicmVwbGFjZSIsIiRwYXJlbnQiLCJmaW5kIiwicHJldmVudERlZmF1bHQiLCJsZW5ndGgiLCJjbG9zZXN0IiwiRXZlbnQiLCJpc0RlZmF1bHRQcmV2ZW50ZWQiLCJyZW1vdmVDbGFzcyIsInJlbW92ZUVsZW1lbnQiLCJkZXRhY2giLCJyZW1vdmUiLCJoYXNDbGFzcyIsIlBsdWdpbiIsIm9wdGlvbiIsImVhY2giLCJkYXRhIiwiY2FsbCIsIm9sZCIsImFsZXJ0IiwiQ29uc3RydWN0b3IiLCJub0NvbmZsaWN0IiwiQnV0dG9uIiwiZWxlbWVudCIsIm9wdGlvbnMiLCIkZWxlbWVudCIsImV4dGVuZCIsIkRFRkFVTFRTIiwiaXNMb2FkaW5nIiwibG9hZGluZ1RleHQiLCJzZXRTdGF0ZSIsInN0YXRlIiwiZCIsInZhbCIsInJlc2V0VGV4dCIsInByb3h5IiwiYWRkQ2xhc3MiLCJwcm9wIiwicmVtb3ZlQXR0ciIsInRvZ2dsZSIsImNoYW5nZWQiLCIkaW5wdXQiLCJ0b2dnbGVDbGFzcyIsImJ1dHRvbiIsIiRidG4iLCJmaXJzdCIsInRlc3QiLCJ0eXBlIiwiQ2Fyb3VzZWwiLCIkaW5kaWNhdG9ycyIsInBhdXNlZCIsInNsaWRpbmciLCJpbnRlcnZhbCIsIiRhY3RpdmUiLCIkaXRlbXMiLCJrZXlib2FyZCIsImtleWRvd24iLCJwYXVzZSIsImRvY3VtZW50RWxlbWVudCIsImN5Y2xlIiwid3JhcCIsInRhZ05hbWUiLCJ3aGljaCIsInByZXYiLCJuZXh0IiwiY2xlYXJJbnRlcnZhbCIsInNldEludGVydmFsIiwiZ2V0SXRlbUluZGV4IiwiaXRlbSIsInBhcmVudCIsImNoaWxkcmVuIiwiaW5kZXgiLCJnZXRJdGVtRm9yRGlyZWN0aW9uIiwiZGlyZWN0aW9uIiwiYWN0aXZlIiwiYWN0aXZlSW5kZXgiLCJ3aWxsV3JhcCIsImRlbHRhIiwiaXRlbUluZGV4IiwiZXEiLCJ0byIsInBvcyIsInRoYXQiLCJzbGlkZSIsIiRuZXh0IiwiaXNDeWNsaW5nIiwicmVsYXRlZFRhcmdldCIsInNsaWRlRXZlbnQiLCIkbmV4dEluZGljYXRvciIsInNsaWRFdmVudCIsIm9mZnNldFdpZHRoIiwiam9pbiIsImFjdGlvbiIsImNhcm91c2VsIiwiY2xpY2tIYW5kbGVyIiwiaHJlZiIsIiR0YXJnZXQiLCJzbGlkZUluZGV4Iiwid2luZG93IiwiJGNhcm91c2VsIiwiQ29sbGFwc2UiLCIkdHJpZ2dlciIsImlkIiwidHJhbnNpdGlvbmluZyIsImdldFBhcmVudCIsImFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyIsImRpbWVuc2lvbiIsImhhc1dpZHRoIiwic2hvdyIsImFjdGl2ZXNEYXRhIiwiYWN0aXZlcyIsInN0YXJ0RXZlbnQiLCJjb21wbGV0ZSIsInNjcm9sbFNpemUiLCJjYW1lbENhc2UiLCJoaWRlIiwib2Zmc2V0SGVpZ2h0IiwiaSIsImdldFRhcmdldEZyb21UcmlnZ2VyIiwiaXNPcGVuIiwiY29sbGFwc2UiLCJiYWNrZHJvcCIsIkRyb3Bkb3duIiwiY2xlYXJNZW51cyIsImNvbnRhaW5zIiwiaXNBY3RpdmUiLCJpbnNlcnRBZnRlciIsInN0b3BQcm9wYWdhdGlvbiIsImRlc2MiLCJkcm9wZG93biIsIk1vZGFsIiwiJGJvZHkiLCJib2R5IiwiJGRpYWxvZyIsIiRiYWNrZHJvcCIsImlzU2hvd24iLCJvcmlnaW5hbEJvZHlQYWQiLCJzY3JvbGxiYXJXaWR0aCIsImlnbm9yZUJhY2tkcm9wQ2xpY2siLCJmaXhlZENvbnRlbnQiLCJyZW1vdGUiLCJsb2FkIiwiQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTiIsIl9yZWxhdGVkVGFyZ2V0IiwiY2hlY2tTY3JvbGxiYXIiLCJzZXRTY3JvbGxiYXIiLCJlc2NhcGUiLCJyZXNpemUiLCJhcHBlbmRUbyIsInNjcm9sbFRvcCIsImFkanVzdERpYWxvZyIsImVuZm9yY2VGb2N1cyIsIm9mZiIsImhpZGVNb2RhbCIsImhhcyIsImhhbmRsZVVwZGF0ZSIsInJlc2V0QWRqdXN0bWVudHMiLCJyZXNldFNjcm9sbGJhciIsInJlbW92ZUJhY2tkcm9wIiwiYW5pbWF0ZSIsImRvQW5pbWF0ZSIsImN1cnJlbnRUYXJnZXQiLCJmb2N1cyIsImNhbGxiYWNrUmVtb3ZlIiwibW9kYWxJc092ZXJmbG93aW5nIiwic2Nyb2xsSGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwiY3NzIiwicGFkZGluZ0xlZnQiLCJib2R5SXNPdmVyZmxvd2luZyIsInBhZGRpbmdSaWdodCIsImZ1bGxXaW5kb3dXaWR0aCIsImlubmVyV2lkdGgiLCJkb2N1bWVudEVsZW1lbnRSZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwicmlnaHQiLCJNYXRoIiwiYWJzIiwibGVmdCIsImNsaWVudFdpZHRoIiwibWVhc3VyZVNjcm9sbGJhciIsImJvZHlQYWQiLCJwYXJzZUludCIsImFjdHVhbFBhZGRpbmciLCJjYWxjdWxhdGVkUGFkZGluZyIsInBhcnNlRmxvYXQiLCJwYWRkaW5nIiwicmVtb3ZlRGF0YSIsInNjcm9sbERpdiIsImNsYXNzTmFtZSIsImFwcGVuZCIsInJlbW92ZUNoaWxkIiwibW9kYWwiLCJzaG93RXZlbnQiLCJESVNBTExPV0VEX0FUVFJJQlVURVMiLCJ1cmlBdHRycyIsIkFSSUFfQVRUUklCVVRFX1BBVFRFUk4iLCJEZWZhdWx0V2hpdGVsaXN0IiwiYSIsImFyZWEiLCJiIiwiYnIiLCJjb2wiLCJjb2RlIiwiZGl2IiwiZW0iLCJociIsImgxIiwiaDIiLCJoMyIsImg0IiwiaDUiLCJoNiIsImltZyIsImxpIiwib2wiLCJwIiwicHJlIiwicyIsInNtYWxsIiwic3BhbiIsInN1YiIsInN1cCIsInN0cm9uZyIsInUiLCJ1bCIsIlNBRkVfVVJMX1BBVFRFUk4iLCJEQVRBX1VSTF9QQVRURVJOIiwiYWxsb3dlZEF0dHJpYnV0ZSIsImFsbG93ZWRBdHRyaWJ1dGVMaXN0IiwiYXR0ck5hbWUiLCJub2RlTmFtZSIsInRvTG93ZXJDYXNlIiwiaW5BcnJheSIsIkJvb2xlYW4iLCJub2RlVmFsdWUiLCJtYXRjaCIsInJlZ0V4cCIsImZpbHRlciIsInZhbHVlIiwiUmVnRXhwIiwibCIsInNhbml0aXplSHRtbCIsInVuc2FmZUh0bWwiLCJ3aGl0ZUxpc3QiLCJzYW5pdGl6ZUZuIiwiaW1wbGVtZW50YXRpb24iLCJjcmVhdGVIVE1MRG9jdW1lbnQiLCJjcmVhdGVkRG9jdW1lbnQiLCJpbm5lckhUTUwiLCJ3aGl0ZWxpc3RLZXlzIiwibWFwIiwiZWxlbWVudHMiLCJsZW4iLCJlbE5hbWUiLCJwYXJlbnROb2RlIiwiYXR0cmlidXRlTGlzdCIsImF0dHJpYnV0ZXMiLCJ3aGl0ZWxpc3RlZEF0dHJpYnV0ZXMiLCJjb25jYXQiLCJqIiwibGVuMiIsInJlbW92ZUF0dHJpYnV0ZSIsIlRvb2x0aXAiLCJlbmFibGVkIiwidGltZW91dCIsImhvdmVyU3RhdGUiLCJpblN0YXRlIiwiaW5pdCIsImFuaW1hdGlvbiIsInBsYWNlbWVudCIsInRlbXBsYXRlIiwidGl0bGUiLCJkZWxheSIsImh0bWwiLCJjb250YWluZXIiLCJ2aWV3cG9ydCIsInNhbml0aXplIiwiZ2V0T3B0aW9ucyIsIiR2aWV3cG9ydCIsImlzRnVuY3Rpb24iLCJjbGljayIsImhvdmVyIiwiY29uc3RydWN0b3IiLCJ0cmlnZ2VycyIsImV2ZW50SW4iLCJldmVudE91dCIsImVudGVyIiwibGVhdmUiLCJfb3B0aW9ucyIsImZpeFRpdGxlIiwiZ2V0RGVmYXVsdHMiLCJkYXRhQXR0cmlidXRlcyIsImRhdGFBdHRyIiwiaGFzT3duUHJvcGVydHkiLCJnZXREZWxlZ2F0ZU9wdGlvbnMiLCJkZWZhdWx0cyIsImtleSIsIm9iaiIsInNlbGYiLCJ0aXAiLCJjbGVhclRpbWVvdXQiLCJpc0luU3RhdGVUcnVlIiwiaGFzQ29udGVudCIsImluRG9tIiwib3duZXJEb2N1bWVudCIsIiR0aXAiLCJ0aXBJZCIsImdldFVJRCIsInNldENvbnRlbnQiLCJhdXRvVG9rZW4iLCJhdXRvUGxhY2UiLCJ0b3AiLCJkaXNwbGF5IiwiZ2V0UG9zaXRpb24iLCJhY3R1YWxXaWR0aCIsImFjdHVhbEhlaWdodCIsIm9yZ1BsYWNlbWVudCIsInZpZXdwb3J0RGltIiwiYm90dG9tIiwid2lkdGgiLCJjYWxjdWxhdGVkT2Zmc2V0IiwiZ2V0Q2FsY3VsYXRlZE9mZnNldCIsImFwcGx5UGxhY2VtZW50IiwicHJldkhvdmVyU3RhdGUiLCJvZmZzZXQiLCJoZWlnaHQiLCJtYXJnaW5Ub3AiLCJtYXJnaW5MZWZ0IiwiaXNOYU4iLCJzZXRPZmZzZXQiLCJ1c2luZyIsInByb3BzIiwicm91bmQiLCJnZXRWaWV3cG9ydEFkanVzdGVkRGVsdGEiLCJpc1ZlcnRpY2FsIiwiYXJyb3dEZWx0YSIsImFycm93T2Zmc2V0UG9zaXRpb24iLCJyZXBsYWNlQXJyb3ciLCJhcnJvdyIsImdldFRpdGxlIiwidGV4dCIsIiRlIiwiaXNCb2R5IiwiZWxSZWN0IiwiaXNTdmciLCJTVkdFbGVtZW50IiwiZWxPZmZzZXQiLCJzY3JvbGwiLCJvdXRlckRpbXMiLCJ2aWV3cG9ydFBhZGRpbmciLCJ2aWV3cG9ydERpbWVuc2lvbnMiLCJ0b3BFZGdlT2Zmc2V0IiwiYm90dG9tRWRnZU9mZnNldCIsImxlZnRFZGdlT2Zmc2V0IiwicmlnaHRFZGdlT2Zmc2V0IiwibyIsInByZWZpeCIsInJhbmRvbSIsImdldEVsZW1lbnRCeUlkIiwiJGFycm93IiwiZW5hYmxlIiwiZGlzYWJsZSIsInRvZ2dsZUVuYWJsZWQiLCJkZXN0cm95IiwidG9vbHRpcCIsIlBvcG92ZXIiLCJjb250ZW50IiwiZ2V0Q29udGVudCIsInR5cGVDb250ZW50IiwicG9wb3ZlciIsIlNjcm9sbFNweSIsIiRzY3JvbGxFbGVtZW50Iiwib2Zmc2V0cyIsInRhcmdldHMiLCJhY3RpdmVUYXJnZXQiLCJwcm9jZXNzIiwicmVmcmVzaCIsImdldFNjcm9sbEhlaWdodCIsIm1heCIsIm9mZnNldE1ldGhvZCIsIm9mZnNldEJhc2UiLCJpc1dpbmRvdyIsIiRocmVmIiwic29ydCIsInB1c2giLCJtYXhTY3JvbGwiLCJhY3RpdmF0ZSIsImNsZWFyIiwicGFyZW50cyIsInBhcmVudHNVbnRpbCIsInNjcm9sbHNweSIsIiRzcHkiLCJUYWIiLCIkdWwiLCIkcHJldmlvdXMiLCJoaWRlRXZlbnQiLCJ0YWIiLCJBZmZpeCIsImNoZWNrUG9zaXRpb24iLCJjaGVja1Bvc2l0aW9uV2l0aEV2ZW50TG9vcCIsImFmZml4ZWQiLCJ1bnBpbiIsInBpbm5lZE9mZnNldCIsIlJFU0VUIiwiZ2V0U3RhdGUiLCJvZmZzZXRUb3AiLCJvZmZzZXRCb3R0b20iLCJwb3NpdGlvbiIsInRhcmdldEhlaWdodCIsImluaXRpYWxpemluZyIsImNvbGxpZGVyVG9wIiwiY29sbGlkZXJIZWlnaHQiLCJnZXRQaW5uZWRPZmZzZXQiLCJhZmZpeCIsImFmZml4VHlwZSIsImZsZXh5X2hlYWRlciIsInB1YiIsIiRoZWFkZXJfc3RhdGljIiwiJGhlYWRlcl9zdGlja3kiLCJ1cGRhdGVfaW50ZXJ2YWwiLCJ0b2xlcmFuY2UiLCJ1cHdhcmQiLCJkb3dud2FyZCIsIl9nZXRfb2Zmc2V0X2Zyb21fZWxlbWVudHNfYm90dG9tIiwiY2xhc3NlcyIsInBpbm5lZCIsInVucGlubmVkIiwid2FzX3Njcm9sbGVkIiwibGFzdF9kaXN0YW5jZV9mcm9tX3RvcCIsInJlZ2lzdGVyRXZlbnRIYW5kbGVycyIsInJlZ2lzdGVyQm9vdEV2ZW50SGFuZGxlcnMiLCJkb2N1bWVudF93YXNfc2Nyb2xsZWQiLCJlbGVtZW50X2hlaWdodCIsIm91dGVySGVpZ2h0IiwiZWxlbWVudF9vZmZzZXQiLCJjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wIiwiZmxleHlfbmF2aWdhdGlvbiIsImxheW91dF9jbGFzc2VzIiwidXBncmFkZSIsIiRuYXZpZ2F0aW9ucyIsIm5hdmlnYXRpb24iLCIkbmF2aWdhdGlvbiIsIiRtZWdhbWVudXMiLCJkcm9wZG93bl9tZWdhbWVudSIsIiRkcm9wZG93bl9tZWdhbWVudSIsImRyb3Bkb3duX2hhc19tZWdhbWVudSIsImlzX3VwZ3JhZGVkIiwibmF2aWdhdGlvbl9oYXNfbWVnYW1lbnUiLCIkbWVnYW1lbnUiLCJoYXNfb2JmdXNjYXRvciIsIm9iZnVzY2F0b3IiLCJiYWJlbEhlbHBlcnMiLCJjbGFzc0NhbGxDaGVjayIsImluc3RhbmNlIiwiVHlwZUVycm9yIiwiY3JlYXRlQ2xhc3MiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZGVzY3JpcHRvciIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwicHJvdG9Qcm9wcyIsInN0YXRpY1Byb3BzIiwic2lkclN0YXR1cyIsIm1vdmluZyIsIm9wZW5lZCIsImhlbHBlciIsImlzVXJsIiwic3RyIiwicGF0dGVybiIsImFkZFByZWZpeGVzIiwiYWRkUHJlZml4IiwiYXR0cmlidXRlIiwidG9SZXBsYWNlIiwidHJhbnNpdGlvbnMiLCJzdXBwb3J0ZWQiLCJwcm9wZXJ0eSIsInByZWZpeGVzIiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCIkJDIiLCJib2R5QW5pbWF0aW9uQ2xhc3MiLCJvcGVuQWN0aW9uIiwiY2xvc2VBY3Rpb24iLCJ0cmFuc2l0aW9uRW5kRXZlbnQiLCJNZW51Iiwib3BlbkNsYXNzIiwibWVudVdpZHRoIiwib3V0ZXJXaWR0aCIsInNwZWVkIiwic2lkZSIsImRpc3BsYWNlIiwidGltaW5nIiwibWV0aG9kIiwib25PcGVuQ2FsbGJhY2siLCJvbkNsb3NlQ2FsbGJhY2siLCJvbk9wZW5FbmRDYWxsYmFjayIsIm9uQ2xvc2VFbmRDYWxsYmFjayIsImdldEFuaW1hdGlvbiIsInByZXBhcmVCb2R5IiwiJGh0bWwiLCJvcGVuQm9keSIsImJvZHlBbmltYXRpb24iLCJxdWV1ZSIsIm9uQ2xvc2VCb2R5IiwicmVzZXRTdHlsZXMiLCJ1bmJpbmQiLCJjbG9zZUJvZHkiLCJfdGhpcyIsIm1vdmVCb2R5Iiwib25PcGVuTWVudSIsIm9wZW5NZW51IiwiX3RoaXMyIiwiJGl0ZW0iLCJtZW51QW5pbWF0aW9uIiwib25DbG9zZU1lbnUiLCJjbG9zZU1lbnUiLCJfdGhpczMiLCJtb3ZlTWVudSIsIm1vdmUiLCJvcGVuIiwiX3RoaXM0IiwiYWxyZWFkeU9wZW5lZE1lbnUiLCIkJDEiLCJleGVjdXRlIiwic2lkciIsImVycm9yIiwicHVibGljTWV0aG9kcyIsIm1ldGhvZE5hbWUiLCJtZXRob2RzIiwiZ2V0TWV0aG9kIiwiQXJyYXkiLCJzbGljZSIsIiQkMyIsImZpbGxDb250ZW50IiwiJHNpZGVNZW51Iiwic2V0dGluZ3MiLCJzb3VyY2UiLCJuZXdDb250ZW50IiwiZ2V0IiwiaHRtbENvbnRlbnQiLCJzZWxlY3RvcnMiLCJyZW5hbWluZyIsIiRodG1sQ29udGVudCIsImZuU2lkciIsImJpbmQiLCJvbk9wZW4iLCJvbkNsb3NlIiwib25PcGVuRW5kIiwib25DbG9zZUVuZCIsImZsYWciLCJBamF4TW9uaXRvciIsIkJhciIsIkRvY3VtZW50TW9uaXRvciIsIkVsZW1lbnRNb25pdG9yIiwiRWxlbWVudFRyYWNrZXIiLCJFdmVudExhZ01vbml0b3IiLCJFdmVudGVkIiwiRXZlbnRzIiwiTm9UYXJnZXRFcnJvciIsIlBhY2UiLCJSZXF1ZXN0SW50ZXJjZXB0IiwiU09VUkNFX0tFWVMiLCJTY2FsZXIiLCJTb2NrZXRSZXF1ZXN0VHJhY2tlciIsIlhIUlJlcXVlc3RUcmFja2VyIiwiYXZnQW1wbGl0dWRlIiwiYmFyIiwiY2FuY2VsQW5pbWF0aW9uIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJkZWZhdWx0T3B0aW9ucyIsImV4dGVuZE5hdGl2ZSIsImdldEZyb21ET00iLCJnZXRJbnRlcmNlcHQiLCJoYW5kbGVQdXNoU3RhdGUiLCJpZ25vcmVTdGFjayIsIm5vdyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInJlc3VsdCIsInJ1bkFuaW1hdGlvbiIsInNjYWxlcnMiLCJzaG91bGRJZ25vcmVVUkwiLCJzaG91bGRUcmFjayIsInNvdXJjZXMiLCJ1bmlTY2FsZXIiLCJfV2ViU29ja2V0IiwiX1hEb21haW5SZXF1ZXN0IiwiX1hNTEh0dHBSZXF1ZXN0IiwiX2kiLCJfaW50ZXJjZXB0IiwiX2xlbiIsIl9wdXNoU3RhdGUiLCJfcmVmIiwiX3JlZjEiLCJfcmVwbGFjZVN0YXRlIiwiX19zbGljZSIsIl9faGFzUHJvcCIsIl9fZXh0ZW5kcyIsImNoaWxkIiwiY3RvciIsIl9fc3VwZXJfXyIsIl9faW5kZXhPZiIsImluZGV4T2YiLCJjYXRjaHVwVGltZSIsImluaXRpYWxSYXRlIiwibWluVGltZSIsImdob3N0VGltZSIsIm1heFByb2dyZXNzUGVyRnJhbWUiLCJlYXNlRmFjdG9yIiwic3RhcnRPblBhZ2VMb2FkIiwicmVzdGFydE9uUHVzaFN0YXRlIiwicmVzdGFydE9uUmVxdWVzdEFmdGVyIiwiY2hlY2tJbnRlcnZhbCIsImV2ZW50TGFnIiwibWluU2FtcGxlcyIsInNhbXBsZUNvdW50IiwibGFnVGhyZXNob2xkIiwiYWpheCIsInRyYWNrTWV0aG9kcyIsInRyYWNrV2ViU29ja2V0cyIsImlnbm9yZVVSTHMiLCJwZXJmb3JtYW5jZSIsIkRhdGUiLCJtb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJ3ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJtc1JlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lIiwibGFzdCIsInRpY2siLCJkaWZmIiwiYXJncyIsIm91dCIsImFyciIsImNvdW50Iiwic3VtIiwidiIsImpzb24iLCJxdWVyeVNlbGVjdG9yIiwiZ2V0QXR0cmlidXRlIiwiSlNPTiIsInBhcnNlIiwiX2Vycm9yIiwiY29uc29sZSIsImN0eCIsIm9uY2UiLCJfYmFzZSIsImJpbmRpbmdzIiwiX3Jlc3VsdHMiLCJzcGxpY2UiLCJwYWNlT3B0aW9ucyIsIl9zdXBlciIsInByb2dyZXNzIiwiZ2V0RWxlbWVudCIsInRhcmdldEVsZW1lbnQiLCJmaXJzdENoaWxkIiwiaW5zZXJ0QmVmb3JlIiwiYXBwZW5kQ2hpbGQiLCJmaW5pc2giLCJ1cGRhdGUiLCJwcm9nIiwicmVuZGVyIiwicHJvZ3Jlc3NTdHIiLCJ0cmFuc2Zvcm0iLCJfaiIsIl9sZW4xIiwiX3JlZjIiLCJsYXN0UmVuZGVyZWRQcm9ncmVzcyIsInNldEF0dHJpYnV0ZSIsImRvbmUiLCJiaW5kaW5nIiwiWE1MSHR0cFJlcXVlc3QiLCJYRG9tYWluUmVxdWVzdCIsIldlYlNvY2tldCIsImZyb20iLCJpZ25vcmUiLCJyZXQiLCJ1bnNoaWZ0Iiwic2hpZnQiLCJ0cmFjayIsIm1vbml0b3JYSFIiLCJyZXEiLCJfb3BlbiIsInVybCIsImFzeW5jIiwicmVxdWVzdCIsImZsYWdzIiwicHJvdG9jb2xzIiwiX2FyZyIsImFmdGVyIiwicnVubmluZyIsInN0aWxsQWN0aXZlIiwiX3JlZjMiLCJyZWFkeVN0YXRlIiwicmVzdGFydCIsIndhdGNoIiwidHJhY2tlciIsInNpemUiLCJfb25yZWFkeXN0YXRlY2hhbmdlIiwiUHJvZ3Jlc3NFdmVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJldnQiLCJsZW5ndGhDb21wdXRhYmxlIiwibG9hZGVkIiwidG90YWwiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJjaGVjayIsInN0YXRlcyIsImxvYWRpbmciLCJpbnRlcmFjdGl2ZSIsImF2ZyIsInBvaW50cyIsInNhbXBsZXMiLCJzaW5jZUxhc3RVcGRhdGUiLCJyYXRlIiwiY2F0Y2h1cCIsImxhc3RQcm9ncmVzcyIsImZyYW1lVGltZSIsInNjYWxpbmciLCJwb3ciLCJtaW4iLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwicmVwbGFjZVN0YXRlIiwiX2siLCJfbGVuMiIsIl9yZWY0IiwiZXh0cmFTb3VyY2VzIiwic3RvcCIsInN0YXJ0IiwiZ28iLCJlbnF1ZXVlTmV4dEZyYW1lIiwicmVtYWluaW5nIiwic2NhbGVyIiwic2NhbGVyTGlzdCIsImRlZmluZSIsImFtZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJsYXN0Q2xpY2siLCJzbGlua3kiLCJsYWJlbCIsImFjdGl2ZUNsYXNzIiwiaGVhZGVyQ2xhc3MiLCJoZWFkaW5nVGFnIiwiYmFja0ZpcnN0IiwibWVudSIsInJvb3QiLCJkZXB0aCIsInByZXBlbmQiLCIkbGluayIsImJhY2tMaW5rIiwianVtcCIsIm1lbnVzIiwiaG9tZSIsIk1vZGVybml6ciIsInRvdWNoZXZlbnRzIiwibG9jYXRpb24iLCJoYXNoIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7OztBQU1BLElBQUksT0FBT0EsTUFBUCxLQUFrQixXQUF0QixFQUFtQztBQUNqQyxRQUFNLElBQUlDLEtBQUosQ0FBVSx5Q0FBVixDQUFOO0FBQ0Q7O0FBRUQsQ0FBQyxVQUFVQyxDQUFWLEVBQWE7QUFDWjs7QUFDQSxNQUFJQyxVQUFVRCxFQUFFRSxFQUFGLENBQUtDLE1BQUwsQ0FBWUMsS0FBWixDQUFrQixHQUFsQixFQUF1QixDQUF2QixFQUEwQkEsS0FBMUIsQ0FBZ0MsR0FBaEMs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QWdCQyxJQUFoQixHQUF1Qnp3QixNQUF2QjtBQUNELEtBTkQ7QUFPRCxHQWZEO0FBZ0JELENBbEREIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQm9vdHN0cmFwIHYzLjQuMSAoaHR0cHM6Ly9nZXRib290c3RyYXAuY29tLylcbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKi9cblxuaWYgKHR5cGVvZiBqUXVlcnkgPT09ICd1bmRlZmluZWQnKSB7XG4gIHRocm93IG5ldyBFcnJvcignQm9vdHN0cmFwXFwncyBKYXZhU2NyaXB0IHJlcXVpcmVzIGpRdWVyeScpXG59XG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG4gIHZhciB2ZXJzaW9uID0gJC5mbi5qcXVlcnkuc3BsaXQoJyAnKVswXS5zcGxpdCgnLicpXG4gIGlmICgodmVyc2lvblswXSA8IDIgJiYgdmVyc2lvblsxXSA8IDkpIHx8ICh2ZXJzaW9uWzBdID09IDEgJiYgdmVyc2lvblsxXSA9PSA5ICYmIHZlcnNpb25bMl0gPCAxKSB8fCAodmVyc2lvblswXSA+IDMpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdCb290c3RyYXBcXCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgalF1ZXJ5IHZlcnNpb24gMS45LjEgb3IgaGlnaGVyLCBidXQgbG93ZXIgdGhhbiB2ZXJzaW9uIDQnKVxuICB9XG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiB0cmFuc2l0aW9uLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI3RyYW5zaXRpb25zXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQ1NTIFRSQU5TSVRJT04gU1VQUE9SVCAoU2hvdXRvdXQ6IGh0dHBzOi8vbW9kZXJuaXpyLmNvbS8pXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIHRyYW5zaXRpb25FbmQoKSB7XG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYm9vdHN0cmFwJylcblxuICAgIHZhciB0cmFuc0VuZEV2ZW50TmFtZXMgPSB7XG4gICAgICBXZWJraXRUcmFuc2l0aW9uIDogJ3dlYmtpdFRyYW5zaXRpb25FbmQnLFxuICAgICAgTW96VHJhbnNpdGlvbiAgICA6ICd0cmFuc2l0aW9uZW5kJyxcbiAgICAgIE9UcmFuc2l0aW9uICAgICAgOiAnb1RyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQnLFxuICAgICAgdHJhbnNpdGlvbiAgICAgICA6ICd0cmFuc2l0aW9uZW5kJ1xuICAgIH1cblxuICAgIGZvciAodmFyIG5hbWUgaW4gdHJhbnNFbmRFdmVudE5hbWVzKSB7XG4gICAgICBpZiAoZWwuc3R5bGVbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4geyBlbmQ6IHRyYW5zRW5kRXZlbnROYW1lc1tuYW1lXSB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlIC8vIGV4cGxpY2l0IGZvciBpZTggKCAgLl8uKVxuICB9XG5cbiAgLy8gaHR0cHM6Ly9ibG9nLmFsZXhtYWNjYXcuY29tL2Nzcy10cmFuc2l0aW9uc1xuICAkLmZuLmVtdWxhdGVUcmFuc2l0aW9uRW5kID0gZnVuY3Rpb24gKGR1cmF0aW9uKSB7XG4gICAgdmFyIGNhbGxlZCA9IGZhbHNlXG4gICAgdmFyICRlbCA9IHRoaXNcbiAgICAkKHRoaXMpLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24gKCkgeyBjYWxsZWQgPSB0cnVlIH0pXG4gICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBpZiAoIWNhbGxlZCkgJCgkZWwpLnRyaWdnZXIoJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kKSB9XG4gICAgc2V0VGltZW91dChjYWxsYmFjaywgZHVyYXRpb24pXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gICQoZnVuY3Rpb24gKCkge1xuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uID0gdHJhbnNpdGlvbkVuZCgpXG5cbiAgICBpZiAoISQuc3VwcG9ydC50cmFuc2l0aW9uKSByZXR1cm5cblxuICAgICQuZXZlbnQuc3BlY2lhbC5ic1RyYW5zaXRpb25FbmQgPSB7XG4gICAgICBiaW5kVHlwZTogJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLFxuICAgICAgZGVsZWdhdGVUeXBlOiAkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsXG4gICAgICBoYW5kbGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICgkKGUudGFyZ2V0KS5pcyh0aGlzKSkgcmV0dXJuIGUuaGFuZGxlT2JqLmhhbmRsZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgfVxuICAgIH1cbiAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogYWxlcnQuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jYWxlcnRzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQUxFUlQgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIGRpc21pc3MgPSAnW2RhdGEtZGlzbWlzcz1cImFsZXJ0XCJdJ1xuICB2YXIgQWxlcnQgICA9IGZ1bmN0aW9uIChlbCkge1xuICAgICQoZWwpLm9uKCdjbGljaycsIGRpc21pc3MsIHRoaXMuY2xvc2UpXG4gIH1cblxuICBBbGVydC5WRVJTSU9OID0gJzMuNC4xJ1xuXG4gIEFsZXJ0LlRSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcblxuICBBbGVydC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyAgICA9ICQodGhpcylcbiAgICB2YXIgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpXG5cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgICAgc2VsZWN0b3IgPSBzZWxlY3RvciAmJiBzZWxlY3Rvci5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuICAgIH1cblxuICAgIHNlbGVjdG9yICAgID0gc2VsZWN0b3IgPT09ICcjJyA/IFtdIDogc2VsZWN0b3JcbiAgICB2YXIgJHBhcmVudCA9ICQoZG9jdW1lbnQpLmZpbmQoc2VsZWN0b3IpXG5cbiAgICBpZiAoZSkgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBpZiAoISRwYXJlbnQubGVuZ3RoKSB7XG4gICAgICAkcGFyZW50ID0gJHRoaXMuY2xvc2VzdCgnLmFsZXJ0JylcbiAgICB9XG5cbiAgICAkcGFyZW50LnRyaWdnZXIoZSA9ICQuRXZlbnQoJ2Nsb3NlLmJzLmFsZXJ0JykpXG5cbiAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAkcGFyZW50LnJlbW92ZUNsYXNzKCdpbicpXG5cbiAgICBmdW5jdGlvbiByZW1vdmVFbGVtZW50KCkge1xuICAgICAgLy8gZGV0YWNoIGZyb20gcGFyZW50LCBmaXJlIGV2ZW50IHRoZW4gY2xlYW4gdXAgZGF0YVxuICAgICAgJHBhcmVudC5kZXRhY2goKS50cmlnZ2VyKCdjbG9zZWQuYnMuYWxlcnQnKS5yZW1vdmUoKVxuICAgIH1cblxuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmICRwYXJlbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICAkcGFyZW50XG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIHJlbW92ZUVsZW1lbnQpXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChBbGVydC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICByZW1vdmVFbGVtZW50KClcbiAgfVxuXG5cbiAgLy8gQUxFUlQgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgPSAkdGhpcy5kYXRhKCdicy5hbGVydCcpXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuYWxlcnQnLCAoZGF0YSA9IG5ldyBBbGVydCh0aGlzKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dLmNhbGwoJHRoaXMpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmFsZXJ0XG5cbiAgJC5mbi5hbGVydCAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmFsZXJ0LkNvbnN0cnVjdG9yID0gQWxlcnRcblxuXG4gIC8vIEFMRVJUIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5hbGVydC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uYWxlcnQgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBBTEVSVCBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljay5icy5hbGVydC5kYXRhLWFwaScsIGRpc21pc3MsIEFsZXJ0LnByb3RvdHlwZS5jbG9zZSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogYnV0dG9uLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI2J1dHRvbnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBCVVRUT04gUFVCTElDIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIEJ1dHRvbiA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCAgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy5vcHRpb25zICAgPSAkLmV4dGVuZCh7fSwgQnV0dG9uLkRFRkFVTFRTLCBvcHRpb25zKVxuICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcbiAgfVxuXG4gIEJ1dHRvbi5WRVJTSU9OICA9ICczLjQuMSdcblxuICBCdXR0b24uREVGQVVMVFMgPSB7XG4gICAgbG9hZGluZ1RleHQ6ICdsb2FkaW5nLi4uJ1xuICB9XG5cbiAgQnV0dG9uLnByb3RvdHlwZS5zZXRTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBkICAgID0gJ2Rpc2FibGVkJ1xuICAgIHZhciAkZWwgID0gdGhpcy4kZWxlbWVudFxuICAgIHZhciB2YWwgID0gJGVsLmlzKCdpbnB1dCcpID8gJ3ZhbCcgOiAnaHRtbCdcbiAgICB2YXIgZGF0YSA9ICRlbC5kYXRhKClcblxuICAgIHN0YXRlICs9ICdUZXh0J1xuXG4gICAgaWYgKGRhdGEucmVzZXRUZXh0ID09IG51bGwpICRlbC5kYXRhKCdyZXNldFRleHQnLCAkZWxbdmFsXSgpKVxuXG4gICAgLy8gcHVzaCB0byBldmVudCBsb29wIHRvIGFsbG93IGZvcm1zIHRvIHN1Ym1pdFxuICAgIHNldFRpbWVvdXQoJC5wcm94eShmdW5jdGlvbiAoKSB7XG4gICAgICAkZWxbdmFsXShkYXRhW3N0YXRlXSA9PSBudWxsID8gdGhpcy5vcHRpb25zW3N0YXRlXSA6IGRhdGFbc3RhdGVdKVxuXG4gICAgICBpZiAoc3RhdGUgPT0gJ2xvYWRpbmdUZXh0Jykge1xuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWVcbiAgICAgICAgJGVsLmFkZENsYXNzKGQpLmF0dHIoZCwgZCkucHJvcChkLCB0cnVlKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzTG9hZGluZykge1xuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlXG4gICAgICAgICRlbC5yZW1vdmVDbGFzcyhkKS5yZW1vdmVBdHRyKGQpLnByb3AoZCwgZmFsc2UpXG4gICAgICB9XG4gICAgfSwgdGhpcyksIDApXG4gIH1cblxuICBCdXR0b24ucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2hhbmdlZCA9IHRydWVcbiAgICB2YXIgJHBhcmVudCA9IHRoaXMuJGVsZW1lbnQuY2xvc2VzdCgnW2RhdGEtdG9nZ2xlPVwiYnV0dG9uc1wiXScpXG5cbiAgICBpZiAoJHBhcmVudC5sZW5ndGgpIHtcbiAgICAgIHZhciAkaW5wdXQgPSB0aGlzLiRlbGVtZW50LmZpbmQoJ2lucHV0JylcbiAgICAgIGlmICgkaW5wdXQucHJvcCgndHlwZScpID09ICdyYWRpbycpIHtcbiAgICAgICAgaWYgKCRpbnB1dC5wcm9wKCdjaGVja2VkJykpIGNoYW5nZWQgPSBmYWxzZVxuICAgICAgICAkcGFyZW50LmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgIH0gZWxzZSBpZiAoJGlucHV0LnByb3AoJ3R5cGUnKSA9PSAnY2hlY2tib3gnKSB7XG4gICAgICAgIGlmICgoJGlucHV0LnByb3AoJ2NoZWNrZWQnKSkgIT09IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2FjdGl2ZScpKSBjaGFuZ2VkID0gZmFsc2VcbiAgICAgICAgdGhpcy4kZWxlbWVudC50b2dnbGVDbGFzcygnYWN0aXZlJylcbiAgICAgIH1cbiAgICAgICRpbnB1dC5wcm9wKCdjaGVja2VkJywgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnYWN0aXZlJykpXG4gICAgICBpZiAoY2hhbmdlZCkgJGlucHV0LnRyaWdnZXIoJ2NoYW5nZScpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQuYXR0cignYXJpYS1wcmVzc2VkJywgIXRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2FjdGl2ZScpKVxuICAgICAgdGhpcy4kZWxlbWVudC50b2dnbGVDbGFzcygnYWN0aXZlJylcbiAgICB9XG4gIH1cblxuXG4gIC8vIEJVVFRPTiBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuYnV0dG9uJylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5idXR0b24nLCAoZGF0YSA9IG5ldyBCdXR0b24odGhpcywgb3B0aW9ucykpKVxuXG4gICAgICBpZiAob3B0aW9uID09ICd0b2dnbGUnKSBkYXRhLnRvZ2dsZSgpXG4gICAgICBlbHNlIGlmIChvcHRpb24pIGRhdGEuc2V0U3RhdGUob3B0aW9uKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5idXR0b25cblxuICAkLmZuLmJ1dHRvbiAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmJ1dHRvbi5Db25zdHJ1Y3RvciA9IEJ1dHRvblxuXG5cbiAgLy8gQlVUVE9OIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uYnV0dG9uLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5idXR0b24gPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBCVVRUT04gREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudClcbiAgICAub24oJ2NsaWNrLmJzLmJ1dHRvbi5kYXRhLWFwaScsICdbZGF0YS10b2dnbGVePVwiYnV0dG9uXCJdJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciAkYnRuID0gJChlLnRhcmdldCkuY2xvc2VzdCgnLmJ0bicpXG4gICAgICBQbHVnaW4uY2FsbCgkYnRuLCAndG9nZ2xlJylcbiAgICAgIGlmICghKCQoZS50YXJnZXQpLmlzKCdpbnB1dFt0eXBlPVwicmFkaW9cIl0sIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXScpKSkge1xuICAgICAgICAvLyBQcmV2ZW50IGRvdWJsZSBjbGljayBvbiByYWRpb3MsIGFuZCB0aGUgZG91YmxlIHNlbGVjdGlvbnMgKHNvIGNhbmNlbGxhdGlvbikgb24gY2hlY2tib3hlc1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgLy8gVGhlIHRhcmdldCBjb21wb25lbnQgc3RpbGwgcmVjZWl2ZSB0aGUgZm9jdXNcbiAgICAgICAgaWYgKCRidG4uaXMoJ2lucHV0LGJ1dHRvbicpKSAkYnRuLnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgICAgZWxzZSAkYnRuLmZpbmQoJ2lucHV0OnZpc2libGUsYnV0dG9uOnZpc2libGUnKS5maXJzdCgpLnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgIH1cbiAgICB9KVxuICAgIC5vbignZm9jdXMuYnMuYnV0dG9uLmRhdGEtYXBpIGJsdXIuYnMuYnV0dG9uLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZV49XCJidXR0b25cIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgJChlLnRhcmdldCkuY2xvc2VzdCgnLmJ0bicpLnRvZ2dsZUNsYXNzKCdmb2N1cycsIC9eZm9jdXMoaW4pPyQvLnRlc3QoZS50eXBlKSlcbiAgICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBjYXJvdXNlbC5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNjYXJvdXNlbFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIENBUk9VU0VMIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBDYXJvdXNlbCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCAgICA9ICQoZWxlbWVudClcbiAgICB0aGlzLiRpbmRpY2F0b3JzID0gdGhpcy4kZWxlbWVudC5maW5kKCcuY2Fyb3VzZWwtaW5kaWNhdG9ycycpXG4gICAgdGhpcy5vcHRpb25zICAgICA9IG9wdGlvbnNcbiAgICB0aGlzLnBhdXNlZCAgICAgID0gbnVsbFxuICAgIHRoaXMuc2xpZGluZyAgICAgPSBudWxsXG4gICAgdGhpcy5pbnRlcnZhbCAgICA9IG51bGxcbiAgICB0aGlzLiRhY3RpdmUgICAgID0gbnVsbFxuICAgIHRoaXMuJGl0ZW1zICAgICAgPSBudWxsXG5cbiAgICB0aGlzLm9wdGlvbnMua2V5Ym9hcmQgJiYgdGhpcy4kZWxlbWVudC5vbigna2V5ZG93bi5icy5jYXJvdXNlbCcsICQucHJveHkodGhpcy5rZXlkb3duLCB0aGlzKSlcblxuICAgIHRoaXMub3B0aW9ucy5wYXVzZSA9PSAnaG92ZXInICYmICEoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSAmJiB0aGlzLiRlbGVtZW50XG4gICAgICAub24oJ21vdXNlZW50ZXIuYnMuY2Fyb3VzZWwnLCAkLnByb3h5KHRoaXMucGF1c2UsIHRoaXMpKVxuICAgICAgLm9uKCdtb3VzZWxlYXZlLmJzLmNhcm91c2VsJywgJC5wcm94eSh0aGlzLmN5Y2xlLCB0aGlzKSlcbiAgfVxuXG4gIENhcm91c2VsLlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIENhcm91c2VsLlRSQU5TSVRJT05fRFVSQVRJT04gPSA2MDBcblxuICBDYXJvdXNlbC5ERUZBVUxUUyA9IHtcbiAgICBpbnRlcnZhbDogNTAwMCxcbiAgICBwYXVzZTogJ2hvdmVyJyxcbiAgICB3cmFwOiB0cnVlLFxuICAgIGtleWJvYXJkOiB0cnVlXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUua2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZS50YXJnZXQudGFnTmFtZSkpIHJldHVyblxuICAgIHN3aXRjaCAoZS53aGljaCkge1xuICAgICAgY2FzZSAzNzogdGhpcy5wcmV2KCk7IGJyZWFrXG4gICAgICBjYXNlIDM5OiB0aGlzLm5leHQoKTsgYnJlYWtcbiAgICAgIGRlZmF1bHQ6IHJldHVyblxuICAgIH1cblxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLmN5Y2xlID0gZnVuY3Rpb24gKGUpIHtcbiAgICBlIHx8ICh0aGlzLnBhdXNlZCA9IGZhbHNlKVxuXG4gICAgdGhpcy5pbnRlcnZhbCAmJiBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpXG5cbiAgICB0aGlzLm9wdGlvbnMuaW50ZXJ2YWxcbiAgICAgICYmICF0aGlzLnBhdXNlZFxuICAgICAgJiYgKHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgkLnByb3h5KHRoaXMubmV4dCwgdGhpcyksIHRoaXMub3B0aW9ucy5pbnRlcnZhbCkpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLmdldEl0ZW1JbmRleCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgdGhpcy4kaXRlbXMgPSBpdGVtLnBhcmVudCgpLmNoaWxkcmVuKCcuaXRlbScpXG4gICAgcmV0dXJuIHRoaXMuJGl0ZW1zLmluZGV4KGl0ZW0gfHwgdGhpcy4kYWN0aXZlKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLmdldEl0ZW1Gb3JEaXJlY3Rpb24gPSBmdW5jdGlvbiAoZGlyZWN0aW9uLCBhY3RpdmUpIHtcbiAgICB2YXIgYWN0aXZlSW5kZXggPSB0aGlzLmdldEl0ZW1JbmRleChhY3RpdmUpXG4gICAgdmFyIHdpbGxXcmFwID0gKGRpcmVjdGlvbiA9PSAncHJldicgJiYgYWN0aXZlSW5kZXggPT09IDApXG4gICAgICAgICAgICAgICAgfHwgKGRpcmVjdGlvbiA9PSAnbmV4dCcgJiYgYWN0aXZlSW5kZXggPT0gKHRoaXMuJGl0ZW1zLmxlbmd0aCAtIDEpKVxuICAgIGlmICh3aWxsV3JhcCAmJiAhdGhpcy5vcHRpb25zLndyYXApIHJldHVybiBhY3RpdmVcbiAgICB2YXIgZGVsdGEgPSBkaXJlY3Rpb24gPT0gJ3ByZXYnID8gLTEgOiAxXG4gICAgdmFyIGl0ZW1JbmRleCA9IChhY3RpdmVJbmRleCArIGRlbHRhKSAlIHRoaXMuJGl0ZW1zLmxlbmd0aFxuICAgIHJldHVybiB0aGlzLiRpdGVtcy5lcShpdGVtSW5kZXgpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUudG8gPSBmdW5jdGlvbiAocG9zKSB7XG4gICAgdmFyIHRoYXQgICAgICAgID0gdGhpc1xuICAgIHZhciBhY3RpdmVJbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KHRoaXMuJGFjdGl2ZSA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLml0ZW0uYWN0aXZlJykpXG5cbiAgICBpZiAocG9zID4gKHRoaXMuJGl0ZW1zLmxlbmd0aCAtIDEpIHx8IHBvcyA8IDApIHJldHVyblxuXG4gICAgaWYgKHRoaXMuc2xpZGluZykgICAgICAgcmV0dXJuIHRoaXMuJGVsZW1lbnQub25lKCdzbGlkLmJzLmNhcm91c2VsJywgZnVuY3Rpb24gKCkgeyB0aGF0LnRvKHBvcykgfSkgLy8geWVzLCBcInNsaWRcIlxuICAgIGlmIChhY3RpdmVJbmRleCA9PSBwb3MpIHJldHVybiB0aGlzLnBhdXNlKCkuY3ljbGUoKVxuXG4gICAgcmV0dXJuIHRoaXMuc2xpZGUocG9zID4gYWN0aXZlSW5kZXggPyAnbmV4dCcgOiAncHJldicsIHRoaXMuJGl0ZW1zLmVxKHBvcykpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbiAoZSkge1xuICAgIGUgfHwgKHRoaXMucGF1c2VkID0gdHJ1ZSlcblxuICAgIGlmICh0aGlzLiRlbGVtZW50LmZpbmQoJy5uZXh0LCAucHJldicpLmxlbmd0aCAmJiAkLnN1cHBvcnQudHJhbnNpdGlvbikge1xuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZClcbiAgICAgIHRoaXMuY3ljbGUodHJ1ZSlcbiAgICB9XG5cbiAgICB0aGlzLmludGVydmFsID0gY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnNsaWRpbmcpIHJldHVyblxuICAgIHJldHVybiB0aGlzLnNsaWRlKCduZXh0JylcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5wcmV2ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnNsaWRpbmcpIHJldHVyblxuICAgIHJldHVybiB0aGlzLnNsaWRlKCdwcmV2JylcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5zbGlkZSA9IGZ1bmN0aW9uICh0eXBlLCBuZXh0KSB7XG4gICAgdmFyICRhY3RpdmUgICA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLml0ZW0uYWN0aXZlJylcbiAgICB2YXIgJG5leHQgICAgID0gbmV4dCB8fCB0aGlzLmdldEl0ZW1Gb3JEaXJlY3Rpb24odHlwZSwgJGFjdGl2ZSlcbiAgICB2YXIgaXNDeWNsaW5nID0gdGhpcy5pbnRlcnZhbFxuICAgIHZhciBkaXJlY3Rpb24gPSB0eXBlID09ICduZXh0JyA/ICdsZWZ0JyA6ICdyaWdodCdcbiAgICB2YXIgdGhhdCAgICAgID0gdGhpc1xuXG4gICAgaWYgKCRuZXh0Lmhhc0NsYXNzKCdhY3RpdmUnKSkgcmV0dXJuICh0aGlzLnNsaWRpbmcgPSBmYWxzZSlcblxuICAgIHZhciByZWxhdGVkVGFyZ2V0ID0gJG5leHRbMF1cbiAgICB2YXIgc2xpZGVFdmVudCA9ICQuRXZlbnQoJ3NsaWRlLmJzLmNhcm91c2VsJywge1xuICAgICAgcmVsYXRlZFRhcmdldDogcmVsYXRlZFRhcmdldCxcbiAgICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uXG4gICAgfSlcbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoc2xpZGVFdmVudClcbiAgICBpZiAoc2xpZGVFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICB0aGlzLnNsaWRpbmcgPSB0cnVlXG5cbiAgICBpc0N5Y2xpbmcgJiYgdGhpcy5wYXVzZSgpXG5cbiAgICBpZiAodGhpcy4kaW5kaWNhdG9ycy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuJGluZGljYXRvcnMuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgdmFyICRuZXh0SW5kaWNhdG9yID0gJCh0aGlzLiRpbmRpY2F0b3JzLmNoaWxkcmVuKClbdGhpcy5nZXRJdGVtSW5kZXgoJG5leHQpXSlcbiAgICAgICRuZXh0SW5kaWNhdG9yICYmICRuZXh0SW5kaWNhdG9yLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgIH1cblxuICAgIHZhciBzbGlkRXZlbnQgPSAkLkV2ZW50KCdzbGlkLmJzLmNhcm91c2VsJywgeyByZWxhdGVkVGFyZ2V0OiByZWxhdGVkVGFyZ2V0LCBkaXJlY3Rpb246IGRpcmVjdGlvbiB9KSAvLyB5ZXMsIFwic2xpZFwiXG4gICAgaWYgKCQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ3NsaWRlJykpIHtcbiAgICAgICRuZXh0LmFkZENsYXNzKHR5cGUpXG4gICAgICBpZiAodHlwZW9mICRuZXh0ID09PSAnb2JqZWN0JyAmJiAkbmV4dC5sZW5ndGgpIHtcbiAgICAgICAgJG5leHRbMF0ub2Zmc2V0V2lkdGggLy8gZm9yY2UgcmVmbG93XG4gICAgICB9XG4gICAgICAkYWN0aXZlLmFkZENsYXNzKGRpcmVjdGlvbilcbiAgICAgICRuZXh0LmFkZENsYXNzKGRpcmVjdGlvbilcbiAgICAgICRhY3RpdmVcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICRuZXh0LnJlbW92ZUNsYXNzKFt0eXBlLCBkaXJlY3Rpb25dLmpvaW4oJyAnKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICAgJGFjdGl2ZS5yZW1vdmVDbGFzcyhbJ2FjdGl2ZScsIGRpcmVjdGlvbl0uam9pbignICcpKVxuICAgICAgICAgIHRoYXQuc2xpZGluZyA9IGZhbHNlXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoc2xpZEV2ZW50KVxuICAgICAgICAgIH0sIDApXG4gICAgICAgIH0pXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChDYXJvdXNlbC5UUkFOU0lUSU9OX0RVUkFUSU9OKVxuICAgIH0gZWxzZSB7XG4gICAgICAkYWN0aXZlLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgJG5leHQuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICB0aGlzLnNsaWRpbmcgPSBmYWxzZVxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKHNsaWRFdmVudClcbiAgICB9XG5cbiAgICBpc0N5Y2xpbmcgJiYgdGhpcy5jeWNsZSgpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBDQVJPVVNFTCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5jYXJvdXNlbCcpXG4gICAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBDYXJvdXNlbC5ERUZBVUxUUywgJHRoaXMuZGF0YSgpLCB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvbilcbiAgICAgIHZhciBhY3Rpb24gID0gdHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJyA/IG9wdGlvbiA6IG9wdGlvbnMuc2xpZGVcblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5jYXJvdXNlbCcsIChkYXRhID0gbmV3IENhcm91c2VsKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdudW1iZXInKSBkYXRhLnRvKG9wdGlvbilcbiAgICAgIGVsc2UgaWYgKGFjdGlvbikgZGF0YVthY3Rpb25dKClcbiAgICAgIGVsc2UgaWYgKG9wdGlvbnMuaW50ZXJ2YWwpIGRhdGEucGF1c2UoKS5jeWNsZSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmNhcm91c2VsXG5cbiAgJC5mbi5jYXJvdXNlbCAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmNhcm91c2VsLkNvbnN0cnVjdG9yID0gQ2Fyb3VzZWxcblxuXG4gIC8vIENBUk9VU0VMIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5jYXJvdXNlbC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uY2Fyb3VzZWwgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBDQVJPVVNFTCBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PT09PVxuXG4gIHZhciBjbGlja0hhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgIHZhciBocmVmICAgID0gJHRoaXMuYXR0cignaHJlZicpXG4gICAgaWYgKGhyZWYpIHtcbiAgICAgIGhyZWYgPSBocmVmLnJlcGxhY2UoLy4qKD89I1teXFxzXSskKS8sICcnKSAvLyBzdHJpcCBmb3IgaWU3XG4gICAgfVxuXG4gICAgdmFyIHRhcmdldCAgPSAkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpIHx8IGhyZWZcbiAgICB2YXIgJHRhcmdldCA9ICQoZG9jdW1lbnQpLmZpbmQodGFyZ2V0KVxuXG4gICAgaWYgKCEkdGFyZ2V0Lmhhc0NsYXNzKCdjYXJvdXNlbCcpKSByZXR1cm5cblxuICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sICR0YXJnZXQuZGF0YSgpLCAkdGhpcy5kYXRhKCkpXG4gICAgdmFyIHNsaWRlSW5kZXggPSAkdGhpcy5hdHRyKCdkYXRhLXNsaWRlLXRvJylcbiAgICBpZiAoc2xpZGVJbmRleCkgb3B0aW9ucy5pbnRlcnZhbCA9IGZhbHNlXG5cbiAgICBQbHVnaW4uY2FsbCgkdGFyZ2V0LCBvcHRpb25zKVxuXG4gICAgaWYgKHNsaWRlSW5kZXgpIHtcbiAgICAgICR0YXJnZXQuZGF0YSgnYnMuY2Fyb3VzZWwnKS50byhzbGlkZUluZGV4KVxuICAgIH1cblxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICB9XG5cbiAgJChkb2N1bWVudClcbiAgICAub24oJ2NsaWNrLmJzLmNhcm91c2VsLmRhdGEtYXBpJywgJ1tkYXRhLXNsaWRlXScsIGNsaWNrSGFuZGxlcilcbiAgICAub24oJ2NsaWNrLmJzLmNhcm91c2VsLmRhdGEtYXBpJywgJ1tkYXRhLXNsaWRlLXRvXScsIGNsaWNrSGFuZGxlcilcblxuICAkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnW2RhdGEtcmlkZT1cImNhcm91c2VsXCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJGNhcm91c2VsID0gJCh0aGlzKVxuICAgICAgUGx1Z2luLmNhbGwoJGNhcm91c2VsLCAkY2Fyb3VzZWwuZGF0YSgpKVxuICAgIH0pXG4gIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGNvbGxhcHNlLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI2NvbGxhcHNlXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKiBqc2hpbnQgbGF0ZWRlZjogZmFsc2UgKi9cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBDT0xMQVBTRSBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBDb2xsYXBzZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCAgICAgID0gJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyAgICAgICA9ICQuZXh0ZW5kKHt9LCBDb2xsYXBzZS5ERUZBVUxUUywgb3B0aW9ucylcbiAgICB0aGlzLiR0cmlnZ2VyICAgICAgPSAkKCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtocmVmPVwiIycgKyBlbGVtZW50LmlkICsgJ1wiXSwnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtkYXRhLXRhcmdldD1cIiMnICsgZWxlbWVudC5pZCArICdcIl0nKVxuICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IG51bGxcblxuICAgIGlmICh0aGlzLm9wdGlvbnMucGFyZW50KSB7XG4gICAgICB0aGlzLiRwYXJlbnQgPSB0aGlzLmdldFBhcmVudCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKHRoaXMuJGVsZW1lbnQsIHRoaXMuJHRyaWdnZXIpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy50b2dnbGUpIHRoaXMudG9nZ2xlKClcbiAgfVxuXG4gIENvbGxhcHNlLlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIENvbGxhcHNlLlRSQU5TSVRJT05fRFVSQVRJT04gPSAzNTBcblxuICBDb2xsYXBzZS5ERUZBVUxUUyA9IHtcbiAgICB0b2dnbGU6IHRydWVcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS5kaW1lbnNpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGhhc1dpZHRoID0gdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnd2lkdGgnKVxuICAgIHJldHVybiBoYXNXaWR0aCA/ICd3aWR0aCcgOiAnaGVpZ2h0J1xuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMudHJhbnNpdGlvbmluZyB8fCB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdpbicpKSByZXR1cm5cblxuICAgIHZhciBhY3RpdmVzRGF0YVxuICAgIHZhciBhY3RpdmVzID0gdGhpcy4kcGFyZW50ICYmIHRoaXMuJHBhcmVudC5jaGlsZHJlbignLnBhbmVsJykuY2hpbGRyZW4oJy5pbiwgLmNvbGxhcHNpbmcnKVxuXG4gICAgaWYgKGFjdGl2ZXMgJiYgYWN0aXZlcy5sZW5ndGgpIHtcbiAgICAgIGFjdGl2ZXNEYXRhID0gYWN0aXZlcy5kYXRhKCdicy5jb2xsYXBzZScpXG4gICAgICBpZiAoYWN0aXZlc0RhdGEgJiYgYWN0aXZlc0RhdGEudHJhbnNpdGlvbmluZykgcmV0dXJuXG4gICAgfVxuXG4gICAgdmFyIHN0YXJ0RXZlbnQgPSAkLkV2ZW50KCdzaG93LmJzLmNvbGxhcHNlJylcbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoc3RhcnRFdmVudClcbiAgICBpZiAoc3RhcnRFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICBpZiAoYWN0aXZlcyAmJiBhY3RpdmVzLmxlbmd0aCkge1xuICAgICAgUGx1Z2luLmNhbGwoYWN0aXZlcywgJ2hpZGUnKVxuICAgICAgYWN0aXZlc0RhdGEgfHwgYWN0aXZlcy5kYXRhKCdicy5jb2xsYXBzZScsIG51bGwpXG4gICAgfVxuXG4gICAgdmFyIGRpbWVuc2lvbiA9IHRoaXMuZGltZW5zaW9uKClcblxuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2UnKVxuICAgICAgLmFkZENsYXNzKCdjb2xsYXBzaW5nJylbZGltZW5zaW9uXSgwKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuXG4gICAgdGhpcy4kdHJpZ2dlclxuICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuXG4gICAgdGhpcy50cmFuc2l0aW9uaW5nID0gMVxuXG4gICAgdmFyIGNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNpbmcnKVxuICAgICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNlIGluJylbZGltZW5zaW9uXSgnJylcbiAgICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDBcbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLnRyaWdnZXIoJ3Nob3duLmJzLmNvbGxhcHNlJylcbiAgICB9XG5cbiAgICBpZiAoISQuc3VwcG9ydC50cmFuc2l0aW9uKSByZXR1cm4gY29tcGxldGUuY2FsbCh0aGlzKVxuXG4gICAgdmFyIHNjcm9sbFNpemUgPSAkLmNhbWVsQ2FzZShbJ3Njcm9sbCcsIGRpbWVuc2lvbl0uam9pbignLScpKVxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgJC5wcm94eShjb21wbGV0ZSwgdGhpcykpXG4gICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoQ29sbGFwc2UuVFJBTlNJVElPTl9EVVJBVElPTilbZGltZW5zaW9uXSh0aGlzLiRlbGVtZW50WzBdW3Njcm9sbFNpemVdKVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMudHJhbnNpdGlvbmluZyB8fCAhdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnaW4nKSkgcmV0dXJuXG5cbiAgICB2YXIgc3RhcnRFdmVudCA9ICQuRXZlbnQoJ2hpZGUuYnMuY29sbGFwc2UnKVxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihzdGFydEV2ZW50KVxuICAgIGlmIChzdGFydEV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHZhciBkaW1lbnNpb24gPSB0aGlzLmRpbWVuc2lvbigpXG5cbiAgICB0aGlzLiRlbGVtZW50W2RpbWVuc2lvbl0odGhpcy4kZWxlbWVudFtkaW1lbnNpb25dKCkpWzBdLm9mZnNldEhlaWdodFxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLmFkZENsYXNzKCdjb2xsYXBzaW5nJylcbiAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2UgaW4nKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSlcblxuICAgIHRoaXMuJHRyaWdnZXJcbiAgICAgIC5hZGRDbGFzcygnY29sbGFwc2VkJylcbiAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpXG5cbiAgICB0aGlzLnRyYW5zaXRpb25pbmcgPSAxXG5cbiAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnRyYW5zaXRpb25pbmcgPSAwXG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2luZycpXG4gICAgICAgIC5hZGRDbGFzcygnY29sbGFwc2UnKVxuICAgICAgICAudHJpZ2dlcignaGlkZGVuLmJzLmNvbGxhcHNlJylcbiAgICB9XG5cbiAgICBpZiAoISQuc3VwcG9ydC50cmFuc2l0aW9uKSByZXR1cm4gY29tcGxldGUuY2FsbCh0aGlzKVxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgW2RpbWVuc2lvbl0oMClcbiAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsICQucHJveHkoY29tcGxldGUsIHRoaXMpKVxuICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKENvbGxhcHNlLlRSQU5TSVRJT05fRFVSQVRJT04pXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXNbdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnaW4nKSA/ICdoaWRlJyA6ICdzaG93J10oKVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLmdldFBhcmVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJChkb2N1bWVudCkuZmluZCh0aGlzLm9wdGlvbnMucGFyZW50KVxuICAgICAgLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2RhdGEtcGFyZW50PVwiJyArIHRoaXMub3B0aW9ucy5wYXJlbnQgKyAnXCJdJylcbiAgICAgIC5lYWNoKCQucHJveHkoZnVuY3Rpb24gKGksIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyICRlbGVtZW50ID0gJChlbGVtZW50KVxuICAgICAgICB0aGlzLmFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyhnZXRUYXJnZXRGcm9tVHJpZ2dlcigkZWxlbWVudCksICRlbGVtZW50KVxuICAgICAgfSwgdGhpcykpXG4gICAgICAuZW5kKClcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS5hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MgPSBmdW5jdGlvbiAoJGVsZW1lbnQsICR0cmlnZ2VyKSB7XG4gICAgdmFyIGlzT3BlbiA9ICRlbGVtZW50Lmhhc0NsYXNzKCdpbicpXG5cbiAgICAkZWxlbWVudC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgaXNPcGVuKVxuICAgICR0cmlnZ2VyXG4gICAgICAudG9nZ2xlQ2xhc3MoJ2NvbGxhcHNlZCcsICFpc09wZW4pXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGlzT3BlbilcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRhcmdldEZyb21UcmlnZ2VyKCR0cmlnZ2VyKSB7XG4gICAgdmFyIGhyZWZcbiAgICB2YXIgdGFyZ2V0ID0gJHRyaWdnZXIuYXR0cignZGF0YS10YXJnZXQnKVxuICAgICAgfHwgKGhyZWYgPSAkdHJpZ2dlci5hdHRyKCdocmVmJykpICYmIGhyZWYucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcblxuICAgIHJldHVybiAkKGRvY3VtZW50KS5maW5kKHRhcmdldClcbiAgfVxuXG5cbiAgLy8gQ09MTEFQU0UgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuY29sbGFwc2UnKVxuICAgICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgQ29sbGFwc2UuREVGQVVMVFMsICR0aGlzLmRhdGEoKSwgdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb24pXG5cbiAgICAgIGlmICghZGF0YSAmJiBvcHRpb25zLnRvZ2dsZSAmJiAvc2hvd3xoaWRlLy50ZXN0KG9wdGlvbikpIG9wdGlvbnMudG9nZ2xlID0gZmFsc2VcbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuY29sbGFwc2UnLCAoZGF0YSA9IG5ldyBDb2xsYXBzZSh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uY29sbGFwc2VcblxuICAkLmZuLmNvbGxhcHNlICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uY29sbGFwc2UuQ29uc3RydWN0b3IgPSBDb2xsYXBzZVxuXG5cbiAgLy8gQ09MTEFQU0UgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmNvbGxhcHNlLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5jb2xsYXBzZSA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIENPTExBUFNFIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrLmJzLmNvbGxhcHNlLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdJywgZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcblxuICAgIGlmICghJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKSkgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICB2YXIgJHRhcmdldCA9IGdldFRhcmdldEZyb21UcmlnZ2VyKCR0aGlzKVxuICAgIHZhciBkYXRhICAgID0gJHRhcmdldC5kYXRhKCdicy5jb2xsYXBzZScpXG4gICAgdmFyIG9wdGlvbiAgPSBkYXRhID8gJ3RvZ2dsZScgOiAkdGhpcy5kYXRhKClcblxuICAgIFBsdWdpbi5jYWxsKCR0YXJnZXQsIG9wdGlvbilcbiAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogZHJvcGRvd24uanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jZHJvcGRvd25zXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gRFJPUERPV04gQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIGJhY2tkcm9wID0gJy5kcm9wZG93bi1iYWNrZHJvcCdcbiAgdmFyIHRvZ2dsZSAgID0gJ1tkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJdJ1xuICB2YXIgRHJvcGRvd24gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICQoZWxlbWVudCkub24oJ2NsaWNrLmJzLmRyb3Bkb3duJywgdGhpcy50b2dnbGUpXG4gIH1cblxuICBEcm9wZG93bi5WRVJTSU9OID0gJzMuNC4xJ1xuXG4gIGZ1bmN0aW9uIGdldFBhcmVudCgkdGhpcykge1xuICAgIHZhciBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JylcblxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHNlbGVjdG9yID0gJHRoaXMuYXR0cignaHJlZicpXG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yICYmIC8jW0EtWmEtel0vLnRlc3Qoc2VsZWN0b3IpICYmIHNlbGVjdG9yLnJlcGxhY2UoLy4qKD89I1teXFxzXSokKS8sICcnKSAvLyBzdHJpcCBmb3IgaWU3XG4gICAgfVxuXG4gICAgdmFyICRwYXJlbnQgPSBzZWxlY3RvciAhPT0gJyMnID8gJChkb2N1bWVudCkuZmluZChzZWxlY3RvcikgOiBudWxsXG5cbiAgICByZXR1cm4gJHBhcmVudCAmJiAkcGFyZW50Lmxlbmd0aCA/ICRwYXJlbnQgOiAkdGhpcy5wYXJlbnQoKVxuICB9XG5cbiAgZnVuY3Rpb24gY2xlYXJNZW51cyhlKSB7XG4gICAgaWYgKGUgJiYgZS53aGljaCA9PT0gMykgcmV0dXJuXG4gICAgJChiYWNrZHJvcCkucmVtb3ZlKClcbiAgICAkKHRvZ2dsZSkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICAgICAgICA9ICQodGhpcylcbiAgICAgIHZhciAkcGFyZW50ICAgICAgID0gZ2V0UGFyZW50KCR0aGlzKVxuICAgICAgdmFyIHJlbGF0ZWRUYXJnZXQgPSB7IHJlbGF0ZWRUYXJnZXQ6IHRoaXMgfVxuXG4gICAgICBpZiAoISRwYXJlbnQuaGFzQ2xhc3MoJ29wZW4nKSkgcmV0dXJuXG5cbiAgICAgIGlmIChlICYmIGUudHlwZSA9PSAnY2xpY2snICYmIC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZS50YXJnZXQudGFnTmFtZSkgJiYgJC5jb250YWlucygkcGFyZW50WzBdLCBlLnRhcmdldCkpIHJldHVyblxuXG4gICAgICAkcGFyZW50LnRyaWdnZXIoZSA9ICQuRXZlbnQoJ2hpZGUuYnMuZHJvcGRvd24nLCByZWxhdGVkVGFyZ2V0KSlcblxuICAgICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgICAkdGhpcy5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJylcbiAgICAgICRwYXJlbnQucmVtb3ZlQ2xhc3MoJ29wZW4nKS50cmlnZ2VyKCQuRXZlbnQoJ2hpZGRlbi5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxuICAgIH0pXG4gIH1cblxuICBEcm9wZG93bi5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG5cbiAgICBpZiAoJHRoaXMuaXMoJy5kaXNhYmxlZCwgOmRpc2FibGVkJykpIHJldHVyblxuXG4gICAgdmFyICRwYXJlbnQgID0gZ2V0UGFyZW50KCR0aGlzKVxuICAgIHZhciBpc0FjdGl2ZSA9ICRwYXJlbnQuaGFzQ2xhc3MoJ29wZW4nKVxuXG4gICAgY2xlYXJNZW51cygpXG5cbiAgICBpZiAoIWlzQWN0aXZlKSB7XG4gICAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmICEkcGFyZW50LmNsb3Nlc3QoJy5uYXZiYXItbmF2JykubGVuZ3RoKSB7XG4gICAgICAgIC8vIGlmIG1vYmlsZSB3ZSB1c2UgYSBiYWNrZHJvcCBiZWNhdXNlIGNsaWNrIGV2ZW50cyBkb24ndCBkZWxlZ2F0ZVxuICAgICAgICAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKVxuICAgICAgICAgIC5hZGRDbGFzcygnZHJvcGRvd24tYmFja2Ryb3AnKVxuICAgICAgICAgIC5pbnNlcnRBZnRlcigkKHRoaXMpKVxuICAgICAgICAgIC5vbignY2xpY2snLCBjbGVhck1lbnVzKVxuICAgICAgfVxuXG4gICAgICB2YXIgcmVsYXRlZFRhcmdldCA9IHsgcmVsYXRlZFRhcmdldDogdGhpcyB9XG4gICAgICAkcGFyZW50LnRyaWdnZXIoZSA9ICQuRXZlbnQoJ3Nob3cuYnMuZHJvcGRvd24nLCByZWxhdGVkVGFyZ2V0KSlcblxuICAgICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgICAkdGhpc1xuICAgICAgICAudHJpZ2dlcignZm9jdXMnKVxuICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJylcblxuICAgICAgJHBhcmVudFxuICAgICAgICAudG9nZ2xlQ2xhc3MoJ29wZW4nKVxuICAgICAgICAudHJpZ2dlcigkLkV2ZW50KCdzaG93bi5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgRHJvcGRvd24ucHJvdG90eXBlLmtleWRvd24gPSBmdW5jdGlvbiAoZSkge1xuICAgIGlmICghLygzOHw0MHwyN3wzMikvLnRlc3QoZS53aGljaCkgfHwgL2lucHV0fHRleHRhcmVhL2kudGVzdChlLnRhcmdldC50YWdOYW1lKSkgcmV0dXJuXG5cbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICBpZiAoJHRoaXMuaXMoJy5kaXNhYmxlZCwgOmRpc2FibGVkJykpIHJldHVyblxuXG4gICAgdmFyICRwYXJlbnQgID0gZ2V0UGFyZW50KCR0aGlzKVxuICAgIHZhciBpc0FjdGl2ZSA9ICRwYXJlbnQuaGFzQ2xhc3MoJ29wZW4nKVxuXG4gICAgaWYgKCFpc0FjdGl2ZSAmJiBlLndoaWNoICE9IDI3IHx8IGlzQWN0aXZlICYmIGUud2hpY2ggPT0gMjcpIHtcbiAgICAgIGlmIChlLndoaWNoID09IDI3KSAkcGFyZW50LmZpbmQodG9nZ2xlKS50cmlnZ2VyKCdmb2N1cycpXG4gICAgICByZXR1cm4gJHRoaXMudHJpZ2dlcignY2xpY2snKVxuICAgIH1cblxuICAgIHZhciBkZXNjID0gJyBsaTpub3QoLmRpc2FibGVkKTp2aXNpYmxlIGEnXG4gICAgdmFyICRpdGVtcyA9ICRwYXJlbnQuZmluZCgnLmRyb3Bkb3duLW1lbnUnICsgZGVzYylcblxuICAgIGlmICghJGl0ZW1zLmxlbmd0aCkgcmV0dXJuXG5cbiAgICB2YXIgaW5kZXggPSAkaXRlbXMuaW5kZXgoZS50YXJnZXQpXG5cbiAgICBpZiAoZS53aGljaCA9PSAzOCAmJiBpbmRleCA+IDApICAgICAgICAgICAgICAgICBpbmRleC0tICAgICAgICAgLy8gdXBcbiAgICBpZiAoZS53aGljaCA9PSA0MCAmJiBpbmRleCA8ICRpdGVtcy5sZW5ndGggLSAxKSBpbmRleCsrICAgICAgICAgLy8gZG93blxuICAgIGlmICghfmluZGV4KSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gMFxuXG4gICAgJGl0ZW1zLmVxKGluZGV4KS50cmlnZ2VyKCdmb2N1cycpXG4gIH1cblxuXG4gIC8vIERST1BET1dOIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgID0gJHRoaXMuZGF0YSgnYnMuZHJvcGRvd24nKVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmRyb3Bkb3duJywgKGRhdGEgPSBuZXcgRHJvcGRvd24odGhpcykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXS5jYWxsKCR0aGlzKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5kcm9wZG93blxuXG4gICQuZm4uZHJvcGRvd24gICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5kcm9wZG93bi5Db25zdHJ1Y3RvciA9IERyb3Bkb3duXG5cblxuICAvLyBEUk9QRE9XTiBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uZHJvcGRvd24ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmRyb3Bkb3duID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQVBQTFkgVE8gU1RBTkRBUkQgRFJPUERPV04gRUxFTUVOVFNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KVxuICAgIC5vbignY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGknLCBjbGVhck1lbnVzKVxuICAgIC5vbignY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGknLCAnLmRyb3Bkb3duIGZvcm0nLCBmdW5jdGlvbiAoZSkgeyBlLnN0b3BQcm9wYWdhdGlvbigpIH0pXG4gICAgLm9uKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScsIHRvZ2dsZSwgRHJvcGRvd24ucHJvdG90eXBlLnRvZ2dsZSlcbiAgICAub24oJ2tleWRvd24uYnMuZHJvcGRvd24uZGF0YS1hcGknLCB0b2dnbGUsIERyb3Bkb3duLnByb3RvdHlwZS5rZXlkb3duKVxuICAgIC5vbigna2V5ZG93bi5icy5kcm9wZG93bi5kYXRhLWFwaScsICcuZHJvcGRvd24tbWVudScsIERyb3Bkb3duLnByb3RvdHlwZS5rZXlkb3duKVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBtb2RhbC5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNtb2RhbHNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBNT0RBTCBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgTW9kYWwgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLiRib2R5ID0gJChkb2N1bWVudC5ib2R5KVxuICAgIHRoaXMuJGVsZW1lbnQgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy4kZGlhbG9nID0gdGhpcy4kZWxlbWVudC5maW5kKCcubW9kYWwtZGlhbG9nJylcbiAgICB0aGlzLiRiYWNrZHJvcCA9IG51bGxcbiAgICB0aGlzLmlzU2hvd24gPSBudWxsXG4gICAgdGhpcy5vcmlnaW5hbEJvZHlQYWQgPSBudWxsXG4gICAgdGhpcy5zY3JvbGxiYXJXaWR0aCA9IDBcbiAgICB0aGlzLmlnbm9yZUJhY2tkcm9wQ2xpY2sgPSBmYWxzZVxuICAgIHRoaXMuZml4ZWRDb250ZW50ID0gJy5uYXZiYXItZml4ZWQtdG9wLCAubmF2YmFyLWZpeGVkLWJvdHRvbSdcblxuICAgIGlmICh0aGlzLm9wdGlvbnMucmVtb3RlKSB7XG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5maW5kKCcubW9kYWwtY29udGVudCcpXG4gICAgICAgIC5sb2FkKHRoaXMub3B0aW9ucy5yZW1vdGUsICQucHJveHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignbG9hZGVkLmJzLm1vZGFsJylcbiAgICAgICAgfSwgdGhpcykpXG4gICAgfVxuICB9XG5cbiAgTW9kYWwuVkVSU0lPTiA9ICczLjQuMSdcblxuICBNb2RhbC5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMzAwXG4gIE1vZGFsLkJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcblxuICBNb2RhbC5ERUZBVUxUUyA9IHtcbiAgICBiYWNrZHJvcDogdHJ1ZSxcbiAgICBrZXlib2FyZDogdHJ1ZSxcbiAgICBzaG93OiB0cnVlXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKF9yZWxhdGVkVGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRoaXMuaXNTaG93biA/IHRoaXMuaGlkZSgpIDogdGhpcy5zaG93KF9yZWxhdGVkVGFyZ2V0KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoX3JlbGF0ZWRUYXJnZXQpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICB2YXIgZSA9ICQuRXZlbnQoJ3Nob3cuYnMubW9kYWwnLCB7IHJlbGF0ZWRUYXJnZXQ6IF9yZWxhdGVkVGFyZ2V0IH0pXG5cbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgIGlmICh0aGlzLmlzU2hvd24gfHwgZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICB0aGlzLmlzU2hvd24gPSB0cnVlXG5cbiAgICB0aGlzLmNoZWNrU2Nyb2xsYmFyKClcbiAgICB0aGlzLnNldFNjcm9sbGJhcigpXG4gICAgdGhpcy4kYm9keS5hZGRDbGFzcygnbW9kYWwtb3BlbicpXG5cbiAgICB0aGlzLmVzY2FwZSgpXG4gICAgdGhpcy5yZXNpemUoKVxuXG4gICAgdGhpcy4kZWxlbWVudC5vbignY2xpY2suZGlzbWlzcy5icy5tb2RhbCcsICdbZGF0YS1kaXNtaXNzPVwibW9kYWxcIl0nLCAkLnByb3h5KHRoaXMuaGlkZSwgdGhpcykpXG5cbiAgICB0aGlzLiRkaWFsb2cub24oJ21vdXNlZG93bi5kaXNtaXNzLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xuICAgICAgdGhhdC4kZWxlbWVudC5vbmUoJ21vdXNldXAuZGlzbWlzcy5icy5tb2RhbCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICgkKGUudGFyZ2V0KS5pcyh0aGF0LiRlbGVtZW50KSkgdGhhdC5pZ25vcmVCYWNrZHJvcENsaWNrID0gdHJ1ZVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5iYWNrZHJvcChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdHJhbnNpdGlvbiA9ICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoYXQuJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZhZGUnKVxuXG4gICAgICBpZiAoIXRoYXQuJGVsZW1lbnQucGFyZW50KCkubGVuZ3RoKSB7XG4gICAgICAgIHRoYXQuJGVsZW1lbnQuYXBwZW5kVG8odGhhdC4kYm9keSkgLy8gZG9uJ3QgbW92ZSBtb2RhbHMgZG9tIHBvc2l0aW9uXG4gICAgICB9XG5cbiAgICAgIHRoYXQuJGVsZW1lbnRcbiAgICAgICAgLnNob3coKVxuICAgICAgICAuc2Nyb2xsVG9wKDApXG5cbiAgICAgIHRoYXQuYWRqdXN0RGlhbG9nKClcblxuICAgICAgaWYgKHRyYW5zaXRpb24pIHtcbiAgICAgICAgdGhhdC4kZWxlbWVudFswXS5vZmZzZXRXaWR0aCAvLyBmb3JjZSByZWZsb3dcbiAgICAgIH1cblxuICAgICAgdGhhdC4kZWxlbWVudC5hZGRDbGFzcygnaW4nKVxuXG4gICAgICB0aGF0LmVuZm9yY2VGb2N1cygpXG5cbiAgICAgIHZhciBlID0gJC5FdmVudCgnc2hvd24uYnMubW9kYWwnLCB7IHJlbGF0ZWRUYXJnZXQ6IF9yZWxhdGVkVGFyZ2V0IH0pXG5cbiAgICAgIHRyYW5zaXRpb24gP1xuICAgICAgICB0aGF0LiRkaWFsb2cgLy8gd2FpdCBmb3IgbW9kYWwgdG8gc2xpZGUgaW5cbiAgICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ2ZvY3VzJykudHJpZ2dlcihlKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKE1vZGFsLlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdmb2N1cycpLnRyaWdnZXIoZSlcbiAgICB9KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoZSkge1xuICAgIGlmIChlKSBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIGUgPSAkLkV2ZW50KCdoaWRlLmJzLm1vZGFsJylcblxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgaWYgKCF0aGlzLmlzU2hvd24gfHwgZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICB0aGlzLmlzU2hvd24gPSBmYWxzZVxuXG4gICAgdGhpcy5lc2NhcGUoKVxuICAgIHRoaXMucmVzaXplKClcblxuICAgICQoZG9jdW1lbnQpLm9mZignZm9jdXNpbi5icy5tb2RhbCcpXG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICAucmVtb3ZlQ2xhc3MoJ2luJylcbiAgICAgIC5vZmYoJ2NsaWNrLmRpc21pc3MuYnMubW9kYWwnKVxuICAgICAgLm9mZignbW91c2V1cC5kaXNtaXNzLmJzLm1vZGFsJylcblxuICAgIHRoaXMuJGRpYWxvZy5vZmYoJ21vdXNlZG93bi5kaXNtaXNzLmJzLm1vZGFsJylcblxuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsICQucHJveHkodGhpcy5oaWRlTW9kYWwsIHRoaXMpKVxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoTW9kYWwuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgdGhpcy5oaWRlTW9kYWwoKVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmVuZm9yY2VGb2N1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAkKGRvY3VtZW50KVxuICAgICAgLm9mZignZm9jdXNpbi5icy5tb2RhbCcpIC8vIGd1YXJkIGFnYWluc3QgaW5maW5pdGUgZm9jdXMgbG9vcFxuICAgICAgLm9uKCdmb2N1c2luLmJzLm1vZGFsJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoZG9jdW1lbnQgIT09IGUudGFyZ2V0ICYmXG4gICAgICAgICAgdGhpcy4kZWxlbWVudFswXSAhPT0gZS50YXJnZXQgJiZcbiAgICAgICAgICAhdGhpcy4kZWxlbWVudC5oYXMoZS50YXJnZXQpLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignZm9jdXMnKVxuICAgICAgICB9XG4gICAgICB9LCB0aGlzKSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5lc2NhcGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuaXNTaG93biAmJiB0aGlzLm9wdGlvbnMua2V5Ym9hcmQpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQub24oJ2tleWRvd24uZGlzbWlzcy5icy5tb2RhbCcsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS53aGljaCA9PSAyNyAmJiB0aGlzLmhpZGUoKVxuICAgICAgfSwgdGhpcykpXG4gICAgfSBlbHNlIGlmICghdGhpcy5pc1Nob3duKSB7XG4gICAgICB0aGlzLiRlbGVtZW50Lm9mZigna2V5ZG93bi5kaXNtaXNzLmJzLm1vZGFsJylcbiAgICB9XG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmlzU2hvd24pIHtcbiAgICAgICQod2luZG93KS5vbigncmVzaXplLmJzLm1vZGFsJywgJC5wcm94eSh0aGlzLmhhbmRsZVVwZGF0ZSwgdGhpcykpXG4gICAgfSBlbHNlIHtcbiAgICAgICQod2luZG93KS5vZmYoJ3Jlc2l6ZS5icy5tb2RhbCcpXG4gICAgfVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmhpZGVNb2RhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICB0aGlzLiRlbGVtZW50LmhpZGUoKVxuICAgIHRoaXMuYmFja2Ryb3AoZnVuY3Rpb24gKCkge1xuICAgICAgdGhhdC4kYm9keS5yZW1vdmVDbGFzcygnbW9kYWwtb3BlbicpXG4gICAgICB0aGF0LnJlc2V0QWRqdXN0bWVudHMoKVxuICAgICAgdGhhdC5yZXNldFNjcm9sbGJhcigpXG4gICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ2hpZGRlbi5icy5tb2RhbCcpXG4gICAgfSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5yZW1vdmVCYWNrZHJvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRiYWNrZHJvcCAmJiB0aGlzLiRiYWNrZHJvcC5yZW1vdmUoKVxuICAgIHRoaXMuJGJhY2tkcm9wID0gbnVsbFxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmJhY2tkcm9wID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgdmFyIGFuaW1hdGUgPSB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdmYWRlJykgPyAnZmFkZScgOiAnJ1xuXG4gICAgaWYgKHRoaXMuaXNTaG93biAmJiB0aGlzLm9wdGlvbnMuYmFja2Ryb3ApIHtcbiAgICAgIHZhciBkb0FuaW1hdGUgPSAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiBhbmltYXRlXG5cbiAgICAgIHRoaXMuJGJhY2tkcm9wID0gJChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSlcbiAgICAgICAgLmFkZENsYXNzKCdtb2RhbC1iYWNrZHJvcCAnICsgYW5pbWF0ZSlcbiAgICAgICAgLmFwcGVuZFRvKHRoaXMuJGJvZHkpXG5cbiAgICAgIHRoaXMuJGVsZW1lbnQub24oJ2NsaWNrLmRpc21pc3MuYnMubW9kYWwnLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICh0aGlzLmlnbm9yZUJhY2tkcm9wQ2xpY2spIHtcbiAgICAgICAgICB0aGlzLmlnbm9yZUJhY2tkcm9wQ2xpY2sgPSBmYWxzZVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmIChlLnRhcmdldCAhPT0gZS5jdXJyZW50VGFyZ2V0KSByZXR1cm5cbiAgICAgICAgdGhpcy5vcHRpb25zLmJhY2tkcm9wID09ICdzdGF0aWMnXG4gICAgICAgICAgPyB0aGlzLiRlbGVtZW50WzBdLmZvY3VzKClcbiAgICAgICAgICA6IHRoaXMuaGlkZSgpXG4gICAgICB9LCB0aGlzKSlcblxuICAgICAgaWYgKGRvQW5pbWF0ZSkgdGhpcy4kYmFja2Ryb3BbMF0ub2Zmc2V0V2lkdGggLy8gZm9yY2UgcmVmbG93XG5cbiAgICAgIHRoaXMuJGJhY2tkcm9wLmFkZENsYXNzKCdpbicpXG5cbiAgICAgIGlmICghY2FsbGJhY2spIHJldHVyblxuXG4gICAgICBkb0FuaW1hdGUgP1xuICAgICAgICB0aGlzLiRiYWNrZHJvcFxuICAgICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGNhbGxiYWNrKVxuICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5CQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICAgIGNhbGxiYWNrKClcblxuICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNTaG93biAmJiB0aGlzLiRiYWNrZHJvcCkge1xuICAgICAgdGhpcy4kYmFja2Ryb3AucmVtb3ZlQ2xhc3MoJ2luJylcblxuICAgICAgdmFyIGNhbGxiYWNrUmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0LnJlbW92ZUJhY2tkcm9wKClcbiAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICAgICAgfVxuICAgICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgICAgdGhpcy4kYmFja2Ryb3BcbiAgICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjYWxsYmFja1JlbW92ZSlcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoTW9kYWwuQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgICBjYWxsYmFja1JlbW92ZSgpXG5cbiAgICB9IGVsc2UgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG5cbiAgLy8gdGhlc2UgZm9sbG93aW5nIG1ldGhvZHMgYXJlIHVzZWQgdG8gaGFuZGxlIG92ZXJmbG93aW5nIG1vZGFsc1xuXG4gIE1vZGFsLnByb3RvdHlwZS5oYW5kbGVVcGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5hZGp1c3REaWFsb2coKVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmFkanVzdERpYWxvZyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kYWxJc092ZXJmbG93aW5nID0gdGhpcy4kZWxlbWVudFswXS5zY3JvbGxIZWlnaHQgPiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG5cbiAgICB0aGlzLiRlbGVtZW50LmNzcyh7XG4gICAgICBwYWRkaW5nTGVmdDogIXRoaXMuYm9keUlzT3ZlcmZsb3dpbmcgJiYgbW9kYWxJc092ZXJmbG93aW5nID8gdGhpcy5zY3JvbGxiYXJXaWR0aCA6ICcnLFxuICAgICAgcGFkZGluZ1JpZ2h0OiB0aGlzLmJvZHlJc092ZXJmbG93aW5nICYmICFtb2RhbElzT3ZlcmZsb3dpbmcgPyB0aGlzLnNjcm9sbGJhcldpZHRoIDogJydcbiAgICB9KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnJlc2V0QWRqdXN0bWVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kZWxlbWVudC5jc3Moe1xuICAgICAgcGFkZGluZ0xlZnQ6ICcnLFxuICAgICAgcGFkZGluZ1JpZ2h0OiAnJ1xuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuY2hlY2tTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGZ1bGxXaW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgaWYgKCFmdWxsV2luZG93V2lkdGgpIHsgLy8gd29ya2Fyb3VuZCBmb3IgbWlzc2luZyB3aW5kb3cuaW5uZXJXaWR0aCBpbiBJRThcbiAgICAgIHZhciBkb2N1bWVudEVsZW1lbnRSZWN0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBmdWxsV2luZG93V2lkdGggPSBkb2N1bWVudEVsZW1lbnRSZWN0LnJpZ2h0IC0gTWF0aC5hYnMoZG9jdW1lbnRFbGVtZW50UmVjdC5sZWZ0KVxuICAgIH1cbiAgICB0aGlzLmJvZHlJc092ZXJmbG93aW5nID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCA8IGZ1bGxXaW5kb3dXaWR0aFxuICAgIHRoaXMuc2Nyb2xsYmFyV2lkdGggPSB0aGlzLm1lYXN1cmVTY3JvbGxiYXIoKVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnNldFNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYm9keVBhZCA9IHBhcnNlSW50KCh0aGlzLiRib2R5LmNzcygncGFkZGluZy1yaWdodCcpIHx8IDApLCAxMClcbiAgICB0aGlzLm9yaWdpbmFsQm9keVBhZCA9IGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0IHx8ICcnXG4gICAgdmFyIHNjcm9sbGJhcldpZHRoID0gdGhpcy5zY3JvbGxiYXJXaWR0aFxuICAgIGlmICh0aGlzLmJvZHlJc092ZXJmbG93aW5nKSB7XG4gICAgICB0aGlzLiRib2R5LmNzcygncGFkZGluZy1yaWdodCcsIGJvZHlQYWQgKyBzY3JvbGxiYXJXaWR0aClcbiAgICAgICQodGhpcy5maXhlZENvbnRlbnQpLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgIHZhciBhY3R1YWxQYWRkaW5nID0gZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHRcbiAgICAgICAgdmFyIGNhbGN1bGF0ZWRQYWRkaW5nID0gJChlbGVtZW50KS5jc3MoJ3BhZGRpbmctcmlnaHQnKVxuICAgICAgICAkKGVsZW1lbnQpXG4gICAgICAgICAgLmRhdGEoJ3BhZGRpbmctcmlnaHQnLCBhY3R1YWxQYWRkaW5nKVxuICAgICAgICAgIC5jc3MoJ3BhZGRpbmctcmlnaHQnLCBwYXJzZUZsb2F0KGNhbGN1bGF0ZWRQYWRkaW5nKSArIHNjcm9sbGJhcldpZHRoICsgJ3B4JylcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnJlc2V0U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJGJvZHkuY3NzKCdwYWRkaW5nLXJpZ2h0JywgdGhpcy5vcmlnaW5hbEJvZHlQYWQpXG4gICAgJCh0aGlzLmZpeGVkQ29udGVudCkuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgIHZhciBwYWRkaW5nID0gJChlbGVtZW50KS5kYXRhKCdwYWRkaW5nLXJpZ2h0JylcbiAgICAgICQoZWxlbWVudCkucmVtb3ZlRGF0YSgncGFkZGluZy1yaWdodCcpXG4gICAgICBlbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodCA9IHBhZGRpbmcgPyBwYWRkaW5nIDogJydcbiAgICB9KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLm1lYXN1cmVTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7IC8vIHRoeCB3YWxzaFxuICAgIHZhciBzY3JvbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHNjcm9sbERpdi5jbGFzc05hbWUgPSAnbW9kYWwtc2Nyb2xsYmFyLW1lYXN1cmUnXG4gICAgdGhpcy4kYm9keS5hcHBlbmQoc2Nyb2xsRGl2KVxuICAgIHZhciBzY3JvbGxiYXJXaWR0aCA9IHNjcm9sbERpdi5vZmZzZXRXaWR0aCAtIHNjcm9sbERpdi5jbGllbnRXaWR0aFxuICAgIHRoaXMuJGJvZHlbMF0ucmVtb3ZlQ2hpbGQoc2Nyb2xsRGl2KVxuICAgIHJldHVybiBzY3JvbGxiYXJXaWR0aFxuICB9XG5cblxuICAvLyBNT0RBTCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24sIF9yZWxhdGVkVGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSA9ICR0aGlzLmRhdGEoJ2JzLm1vZGFsJylcbiAgICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sIE1vZGFsLkRFRkFVTFRTLCAkdGhpcy5kYXRhKCksIHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uKVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLm1vZGFsJywgKGRhdGEgPSBuZXcgTW9kYWwodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXShfcmVsYXRlZFRhcmdldClcbiAgICAgIGVsc2UgaWYgKG9wdGlvbnMuc2hvdykgZGF0YS5zaG93KF9yZWxhdGVkVGFyZ2V0KVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5tb2RhbFxuXG4gICQuZm4ubW9kYWwgPSBQbHVnaW5cbiAgJC5mbi5tb2RhbC5Db25zdHJ1Y3RvciA9IE1vZGFsXG5cblxuICAvLyBNT0RBTCBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PVxuXG4gICQuZm4ubW9kYWwubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLm1vZGFsID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gTU9EQUwgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KS5vbignY2xpY2suYnMubW9kYWwuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwibW9kYWxcIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICB2YXIgaHJlZiA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgIHZhciB0YXJnZXQgPSAkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpIHx8XG4gICAgICAoaHJlZiAmJiBocmVmLnJlcGxhY2UoLy4qKD89I1teXFxzXSskKS8sICcnKSkgLy8gc3RyaXAgZm9yIGllN1xuXG4gICAgdmFyICR0YXJnZXQgPSAkKGRvY3VtZW50KS5maW5kKHRhcmdldClcbiAgICB2YXIgb3B0aW9uID0gJHRhcmdldC5kYXRhKCdicy5tb2RhbCcpID8gJ3RvZ2dsZScgOiAkLmV4dGVuZCh7IHJlbW90ZTogIS8jLy50ZXN0KGhyZWYpICYmIGhyZWYgfSwgJHRhcmdldC5kYXRhKCksICR0aGlzLmRhdGEoKSlcblxuICAgIGlmICgkdGhpcy5pcygnYScpKSBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICR0YXJnZXQub25lKCdzaG93LmJzLm1vZGFsJywgZnVuY3Rpb24gKHNob3dFdmVudCkge1xuICAgICAgaWYgKHNob3dFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuIC8vIG9ubHkgcmVnaXN0ZXIgZm9jdXMgcmVzdG9yZXIgaWYgbW9kYWwgd2lsbCBhY3R1YWxseSBnZXQgc2hvd25cbiAgICAgICR0YXJnZXQub25lKCdoaWRkZW4uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICR0aGlzLmlzKCc6dmlzaWJsZScpICYmICR0aGlzLnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgIH0pXG4gICAgfSlcbiAgICBQbHVnaW4uY2FsbCgkdGFyZ2V0LCBvcHRpb24sIHRoaXMpXG4gIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IHRvb2x0aXAuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jdG9vbHRpcFxuICogSW5zcGlyZWQgYnkgdGhlIG9yaWdpbmFsIGpRdWVyeS50aXBzeSBieSBKYXNvbiBGcmFtZVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgRElTQUxMT1dFRF9BVFRSSUJVVEVTID0gWydzYW5pdGl6ZScsICd3aGl0ZUxpc3QnLCAnc2FuaXRpemVGbiddXG5cbiAgdmFyIHVyaUF0dHJzID0gW1xuICAgICdiYWNrZ3JvdW5kJyxcbiAgICAnY2l0ZScsXG4gICAgJ2hyZWYnLFxuICAgICdpdGVtdHlwZScsXG4gICAgJ2xvbmdkZXNjJyxcbiAgICAncG9zdGVyJyxcbiAgICAnc3JjJyxcbiAgICAneGxpbms6aHJlZidcbiAgXVxuXG4gIHZhciBBUklBX0FUVFJJQlVURV9QQVRURVJOID0gL15hcmlhLVtcXHctXSokL2lcblxuICB2YXIgRGVmYXVsdFdoaXRlbGlzdCA9IHtcbiAgICAvLyBHbG9iYWwgYXR0cmlidXRlcyBhbGxvd2VkIG9uIGFueSBzdXBwbGllZCBlbGVtZW50IGJlbG93LlxuICAgICcqJzogWydjbGFzcycsICdkaXInLCAnaWQnLCAnbGFuZycsICdyb2xlJywgQVJJQV9BVFRSSUJVVEVfUEFUVEVSTl0sXG4gICAgYTogWyd0YXJnZXQnLCAnaHJlZicsICd0aXRsZScsICdyZWwnXSxcbiAgICBhcmVhOiBbXSxcbiAgICBiOiBbXSxcbiAgICBicjogW10sXG4gICAgY29sOiBbXSxcbiAgICBjb2RlOiBbXSxcbiAgICBkaXY6IFtdLFxuICAgIGVtOiBbXSxcbiAgICBocjogW10sXG4gICAgaDE6IFtdLFxuICAgIGgyOiBbXSxcbiAgICBoMzogW10sXG4gICAgaDQ6IFtdLFxuICAgIGg1OiBbXSxcbiAgICBoNjogW10sXG4gICAgaTogW10sXG4gICAgaW1nOiBbJ3NyYycsICdhbHQnLCAndGl0bGUnLCAnd2lkdGgnLCAnaGVpZ2h0J10sXG4gICAgbGk6IFtdLFxuICAgIG9sOiBbXSxcbiAgICBwOiBbXSxcbiAgICBwcmU6IFtdLFxuICAgIHM6IFtdLFxuICAgIHNtYWxsOiBbXSxcbiAgICBzcGFuOiBbXSxcbiAgICBzdWI6IFtdLFxuICAgIHN1cDogW10sXG4gICAgc3Ryb25nOiBbXSxcbiAgICB1OiBbXSxcbiAgICB1bDogW11cbiAgfVxuXG4gIC8qKlxuICAgKiBBIHBhdHRlcm4gdGhhdCByZWNvZ25pemVzIGEgY29tbW9ubHkgdXNlZnVsIHN1YnNldCBvZiBVUkxzIHRoYXQgYXJlIHNhZmUuXG4gICAqXG4gICAqIFNob3V0b3V0IHRvIEFuZ3VsYXIgNyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2Jsb2IvNy4yLjQvcGFja2FnZXMvY29yZS9zcmMvc2FuaXRpemF0aW9uL3VybF9zYW5pdGl6ZXIudHNcbiAgICovXG4gIHZhciBTQUZFX1VSTF9QQVRURVJOID0gL14oPzooPzpodHRwcz98bWFpbHRvfGZ0cHx0ZWx8ZmlsZSk6fFteJjovPyNdKig/OlsvPyNdfCQpKS9naVxuXG4gIC8qKlxuICAgKiBBIHBhdHRlcm4gdGhhdCBtYXRjaGVzIHNhZmUgZGF0YSBVUkxzLiBPbmx5IG1hdGNoZXMgaW1hZ2UsIHZpZGVvIGFuZCBhdWRpbyB0eXBlcy5cbiAgICpcbiAgICogU2hvdXRvdXQgdG8gQW5ndWxhciA3IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvYmxvYi83LjIuNC9wYWNrYWdlcy9jb3JlL3NyYy9zYW5pdGl6YXRpb24vdXJsX3Nhbml0aXplci50c1xuICAgKi9cbiAgdmFyIERBVEFfVVJMX1BBVFRFUk4gPSAvXmRhdGE6KD86aW1hZ2VcXC8oPzpibXB8Z2lmfGpwZWd8anBnfHBuZ3x0aWZmfHdlYnApfHZpZGVvXFwvKD86bXBlZ3xtcDR8b2dnfHdlYm0pfGF1ZGlvXFwvKD86bXAzfG9nYXxvZ2d8b3B1cykpO2Jhc2U2NCxbYS16MC05Ky9dKz0qJC9pXG5cbiAgZnVuY3Rpb24gYWxsb3dlZEF0dHJpYnV0ZShhdHRyLCBhbGxvd2VkQXR0cmlidXRlTGlzdCkge1xuICAgIHZhciBhdHRyTmFtZSA9IGF0dHIubm9kZU5hbWUudG9Mb3dlckNhc2UoKVxuXG4gICAgaWYgKCQuaW5BcnJheShhdHRyTmFtZSwgYWxsb3dlZEF0dHJpYnV0ZUxpc3QpICE9PSAtMSkge1xuICAgICAgaWYgKCQuaW5BcnJheShhdHRyTmFtZSwgdXJpQXR0cnMpICE9PSAtMSkge1xuICAgICAgICByZXR1cm4gQm9vbGVhbihhdHRyLm5vZGVWYWx1ZS5tYXRjaChTQUZFX1VSTF9QQVRURVJOKSB8fCBhdHRyLm5vZGVWYWx1ZS5tYXRjaChEQVRBX1VSTF9QQVRURVJOKSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICB2YXIgcmVnRXhwID0gJChhbGxvd2VkQXR0cmlidXRlTGlzdCkuZmlsdGVyKGZ1bmN0aW9uIChpbmRleCwgdmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cFxuICAgIH0pXG5cbiAgICAvLyBDaGVjayBpZiBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB2YWxpZGF0ZXMgdGhlIGF0dHJpYnV0ZS5cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHJlZ0V4cC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmIChhdHRyTmFtZS5tYXRjaChyZWdFeHBbaV0pKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBmdW5jdGlvbiBzYW5pdGl6ZUh0bWwodW5zYWZlSHRtbCwgd2hpdGVMaXN0LCBzYW5pdGl6ZUZuKSB7XG4gICAgaWYgKHVuc2FmZUh0bWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdW5zYWZlSHRtbFxuICAgIH1cblxuICAgIGlmIChzYW5pdGl6ZUZuICYmIHR5cGVvZiBzYW5pdGl6ZUZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gc2FuaXRpemVGbih1bnNhZmVIdG1sKVxuICAgIH1cblxuICAgIC8vIElFIDggYW5kIGJlbG93IGRvbid0IHN1cHBvcnQgY3JlYXRlSFRNTERvY3VtZW50XG4gICAgaWYgKCFkb2N1bWVudC5pbXBsZW1lbnRhdGlvbiB8fCAhZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KSB7XG4gICAgICByZXR1cm4gdW5zYWZlSHRtbFxuICAgIH1cblxuICAgIHZhciBjcmVhdGVkRG9jdW1lbnQgPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoJ3Nhbml0aXphdGlvbicpXG4gICAgY3JlYXRlZERvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gdW5zYWZlSHRtbFxuXG4gICAgdmFyIHdoaXRlbGlzdEtleXMgPSAkLm1hcCh3aGl0ZUxpc3QsIGZ1bmN0aW9uIChlbCwgaSkgeyByZXR1cm4gaSB9KVxuICAgIHZhciBlbGVtZW50cyA9ICQoY3JlYXRlZERvY3VtZW50LmJvZHkpLmZpbmQoJyonKVxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YXIgZWwgPSBlbGVtZW50c1tpXVxuICAgICAgdmFyIGVsTmFtZSA9IGVsLm5vZGVOYW1lLnRvTG93ZXJDYXNlKClcblxuICAgICAgaWYgKCQuaW5BcnJheShlbE5hbWUsIHdoaXRlbGlzdEtleXMpID09PSAtMSkge1xuICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKVxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIHZhciBhdHRyaWJ1dGVMaXN0ID0gJC5tYXAoZWwuYXR0cmlidXRlcywgZnVuY3Rpb24gKGVsKSB7IHJldHVybiBlbCB9KVxuICAgICAgdmFyIHdoaXRlbGlzdGVkQXR0cmlidXRlcyA9IFtdLmNvbmNhdCh3aGl0ZUxpc3RbJyonXSB8fCBbXSwgd2hpdGVMaXN0W2VsTmFtZV0gfHwgW10pXG5cbiAgICAgIGZvciAodmFyIGogPSAwLCBsZW4yID0gYXR0cmlidXRlTGlzdC5sZW5ndGg7IGogPCBsZW4yOyBqKyspIHtcbiAgICAgICAgaWYgKCFhbGxvd2VkQXR0cmlidXRlKGF0dHJpYnV0ZUxpc3Rbal0sIHdoaXRlbGlzdGVkQXR0cmlidXRlcykpIHtcbiAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlTGlzdFtqXS5ub2RlTmFtZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVkRG9jdW1lbnQuYm9keS5pbm5lckhUTUxcbiAgfVxuXG4gIC8vIFRPT0xUSVAgUFVCTElDIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBUb29sdGlwID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnR5cGUgICAgICAgPSBudWxsXG4gICAgdGhpcy5vcHRpb25zICAgID0gbnVsbFxuICAgIHRoaXMuZW5hYmxlZCAgICA9IG51bGxcbiAgICB0aGlzLnRpbWVvdXQgICAgPSBudWxsXG4gICAgdGhpcy5ob3ZlclN0YXRlID0gbnVsbFxuICAgIHRoaXMuJGVsZW1lbnQgICA9IG51bGxcbiAgICB0aGlzLmluU3RhdGUgICAgPSBudWxsXG5cbiAgICB0aGlzLmluaXQoJ3Rvb2x0aXAnLCBlbGVtZW50LCBvcHRpb25zKVxuICB9XG5cbiAgVG9vbHRpcC5WRVJTSU9OICA9ICczLjQuMSdcblxuICBUb29sdGlwLlRSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcblxuICBUb29sdGlwLkRFRkFVTFRTID0ge1xuICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICBwbGFjZW1lbnQ6ICd0b3AnLFxuICAgIHNlbGVjdG9yOiBmYWxzZSxcbiAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJ0b29sdGlwXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwidG9vbHRpcC1hcnJvd1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJ0b29sdGlwLWlubmVyXCI+PC9kaXY+PC9kaXY+JyxcbiAgICB0cmlnZ2VyOiAnaG92ZXIgZm9jdXMnLFxuICAgIHRpdGxlOiAnJyxcbiAgICBkZWxheTogMCxcbiAgICBodG1sOiBmYWxzZSxcbiAgICBjb250YWluZXI6IGZhbHNlLFxuICAgIHZpZXdwb3J0OiB7XG4gICAgICBzZWxlY3RvcjogJ2JvZHknLFxuICAgICAgcGFkZGluZzogMFxuICAgIH0sXG4gICAgc2FuaXRpemUgOiB0cnVlLFxuICAgIHNhbml0aXplRm4gOiBudWxsLFxuICAgIHdoaXRlTGlzdCA6IERlZmF1bHRXaGl0ZWxpc3RcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAodHlwZSwgZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuZW5hYmxlZCAgID0gdHJ1ZVxuICAgIHRoaXMudHlwZSAgICAgID0gdHlwZVxuICAgIHRoaXMuJGVsZW1lbnQgID0gJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyAgID0gdGhpcy5nZXRPcHRpb25zKG9wdGlvbnMpXG4gICAgdGhpcy4kdmlld3BvcnQgPSB0aGlzLm9wdGlvbnMudmlld3BvcnQgJiYgJChkb2N1bWVudCkuZmluZCgkLmlzRnVuY3Rpb24odGhpcy5vcHRpb25zLnZpZXdwb3J0KSA/IHRoaXMub3B0aW9ucy52aWV3cG9ydC5jYWxsKHRoaXMsIHRoaXMuJGVsZW1lbnQpIDogKHRoaXMub3B0aW9ucy52aWV3cG9ydC5zZWxlY3RvciB8fCB0aGlzLm9wdGlvbnMudmlld3BvcnQpKVxuICAgIHRoaXMuaW5TdGF0ZSAgID0geyBjbGljazogZmFsc2UsIGhvdmVyOiBmYWxzZSwgZm9jdXM6IGZhbHNlIH1cblxuICAgIGlmICh0aGlzLiRlbGVtZW50WzBdIGluc3RhbmNlb2YgZG9jdW1lbnQuY29uc3RydWN0b3IgJiYgIXRoaXMub3B0aW9ucy5zZWxlY3Rvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgc2VsZWN0b3JgIG9wdGlvbiBtdXN0IGJlIHNwZWNpZmllZCB3aGVuIGluaXRpYWxpemluZyAnICsgdGhpcy50eXBlICsgJyBvbiB0aGUgd2luZG93LmRvY3VtZW50IG9iamVjdCEnKVxuICAgIH1cblxuICAgIHZhciB0cmlnZ2VycyA9IHRoaXMub3B0aW9ucy50cmlnZ2VyLnNwbGl0KCcgJylcblxuICAgIGZvciAodmFyIGkgPSB0cmlnZ2Vycy5sZW5ndGg7IGktLTspIHtcbiAgICAgIHZhciB0cmlnZ2VyID0gdHJpZ2dlcnNbaV1cblxuICAgICAgaWYgKHRyaWdnZXIgPT0gJ2NsaWNrJykge1xuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCdjbGljay4nICsgdGhpcy50eXBlLCB0aGlzLm9wdGlvbnMuc2VsZWN0b3IsICQucHJveHkodGhpcy50b2dnbGUsIHRoaXMpKVxuICAgICAgfSBlbHNlIGlmICh0cmlnZ2VyICE9ICdtYW51YWwnKSB7XG4gICAgICAgIHZhciBldmVudEluICA9IHRyaWdnZXIgPT0gJ2hvdmVyJyA/ICdtb3VzZWVudGVyJyA6ICdmb2N1c2luJ1xuICAgICAgICB2YXIgZXZlbnRPdXQgPSB0cmlnZ2VyID09ICdob3ZlcicgPyAnbW91c2VsZWF2ZScgOiAnZm9jdXNvdXQnXG5cbiAgICAgICAgdGhpcy4kZWxlbWVudC5vbihldmVudEluICArICcuJyArIHRoaXMudHlwZSwgdGhpcy5vcHRpb25zLnNlbGVjdG9yLCAkLnByb3h5KHRoaXMuZW50ZXIsIHRoaXMpKVxuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKGV2ZW50T3V0ICsgJy4nICsgdGhpcy50eXBlLCB0aGlzLm9wdGlvbnMuc2VsZWN0b3IsICQucHJveHkodGhpcy5sZWF2ZSwgdGhpcykpXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5vcHRpb25zLnNlbGVjdG9yID9cbiAgICAgICh0aGlzLl9vcHRpb25zID0gJC5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgeyB0cmlnZ2VyOiAnbWFudWFsJywgc2VsZWN0b3I6ICcnIH0pKSA6XG4gICAgICB0aGlzLmZpeFRpdGxlKClcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldERlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBUb29sdGlwLkRFRkFVTFRTXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgZGF0YUF0dHJpYnV0ZXMgPSB0aGlzLiRlbGVtZW50LmRhdGEoKVxuXG4gICAgZm9yICh2YXIgZGF0YUF0dHIgaW4gZGF0YUF0dHJpYnV0ZXMpIHtcbiAgICAgIGlmIChkYXRhQXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShkYXRhQXR0cikgJiYgJC5pbkFycmF5KGRhdGFBdHRyLCBESVNBTExPV0VEX0FUVFJJQlVURVMpICE9PSAtMSkge1xuICAgICAgICBkZWxldGUgZGF0YUF0dHJpYnV0ZXNbZGF0YUF0dHJdXG4gICAgICB9XG4gICAgfVxuXG4gICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCB0aGlzLmdldERlZmF1bHRzKCksIGRhdGFBdHRyaWJ1dGVzLCBvcHRpb25zKVxuXG4gICAgaWYgKG9wdGlvbnMuZGVsYXkgJiYgdHlwZW9mIG9wdGlvbnMuZGVsYXkgPT0gJ251bWJlcicpIHtcbiAgICAgIG9wdGlvbnMuZGVsYXkgPSB7XG4gICAgICAgIHNob3c6IG9wdGlvbnMuZGVsYXksXG4gICAgICAgIGhpZGU6IG9wdGlvbnMuZGVsYXlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5zYW5pdGl6ZSkge1xuICAgICAgb3B0aW9ucy50ZW1wbGF0ZSA9IHNhbml0aXplSHRtbChvcHRpb25zLnRlbXBsYXRlLCBvcHRpb25zLndoaXRlTGlzdCwgb3B0aW9ucy5zYW5pdGl6ZUZuKVxuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25zXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXREZWxlZ2F0ZU9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgID0ge31cbiAgICB2YXIgZGVmYXVsdHMgPSB0aGlzLmdldERlZmF1bHRzKClcblxuICAgIHRoaXMuX29wdGlvbnMgJiYgJC5lYWNoKHRoaXMuX29wdGlvbnMsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICBpZiAoZGVmYXVsdHNba2V5XSAhPSB2YWx1ZSkgb3B0aW9uc1trZXldID0gdmFsdWVcbiAgICB9KVxuXG4gICAgcmV0dXJuIG9wdGlvbnNcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmVudGVyID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciBzZWxmID0gb2JqIGluc3RhbmNlb2YgdGhpcy5jb25zdHJ1Y3RvciA/XG4gICAgICBvYmogOiAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlKVxuXG4gICAgaWYgKCFzZWxmKSB7XG4gICAgICBzZWxmID0gbmV3IHRoaXMuY29uc3RydWN0b3Iob2JqLmN1cnJlbnRUYXJnZXQsIHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpXG4gICAgICAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlLCBzZWxmKVxuICAgIH1cblxuICAgIGlmIChvYmogaW5zdGFuY2VvZiAkLkV2ZW50KSB7XG4gICAgICBzZWxmLmluU3RhdGVbb2JqLnR5cGUgPT0gJ2ZvY3VzaW4nID8gJ2ZvY3VzJyA6ICdob3ZlciddID0gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChzZWxmLnRpcCgpLmhhc0NsYXNzKCdpbicpIHx8IHNlbGYuaG92ZXJTdGF0ZSA9PSAnaW4nKSB7XG4gICAgICBzZWxmLmhvdmVyU3RhdGUgPSAnaW4nXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjbGVhclRpbWVvdXQoc2VsZi50aW1lb3V0KVxuXG4gICAgc2VsZi5ob3ZlclN0YXRlID0gJ2luJ1xuXG4gICAgaWYgKCFzZWxmLm9wdGlvbnMuZGVsYXkgfHwgIXNlbGYub3B0aW9ucy5kZWxheS5zaG93KSByZXR1cm4gc2VsZi5zaG93KClcblxuICAgIHNlbGYudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHNlbGYuaG92ZXJTdGF0ZSA9PSAnaW4nKSBzZWxmLnNob3coKVxuICAgIH0sIHNlbGYub3B0aW9ucy5kZWxheS5zaG93KVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuaXNJblN0YXRlVHJ1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5pblN0YXRlKSB7XG4gICAgICBpZiAodGhpcy5pblN0YXRlW2tleV0pIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5sZWF2ZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICB2YXIgc2VsZiA9IG9iaiBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3IgP1xuICAgICAgb2JqIDogJChvYmouY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSlcblxuICAgIGlmICghc2VsZikge1xuICAgICAgc2VsZiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG9iai5jdXJyZW50VGFyZ2V0LCB0aGlzLmdldERlbGVnYXRlT3B0aW9ucygpKVxuICAgICAgJChvYmouY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSwgc2VsZilcbiAgICB9XG5cbiAgICBpZiAob2JqIGluc3RhbmNlb2YgJC5FdmVudCkge1xuICAgICAgc2VsZi5pblN0YXRlW29iai50eXBlID09ICdmb2N1c291dCcgPyAnZm9jdXMnIDogJ2hvdmVyJ10gPSBmYWxzZVxuICAgIH1cblxuICAgIGlmIChzZWxmLmlzSW5TdGF0ZVRydWUoKSkgcmV0dXJuXG5cbiAgICBjbGVhclRpbWVvdXQoc2VsZi50aW1lb3V0KVxuXG4gICAgc2VsZi5ob3ZlclN0YXRlID0gJ291dCdcblxuICAgIGlmICghc2VsZi5vcHRpb25zLmRlbGF5IHx8ICFzZWxmLm9wdGlvbnMuZGVsYXkuaGlkZSkgcmV0dXJuIHNlbGYuaGlkZSgpXG5cbiAgICBzZWxmLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzZWxmLmhvdmVyU3RhdGUgPT0gJ291dCcpIHNlbGYuaGlkZSgpXG4gICAgfSwgc2VsZi5vcHRpb25zLmRlbGF5LmhpZGUpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlID0gJC5FdmVudCgnc2hvdy5icy4nICsgdGhpcy50eXBlKVxuXG4gICAgaWYgKHRoaXMuaGFzQ29udGVudCgpICYmIHRoaXMuZW5hYmxlZCkge1xuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICAgIHZhciBpbkRvbSA9ICQuY29udGFpbnModGhpcy4kZWxlbWVudFswXS5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgdGhpcy4kZWxlbWVudFswXSlcbiAgICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpIHx8ICFpbkRvbSkgcmV0dXJuXG4gICAgICB2YXIgdGhhdCA9IHRoaXNcblxuICAgICAgdmFyICR0aXAgPSB0aGlzLnRpcCgpXG5cbiAgICAgIHZhciB0aXBJZCA9IHRoaXMuZ2V0VUlEKHRoaXMudHlwZSlcblxuICAgICAgdGhpcy5zZXRDb250ZW50KClcbiAgICAgICR0aXAuYXR0cignaWQnLCB0aXBJZClcbiAgICAgIHRoaXMuJGVsZW1lbnQuYXR0cignYXJpYS1kZXNjcmliZWRieScsIHRpcElkKVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbikgJHRpcC5hZGRDbGFzcygnZmFkZScpXG5cbiAgICAgIHZhciBwbGFjZW1lbnQgPSB0eXBlb2YgdGhpcy5vcHRpb25zLnBsYWNlbWVudCA9PSAnZnVuY3Rpb24nID9cbiAgICAgICAgdGhpcy5vcHRpb25zLnBsYWNlbWVudC5jYWxsKHRoaXMsICR0aXBbMF0sIHRoaXMuJGVsZW1lbnRbMF0pIDpcbiAgICAgICAgdGhpcy5vcHRpb25zLnBsYWNlbWVudFxuXG4gICAgICB2YXIgYXV0b1Rva2VuID0gL1xccz9hdXRvP1xccz8vaVxuICAgICAgdmFyIGF1dG9QbGFjZSA9IGF1dG9Ub2tlbi50ZXN0KHBsYWNlbWVudClcbiAgICAgIGlmIChhdXRvUGxhY2UpIHBsYWNlbWVudCA9IHBsYWNlbWVudC5yZXBsYWNlKGF1dG9Ub2tlbiwgJycpIHx8ICd0b3AnXG5cbiAgICAgICR0aXBcbiAgICAgICAgLmRldGFjaCgpXG4gICAgICAgIC5jc3MoeyB0b3A6IDAsIGxlZnQ6IDAsIGRpc3BsYXk6ICdibG9jaycgfSlcbiAgICAgICAgLmFkZENsYXNzKHBsYWNlbWVudClcbiAgICAgICAgLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHRoaXMpXG5cbiAgICAgIHRoaXMub3B0aW9ucy5jb250YWluZXIgPyAkdGlwLmFwcGVuZFRvKCQoZG9jdW1lbnQpLmZpbmQodGhpcy5vcHRpb25zLmNvbnRhaW5lcikpIDogJHRpcC5pbnNlcnRBZnRlcih0aGlzLiRlbGVtZW50KVxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdpbnNlcnRlZC5icy4nICsgdGhpcy50eXBlKVxuXG4gICAgICB2YXIgcG9zICAgICAgICAgID0gdGhpcy5nZXRQb3NpdGlvbigpXG4gICAgICB2YXIgYWN0dWFsV2lkdGggID0gJHRpcFswXS5vZmZzZXRXaWR0aFxuICAgICAgdmFyIGFjdHVhbEhlaWdodCA9ICR0aXBbMF0ub2Zmc2V0SGVpZ2h0XG5cbiAgICAgIGlmIChhdXRvUGxhY2UpIHtcbiAgICAgICAgdmFyIG9yZ1BsYWNlbWVudCA9IHBsYWNlbWVudFxuICAgICAgICB2YXIgdmlld3BvcnREaW0gPSB0aGlzLmdldFBvc2l0aW9uKHRoaXMuJHZpZXdwb3J0KVxuXG4gICAgICAgIHBsYWNlbWVudCA9IHBsYWNlbWVudCA9PSAnYm90dG9tJyAmJiBwb3MuYm90dG9tICsgYWN0dWFsSGVpZ2h0ID4gdmlld3BvcnREaW0uYm90dG9tID8gJ3RvcCcgICAgOlxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ3RvcCcgICAgJiYgcG9zLnRvcCAgICAtIGFjdHVhbEhlaWdodCA8IHZpZXdwb3J0RGltLnRvcCAgICA/ICdib3R0b20nIDpcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50ID09ICdyaWdodCcgICYmIHBvcy5yaWdodCAgKyBhY3R1YWxXaWR0aCAgPiB2aWV3cG9ydERpbS53aWR0aCAgPyAnbGVmdCcgICA6XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudCA9PSAnbGVmdCcgICAmJiBwb3MubGVmdCAgIC0gYWN0dWFsV2lkdGggIDwgdmlld3BvcnREaW0ubGVmdCAgID8gJ3JpZ2h0JyAgOlxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnRcblxuICAgICAgICAkdGlwXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKG9yZ1BsYWNlbWVudClcbiAgICAgICAgICAuYWRkQ2xhc3MocGxhY2VtZW50KVxuICAgICAgfVxuXG4gICAgICB2YXIgY2FsY3VsYXRlZE9mZnNldCA9IHRoaXMuZ2V0Q2FsY3VsYXRlZE9mZnNldChwbGFjZW1lbnQsIHBvcywgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodClcblxuICAgICAgdGhpcy5hcHBseVBsYWNlbWVudChjYWxjdWxhdGVkT2Zmc2V0LCBwbGFjZW1lbnQpXG5cbiAgICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHByZXZIb3ZlclN0YXRlID0gdGhhdC5ob3ZlclN0YXRlXG4gICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignc2hvd24uYnMuJyArIHRoYXQudHlwZSlcbiAgICAgICAgdGhhdC5ob3ZlclN0YXRlID0gbnVsbFxuXG4gICAgICAgIGlmIChwcmV2SG92ZXJTdGF0ZSA9PSAnb3V0JykgdGhhdC5sZWF2ZSh0aGF0KVxuICAgICAgfVxuXG4gICAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiR0aXAuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICAgICR0aXBcbiAgICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjb21wbGV0ZSlcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoVG9vbHRpcC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICAgIGNvbXBsZXRlKClcbiAgICB9XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5hcHBseVBsYWNlbWVudCA9IGZ1bmN0aW9uIChvZmZzZXQsIHBsYWNlbWVudCkge1xuICAgIHZhciAkdGlwICAgPSB0aGlzLnRpcCgpXG4gICAgdmFyIHdpZHRoICA9ICR0aXBbMF0ub2Zmc2V0V2lkdGhcbiAgICB2YXIgaGVpZ2h0ID0gJHRpcFswXS5vZmZzZXRIZWlnaHRcblxuICAgIC8vIG1hbnVhbGx5IHJlYWQgbWFyZ2lucyBiZWNhdXNlIGdldEJvdW5kaW5nQ2xpZW50UmVjdCBpbmNsdWRlcyBkaWZmZXJlbmNlXG4gICAgdmFyIG1hcmdpblRvcCA9IHBhcnNlSW50KCR0aXAuY3NzKCdtYXJnaW4tdG9wJyksIDEwKVxuICAgIHZhciBtYXJnaW5MZWZ0ID0gcGFyc2VJbnQoJHRpcC5jc3MoJ21hcmdpbi1sZWZ0JyksIDEwKVxuXG4gICAgLy8gd2UgbXVzdCBjaGVjayBmb3IgTmFOIGZvciBpZSA4LzlcbiAgICBpZiAoaXNOYU4obWFyZ2luVG9wKSkgIG1hcmdpblRvcCAgPSAwXG4gICAgaWYgKGlzTmFOKG1hcmdpbkxlZnQpKSBtYXJnaW5MZWZ0ID0gMFxuXG4gICAgb2Zmc2V0LnRvcCAgKz0gbWFyZ2luVG9wXG4gICAgb2Zmc2V0LmxlZnQgKz0gbWFyZ2luTGVmdFxuXG4gICAgLy8gJC5mbi5vZmZzZXQgZG9lc24ndCByb3VuZCBwaXhlbCB2YWx1ZXNcbiAgICAvLyBzbyB3ZSB1c2Ugc2V0T2Zmc2V0IGRpcmVjdGx5IHdpdGggb3VyIG93biBmdW5jdGlvbiBCLTBcbiAgICAkLm9mZnNldC5zZXRPZmZzZXQoJHRpcFswXSwgJC5leHRlbmQoe1xuICAgICAgdXNpbmc6IGZ1bmN0aW9uIChwcm9wcykge1xuICAgICAgICAkdGlwLmNzcyh7XG4gICAgICAgICAgdG9wOiBNYXRoLnJvdW5kKHByb3BzLnRvcCksXG4gICAgICAgICAgbGVmdDogTWF0aC5yb3VuZChwcm9wcy5sZWZ0KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0sIG9mZnNldCksIDApXG5cbiAgICAkdGlwLmFkZENsYXNzKCdpbicpXG5cbiAgICAvLyBjaGVjayB0byBzZWUgaWYgcGxhY2luZyB0aXAgaW4gbmV3IG9mZnNldCBjYXVzZWQgdGhlIHRpcCB0byByZXNpemUgaXRzZWxmXG4gICAgdmFyIGFjdHVhbFdpZHRoICA9ICR0aXBbMF0ub2Zmc2V0V2lkdGhcbiAgICB2YXIgYWN0dWFsSGVpZ2h0ID0gJHRpcFswXS5vZmZzZXRIZWlnaHRcblxuICAgIGlmIChwbGFjZW1lbnQgPT0gJ3RvcCcgJiYgYWN0dWFsSGVpZ2h0ICE9IGhlaWdodCkge1xuICAgICAgb2Zmc2V0LnRvcCA9IG9mZnNldC50b3AgKyBoZWlnaHQgLSBhY3R1YWxIZWlnaHRcbiAgICB9XG5cbiAgICB2YXIgZGVsdGEgPSB0aGlzLmdldFZpZXdwb3J0QWRqdXN0ZWREZWx0YShwbGFjZW1lbnQsIG9mZnNldCwgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodClcblxuICAgIGlmIChkZWx0YS5sZWZ0KSBvZmZzZXQubGVmdCArPSBkZWx0YS5sZWZ0XG4gICAgZWxzZSBvZmZzZXQudG9wICs9IGRlbHRhLnRvcFxuXG4gICAgdmFyIGlzVmVydGljYWwgICAgICAgICAgPSAvdG9wfGJvdHRvbS8udGVzdChwbGFjZW1lbnQpXG4gICAgdmFyIGFycm93RGVsdGEgICAgICAgICAgPSBpc1ZlcnRpY2FsID8gZGVsdGEubGVmdCAqIDIgLSB3aWR0aCArIGFjdHVhbFdpZHRoIDogZGVsdGEudG9wICogMiAtIGhlaWdodCArIGFjdHVhbEhlaWdodFxuICAgIHZhciBhcnJvd09mZnNldFBvc2l0aW9uID0gaXNWZXJ0aWNhbCA/ICdvZmZzZXRXaWR0aCcgOiAnb2Zmc2V0SGVpZ2h0J1xuXG4gICAgJHRpcC5vZmZzZXQob2Zmc2V0KVxuICAgIHRoaXMucmVwbGFjZUFycm93KGFycm93RGVsdGEsICR0aXBbMF1bYXJyb3dPZmZzZXRQb3NpdGlvbl0sIGlzVmVydGljYWwpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5yZXBsYWNlQXJyb3cgPSBmdW5jdGlvbiAoZGVsdGEsIGRpbWVuc2lvbiwgaXNWZXJ0aWNhbCkge1xuICAgIHRoaXMuYXJyb3coKVxuICAgICAgLmNzcyhpc1ZlcnRpY2FsID8gJ2xlZnQnIDogJ3RvcCcsIDUwICogKDEgLSBkZWx0YSAvIGRpbWVuc2lvbikgKyAnJScpXG4gICAgICAuY3NzKGlzVmVydGljYWwgPyAndG9wJyA6ICdsZWZ0JywgJycpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5zZXRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkdGlwICA9IHRoaXMudGlwKClcbiAgICB2YXIgdGl0bGUgPSB0aGlzLmdldFRpdGxlKClcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaHRtbCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zYW5pdGl6ZSkge1xuICAgICAgICB0aXRsZSA9IHNhbml0aXplSHRtbCh0aXRsZSwgdGhpcy5vcHRpb25zLndoaXRlTGlzdCwgdGhpcy5vcHRpb25zLnNhbml0aXplRm4pXG4gICAgICB9XG5cbiAgICAgICR0aXAuZmluZCgnLnRvb2x0aXAtaW5uZXInKS5odG1sKHRpdGxlKVxuICAgIH0gZWxzZSB7XG4gICAgICAkdGlwLmZpbmQoJy50b29sdGlwLWlubmVyJykudGV4dCh0aXRsZSlcbiAgICB9XG5cbiAgICAkdGlwLnJlbW92ZUNsYXNzKCdmYWRlIGluIHRvcCBib3R0b20gbGVmdCByaWdodCcpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgdmFyICR0aXAgPSAkKHRoaXMuJHRpcClcbiAgICB2YXIgZSAgICA9ICQuRXZlbnQoJ2hpZGUuYnMuJyArIHRoaXMudHlwZSlcblxuICAgIGZ1bmN0aW9uIGNvbXBsZXRlKCkge1xuICAgICAgaWYgKHRoYXQuaG92ZXJTdGF0ZSAhPSAnaW4nKSAkdGlwLmRldGFjaCgpXG4gICAgICBpZiAodGhhdC4kZWxlbWVudCkgeyAvLyBUT0RPOiBDaGVjayB3aGV0aGVyIGd1YXJkaW5nIHRoaXMgY29kZSB3aXRoIHRoaXMgYGlmYCBpcyByZWFsbHkgbmVjZXNzYXJ5LlxuICAgICAgICB0aGF0LiRlbGVtZW50XG4gICAgICAgICAgLnJlbW92ZUF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknKVxuICAgICAgICAgIC50cmlnZ2VyKCdoaWRkZW4uYnMuJyArIHRoYXQudHlwZSlcbiAgICAgIH1cbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9XG5cbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICR0aXAucmVtb3ZlQ2xhc3MoJ2luJylcblxuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmICR0aXAuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICAkdGlwXG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGNvbXBsZXRlKVxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoVG9vbHRpcC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICBjb21wbGV0ZSgpXG5cbiAgICB0aGlzLmhvdmVyU3RhdGUgPSBudWxsXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZml4VGl0bGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRlID0gdGhpcy4kZWxlbWVudFxuICAgIGlmICgkZS5hdHRyKCd0aXRsZScpIHx8IHR5cGVvZiAkZS5hdHRyKCdkYXRhLW9yaWdpbmFsLXRpdGxlJykgIT0gJ3N0cmluZycpIHtcbiAgICAgICRlLmF0dHIoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnLCAkZS5hdHRyKCd0aXRsZScpIHx8ICcnKS5hdHRyKCd0aXRsZScsICcnKVxuICAgIH1cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmhhc0NvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VGl0bGUoKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0UG9zaXRpb24gPSBmdW5jdGlvbiAoJGVsZW1lbnQpIHtcbiAgICAkZWxlbWVudCAgID0gJGVsZW1lbnQgfHwgdGhpcy4kZWxlbWVudFxuXG4gICAgdmFyIGVsICAgICA9ICRlbGVtZW50WzBdXG4gICAgdmFyIGlzQm9keSA9IGVsLnRhZ05hbWUgPT0gJ0JPRFknXG5cbiAgICB2YXIgZWxSZWN0ICAgID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBpZiAoZWxSZWN0LndpZHRoID09IG51bGwpIHtcbiAgICAgIC8vIHdpZHRoIGFuZCBoZWlnaHQgYXJlIG1pc3NpbmcgaW4gSUU4LCBzbyBjb21wdXRlIHRoZW0gbWFudWFsbHk7IHNlZSBodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvaXNzdWVzLzE0MDkzXG4gICAgICBlbFJlY3QgPSAkLmV4dGVuZCh7fSwgZWxSZWN0LCB7IHdpZHRoOiBlbFJlY3QucmlnaHQgLSBlbFJlY3QubGVmdCwgaGVpZ2h0OiBlbFJlY3QuYm90dG9tIC0gZWxSZWN0LnRvcCB9KVxuICAgIH1cbiAgICB2YXIgaXNTdmcgPSB3aW5kb3cuU1ZHRWxlbWVudCAmJiBlbCBpbnN0YW5jZW9mIHdpbmRvdy5TVkdFbGVtZW50XG4gICAgLy8gQXZvaWQgdXNpbmcgJC5vZmZzZXQoKSBvbiBTVkdzIHNpbmNlIGl0IGdpdmVzIGluY29ycmVjdCByZXN1bHRzIGluIGpRdWVyeSAzLlxuICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvaXNzdWVzLzIwMjgwXG4gICAgdmFyIGVsT2Zmc2V0ICA9IGlzQm9keSA/IHsgdG9wOiAwLCBsZWZ0OiAwIH0gOiAoaXNTdmcgPyBudWxsIDogJGVsZW1lbnQub2Zmc2V0KCkpXG4gICAgdmFyIHNjcm9sbCAgICA9IHsgc2Nyb2xsOiBpc0JvZHkgPyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIDogJGVsZW1lbnQuc2Nyb2xsVG9wKCkgfVxuICAgIHZhciBvdXRlckRpbXMgPSBpc0JvZHkgPyB7IHdpZHRoOiAkKHdpbmRvdykud2lkdGgoKSwgaGVpZ2h0OiAkKHdpbmRvdykuaGVpZ2h0KCkgfSA6IG51bGxcblxuICAgIHJldHVybiAkLmV4dGVuZCh7fSwgZWxSZWN0LCBzY3JvbGwsIG91dGVyRGltcywgZWxPZmZzZXQpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRDYWxjdWxhdGVkT2Zmc2V0ID0gZnVuY3Rpb24gKHBsYWNlbWVudCwgcG9zLCBhY3R1YWxXaWR0aCwgYWN0dWFsSGVpZ2h0KSB7XG4gICAgcmV0dXJuIHBsYWNlbWVudCA9PSAnYm90dG9tJyA/IHsgdG9wOiBwb3MudG9wICsgcG9zLmhlaWdodCwgICBsZWZ0OiBwb3MubGVmdCArIHBvcy53aWR0aCAvIDIgLSBhY3R1YWxXaWR0aCAvIDIgfSA6XG4gICAgICAgICAgIHBsYWNlbWVudCA9PSAndG9wJyAgICA/IHsgdG9wOiBwb3MudG9wIC0gYWN0dWFsSGVpZ2h0LCBsZWZ0OiBwb3MubGVmdCArIHBvcy53aWR0aCAvIDIgLSBhY3R1YWxXaWR0aCAvIDIgfSA6XG4gICAgICAgICAgIHBsYWNlbWVudCA9PSAnbGVmdCcgICA/IHsgdG9wOiBwb3MudG9wICsgcG9zLmhlaWdodCAvIDIgLSBhY3R1YWxIZWlnaHQgLyAyLCBsZWZ0OiBwb3MubGVmdCAtIGFjdHVhbFdpZHRoIH0gOlxuICAgICAgICAvKiBwbGFjZW1lbnQgPT0gJ3JpZ2h0JyAqLyB7IHRvcDogcG9zLnRvcCArIHBvcy5oZWlnaHQgLyAyIC0gYWN0dWFsSGVpZ2h0IC8gMiwgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggfVxuXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRWaWV3cG9ydEFkanVzdGVkRGVsdGEgPSBmdW5jdGlvbiAocGxhY2VtZW50LCBwb3MsIGFjdHVhbFdpZHRoLCBhY3R1YWxIZWlnaHQpIHtcbiAgICB2YXIgZGVsdGEgPSB7IHRvcDogMCwgbGVmdDogMCB9XG4gICAgaWYgKCF0aGlzLiR2aWV3cG9ydCkgcmV0dXJuIGRlbHRhXG5cbiAgICB2YXIgdmlld3BvcnRQYWRkaW5nID0gdGhpcy5vcHRpb25zLnZpZXdwb3J0ICYmIHRoaXMub3B0aW9ucy52aWV3cG9ydC5wYWRkaW5nIHx8IDBcbiAgICB2YXIgdmlld3BvcnREaW1lbnNpb25zID0gdGhpcy5nZXRQb3NpdGlvbih0aGlzLiR2aWV3cG9ydClcblxuICAgIGlmICgvcmlnaHR8bGVmdC8udGVzdChwbGFjZW1lbnQpKSB7XG4gICAgICB2YXIgdG9wRWRnZU9mZnNldCAgICA9IHBvcy50b3AgLSB2aWV3cG9ydFBhZGRpbmcgLSB2aWV3cG9ydERpbWVuc2lvbnMuc2Nyb2xsXG4gICAgICB2YXIgYm90dG9tRWRnZU9mZnNldCA9IHBvcy50b3AgKyB2aWV3cG9ydFBhZGRpbmcgLSB2aWV3cG9ydERpbWVuc2lvbnMuc2Nyb2xsICsgYWN0dWFsSGVpZ2h0XG4gICAgICBpZiAodG9wRWRnZU9mZnNldCA8IHZpZXdwb3J0RGltZW5zaW9ucy50b3ApIHsgLy8gdG9wIG92ZXJmbG93XG4gICAgICAgIGRlbHRhLnRvcCA9IHZpZXdwb3J0RGltZW5zaW9ucy50b3AgLSB0b3BFZGdlT2Zmc2V0XG4gICAgICB9IGVsc2UgaWYgKGJvdHRvbUVkZ2VPZmZzZXQgPiB2aWV3cG9ydERpbWVuc2lvbnMudG9wICsgdmlld3BvcnREaW1lbnNpb25zLmhlaWdodCkgeyAvLyBib3R0b20gb3ZlcmZsb3dcbiAgICAgICAgZGVsdGEudG9wID0gdmlld3BvcnREaW1lbnNpb25zLnRvcCArIHZpZXdwb3J0RGltZW5zaW9ucy5oZWlnaHQgLSBib3R0b21FZGdlT2Zmc2V0XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBsZWZ0RWRnZU9mZnNldCAgPSBwb3MubGVmdCAtIHZpZXdwb3J0UGFkZGluZ1xuICAgICAgdmFyIHJpZ2h0RWRnZU9mZnNldCA9IHBvcy5sZWZ0ICsgdmlld3BvcnRQYWRkaW5nICsgYWN0dWFsV2lkdGhcbiAgICAgIGlmIChsZWZ0RWRnZU9mZnNldCA8IHZpZXdwb3J0RGltZW5zaW9ucy5sZWZ0KSB7IC8vIGxlZnQgb3ZlcmZsb3dcbiAgICAgICAgZGVsdGEubGVmdCA9IHZpZXdwb3J0RGltZW5zaW9ucy5sZWZ0IC0gbGVmdEVkZ2VPZmZzZXRcbiAgICAgIH0gZWxzZSBpZiAocmlnaHRFZGdlT2Zmc2V0ID4gdmlld3BvcnREaW1lbnNpb25zLnJpZ2h0KSB7IC8vIHJpZ2h0IG92ZXJmbG93XG4gICAgICAgIGRlbHRhLmxlZnQgPSB2aWV3cG9ydERpbWVuc2lvbnMubGVmdCArIHZpZXdwb3J0RGltZW5zaW9ucy53aWR0aCAtIHJpZ2h0RWRnZU9mZnNldFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWx0YVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0VGl0bGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRpdGxlXG4gICAgdmFyICRlID0gdGhpcy4kZWxlbWVudFxuICAgIHZhciBvICA9IHRoaXMub3B0aW9uc1xuXG4gICAgdGl0bGUgPSAkZS5hdHRyKCdkYXRhLW9yaWdpbmFsLXRpdGxlJylcbiAgICAgIHx8ICh0eXBlb2Ygby50aXRsZSA9PSAnZnVuY3Rpb24nID8gby50aXRsZS5jYWxsKCRlWzBdKSA6ICBvLnRpdGxlKVxuXG4gICAgcmV0dXJuIHRpdGxlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRVSUQgPSBmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgZG8gcHJlZml4ICs9IH5+KE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwKVxuICAgIHdoaWxlIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcmVmaXgpKVxuICAgIHJldHVybiBwcmVmaXhcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnRpcCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuJHRpcCkge1xuICAgICAgdGhpcy4kdGlwID0gJCh0aGlzLm9wdGlvbnMudGVtcGxhdGUpXG4gICAgICBpZiAodGhpcy4kdGlwLmxlbmd0aCAhPSAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcih0aGlzLnR5cGUgKyAnIGB0ZW1wbGF0ZWAgb3B0aW9uIG11c3QgY29uc2lzdCBvZiBleGFjdGx5IDEgdG9wLWxldmVsIGVsZW1lbnQhJylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuJHRpcFxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuYXJyb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICh0aGlzLiRhcnJvdyA9IHRoaXMuJGFycm93IHx8IHRoaXMudGlwKCkuZmluZCgnLnRvb2x0aXAtYXJyb3cnKSlcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSB0cnVlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5kaXNhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS50b2dnbGVFbmFibGVkID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZW5hYmxlZCA9ICF0aGlzLmVuYWJsZWRcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgaWYgKGUpIHtcbiAgICAgIHNlbGYgPSAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSlcbiAgICAgIGlmICghc2VsZikge1xuICAgICAgICBzZWxmID0gbmV3IHRoaXMuY29uc3RydWN0b3IoZS5jdXJyZW50VGFyZ2V0LCB0aGlzLmdldERlbGVnYXRlT3B0aW9ucygpKVxuICAgICAgICAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSwgc2VsZilcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZSkge1xuICAgICAgc2VsZi5pblN0YXRlLmNsaWNrID0gIXNlbGYuaW5TdGF0ZS5jbGlja1xuICAgICAgaWYgKHNlbGYuaXNJblN0YXRlVHJ1ZSgpKSBzZWxmLmVudGVyKHNlbGYpXG4gICAgICBlbHNlIHNlbGYubGVhdmUoc2VsZilcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi50aXAoKS5oYXNDbGFzcygnaW4nKSA/IHNlbGYubGVhdmUoc2VsZikgOiBzZWxmLmVudGVyKHNlbGYpXG4gICAgfVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KVxuICAgIHRoaXMuaGlkZShmdW5jdGlvbiAoKSB7XG4gICAgICB0aGF0LiRlbGVtZW50Lm9mZignLicgKyB0aGF0LnR5cGUpLnJlbW92ZURhdGEoJ2JzLicgKyB0aGF0LnR5cGUpXG4gICAgICBpZiAodGhhdC4kdGlwKSB7XG4gICAgICAgIHRoYXQuJHRpcC5kZXRhY2goKVxuICAgICAgfVxuICAgICAgdGhhdC4kdGlwID0gbnVsbFxuICAgICAgdGhhdC4kYXJyb3cgPSBudWxsXG4gICAgICB0aGF0LiR2aWV3cG9ydCA9IG51bGxcbiAgICAgIHRoYXQuJGVsZW1lbnQgPSBudWxsXG4gICAgfSlcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnNhbml0aXplSHRtbCA9IGZ1bmN0aW9uICh1bnNhZmVIdG1sKSB7XG4gICAgcmV0dXJuIHNhbml0aXplSHRtbCh1bnNhZmVIdG1sLCB0aGlzLm9wdGlvbnMud2hpdGVMaXN0LCB0aGlzLm9wdGlvbnMuc2FuaXRpemVGbilcbiAgfVxuXG4gIC8vIFRPT0xUSVAgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy50b29sdGlwJylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhICYmIC9kZXN0cm95fGhpZGUvLnRlc3Qob3B0aW9uKSkgcmV0dXJuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLnRvb2x0aXAnLCAoZGF0YSA9IG5ldyBUb29sdGlwKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi50b29sdGlwXG5cbiAgJC5mbi50b29sdGlwICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4udG9vbHRpcC5Db25zdHJ1Y3RvciA9IFRvb2x0aXBcblxuXG4gIC8vIFRPT0xUSVAgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4udG9vbHRpcC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4udG9vbHRpcCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogcG9wb3Zlci5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNwb3BvdmVyc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIFBPUE9WRVIgUFVCTElDIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBQb3BvdmVyID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmluaXQoJ3BvcG92ZXInLCBlbGVtZW50LCBvcHRpb25zKVxuICB9XG5cbiAgaWYgKCEkLmZuLnRvb2x0aXApIHRocm93IG5ldyBFcnJvcignUG9wb3ZlciByZXF1aXJlcyB0b29sdGlwLmpzJylcblxuICBQb3BvdmVyLlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIFBvcG92ZXIuREVGQVVMVFMgPSAkLmV4dGVuZCh7fSwgJC5mbi50b29sdGlwLkNvbnN0cnVjdG9yLkRFRkFVTFRTLCB7XG4gICAgcGxhY2VtZW50OiAncmlnaHQnLFxuICAgIHRyaWdnZXI6ICdjbGljaycsXG4gICAgY29udGVudDogJycsXG4gICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwicG9wb3ZlclwiIHJvbGU9XCJ0b29sdGlwXCI+PGRpdiBjbGFzcz1cImFycm93XCI+PC9kaXY+PGgzIGNsYXNzPVwicG9wb3Zlci10aXRsZVwiPjwvaDM+PGRpdiBjbGFzcz1cInBvcG92ZXItY29udGVudFwiPjwvZGl2PjwvZGl2PidcbiAgfSlcblxuXG4gIC8vIE5PVEU6IFBPUE9WRVIgRVhURU5EUyB0b29sdGlwLmpzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUgPSAkLmV4dGVuZCh7fSwgJC5mbi50b29sdGlwLkNvbnN0cnVjdG9yLnByb3RvdHlwZSlcblxuICBQb3BvdmVyLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFBvcG92ZXJcblxuICBQb3BvdmVyLnByb3RvdHlwZS5nZXREZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUG9wb3Zlci5ERUZBVUxUU1xuICB9XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuc2V0Q29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHRpcCAgICA9IHRoaXMudGlwKClcbiAgICB2YXIgdGl0bGUgICA9IHRoaXMuZ2V0VGl0bGUoKVxuICAgIHZhciBjb250ZW50ID0gdGhpcy5nZXRDb250ZW50KClcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaHRtbCkge1xuICAgICAgdmFyIHR5cGVDb250ZW50ID0gdHlwZW9mIGNvbnRlbnRcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zYW5pdGl6ZSkge1xuICAgICAgICB0aXRsZSA9IHRoaXMuc2FuaXRpemVIdG1sKHRpdGxlKVxuXG4gICAgICAgIGlmICh0eXBlQ29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBjb250ZW50ID0gdGhpcy5zYW5pdGl6ZUh0bWwoY29udGVudClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAkdGlwLmZpbmQoJy5wb3BvdmVyLXRpdGxlJykuaHRtbCh0aXRsZSlcbiAgICAgICR0aXAuZmluZCgnLnBvcG92ZXItY29udGVudCcpLmNoaWxkcmVuKCkuZGV0YWNoKCkuZW5kKClbXG4gICAgICAgIHR5cGVDb250ZW50ID09PSAnc3RyaW5nJyA/ICdodG1sJyA6ICdhcHBlbmQnXG4gICAgICBdKGNvbnRlbnQpXG4gICAgfSBlbHNlIHtcbiAgICAgICR0aXAuZmluZCgnLnBvcG92ZXItdGl0bGUnKS50ZXh0KHRpdGxlKVxuICAgICAgJHRpcC5maW5kKCcucG9wb3Zlci1jb250ZW50JykuY2hpbGRyZW4oKS5kZXRhY2goKS5lbmQoKS50ZXh0KGNvbnRlbnQpXG4gICAgfVxuXG4gICAgJHRpcC5yZW1vdmVDbGFzcygnZmFkZSB0b3AgYm90dG9tIGxlZnQgcmlnaHQgaW4nKVxuXG4gICAgLy8gSUU4IGRvZXNuJ3QgYWNjZXB0IGhpZGluZyB2aWEgdGhlIGA6ZW1wdHlgIHBzZXVkbyBzZWxlY3Rvciwgd2UgaGF2ZSB0byBkb1xuICAgIC8vIHRoaXMgbWFudWFsbHkgYnkgY2hlY2tpbmcgdGhlIGNvbnRlbnRzLlxuICAgIGlmICghJHRpcC5maW5kKCcucG9wb3Zlci10aXRsZScpLmh0bWwoKSkgJHRpcC5maW5kKCcucG9wb3Zlci10aXRsZScpLmhpZGUoKVxuICB9XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuaGFzQ29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUaXRsZSgpIHx8IHRoaXMuZ2V0Q29udGVudCgpXG4gIH1cblxuICBQb3BvdmVyLnByb3RvdHlwZS5nZXRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkZSA9IHRoaXMuJGVsZW1lbnRcbiAgICB2YXIgbyAgPSB0aGlzLm9wdGlvbnNcblxuICAgIHJldHVybiAkZS5hdHRyKCdkYXRhLWNvbnRlbnQnKVxuICAgICAgfHwgKHR5cGVvZiBvLmNvbnRlbnQgPT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAgIG8uY29udGVudC5jYWxsKCRlWzBdKSA6XG4gICAgICAgIG8uY29udGVudClcbiAgfVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmFycm93ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAodGhpcy4kYXJyb3cgPSB0aGlzLiRhcnJvdyB8fCB0aGlzLnRpcCgpLmZpbmQoJy5hcnJvdycpKVxuICB9XG5cblxuICAvLyBQT1BPVkVSIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMucG9wb3ZlcicpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSAmJiAvZGVzdHJveXxoaWRlLy50ZXN0KG9wdGlvbikpIHJldHVyblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5wb3BvdmVyJywgKGRhdGEgPSBuZXcgUG9wb3Zlcih0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4ucG9wb3ZlclxuXG4gICQuZm4ucG9wb3ZlciAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLnBvcG92ZXIuQ29uc3RydWN0b3IgPSBQb3BvdmVyXG5cblxuICAvLyBQT1BPVkVSIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLnBvcG92ZXIubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLnBvcG92ZXIgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IHNjcm9sbHNweS5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNzY3JvbGxzcHlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBTQ1JPTExTUFkgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFNjcm9sbFNweShlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kYm9keSAgICAgICAgICA9ICQoZG9jdW1lbnQuYm9keSlcbiAgICB0aGlzLiRzY3JvbGxFbGVtZW50ID0gJChlbGVtZW50KS5pcyhkb2N1bWVudC5ib2R5KSA/ICQod2luZG93KSA6ICQoZWxlbWVudClcbiAgICB0aGlzLm9wdGlvbnMgICAgICAgID0gJC5leHRlbmQoe30sIFNjcm9sbFNweS5ERUZBVUxUUywgb3B0aW9ucylcbiAgICB0aGlzLnNlbGVjdG9yICAgICAgID0gKHRoaXMub3B0aW9ucy50YXJnZXQgfHwgJycpICsgJyAubmF2IGxpID4gYSdcbiAgICB0aGlzLm9mZnNldHMgICAgICAgID0gW11cbiAgICB0aGlzLnRhcmdldHMgICAgICAgID0gW11cbiAgICB0aGlzLmFjdGl2ZVRhcmdldCAgID0gbnVsbFxuICAgIHRoaXMuc2Nyb2xsSGVpZ2h0ICAgPSAwXG5cbiAgICB0aGlzLiRzY3JvbGxFbGVtZW50Lm9uKCdzY3JvbGwuYnMuc2Nyb2xsc3B5JywgJC5wcm94eSh0aGlzLnByb2Nlc3MsIHRoaXMpKVxuICAgIHRoaXMucmVmcmVzaCgpXG4gICAgdGhpcy5wcm9jZXNzKClcbiAgfVxuXG4gIFNjcm9sbFNweS5WRVJTSU9OICA9ICczLjQuMSdcblxuICBTY3JvbGxTcHkuREVGQVVMVFMgPSB7XG4gICAgb2Zmc2V0OiAxMFxuICB9XG5cbiAgU2Nyb2xsU3B5LnByb3RvdHlwZS5nZXRTY3JvbGxIZWlnaHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuJHNjcm9sbEVsZW1lbnRbMF0uc2Nyb2xsSGVpZ2h0IHx8IE1hdGgubWF4KHRoaXMuJGJvZHlbMF0uc2Nyb2xsSGVpZ2h0LCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0KVxuICB9XG5cbiAgU2Nyb2xsU3B5LnByb3RvdHlwZS5yZWZyZXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aGF0ICAgICAgICAgID0gdGhpc1xuICAgIHZhciBvZmZzZXRNZXRob2QgID0gJ29mZnNldCdcbiAgICB2YXIgb2Zmc2V0QmFzZSAgICA9IDBcblxuICAgIHRoaXMub2Zmc2V0cyAgICAgID0gW11cbiAgICB0aGlzLnRhcmdldHMgICAgICA9IFtdXG4gICAgdGhpcy5zY3JvbGxIZWlnaHQgPSB0aGlzLmdldFNjcm9sbEhlaWdodCgpXG5cbiAgICBpZiAoISQuaXNXaW5kb3codGhpcy4kc2Nyb2xsRWxlbWVudFswXSkpIHtcbiAgICAgIG9mZnNldE1ldGhvZCA9ICdwb3NpdGlvbidcbiAgICAgIG9mZnNldEJhc2UgICA9IHRoaXMuJHNjcm9sbEVsZW1lbnQuc2Nyb2xsVG9wKClcbiAgICB9XG5cbiAgICB0aGlzLiRib2R5XG4gICAgICAuZmluZCh0aGlzLnNlbGVjdG9yKVxuICAgICAgLm1hcChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciAkZWwgICA9ICQodGhpcylcbiAgICAgICAgdmFyIGhyZWYgID0gJGVsLmRhdGEoJ3RhcmdldCcpIHx8ICRlbC5hdHRyKCdocmVmJylcbiAgICAgICAgdmFyICRocmVmID0gL14jLi8udGVzdChocmVmKSAmJiAkKGhyZWYpXG5cbiAgICAgICAgcmV0dXJuICgkaHJlZlxuICAgICAgICAgICYmICRocmVmLmxlbmd0aFxuICAgICAgICAgICYmICRocmVmLmlzKCc6dmlzaWJsZScpXG4gICAgICAgICAgJiYgW1skaHJlZltvZmZzZXRNZXRob2RdKCkudG9wICsgb2Zmc2V0QmFzZSwgaHJlZl1dKSB8fCBudWxsXG4gICAgICB9KVxuICAgICAgLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGFbMF0gLSBiWzBdIH0pXG4gICAgICAuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoYXQub2Zmc2V0cy5wdXNoKHRoaXNbMF0pXG4gICAgICAgIHRoYXQudGFyZ2V0cy5wdXNoKHRoaXNbMV0pXG4gICAgICB9KVxuICB9XG5cbiAgU2Nyb2xsU3B5LnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzY3JvbGxUb3AgICAgPSB0aGlzLiRzY3JvbGxFbGVtZW50LnNjcm9sbFRvcCgpICsgdGhpcy5vcHRpb25zLm9mZnNldFxuICAgIHZhciBzY3JvbGxIZWlnaHQgPSB0aGlzLmdldFNjcm9sbEhlaWdodCgpXG4gICAgdmFyIG1heFNjcm9sbCAgICA9IHRoaXMub3B0aW9ucy5vZmZzZXQgKyBzY3JvbGxIZWlnaHQgLSB0aGlzLiRzY3JvbGxFbGVtZW50LmhlaWdodCgpXG4gICAgdmFyIG9mZnNldHMgICAgICA9IHRoaXMub2Zmc2V0c1xuICAgIHZhciB0YXJnZXRzICAgICAgPSB0aGlzLnRhcmdldHNcbiAgICB2YXIgYWN0aXZlVGFyZ2V0ID0gdGhpcy5hY3RpdmVUYXJnZXRcbiAgICB2YXIgaVxuXG4gICAgaWYgKHRoaXMuc2Nyb2xsSGVpZ2h0ICE9IHNjcm9sbEhlaWdodCkge1xuICAgICAgdGhpcy5yZWZyZXNoKClcbiAgICB9XG5cbiAgICBpZiAoc2Nyb2xsVG9wID49IG1heFNjcm9sbCkge1xuICAgICAgcmV0dXJuIGFjdGl2ZVRhcmdldCAhPSAoaSA9IHRhcmdldHNbdGFyZ2V0cy5sZW5ndGggLSAxXSkgJiYgdGhpcy5hY3RpdmF0ZShpKVxuICAgIH1cblxuICAgIGlmIChhY3RpdmVUYXJnZXQgJiYgc2Nyb2xsVG9wIDwgb2Zmc2V0c1swXSkge1xuICAgICAgdGhpcy5hY3RpdmVUYXJnZXQgPSBudWxsXG4gICAgICByZXR1cm4gdGhpcy5jbGVhcigpXG4gICAgfVxuXG4gICAgZm9yIChpID0gb2Zmc2V0cy5sZW5ndGg7IGktLTspIHtcbiAgICAgIGFjdGl2ZVRhcmdldCAhPSB0YXJnZXRzW2ldXG4gICAgICAgICYmIHNjcm9sbFRvcCA+PSBvZmZzZXRzW2ldXG4gICAgICAgICYmIChvZmZzZXRzW2kgKyAxXSA9PT0gdW5kZWZpbmVkIHx8IHNjcm9sbFRvcCA8IG9mZnNldHNbaSArIDFdKVxuICAgICAgICAmJiB0aGlzLmFjdGl2YXRlKHRhcmdldHNbaV0pXG4gICAgfVxuICB9XG5cbiAgU2Nyb2xsU3B5LnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICB0aGlzLmFjdGl2ZVRhcmdldCA9IHRhcmdldFxuXG4gICAgdGhpcy5jbGVhcigpXG5cbiAgICB2YXIgc2VsZWN0b3IgPSB0aGlzLnNlbGVjdG9yICtcbiAgICAgICdbZGF0YS10YXJnZXQ9XCInICsgdGFyZ2V0ICsgJ1wiXSwnICtcbiAgICAgIHRoaXMuc2VsZWN0b3IgKyAnW2hyZWY9XCInICsgdGFyZ2V0ICsgJ1wiXSdcblxuICAgIHZhciBhY3RpdmUgPSAkKHNlbGVjdG9yKVxuICAgICAgLnBhcmVudHMoJ2xpJylcbiAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcblxuICAgIGlmIChhY3RpdmUucGFyZW50KCcuZHJvcGRvd24tbWVudScpLmxlbmd0aCkge1xuICAgICAgYWN0aXZlID0gYWN0aXZlXG4gICAgICAgIC5jbG9zZXN0KCdsaS5kcm9wZG93bicpXG4gICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICB9XG5cbiAgICBhY3RpdmUudHJpZ2dlcignYWN0aXZhdGUuYnMuc2Nyb2xsc3B5JylcbiAgfVxuXG4gIFNjcm9sbFNweS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgJCh0aGlzLnNlbGVjdG9yKVxuICAgICAgLnBhcmVudHNVbnRpbCh0aGlzLm9wdGlvbnMudGFyZ2V0LCAnLmFjdGl2ZScpXG4gICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gIH1cblxuXG4gIC8vIFNDUk9MTFNQWSBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuc2Nyb2xsc3B5JylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5zY3JvbGxzcHknLCAoZGF0YSA9IG5ldyBTY3JvbGxTcHkodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLnNjcm9sbHNweVxuXG4gICQuZm4uc2Nyb2xsc3B5ICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uc2Nyb2xsc3B5LkNvbnN0cnVjdG9yID0gU2Nyb2xsU3B5XG5cblxuICAvLyBTQ1JPTExTUFkgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5zY3JvbGxzcHkubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLnNjcm9sbHNweSA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIFNDUk9MTFNQWSBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PT09PT1cblxuICAkKHdpbmRvdykub24oJ2xvYWQuYnMuc2Nyb2xsc3B5LmRhdGEtYXBpJywgZnVuY3Rpb24gKCkge1xuICAgICQoJ1tkYXRhLXNweT1cInNjcm9sbFwiXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRzcHkgPSAkKHRoaXMpXG4gICAgICBQbHVnaW4uY2FsbCgkc3B5LCAkc3B5LmRhdGEoKSlcbiAgICB9KVxuICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiB0YWIuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jdGFic1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIFRBQiBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIFRhYiA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgLy8ganNjczpkaXNhYmxlIHJlcXVpcmVEb2xsYXJCZWZvcmVqUXVlcnlBc3NpZ25tZW50XG4gICAgdGhpcy5lbGVtZW50ID0gJChlbGVtZW50KVxuICAgIC8vIGpzY3M6ZW5hYmxlIHJlcXVpcmVEb2xsYXJCZWZvcmVqUXVlcnlBc3NpZ25tZW50XG4gIH1cblxuICBUYWIuVkVSU0lPTiA9ICczLjQuMSdcblxuICBUYWIuVFJBTlNJVElPTl9EVVJBVElPTiA9IDE1MFxuXG4gIFRhYi5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHRoaXMgICAgPSB0aGlzLmVsZW1lbnRcbiAgICB2YXIgJHVsICAgICAgPSAkdGhpcy5jbG9zZXN0KCd1bDpub3QoLmRyb3Bkb3duLW1lbnUpJylcbiAgICB2YXIgc2VsZWN0b3IgPSAkdGhpcy5kYXRhKCd0YXJnZXQnKVxuXG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IgJiYgc2VsZWN0b3IucmVwbGFjZSgvLiooPz0jW15cXHNdKiQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcbiAgICB9XG5cbiAgICBpZiAoJHRoaXMucGFyZW50KCdsaScpLmhhc0NsYXNzKCdhY3RpdmUnKSkgcmV0dXJuXG5cbiAgICB2YXIgJHByZXZpb3VzID0gJHVsLmZpbmQoJy5hY3RpdmU6bGFzdCBhJylcbiAgICB2YXIgaGlkZUV2ZW50ID0gJC5FdmVudCgnaGlkZS5icy50YWInLCB7XG4gICAgICByZWxhdGVkVGFyZ2V0OiAkdGhpc1swXVxuICAgIH0pXG4gICAgdmFyIHNob3dFdmVudCA9ICQuRXZlbnQoJ3Nob3cuYnMudGFiJywge1xuICAgICAgcmVsYXRlZFRhcmdldDogJHByZXZpb3VzWzBdXG4gICAgfSlcblxuICAgICRwcmV2aW91cy50cmlnZ2VyKGhpZGVFdmVudClcbiAgICAkdGhpcy50cmlnZ2VyKHNob3dFdmVudClcblxuICAgIGlmIChzaG93RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkgfHwgaGlkZUV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHZhciAkdGFyZ2V0ID0gJChkb2N1bWVudCkuZmluZChzZWxlY3RvcilcblxuICAgIHRoaXMuYWN0aXZhdGUoJHRoaXMuY2xvc2VzdCgnbGknKSwgJHVsKVxuICAgIHRoaXMuYWN0aXZhdGUoJHRhcmdldCwgJHRhcmdldC5wYXJlbnQoKSwgZnVuY3Rpb24gKCkge1xuICAgICAgJHByZXZpb3VzLnRyaWdnZXIoe1xuICAgICAgICB0eXBlOiAnaGlkZGVuLmJzLnRhYicsXG4gICAgICAgIHJlbGF0ZWRUYXJnZXQ6ICR0aGlzWzBdXG4gICAgICB9KVxuICAgICAgJHRoaXMudHJpZ2dlcih7XG4gICAgICAgIHR5cGU6ICdzaG93bi5icy50YWInLFxuICAgICAgICByZWxhdGVkVGFyZ2V0OiAkcHJldmlvdXNbMF1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIFRhYi5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbiAoZWxlbWVudCwgY29udGFpbmVyLCBjYWxsYmFjaykge1xuICAgIHZhciAkYWN0aXZlICAgID0gY29udGFpbmVyLmZpbmQoJz4gLmFjdGl2ZScpXG4gICAgdmFyIHRyYW5zaXRpb24gPSBjYWxsYmFja1xuICAgICAgJiYgJC5zdXBwb3J0LnRyYW5zaXRpb25cbiAgICAgICYmICgkYWN0aXZlLmxlbmd0aCAmJiAkYWN0aXZlLmhhc0NsYXNzKCdmYWRlJykgfHwgISFjb250YWluZXIuZmluZCgnPiAuZmFkZScpLmxlbmd0aClcblxuICAgIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAkYWN0aXZlXG4gICAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgLmZpbmQoJz4gLmRyb3Bkb3duLW1lbnUgPiAuYWN0aXZlJylcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICAuZW5kKClcbiAgICAgICAgLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScpXG4gICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpXG5cbiAgICAgIGVsZW1lbnRcbiAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJylcbiAgICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuXG4gICAgICBpZiAodHJhbnNpdGlvbikge1xuICAgICAgICBlbGVtZW50WzBdLm9mZnNldFdpZHRoIC8vIHJlZmxvdyBmb3IgdHJhbnNpdGlvblxuICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdpbicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdmYWRlJylcbiAgICAgIH1cblxuICAgICAgaWYgKGVsZW1lbnQucGFyZW50KCcuZHJvcGRvd24tbWVudScpLmxlbmd0aCkge1xuICAgICAgICBlbGVtZW50XG4gICAgICAgICAgLmNsb3Nlc3QoJ2xpLmRyb3Bkb3duJylcbiAgICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICAgLmVuZCgpXG4gICAgICAgICAgLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScpXG4gICAgICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuICAgICAgfVxuXG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgfVxuXG4gICAgJGFjdGl2ZS5sZW5ndGggJiYgdHJhbnNpdGlvbiA/XG4gICAgICAkYWN0aXZlXG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIG5leHQpXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChUYWIuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgbmV4dCgpXG5cbiAgICAkYWN0aXZlLnJlbW92ZUNsYXNzKCdpbicpXG4gIH1cblxuXG4gIC8vIFRBQiBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgPSAkdGhpcy5kYXRhKCdicy50YWInKVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLnRhYicsIChkYXRhID0gbmV3IFRhYih0aGlzKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4udGFiXG5cbiAgJC5mbi50YWIgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi50YWIuQ29uc3RydWN0b3IgPSBUYWJcblxuXG4gIC8vIFRBQiBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT1cblxuICAkLmZuLnRhYi5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4udGFiID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gVEFCIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PVxuXG4gIHZhciBjbGlja0hhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIFBsdWdpbi5jYWxsKCQodGhpcyksICdzaG93JylcbiAgfVxuXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKCdjbGljay5icy50YWIuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJywgY2xpY2tIYW5kbGVyKVxuICAgIC5vbignY2xpY2suYnMudGFiLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZT1cInBpbGxcIl0nLCBjbGlja0hhbmRsZXIpXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGFmZml4LmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI2FmZml4XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQUZGSVggQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIEFmZml4ID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgQWZmaXguREVGQVVMVFMsIG9wdGlvbnMpXG5cbiAgICB2YXIgdGFyZ2V0ID0gdGhpcy5vcHRpb25zLnRhcmdldCA9PT0gQWZmaXguREVGQVVMVFMudGFyZ2V0ID8gJCh0aGlzLm9wdGlvbnMudGFyZ2V0KSA6ICQoZG9jdW1lbnQpLmZpbmQodGhpcy5vcHRpb25zLnRhcmdldClcblxuICAgIHRoaXMuJHRhcmdldCA9IHRhcmdldFxuICAgICAgLm9uKCdzY3JvbGwuYnMuYWZmaXguZGF0YS1hcGknLCAkLnByb3h5KHRoaXMuY2hlY2tQb3NpdGlvbiwgdGhpcykpXG4gICAgICAub24oJ2NsaWNrLmJzLmFmZml4LmRhdGEtYXBpJywgICQucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uV2l0aEV2ZW50TG9vcCwgdGhpcykpXG5cbiAgICB0aGlzLiRlbGVtZW50ICAgICA9ICQoZWxlbWVudClcbiAgICB0aGlzLmFmZml4ZWQgICAgICA9IG51bGxcbiAgICB0aGlzLnVucGluICAgICAgICA9IG51bGxcbiAgICB0aGlzLnBpbm5lZE9mZnNldCA9IG51bGxcblxuICAgIHRoaXMuY2hlY2tQb3NpdGlvbigpXG4gIH1cblxuICBBZmZpeC5WRVJTSU9OICA9ICczLjQuMSdcblxuICBBZmZpeC5SRVNFVCAgICA9ICdhZmZpeCBhZmZpeC10b3AgYWZmaXgtYm90dG9tJ1xuXG4gIEFmZml4LkRFRkFVTFRTID0ge1xuICAgIG9mZnNldDogMCxcbiAgICB0YXJnZXQ6IHdpbmRvd1xuICB9XG5cbiAgQWZmaXgucHJvdG90eXBlLmdldFN0YXRlID0gZnVuY3Rpb24gKHNjcm9sbEhlaWdodCwgaGVpZ2h0LCBvZmZzZXRUb3AsIG9mZnNldEJvdHRvbSkge1xuICAgIHZhciBzY3JvbGxUb3AgICAgPSB0aGlzLiR0YXJnZXQuc2Nyb2xsVG9wKClcbiAgICB2YXIgcG9zaXRpb24gICAgID0gdGhpcy4kZWxlbWVudC5vZmZzZXQoKVxuICAgIHZhciB0YXJnZXRIZWlnaHQgPSB0aGlzLiR0YXJnZXQuaGVpZ2h0KClcblxuICAgIGlmIChvZmZzZXRUb3AgIT0gbnVsbCAmJiB0aGlzLmFmZml4ZWQgPT0gJ3RvcCcpIHJldHVybiBzY3JvbGxUb3AgPCBvZmZzZXRUb3AgPyAndG9wJyA6IGZhbHNlXG5cbiAgICBpZiAodGhpcy5hZmZpeGVkID09ICdib3R0b20nKSB7XG4gICAgICBpZiAob2Zmc2V0VG9wICE9IG51bGwpIHJldHVybiAoc2Nyb2xsVG9wICsgdGhpcy51bnBpbiA8PSBwb3NpdGlvbi50b3ApID8gZmFsc2UgOiAnYm90dG9tJ1xuICAgICAgcmV0dXJuIChzY3JvbGxUb3AgKyB0YXJnZXRIZWlnaHQgPD0gc2Nyb2xsSGVpZ2h0IC0gb2Zmc2V0Qm90dG9tKSA/IGZhbHNlIDogJ2JvdHRvbSdcbiAgICB9XG5cbiAgICB2YXIgaW5pdGlhbGl6aW5nICAgPSB0aGlzLmFmZml4ZWQgPT0gbnVsbFxuICAgIHZhciBjb2xsaWRlclRvcCAgICA9IGluaXRpYWxpemluZyA/IHNjcm9sbFRvcCA6IHBvc2l0aW9uLnRvcFxuICAgIHZhciBjb2xsaWRlckhlaWdodCA9IGluaXRpYWxpemluZyA/IHRhcmdldEhlaWdodCA6IGhlaWdodFxuXG4gICAgaWYgKG9mZnNldFRvcCAhPSBudWxsICYmIHNjcm9sbFRvcCA8PSBvZmZzZXRUb3ApIHJldHVybiAndG9wJ1xuICAgIGlmIChvZmZzZXRCb3R0b20gIT0gbnVsbCAmJiAoY29sbGlkZXJUb3AgKyBjb2xsaWRlckhlaWdodCA+PSBzY3JvbGxIZWlnaHQgLSBvZmZzZXRCb3R0b20pKSByZXR1cm4gJ2JvdHRvbSdcblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgQWZmaXgucHJvdG90eXBlLmdldFBpbm5lZE9mZnNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5waW5uZWRPZmZzZXQpIHJldHVybiB0aGlzLnBpbm5lZE9mZnNldFxuICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoQWZmaXguUkVTRVQpLmFkZENsYXNzKCdhZmZpeCcpXG4gICAgdmFyIHNjcm9sbFRvcCA9IHRoaXMuJHRhcmdldC5zY3JvbGxUb3AoKVxuICAgIHZhciBwb3NpdGlvbiAgPSB0aGlzLiRlbGVtZW50Lm9mZnNldCgpXG4gICAgcmV0dXJuICh0aGlzLnBpbm5lZE9mZnNldCA9IHBvc2l0aW9uLnRvcCAtIHNjcm9sbFRvcClcbiAgfVxuXG4gIEFmZml4LnByb3RvdHlwZS5jaGVja1Bvc2l0aW9uV2l0aEV2ZW50TG9vcCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzZXRUaW1lb3V0KCQucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uLCB0aGlzKSwgMSlcbiAgfVxuXG4gIEFmZml4LnByb3RvdHlwZS5jaGVja1Bvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy4kZWxlbWVudC5pcygnOnZpc2libGUnKSkgcmV0dXJuXG5cbiAgICB2YXIgaGVpZ2h0ICAgICAgID0gdGhpcy4kZWxlbWVudC5oZWlnaHQoKVxuICAgIHZhciBvZmZzZXQgICAgICAgPSB0aGlzLm9wdGlvbnMub2Zmc2V0XG4gICAgdmFyIG9mZnNldFRvcCAgICA9IG9mZnNldC50b3BcbiAgICB2YXIgb2Zmc2V0Qm90dG9tID0gb2Zmc2V0LmJvdHRvbVxuICAgIHZhciBzY3JvbGxIZWlnaHQgPSBNYXRoLm1heCgkKGRvY3VtZW50KS5oZWlnaHQoKSwgJChkb2N1bWVudC5ib2R5KS5oZWlnaHQoKSlcblxuICAgIGlmICh0eXBlb2Ygb2Zmc2V0ICE9ICdvYmplY3QnKSAgICAgICAgIG9mZnNldEJvdHRvbSA9IG9mZnNldFRvcCA9IG9mZnNldFxuICAgIGlmICh0eXBlb2Ygb2Zmc2V0VG9wID09ICdmdW5jdGlvbicpICAgIG9mZnNldFRvcCAgICA9IG9mZnNldC50b3AodGhpcy4kZWxlbWVudClcbiAgICBpZiAodHlwZW9mIG9mZnNldEJvdHRvbSA9PSAnZnVuY3Rpb24nKSBvZmZzZXRCb3R0b20gPSBvZmZzZXQuYm90dG9tKHRoaXMuJGVsZW1lbnQpXG5cbiAgICB2YXIgYWZmaXggPSB0aGlzLmdldFN0YXRlKHNjcm9sbEhlaWdodCwgaGVpZ2h0LCBvZmZzZXRUb3AsIG9mZnNldEJvdHRvbSlcblxuICAgIGlmICh0aGlzLmFmZml4ZWQgIT0gYWZmaXgpIHtcbiAgICAgIGlmICh0aGlzLnVucGluICE9IG51bGwpIHRoaXMuJGVsZW1lbnQuY3NzKCd0b3AnLCAnJylcblxuICAgICAgdmFyIGFmZml4VHlwZSA9ICdhZmZpeCcgKyAoYWZmaXggPyAnLScgKyBhZmZpeCA6ICcnKVxuICAgICAgdmFyIGUgICAgICAgICA9ICQuRXZlbnQoYWZmaXhUeXBlICsgJy5icy5hZmZpeCcpXG5cbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAgIHRoaXMuYWZmaXhlZCA9IGFmZml4XG4gICAgICB0aGlzLnVucGluID0gYWZmaXggPT0gJ2JvdHRvbScgPyB0aGlzLmdldFBpbm5lZE9mZnNldCgpIDogbnVsbFxuXG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5yZW1vdmVDbGFzcyhBZmZpeC5SRVNFVClcbiAgICAgICAgLmFkZENsYXNzKGFmZml4VHlwZSlcbiAgICAgICAgLnRyaWdnZXIoYWZmaXhUeXBlLnJlcGxhY2UoJ2FmZml4JywgJ2FmZml4ZWQnKSArICcuYnMuYWZmaXgnKVxuICAgIH1cblxuICAgIGlmIChhZmZpeCA9PSAnYm90dG9tJykge1xuICAgICAgdGhpcy4kZWxlbWVudC5vZmZzZXQoe1xuICAgICAgICB0b3A6IHNjcm9sbEhlaWdodCAtIGhlaWdodCAtIG9mZnNldEJvdHRvbVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuXG4gIC8vIEFGRklYIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLmFmZml4JylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5hZmZpeCcsIChkYXRhID0gbmV3IEFmZml4KHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5hZmZpeFxuXG4gICQuZm4uYWZmaXggICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5hZmZpeC5Db25zdHJ1Y3RvciA9IEFmZml4XG5cblxuICAvLyBBRkZJWCBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uYWZmaXgubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmFmZml4ID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQUZGSVggREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT1cblxuICAkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnW2RhdGEtc3B5PVwiYWZmaXhcIl0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkc3B5ID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgPSAkc3B5LmRhdGEoKVxuXG4gICAgICBkYXRhLm9mZnNldCA9IGRhdGEub2Zmc2V0IHx8IHt9XG5cbiAgICAgIGlmIChkYXRhLm9mZnNldEJvdHRvbSAhPSBudWxsKSBkYXRhLm9mZnNldC5ib3R0b20gPSBkYXRhLm9mZnNldEJvdHRvbVxuICAgICAgaWYgKGRhdGEub2Zmc2V0VG9wICAgICE9IG51bGwpIGRhdGEub2Zmc2V0LnRvcCAgICA9IGRhdGEub2Zmc2V0VG9wXG5cbiAgICAgIFBsdWdpbi5jYWxsKCRzcHksIGRhdGEpXG4gICAgfSlcbiAgfSlcblxufShqUXVlcnkpO1xuIiwiLy8gfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyB8IEZsZXh5IGhlYWRlclxuLy8gfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyB8XG4vLyB8IFRoaXMgalF1ZXJ5IHNjcmlwdCBpcyB3cml0dGVuIGJ5XG4vLyB8XG4vLyB8IE1vcnRlbiBOaXNzZW5cbi8vIHwgaGplbW1lc2lkZWtvbmdlbi5ka1xuLy8gfFxuXG52YXIgZmxleHlfaGVhZGVyID0gKGZ1bmN0aW9uICgkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIHB1YiA9IHt9LFxuICAgICAgICAkaGVhZGVyX3N0YXRpYyA9ICQoJy5mbGV4eS1oZWFkZXItLXN0YXRpYycpLFxuICAgICAgICAkaGVhZGVyX3N0aWNreSA9ICQoJy5mbGV4eS1oZWFkZXItLXN0aWNreScpLFxuICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgdXBkYXRlX2ludGVydmFsOiAxMDAsXG4gICAgICAgICAgICB0b2xlcmFuY2U6IHtcbiAgICAgICAgICAgICAgICB1cHdhcmQ6IDIwLFxuICAgICAgICAgICAgICAgIGRvd253YXJkOiAxMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9mZnNldDogX2dldF9vZmZzZXRfZnJvbV9lbGVtZW50c19ib3R0b20oJGhlYWRlcl9zdGF0aWMpLFxuICAgICAgICAgICAgY2xhc3Nlczoge1xuICAgICAgICAgICAgICAgIHBpbm5lZDogXCJmbGV4eS1oZWFkZXItLXBpbm5lZFwiLFxuICAgICAgICAgICAgICAgIHVucGlubmVkOiBcImZsZXh5LWhlYWRlci0tdW5waW5uZWRcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB3YXNfc2Nyb2xsZWQgPSBmYWxzZSxcbiAgICAgICAgbGFzdF9kaXN0YW5jZV9mcm9tX3RvcCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBJbnN0YW50aWF0ZVxuICAgICAqL1xuICAgIHB1Yi5pbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgcmVnaXN0ZXJFdmVudEhhbmRsZXJzKCk7XG4gICAgICAgIHJlZ2lzdGVyQm9vdEV2ZW50SGFuZGxlcnMoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgYm9vdCBldmVudCBoYW5kbGVyc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyQm9vdEV2ZW50SGFuZGxlcnMoKSB7XG4gICAgICAgICRoZWFkZXJfc3RpY2t5LmFkZENsYXNzKG9wdGlvbnMuY2xhc3Nlcy51bnBpbm5lZCk7XG5cbiAgICAgICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGlmICh3YXNfc2Nyb2xsZWQpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudF93YXNfc2Nyb2xsZWQoKTtcblxuICAgICAgICAgICAgICAgIHdhc19zY3JvbGxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBvcHRpb25zLnVwZGF0ZV9pbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXIgZXZlbnQgaGFuZGxlcnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZWdpc3RlckV2ZW50SGFuZGxlcnMoKSB7XG4gICAgICAgICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHdhc19zY3JvbGxlZCA9IHRydWU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBvZmZzZXQgZnJvbSBlbGVtZW50IGJvdHRvbVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9nZXRfb2Zmc2V0X2Zyb21fZWxlbWVudHNfYm90dG9tKCRlbGVtZW50KSB7XG4gICAgICAgIHZhciBlbGVtZW50X2hlaWdodCA9ICRlbGVtZW50Lm91dGVySGVpZ2h0KHRydWUpLFxuICAgICAgICAgICAgZWxlbWVudF9vZmZzZXQgPSAkZWxlbWVudC5vZmZzZXQoKS50b3A7XG5cbiAgICAgICAgcmV0dXJuIChlbGVtZW50X2hlaWdodCArIGVsZW1lbnRfb2Zmc2V0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEb2N1bWVudCB3YXMgc2Nyb2xsZWRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkb2N1bWVudF93YXNfc2Nyb2xsZWQoKSB7XG4gICAgICAgIHZhciBjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgICAgIC8vIElmIHBhc3Qgb2Zmc2V0XG4gICAgICAgIGlmIChjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wID49IG9wdGlvbnMub2Zmc2V0KSB7XG5cbiAgICAgICAgICAgIC8vIERvd253YXJkcyBzY3JvbGxcbiAgICAgICAgICAgIGlmIChjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wID4gbGFzdF9kaXN0YW5jZV9mcm9tX3RvcCkge1xuXG4gICAgICAgICAgICAgICAgLy8gT2JleSB0aGUgZG93bndhcmQgdG9sZXJhbmNlXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3AgLSBsYXN0X2Rpc3RhbmNlX2Zyb21fdG9wKSA8PSBvcHRpb25zLnRvbGVyYW5jZS5kb3dud2FyZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJGhlYWRlcl9zdGlja3kucmVtb3ZlQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnBpbm5lZCkuYWRkQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnVucGlubmVkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVXB3YXJkcyBzY3JvbGxcbiAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgLy8gT2JleSB0aGUgdXB3YXJkIHRvbGVyYW5jZVxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wIC0gbGFzdF9kaXN0YW5jZV9mcm9tX3RvcCkgPD0gb3B0aW9ucy50b2xlcmFuY2UudXB3YXJkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBXZSBhcmUgbm90IHNjcm9sbGVkIHBhc3QgdGhlIGRvY3VtZW50IHdoaWNoIGlzIHBvc3NpYmxlIG9uIHRoZSBNYWNcbiAgICAgICAgICAgICAgICBpZiAoKGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3AgKyAkKHdpbmRvdykuaGVpZ2h0KCkpIDwgJChkb2N1bWVudCkuaGVpZ2h0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgJGhlYWRlcl9zdGlja3kucmVtb3ZlQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnVucGlubmVkKS5hZGRDbGFzcyhvcHRpb25zLmNsYXNzZXMucGlubmVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3QgcGFzdCBvZmZzZXRcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkaGVhZGVyX3N0aWNreS5yZW1vdmVDbGFzcyhvcHRpb25zLmNsYXNzZXMucGlubmVkKS5hZGRDbGFzcyhvcHRpb25zLmNsYXNzZXMudW5waW5uZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGFzdF9kaXN0YW5jZV9mcm9tX3RvcCA9IGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3A7XG4gICAgfVxuXG4gICAgcmV0dXJuIHB1Yjtcbn0pKGpRdWVyeSk7XG4iLCIvLyB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHwgRmxleHkgbmF2aWdhdGlvblxuLy8gfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyB8XG4vLyB8IFRoaXMgalF1ZXJ5IHNjcmlwdCBpcyB3cml0dGVuIGJ5XG4vLyB8XG4vLyB8IE1vcnRlbiBOaXNzZW5cbi8vIHwgaGplbW1lc2lkZWtvbmdlbi5ka1xuLy8gfFxuXG52YXIgZmxleHlfbmF2aWdhdGlvbiA9IChmdW5jdGlvbiAoJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBwdWIgPSB7fSxcbiAgICAgICAgbGF5b3V0X2NsYXNzZXMgPSB7XG4gICAgICAgICAgICAnbmF2aWdhdGlvbic6ICcuZmxleHktbmF2aWdhdGlvbicsXG4gICAgICAgICAgICAnb2JmdXNjYXRvcic6ICcuZmxleHktbmF2aWdhdGlvbl9fb2JmdXNjYXRvcicsXG4gICAgICAgICAgICAnZHJvcGRvd24nOiAnLmZsZXh5LW5hdmlnYXRpb25fX2l0ZW0tLWRyb3Bkb3duJyxcbiAgICAgICAgICAgICdkcm9wZG93bl9tZWdhbWVudSc6ICcuZmxleHktbmF2aWdhdGlvbl9faXRlbV9fZHJvcGRvd24tbWVnYW1lbnUnLFxuXG4gICAgICAgICAgICAnaXNfdXBncmFkZWQnOiAnaXMtdXBncmFkZWQnLFxuICAgICAgICAgICAgJ25hdmlnYXRpb25faGFzX21lZ2FtZW51JzogJ2hhcy1tZWdhbWVudScsXG4gICAgICAgICAgICAnZHJvcGRvd25faGFzX21lZ2FtZW51JzogJ2ZsZXh5LW5hdmlnYXRpb25fX2l0ZW0tLWRyb3Bkb3duLXdpdGgtbWVnYW1lbnUnLFxuICAgICAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSW5zdGFudGlhdGVcbiAgICAgKi9cbiAgICBwdWIuaW5pdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHJlZ2lzdGVyRXZlbnRIYW5kbGVycygpO1xuICAgICAgICByZWdpc3RlckJvb3RFdmVudEhhbmRsZXJzKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGJvb3QgZXZlbnQgaGFuZGxlcnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZWdpc3RlckJvb3RFdmVudEhhbmRsZXJzKCkge1xuXG4gICAgICAgIC8vIFVwZ3JhZGVcbiAgICAgICAgdXBncmFkZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGV2ZW50IGhhbmRsZXJzXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXJFdmVudEhhbmRsZXJzKCkge31cblxuICAgIC8qKlxuICAgICAqIFVwZ3JhZGUgZWxlbWVudHMuXG4gICAgICogQWRkIGNsYXNzZXMgdG8gZWxlbWVudHMsIGJhc2VkIHVwb24gYXR0YWNoZWQgY2xhc3Nlcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1cGdyYWRlKCkge1xuICAgICAgICB2YXIgJG5hdmlnYXRpb25zID0gJChsYXlvdXRfY2xhc3Nlcy5uYXZpZ2F0aW9uKTtcblxuICAgICAgICAvLyBOYXZpZ2F0aW9uc1xuICAgICAgICBpZiAoJG5hdmlnYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICRuYXZpZ2F0aW9ucy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyICRuYXZpZ2F0aW9uID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgJG1lZ2FtZW51cyA9ICRuYXZpZ2F0aW9uLmZpbmQobGF5b3V0X2NsYXNzZXMuZHJvcGRvd25fbWVnYW1lbnUpLFxuICAgICAgICAgICAgICAgICAgICAkZHJvcGRvd25fbWVnYW1lbnUgPSAkbmF2aWdhdGlvbi5maW5kKGxheW91dF9jbGFzc2VzLmRyb3Bkb3duX2hhc19tZWdhbWVudSk7XG5cbiAgICAgICAgICAgICAgICAvLyBIYXMgYWxyZWFkeSBiZWVuIHVwZ3JhZGVkXG4gICAgICAgICAgICAgICAgaWYgKCRuYXZpZ2F0aW9uLmhhc0NsYXNzKGxheW91dF9jbGFzc2VzLmlzX3VwZ3JhZGVkKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSGFzIG1lZ2FtZW51XG4gICAgICAgICAgICAgICAgaWYgKCRtZWdhbWVudXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAkbmF2aWdhdGlvbi5hZGRDbGFzcyhsYXlvdXRfY2xhc3Nlcy5uYXZpZ2F0aW9uX2hhc19tZWdhbWVudSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUnVuIHRocm91Z2ggYWxsIG1lZ2FtZW51c1xuICAgICAgICAgICAgICAgICAgICAkbWVnYW1lbnVzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkbWVnYW1lbnUgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc19vYmZ1c2NhdG9yID0gJCgnaHRtbCcpLmhhc0NsYXNzKCdoYXMtb2JmdXNjYXRvcicpID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWVnYW1lbnUucGFyZW50cyhsYXlvdXRfY2xhc3Nlcy5kcm9wZG93bilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MobGF5b3V0X2NsYXNzZXMuZHJvcGRvd25faGFzX21lZ2FtZW51KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5ob3ZlcihmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzX29iZnVzY2F0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iZnVzY2F0b3Iuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzX29iZnVzY2F0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iZnVzY2F0b3IuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIElzIHVwZ3JhZGVkXG4gICAgICAgICAgICAgICAgJG5hdmlnYXRpb24uYWRkQ2xhc3MobGF5b3V0X2NsYXNzZXMuaXNfdXBncmFkZWQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcHViO1xufSkoalF1ZXJ5KTtcbiIsIi8qISBzaWRyIC0gdjIuMi4xIC0gMjAxNi0wMi0xN1xuICogaHR0cDovL3d3dy5iZXJyaWFydC5jb20vc2lkci9cbiAqIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IEFsYmVydG8gVmFyZWxhOyBMaWNlbnNlZCBNSVQgKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBiYWJlbEhlbHBlcnMgPSB7fTtcblxuICBiYWJlbEhlbHBlcnMuY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gICAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gICAgfVxuICB9O1xuXG4gIGJhYmVsSGVscGVycy5jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICAgICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICAgIH07XG4gIH0oKTtcblxuICBiYWJlbEhlbHBlcnM7XG5cbiAgdmFyIHNpZHJTdGF0dXMgPSB7XG4gICAgbW92aW5nOiBmYWxzZSxcbiAgICBvcGVuZWQ6IGZhbHNlXG4gIH07XG5cbiAgdmFyIGhlbHBlciA9IHtcbiAgICAvLyBDaGVjayBmb3IgdmFsaWRzIHVybHNcbiAgICAvLyBGcm9tIDogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NzE3MDkzL2NoZWNrLWlmLWEtamF2YXNjcmlwdC1zdHJpbmctaXMtYW4tdXJsXG5cbiAgICBpc1VybDogZnVuY3Rpb24gaXNVcmwoc3RyKSB7XG4gICAgICB2YXIgcGF0dGVybiA9IG5ldyBSZWdFeHAoJ14oaHR0cHM/OlxcXFwvXFxcXC8pPycgKyAvLyBwcm90b2NvbFxuICAgICAgJygoKFthLXpcXFxcZF0oW2EtelxcXFxkLV0qW2EtelxcXFxkXSkqKVxcXFwuPykrW2Etel17Mix9fCcgKyAvLyBkb21haW4gbmFtZVxuICAgICAgJygoXFxcXGR7MSwzfVxcXFwuKXszfVxcXFxkezEsM30pKScgKyAvLyBPUiBpcCAodjQpIGFkZHJlc3NcbiAgICAgICcoXFxcXDpcXFxcZCspPyhcXFxcL1stYS16XFxcXGQlXy5+K10qKSonICsgLy8gcG9ydCBhbmQgcGF0aFxuICAgICAgJyhcXFxcP1s7JmEtelxcXFxkJV8ufis9LV0qKT8nICsgLy8gcXVlcnkgc3RyaW5nXG4gICAgICAnKFxcXFwjWy1hLXpcXFxcZF9dKik/JCcsICdpJyk7IC8vIGZyYWdtZW50IGxvY2F0b3JcblxuICAgICAgaWYgKHBhdHRlcm4udGVzdChzdHIpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0sXG5cblxuICAgIC8vIEFkZCBzaWRyIHByZWZpeGVzXG4gICAgYWRkUHJlZml4ZXM6IGZ1bmN0aW9uIGFkZFByZWZpeGVzKCRlbGVtZW50KSB7XG4gICAgICB0aGlzLmFkZFByZWZpeCgkZWxlbWVudCwgJ2lkJyk7XG4gICAgICB0aGlzLmFkZFByZWZpeCgkZWxlbWVudCwgJ2NsYXNzJyk7XG4gICAgICAkZWxlbWVudC5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAgIH0sXG4gICAgYWRkUHJlZml4OiBmdW5jdGlvbiBhZGRQcmVmaXgoJGVsZW1lbnQsIGF0dHJpYnV0ZSkge1xuICAgICAgdmFyIHRvUmVwbGFjZSA9ICRlbGVtZW50LmF0dHIoYXR0cmlidXRlKTtcblxuICAgICAgaWYgKHR5cGVvZiB0b1JlcGxhY2UgPT09ICdzdHJpbmcnICYmIHRvUmVwbGFjZSAhPT0gJycgJiYgdG9SZXBsYWNlICE9PSAnc2lkci1pbm5lcicpIHtcbiAgICAgICAgJGVsZW1lbnQuYXR0cihhdHRyaWJ1dGUsIHRvUmVwbGFjZS5yZXBsYWNlKC8oW0EtWmEtejAtOV8uXFwtXSspL2csICdzaWRyLScgKyBhdHRyaWJ1dGUgKyAnLSQxJykpO1xuICAgICAgfVxuICAgIH0sXG5cblxuICAgIC8vIENoZWNrIGlmIHRyYW5zaXRpb25zIGlzIHN1cHBvcnRlZFxuICAgIHRyYW5zaXRpb25zOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgICAgICAgIHN0eWxlID0gYm9keS5zdHlsZSxcbiAgICAgICAgICBzdXBwb3J0ZWQgPSBmYWxzZSxcbiAgICAgICAgICBwcm9wZXJ0eSA9ICd0cmFuc2l0aW9uJztcblxuICAgICAgaWYgKHByb3BlcnR5IGluIHN0eWxlKSB7XG4gICAgICAgIHN1cHBvcnRlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBwcmVmaXhlcyA9IFsnbW96JywgJ3dlYmtpdCcsICdvJywgJ21zJ10sXG4gICAgICAgICAgICAgIHByZWZpeCA9IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgaSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgIHByb3BlcnR5ID0gcHJvcGVydHkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwcm9wZXJ0eS5zdWJzdHIoMSk7XG4gICAgICAgICAgc3VwcG9ydGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHByZWZpeGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIHByZWZpeCA9IHByZWZpeGVzW2ldO1xuICAgICAgICAgICAgICBpZiAocHJlZml4ICsgcHJvcGVydHkgaW4gc3R5bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSgpO1xuICAgICAgICAgIHByb3BlcnR5ID0gc3VwcG9ydGVkID8gJy0nICsgcHJlZml4LnRvTG93ZXJDYXNlKCkgKyAnLScgKyBwcm9wZXJ0eS50b0xvd2VyQ2FzZSgpIDogbnVsbDtcbiAgICAgICAgfSkoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3VwcG9ydGVkOiBzdXBwb3J0ZWQsXG4gICAgICAgIHByb3BlcnR5OiBwcm9wZXJ0eVxuICAgICAgfTtcbiAgICB9KClcbiAgfTtcblxuICB2YXIgJCQyID0galF1ZXJ5O1xuXG4gIHZhciBib2R5QW5pbWF0aW9uQ2xhc3MgPSAnc2lkci1hbmltYXRpbmcnO1xuICB2YXIgb3BlbkFjdGlvbiA9ICdvcGVuJztcbiAgdmFyIGNsb3NlQWN0aW9uID0gJ2Nsb3NlJztcbiAgdmFyIHRyYW5zaXRpb25FbmRFdmVudCA9ICd3ZWJraXRUcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kIG9UcmFuc2l0aW9uRW5kIG1zVHJhbnNpdGlvbkVuZCB0cmFuc2l0aW9uZW5kJztcbiAgdmFyIE1lbnUgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTWVudShuYW1lKSB7XG4gICAgICBiYWJlbEhlbHBlcnMuY2xhc3NDYWxsQ2hlY2sodGhpcywgTWVudSk7XG5cbiAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICB0aGlzLml0ZW0gPSAkJDIoJyMnICsgbmFtZSk7XG4gICAgICB0aGlzLm9wZW5DbGFzcyA9IG5hbWUgPT09ICdzaWRyJyA/ICdzaWRyLW9wZW4nIDogJ3NpZHItb3BlbiAnICsgbmFtZSArICctb3Blbic7XG4gICAgICB0aGlzLm1lbnVXaWR0aCA9IHRoaXMuaXRlbS5vdXRlcldpZHRoKHRydWUpO1xuICAgICAgdGhpcy5zcGVlZCA9IHRoaXMuaXRlbS5kYXRhKCdzcGVlZCcpO1xuICAgICAgdGhpcy5zaWRlID0gdGhpcy5pdGVtLmRhdGEoJ3NpZGUnKTtcbiAgICAgIHRoaXMuZGlzcGxhY2UgPSB0aGlzLml0ZW0uZGF0YSgnZGlzcGxhY2UnKTtcbiAgICAgIHRoaXMudGltaW5nID0gdGhpcy5pdGVtLmRhdGEoJ3RpbWluZycpO1xuICAgICAgdGhpcy5tZXRob2QgPSB0aGlzLml0ZW0uZGF0YSgnbWV0aG9kJyk7XG4gICAgICB0aGlzLm9uT3BlbkNhbGxiYWNrID0gdGhpcy5pdGVtLmRhdGEoJ29uT3BlbicpO1xuICAgICAgdGhpcy5vbkNsb3NlQ2FsbGJhY2sgPSB0aGlzLml0ZW0uZGF0YSgnb25DbG9zZScpO1xuICAgICAgdGhpcy5vbk9wZW5FbmRDYWxsYmFjayA9IHRoaXMuaXRlbS5kYXRhKCdvbk9wZW5FbmQnKTtcbiAgICAgIHRoaXMub25DbG9zZUVuZENhbGxiYWNrID0gdGhpcy5pdGVtLmRhdGEoJ29uQ2xvc2VFbmQnKTtcbiAgICAgIHRoaXMuYm9keSA9ICQkMih0aGlzLml0ZW0uZGF0YSgnYm9keScpKTtcbiAgICB9XG5cbiAgICBiYWJlbEhlbHBlcnMuY3JlYXRlQ2xhc3MoTWVudSwgW3tcbiAgICAgIGtleTogJ2dldEFuaW1hdGlvbicsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0QW5pbWF0aW9uKGFjdGlvbiwgZWxlbWVudCkge1xuICAgICAgICB2YXIgYW5pbWF0aW9uID0ge30sXG4gICAgICAgICAgICBwcm9wID0gdGhpcy5zaWRlO1xuXG4gICAgICAgIGlmIChhY3Rpb24gPT09ICdvcGVuJyAmJiBlbGVtZW50ID09PSAnYm9keScpIHtcbiAgICAgICAgICBhbmltYXRpb25bcHJvcF0gPSB0aGlzLm1lbnVXaWR0aCArICdweCc7XG4gICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uID09PSAnY2xvc2UnICYmIGVsZW1lbnQgPT09ICdtZW51Jykge1xuICAgICAgICAgIGFuaW1hdGlvbltwcm9wXSA9ICctJyArIHRoaXMubWVudVdpZHRoICsgJ3B4JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbmltYXRpb25bcHJvcF0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFuaW1hdGlvbjtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdwcmVwYXJlQm9keScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcHJlcGFyZUJvZHkoYWN0aW9uKSB7XG4gICAgICAgIHZhciBwcm9wID0gYWN0aW9uID09PSAnb3BlbicgPyAnaGlkZGVuJyA6ICcnO1xuXG4gICAgICAgIC8vIFByZXBhcmUgcGFnZSBpZiBjb250YWluZXIgaXMgYm9keVxuICAgICAgICBpZiAodGhpcy5ib2R5LmlzKCdib2R5JykpIHtcbiAgICAgICAgICB2YXIgJGh0bWwgPSAkJDIoJ2h0bWwnKSxcbiAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gJGh0bWwuc2Nyb2xsVG9wKCk7XG5cbiAgICAgICAgICAkaHRtbC5jc3MoJ292ZXJmbG93LXgnLCBwcm9wKS5zY3JvbGxUb3Aoc2Nyb2xsVG9wKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ29wZW5Cb2R5JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBvcGVuQm9keSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxhY2UpIHtcbiAgICAgICAgICB2YXIgdHJhbnNpdGlvbnMgPSBoZWxwZXIudHJhbnNpdGlvbnMsXG4gICAgICAgICAgICAgICRib2R5ID0gdGhpcy5ib2R5O1xuXG4gICAgICAgICAgaWYgKHRyYW5zaXRpb25zLnN1cHBvcnRlZCkge1xuICAgICAgICAgICAgJGJvZHkuY3NzKHRyYW5zaXRpb25zLnByb3BlcnR5LCB0aGlzLnNpZGUgKyAnICcgKyB0aGlzLnNwZWVkIC8gMTAwMCArICdzICcgKyB0aGlzLnRpbWluZykuY3NzKHRoaXMuc2lkZSwgMCkuY3NzKHtcbiAgICAgICAgICAgICAgd2lkdGg6ICRib2R5LndpZHRoKCksXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRib2R5LmNzcyh0aGlzLnNpZGUsIHRoaXMubWVudVdpZHRoICsgJ3B4Jyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBib2R5QW5pbWF0aW9uID0gdGhpcy5nZXRBbmltYXRpb24ob3BlbkFjdGlvbiwgJ2JvZHknKTtcblxuICAgICAgICAgICAgJGJvZHkuY3NzKHtcbiAgICAgICAgICAgICAgd2lkdGg6ICRib2R5LndpZHRoKCksXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgICAgICAgICB9KS5hbmltYXRlKGJvZHlBbmltYXRpb24sIHtcbiAgICAgICAgICAgICAgcXVldWU6IGZhbHNlLFxuICAgICAgICAgICAgICBkdXJhdGlvbjogdGhpcy5zcGVlZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnb25DbG9zZUJvZHknLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uQ2xvc2VCb2R5KCkge1xuICAgICAgICB2YXIgdHJhbnNpdGlvbnMgPSBoZWxwZXIudHJhbnNpdGlvbnMsXG4gICAgICAgICAgICByZXNldFN0eWxlcyA9IHtcbiAgICAgICAgICB3aWR0aDogJycsXG4gICAgICAgICAgcG9zaXRpb246ICcnLFxuICAgICAgICAgIHJpZ2h0OiAnJyxcbiAgICAgICAgICBsZWZ0OiAnJ1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0cmFuc2l0aW9ucy5zdXBwb3J0ZWQpIHtcbiAgICAgICAgICByZXNldFN0eWxlc1t0cmFuc2l0aW9ucy5wcm9wZXJ0eV0gPSAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYm9keS5jc3MocmVzZXRTdHlsZXMpLnVuYmluZCh0cmFuc2l0aW9uRW5kRXZlbnQpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2Nsb3NlQm9keScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY2xvc2VCb2R5KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGlmICh0aGlzLmRpc3BsYWNlKSB7XG4gICAgICAgICAgaWYgKGhlbHBlci50cmFuc2l0aW9ucy5zdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYm9keS5jc3ModGhpcy5zaWRlLCAwKS5vbmUodHJhbnNpdGlvbkVuZEV2ZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIF90aGlzLm9uQ2xvc2VCb2R5KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGJvZHlBbmltYXRpb24gPSB0aGlzLmdldEFuaW1hdGlvbihjbG9zZUFjdGlvbiwgJ2JvZHknKTtcblxuICAgICAgICAgICAgdGhpcy5ib2R5LmFuaW1hdGUoYm9keUFuaW1hdGlvbiwge1xuICAgICAgICAgICAgICBxdWV1ZTogZmFsc2UsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiB0aGlzLnNwZWVkLFxuICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMub25DbG9zZUJvZHkoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnbW92ZUJvZHknLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG1vdmVCb2R5KGFjdGlvbikge1xuICAgICAgICBpZiAoYWN0aW9uID09PSBvcGVuQWN0aW9uKSB7XG4gICAgICAgICAgdGhpcy5vcGVuQm9keSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY2xvc2VCb2R5KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdvbk9wZW5NZW51JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbk9wZW5NZW51KGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBuYW1lID0gdGhpcy5uYW1lO1xuXG4gICAgICAgIHNpZHJTdGF0dXMubW92aW5nID0gZmFsc2U7XG4gICAgICAgIHNpZHJTdGF0dXMub3BlbmVkID0gbmFtZTtcblxuICAgICAgICB0aGlzLml0ZW0udW5iaW5kKHRyYW5zaXRpb25FbmRFdmVudCk7XG5cbiAgICAgICAgdGhpcy5ib2R5LnJlbW92ZUNsYXNzKGJvZHlBbmltYXRpb25DbGFzcykuYWRkQ2xhc3ModGhpcy5vcGVuQ2xhc3MpO1xuXG4gICAgICAgIHRoaXMub25PcGVuRW5kQ2FsbGJhY2soKTtcblxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgY2FsbGJhY2sobmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdvcGVuTWVudScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gb3Blbk1lbnUoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgdmFyICRpdGVtID0gdGhpcy5pdGVtO1xuXG4gICAgICAgIGlmIChoZWxwZXIudHJhbnNpdGlvbnMuc3VwcG9ydGVkKSB7XG4gICAgICAgICAgJGl0ZW0uY3NzKHRoaXMuc2lkZSwgMCkub25lKHRyYW5zaXRpb25FbmRFdmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMyLm9uT3Blbk1lbnUoY2FsbGJhY2spO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBtZW51QW5pbWF0aW9uID0gdGhpcy5nZXRBbmltYXRpb24ob3BlbkFjdGlvbiwgJ21lbnUnKTtcblxuICAgICAgICAgICRpdGVtLmNzcygnZGlzcGxheScsICdibG9jaycpLmFuaW1hdGUobWVudUFuaW1hdGlvbiwge1xuICAgICAgICAgICAgcXVldWU6IGZhbHNlLFxuICAgICAgICAgICAgZHVyYXRpb246IHRoaXMuc3BlZWQsXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUoKSB7XG4gICAgICAgICAgICAgIF90aGlzMi5vbk9wZW5NZW51KGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ29uQ2xvc2VNZW51JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkNsb3NlTWVudShjYWxsYmFjaykge1xuICAgICAgICB0aGlzLml0ZW0uY3NzKHtcbiAgICAgICAgICBsZWZ0OiAnJyxcbiAgICAgICAgICByaWdodDogJydcbiAgICAgICAgfSkudW5iaW5kKHRyYW5zaXRpb25FbmRFdmVudCk7XG4gICAgICAgICQkMignaHRtbCcpLmNzcygnb3ZlcmZsb3cteCcsICcnKTtcblxuICAgICAgICBzaWRyU3RhdHVzLm1vdmluZyA9IGZhbHNlO1xuICAgICAgICBzaWRyU3RhdHVzLm9wZW5lZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuYm9keS5yZW1vdmVDbGFzcyhib2R5QW5pbWF0aW9uQ2xhc3MpLnJlbW92ZUNsYXNzKHRoaXMub3BlbkNsYXNzKTtcblxuICAgICAgICB0aGlzLm9uQ2xvc2VFbmRDYWxsYmFjaygpO1xuXG4gICAgICAgIC8vIENhbGxiYWNrXG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBjYWxsYmFjayhuYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2Nsb3NlTWVudScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY2xvc2VNZW51KGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5pdGVtO1xuXG4gICAgICAgIGlmIChoZWxwZXIudHJhbnNpdGlvbnMuc3VwcG9ydGVkKSB7XG4gICAgICAgICAgaXRlbS5jc3ModGhpcy5zaWRlLCAnJykub25lKHRyYW5zaXRpb25FbmRFdmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMzLm9uQ2xvc2VNZW51KGNhbGxiYWNrKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgbWVudUFuaW1hdGlvbiA9IHRoaXMuZ2V0QW5pbWF0aW9uKGNsb3NlQWN0aW9uLCAnbWVudScpO1xuXG4gICAgICAgICAgaXRlbS5hbmltYXRlKG1lbnVBbmltYXRpb24sIHtcbiAgICAgICAgICAgIHF1ZXVlOiBmYWxzZSxcbiAgICAgICAgICAgIGR1cmF0aW9uOiB0aGlzLnNwZWVkLFxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uIGNvbXBsZXRlKCkge1xuICAgICAgICAgICAgICBfdGhpczMub25DbG9zZU1lbnUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ21vdmVNZW51JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBtb3ZlTWVudShhY3Rpb24sIGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuYm9keS5hZGRDbGFzcyhib2R5QW5pbWF0aW9uQ2xhc3MpO1xuXG4gICAgICAgIGlmIChhY3Rpb24gPT09IG9wZW5BY3Rpb24pIHtcbiAgICAgICAgICB0aGlzLm9wZW5NZW51KGNhbGxiYWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNsb3NlTWVudShjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdtb3ZlJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBtb3ZlKGFjdGlvbiwgY2FsbGJhY2spIHtcbiAgICAgICAgLy8gTG9jayBzaWRyXG4gICAgICAgIHNpZHJTdGF0dXMubW92aW5nID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnByZXBhcmVCb2R5KGFjdGlvbik7XG4gICAgICAgIHRoaXMubW92ZUJvZHkoYWN0aW9uKTtcbiAgICAgICAgdGhpcy5tb3ZlTWVudShhY3Rpb24sIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdvcGVuJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBvcGVuKGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBfdGhpczQgPSB0aGlzO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIGlzIGFscmVhZHkgb3BlbmVkIG9yIG1vdmluZ1xuICAgICAgICBpZiAoc2lkclN0YXR1cy5vcGVuZWQgPT09IHRoaXMubmFtZSB8fCBzaWRyU3RhdHVzLm1vdmluZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIGFub3RoZXIgbWVudSBvcGVuZWQgY2xvc2UgZmlyc3RcbiAgICAgICAgaWYgKHNpZHJTdGF0dXMub3BlbmVkICE9PSBmYWxzZSkge1xuICAgICAgICAgIHZhciBhbHJlYWR5T3BlbmVkTWVudSA9IG5ldyBNZW51KHNpZHJTdGF0dXMub3BlbmVkKTtcblxuICAgICAgICAgIGFscmVhZHlPcGVuZWRNZW51LmNsb3NlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzNC5vcGVuKGNhbGxiYWNrKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubW92ZSgnb3BlbicsIGNhbGxiYWNrKTtcblxuICAgICAgICAvLyBvbk9wZW4gY2FsbGJhY2tcbiAgICAgICAgdGhpcy5vbk9wZW5DYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2Nsb3NlJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjbG9zZShjYWxsYmFjaykge1xuICAgICAgICAvLyBDaGVjayBpZiBpcyBhbHJlYWR5IGNsb3NlZCBvciBtb3ZpbmdcbiAgICAgICAgaWYgKHNpZHJTdGF0dXMub3BlbmVkICE9PSB0aGlzLm5hbWUgfHwgc2lkclN0YXR1cy5tb3ZpbmcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1vdmUoJ2Nsb3NlJywgY2FsbGJhY2spO1xuXG4gICAgICAgIC8vIG9uQ2xvc2UgY2FsbGJhY2tcbiAgICAgICAgdGhpcy5vbkNsb3NlQ2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICd0b2dnbGUnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHRvZ2dsZShjYWxsYmFjaykge1xuICAgICAgICBpZiAoc2lkclN0YXR1cy5vcGVuZWQgPT09IHRoaXMubmFtZSkge1xuICAgICAgICAgIHRoaXMuY2xvc2UoY2FsbGJhY2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub3BlbihjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIE1lbnU7XG4gIH0oKTtcblxuICB2YXIgJCQxID0galF1ZXJ5O1xuXG4gIGZ1bmN0aW9uIGV4ZWN1dGUoYWN0aW9uLCBuYW1lLCBjYWxsYmFjaykge1xuICAgIHZhciBzaWRyID0gbmV3IE1lbnUobmFtZSk7XG5cbiAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgY2FzZSAnb3Blbic6XG4gICAgICAgIHNpZHIub3BlbihjYWxsYmFjayk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2xvc2UnOlxuICAgICAgICBzaWRyLmNsb3NlKGNhbGxiYWNrKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0b2dnbGUnOlxuICAgICAgICBzaWRyLnRvZ2dsZShjYWxsYmFjayk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgJCQxLmVycm9yKCdNZXRob2QgJyArIGFjdGlvbiArICcgZG9lcyBub3QgZXhpc3Qgb24galF1ZXJ5LnNpZHInKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdmFyIGk7XG4gIHZhciAkID0galF1ZXJ5O1xuICB2YXIgcHVibGljTWV0aG9kcyA9IFsnb3BlbicsICdjbG9zZScsICd0b2dnbGUnXTtcbiAgdmFyIG1ldGhvZE5hbWU7XG4gIHZhciBtZXRob2RzID0ge307XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbiBnZXRNZXRob2QobWV0aG9kTmFtZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2spIHtcbiAgICAgIC8vIENoZWNrIGFyZ3VtZW50c1xuICAgICAgaWYgKHR5cGVvZiBuYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbmFtZTtcbiAgICAgICAgbmFtZSA9ICdzaWRyJztcbiAgICAgIH0gZWxzZSBpZiAoIW5hbWUpIHtcbiAgICAgICAgbmFtZSA9ICdzaWRyJztcbiAgICAgIH1cblxuICAgICAgZXhlY3V0ZShtZXRob2ROYW1lLCBuYW1lLCBjYWxsYmFjayk7XG4gICAgfTtcbiAgfTtcbiAgZm9yIChpID0gMDsgaSA8IHB1YmxpY01ldGhvZHMubGVuZ3RoOyBpKyspIHtcbiAgICBtZXRob2ROYW1lID0gcHVibGljTWV0aG9kc1tpXTtcbiAgICBtZXRob2RzW21ldGhvZE5hbWVdID0gZ2V0TWV0aG9kKG1ldGhvZE5hbWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2lkcihtZXRob2QpIHtcbiAgICBpZiAobWV0aG9kID09PSAnc3RhdHVzJykge1xuICAgICAgcmV0dXJuIHNpZHJTdGF0dXM7XG4gICAgfSBlbHNlIGlmIChtZXRob2RzW21ldGhvZF0pIHtcbiAgICAgIHJldHVybiBtZXRob2RzW21ldGhvZF0uYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbWV0aG9kID09PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiBtZXRob2QgPT09ICdzdHJpbmcnIHx8ICFtZXRob2QpIHtcbiAgICAgIHJldHVybiBtZXRob2RzLnRvZ2dsZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkLmVycm9yKCdNZXRob2QgJyArIG1ldGhvZCArICcgZG9lcyBub3QgZXhpc3Qgb24galF1ZXJ5LnNpZHInKTtcbiAgICB9XG4gIH1cblxuICB2YXIgJCQzID0galF1ZXJ5O1xuXG4gIGZ1bmN0aW9uIGZpbGxDb250ZW50KCRzaWRlTWVudSwgc2V0dGluZ3MpIHtcbiAgICAvLyBUaGUgbWVudSBjb250ZW50XG4gICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5zb3VyY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHZhciBuZXdDb250ZW50ID0gc2V0dGluZ3Muc291cmNlKG5hbWUpO1xuXG4gICAgICAkc2lkZU1lbnUuaHRtbChuZXdDb250ZW50KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzZXR0aW5ncy5zb3VyY2UgPT09ICdzdHJpbmcnICYmIGhlbHBlci5pc1VybChzZXR0aW5ncy5zb3VyY2UpKSB7XG4gICAgICAkJDMuZ2V0KHNldHRpbmdzLnNvdXJjZSwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgJHNpZGVNZW51Lmh0bWwoZGF0YSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzZXR0aW5ncy5zb3VyY2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICB2YXIgaHRtbENvbnRlbnQgPSAnJyxcbiAgICAgICAgICBzZWxlY3RvcnMgPSBzZXR0aW5ncy5zb3VyY2Uuc3BsaXQoJywnKTtcblxuICAgICAgJCQzLmVhY2goc2VsZWN0b3JzLCBmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgaHRtbENvbnRlbnQgKz0gJzxkaXYgY2xhc3M9XCJzaWRyLWlubmVyXCI+JyArICQkMyhlbGVtZW50KS5odG1sKCkgKyAnPC9kaXY+JztcbiAgICAgIH0pO1xuXG4gICAgICAvLyBSZW5hbWluZyBpZHMgYW5kIGNsYXNzZXNcbiAgICAgIGlmIChzZXR0aW5ncy5yZW5hbWluZykge1xuICAgICAgICB2YXIgJGh0bWxDb250ZW50ID0gJCQzKCc8ZGl2IC8+JykuaHRtbChodG1sQ29udGVudCk7XG5cbiAgICAgICAgJGh0bWxDb250ZW50LmZpbmQoJyonKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xuICAgICAgICAgIHZhciAkZWxlbWVudCA9ICQkMyhlbGVtZW50KTtcblxuICAgICAgICAgIGhlbHBlci5hZGRQcmVmaXhlcygkZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICBodG1sQ29udGVudCA9ICRodG1sQ29udGVudC5odG1sKCk7XG4gICAgICB9XG5cbiAgICAgICRzaWRlTWVudS5odG1sKGh0bWxDb250ZW50KTtcbiAgICB9IGVsc2UgaWYgKHNldHRpbmdzLnNvdXJjZSAhPT0gbnVsbCkge1xuICAgICAgJCQzLmVycm9yKCdJbnZhbGlkIFNpZHIgU291cmNlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuICRzaWRlTWVudTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZuU2lkcihvcHRpb25zKSB7XG4gICAgdmFyIHRyYW5zaXRpb25zID0gaGVscGVyLnRyYW5zaXRpb25zLFxuICAgICAgICBzZXR0aW5ncyA9ICQkMy5leHRlbmQoe1xuICAgICAgbmFtZTogJ3NpZHInLCAvLyBOYW1lIGZvciB0aGUgJ3NpZHInXG4gICAgICBzcGVlZDogMjAwLCAvLyBBY2NlcHRzIHN0YW5kYXJkIGpRdWVyeSBlZmZlY3RzIHNwZWVkcyAoaS5lLiBmYXN0LCBub3JtYWwgb3IgbWlsbGlzZWNvbmRzKVxuICAgICAgc2lkZTogJ2xlZnQnLCAvLyBBY2NlcHRzICdsZWZ0JyBvciAncmlnaHQnXG4gICAgICBzb3VyY2U6IG51bGwsIC8vIE92ZXJyaWRlIHRoZSBzb3VyY2Ugb2YgdGhlIGNvbnRlbnQuXG4gICAgICByZW5hbWluZzogdHJ1ZSwgLy8gVGhlIGlkcyBhbmQgY2xhc3NlcyB3aWxsIGJlIHByZXBlbmRlZCB3aXRoIGEgcHJlZml4IHdoZW4gbG9hZGluZyBleGlzdGVudCBjb250ZW50XG4gICAgICBib2R5OiAnYm9keScsIC8vIFBhZ2UgY29udGFpbmVyIHNlbGVjdG9yLFxuICAgICAgZGlzcGxhY2U6IHRydWUsIC8vIERpc3BsYWNlIHRoZSBib2R5IGNvbnRlbnQgb3Igbm90XG4gICAgICB0aW1pbmc6ICdlYXNlJywgLy8gVGltaW5nIGZ1bmN0aW9uIGZvciBDU1MgdHJhbnNpdGlvbnNcbiAgICAgIG1ldGhvZDogJ3RvZ2dsZScsIC8vIFRoZSBtZXRob2QgdG8gY2FsbCB3aGVuIGVsZW1lbnQgaXMgY2xpY2tlZFxuICAgICAgYmluZDogJ3RvdWNoc3RhcnQgY2xpY2snLCAvLyBUaGUgZXZlbnQocykgdG8gdHJpZ2dlciB0aGUgbWVudVxuICAgICAgb25PcGVuOiBmdW5jdGlvbiBvbk9wZW4oKSB7fSxcbiAgICAgIC8vIENhbGxiYWNrIHdoZW4gc2lkciBzdGFydCBvcGVuaW5nXG4gICAgICBvbkNsb3NlOiBmdW5jdGlvbiBvbkNsb3NlKCkge30sXG4gICAgICAvLyBDYWxsYmFjayB3aGVuIHNpZHIgc3RhcnQgY2xvc2luZ1xuICAgICAgb25PcGVuRW5kOiBmdW5jdGlvbiBvbk9wZW5FbmQoKSB7fSxcbiAgICAgIC8vIENhbGxiYWNrIHdoZW4gc2lkciBlbmQgb3BlbmluZ1xuICAgICAgb25DbG9zZUVuZDogZnVuY3Rpb24gb25DbG9zZUVuZCgpIHt9IC8vIENhbGxiYWNrIHdoZW4gc2lkciBlbmQgY2xvc2luZ1xuXG4gICAgfSwgb3B0aW9ucyksXG4gICAgICAgIG5hbWUgPSBzZXR0aW5ncy5uYW1lLFxuICAgICAgICAkc2lkZU1lbnUgPSAkJDMoJyMnICsgbmFtZSk7XG5cbiAgICAvLyBJZiB0aGUgc2lkZSBtZW51IGRvIG5vdCBleGlzdCBjcmVhdGUgaXRcbiAgICBpZiAoJHNpZGVNZW51Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgJHNpZGVNZW51ID0gJCQzKCc8ZGl2IC8+JykuYXR0cignaWQnLCBuYW1lKS5hcHBlbmRUbygkJDMoJ2JvZHknKSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHRyYW5zaXRpb24gdG8gbWVudSBpZiBhcmUgc3VwcG9ydGVkXG4gICAgaWYgKHRyYW5zaXRpb25zLnN1cHBvcnRlZCkge1xuICAgICAgJHNpZGVNZW51LmNzcyh0cmFuc2l0aW9ucy5wcm9wZXJ0eSwgc2V0dGluZ3Muc2lkZSArICcgJyArIHNldHRpbmdzLnNwZWVkIC8gMTAwMCArICdzICcgKyBzZXR0aW5ncy50aW1pbmcpO1xuICAgIH1cblxuICAgIC8vIEFkZGluZyBzdHlsZXMgYW5kIG9wdGlvbnNcbiAgICAkc2lkZU1lbnUuYWRkQ2xhc3MoJ3NpZHInKS5hZGRDbGFzcyhzZXR0aW5ncy5zaWRlKS5kYXRhKHtcbiAgICAgIHNwZWVkOiBzZXR0aW5ncy5zcGVlZCxcbiAgICAgIHNpZGU6IHNldHRpbmdzLnNpZGUsXG4gICAgICBib2R5OiBzZXR0aW5ncy5ib2R5LFxuICAgICAgZGlzcGxhY2U6IHNldHRpbmdzLmRpc3BsYWNlLFxuICAgICAgdGltaW5nOiBzZXR0aW5ncy50aW1pbmcsXG4gICAgICBtZXRob2Q6IHNldHRpbmdzLm1ldGhvZCxcbiAgICAgIG9uT3Blbjogc2V0dGluZ3Mub25PcGVuLFxuICAgICAgb25DbG9zZTogc2V0dGluZ3Mub25DbG9zZSxcbiAgICAgIG9uT3BlbkVuZDogc2V0dGluZ3Mub25PcGVuRW5kLFxuICAgICAgb25DbG9zZUVuZDogc2V0dGluZ3Mub25DbG9zZUVuZFxuICAgIH0pO1xuXG4gICAgJHNpZGVNZW51ID0gZmlsbENvbnRlbnQoJHNpZGVNZW51LCBzZXR0aW5ncyk7XG5cbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQkMyh0aGlzKSxcbiAgICAgICAgICBkYXRhID0gJHRoaXMuZGF0YSgnc2lkcicpLFxuICAgICAgICAgIGZsYWcgPSBmYWxzZTtcblxuICAgICAgLy8gSWYgdGhlIHBsdWdpbiBoYXNuJ3QgYmVlbiBpbml0aWFsaXplZCB5ZXRcbiAgICAgIGlmICghZGF0YSkge1xuICAgICAgICBzaWRyU3RhdHVzLm1vdmluZyA9IGZhbHNlO1xuICAgICAgICBzaWRyU3RhdHVzLm9wZW5lZCA9IGZhbHNlO1xuXG4gICAgICAgICR0aGlzLmRhdGEoJ3NpZHInLCBuYW1lKTtcblxuICAgICAgICAkdGhpcy5iaW5kKHNldHRpbmdzLmJpbmQsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICBpZiAoIWZsYWcpIHtcbiAgICAgICAgICAgIGZsYWcgPSB0cnVlO1xuICAgICAgICAgICAgc2lkcihzZXR0aW5ncy5tZXRob2QsIG5hbWUpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgZmxhZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgalF1ZXJ5LnNpZHIgPSBzaWRyO1xuICBqUXVlcnkuZm4uc2lkciA9IGZuU2lkcjtcblxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG4gIHZhciBBamF4TW9uaXRvciwgQmFyLCBEb2N1bWVudE1vbml0b3IsIEVsZW1lbnRNb25pdG9yLCBFbGVtZW50VHJhY2tlciwgRXZlbnRMYWdNb25pdG9yLCBFdmVudGVkLCBFdmVudHMsIE5vVGFyZ2V0RXJyb3IsIFBhY2UsIFJlcXVlc3RJbnRlcmNlcHQsIFNPVVJDRV9LRVlTLCBTY2FsZXIsIFNvY2tldFJlcXVlc3RUcmFja2VyLCBYSFJSZXF1ZXN0VHJhY2tlciwgYW5pbWF0aW9uLCBhdmdBbXBsaXR1ZGUsIGJhciwgY2FuY2VsQW5pbWF0aW9uLCBjYW5jZWxBbmltYXRpb25GcmFtZSwgZGVmYXVsdE9wdGlvbnMsIGV4dGVuZCwgZXh0ZW5kTmF0aXZlLCBnZXRGcm9tRE9NLCBnZXRJbnRlcmNlcHQsIGhhbmRsZVB1c2hTdGF0ZSwgaWdub3JlU3RhY2ssIGluaXQsIG5vdywgb3B0aW9ucywgcmVxdWVzdEFuaW1hdGlvbkZyYW1lLCByZXN1bHQsIHJ1bkFuaW1hdGlvbiwgc2NhbGVycywgc2hvdWxkSWdub3JlVVJMLCBzaG91bGRUcmFjaywgc291cmNlLCBzb3VyY2VzLCB1bmlTY2FsZXIsIF9XZWJTb2NrZXQsIF9YRG9tYWluUmVxdWVzdCwgX1hNTEh0dHBSZXF1ZXN0LCBfaSwgX2ludGVyY2VwdCwgX2xlbiwgX3B1c2hTdGF0ZSwgX3JlZiwgX3JlZjEsIF9yZXBsYWNlU3RhdGUsXG4gICAgX19zbGljZSA9IFtdLnNsaWNlLFxuICAgIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICAgIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICAgIF9faW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xuXG4gIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGNhdGNodXBUaW1lOiAxMDAsXG4gICAgaW5pdGlhbFJhdGU6IC4wMyxcbiAgICBtaW5UaW1lOiAyNTAsXG4gICAgZ2hvc3RUaW1lOiAxMDAsXG4gICAgbWF4UHJvZ3Jlc3NQZXJGcmFtZTogMjAsXG4gICAgZWFzZUZhY3RvcjogMS4yNSxcbiAgICBzdGFydE9uUGFnZUxvYWQ6IHRydWUsXG4gICAgcmVzdGFydE9uUHVzaFN0YXRlOiB0cnVlLFxuICAgIHJlc3RhcnRPblJlcXVlc3RBZnRlcjogNTAwLFxuICAgIHRhcmdldDogJ2JvZHknLFxuICAgIGVsZW1lbnRzOiB7XG4gICAgICBjaGVja0ludGVydmFsOiAxMDAsXG4gICAgICBzZWxlY3RvcnM6IFsnYm9keSddXG4gICAgfSxcbiAgICBldmVudExhZzoge1xuICAgICAgbWluU2FtcGxlczogMTAsXG4gICAgICBzYW1wbGVDb3VudDogMyxcbiAgICAgIGxhZ1RocmVzaG9sZDogM1xuICAgIH0sXG4gICAgYWpheDoge1xuICAgICAgdHJhY2tNZXRob2RzOiBbJ0dFVCddLFxuICAgICAgdHJhY2tXZWJTb2NrZXRzOiB0cnVlLFxuICAgICAgaWdub3JlVVJMczogW11cbiAgICB9XG4gIH07XG5cbiAgbm93ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9yZWY7XG4gICAgcmV0dXJuIChfcmVmID0gdHlwZW9mIHBlcmZvcm1hbmNlICE9PSBcInVuZGVmaW5lZFwiICYmIHBlcmZvcm1hbmNlICE9PSBudWxsID8gdHlwZW9mIHBlcmZvcm1hbmNlLm5vdyA9PT0gXCJmdW5jdGlvblwiID8gcGVyZm9ybWFuY2Uubm93KCkgOiB2b2lkIDAgOiB2b2lkIDApICE9IG51bGwgPyBfcmVmIDogKyhuZXcgRGF0ZSk7XG4gIH07XG5cbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXG4gIGNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tb3pDYW5jZWxBbmltYXRpb25GcmFtZTtcblxuICBpZiAocmVxdWVzdEFuaW1hdGlvbkZyYW1lID09IG51bGwpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihmbikge1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZm4sIDUwKTtcbiAgICB9O1xuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgIHJldHVybiBjbGVhclRpbWVvdXQoaWQpO1xuICAgIH07XG4gIH1cblxuICBydW5BbmltYXRpb24gPSBmdW5jdGlvbihmbikge1xuICAgIHZhciBsYXN0LCB0aWNrO1xuICAgIGxhc3QgPSBub3coKTtcbiAgICB0aWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZGlmZjtcbiAgICAgIGRpZmYgPSBub3coKSAtIGxhc3Q7XG4gICAgICBpZiAoZGlmZiA+PSAzMykge1xuICAgICAgICBsYXN0ID0gbm93KCk7XG4gICAgICAgIHJldHVybiBmbihkaWZmLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KHRpY2ssIDMzIC0gZGlmZik7XG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gdGljaygpO1xuICB9O1xuXG4gIHJlc3VsdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzLCBrZXksIG9iajtcbiAgICBvYmogPSBhcmd1bWVudHNbMF0sIGtleSA9IGFyZ3VtZW50c1sxXSwgYXJncyA9IDMgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpIDogW107XG4gICAgaWYgKHR5cGVvZiBvYmpba2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIG9ialtrZXldLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvYmpba2V5XTtcbiAgICB9XG4gIH07XG5cbiAgZXh0ZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGtleSwgb3V0LCBzb3VyY2UsIHNvdXJjZXMsIHZhbCwgX2ksIF9sZW47XG4gICAgb3V0ID0gYXJndW1lbnRzWzBdLCBzb3VyY2VzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICBmb3IgKF9pID0gMCwgX2xlbiA9IHNvdXJjZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIHNvdXJjZSA9IHNvdXJjZXNbX2ldO1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICBpZiAoIV9faGFzUHJvcC5jYWxsKHNvdXJjZSwga2V5KSkgY29udGludWU7XG4gICAgICAgICAgdmFsID0gc291cmNlW2tleV07XG4gICAgICAgICAgaWYgKChvdXRba2V5XSAhPSBudWxsKSAmJiB0eXBlb2Ygb3V0W2tleV0gPT09ICdvYmplY3QnICYmICh2YWwgIT0gbnVsbCkgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGV4dGVuZChvdXRba2V5XSwgdmFsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0W2tleV0gPSB2YWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH07XG5cbiAgYXZnQW1wbGl0dWRlID0gZnVuY3Rpb24oYXJyKSB7XG4gICAgdmFyIGNvdW50LCBzdW0sIHYsIF9pLCBfbGVuO1xuICAgIHN1bSA9IGNvdW50ID0gMDtcbiAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGFyci5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgdiA9IGFycltfaV07XG4gICAgICBzdW0gKz0gTWF0aC5hYnModik7XG4gICAgICBjb3VudCsrO1xuICAgIH1cbiAgICByZXR1cm4gc3VtIC8gY291bnQ7XG4gIH07XG5cbiAgZ2V0RnJvbURPTSA9IGZ1bmN0aW9uKGtleSwganNvbikge1xuICAgIHZhciBkYXRhLCBlLCBlbDtcbiAgICBpZiAoa2V5ID09IG51bGwpIHtcbiAgICAgIGtleSA9ICdvcHRpb25zJztcbiAgICB9XG4gICAgaWYgKGpzb24gPT0gbnVsbCkge1xuICAgICAganNvbiA9IHRydWU7XG4gICAgfVxuICAgIGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLXBhY2UtXCIgKyBrZXkgKyBcIl1cIik7XG4gICAgaWYgKCFlbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkYXRhID0gZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1wYWNlLVwiICsga2V5KTtcbiAgICBpZiAoIWpzb24pIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XG4gICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICBlID0gX2Vycm9yO1xuICAgICAgcmV0dXJuIHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnNvbGUgIT09IG51bGwgPyBjb25zb2xlLmVycm9yKFwiRXJyb3IgcGFyc2luZyBpbmxpbmUgcGFjZSBvcHRpb25zXCIsIGUpIDogdm9pZCAwO1xuICAgIH1cbiAgfTtcblxuICBFdmVudGVkID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEV2ZW50ZWQoKSB7fVxuXG4gICAgRXZlbnRlZC5wcm90b3R5cGUub24gPSBmdW5jdGlvbihldmVudCwgaGFuZGxlciwgY3R4LCBvbmNlKSB7XG4gICAgICB2YXIgX2Jhc2U7XG4gICAgICBpZiAob25jZSA9PSBudWxsKSB7XG4gICAgICAgIG9uY2UgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmJpbmRpbmdzID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5iaW5kaW5ncyA9IHt9O1xuICAgICAgfVxuICAgICAgaWYgKChfYmFzZSA9IHRoaXMuYmluZGluZ3MpW2V2ZW50XSA9PSBudWxsKSB7XG4gICAgICAgIF9iYXNlW2V2ZW50XSA9IFtdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuYmluZGluZ3NbZXZlbnRdLnB1c2goe1xuICAgICAgICBoYW5kbGVyOiBoYW5kbGVyLFxuICAgICAgICBjdHg6IGN0eCxcbiAgICAgICAgb25jZTogb25jZVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIEV2ZW50ZWQucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgaGFuZGxlciwgY3R4KSB7XG4gICAgICByZXR1cm4gdGhpcy5vbihldmVudCwgaGFuZGxlciwgY3R4LCB0cnVlKTtcbiAgICB9O1xuXG4gICAgRXZlbnRlZC5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24oZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgIHZhciBpLCBfcmVmLCBfcmVzdWx0cztcbiAgICAgIGlmICgoKF9yZWYgPSB0aGlzLmJpbmRpbmdzKSAhPSBudWxsID8gX3JlZltldmVudF0gOiB2b2lkIDApID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGhhbmRsZXIgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZGVsZXRlIHRoaXMuYmluZGluZ3NbZXZlbnRdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5iaW5kaW5nc1tldmVudF0ubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKHRoaXMuYmluZGluZ3NbZXZlbnRdW2ldLmhhbmRsZXIgPT09IGhhbmRsZXIpIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godGhpcy5iaW5kaW5nc1tldmVudF0uc3BsaWNlKGksIDEpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChpKyspO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEV2ZW50ZWQucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzLCBjdHgsIGV2ZW50LCBoYW5kbGVyLCBpLCBvbmNlLCBfcmVmLCBfcmVmMSwgX3Jlc3VsdHM7XG4gICAgICBldmVudCA9IGFyZ3VtZW50c1swXSwgYXJncyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgICBpZiAoKF9yZWYgPSB0aGlzLmJpbmRpbmdzKSAhPSBudWxsID8gX3JlZltldmVudF0gOiB2b2lkIDApIHtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5iaW5kaW5nc1tldmVudF0ubGVuZ3RoKSB7XG4gICAgICAgICAgX3JlZjEgPSB0aGlzLmJpbmRpbmdzW2V2ZW50XVtpXSwgaGFuZGxlciA9IF9yZWYxLmhhbmRsZXIsIGN0eCA9IF9yZWYxLmN0eCwgb25jZSA9IF9yZWYxLm9uY2U7XG4gICAgICAgICAgaGFuZGxlci5hcHBseShjdHggIT0gbnVsbCA/IGN0eCA6IHRoaXMsIGFyZ3MpO1xuICAgICAgICAgIGlmIChvbmNlKSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHRoaXMuYmluZGluZ3NbZXZlbnRdLnNwbGljZShpLCAxKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goaSsrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gRXZlbnRlZDtcblxuICB9KSgpO1xuXG4gIFBhY2UgPSB3aW5kb3cuUGFjZSB8fCB7fTtcblxuICB3aW5kb3cuUGFjZSA9IFBhY2U7XG5cbiAgZXh0ZW5kKFBhY2UsIEV2ZW50ZWQucHJvdG90eXBlKTtcblxuICBvcHRpb25zID0gUGFjZS5vcHRpb25zID0gZXh0ZW5kKHt9LCBkZWZhdWx0T3B0aW9ucywgd2luZG93LnBhY2VPcHRpb25zLCBnZXRGcm9tRE9NKCkpO1xuXG4gIF9yZWYgPSBbJ2FqYXgnLCAnZG9jdW1lbnQnLCAnZXZlbnRMYWcnLCAnZWxlbWVudHMnXTtcbiAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgc291cmNlID0gX3JlZltfaV07XG4gICAgaWYgKG9wdGlvbnNbc291cmNlXSA9PT0gdHJ1ZSkge1xuICAgICAgb3B0aW9uc1tzb3VyY2VdID0gZGVmYXVsdE9wdGlvbnNbc291cmNlXTtcbiAgICB9XG4gIH1cblxuICBOb1RhcmdldEVycm9yID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhOb1RhcmdldEVycm9yLCBfc3VwZXIpO1xuXG4gICAgZnVuY3Rpb24gTm9UYXJnZXRFcnJvcigpIHtcbiAgICAgIF9yZWYxID0gTm9UYXJnZXRFcnJvci5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBfcmVmMTtcbiAgICB9XG5cbiAgICByZXR1cm4gTm9UYXJnZXRFcnJvcjtcblxuICB9KShFcnJvcik7XG5cbiAgQmFyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEJhcigpIHtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICAgIH1cblxuICAgIEJhci5wcm90b3R5cGUuZ2V0RWxlbWVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHRhcmdldEVsZW1lbnQ7XG4gICAgICBpZiAodGhpcy5lbCA9PSBudWxsKSB7XG4gICAgICAgIHRhcmdldEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG9wdGlvbnMudGFyZ2V0KTtcbiAgICAgICAgaWYgKCF0YXJnZXRFbGVtZW50KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE5vVGFyZ2V0RXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmVsLmNsYXNzTmFtZSA9IFwicGFjZSBwYWNlLWFjdGl2ZVwiO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lLnJlcGxhY2UoL3BhY2UtZG9uZS9nLCAnJyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lICs9ICcgcGFjZS1ydW5uaW5nJztcbiAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cInBhY2UtcHJvZ3Jlc3NcIj5cXG4gIDxkaXYgY2xhc3M9XCJwYWNlLXByb2dyZXNzLWlubmVyXCI+PC9kaXY+XFxuPC9kaXY+XFxuPGRpdiBjbGFzcz1cInBhY2UtYWN0aXZpdHlcIj48L2Rpdj4nO1xuICAgICAgICBpZiAodGFyZ2V0RWxlbWVudC5maXJzdENoaWxkICE9IG51bGwpIHtcbiAgICAgICAgICB0YXJnZXRFbGVtZW50Lmluc2VydEJlZm9yZSh0aGlzLmVsLCB0YXJnZXRFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5lbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmVsO1xuICAgIH07XG5cbiAgICBCYXIucHJvdG90eXBlLmZpbmlzaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGVsO1xuICAgICAgZWwgPSB0aGlzLmdldEVsZW1lbnQoKTtcbiAgICAgIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKCdwYWNlLWFjdGl2ZScsICcnKTtcbiAgICAgIGVsLmNsYXNzTmFtZSArPSAnIHBhY2UtaW5hY3RpdmUnO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZS5yZXBsYWNlKCdwYWNlLXJ1bm5pbmcnLCAnJyk7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgKz0gJyBwYWNlLWRvbmUnO1xuICAgIH07XG5cbiAgICBCYXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKHByb2cpIHtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSBwcm9nO1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKCk7XG4gICAgfTtcblxuICAgIEJhci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5nZXRFbGVtZW50KCkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmdldEVsZW1lbnQoKSk7XG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICAgICAgTm9UYXJnZXRFcnJvciA9IF9lcnJvcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmVsID0gdm9pZCAwO1xuICAgIH07XG5cbiAgICBCYXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGVsLCBrZXksIHByb2dyZXNzU3RyLCB0cmFuc2Zvcm0sIF9qLCBfbGVuMSwgX3JlZjI7XG4gICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLnRhcmdldCkgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBlbCA9IHRoaXMuZ2V0RWxlbWVudCgpO1xuICAgICAgdHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUzZChcIiArIHRoaXMucHJvZ3Jlc3MgKyBcIiUsIDAsIDApXCI7XG4gICAgICBfcmVmMiA9IFsnd2Via2l0VHJhbnNmb3JtJywgJ21zVHJhbnNmb3JtJywgJ3RyYW5zZm9ybSddO1xuICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgIGtleSA9IF9yZWYyW19qXTtcbiAgICAgICAgZWwuY2hpbGRyZW5bMF0uc3R5bGVba2V5XSA9IHRyYW5zZm9ybTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5sYXN0UmVuZGVyZWRQcm9ncmVzcyB8fCB0aGlzLmxhc3RSZW5kZXJlZFByb2dyZXNzIHwgMCAhPT0gdGhpcy5wcm9ncmVzcyB8IDApIHtcbiAgICAgICAgZWwuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKCdkYXRhLXByb2dyZXNzLXRleHQnLCBcIlwiICsgKHRoaXMucHJvZ3Jlc3MgfCAwKSArIFwiJVwiKTtcbiAgICAgICAgaWYgKHRoaXMucHJvZ3Jlc3MgPj0gMTAwKSB7XG4gICAgICAgICAgcHJvZ3Jlc3NTdHIgPSAnOTknO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb2dyZXNzU3RyID0gdGhpcy5wcm9ncmVzcyA8IDEwID8gXCIwXCIgOiBcIlwiO1xuICAgICAgICAgIHByb2dyZXNzU3RyICs9IHRoaXMucHJvZ3Jlc3MgfCAwO1xuICAgICAgICB9XG4gICAgICAgIGVsLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZSgnZGF0YS1wcm9ncmVzcycsIFwiXCIgKyBwcm9ncmVzc1N0cik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5sYXN0UmVuZGVyZWRQcm9ncmVzcyA9IHRoaXMucHJvZ3Jlc3M7XG4gICAgfTtcblxuICAgIEJhci5wcm90b3R5cGUuZG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvZ3Jlc3MgPj0gMTAwO1xuICAgIH07XG5cbiAgICByZXR1cm4gQmFyO1xuXG4gIH0pKCk7XG5cbiAgRXZlbnRzID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEV2ZW50cygpIHtcbiAgICAgIHRoaXMuYmluZGluZ3MgPSB7fTtcbiAgICB9XG5cbiAgICBFdmVudHMucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbihuYW1lLCB2YWwpIHtcbiAgICAgIHZhciBiaW5kaW5nLCBfaiwgX2xlbjEsIF9yZWYyLCBfcmVzdWx0cztcbiAgICAgIGlmICh0aGlzLmJpbmRpbmdzW25hbWVdICE9IG51bGwpIHtcbiAgICAgICAgX3JlZjIgPSB0aGlzLmJpbmRpbmdzW25hbWVdO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgICBiaW5kaW5nID0gX3JlZjJbX2pdO1xuICAgICAgICAgIF9yZXN1bHRzLnB1c2goYmluZGluZy5jYWxsKHRoaXMsIHZhbCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgRXZlbnRzLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKG5hbWUsIGZuKSB7XG4gICAgICB2YXIgX2Jhc2U7XG4gICAgICBpZiAoKF9iYXNlID0gdGhpcy5iaW5kaW5ncylbbmFtZV0gPT0gbnVsbCkge1xuICAgICAgICBfYmFzZVtuYW1lXSA9IFtdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuYmluZGluZ3NbbmFtZV0ucHVzaChmbik7XG4gICAgfTtcblxuICAgIHJldHVybiBFdmVudHM7XG5cbiAgfSkoKTtcblxuICBfWE1MSHR0cFJlcXVlc3QgPSB3aW5kb3cuWE1MSHR0cFJlcXVlc3Q7XG5cbiAgX1hEb21haW5SZXF1ZXN0ID0gd2luZG93LlhEb21haW5SZXF1ZXN0O1xuXG4gIF9XZWJTb2NrZXQgPSB3aW5kb3cuV2ViU29ja2V0O1xuXG4gIGV4dGVuZE5hdGl2ZSA9IGZ1bmN0aW9uKHRvLCBmcm9tKSB7XG4gICAgdmFyIGUsIGtleSwgX3Jlc3VsdHM7XG4gICAgX3Jlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGtleSBpbiBmcm9tLnByb3RvdHlwZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCh0b1trZXldID09IG51bGwpICYmIHR5cGVvZiBmcm9tW2tleV0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChPYmplY3QuZGVmaW5lUHJvcGVydHkodG8sIGtleSwge1xuICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmcm9tLnByb3RvdHlwZVtrZXldO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaCh0b1trZXldID0gZnJvbS5wcm90b3R5cGVba2V5XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9yZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICAgIGUgPSBfZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBfcmVzdWx0cztcbiAgfTtcblxuICBpZ25vcmVTdGFjayA9IFtdO1xuXG4gIFBhY2UuaWdub3JlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MsIGZuLCByZXQ7XG4gICAgZm4gPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgIGlnbm9yZVN0YWNrLnVuc2hpZnQoJ2lnbm9yZScpO1xuICAgIHJldCA9IGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIGlnbm9yZVN0YWNrLnNoaWZ0KCk7XG4gICAgcmV0dXJuIHJldDtcbiAgfTtcblxuICBQYWNlLnRyYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MsIGZuLCByZXQ7XG4gICAgZm4gPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgIGlnbm9yZVN0YWNrLnVuc2hpZnQoJ3RyYWNrJyk7XG4gICAgcmV0ID0gZm4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgaWdub3JlU3RhY2suc2hpZnQoKTtcbiAgICByZXR1cm4gcmV0O1xuICB9O1xuXG4gIHNob3VsZFRyYWNrID0gZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgdmFyIF9yZWYyO1xuICAgIGlmIChtZXRob2QgPT0gbnVsbCkge1xuICAgICAgbWV0aG9kID0gJ0dFVCc7XG4gICAgfVxuICAgIGlmIChpZ25vcmVTdGFja1swXSA9PT0gJ3RyYWNrJykge1xuICAgICAgcmV0dXJuICdmb3JjZSc7XG4gICAgfVxuICAgIGlmICghaWdub3JlU3RhY2subGVuZ3RoICYmIG9wdGlvbnMuYWpheCkge1xuICAgICAgaWYgKG1ldGhvZCA9PT0gJ3NvY2tldCcgJiYgb3B0aW9ucy5hamF4LnRyYWNrV2ViU29ja2V0cykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoX3JlZjIgPSBtZXRob2QudG9VcHBlckNhc2UoKSwgX19pbmRleE9mLmNhbGwob3B0aW9ucy5hamF4LnRyYWNrTWV0aG9kcywgX3JlZjIpID49IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBSZXF1ZXN0SW50ZXJjZXB0ID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhSZXF1ZXN0SW50ZXJjZXB0LCBfc3VwZXIpO1xuXG4gICAgZnVuY3Rpb24gUmVxdWVzdEludGVyY2VwdCgpIHtcbiAgICAgIHZhciBtb25pdG9yWEhSLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG4gICAgICBSZXF1ZXN0SW50ZXJjZXB0Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgbW9uaXRvclhIUiA9IGZ1bmN0aW9uKHJlcSkge1xuICAgICAgICB2YXIgX29wZW47XG4gICAgICAgIF9vcGVuID0gcmVxLm9wZW47XG4gICAgICAgIHJldHVybiByZXEub3BlbiA9IGZ1bmN0aW9uKHR5cGUsIHVybCwgYXN5bmMpIHtcbiAgICAgICAgICBpZiAoc2hvdWxkVHJhY2sodHlwZSkpIHtcbiAgICAgICAgICAgIF90aGlzLnRyaWdnZXIoJ3JlcXVlc3QnLCB7XG4gICAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICByZXF1ZXN0OiByZXFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX29wZW4uYXBwbHkocmVxLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgfTtcbiAgICAgIHdpbmRvdy5YTUxIdHRwUmVxdWVzdCA9IGZ1bmN0aW9uKGZsYWdzKSB7XG4gICAgICAgIHZhciByZXE7XG4gICAgICAgIHJlcSA9IG5ldyBfWE1MSHR0cFJlcXVlc3QoZmxhZ3MpO1xuICAgICAgICBtb25pdG9yWEhSKHJlcSk7XG4gICAgICAgIHJldHVybiByZXE7XG4gICAgICB9O1xuICAgICAgdHJ5IHtcbiAgICAgICAgZXh0ZW5kTmF0aXZlKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCwgX1hNTEh0dHBSZXF1ZXN0KTtcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge31cbiAgICAgIGlmIChfWERvbWFpblJlcXVlc3QgIT0gbnVsbCkge1xuICAgICAgICB3aW5kb3cuWERvbWFpblJlcXVlc3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgcmVxO1xuICAgICAgICAgIHJlcSA9IG5ldyBfWERvbWFpblJlcXVlc3Q7XG4gICAgICAgICAgbW9uaXRvclhIUihyZXEpO1xuICAgICAgICAgIHJldHVybiByZXE7XG4gICAgICAgIH07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZXh0ZW5kTmF0aXZlKHdpbmRvdy5YRG9tYWluUmVxdWVzdCwgX1hEb21haW5SZXF1ZXN0KTtcbiAgICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7fVxuICAgICAgfVxuICAgICAgaWYgKChfV2ViU29ja2V0ICE9IG51bGwpICYmIG9wdGlvbnMuYWpheC50cmFja1dlYlNvY2tldHMpIHtcbiAgICAgICAgd2luZG93LldlYlNvY2tldCA9IGZ1bmN0aW9uKHVybCwgcHJvdG9jb2xzKSB7XG4gICAgICAgICAgdmFyIHJlcTtcbiAgICAgICAgICBpZiAocHJvdG9jb2xzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJlcSA9IG5ldyBfV2ViU29ja2V0KHVybCwgcHJvdG9jb2xzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVxID0gbmV3IF9XZWJTb2NrZXQodXJsKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHNob3VsZFRyYWNrKCdzb2NrZXQnKSkge1xuICAgICAgICAgICAgX3RoaXMudHJpZ2dlcigncmVxdWVzdCcsIHtcbiAgICAgICAgICAgICAgdHlwZTogJ3NvY2tldCcsXG4gICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICBwcm90b2NvbHM6IHByb3RvY29scyxcbiAgICAgICAgICAgICAgcmVxdWVzdDogcmVxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlcTtcbiAgICAgICAgfTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBleHRlbmROYXRpdmUod2luZG93LldlYlNvY2tldCwgX1dlYlNvY2tldCk7XG4gICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge31cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUmVxdWVzdEludGVyY2VwdDtcblxuICB9KShFdmVudHMpO1xuXG4gIF9pbnRlcmNlcHQgPSBudWxsO1xuXG4gIGdldEludGVyY2VwdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChfaW50ZXJjZXB0ID09IG51bGwpIHtcbiAgICAgIF9pbnRlcmNlcHQgPSBuZXcgUmVxdWVzdEludGVyY2VwdDtcbiAgICB9XG4gICAgcmV0dXJuIF9pbnRlcmNlcHQ7XG4gIH07XG5cbiAgc2hvdWxkSWdub3JlVVJMID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIHBhdHRlcm4sIF9qLCBfbGVuMSwgX3JlZjI7XG4gICAgX3JlZjIgPSBvcHRpb25zLmFqYXguaWdub3JlVVJMcztcbiAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgIHBhdHRlcm4gPSBfcmVmMltfal07XG4gICAgICBpZiAodHlwZW9mIHBhdHRlcm4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmICh1cmwuaW5kZXhPZihwYXR0ZXJuKSAhPT0gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHBhdHRlcm4udGVzdCh1cmwpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGdldEludGVyY2VwdCgpLm9uKCdyZXF1ZXN0JywgZnVuY3Rpb24oX2FyZykge1xuICAgIHZhciBhZnRlciwgYXJncywgcmVxdWVzdCwgdHlwZSwgdXJsO1xuICAgIHR5cGUgPSBfYXJnLnR5cGUsIHJlcXVlc3QgPSBfYXJnLnJlcXVlc3QsIHVybCA9IF9hcmcudXJsO1xuICAgIGlmIChzaG91bGRJZ25vcmVVUkwodXJsKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIVBhY2UucnVubmluZyAmJiAob3B0aW9ucy5yZXN0YXJ0T25SZXF1ZXN0QWZ0ZXIgIT09IGZhbHNlIHx8IHNob3VsZFRyYWNrKHR5cGUpID09PSAnZm9yY2UnKSkge1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGFmdGVyID0gb3B0aW9ucy5yZXN0YXJ0T25SZXF1ZXN0QWZ0ZXIgfHwgMDtcbiAgICAgIGlmICh0eXBlb2YgYWZ0ZXIgPT09ICdib29sZWFuJykge1xuICAgICAgICBhZnRlciA9IDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN0aWxsQWN0aXZlLCBfaiwgX2xlbjEsIF9yZWYyLCBfcmVmMywgX3Jlc3VsdHM7XG4gICAgICAgIGlmICh0eXBlID09PSAnc29ja2V0Jykge1xuICAgICAgICAgIHN0aWxsQWN0aXZlID0gcmVxdWVzdC5yZWFkeVN0YXRlIDwgMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdGlsbEFjdGl2ZSA9ICgwIDwgKF9yZWYyID0gcmVxdWVzdC5yZWFkeVN0YXRlKSAmJiBfcmVmMiA8IDQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGlsbEFjdGl2ZSkge1xuICAgICAgICAgIFBhY2UucmVzdGFydCgpO1xuICAgICAgICAgIF9yZWYzID0gUGFjZS5zb3VyY2VzO1xuICAgICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjMubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgICBzb3VyY2UgPSBfcmVmM1tfal07XG4gICAgICAgICAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgQWpheE1vbml0b3IpIHtcbiAgICAgICAgICAgICAgc291cmNlLndhdGNoLmFwcGx5KHNvdXJjZSwgYXJncyk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3Jlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgIH1cbiAgICAgIH0sIGFmdGVyKTtcbiAgICB9XG4gIH0pO1xuXG4gIEFqYXhNb25pdG9yID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEFqYXhNb25pdG9yKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMuZWxlbWVudHMgPSBbXTtcbiAgICAgIGdldEludGVyY2VwdCgpLm9uKCdyZXF1ZXN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy53YXRjaC5hcHBseShfdGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIEFqYXhNb25pdG9yLnByb3RvdHlwZS53YXRjaCA9IGZ1bmN0aW9uKF9hcmcpIHtcbiAgICAgIHZhciByZXF1ZXN0LCB0cmFja2VyLCB0eXBlLCB1cmw7XG4gICAgICB0eXBlID0gX2FyZy50eXBlLCByZXF1ZXN0ID0gX2FyZy5yZXF1ZXN0LCB1cmwgPSBfYXJnLnVybDtcbiAgICAgIGlmIChzaG91bGRJZ25vcmVVUkwodXJsKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodHlwZSA9PT0gJ3NvY2tldCcpIHtcbiAgICAgICAgdHJhY2tlciA9IG5ldyBTb2NrZXRSZXF1ZXN0VHJhY2tlcihyZXF1ZXN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyYWNrZXIgPSBuZXcgWEhSUmVxdWVzdFRyYWNrZXIocmVxdWVzdCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5lbGVtZW50cy5wdXNoKHRyYWNrZXIpO1xuICAgIH07XG5cbiAgICByZXR1cm4gQWpheE1vbml0b3I7XG5cbiAgfSkoKTtcblxuICBYSFJSZXF1ZXN0VHJhY2tlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBYSFJSZXF1ZXN0VHJhY2tlcihyZXF1ZXN0KSB7XG4gICAgICB2YXIgZXZlbnQsIHNpemUsIF9qLCBfbGVuMSwgX29ucmVhZHlzdGF0ZWNoYW5nZSwgX3JlZjIsXG4gICAgICAgIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICAgICAgaWYgKHdpbmRvdy5Qcm9ncmVzc0V2ZW50ICE9IG51bGwpIHtcbiAgICAgICAgc2l6ZSA9IG51bGw7XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICBpZiAoZXZ0Lmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9ncmVzcyA9IDEwMCAqIGV2dC5sb2FkZWQgLyBldnQudG90YWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9ncmVzcyA9IF90aGlzLnByb2dyZXNzICsgKDEwMCAtIF90aGlzLnByb2dyZXNzKSAvIDI7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIF9yZWYyID0gWydsb2FkJywgJ2Fib3J0JywgJ3RpbWVvdXQnLCAnZXJyb3InXTtcbiAgICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgZXZlbnQgPSBfcmVmMltfal07XG4gICAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9ncmVzcyA9IDEwMDtcbiAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9vbnJlYWR5c3RhdGVjaGFuZ2UgPSByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZTtcbiAgICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgX3JlZjM7XG4gICAgICAgICAgaWYgKChfcmVmMyA9IHJlcXVlc3QucmVhZHlTdGF0ZSkgPT09IDAgfHwgX3JlZjMgPT09IDQpIHtcbiAgICAgICAgICAgIF90aGlzLnByb2dyZXNzID0gMTAwO1xuICAgICAgICAgIH0gZWxzZSBpZiAocmVxdWVzdC5yZWFkeVN0YXRlID09PSAzKSB7XG4gICAgICAgICAgICBfdGhpcy5wcm9ncmVzcyA9IDUwO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdHlwZW9mIF9vbnJlYWR5c3RhdGVjaGFuZ2UgPT09IFwiZnVuY3Rpb25cIiA/IF9vbnJlYWR5c3RhdGVjaGFuZ2UuYXBwbHkobnVsbCwgYXJndW1lbnRzKSA6IHZvaWQgMDtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gWEhSUmVxdWVzdFRyYWNrZXI7XG5cbiAgfSkoKTtcblxuICBTb2NrZXRSZXF1ZXN0VHJhY2tlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBTb2NrZXRSZXF1ZXN0VHJhY2tlcihyZXF1ZXN0KSB7XG4gICAgICB2YXIgZXZlbnQsIF9qLCBfbGVuMSwgX3JlZjIsXG4gICAgICAgIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICAgICAgX3JlZjIgPSBbJ2Vycm9yJywgJ29wZW4nXTtcbiAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICBldmVudCA9IF9yZWYyW19qXTtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMucHJvZ3Jlc3MgPSAxMDA7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gU29ja2V0UmVxdWVzdFRyYWNrZXI7XG5cbiAgfSkoKTtcblxuICBFbGVtZW50TW9uaXRvciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBFbGVtZW50TW9uaXRvcihvcHRpb25zKSB7XG4gICAgICB2YXIgc2VsZWN0b3IsIF9qLCBfbGVuMSwgX3JlZjI7XG4gICAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZWxlbWVudHMgPSBbXTtcbiAgICAgIGlmIChvcHRpb25zLnNlbGVjdG9ycyA9PSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMuc2VsZWN0b3JzID0gW107XG4gICAgICB9XG4gICAgICBfcmVmMiA9IG9wdGlvbnMuc2VsZWN0b3JzO1xuICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgIHNlbGVjdG9yID0gX3JlZjJbX2pdO1xuICAgICAgICB0aGlzLmVsZW1lbnRzLnB1c2gobmV3IEVsZW1lbnRUcmFja2VyKHNlbGVjdG9yKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIEVsZW1lbnRNb25pdG9yO1xuXG4gIH0pKCk7XG5cbiAgRWxlbWVudFRyYWNrZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRWxlbWVudFRyYWNrZXIoc2VsZWN0b3IpIHtcbiAgICAgIHRoaXMuc2VsZWN0b3IgPSBzZWxlY3RvcjtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICAgICAgdGhpcy5jaGVjaygpO1xuICAgIH1cblxuICAgIEVsZW1lbnRUcmFja2VyLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRvbmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuY2hlY2soKTtcbiAgICAgICAgfSksIG9wdGlvbnMuZWxlbWVudHMuY2hlY2tJbnRlcnZhbCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEVsZW1lbnRUcmFja2VyLnByb3RvdHlwZS5kb25lID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9ncmVzcyA9IDEwMDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEVsZW1lbnRUcmFja2VyO1xuXG4gIH0pKCk7XG5cbiAgRG9jdW1lbnRNb25pdG9yID0gKGZ1bmN0aW9uKCkge1xuICAgIERvY3VtZW50TW9uaXRvci5wcm90b3R5cGUuc3RhdGVzID0ge1xuICAgICAgbG9hZGluZzogMCxcbiAgICAgIGludGVyYWN0aXZlOiA1MCxcbiAgICAgIGNvbXBsZXRlOiAxMDBcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gRG9jdW1lbnRNb25pdG9yKCkge1xuICAgICAgdmFyIF9vbnJlYWR5c3RhdGVjaGFuZ2UsIF9yZWYyLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLnByb2dyZXNzID0gKF9yZWYyID0gdGhpcy5zdGF0ZXNbZG9jdW1lbnQucmVhZHlTdGF0ZV0pICE9IG51bGwgPyBfcmVmMiA6IDEwMDtcbiAgICAgIF9vbnJlYWR5c3RhdGVjaGFuZ2UgPSBkb2N1bWVudC5vbnJlYWR5c3RhdGVjaGFuZ2U7XG4gICAgICBkb2N1bWVudC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKF90aGlzLnN0YXRlc1tkb2N1bWVudC5yZWFkeVN0YXRlXSAhPSBudWxsKSB7XG4gICAgICAgICAgX3RoaXMucHJvZ3Jlc3MgPSBfdGhpcy5zdGF0ZXNbZG9jdW1lbnQucmVhZHlTdGF0ZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHR5cGVvZiBfb25yZWFkeXN0YXRlY2hhbmdlID09PSBcImZ1bmN0aW9uXCIgPyBfb25yZWFkeXN0YXRlY2hhbmdlLmFwcGx5KG51bGwsIGFyZ3VtZW50cykgOiB2b2lkIDA7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBEb2N1bWVudE1vbml0b3I7XG5cbiAgfSkoKTtcblxuICBFdmVudExhZ01vbml0b3IgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRXZlbnRMYWdNb25pdG9yKCkge1xuICAgICAgdmFyIGF2ZywgaW50ZXJ2YWwsIGxhc3QsIHBvaW50cywgc2FtcGxlcyxcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IDA7XG4gICAgICBhdmcgPSAwO1xuICAgICAgc2FtcGxlcyA9IFtdO1xuICAgICAgcG9pbnRzID0gMDtcbiAgICAgIGxhc3QgPSBub3coKTtcbiAgICAgIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkaWZmO1xuICAgICAgICBkaWZmID0gbm93KCkgLSBsYXN0IC0gNTA7XG4gICAgICAgIGxhc3QgPSBub3coKTtcbiAgICAgICAgc2FtcGxlcy5wdXNoKGRpZmYpO1xuICAgICAgICBpZiAoc2FtcGxlcy5sZW5ndGggPiBvcHRpb25zLmV2ZW50TGFnLnNhbXBsZUNvdW50KSB7XG4gICAgICAgICAgc2FtcGxlcy5zaGlmdCgpO1xuICAgICAgICB9XG4gICAgICAgIGF2ZyA9IGF2Z0FtcGxpdHVkZShzYW1wbGVzKTtcbiAgICAgICAgaWYgKCsrcG9pbnRzID49IG9wdGlvbnMuZXZlbnRMYWcubWluU2FtcGxlcyAmJiBhdmcgPCBvcHRpb25zLmV2ZW50TGFnLmxhZ1RocmVzaG9sZCkge1xuICAgICAgICAgIF90aGlzLnByb2dyZXNzID0gMTAwO1xuICAgICAgICAgIHJldHVybiBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMucHJvZ3Jlc3MgPSAxMDAgKiAoMyAvIChhdmcgKyAzKSk7XG4gICAgICAgIH1cbiAgICAgIH0sIDUwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gRXZlbnRMYWdNb25pdG9yO1xuXG4gIH0pKCk7XG5cbiAgU2NhbGVyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIFNjYWxlcihzb3VyY2UpIHtcbiAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgdGhpcy5sYXN0ID0gdGhpcy5zaW5jZUxhc3RVcGRhdGUgPSAwO1xuICAgICAgdGhpcy5yYXRlID0gb3B0aW9ucy5pbml0aWFsUmF0ZTtcbiAgICAgIHRoaXMuY2F0Y2h1cCA9IDA7XG4gICAgICB0aGlzLnByb2dyZXNzID0gdGhpcy5sYXN0UHJvZ3Jlc3MgPSAwO1xuICAgICAgaWYgKHRoaXMuc291cmNlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5wcm9ncmVzcyA9IHJlc3VsdCh0aGlzLnNvdXJjZSwgJ3Byb2dyZXNzJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgU2NhbGVyLnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24oZnJhbWVUaW1lLCB2YWwpIHtcbiAgICAgIHZhciBzY2FsaW5nO1xuICAgICAgaWYgKHZhbCA9PSBudWxsKSB7XG4gICAgICAgIHZhbCA9IHJlc3VsdCh0aGlzLnNvdXJjZSwgJ3Byb2dyZXNzJyk7XG4gICAgICB9XG4gICAgICBpZiAodmFsID49IDEwMCkge1xuICAgICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHZhbCA9PT0gdGhpcy5sYXN0KSB7XG4gICAgICAgIHRoaXMuc2luY2VMYXN0VXBkYXRlICs9IGZyYW1lVGltZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLnNpbmNlTGFzdFVwZGF0ZSkge1xuICAgICAgICAgIHRoaXMucmF0ZSA9ICh2YWwgLSB0aGlzLmxhc3QpIC8gdGhpcy5zaW5jZUxhc3RVcGRhdGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYXRjaHVwID0gKHZhbCAtIHRoaXMucHJvZ3Jlc3MpIC8gb3B0aW9ucy5jYXRjaHVwVGltZTtcbiAgICAgICAgdGhpcy5zaW5jZUxhc3RVcGRhdGUgPSAwO1xuICAgICAgICB0aGlzLmxhc3QgPSB2YWw7XG4gICAgICB9XG4gICAgICBpZiAodmFsID4gdGhpcy5wcm9ncmVzcykge1xuICAgICAgICB0aGlzLnByb2dyZXNzICs9IHRoaXMuY2F0Y2h1cCAqIGZyYW1lVGltZTtcbiAgICAgIH1cbiAgICAgIHNjYWxpbmcgPSAxIC0gTWF0aC5wb3codGhpcy5wcm9ncmVzcyAvIDEwMCwgb3B0aW9ucy5lYXNlRmFjdG9yKTtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgKz0gc2NhbGluZyAqIHRoaXMucmF0ZSAqIGZyYW1lVGltZTtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSBNYXRoLm1pbih0aGlzLmxhc3RQcm9ncmVzcyArIG9wdGlvbnMubWF4UHJvZ3Jlc3NQZXJGcmFtZSwgdGhpcy5wcm9ncmVzcyk7XG4gICAgICB0aGlzLnByb2dyZXNzID0gTWF0aC5tYXgoMCwgdGhpcy5wcm9ncmVzcyk7XG4gICAgICB0aGlzLnByb2dyZXNzID0gTWF0aC5taW4oMTAwLCB0aGlzLnByb2dyZXNzKTtcbiAgICAgIHRoaXMubGFzdFByb2dyZXNzID0gdGhpcy5wcm9ncmVzcztcbiAgICAgIHJldHVybiB0aGlzLnByb2dyZXNzO1xuICAgIH07XG5cbiAgICByZXR1cm4gU2NhbGVyO1xuXG4gIH0pKCk7XG5cbiAgc291cmNlcyA9IG51bGw7XG5cbiAgc2NhbGVycyA9IG51bGw7XG5cbiAgYmFyID0gbnVsbDtcblxuICB1bmlTY2FsZXIgPSBudWxsO1xuXG4gIGFuaW1hdGlvbiA9IG51bGw7XG5cbiAgY2FuY2VsQW5pbWF0aW9uID0gbnVsbDtcblxuICBQYWNlLnJ1bm5pbmcgPSBmYWxzZTtcblxuICBoYW5kbGVQdXNoU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAob3B0aW9ucy5yZXN0YXJ0T25QdXNoU3RhdGUpIHtcbiAgICAgIHJldHVybiBQYWNlLnJlc3RhcnQoKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSAhPSBudWxsKSB7XG4gICAgX3B1c2hTdGF0ZSA9IHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZTtcbiAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGhhbmRsZVB1c2hTdGF0ZSgpO1xuICAgICAgcmV0dXJuIF9wdXNoU3RhdGUuYXBwbHkod2luZG93Lmhpc3RvcnksIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmICh3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUgIT0gbnVsbCkge1xuICAgIF9yZXBsYWNlU3RhdGUgPSB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGU7XG4gICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICBoYW5kbGVQdXNoU3RhdGUoKTtcbiAgICAgIHJldHVybiBfcmVwbGFjZVN0YXRlLmFwcGx5KHdpbmRvdy5oaXN0b3J5LCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBTT1VSQ0VfS0VZUyA9IHtcbiAgICBhamF4OiBBamF4TW9uaXRvcixcbiAgICBlbGVtZW50czogRWxlbWVudE1vbml0b3IsXG4gICAgZG9jdW1lbnQ6IERvY3VtZW50TW9uaXRvcixcbiAgICBldmVudExhZzogRXZlbnRMYWdNb25pdG9yXG4gIH07XG5cbiAgKGluaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHlwZSwgX2osIF9rLCBfbGVuMSwgX2xlbjIsIF9yZWYyLCBfcmVmMywgX3JlZjQ7XG4gICAgUGFjZS5zb3VyY2VzID0gc291cmNlcyA9IFtdO1xuICAgIF9yZWYyID0gWydhamF4JywgJ2VsZW1lbnRzJywgJ2RvY3VtZW50JywgJ2V2ZW50TGFnJ107XG4gICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICB0eXBlID0gX3JlZjJbX2pdO1xuICAgICAgaWYgKG9wdGlvbnNbdHlwZV0gIT09IGZhbHNlKSB7XG4gICAgICAgIHNvdXJjZXMucHVzaChuZXcgU09VUkNFX0tFWVNbdHlwZV0ob3B0aW9uc1t0eXBlXSkpO1xuICAgICAgfVxuICAgIH1cbiAgICBfcmVmNCA9IChfcmVmMyA9IG9wdGlvbnMuZXh0cmFTb3VyY2VzKSAhPSBudWxsID8gX3JlZjMgOiBbXTtcbiAgICBmb3IgKF9rID0gMCwgX2xlbjIgPSBfcmVmNC5sZW5ndGg7IF9rIDwgX2xlbjI7IF9rKyspIHtcbiAgICAgIHNvdXJjZSA9IF9yZWY0W19rXTtcbiAgICAgIHNvdXJjZXMucHVzaChuZXcgc291cmNlKG9wdGlvbnMpKTtcbiAgICB9XG4gICAgUGFjZS5iYXIgPSBiYXIgPSBuZXcgQmFyO1xuICAgIHNjYWxlcnMgPSBbXTtcbiAgICByZXR1cm4gdW5pU2NhbGVyID0gbmV3IFNjYWxlcjtcbiAgfSkoKTtcblxuICBQYWNlLnN0b3AgPSBmdW5jdGlvbigpIHtcbiAgICBQYWNlLnRyaWdnZXIoJ3N0b3AnKTtcbiAgICBQYWNlLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICBiYXIuZGVzdHJveSgpO1xuICAgIGNhbmNlbEFuaW1hdGlvbiA9IHRydWU7XG4gICAgaWYgKGFuaW1hdGlvbiAhPSBudWxsKSB7XG4gICAgICBpZiAodHlwZW9mIGNhbmNlbEFuaW1hdGlvbkZyYW1lID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uKTtcbiAgICAgIH1cbiAgICAgIGFuaW1hdGlvbiA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBpbml0KCk7XG4gIH07XG5cbiAgUGFjZS5yZXN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgUGFjZS50cmlnZ2VyKCdyZXN0YXJ0Jyk7XG4gICAgUGFjZS5zdG9wKCk7XG4gICAgcmV0dXJuIFBhY2Uuc3RhcnQoKTtcbiAgfTtcblxuICBQYWNlLmdvID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0YXJ0O1xuICAgIFBhY2UucnVubmluZyA9IHRydWU7XG4gICAgYmFyLnJlbmRlcigpO1xuICAgIHN0YXJ0ID0gbm93KCk7XG4gICAgY2FuY2VsQW5pbWF0aW9uID0gZmFsc2U7XG4gICAgcmV0dXJuIGFuaW1hdGlvbiA9IHJ1bkFuaW1hdGlvbihmdW5jdGlvbihmcmFtZVRpbWUsIGVucXVldWVOZXh0RnJhbWUpIHtcbiAgICAgIHZhciBhdmcsIGNvdW50LCBkb25lLCBlbGVtZW50LCBlbGVtZW50cywgaSwgaiwgcmVtYWluaW5nLCBzY2FsZXIsIHNjYWxlckxpc3QsIHN1bSwgX2osIF9rLCBfbGVuMSwgX2xlbjIsIF9yZWYyO1xuICAgICAgcmVtYWluaW5nID0gMTAwIC0gYmFyLnByb2dyZXNzO1xuICAgICAgY291bnQgPSBzdW0gPSAwO1xuICAgICAgZG9uZSA9IHRydWU7XG4gICAgICBmb3IgKGkgPSBfaiA9IDAsIF9sZW4xID0gc291cmNlcy5sZW5ndGg7IF9qIDwgX2xlbjE7IGkgPSArK19qKSB7XG4gICAgICAgIHNvdXJjZSA9IHNvdXJjZXNbaV07XG4gICAgICAgIHNjYWxlckxpc3QgPSBzY2FsZXJzW2ldICE9IG51bGwgPyBzY2FsZXJzW2ldIDogc2NhbGVyc1tpXSA9IFtdO1xuICAgICAgICBlbGVtZW50cyA9IChfcmVmMiA9IHNvdXJjZS5lbGVtZW50cykgIT0gbnVsbCA/IF9yZWYyIDogW3NvdXJjZV07XG4gICAgICAgIGZvciAoaiA9IF9rID0gMCwgX2xlbjIgPSBlbGVtZW50cy5sZW5ndGg7IF9rIDwgX2xlbjI7IGogPSArK19rKSB7XG4gICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnRzW2pdO1xuICAgICAgICAgIHNjYWxlciA9IHNjYWxlckxpc3Rbal0gIT0gbnVsbCA/IHNjYWxlckxpc3Rbal0gOiBzY2FsZXJMaXN0W2pdID0gbmV3IFNjYWxlcihlbGVtZW50KTtcbiAgICAgICAgICBkb25lICY9IHNjYWxlci5kb25lO1xuICAgICAgICAgIGlmIChzY2FsZXIuZG9uZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgc3VtICs9IHNjYWxlci50aWNrKGZyYW1lVGltZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGF2ZyA9IHN1bSAvIGNvdW50O1xuICAgICAgYmFyLnVwZGF0ZSh1bmlTY2FsZXIudGljayhmcmFtZVRpbWUsIGF2ZykpO1xuICAgICAgaWYgKGJhci5kb25lKCkgfHwgZG9uZSB8fCBjYW5jZWxBbmltYXRpb24pIHtcbiAgICAgICAgYmFyLnVwZGF0ZSgxMDApO1xuICAgICAgICBQYWNlLnRyaWdnZXIoJ2RvbmUnKTtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgYmFyLmZpbmlzaCgpO1xuICAgICAgICAgIFBhY2UucnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBQYWNlLnRyaWdnZXIoJ2hpZGUnKTtcbiAgICAgICAgfSwgTWF0aC5tYXgob3B0aW9ucy5naG9zdFRpbWUsIE1hdGgubWF4KG9wdGlvbnMubWluVGltZSAtIChub3coKSAtIHN0YXJ0KSwgMCkpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBlbnF1ZXVlTmV4dEZyYW1lKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgUGFjZS5zdGFydCA9IGZ1bmN0aW9uKF9vcHRpb25zKSB7XG4gICAgZXh0ZW5kKG9wdGlvbnMsIF9vcHRpb25zKTtcbiAgICBQYWNlLnJ1bm5pbmcgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICBiYXIucmVuZGVyKCk7XG4gICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICBOb1RhcmdldEVycm9yID0gX2Vycm9yO1xuICAgIH1cbiAgICBpZiAoIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWNlJykpIHtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KFBhY2Uuc3RhcnQsIDUwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgUGFjZS50cmlnZ2VyKCdzdGFydCcpO1xuICAgICAgcmV0dXJuIFBhY2UuZ28oKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShbJ3BhY2UnXSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gUGFjZTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFBhY2U7XG4gIH0gZWxzZSB7XG4gICAgaWYgKG9wdGlvbnMuc3RhcnRPblBhZ2VMb2FkKSB7XG4gICAgICBQYWNlLnN0YXJ0KCk7XG4gICAgfVxuICB9XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvKlxuICogU2xpbmt5XG4gKiBBIGxpZ2h0LXdlaWdodCwgcmVzcG9uc2l2ZSwgbW9iaWxlLWxpa2UgbmF2aWdhdGlvbiBtZW51IHBsdWdpbiBmb3IgalF1ZXJ5XG4gKiBCdWlsdCBieSBBbGkgWmFoaWQgPGFsaS56YWhpZEBsaXZlLmNvbT5cbiAqIFB1Ymxpc2hlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuXG47KGZ1bmN0aW9uKCQpXG57XG4gIHZhciBsYXN0Q2xpY2s7XG5cbiAgJC5mbi5zbGlua3kgPSBmdW5jdGlvbihvcHRpb25zKVxuICB7XG4gICAgdmFyIHNldHRpbmdzID0gJC5leHRlbmRcbiAgICAoe1xuICAgICAgbGFiZWw6ICdCYWNrJyxcbiAgICAgIHRpdGxlOiBmYWxzZSxcbiAgICAgIHNwZWVkOiAzMDAsXG4gICAgICByZXNpemU6IHRydWUsXG4gICAgICBhY3RpdmVDbGFzczogJ2FjdGl2ZScsXG4gICAgICBoZWFkZXJDbGFzczogJ2hlYWRlcicsXG4gICAgICBoZWFkaW5nVGFnOiAnPGgyPicsXG4gICAgICBiYWNrRmlyc3Q6IGZhbHNlLFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgdmFyIG1lbnUgPSAkKHRoaXMpLFxuICAgICAgICByb290ID0gbWVudS5jaGlsZHJlbigpLmZpcnN0KCk7XG5cbiAgICBtZW51LmFkZENsYXNzKCdzbGlua3ktbWVudScpO1xuXG4gICAgdmFyIG1vdmUgPSBmdW5jdGlvbihkZXB0aCwgY2FsbGJhY2spXG4gICAge1xuICAgICAgdmFyIGxlZnQgPSBNYXRoLnJvdW5kKHBhcnNlSW50KHJvb3QuZ2V0KDApLnN0eWxlLmxlZnQpKSB8fCAwO1xuXG4gICAgICByb290LmNzcygnbGVmdCcsIGxlZnQgLSAoZGVwdGggKiAxMDApICsgJyUnKTtcblxuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIHtcbiAgICAgICAgc2V0VGltZW91dChjYWxsYmFjaywgc2V0dGluZ3Muc3BlZWQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgcmVzaXplID0gZnVuY3Rpb24oY29udGVudClcbiAgICB7XG4gICAgICBtZW51LmhlaWdodChjb250ZW50Lm91dGVySGVpZ2h0KCkpO1xuICAgIH07XG5cbiAgICB2YXIgdHJhbnNpdGlvbiA9IGZ1bmN0aW9uKHNwZWVkKVxuICAgIHtcbiAgICAgIG1lbnUuY3NzKCd0cmFuc2l0aW9uLWR1cmF0aW9uJywgc3BlZWQgKyAnbXMnKTtcbiAgICAgIHJvb3QuY3NzKCd0cmFuc2l0aW9uLWR1cmF0aW9uJywgc3BlZWQgKyAnbXMnKTtcbiAgICB9O1xuXG4gICAgdHJhbnNpdGlvbihzZXR0aW5ncy5zcGVlZCk7XG5cbiAgICAkKCdhICsgdWwnLCBtZW51KS5wcmV2KCkuYWRkQ2xhc3MoJ25leHQnKTtcblxuICAgICQoJ2xpID4gdWwnLCBtZW51KS5wcmVwZW5kKCc8bGkgY2xhc3M9XCInICsgc2V0dGluZ3MuaGVhZGVyQ2xhc3MgKyAnXCI+Jyk7XG5cbiAgICBpZiAoc2V0dGluZ3MudGl0bGUgPT09IHRydWUpXG4gICAge1xuICAgICAgJCgnbGkgPiB1bCcsIG1lbnUpLmVhY2goZnVuY3Rpb24oKVxuICAgICAge1xuICAgICAgICB2YXIgJGxpbmsgPSAkKHRoaXMpLnBhcmVudCgpLmZpbmQoJ2EnKS5maXJzdCgpLFxuICAgICAgICAgICAgbGFiZWwgPSAkbGluay50ZXh0KCksXG4gICAgICAgICAgICB0aXRsZSA9ICQoJzxhPicpLmFkZENsYXNzKCd0aXRsZScpLnRleHQobGFiZWwpLmF0dHIoJ2hyZWYnLCAkbGluay5hdHRyKCdocmVmJykpO1xuXG4gICAgICAgICQoJz4gLicgKyBzZXR0aW5ncy5oZWFkZXJDbGFzcywgdGhpcykuYXBwZW5kKHRpdGxlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghc2V0dGluZ3MudGl0bGUgJiYgc2V0dGluZ3MubGFiZWwgPT09IHRydWUpXG4gICAge1xuICAgICAgJCgnbGkgPiB1bCcsIG1lbnUpLmVhY2goZnVuY3Rpb24oKVxuICAgICAge1xuICAgICAgICB2YXIgbGFiZWwgPSAkKHRoaXMpLnBhcmVudCgpLmZpbmQoJ2EnKS5maXJzdCgpLnRleHQoKSxcbiAgICAgICAgICAgIGJhY2tMaW5rID0gJCgnPGE+JykudGV4dChsYWJlbCkucHJvcCgnaHJlZicsICcjJykuYWRkQ2xhc3MoJ2JhY2snKTtcblxuICAgICAgICBpZiAoc2V0dGluZ3MuYmFja0ZpcnN0KVxuICAgICAgICB7XG4gICAgICAgICAgJCgnPiAuJyArIHNldHRpbmdzLmhlYWRlckNsYXNzLCB0aGlzKS5wcmVwZW5kKGJhY2tMaW5rKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAkKCc+IC4nICsgc2V0dGluZ3MuaGVhZGVyQ2xhc3MsIHRoaXMpLmFwcGVuZChiYWNrTGluayk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgdmFyIGJhY2tMaW5rID0gJCgnPGE+JykudGV4dChzZXR0aW5ncy5sYWJlbCkucHJvcCgnaHJlZicsICcjJykuYWRkQ2xhc3MoJ2JhY2snKTtcblxuICAgICAgaWYgKHNldHRpbmdzLmJhY2tGaXJzdClcbiAgICAgIHtcbiAgICAgICAgJCgnLicgKyBzZXR0aW5ncy5oZWFkZXJDbGFzcywgbWVudSkucHJlcGVuZChiYWNrTGluayk7XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICB7XG4gICAgICAgICQoJy4nICsgc2V0dGluZ3MuaGVhZGVyQ2xhc3MsIG1lbnUpLmFwcGVuZChiYWNrTGluayk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJCgnYScsIG1lbnUpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpXG4gICAge1xuICAgICAgaWYgKChsYXN0Q2xpY2sgKyBzZXR0aW5ncy5zcGVlZCkgPiBEYXRlLm5vdygpKVxuICAgICAge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGxhc3RDbGljayA9IERhdGUubm93KCk7XG5cbiAgICAgIHZhciBhID0gJCh0aGlzKTtcblxuICAgICAgaWYgKGEuaGFzQ2xhc3MoJ25leHQnKSB8fCBhLmhhc0NsYXNzKCdiYWNrJykpXG4gICAgICB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGEuaGFzQ2xhc3MoJ25leHQnKSlcbiAgICAgIHtcbiAgICAgICAgbWVudS5maW5kKCcuJyArIHNldHRpbmdzLmFjdGl2ZUNsYXNzKS5yZW1vdmVDbGFzcyhzZXR0aW5ncy5hY3RpdmVDbGFzcyk7XG5cbiAgICAgICAgYS5uZXh0KCkuc2hvdygpLmFkZENsYXNzKHNldHRpbmdzLmFjdGl2ZUNsYXNzKTtcblxuICAgICAgICBtb3ZlKDEpO1xuXG4gICAgICAgIGlmIChzZXR0aW5ncy5yZXNpemUpXG4gICAgICAgIHtcbiAgICAgICAgICByZXNpemUoYS5uZXh0KCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChhLmhhc0NsYXNzKCdiYWNrJykpXG4gICAgICB7XG4gICAgICAgIG1vdmUoLTEsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgIG1lbnUuZmluZCgnLicgKyBzZXR0aW5ncy5hY3RpdmVDbGFzcykucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYWN0aXZlQ2xhc3MpO1xuXG4gICAgICAgICAgYS5wYXJlbnQoKS5wYXJlbnQoKS5oaWRlKCkucGFyZW50c1VudGlsKG1lbnUsICd1bCcpLmZpcnN0KCkuYWRkQ2xhc3Moc2V0dGluZ3MuYWN0aXZlQ2xhc3MpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoc2V0dGluZ3MucmVzaXplKVxuICAgICAgICB7XG4gICAgICAgICAgcmVzaXplKGEucGFyZW50KCkucGFyZW50KCkucGFyZW50c1VudGlsKG1lbnUsICd1bCcpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5qdW1wID0gZnVuY3Rpb24odG8sIGFuaW1hdGUpXG4gICAge1xuICAgICAgdG8gPSAkKHRvKTtcblxuICAgICAgdmFyIGFjdGl2ZSA9IG1lbnUuZmluZCgnLicgKyBzZXR0aW5ncy5hY3RpdmVDbGFzcyk7XG5cbiAgICAgIGlmIChhY3RpdmUubGVuZ3RoID4gMClcbiAgICAgIHtcbiAgICAgICAgYWN0aXZlID0gYWN0aXZlLnBhcmVudHNVbnRpbChtZW51LCAndWwnKS5sZW5ndGg7XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICB7XG4gICAgICAgIGFjdGl2ZSA9IDA7XG4gICAgICB9XG5cbiAgICAgIG1lbnUuZmluZCgndWwnKS5yZW1vdmVDbGFzcyhzZXR0aW5ncy5hY3RpdmVDbGFzcykuaGlkZSgpO1xuXG4gICAgICB2YXIgbWVudXMgPSB0by5wYXJlbnRzVW50aWwobWVudSwgJ3VsJyk7XG5cbiAgICAgIG1lbnVzLnNob3coKTtcbiAgICAgIHRvLnNob3coKS5hZGRDbGFzcyhzZXR0aW5ncy5hY3RpdmVDbGFzcyk7XG5cbiAgICAgIGlmIChhbmltYXRlID09PSBmYWxzZSlcbiAgICAgIHtcbiAgICAgICAgdHJhbnNpdGlvbigwKTtcbiAgICAgIH1cblxuICAgICAgbW92ZShtZW51cy5sZW5ndGggLSBhY3RpdmUpO1xuXG4gICAgICBpZiAoc2V0dGluZ3MucmVzaXplKVxuICAgICAge1xuICAgICAgICByZXNpemUodG8pO1xuICAgICAgfVxuXG4gICAgICBpZiAoYW5pbWF0ZSA9PT0gZmFsc2UpXG4gICAgICB7XG4gICAgICAgIHRyYW5zaXRpb24oc2V0dGluZ3Muc3BlZWQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmhvbWUgPSBmdW5jdGlvbihhbmltYXRlKVxuICAgIHtcbiAgICAgIGlmIChhbmltYXRlID09PSBmYWxzZSlcbiAgICAgIHtcbiAgICAgICAgdHJhbnNpdGlvbigwKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGFjdGl2ZSA9IG1lbnUuZmluZCgnLicgKyBzZXR0aW5ncy5hY3RpdmVDbGFzcyksXG4gICAgICAgICAgY291bnQgPSBhY3RpdmUucGFyZW50c1VudGlsKG1lbnUsICdsaScpLmxlbmd0aDtcblxuICAgICAgaWYgKGNvdW50ID4gMClcbiAgICAgIHtcbiAgICAgICAgbW92ZSgtY291bnQsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgIGFjdGl2ZS5yZW1vdmVDbGFzcyhzZXR0aW5ncy5hY3RpdmVDbGFzcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzZXR0aW5ncy5yZXNpemUpXG4gICAgICAgIHtcbiAgICAgICAgICByZXNpemUoJChhY3RpdmUucGFyZW50c1VudGlsKG1lbnUsICdsaScpLmdldChjb3VudCAtIDEpKS5wYXJlbnQoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGFuaW1hdGUgPT09IGZhbHNlKVxuICAgICAge1xuICAgICAgICB0cmFuc2l0aW9uKHNldHRpbmdzLnNwZWVkKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5kZXN0cm95ID0gZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICQoJy4nICsgc2V0dGluZ3MuaGVhZGVyQ2xhc3MsIG1lbnUpLnJlbW92ZSgpO1xuICAgICAgJCgnYScsIG1lbnUpLnJlbW92ZUNsYXNzKCduZXh0Jykub2ZmKCdjbGljaycpO1xuXG4gICAgICBtZW51LnJlbW92ZUNsYXNzKCdzbGlua3ktbWVudScpLmNzcygndHJhbnNpdGlvbi1kdXJhdGlvbicsICcnKTtcbiAgICAgIHJvb3QuY3NzKCd0cmFuc2l0aW9uLWR1cmF0aW9uJywgJycpO1xuICAgIH07XG5cbiAgICB2YXIgYWN0aXZlID0gbWVudS5maW5kKCcuJyArIHNldHRpbmdzLmFjdGl2ZUNsYXNzKTtcblxuICAgIGlmIChhY3RpdmUubGVuZ3RoID4gMClcbiAgICB7XG4gICAgICBhY3RpdmUucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYWN0aXZlQ2xhc3MpO1xuXG4gICAgICB0aGlzLmp1bXAoYWN0aXZlLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59KGpRdWVyeSkpOyIsImpRdWVyeShmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gRmxleHkgaGVhZGVyXG4gIGZsZXh5X2hlYWRlci5pbml0KCk7XG5cbiAgLy8gU2lkclxuICAkKCcuc2xpbmt5LW1lbnUnKVxuICAgICAgLmZpbmQoJ3VsLCBsaSwgYScpXG4gICAgICAucmVtb3ZlQ2xhc3MoKTtcblxuICAkKCcuc2lkci10b2dnbGUtLXJpZ2h0Jykuc2lkcih7XG4gICAgbmFtZTogJ3NpZHItbWFpbicsXG4gICAgc2lkZTogJ3JpZ2h0JyxcbiAgICByZW5hbWluZzogZmFsc2UsXG4gICAgYm9keTogJy5sYXlvdXRfX3dyYXBwZXInLFxuICAgIHNvdXJjZTogJy5zaWRyLXNvdXJjZS1wcm92aWRlcidcbiAgfSk7XG5cbiAgLy8gU2xpbmt5XG4gICQoJy5zaWRyIC5zbGlua3ktbWVudScpLnNsaW5reSh7XG4gICAgdGl0bGU6IHRydWUsXG4gICAgbGFiZWw6ICcnXG4gIH0pO1xuXG4gIC8vIEVuYWJsZSAvIGRpc2FibGUgQm9vdHN0cmFwIHRvb2x0aXBzLCBiYXNlZCB1cG9uIHRvdWNoIGV2ZW50c1xuICBpZiAoTW9kZXJuaXpyLnRvdWNoZXZlbnRzKSB7XG4gICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoJ2hpZGUnKTtcbiAgfVxuICBlbHNlIHtcbiAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xuICB9XG5cbiAgLy8gU2Nyb2xsIHRvLlxuICAkKCdbZGF0YS1zY3JvbGwtdG9dJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdmFyICRlbGVtZW50ID0gJCh0aGlzKTtcbiAgICB2YXIgdGFyZ2V0ID0gJGVsZW1lbnQuYXR0cignZGF0YS1zY3JvbGwtdG8nKTtcbiAgICB2YXIgJHRhcmdldCA9ICQodGFyZ2V0KTtcblxuICAgIC8vIFNjcm9sbCB0byB0YXJnZXQuXG4gICAgJChbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBkb2N1bWVudC5ib2R5XSkuYW5pbWF0ZSh7XG4gICAgICBzY3JvbGxUb3A6ICR0YXJnZXQub2Zmc2V0KCkudG9wXG4gICAgfSwgNDAwLCBmdW5jdGlvbigpIHtcblxuICAgICAgLy8gQWRkIHRvIFVSTC5cbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gdGFyZ2V0O1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
