Webform tracking
================

...collects data about your users and associates it with their
[webform](https://drupal.org/project/webform) submissions. If you want to
actually see the resulting data you need to apply the patch in
[#2117285](https://drupal.org/node/2117285), to webform (or implement a better
solution ;))

Collected data includes:

* External referer: external page your user came from (if any)
* Entry page: first page on your site visited by this user
* Internal referer: last page your user visited before the form
* Form url: url of the page, the submitted webform was displayed on. Might
  differ from the url of the webform itself it was embedded as a block for
  example.
* IP address of the user
* A user id, if possible (It tries to recognize returning visitors based on
  session_caches session_id.)

As well as the following (easily extendable) GET-parameters (set them in the
links your share!):

* tags
* source
* medium
* version
* other

Webform tracking respects Do-Not-Track by default, but  site-administrators
can choose to ignore it.

developed by [more onion](http://more-onion.com)
