<?php

/**
 * @file
 *   drush integration for phpoffice_common.
 */

/**
 * The PHPOffice library URI.
 */
define('PHPOFFICE_DOWNLOAD_URI', 'https://github.com/PHPOffice/Common/archive/master.zip');
define('PHPOFFICE_DOWNLOAD_PREFIX', 'Common-');

/**
 * Implementation of hook_drush_command().
 *
 * In this hook, you specify which commands your
 * drush module makes available, what it does and
 * description.
 *
 * Notice how this structure closely resembles how
 * you define menu hooks.
 *
 * See `drush topic docs-commands` for a list of recognized keys.
 *
 * @return array
 *   An associative array describing your command(s).
 */
function phpoffice_common_drush_command() {
  $items = [];

  // the key in the $items array is the name of the command.
  $items['phpoffice-common-download'] = [
    'callback'    => 'drush_phpoffice_common_download',
    'description' => dt('Download and install the PHPOffice library.'),
    'bootstrap'   => DRUSH_BOOTSTRAP_DRUSH, // No bootstrap.
    'arguments'   => [
      'path' => dt('Optional. A path where to install the PHPOffice library. If omitted Drush will use the default location.'),
    ],
    'aliases'     => ['phpoffice-common-dl'],
  ];

  return $items;
}

/**
 * Implementation of hook_drush_help().
 *
 * This function is called whenever a drush user calls
 * 'drush help <name-of-your-command>'
 *
 * @param string $section
 *   A string with the help section (prepend with 'drush:')
 *
 * @return string
 *   A string with the help text for your command.
 */
function phpoffice_common_drush_help($section) {
  switch ($section) {
    case 'drush:phpoffice-common-download':
      return dt('Download and install the PHPOffice library from awd-studio/phpoffice_common, default location is sites/all/libraries.');
  }
}

/**
 * Implements drush_MODULE_pre_pm_enable().
 */
function drush_phpoffice_common_pre_pm_enable() {
  $modules = drush_get_context('PM_ENABLE_MODULES');
  if (in_array('phpoffice_common', $modules) && !drush_get_option('skip')) {
    drush_phpoffice_common_download();
  }
}

/**
 * Command to download the PHPOffice library.
 */
function drush_phpoffice_common_download() {
  $args = func_get_args();
  if (!empty($args[0])) {
    $path = $args[0];
  }
  else {
    $path = 'sites/all/libraries';
  }

  // Create the path if it does not exist.
  if (!is_dir($path)) {
    drush_op('mkdir', $path);
    drush_log(dt('Directory @path was created', ['@path' => $path]), 'notice');
  }

  // Download phpoffice_common download only if path is writable.
  if (is_writable($path)) {
    // Set the directory to the download location.
    $olddir = getcwd();
    chdir($path);

    // Download the zip archive
    if ($filepath = drush_download_file(PHPOFFICE_DOWNLOAD_URI)) {
      $filename = basename($filepath);
      $dirname  = PHPOFFICE_DOWNLOAD_PREFIX . basename($filepath, '.zip');

      // Remove any existing PHPOffice library directory.
      if (is_dir($dirname) || is_dir('PHPOffice-Common')) {
        drush_delete_dir($dirname, TRUE);
        drush_delete_dir('phpoffice_common', TRUE);
        drush_log(dt('A existing PHPOffice library was deleted from @path', ['@path' => $path]), 'notice');
      }

      // Decompress the zip archive
      drush_tarball_extract($filename);

      // Change the directory name to "phpoffice_common" if needed.
      if ($dirname != 'PHPOffice-Common') {
        drush_move_dir($dirname, 'PHPOffice-Common', TRUE);
        $dirname = 'PHPOffice-Common';
      }
    }

    if (is_dir($dirname)) {
      drush_log(dt('PHPOffice library has been installed in @path', ['@path' => $path]), 'success');
    }
    else {
      drush_log(dt('Drush was unable to install the PHPOffice library to @path', ['@path' => $path]), 'error');
    }

    // Set working directory back to the previous working directory.
    chdir($olddir);
  }
  else {
    drush_log(dt('Drush was unable to install the PHPOffice library because @path is not writable. If you enable the phpoffice_common module before you install the download library, you may find that phpoffice_common does not work until you reinstall the phpoffice_common module.', ['@path' => $path]), 'warning');
  }
}
