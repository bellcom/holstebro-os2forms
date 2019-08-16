<?php

define('NEMLOGIN_IDP_LOGINSERVICE_PATH', '/service/loginservice.wsdl');
define('NEMLOGIN_IDP_LOGIN_PATH', '/nemlogin.php');
define('NEMLOGIN_IDP_LOGOUT_PATH', '/nemlogout.php');
define('NEMLOGIN_IDP_FETCH_ONCE', TRUE);

/**
 * Ctools plugin class NemloginAuthIDP.
 */
class NemloginAuthIDP extends NemloginAuth {

  /**
   * Identity provider URL.
   *
   * @var string
   */
  private $idpUrl;

  /**
   * Fetch only mode flag.
   *
   * @var bool
   */
  private $fetchOnce;

  /**
   * Authorization object.
   *
   * @var SoapClient
   */
  private $soapClient;

  /**
   * NemloginAuthSimpleSaml constructor.
   *
   * @throws Exception
   */
  public function __construct() {
    $this->idpUrl = variable_get('nemlogin_idp_url');
    $this->fetchOnce = variable_get('nemlogin_idp_fetch_once', NEMLOGIN_IDP_FETCH_ONCE);

    if (!valid_url($this->idpUrl, TRUE)) {
      watchdog("Nemlogin Idp", 'Idp URL not not valid or empty.', array(), WATCHDOG_WARNING);
      return;
    }

    // Authentification values stored in session.
    if (!isset($_SESSION['nemlogin_idp'])) {
      $_SESSION['nemlogin_idp'] = array();
    }
    $this->values = &$_SESSION['nemlogin_idp'];

    // Init authentication object.
    try {
      $this->soapClient = new SoapClient($this->idpUrl . NEMLOGIN_IDP_LOGINSERVICE_PATH);
    }
    catch (Exception $e) {
      watchdog('Nemlogin Idp', 'Cannot initialize auth SOAP object: @message', array('@message' => $e->getMessage()), WATCHDOG_ERROR);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function isInitialized() {
    return $this->soapClient instanceof SoapClient;
  }

  /**
   * {@inheritdoc}
   */
  public function login() {
    if (empty($_REQUEST['token'])) {
      global $base_url;
      $forward_url = $base_url . request_uri();
      $url = url($this->idpUrl . NEMLOGIN_IDP_LOGIN_PATH, array(
        'query' => array(
          'mnemo' => variable_get('nemlogin_idp_mnemo'),
          'forward' => $forward_url,
        ),
      ));
      header('Location: ' . $url, TRUE, 302);
      drupal_exit($url);
    }

    $token = $_REQUEST['token'];
    $mnemo = $_REQUEST['mnemo'];

    $response = NULL;
    $cpr = NULL;
    $pid = NULL;

    try {
      $response = $this->soapClient->LogIn(array('token' => $token, 'mnemo' => $mnemo));
    }
    catch (Exception $e) {
      watchdog('Nemlogin', 'Cannot initialize request: @message', array('@message' => $e->getMessage()), WATCHDOG_ERROR);
    }

    if ($response && isset($response->LogInResult)) {
      // We need to store CPR and PID value between redirects
      // to be able use it in a a signup form.
      // This value will be deleted after first usage.
      // @see $this->fetchValue() method.

      $cprraw = $response->LogInResult->cpr;
      if ($cprraw) {
        $cpr = utf8_decode($cprraw);
        $this->values['cpr'] = $cpr;
      }

      $pidraw = $response->LogInResult->pid;
      if ($pidraw) {
        $pid = utf8_decode($pidraw);
        $this->values['pid'] = $pid;
      }
    }

    if (!$cpr) {
      watchdog('nemlogin Idp', 'Could not fetch CPR. Response is empty', array(), WATCHDOG_WARNING);
    }
    if (!$pid) {
      watchdog('nemlogin Idp', 'Could not fetch PID. Response is empty', array(), WATCHDOG_WARNING);
    }

    if ($this->fetchOnce) {
      $return_to_url = $this->getReturnUrl();
      $this->destroySession($return_to_url);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function logout() {
    // Reset all values.
    $this->values = NULL;

    $this->destroySession($this->getReturnUrl());
  }

  /**
   * Destroys identity provider session.
   *
   * @param string $callback
   *   Callback URL.
   */
  private function destroySession($callback) {
    $getParams = http_build_query(
      array(
        'RelayState' => $callback,
      )
    );
    $idp = variable_get('nemlogin_idp_url', 'https://nemlogin.bellcom.dk/simplesaml');
    $url = $idp . NEMLOGIN_IDP_LOGOUT_PATH . '?' . $getParams;
    header('Location: ' . $url, TRUE, 302);
    drupal_exit($url);
  }

  /**
   * {@inheritdoc}
   */
  public function fetchValue($key) {
    $value = NULL;
    if (isset($this->values[$key])) {
      $value = $this->values[$key];
    }

    if ($this->fetchOnce) {
      unset($this->values[$key]);
    }
    return $value;
  }

  /**
   * {@inheritdoc}
   */
  public function isAuthenticated() {
    // If user has any authenticated data consider it as authenticated.
    return !empty($this->values);
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm() {
    $form = array();
    $form['nemlogin_idp_url'] = array(
      '#type' => 'textfield',
      '#title' => t('URL of IDP system.'),
      '#required' => TRUE,
      '#default_value' => variable_get('nemlogin_idp_url'),
      '#description' => t('E.g. https://nemlogin.bellcom.dk/simplesaml. NB! Do not include the trailing slash.'),
    );
    $form['nemlogin_idp_mnemo'] = array(
      '#type' => 'textfield',
      '#title' => t('IDP mnemo key.'),
      '#required' => TRUE,
      '#default_value' => variable_get('nemlogin_idp_mnemo'),
      '#description' => t('Value for IDP mnemo key. Example: bellcom.dk'),
    );
    $form['nemlogin_idp_fetch_once'] = array(
      '#type' => 'checkbox',
      '#title' => t('Use fetch only mode.'),
      '#default_value' => variable_get('nemlogin_idp_fetch_once', NEMLOGIN_IDP_FETCH_ONCE),
      '#description' => t('User will be logged out immediately after login. User data will be removed from session after first retrieving'),
    );

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsFormValidate(array &$form, array &$form_state) {
    parent::settingsFormValidate($form, $form_state);

    $idp = $form_state['values']['nemlogin_idp_url'];
    if (strcmp(substr($idp, -1), '/') === 0) {
      form_set_error('nemlogin_idp_url', t('Please remove the trailing slash'));
    }

    if (!valid_url($idp, TRUE)) {
      form_set_error('nemlogin_idp_url', t('URL does not valid'));
    }

    $url_to_test = array(
      $idp . NEMLOGIN_IDP_LOGINSERVICE_PATH,
      $idp . NEMLOGIN_IDP_LOGIN_PATH,
      $idp . NEMLOGIN_IDP_LOGOUT_PATH,
    );

    // Testing if we have access to all URLs.
    foreach ($url_to_test as $url) {
      $url_request = drupal_http_request($url);
      if ($url_request->code != 200 && $url_request->redirect_code != 302) {
        form_set_error('nemlogin_idp_url', t('%url cannot be accessed. Response code: %code', array(
          '%url' => $url,
          '%code' => $url_request->code,
        )));
      }
    }
  }

}
