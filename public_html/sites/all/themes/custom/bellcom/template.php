<?php

/**
 * @file
 * Functionality for bellcom base theme.
 */

include dirname(__FILE__) . '/include/helpers.inc';
include dirname(__FILE__) . '/include/menu.inc';
include dirname(__FILE__) . '/include/settings.inc';

/**
 * Implements theme_preprocess_html().
 */
function bellcom_preprocess_html(&$variables) {
  $current_theme = variable_get('theme_default', 'none');

  // Paths.
  $variables['path_js']   = base_path() . drupal_get_path('theme', $current_theme) . '/dist/js';
  $variables['path_img']  = base_path() . drupal_get_path('theme', $current_theme) . '/dist/img';
  $variables['path_css']  = base_path() . drupal_get_path('theme', $current_theme) . '/dist/css';
  $variables['path_font'] = base_path() . drupal_get_path('theme', $current_theme) . '/dist/font';

  // Panels display.
  if ($page = page_manager_get_current_page()) {
    $panels_layout = $page['handler']->conf['display']->layout;
    $panels_display = ($page['handler']->conf['name'] == '') ? 'standard' : $page['handler']->conf['name'];

    // Panels layout.
    $variables['classes_array'][] = drupal_html_class('panels-layout');
    $variables['classes_array'][] = drupal_html_class('panels-layout--' . $panels_layout);
    $variables['classes_array'][] = drupal_html_class('panels-display--' . $panels_display);
  }
}

/**
 * Implements theme_preprocess_page().
 */
function bellcom_preprocess_page(&$variables) {
  $current_theme = variable_get('theme_default', 'none');
  $primary_navigation_name = variable_get('menu_main_links_source', 'main-menu');
  $secondary_navigation_name = variable_get('menu_secondary_links_source', 'user-menu');

  // Navigation.
  $variables['flexy_navigation__primary'] = _bellcom_generate_menu($primary_navigation_name, 'flexy_navigation', TRUE);
  $variables['flexy_navigation__secondary'] = _bellcom_generate_menu($secondary_navigation_name, 'flexy_navigation', TRUE);

  $variables['menu_slinky_custom__primary'] = _bellcom_generate_menu($primary_navigation_name, 'slinky-custom', TRUE);
  $variables['menu_slinky_custom__secondary'] = _bellcom_generate_menu($secondary_navigation_name, 'slinky-custom', TRUE);

  $variables['menu_slinky__primary'] = _bellcom_generate_menu($primary_navigation_name, 'slinky', TRUE);
  $variables['menu_slinky__secondary'] = _bellcom_generate_menu($secondary_navigation_name, 'slinky', TRUE);

  $variables['flexy_list__primary'] = _bellcom_generate_menu($primary_navigation_name, 'flexy_list', FALSE, 1);
  $variables['flexy_list__secondary'] = _bellcom_generate_menu($secondary_navigation_name, 'flexy_list', FALSE, 1);

  // Paths.
  $variables['path_js']   = base_path() . drupal_get_path('theme', $current_theme) . '/dist/js';
  $variables['path_img']  = base_path() . drupal_get_path('theme', $current_theme) . '/dist/img';
  $variables['path_css']  = base_path() . drupal_get_path('theme', $current_theme) . '/dist/css';
  $variables['path_font'] = base_path() . drupal_get_path('theme', $current_theme) . '/dist/font';

  // Theme settings.
  $variables['theme_settings'] = _bellcom_collect_theme_settings();
}

/**
 * Implements template_preprocess_node().
 */
function bellcom_preprocess_node(&$variables) {
  $node = $variables['node'];
  $view_mode = $variables['view_mode'];
  $content_type = $node->type;

  // Entity variables.
  $variables['classes_array'][] = drupal_html_class('entity-' . $view_mode);
  $variables['classes_array'][] = drupal_html_class('entity-' . $view_mode . '--' . $content_type);

  $variables['classes_array'][] = drupal_html_class('node--' . $content_type . '--' . $view_mode);

  // Add node--view_mode.tpl.php suggestions.
  $variables['theme_hook_suggestions'][] = 'node__' . $view_mode;

  // Make "node--NODETYPE--VIEWMODE.tpl.php" templates available for nodes.
  $variables['theme_hook_suggestions'][] = 'node__' . $content_type . '__' . $view_mode;

  // Optionally, run node-type-specific preprocess functions, like
  // foo_preprocess_node_page() or foo_preprocess_node_story().
  $function = __FUNCTION__ . '__' . $content_type;
  if (function_exists($function)) {
    $function($variables);
  }

  // Updated at.
  if ($updated_at = $variables['node']->changed) {
    $variables['updated_at_short'] = format_date($updated_at, 'short');
    $variables['updated_at_medium'] = format_date($updated_at, 'medium');
    $variables['updated_at_long'] = format_date($updated_at, 'long');
    $variables['updated_at_ago'] = t('@time ago', array('@time' => format_interval((REQUEST_TIME - $updated_at))));;
    $variables['updated_at_seperated'] = _bellcom_seperated_dates($updated_at);
  }

  // Created at.
  if ($created_at = $variables['node']->created) {
    $variables['created_at_short'] = format_date($created_at, 'short');
    $variables['created_at_medium'] = format_date($created_at, 'medium');
    $variables['created_at_long'] = format_date($created_at, 'long');
    $variables['created_at_ago'] = t('@time ago', array('@time' => format_interval((REQUEST_TIME - $created_at))));
    $variables['created_at_seperated'] = _bellcom_seperated_dates($created_at);
  }
}

/**
 * Implements template_preprocess_comment().
 */
function bellcom_preprocess_comment(&$variables) {

  // Updated at.
  if ($updated_at = $variables['comment']->changed) {
    $variables['updated_at_short'] = format_date($updated_at, 'short');
    $variables['updated_at_medium'] = format_date($updated_at, 'medium');
    $variables['updated_at_long'] = format_date($updated_at, 'long');
    $variables['updated_at_ago'] = t('@time ago', array('@time' => format_interval((REQUEST_TIME - $updated_at))));
    $variables['updated_at_seperated'] = _bellcom_seperated_dates($updated_at);
  }

  // Created at.
  if ($created_at = $variables['comment']->created) {
    $variables['created_at_short'] = format_date($created_at, 'short');
    $variables['created_at_medium'] = format_date($created_at, 'medium');
    $variables['created_at_long'] = format_date($created_at, 'long');
    $variables['created_at_ago'] = t('@time ago', array('@time' => format_interval((REQUEST_TIME - $created_at))));
    $variables['created_at_seperated'] = _bellcom_seperated_dates($created_at);
  }
}

/**
 * Implements template_preprocess_taxonomy_term().
 */
function bellcom_preprocess_taxonomy_term(&$variables) {
  $vocabulary_machine_name = $variables['vocabulary_machine_name'];
  $view_mode = $variables['view_mode'];

  // Add taxonomy-term--view_mode.tpl.php suggestions.
  $variables['theme_hook_suggestions'][] = 'taxonomy-term__' . $view_mode;

  // Entity variables.
  $variables['classes_array'][] = drupal_html_class('entity-' . $view_mode);
  $variables['classes_array'][] = drupal_html_class('entity-' . $view_mode . '--' . $vocabulary_machine_name);

  $variables['classes_array'][] = drupal_html_class('taxonomy-term--' . $vocabulary_machine_name . '--' . $view_mode);
}

/**
 * Implements template_preprocess_paragraphs_items().
 */
function bellcom_preprocess_paragraphs_items(&$variables, $hook) {
  $field_name = $variables['element']['#field_name'];
  $view_mode = $variables['element']['#view_mode'];

  // Add paragraphs-items--view_mode.tpl.php suggestions.
  $variables['theme_hook_suggestions'][] = 'paragraphs_items__' . $view_mode;

  // Entity variables.
  $variables['classes_array'][] = drupal_html_class('entity-' . $view_mode);
  $variables['classes_array'][] = drupal_html_class('entity-' . $view_mode . '--' . $field_name);

  $variables['classes_array'][] = drupal_html_class('paragraphs-items--' . $field_name . '--' . $view_mode);
}

/**
 * Implements theme_preprocess_block().
 */
function bellcom_preprocess_block(&$variables) {
  $variables['classes_array'][] = drupal_html_class('block-' . $variables['block']->module);
}

/**
 * Implements theme_menu_tree().
 *
 * For slinky menu types.
 */
function bellcom_menu_tree__flexy_navigation(&$variables) {
  return '<ul class="flexy-navigation">' . $variables['tree'] . '</ul>';
}

/**
 * Implements theme_menu_tree().
 *
 * For slinky menu types.
 */
function bellcom_menu_tree__slinky(&$variables) {
  return $variables['tree'];
}

/**
 * Implements theme_menu_tree().
 *
 * For custom slinky menu types.
 */
function bellcom_menu_tree__slinky_custom(&$variables) {
  return $variables['tree'];
}

/**
 * Implements theme_menu_tree().
 *
 * For slinky menu types.
 */
function bellcom_menu_tree__flexy_list(&$variables) {
  return '<ul class="flexy-list">' . $variables['tree'] . '</ul>';
}

/**
 * Implements theme_menu_link().
 */
function bellcom_menu_link__flexy_navigation(array $variables) {
  $element = $variables['element'];
  $sub_menu = '';

  // @TODO - current level
  // --- https://drupal.stackexchange.com/questions/32873/how-to-theme-only-top-level-menu
  // If we are on second level or below,
  // we need to add other classes to the list items.
  // The navbar.
  if ($element['#original_link']['depth'] > 1) {
    $element['#attributes']['class'][] = 'flexy-navigation__item__dropdown-menu__item';

    // Has a dropdown menu.
    if ($element['#below']) {

      if (($element['#original_link']['menu_name'] == 'management') && (module_exists('navbar'))) {
        $sub_menu = drupal_render($element['#below']);
      }
      elseif ((!empty($element['#original_link']['depth']))) {

        // Add our own wrapper.
        unset($element['#below']['#theme_wrappers']);
        $sub_menu = '<ul class="flexy-navigation__item__dropdown-menu">' . drupal_render($element['#below']) . '</ul>';

        // Generate as dropdown.
        $element['#attributes']['class'][] = 'flexy-navigation__item__dropdown-menu__item--dropdown';
        $element['#localized_options']['html'] = TRUE;
      }
    }
  }

  // Inside dropdown menu.
  else {
    $element['#attributes']['class'][] = 'flexy-navigation__item';

    // Has a dropdown menu.
    if ($element['#below']) {

      if (($element['#original_link']['menu_name'] == 'management') && (module_exists('navbar'))) {
        $sub_menu = drupal_render($element['#below']);
      }
      elseif ((!empty($element['#original_link']['depth']))) {

        // Add our own wrapper.
        unset($element['#below']['#theme_wrappers']);
        $sub_menu = '<ul class="flexy-navigation__item__dropdown-menu">' . drupal_render($element['#below']) . '</ul>';

        // Generate as dropdown.
        $element['#attributes']['class'][] = 'flexy-navigation__item--dropdown';
        $element['#localized_options']['html'] = TRUE;
      }
    }
  }

  // On primary navigation menu, class 'active' is not set on active menu item.
  // @see https://drupal.org/node/1896674
  if (($element['#href'] == $_GET['q'] || ($element['#href'] == '<front>' && drupal_is_front_page())) && (empty($element['#localized_options']['language']))) {
    $element['#attributes']['class'][] = 'active';
  }

  // If this item is active and/or in the active trail, add necessary classes.
  $active_classes = _bellcom_in_active_trail($element['#href']);
  if (isset($element['#attributes']['class'])) {
    $element['#attributes']['class'] = array_merge($element['#attributes']['class'], $active_classes);
  }
  else {
    $element['#attributes']['class'] = $active_classes;
  }

  $output = l($element['#title'], $element['#href'], $element['#localized_options']);

  return '<li' . drupal_attributes($element['#attributes']) . '>' . $output . $sub_menu . "</li>\n";
}

/**
 * Implements theme_menu_link().
 */
function bellcom_menu_link__slinky(array $variables) {
  $element = $variables['element'];
  $sub_menu = '';

  if ($element['#below']) {

    // Prevent dropdown functions from being added to management menu so it
    // does not affect the navbar module.
    if (($element['#original_link']['menu_name'] == 'management') && (module_exists('navbar'))) {
      $sub_menu = drupal_render($element['#below']);
    }

    elseif ((!empty($element['#original_link']['depth']))) {

      // Add our own wrapper.
      unset($element['#below']['#theme_wrappers']);

      // Submenu classes.
      $sub_menu = ' <ul>' . drupal_render($element['#below']) . '</ul>';
    }
  }

  // If this is a parent link, slinky require is to just link to a #.
  if ($element['#below']) {
    $element['#href'] = '';

    $element['#localized_options']['fragment'] = 'content';
    $element['#localized_options']['external'] = TRUE;
  }

  $output = l($element['#title'], $element['#href'], $element['#localized_options']);

  return '<li>' . $output . $sub_menu . "</li>\n";
}

/**
 * Implements theme_menu_link().
 */
function bellcom_menu_link__slinky_custom(array $variables) {
  $element = $variables['element'];
  $sub_menu = '';

  if ($element['#below']) {

    // Prevent dropdown functions from being added to management menu so it
    // does not affect the navbar module.
    if (($element['#original_link']['menu_name'] == 'management') && (module_exists('navbar'))) {
      $sub_menu = drupal_render($element['#below']);
    }

    elseif ((!empty($element['#original_link']['depth']))) {

      // Add our own wrapper.
      unset($element['#below']['#theme_wrappers']);

      // Submenu classes.
      $sub_menu = ' <ul>' . drupal_render($element['#below']) . '</ul>';
    }
  }

  $output = l($element['#title'], $element['#href'], $element['#localized_options']);

  return '<li>' . $output . $sub_menu . "</li>\n";
}

/**
 * Implements theme_menu_link().
 */
function bellcom_menu_link__flexy_list(array $variables) {
  $element = $variables['element'];
  $sub_menu = '';

  if ($element['#below']) {

    // Prevent dropdown functions from being added to management menu so it
    // does not affect the navbar module.
    if (($element['#original_link']['menu_name'] == 'management') && (module_exists('navbar'))) {
      $sub_menu = drupal_render($element['#below']);
    }

    elseif ((!empty($element['#original_link']['depth']))) {

      // Add our own wrapper.
      unset($element['#below']['#theme_wrappers']);

      // Submenu classes.
      $sub_menu = ' <ul>' . drupal_render($element['#below']) . '</ul>';
    }
  }

  // If this is a parent link, slinky require is to just link to a #.
  if ($element['#below']) {
    $element['#href'] = '';

    $element['#localized_options']['fragment'] = 'content';
    $element['#localized_options']['external'] = TRUE;
  }

  $output = l($element['#title'], $element['#href'], $element['#localized_options']);

  return '<li>' . $output . $sub_menu . "</li>\n";
}
