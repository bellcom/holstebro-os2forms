<?php

/**
 * @file
 * Main theme functionality.
 */

/**
 * Implements template_preprocess_html().
 */
function site_preprocess_html(&$variables) {
  $theme_path = path_to_theme();

  // Add javascript files.
  drupal_add_js($theme_path . '/dist/javascripts/modernizr.js',
    [
      'type' => 'file',
      'scope' => 'footer',
      'group' => JS_LIBRARY,
    ]);
  drupal_add_js($theme_path . '/dist/javascripts/app.js',
    [
      'type' => 'file',
      'scope' => 'footer',
      'group' => JS_THEME,
    ]);

  // Add fonts from Google fonts API.
  drupal_add_css('https://fonts.googleapis.com/css?family=Raleway:400,700',
    ['type' => 'external']);
}

/**
 * Implements hook_preprocess_page().
 */
function site_preprocess_page(&$variables) {
  $current_theme = variable_get('theme_default', 'none');
  $primary_navigation_name = variable_get('menu_main_links_source', 'main-menu');

  // Overriding the one set by mother theme, as we want to limit the
  // number of levels shown.
  $variables['theme_path'] = base_path() . drupal_get_path('theme', $current_theme);

  // Navigation.
  $variables['flexy_navigation__primary'] = _bellcom_generate_menu($primary_navigation_name, 'flexy_navigation', FALSE, 1);
  $variables['menu_slinky__main_menu'] = _bellcom_generate_menu('main-menu', 'slinky-custom', TRUE);

  // Tabs.
  $variables['tabs_primary'] = $variables['tabs'];
  $variables['tabs_secondary'] = $variables['tabs'];
  unset($variables['tabs_primary']['#secondary']);
  unset($variables['tabs_secondary']['#primary']);
}

/**
 * Implements template_preprocess_node.
 */
function site_preprocess_node(&$variables) {
  $node = $variables['node'];

  // Optionally, run node-type-specific preprocess functions, like
  // foo_preprocess_node_page() or foo_preprocess_node_story().
  $function_node_type = __FUNCTION__ . '__' . $node->type;
  $function_view_mode = __FUNCTION__ . '__' . $variables['view_mode'];

  if (function_exists($function_node_type)) {
    $function_node_type($variables);
  }

  if (function_exists($function_view_mode)) {
    $function_view_mode($variables);
  }
}

/**
 * Implements template_preprocess_taxonomy_term().
 */
function site_preprocess_taxonomy_term(&$variables) {
  $term = $variables['term'];
  $view_mode = $variables['view_mode'];
  $vocabulary_machine_name = $variables['vocabulary_machine_name'];

  // Add taxonomy-term--view_mode.tpl.php suggestions.
  $variables['theme_hook_suggestions'][] = 'taxonomy_term__' . $view_mode;

  // Make "taxonomy-term--TERMTYPE--VIEWMODE.tpl.php" templates
  // available for terms.
  $variables['theme_hook_suggestions'][] = 'taxonomy_term__' . $vocabulary_machine_name . '__' . $view_mode;

  // Optionally, run node-type-specific preprocess functions,
  // like foo_preprocess_taxonomy_term_page()
  // or foo_preprocess_taxonomy_term_story().
  $function_taxonomy_term_type = __FUNCTION__ . '__' . $vocabulary_machine_name;
  $function_view_mode = __FUNCTION__ . '__' . $view_mode;

  if (function_exists($function_taxonomy_term_type)) {
    $function_taxonomy_term_type($variables);
  }

  if (function_exists($function_view_mode)) {
    $function_view_mode($variables);
  }
}

/**
 * Returns HTML for a form element label and required marker.
 *
 * Form element labels include the #title and a #required marker. The label is
 * associated with the element itself by the element #id. Labels may appear
 * before or after elements, depending on theme_form_element() and
 * #title_display.
 *
 * This function will not be called for elements with no labels, depending on
 * #title_display. For elements that have an empty #title and are not required,
 * this function will output no label (''). For required elements that have an
 * empty #title, this will output the required marker alone within the label.
 * The label will use the #id to associate the marker with the field that is
 * required. That is especially important for screenreader users to know
 * which field is required.
 *
 * @param array $variables
 *   An associative array containing:
 *   - element: An associative array containing the properties of the element.
 *     Properties used: #required, #title, #id, #value, #description.
 *
 * @return string
 *   The constructed HTML.
 *
 * @see theme_form_element_label()
 *
 * @ingroup theme_functions
 */
function site_form_element_label(array &$variables) {
  $element = $variables['element'];

  // Extract variables.
  $output = '';

  $title = !empty($element['#title']) ? filter_xss_admin($element['#title']) : '';

  // Only show the required marker if there is an actual title to display.
  $marker = array('#theme' => 'form_required_marker', '#element' => $element);
  if ($title && $required = !empty($element['#required']) ? drupal_render($marker) : '') {
    $title .= ' ' . $required;
  }

  $display = isset($element['#title_display']) ? $element['#title_display'] : 'before';
  $type = !empty($element['#type']) ? $element['#type'] : FALSE;
  $checkbox = $type && $type === 'checkbox';
  $radio = $type && $type === 'radio';

  // Immediately return if the element is not a checkbox or radio and there is
  // no label to be rendered.
  if (!$checkbox && !$radio && ($display === 'none' || !$title)) {
    return '';
  }

  // Retrieve the label attributes array.
  $attributes = &_bootstrap_get_attributes($element, 'label_attributes');

  // Add Bootstrap label class.
  $attributes['class'][] = 'control-label';

  // Add the necessary 'for' attribute if the element ID exists.
  if (!empty($element['#id'])) {
    $attributes['for'] = $element['#id'];
  }

  // Checkboxes and radios must construct the label differently.
  if ($checkbox || $radio) {
    if ($display === 'before') {
      $output .= $title;
    }
    elseif ($display === 'none' || $display === 'invisible') {
      $output .= '<span class="element-invisible">' . $title . '</span>';
    }
    // Inject the rendered checkbox or radio element inside the label.
    if (!empty($element['#children'])) {
      $output .= $element['#children'];
    }

    return $output . '<label' . drupal_attributes($attributes) . '>' . $title . '</label>';
  }
  // Otherwise, just render the title as the label.
  else {
    // Show label only to screen readers to avoid disruption in visual flows.
    if ($display === 'invisible') {
      $attributes['class'][] = 'element-invisible';
    }
    $output .= $title;
  }

  // The leading whitespace helps visually separate fields from inline labels.
  return ' <label' . drupal_attributes($attributes) . '>' . $output . "</label>\n";
}
