<?php

/**
 * @file
 * Implementation of hook_panels_layouts().
 */

$plugin = array(
  'title' => t('Sectioned - top/dark/light/dark/light'),
  'category' => t('OS2'),
  'icon' => 'sectioned-top-dark-light-dark-light.png',
  'theme' => 'sectioned-top-dark-light-dark-light',
  'css' => 'sectioned-top-dark-light-dark-light.css',
  'regions' => array(
    'top' => t('Top - full width'),
    'light_section_1' => t('Light section - with container'),
    'light_section_2' => t('Light section - with container'),
    'light_section_3_1' => t('Light section - with container'),
    'light_section_3_2' => t('Light section - with container'),
    'dark_section_1' => t('Dark section - with container'),
    'dark_section_2' => t('Dark section - with container'),
    'dark_section_3_1' => t('Dark section - with container'),
    'dark_section_3_2' => t('Dark section - with container'),
  ),
);
