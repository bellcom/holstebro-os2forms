<?php

/**
 * @file
 * Implementation of hook_panels_layouts().
 */

$plugin = array(
  'title' => t('Full width - light/dark/light'),
  'category' => t('OS2'),
  'icon' => 'full-width-light-dark-light.png',
  'theme' => 'full-width-light-dark-light',
  'css' => 'full-width-light-dark-light.css',
  'regions' => array(
    'light_section_1' => t('Light section'),
    'light_section_2' => t('Light section'),
    'dark_section_1' => t('Dark section'),
    'dark_section_2' => t('Dark section'),
  ),
);
