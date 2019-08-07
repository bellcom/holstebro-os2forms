<?php

/**
 * @file
 * Webform module NemID Company RID component.
 */

/**
 * Implements _webform_defaults_component().
 */
function _webform_defaults_nemid_com_rid() {
  return array_merge_recursive(array(
    'extra' => array(
      'maxlength' => '10',
    ),
  ), nemid_webform_defaults_component());
}

/**
 * Implements _webform_edit_component().
 */
function _webform_edit_nemid_com_rid($component) {
  return nemid_webform_edit_component($component);
}

/**
 * Implements _webform_render_component().
 */
function _webform_render_nemid_com_rid($component, $value = NULL, $filter = TRUE, $submission = NULL) {
  $element = nemid_webform_render_component($component, $value, $filter, $submission);

  if (isset($_SESSION['nemid_login']['rid'])) {
    $element['#default_value'] = $_SESSION['nemid_login']['rid'];
  }

  return $element;
}

/**
 * Implements _webform_display_component().
 */
function _webform_display_nemid_com_rid($component, $value, $format = 'html', $submission = array()) {
  return nemid_webform_display_component($component, $value, $format, $submission);
}

/**
 * Implements _webform_analysis_component().
 */
function _webform_analysis_nemid_com_rid($component, $sids = array(), $single = FALSE, $join = NULL) {
  return nemid_webform_analysis_component($component, $sids, $single, $join);
}

/**
 * Implements _webform_table_component().
 */
function _webform_table_nemid_com_rid($component, $value) {
  return nemid_webform_table_component($component, $value);
}

/**
 * Implements _webform_action_set_component().
 */
function _webform_action_set_nemid_com_rid($component, &$element, &$form_state, $value) {
  nemid_webform_action_set_component($component, $element, $form_state, $value);
}

/**
 * Implements _webform_csv_headers_component().
 */
function _webform_csv_headers_nemid_com_rid($component, $export_options) {
  return nemid_webform_csv_headers_component($component, $export_options);
}

/**
 * Implements _webform_csv_data_component().
 */
function _webform_csv_data_nemid_com_rid($component, $export_options, $value) {
  return nemid_webform_csv_data_component($component, $export_options, $value);
}

/**
 * Implements _form_builder_webform_form_builder_types_component().
 */
function _form_builder_webform_form_builder_types_nemid_com_rid() {
  return nemid_form_builder_webform_form_builder_types_nemid_com_name('nemid_com_rid', t('RID'));
}

/**
 * Implements _form_builder_webform_form_builder_map_component().
 */
function _form_builder_webform_form_builder_map_nemid_com_rid() {
  return array(
    'form_builder_type' => 'nemid_com_rid',
  ) + nemid_form_builder_webform_form_builder_map_component();
}

/**
 * Implements _form_builder_webform_form_builder_properties_component().
 */
function _form_builder_webform_form_builder_properties_nemid_com_rid() {
  return nemid_form_builder_webform_form_builder_properties_component();
}
