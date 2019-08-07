<?php

/**
 * @file
 * Webform module NemID Postal/City component.
 */

/**
 * Implements _webform_defaults_component().
 */
function _webform_defaults_nemid_city() {
  return array_merge_recursive(array(
    'extra' => array(
      'get_from_cpr' => '',
    ),
  ), nemid_webform_defaults_component());
}

/**
 * Implements _webform_edit_component().
 */
function _webform_edit_nemid_city($component) {
  $form = array();
  $form['get_from_cpr'] = array(
    '#type' => 'checkbox',
    '#title' => t('Get from CPR'),
    '#return_value' => 1,
    '#description' => t('Get data from CPR and disable if data is available.'),
    '#weight' => 1,
    '#default_value' => $component['extra']['get_from_cpr'],
    '#parents' => array('extra', 'get_from_cpr'),
  );
  return $form + nemid_webform_edit_component($component);
}

/**
 * Implements _webform_render_component().
 */
function _webform_render_nemid_city($component, $value = NULL, $filter = TRUE, $submission = NULL) {
  $element = nemid_webform_render_component($component, $value, $filter, $submission);

  if (isset($value[0])) {
    $element['#default_value'] = $value[0];
  }

  return $element;
}

/**
 * Implements _webform_display_component().
 */
function _webform_display_nemid_city($component, $value, $format = 'html', $submission = array()) {
  return nemid_webform_display_component($component, $value, $format, $submission);
}

/**
 * Implements _webform_analysis_component().
 */
function _webform_analysis_nemid_city($component, $sids = array(), $single = FALSE, $join = NULL) {
  return nemid_webform_analysis_component($component, $sids, $single, $join);
}

/**
 * Implements _webform_table_component().
 */
function _webform_table_nemid_city($component, $value) {
  return nemid_webform_table_component($component, $value);
}

/**
 * Implements _webform_action_set_component().
 */
function _webform_action_set_nemid_city($component, &$element, &$form_state, $value) {
  nemid_webform_action_set_component($component, $element, $form_state, $value);
}

/**
 * Implements _webform_csv_headers_component().
 */
function _webform_csv_headers_nemid_city($component, $export_options) {
  return nemid_webform_csv_headers_component($component, $export_options);
}

/**
 * Implements _webform_csv_data_component().
 */
function _webform_csv_data_nemid_city($component, $export_options, $value) {
  return nemid_webform_csv_data_component($component, $export_options, $value);
}

/**
 * Implements _form_builder_webform_form_builder_types_component().
 */
function _form_builder_webform_form_builder_types_nemid_city() {
  return nemid_form_builder_webform_form_builder_types_nemid_com_name('nemid_city', t('City'));
}

/**
 * Implements _form_builder_webform_form_builder_map_component().
 */
function _form_builder_webform_form_builder_map_nemid_city() {
  return array(
    'form_builder_type' => 'nemid_name',
  ) + nemid_form_builder_webform_form_builder_map_component();
}

/**
 * Implements _form_builder_webform_form_builder_properties_component().
 */
function _form_builder_webform_form_builder_properties_nemid_city() {
  return nemid_form_builder_webform_form_builder_properties_component();
}
