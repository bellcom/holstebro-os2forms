<?php

/**
 * @file
 * Building forms
 */

/**
 * An additional form submit handler for webform settings.
 * Make sure to create default fields nodes for all content type that are webform-enabled.
 */
function webform_default_fields_form_webform_admin_settings_submit($form, $form_state) {
  $type = !empty($form['#node_type']->type) ? $form['#node_type']->type : $form_state['values']['type'];
  if (!empty($form_state['values']['webform_node']) && !empty($form_state['values']['webform_default_fields'])) {
    variable_set('webform_default_fields_allow_node_' . $type, TRUE);
    _webform_default_fields_container_node($type, FALSE);
  }
  else {
    variable_set('webform_default_fields_allow_node_' . $type, FALSE);
    _webform_default_fields_delete_container_node($type, TRUE);
  }
  menu_rebuild(); 
}
