<?php

/**
 * @file
 * Implementation of hook_panels_layouts().
 */

$plugin = array(
  'title' => t('Sectioned - top/light/dark/light/dark'),
  'category' => t('OS2'),
  'icon' => 'sectioned-top-light-dark-light-dark.png',
  'theme' => 'sectioned-top-light-dark-light-dark',
  'css' => 'sectioned-top-light-dark-light-dark.css',
  'regions' => array(
    'top' => t('Top - full width'),
    'light_section_1' => t('Light section - with container'),
    'light_section_2' => t('Light section - with container'),
    'dark_section_1' => t('Dark section - with container'),
    'dark_section_2' => t('Dark section - with container'),
  ),
);
