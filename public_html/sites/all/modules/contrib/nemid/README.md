NemID integration
-------------------------
The purpose of module is to provide a reusable webform components, which listed in components subfolder. As well as settings placeholder and some reusable functions (that could be used in the child modules).
Module provides 4 submodules. Below comes a description for each of them.

## Nemlogin
Adds an option to the webform to expose “Login with nemid” link.
That link will call simplesaml (must be installed on the same server) to initiate login via external IdP system.
After the login has been successful the module will call to an external service (via vcv_serviceplatformen or cvr_serviceplatformen modules) and ensure that the webform fields will be filled with person/company data (only fields/webform components that are provided by drupal_nemid module).

Settings path: `admin/config/nemid/nemlogin`

## Nemid_login
Adds an option to the webform to expose “Login with nemid” block.
This block does a default nemid authentication (CPR + PASSWORD, then password rfom NemID card).
After the login has been successful the module will call to an external service (via vcv_serviceplatformen modules) and ensure that the webform fields will be filled with person data (only fields/webform components that are provided by drupal_nemid module).

Settings path: `admin/config/nemid/nemid_login`

## Vcv_serviceplatformen
Provides an integration with Serviceplatformen webservice, Person stamdata (lokal).
This webservice returns a person basic information (like name, address etc) based on the provided CPR number.

Settings path: `admin/config/nemid/vcv_serviceplatformen`

## Cvr_serviceplatformen
Provide an integration with Serviceplatformen webservice: CVR Online 3.0.
This webservice returns a company basic information (like name, address etc) based on the provided CVR number.

Settings path: `admin/config/nemid/cvr_serviceplatformen`
