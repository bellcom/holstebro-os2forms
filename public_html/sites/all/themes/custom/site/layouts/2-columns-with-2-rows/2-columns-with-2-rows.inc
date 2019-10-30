<?php

/**
 * @file
 * Implementation of hook_panels_layouts()
 */

$plugin = array(
  'title' => t('2 columns with 2 rows'),
  'category' => t('OS2'),
  'icon' => '2-columns-with-2-rows.png',
  'theme' => '2-columns-with-2-rows',
  'css' => '2-columns-with-2-rows.css',
  'regions' => array(
    'left-content-1' => t('Left sided content'),
    'right-content-1' => t('Right sided content'),
    'left-content-2' => t('Left sided content'),
    'right-content-2' => t('Right sided content'),
  ),
);
