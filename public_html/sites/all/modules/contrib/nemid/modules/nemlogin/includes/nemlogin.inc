<?php

/**
 * @file
 * Include Nemlogin help functions.
 */

/**
 * Nemlogin auth interface.
 */
interface NemloginAuthInterface {

  /**
   * Check plugin initialization status.
   *
   * @return bool
   *   Boolean value about plugin initialization status.
   */
  public function isInitialized();

  /**
   * Check authorization status.
   *
   * @return bool
   *   Boolean value about authorization status.
   */
  public function isAuthenticated();

  /**
   * Main login method.
   */
  public function login();

  /**
   * Main logout method.
   */
  public function logout();

  /**
   * Fetch authorization value by key.
   *
   * @param string $key
   *   Key for fetching value.
   *
   * @return string
   *   Authorization value.
   */
  public function fetchValue($key);

  /**
   * Defines plugin settings form elements.
   *
   * @return array
   *   Settings form array.
   */
  public function settingsForm();

  /**
   * Defines plugin settings validate handler.
   *
   * @param array $form
   *   Form array.
   * @param array $form_state
   *   Form state array.
   */
  public function settingsFormValidate(array &$form, array &$form_state);

  /**
   * Defines plugin settings submit handler.
   *
   * @param array $form
   *   Form array.
   * @param array $form_state
   *   Form state array.
   */
  public function settingsFormSubmit(array &$form, array &$form_state);

}

/**
 * NemidAuth base class.
 */
abstract class NemloginAuth implements NemloginAuthInterface {

  /**
   * Authorization values array.
   *
   * @var array
   */
  protected $values;

  /**
   * {@inheritdoc}
   */
  public function fetchValue($key) {
    return isset($this->values[$key]) ? $this->values[$key] : NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm() {
  }

  /**
   * {@inheritdoc}
   */
  public function settingsFormValidate(array &$form, array &$form_state) {
  }

  /**
   * {@inheritdoc}
   */
  public function settingsFormSubmit(array &$form, array &$form_state) {
  }

  /**
   * Build return link based on data from current request.
   *
   * @return string
   *   Return link URL.
   */
  protected function getReturnUrl() {
    global $base_url, $base_path;
    $destination = drupal_get_destination();
    if ($destination['destination'] == ltrim(request_uri(), '/')) {
      $destination['destination'] = '';
    }
    return $base_url . $base_path . $destination['destination'];
  }

}
