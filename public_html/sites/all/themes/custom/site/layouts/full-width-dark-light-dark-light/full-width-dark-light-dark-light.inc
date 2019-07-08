<?php

/**
 * @file
 * Implementation of hook_panels_layouts().
 */

$plugin = array(
  'title' => t('Full width - dark/light/dark'),
  'category' => t('OS2'),
  'icon' => 'full-width-dark-light-dark.png',
  'theme' => 'full-width-dark-light-dark',
  'css' => 'full-width-dark-light-dark.css',
  'regions' => array(
    'light_section_1' => t('Light section'),
    'dark_section_1' => t('Dark section'),
    'dark_section_2' => t('Dark section'),
  ),
);
