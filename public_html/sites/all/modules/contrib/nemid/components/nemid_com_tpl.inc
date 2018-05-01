<?php

/**
 * @file
 * Webform module NemID component template.
 */

/**
 * Implements template for _webform_defaults_component().
 */
function nemid_webform_defaults_component() {
  return array(
    'name' => '',
    'form_key' => NULL,
    'pid' => 0,
    'weight' => 0,
    'value' => '',
    'required' => 0,
    'extra' => array(
      'width' => '',
      'maxlength' => '',
      'disabled' => 0,
      'unique' => 0,
      'title_display' => 0,
      'description' => '',
      'placeholder' => '',
      'attributes' => array(),
      'private' => FALSE,
      'analysis' => FALSE,
      'field_prefix' => '',
      'field_suffix' => '',
    ),
  );
}

/**
 * Implements template for _webform_edit_component().
 */
function nemid_webform_edit_component($component) {
  $form = array();
  $form['value'] = array(
    '#type' => 'textfield',
    '#title' => t('Default value'),
    '#default_value' => $component['value'],
    '#description' => t('The default value of the field.') . ' ' . theme('webform_token_help'),
    '#size' => 60,
    '#maxlength' => 1024,
    '#weight' => 0,
  );
  $form['display']['placeholder'] = array(
    '#type' => 'textfield',
    '#title' => t('Placeholder'),
    '#default_value' => $component['extra']['placeholder'],
    '#description' => t('The placeholder will be shown in the field until the user starts entering a value.'),
    '#weight' => 10,
    '#parents' => array('extra', 'placeholder'),
  );
  $form['display']['disabled'] = array(
    '#type' => 'checkbox',
    '#title' => t('Readonly'),
    '#default_value' => $component['extra']['disabled'],
    '#description' => t('Make this field non-editable. Useful for setting an unchangeable default value.'),
    '#weight' => 20,
    '#parents' => array('extra', 'disabled'),
  );
  return $form;
}

/**
 * Implements template for _webform_render_component().
 */
function nemid_webform_render_component($component, $value = NULL, $filter = TRUE, $submission = NULL) {
  $node = isset($component['nid']) ? node_load($component['nid']) : NULL;

  $element = array(
    '#type' => 'textfield',
    '#title' => $filter ? webform_filter_xss($component['name']) : $component['name'],
    '#title_display' => $component['extra']['title_display'] ? $component['extra']['title_display'] : 'before',
    '#default_value' => $filter ? webform_replace_tokens($component['value'], $node) : $component['value'],
    '#required' => $component['required'],
    '#weight' => $component['weight'],
    '#field_prefix' => empty($component['extra']['field_prefix']) ? NULL : ($filter ? webform_filter_xss($component['extra']['field_prefix']) : $component['extra']['field_prefix']),
    '#field_suffix' => empty($component['extra']['field_suffix']) ? NULL : ($filter ? webform_filter_xss($component['extra']['field_suffix']) : $component['extra']['field_suffix']),
    '#description' => $filter ? webform_filter_descriptions($component['extra']['description'], $node) : $component['extra']['description'],
    '#attributes' => $component['extra']['attributes'],
    '#theme_wrappers' => array('webform_element'),
    '#translatable' => array(
      'title',
      'description',
      'field_prefix',
      'field_suffix',
    ),
  );

  if ($component['required']) {
    $element['#attributes']['required'] = 'required';
  }

  if ($component['extra']['placeholder']) {
    $element['#attributes']['placeholder'] = $component['extra']['placeholder'];
  }

  if ($component['extra']['disabled']) {
    if ($filter) {
      $element['#attributes']['readonly'] = 'readonly';
    }
    else {
      $element['#disabled'] = TRUE;
    }
  }

  // Enforce uniqueness.
  if ($component['extra']['unique']) {
    $element['#element_validate'][] = 'webform_validate_unique';
  }

  // Change the 'width' option to the correct 'size' option.
  if ($component['extra']['width'] > 0) {
    $element['#size'] = $component['extra']['width'];
  }
  if ($component['extra']['maxlength'] > 0) {
    $element['#maxlength'] = $component['extra']['maxlength'];
  }

  return $element;
}

/**
 * Implements template for _webform_display_component().
 */
function nemid_webform_display_component($component, $value, $format = 'html', $submission = array()) {
  return array(
    '#title' => $component['name'],
    '#title_display' => $component['extra']['title_display'] ? $component['extra']['title_display'] : 'before',
    '#weight' => $component['weight'],
    '#theme' => 'webform_display_textfield',
    '#theme_wrappers' => $format == 'html' ? array('webform_element') : array('webform_element_text'),
    '#field_prefix' => $component['extra']['field_prefix'],
    '#field_suffix' => $component['extra']['field_suffix'],
    '#format' => $format,
    '#value' => isset($value[0]) ? $value[0] : '',
    '#translatable' => array('title', 'field_prefix', 'field_suffix'),
  );
}

/**
 * Implements template for _webform_analysis_component().
 */
function nemid_webform_analysis_component($component, $sids = array(), $single = FALSE, $join = NULL) {
  $query = db_select('webform_submitted_data', 'wsd', array('fetch' => PDO::FETCH_ASSOC))
    ->fields('wsd', array('data'))
    ->condition('wsd.nid', $component['nid'])
    ->condition('wsd.cid', $component['cid']);

  if (count($sids)) {
    $query->condition('wsd.sid', $sids, 'IN');
  }

  if ($join) {
    $query->innerJoin($join, 'ws2_', 'wsd.sid = ws2_.sid');
  }

  $nonblanks = 0;
  $submissions = 0;
  $wordcount = 0;

  $result = $query->execute();
  foreach ($result as $data) {
    if (drupal_strlen(trim($data['data'])) > 0) {
      $nonblanks++;
      $wordcount += str_word_count(trim($data['data']));
    }
    $submissions++;
  }

  $rows[0] = array(t('Left Blank'), ($submissions - $nonblanks));
  $rows[1] = array(t('User entered value'), $nonblanks);

  $other[] = array(
    t('Average submission length in words (ex blanks)'),
    ($nonblanks != 0 ? number_format($wordcount / $nonblanks, 2) : '0'),
  );

  return array(
    'table_rows' => $rows,
    'other_data' => $other,
  );
}

/**
 * Implements template for _webform_table_component().
 */
function nemid_webform_table_component($component, $value) {
  return check_plain(empty($value[0]) ? '' : $value[0]);
}

/**
 * Implements template for _webform_action_set_component().
 */
function nemid_webform_action_set_component($component, &$element, &$form_state, $value) {
  $element['#value'] = $value;
  form_set_value($element, $value, $form_state);
}

/**
 * Implements template for _webform_csv_headers_component().
 */
function nemid_webform_csv_headers_component($component, $export_options) {
  $header = array();
  $header[0] = '';
  $header[1] = '';
  $header[2] = $export_options['header_keys'] ? $component['form_key'] : $component['name'];
  return $header;
}

/**
 * Implements template for _webform_csv_data_component().
 */
function nemid_webform_csv_data_component($component, $export_options, $value) {
  return !isset($value[0]) ? '' : $value[0];
}

/**
 * Implements template for _form_builder_webform_form_builder_types_component().
 */
function nemid_form_builder_webform_form_builder_types_nemid_com_name($key, $label) {
  $fields = array();

  $fields[$key] = array(
    'title' => t('NemID @label', array('@label' => $label)),
    'weight' => -20,
  );
  $component['name'] = t('New NemID @label', array('@label' => $label));
  $fields[$key]['default'] = _form_builder_webform_default($key, array(), $component);

  return $fields;
}

/**
 * Implements template for _form_builder_webform_form_builder_map_component().
 */
function nemid_form_builder_webform_form_builder_map_component() {
  return array(
    'form_builder_type' => 'nemid_component',
    'properties' => array(
      'size' => array(
        'storage_parents' => array('extra', 'width'),
      ),
      'maxlength' => array(
        'storage_parents' => array('extra', 'maxlength'),
      ),
      'field_prefix' => array(
        'storage_parents' => array('extra', 'field_prefix'),
      ),
      'field_suffix' => array(
        'storage_parents' => array('extra', 'field_suffix'),
      ),
      'disabled' => array(
        'storage_parents' => array('extra', 'disabled'),
      ),
      'unique' => array(
        'storage_parents' => array('extra', 'unique'),
      ),
    ),
  );
}

/**
 * Implements tpl for _form_builder_webform_form_builder_properties_component().
 */
function nemid_form_builder_webform_form_builder_properties_component() {
  return array(
    'unique' => array(
      'form' => 'form_builder_webform_property_unique_form',
    ),
  );
}
