<?php

/**
 * @file
 * Contains SOAP related functions.
 */

/**
 * Performs getLegalUnit query.
 */
function cvr_serviceplatformen_get_legal_unit($cvr) {
  ini_set('soap.wsdl_cache_enabled', 0);
  ini_set('soap.wsdl_cache_ttl', 0);

  try {
    $client = cvr_serviceplatformen_get_client();

    $request = cvr_serviceplatformen_initiate_request();
    $request['GetLegalUnitRequest'] = array(
      'level' => 1,
      'UserId' => NULL,
      'Password' => NULL,
      'LegalUnitIdentifier' => $cvr,
    );
    $response = (array) $client->getLegalUnit($request)->GetLegalUnitResponse->LegalUnit;

    $response['status'] = TRUE;
    return $response;
  }
  catch (Exception $e) {
    list($fault, $message) = explode(':', $e->faultstring);

    if (!$message) {
      $message = $e->faultstring;
    }

    return array(
      'status' => FALSE,
      'text' => $message,
    );
  }
}

/**
 * Creates and returns the creates SOAP client.
 *
 * @return SoapClient
 *   The SOAP Client object.
 */
function cvr_serviceplatformen_get_client() {
  $mode = variable_get('cvr_serviceplatformen_mode_selector');
  $wsdl_address = variable_get('cvr_serviceplatformen_wsdl');
  $service_location = ($mode == 0) ? variable_get('cvr_serviceplatformen_location') : variable_get('cvr_serviceplatformen_location_test');
  $certfile_passphrase = variable_get('cvr_serviceplatformen_certfile_passphrase');
  $certfile = ($mode == 0) ? variable_get('cvr_serviceplatformen_certfile') : variable_get('cvr_serviceplatformen_certfile_test');

  $client = new SoapClient($wsdl_address, array(
    'location' => $service_location,
    'local_cert' => $certfile,
    'passphrase' => $certfile_passphrase,
    'trace' => TRUE,
  ));

  return $client;
}

/**
 * Prepares and returns request to SOAP by filling in the auth parameters.
 *
 * @return array
 *   The request array.
 */
function cvr_serviceplatformen_initiate_request() {
  $serviceagreementuuid = variable_get('cvr_serviceplatformen_serviceagreementuuid');
  $usersystemuuid = variable_get('cvr_serviceplatformen_usersystemuuid');
  $useruuid = variable_get('cvr_serviceplatformen_useruuid');
  $serviceuuid = variable_get('cvr_serviceplatformen_serviceuuid');
  $accountinginfo = variable_get('cvr_serviceplatformen_accountinginfo');
  global $user;
  $onbehalfofuser = $user->name;

  $request = array();
  $request['InvocationContext'] = array(
    'ServiceAgreementUUID' => $serviceagreementuuid,
    'UserSystemUUID' => $usersystemuuid,
    'UserUUID' => $useruuid,
    'ServiceUUID' => $serviceuuid,
    'AccountingInfo' => $accountinginfo,
    'OnBehalfOfUser' => $onbehalfofuser,
  );

  return $request;
}
