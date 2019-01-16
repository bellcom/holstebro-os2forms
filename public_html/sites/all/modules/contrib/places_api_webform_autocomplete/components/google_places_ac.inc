<?php

/**
 * @file
 * Functions pertaining to the implementation of the webform component.
 */

/**
 * Returns an array of defaults for the webform component.
 */
function _webform_defaults_google_places_ac() {
  return array(
    'name' => '',
    'form_key' => NULL,
    'pid' => 0,
    'weight' => 0,
    'value' => '',
    'mandatory' => 0,
    'extra' => array(
      'field_offset' => '',
      'field_location' => '',
      'field_radius' => '',
      'field_language' => '',
      'field_type' => '',
      'field_components' => '',
      'field_size' => 60,
      'field_maxlength' => 255,
    ),
  );
}

/**
 * Returns an array outlining the theme implementation for the component.
 */
function _webform_theme_google_places_ac() {
  return array(
    'webform_display_google_places_ac' => array(
      'render element' => 'element',
    ),
  );
}

/**
 * Returns a form array of the configuration elements for the component.
 *
 * @param array $component
 *   The current webform component definition.
 */
function _webform_edit_google_places_ac($component) {
  $form = array();

  $weight = 1;
  $form['extra']["field_size"] = array(
    '#type' => 'textfield',
    '#title' => t('Size'),
    '#required' => TRUE,
    '#default_value' => $component['extra']["field_size"],
    '#weight' => $weight += 0.1,
    '#parents' => array('extra', "field_size"),
  );
  $form['extra']["field_maxlength"] = array(
    '#type' => 'textfield',
    '#title' => t('Maxlength'),
    '#required' => TRUE,
    '#default_value' => $component['extra']["field_maxlength"],
    '#weight' => $weight += 0.1,
    '#parents' => array('extra', "field_maxlength"),
  );
  $extra_fields = places_api_webform_autocomplete_get_extra_fields();
  foreach ($extra_fields as $key => $title) {
    $form['extra']["field_$key"] = array(
      '#type' => 'textfield',
      '#title' => $title,
      '#default_value' => $component['extra']["field_$key"],
      '#size' => 60,
      '#maxlength' => 255,
      '#weight' => $weight += 0.1,
      '#parents' => array('extra', "field_$key"),
    );
  }
  return $form;
}

/**
 * Returns a form array of the webform component as presented to the end user.
 *
 * @param array $component
 *   The current webform component definition.
 * @param string $value
 *   The current value.
 * @param bool $filter
 *   Filter flag.
 */
function _webform_render_google_places_ac($component, $value = NULL, $filter = TRUE) {
  $cid = $component['cid'];
  $nid = $component['nid'];
  $node = !empty($nid) ? node_load($nid) : NULL;
  $element = array(
    '#title' => $filter ? webform_filter_xss($component['name']) : $component['name'],
    '#type' => 'textfield',
    '#weight' => $component['weight'],
    '#size' => (int) $component['extra']['field_size'],
    '#maxlength' => (int) $component['extra']['field_maxlength'],
    '#required' => $component['required'],
    '#default_value' =>  $filter ? webform_replace_tokens($component['value'], $node) : $component['value'],
    '#theme_wrappers' => array('webform_element'),

    '#autocomplete_path' => "places/webform_autocomplete/$nid/$cid",
  );
  return $element;
}

/**
 * Returns a renderable array of the webform component as shown in results.
 *
 * @param array $component
 *   The current webform component definition.
 * @param string $value
 *   The current value.
 * @param string $format
 *   Format string.
 */
function _webform_display_google_places_ac($component, $value, $format = 'html') {
  return array(
    '#title' => $component['name'],
    '#weight' => $component['weight'],
    '#theme' => 'webform_display_google_places_ac',
    '#theme_wrappers' => $format == 'html' ? array('webform_element') : array('webform_element_text'),
    '#format' => $format,
    '#value' => $value[0],
    '#translatable' => array('title'),
  );
}

/**
 * Default theme implementation for the webform component.
 *
 * @param array $variables
 *   Array of variables being passed into the theme function.
 */
function theme_webform_display_google_places_ac($variables) {
  $element = $variables['element'];
  $value = $element['#value'];
  return trim($value) !== '' ? $value : ' ';
}

/**
 * Returns string output for the component when displayed in table form.
 *
 * @param array $component
 *   The current webform component definition.
 * @param string $value
 *   The current value.
 */
function _webform_table_google_places_ac($component, $value) {
  return check_plain(empty($value[0]) ? '' : $value[0]);
}

/**
 * Returns header array for when the component is displayed in csv form.
 */
function _webform_csv_headers_google_places_ac($component, $export_options) {
  $header = array();
  $header[0] = '';
  return $header;
}

/**
 * Returns string output for the component when displayed in csv form.
 *
 * @param array $component
 *   The current webform component definition.
 * @param string $value
 *   The current value.
 */
function _webform_csv_data_google_places_ac($component, $export_options, $value) {
  return !isset($value[0]) ? '' : $value[0];
}
