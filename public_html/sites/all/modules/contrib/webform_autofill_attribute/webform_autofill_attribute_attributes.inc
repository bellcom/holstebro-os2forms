<?php

/**
 * @file
 * Containers the attribute options for the webform autofill attribute module.
 */

/**
 * Return select element options.
 *
 * Return select element options that the user can choose from
 * to add as attributes to their form elements.
 *
 * @return array
 *   Attribute options for the select element.
 */
function _webform_autofill_attribute_get_attributes() {
  return array(
    t('Name') => array(
      'name' => t('Full name (name)'),
      'given-name' => t('First name (given-name)'),
      'additional-name' => t('Middle name (additional-name)'),
      'family-name' => t('Last name (family-name)'),
    ),
    t('Email') => array(
      'email' => t('Email address (email)'),
    ),
    t('Credit Card') => array(
      'cc-name' => t('Card name (cc-name)'),
      'cc-number' => t('Card number (cc-number)'),
      'cc-csc' => t('Card CVV code (cc-csc)'),
      'cc-exp-month' => t('Card expiry month (cc-exp-month)'),
      'cc-exp-year' => t('Card expiry year (cc-exp-year)'),
      'cc-exp' => t('Card expiry (cc-exp)'),
      'cc-type' => t('Card type (cc-type)'),
    ),
    t('Address') => array(
      'street-address' => t('Single line address (street-address)'),
      'address-line1' => t('Line one of multi-line address (address-line1)'),
      'address-line2' => t('Line two of multi-line address (address-line2)'),
      'address-line3' => t('Line three of multi-line address (address-line3)'),
      'address-line4' => t('Line four of multi-line address (address-line4)'),
      'address-level1' => t('State or province (address-level1)'),
      'address-level2' => t('City (address-level2)'),
      'postal-code' => t('Postal code or zip code (postal-code)'),
      'country' => t('Country name (country)'),
    ),
    t('Phone') => array(
      'tel' => t('Phone or mobile number (tel)'),
    ),
    t('Sections') => array(
      'shipping' => t('Fieldset of shipping details (shipping)'),
      'billing' => t('Fieldset of billing details (billing)'),
    ),
  );
}
