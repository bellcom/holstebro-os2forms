<?php

/**
* Select nodes certain type.
*/
function webform_default_fields_db_select_nodes($type) {
  $query = new EntityFieldQuery();
  $query->entityCondition('entity_type', 'node');
  $query->propertyCondition('type', $type);
  $result = $query->execute();
  return $result;
}
