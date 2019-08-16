<?php

/**
 * @file
 * NemloginAuth identity provider plugin.
 */

$plugin = array(
  'title' => t('SimpleSaml authorization'),
  'handler' => array(
    'class' => 'NemloginAuthSimpleSaml',
  ),
);
