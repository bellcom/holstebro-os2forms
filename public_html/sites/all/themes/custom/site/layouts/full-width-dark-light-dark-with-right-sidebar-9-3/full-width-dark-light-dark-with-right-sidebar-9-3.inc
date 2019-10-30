<?php

/**
 * @file
 * Implementation of hook_panels_layouts().
 */

$plugin = array(
  'title' => t('Full width - content with right sidebar (9/3)'),
  'category' => t('OS2'),
  'icon' => 'full-width-dark-light-dark-with-right-sidebar-9-3.png',
  'theme' => 'full-width-dark-light-dark-with-right-sidebar-9-3',
  'css' => 'full-width-dark-light-dark-with-right-sidebar-9-3.css',
  'regions' => array(
    'content' => t('Content'),
    'sidebar' => t('Sidebar'),
    'dark_section_1' => t('Dark section'),
    'light_section_1' => t('Light section'),
  ),
);
