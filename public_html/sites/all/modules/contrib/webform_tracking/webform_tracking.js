(function($) {

Drupal.behaviors.webform_tracking = {
  extra_parameters: {
    "source"   : "s",
    "medium"   : "m",
    "version"  : "v",
    "other"    : "o",
    "term"     : "t",
    "campaign" : "c",
    "refsid"   : "refsid",
  },
  google_analytics: {
    "source"   : "utm_source",
    "medium"   : "utm_medium",
    "term"     : "utm_term",
    "version"  : "utm_content",
    "campaign" : "utm_campaign",
  },

  attach: function(context) {
    // Run only once per page-load.
    if (context == document) {
      this.run();
    }
  },

  // Get white listed parameters.
  extract_parameters: function(parameters) {
    var data = {};
    var map = this.extra_parameters;
    for (var key in map) {
      var candidates = [key, map[key], this.google_analytics[key]];

      // Take first candidate key with a value.
      for (var i = 0, l = candidates.length; i < l; i++) {
        var value = parameters[candidates[i]];
        if (value) {
          data[key] = value;
          break;
        }
      }
    }
    return data;
  },

  // Adds the URL to a history array (if needed).
  history_add: function(history, url) {
    var length = history.length;
    if (length) {
      // Only add new values (ignore page refreshes).
      if (history[history.length-1] != url) {
        history.push(url);
      }
    }
    else {
      length = history.push(url);
    }
    // Truncate the array if it gets too big.
    if (length > 10) {
      // We keep:
      // [0] is the entry page
      // [-3] might be the last page before the form == referer
      // [-2] might be the form
      // [-1] might be the forms /done page
      // 10 is an arbitrary value, you just might want to avoid
      // calling the array functions below on every request if not
      // necessary.
      history = [history[0]];
      $.merge(history, history.slice(-3));
    }
  },

  run: function() {
    var cookie_data;
    try {
      cookie_data = JSON.parse($.cookie('webform_tracking') || '{}');
    } catch(err) {
      cookie_data = {};
    }
    var tracking_data = $.extend({
      history: [],
      tags: [],
    }, cookie_data);
    var parameters = this.get_url_parameters();
    var base_url = Drupal.settings.webform_tracking.base_url;

    var dnt = window.navigator.doNotTrack;
    var respect_dnt = Drupal.settings.webform_tracking.respect_dnt;
    if ((dnt === "yes" || dnt == "1") && respect_dnt) {
      return;
    }

    tracking_data.user_id = tracking_data.user_id || this.new_user_id();

    // tags
    var tags = tracking_data.tags || [];
    if (typeof parameters['tag'] !== 'undefined') {
      $.merge(tags, parameters['tag'].split(','));
    }
    tracking_data.tags = this.sort_unique(tags);

    // extra parameters
    $.extend(tracking_data, this.extract_parameters(parameters));

    // If the referer does not start with $base_url, it's external but we
    // only take the first external referer to avoid problems with off-site
    // redirects (e.g. in payment forms).
    // if no referer is send, check if we got one via the GET-parameters
    if (typeof tracking_data['external_referer'] === 'undefined') {
      if (document.referrer.indexOf(base_url) !== 0) {
        tracking_data['external_referer'] = document.referrer;
      }
      else if (typeof parameters['external_referer'] !== 'undefined' && parameters['external_referer'].indexOf(base_url) !== 0) {
        tracking_data['external_referer'] = parameters['external_referer'];
      }
    }

    // history
    this.history_add(tracking_data.history, window.location.href);

    $.cookie('webform_tracking', JSON.stringify(tracking_data), {path: '/'});
  },

  get_url_parameters: function() {
    var parameters = {};
    var variables = window.location.search.substring(1).split('&');
    for (var i = 0; i < variables.length; i++) {
      var parameter = variables[i].split('=');
      parameters[parameter[0]] = parameter[1];
    };
    return parameters;
  },

  new_user_id: function() {
    // http://x443.wordpress.com/2012/03/18/adler32-checksum-in-javascript/
    var adler32 =  function(a,b,c,d,e,f) {
      for (b=65521,c=1,d=e=0;f=a.charCodeAt(e++); d=(d+c)%b) c=(c+f)%b;
      return(d<<16)|c
    }
    return adler32(String(Math.random() + Date.now()));
  },

  sort_unique: function(array) {
    if (!array.length) {
      return array;
    }
    array = array.sort(function (a, b) { return a - b; });
    var result = [array[0]];
    for (var i = 1; i < array.length; i++) {
      if (array[i-1] !== array[i]) {
        result.push(array[i]);
      }
    }
    return result;
  }
}

})(jQuery);
