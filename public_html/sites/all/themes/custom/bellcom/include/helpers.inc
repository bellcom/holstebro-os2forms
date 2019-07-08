<?php

/**
 * @file
 * Helper functions.
 */

/**
 * Seperated dates.
 *
 * Heavily inspired by drupals format_date() function.
 */
function _bellcom_seperated_dates($timestamp) {
  $seperated_dates = array();

  // Use the advanced drupal_static() pattern, since this is called very often.
  static $drupal_static_fast;
  if (!isset($drupal_static_fast)) {
    $drupal_static_fast['timezones'] = &drupal_static(__FUNCTION__);
  }
  $timezones = &$drupal_static_fast['timezones'];

  if (!isset($timezone)) {
    $timezone = date_default_timezone_get();
  }
  // Store DateTimeZone objects in an array rather than repeatedly
  // constructing identical objects over the life of a request.
  if (!isset($timezones[$timezone])) {
    $timezones[$timezone] = timezone_open($timezone);
  }

  // Use the default langcode if none is set.
  global $language;
  if (empty($langcode)) {
    $langcode = isset($language->language) ? $language->language : 'en';
  }

  // Create a DateTime object from the timestamp.
  $date_time = date_create('@' . $timestamp);
  // Set the time zone for the DateTime object.
  date_timezone_set($date_time, $timezones[$timezone]);

  // Seperated dates.
  $seperated_dates = array(
    'day' => array(
      'integer' => date_format($date_time, 'd'),
      'short' => date_format($date_time, 'D'),
      'full' => date_format($date_time, 'l'),
    ),
    'month' => array(
      'integer' => date_format($date_time, 'm'),
      'short' => date_format($date_time, 'M'),
      'full' => date_format($date_time, 'F'),
    ),
    'year' => array(
      'short' => date_format($date_time, 'y'),
      'full' => date_format($date_time, 'Y'),
    ),
    'week' => date_format($date_time, 'W'),
  );

  return $seperated_dates;
}

/**
 * Text shortener.
 */
function _bellcom_text_shortener($text_string, $max_length) {
  $alter = array(
    'max_length'    => $max_length,
    'ellipsis'      => TRUE,
    'word_boundary' => TRUE,
    'html'          => TRUE,
  );

  $shortened_string = views_trim_text($alter, $text_string);

  return $shortened_string;
}

/**
 * Search for value in multi-dimensional array.
 */
function in_array_recursive($needle, $haystack, $strict = FALSE) {
  foreach ($haystack as $item) {
    if (($strict ? $item === $needle : $item == $needle) || (is_array($item) && in_array_recursive($needle, $item, $strict))) {
      return TRUE;
    }
  }

  return FALSE;
}
