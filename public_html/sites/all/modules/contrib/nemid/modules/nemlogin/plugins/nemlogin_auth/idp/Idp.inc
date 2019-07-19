<?php

/**
 * @file
 * NemloginAuth identity provider plugin.
 */

$plugin = array(
  'title' => t('Identity provider'),
  'handler' => array(
    'class' => 'NemloginAuthIDP',
  ),
);
