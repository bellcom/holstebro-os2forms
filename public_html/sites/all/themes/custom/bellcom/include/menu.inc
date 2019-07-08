<?php

/**
 * @file
 * Menu functionality.
 */

/**
 * Menu generator function.
 *
 * @param string $menu_name
 *   Manu name.
 * @param bool|false $menu_type
 *   Menu type.
 * @param bool|false $full_menu
 *   Full menu flag.
 * @param int $max_depth
 *   Menu type: "navigation-list" or "sidebar".
 *
 * @return array
 *   Menu render array.
 */
function _bellcom_generate_menu($menu_name, $menu_type = NULL, $full_menu = FALSE, $max_depth = NULL) {
  if (empty($menu_name)) {
    return array();
  }

  // Menu type.
  if ($full_menu) {
    $menu_tree = menu_tree_all_data($menu_name, NULL, $max_depth);
  }
  else {
    $menu_tree = menu_tree_page_data($menu_name, $max_depth);
  }

  $output = menu_tree_output($menu_tree);

  // Change theme function for tree and links.
  if ($menu_type !== NULL) {

    // Tree.
    $menu_tree_function_names = array(
      'menu_tree__' . strtr($menu_type, '-', '_'),
      'menu_tree__' . strtr($menu_name, '-', '_') . '__' . strtr($menu_type, '-', '_'),
    );
    $output['#theme_wrappers'] = $menu_tree_function_names;

    // Links.
    $menu_link_function_names = array(
      'old' => 'menu_link__' . strtr($menu_name, '-', '_'),
      'new' => 'menu_link__' . strtr($menu_type, '-', '_'),
    );
    array_walk_recursive($output, '_bellcom_alter_menu_theme_function', $menu_link_function_names);
  }

  return $output;
}

/**
 * Alter menu theme function suggestions.
 *
 * @param string $item
 *   Item function.
 * @param string $key
 *   Function key.
 * @param array $theme_functions
 *   Functiona array.
 */
function _bellcom_alter_menu_theme_function(&$item, $key, array $theme_functions) {
  $old_theme_function = $theme_functions['old'];
  $new_theme_function = $theme_functions['new'];

  if ($item === $old_theme_function) {
    $item = $new_theme_function;
  }
}

/**
 * Checks whether an item is active or in the active trail.
 *
 * This is based on the code in the core toolbar module
 * /modules/toolbar/toolbar.module function toolbar_in_active_trail($path)
 *
 * @param string $link_path
 *   The path of a menu item we're evaluating.
 *
 * @return array
 *   An array of classes if active or in the active trail.
 *   An empty array if not active or in the active trail.
 *
 * @todo
 *   Look at migrating to a menu system level function.
 */
function _bellcom_in_active_trail($link_path) {
  $classes = array();
  $active_paths = array();
  // Don't waste cycles: if we're on the front page, we're either active or not
  // and we don't need to look at the rest of the tree.
  if (drupal_is_front_page()) {
    if ($link_path == '<front>') {
      $classes[] = 'active';
    }
    return $classes;
  }
  // If the current page matches the item path, it's active and we don't need to
  // look further. Comment out the return statement to have both 'active' and
  // 'active-trail' classes applied to the item for the current page.
  if ($link_path == current_path()) {
    $classes[] = 'active';
    return $classes;
  }
  // If we're not on the front page and the current link is not
  // the current page.
  // The we need to check the whole active trail. Since Drupal caches the result
  // of menu_get_active_trail(), this is not too costly.
  $active_trail = menu_get_active_trail();
  $front = array_shift($active_trail);
  foreach ($active_trail as $item) {
    if (!empty($item['link_path'])) {
      $active_paths[$item['link_path']] = TRUE;
    }
  }
  if (!empty($active_paths[$link_path])) {
    $classes[] = 'active-trail';
  }
  return $classes;
}
