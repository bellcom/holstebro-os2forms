<?php

/**
 * @file
 * Theme main settings.
 */

/**
 * Collect and assemble theme settings.
 *
 * @return array
 *   Settings array.
 */
function _bellcom_collect_theme_settings() {
  $settings = [];

  // Contact information.
  $settings['contact_information']['business_owner_name'] = theme_get_setting('business_owner_name');
  $settings['contact_information']['business_startup_year'] = theme_get_setting('business_startup_year');
  $settings['contact_information']['address'] = theme_get_setting('address');
  $settings['contact_information']['zipcode'] = theme_get_setting('zipcode');
  $settings['contact_information']['city'] = theme_get_setting('city');
  $settings['contact_information']['phone_system'] = theme_get_setting('phone_system');
  $settings['contact_information']['phone_readable'] = theme_get_setting('phone_readable');
  $settings['contact_information']['email'] = theme_get_setting('email');
  $settings['contact_information']['working_hours'] = theme_get_setting('working_hours');

  // Social links.
  $settings['social_links']['facebook']['active'] = theme_get_setting('facebook');
  $settings['social_links']['facebook']['url'] = theme_get_setting('facebook_url');
  $settings['social_links']['facebook']['tooltip'] = theme_get_setting('facebook_tooltip');
  $settings['social_links']['twitter']['active'] = theme_get_setting('twitter');
  $settings['social_links']['twitter']['url'] = theme_get_setting('twitter_url');
  $settings['social_links']['twitter']['tooltip'] = theme_get_setting('twitter_tooltip');
  $settings['social_links']['googleplus']['active'] = theme_get_setting('googleplus');
  $settings['social_links']['googleplus']['url'] = theme_get_setting('googleplus_url');
  $settings['social_links']['googleplus']['tooltip'] = theme_get_setting('googleplus_tooltip');
  $settings['social_links']['instagram']['active'] = theme_get_setting('instagram');
  $settings['social_links']['instagram']['url'] = theme_get_setting('instagram_url');
  $settings['social_links']['instagram']['tooltip'] = theme_get_setting('instagram_tooltip');
  $settings['social_links']['linkedin']['active'] = theme_get_setting('linkedin');
  $settings['social_links']['linkedin']['url'] = theme_get_setting('linkedin_url');
  $settings['social_links']['linkedin']['tooltip'] = theme_get_setting('linkedin_tooltip');
  $settings['social_links']['pinterest']['active'] = theme_get_setting('pinterest');
  $settings['social_links']['pinterest']['url'] = theme_get_setting('pinterest_url');
  $settings['social_links']['pinterest']['tooltip'] = theme_get_setting('pinterest_tooltip');
  $settings['social_links']['vimeo']['active'] = theme_get_setting('vimeo');
  $settings['social_links']['vimeo']['url'] = theme_get_setting('vimeo_url');
  $settings['social_links']['vimeo']['tooltip'] = theme_get_setting('vimeo_tooltip');
  $settings['social_links']['youtube']['active'] = theme_get_setting('youtube');
  $settings['social_links']['youtube']['url'] = theme_get_setting('youtube_url');
  $settings['social_links']['youtube']['tooltip'] = theme_get_setting('youtube_tooltip');

  return $settings;
}
