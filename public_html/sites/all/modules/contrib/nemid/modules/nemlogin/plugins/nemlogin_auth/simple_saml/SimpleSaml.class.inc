<?php

define('NEMLOGIN_SIMPLESAML_AUTH_METHOD', 'default-sp');

/**
 * Ctools plugin class NemloginAuthSimpleSaml.
 */
class NemloginAuthSimpleSaml extends NemloginAuth {

  /**
   * Authorization values array.
   *
   * @var SimpleSAML_Auth_Simple
   */
  private $as;

  /**
   * NemloginAuthSimpleSaml constructor.
   *
   * @throws Exception
   */
  public function __construct() {
    $simplesaml_installdir = variable_get('nemlogin_simplesaml_installdir');
    if (file_exists($simplesaml_installdir . '/lib/_autoload.php')) {
      require_once $simplesaml_installdir . '/lib/_autoload.php';
      try {
        $this->as = new SimpleSAML_Auth_Simple(variable_get('nemlogin_simplesaml_default_auth', NEMLOGIN_SIMPLESAML_AUTH_METHOD));
      }
      catch (Exception $e) {
        watchdog("Nemlogin SimpleSaml", 'Cannot initialize simplesaml request: @message', array('@message' => $e->getMessage()), WATCHDOG_ERROR);
      }
    }
    else {
      watchdog("Nemlogin SimpleSaml", 'Simplesaml installtion not found.', array(), WATCHDOG_WARNING);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function isInitialized() {
    return $this->as instanceof SimpleSAML_Auth_Simple;
  }

  /**
   * {@inheritdoc}
   */
  public function isAuthenticated() {
    if (!$this->isInitialized()) {
      return NULL;
    }

    return $this->as->isAuthenticated();
  }

  /**
   * {@inheritdoc}
   */
  public function login() {
    $return_to_url = $this->getReturnUrl();
    if ($this->isInitialized()) {
      $this->as->requireAuth(
        array(
          'ReturnTo' => $return_to_url,
        )
      );
    }
    else {
      drupal_goto($return_to_url);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function logout() {
    $return_to_url = $this->getReturnURL();
    if ($this->isInitialized()) {
      $url = $this->as->getLogoutURL($return_to_url);
      header('Location: ' . $url, TRUE, 302);
      drupal_exit($url);
    }
    else {
      drupal_goto($return_to_url);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm() {
    $form = array();
    $form['nemlogin_simplesaml_installdir'] = array(
      '#type' => 'textfield',
      '#title' => t('Full path to simplesaml installation'),
      '#description' => t('Absolute path to simplesaml installation. Example: /var/simplesaml'),
      '#default_value' => variable_get('nemlogin_simplesaml_installdir'),
      '#required' => TRUE,
    );

    $form['nemlogin_simplesaml_default_auth'] = array(
      '#type' => 'textfield',
      '#title' => t('Simplesaml default auth method'),
      '#description' => t('Default auth method for simplesaml. Example: default-sp'),
      '#default_value' => variable_get('nemlogin_simplesaml_default_auth', NEMLOGIN_SIMPLESAML_AUTH_METHOD),
      '#required' => TRUE,
    );

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsFormValidate(array &$form, array &$form_state) {
    parent::settingsFormValidate($form, $form_state);

    $nemlogin_simplesaml_installdir = $form_state['values']['nemlogin_simplesaml_installdir'];
    if (!file_exists($nemlogin_simplesaml_installdir)) {
      form_set_error('nemlogin_simplesaml_installdir', t("Path %path doen't exist.", array('%path' => $nemlogin_simplesaml_installdir)));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function fetchValue($key) {
    if (empty($this->as) || !$this->as->isAuthenticated()) {
      return NULL;
    }

    // Make first char uppercase and suffixing with NumberIdentifier.
    $key = ucfirst(strtolower($key));
    $key .= 'NumberIdentifier';

    $attrs = $this->as->getAttributes();
    $value = NULL;

    if (is_array($attrs) && isset($attrs["dk:gov:saml:attribute:$key"])) {
      if (is_array($attrs["dk:gov:saml:attribute:$key"]) && isset($attrs["dk:gov:saml:attribute:$key"][0])) {
        $value = $attrs["dk:gov:saml:attribute:$key"][0];
      }
    }

    return $value;
  }

}
