<?php

/**
 * Theming webform components page.
 * @param object $node
 * @return array
 */
function webform_default_fields_reset($node) {
  $output = drupal_get_form('webform_default_fields_reset_components_form', $node);
  return array(
    '#theme' => 'webform_components_page',
    '#node' => $node,
    '#form' => $output,
  );
}

/**
 * Form with default components webform.
 * @param array $form
 * @param array $form_state
 * @param object $node
 * @return array
 */
function webform_default_fields_reset_components_form($form, $form_state, $node) {
  $type_url_str = str_replace('-', '_', $node->type);
  $default_nid = _webform_default_fields_container_node($type_url_str);
  $default_node = node_load($default_nid);
  $components = webform_default_fields_reset_components_list($node, $default_node);
  $modify_styles = array(
    '-' => 'info',
    'Restore' => 'warning',
    'Delete' => 'error',
    'Add' => 'ok',
  );
  $reset_parts = array(
    'emails' => t('E-mails'),
    'settings' => t('Form settings'),
    'components' => t('Form components'),
  );
  $form = array(
    '#tree' => TRUE,
    'components' => array(),
  );
  $form['reset_components'] = array(
    '#type' => 'fieldset',
    '#title' => t('Reset components'),
  );
  $form['reset_global'] = array(
    '#type' => 'fieldset',
    '#collapsible' => TRUE, 
    '#collapsed' => TRUE,
    '#title' => t('Global reset'),
  );
  $form['nid'] = array(
    '#type' => 'value',
    '#value' => $node->nid,
  );
  $form['reset_components'][] = array(
    '#type' => 'item',
    '#description' => t(
      'The components marked in this form will be reset to Webform Default Fields.<br />' .
      '[Add] action - insert the component of the Default Webform in the current.<br />' .
      '[Delete] action - remove nonexistent in the Default Webform component of the current.<br />' .
      '[Restore] action - will replace the component of the current Webform on the key matching component of the Default Webform.<br />' .
      '<em>ATTENTION: Actions Delete and Restore will remove all relative to component items in the Conditionals and Results. This can not be undone</em>'),
  );
  $form['reset_components']['table'] = array(
    '#theme' => 'table',
    '#header' => array(t('Components'), t('Action'), t('Select what will be reset')),
  );
  foreach ($components as $key => $val)  {
    if (!isset($val['#modify'])) {
      $val['#modify'] = ($val['nid'] == $node->nid) ? 'Delete' : 'Add';
    }
    $val['name'] = ($val['#modify'] != 'Add') 
      ? l(t($val['name']), 'node/' . $node->nid . '/webform/components/' . $val['cid']) 
      : t($val['name']);
    $row = array( 
      array(
        'data' => array( 
          '#type' => 'item',
          '#description' => t('(Field Key: %KEY%; Type: %TYPE%)', array('%KEY%' => $val['form_key'], '%TYPE%' => $val['type'])),
          '#title' => $val['name'] 
        )
      ),
      array(
       'data' => array( 
          '#type' => 'item',
          '#title' => check_plain($val['#modify']), 
        )
      ),
    );
    $row[] = ($val['#modify'] == '-') ? array() : array(
      'data' => array( 
        '#type' => 'checkbox',
        '#name' => 'modify[' . $val['#modify'] . '][]',
        '#return_value' => ($val['#modify'] == 'Restore') ? $val['cid'] . '|' . $val['def_cid'] : $val['cid'], 
      )
    );
    $form['reset_components']['table']['#rows'][$val['form_key']] = array(
      'data' => $row,
      'class' => array(
        $modify_styles[$val['#modify']]
        )
      );
  }
  $form['reset_components'][] = array(
    '#type' => 'submit',
    '#value' => t('Reset'),
    '#submit' => array('webform_default_fields_reset_components_submit'),
  );
  
  $form['reset_components'][] = array(
    '#type' => 'submit',
    '#value' => t('Reset all nodes'),
    '#submit' => array('webform_default_fields_reset_all_nodes_submit'),
  );

  $form['reset_global'][] = array(
    '#type' => 'item',
    '#description' => t(
      'The marked parts of <em>%node</em> will be replaced with <em>%master_node</em> parts.<br />' .
      'This can not be undone', 
      array(
        '%master_node' => $default_node->title,
        '%node' => $node->title,
      )
    ),
  );
 $form['reset_global']['reset_sector'] = array(
  '#name' => 'reset_sector',
  '#type' => 'checkboxes',
  '#options' => $reset_parts,
 );
 $form['reset_global']['reset_conditionals'] = array(
  '#type' => 'checkbox',
  '#name' => 'conditionals',
  '#title' => 'Conditionals',
  '#states' => array(
    'enabled' => array(
      '#edit-reset-global-reset-sector-components' => array('checked' => TRUE),
    ),
    'checked' => array(
      '#edit-reset-global-reset-sector-components' => array('checked' => TRUE),
    ),
  ),
);
  $form['reset_global'][] = array(
    '#type' => 'submit',
    '#value' => t('Global Reset'),
    '#submit' => array('webform_default_fields_reset_global_submit'),
  );
  return $form;
}

/**
 * Function submit for 'Reset' button.
 * @param array $form
 * @param array $form_state
 */ 
function webform_default_fields_reset_components_submit($form, &$form_state) {
  $modify = (isset($form_state['input']['modify'])) ? $form_state['input']['modify'] : array();
  $nid = $form_state['values']['nid'];
  module_load_include('inc', 'webform', 'includes/webform.components');
  if (isset($modify['Add'])) {
    webform_default_fields_reset_insert($modify['Add'], $nid);
  }
  if (isset($modify['Delete'])) {
    webform_default_fields_reset_remove($modify['Delete'], $nid);
  }
  if (isset($modify['Restore'])) {
    webform_default_fields_reset_modify($modify['Restore'], $nid);
  }  
}

/**
 * Function submit for 'Reset all' button.
 * @param array $form
 * @param array $form_state
 */
function webform_default_fields_reset_all_nodes_submit($form, &$form_state) {
  module_load_include('inc', 'webform_default_fields', '/includes/webform_default_fields.common');
  $modify = (isset($form_state['input']['modify'])) ? $form_state['input']['modify'] : array();
  $nid = $form_state['values']['nid'];
  $node = node_load($nid, NULL, TRUE);
  $nodes = webform_default_fields_select_nodes($node->type);
  module_load_include('inc', 'webform', 'includes/webform.components');
  foreach($nodes as $node_change) {
    if (isset($modify['Add'])) {
      webform_default_fields_reset_insert($modify['Add'], $node_change->vid);
    }
    if (isset($modify['Delete'])) {
      webform_default_fields_reset_remove($modify['Delete'], $node_change->vid, $node);
    }
    if (isset($modify['Restore'])) {
      webform_default_fields_reset_modify($modify['Restore'], $node_change->vid, $node);
    } 
  }
}

/**
 * function submit for 'Reset global' button.
 * @param array $form
 * @param array $form_state
 */
function webform_default_fields_reset_global_submit($form, &$form_state) {
  $nid = $form_state['values']['nid'];
  $node = node_load($nid, NULL, TRUE);
  $type_url_str = str_replace('-', '_', $node->type);
  $default_nid = _webform_default_fields_container_node($type_url_str);
  $default_node = node_load($default_nid, NULL, TRUE);
  $resets = $form_state['input']['reset_global']['reset_sector'];
  if (isset($resets['settings'])) {
    $main_webform = $default_node->webform;
    $sub_webform = $node->webform;
    $main_webform['nid']=$nid;
    $settings_webform = TRUE;
  }
  else {
    $main_webform = $node->webform;
    $sub_webform = $default_node->webform;
    $settings_webform = FALSE;
  }
  unset($resets['settings']);
  foreach ($resets as $res_key => &$reset) {
    $reset = (isset($reset)) ? TRUE : FALSE;
    if ($reset != $settings_webform) {
      $main_webform[$res_key] = webform_default_fields_reset_nid($sub_webform[$res_key], $nid);
    }
    else {
      $main_webform[$res_key] = webform_default_fields_reset_nid($main_webform[$res_key], $nid);
    }
  }
  if ($resets['components']) {
    $conditionals = (isset($form_state['input']['conditionals'])) ? TRUE : FALSE;
    if ($conditionals) {
      $main_webform['conditionals'] = $default_node->webform['conditionals'];
      foreach ($main_webform['conditionals'] as &$conditional) {
        $conditional['rules'] = webform_default_fields_reset_nid($conditional['rules'], $nid);
        $component['nid'] = $nid;
      }
    }
    else {
      $main_webform['conditionals'] = array();
    }
  }
  $node->webform = $main_webform;
  node_save($node);  
}

/**
 * Add fileds for webform default.
 * @param array $add_components
 * @param int $nid
 * @param bool $modify
 */
function webform_default_fields_reset_insert($add_components, $nid, $modify = FALSE) {
  $node = node_load($nid);
  $type_url_str = str_replace('-', '_', $node->type);
  $default_nid = _webform_default_fields_container_node($type_url_str);
  $default_node = node_load($default_nid);
  foreach ($add_components as $add_component) {
    if (!webform_default_fields_components_exist($default_node, $node, $add_component) || $modify) {
      $component = $default_node->webform['components'][$add_component];
      $component['cid'] = NULL;
      $component['nid'] = $nid;
      webform_component_insert($component);
    }
  }
}

/**
 * Remove fields for webform default.
 * @param array $del_components
 * @param int $nid
 * @param object $node_source
 */
function webform_default_fields_reset_remove($del_components, $nid, $node_source = NULL) {
  foreach ($del_components as $del_component) {
    $master_node = node_load($nid);
    if (!empty($node_source)) {
      $modify_key = webform_default_fields_components_exist($node_source, $master_node, $del_component);
      if ($modify_key) {
        webform_component_delete($master_node,  $master_node->webform['components'][$modify_key]);
      }
    } 
    else {
      webform_component_delete($master_node,  $master_node->webform['components'][$del_component]);
    }
  }
}

/**
 * Modify field, if it's modified in webform default.
 * @param array $modify_components
 * @param int $nid
 * @param object $node_source
 */
function webform_default_fields_reset_modify($modify_components, $nid, $node_source = NULL) {
  $node = node_load($nid);
  $type_url_str = str_replace('-', '_', $node->type);
  $default_nid = _webform_default_fields_container_node($type_url_str);
  $default_node = node_load($default_nid);
  if ($nid != $default_nid) {
    foreach ($modify_components as $modify_component) {
      $modify = explode('|', $modify_component);
      if (!empty($node_source)) {
        webform_default_fields_reset_remove(array($modify[0]), $nid, $default_node);
      }
      else {
        webform_default_fields_reset_remove(array($modify[0]), $nid);
      }
      webform_default_fields_reset_insert(array($modify[1]), $nid, TRUE);
    }
  }
}

/**
 * Verify exist components in webform.
 * @param object $node
 * @param object $node_change
 * @param array $modify_key
 * @return int
 */
function webform_default_fields_components_exist($node, $node_change, $modify_key) {
  $flag = 0;
  $components = $node->webform['components'];
  if (isset($components[$modify_key]) && isset($node_change->webform['components'])){
    foreach ($node_change->webform['components'] as $item) {
      if ($components[$modify_key]['form_key'] == $item['form_key']) {
        $flag = $item['cid'];
      }
    }  
   }
  return $flag;
}

/**
 * Modify keys for components list.
 * @param array $val
 * @param array $def_val
 * @return array
 */
function webform_default_fields_modified_keys($val, $def_val) {
  $def_val['nid']=$val['nid'];
  $def_cid = $def_val['cid'];
  $def_val['cid']=$val['cid'];
  if ($val == $def_val) {
    $val['#modify'] = '-';
  }
  else {
    $val['#modify'] = 'Restore';
    $val['def_cid'] = $def_cid;
  }
  return $val;
}

/**
 * Components list comparing with webform default.
 * @param object $node
 * @param object $default_node
 * @return array
 */
function webform_default_fields_reset_components_list($node, $default_node) {
  foreach ($default_node->webform['components'] as $def_key => $def_val) {
    foreach ($node->webform['components'] as $key => $val) {
      if ($val['form_key'] == $def_val['form_key']) {
        $default_node->webform['components'][$def_key] = webform_default_fields_modified_keys($val, $def_val);
        unset($node->webform['components'][$key]);
      break;
      }
    }
  }
  return array_merge($default_node->webform['components'], $node->webform['components']);
}

/**
 * Add elements to nid.
 * @param array $elements
 * @param int $nid
 * @return array
 */
function webform_default_fields_reset_nid($elements, $nid) {
  foreach ($elements as &$element) {
    $element['nid'] = $nid;
  }
  return $elements;
}


