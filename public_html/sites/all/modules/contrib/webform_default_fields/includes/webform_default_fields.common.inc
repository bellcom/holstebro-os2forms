<?php

/**
 * Return keys node.
 * @param string $type
 * @return array
 */
function webform_default_fields_select_nodes($type) {
  module_load_include('inc', 'webform_default_fields', '/model/webform_default_fields.db');
  $result = webform_default_fields_db_select_nodes($type);
  return node_load_multiple(array_keys($result['node']));
}
