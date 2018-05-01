(function($){
  /**
   * JS part of NemID login module
   */
  Drupal.behaviors.nemidLogin = {
    attach: function (context) {

      function onNemIDMessage(e) {
        var event = e || event;

        var win = document.getElementById("nemid_iframe").contentWindow, postMessage = {}, message;
        message = JSON.parse(event.data);

        if (message.command === "SendParameters") {
          var htmlParameters = document.getElementById("nemid_parameters").innerHTML;

          postMessage.command = "parameters";
          postMessage.content = htmlParameters;
          win.postMessage(JSON.stringify(postMessage), Drupal.settings.nemidLogin.danid_baseurl);
        }

        if (message.command === "changeResponseAndSubmit") {
          document.postBackForm.response.value = message.content;
          document.postBackForm.submit();
        }
      }

      if (window.addEventListener) {
        window.addEventListener("message", onNemIDMessage);
      } else if (window.attachEvent) {
        window.attachEvent("onmessage", onNemIDMessage);
      }
    }
  }
})(jQuery);
