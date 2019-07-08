<?php

/**
 * @file
 * Settings for base Bellcom theme.
 */

/**
 * Implements hook_form_FORM_ID_alter().
 */
function bellcom_form_system_theme_settings_alter(&$form, $form_state, $form_id = NULL) {

  // Vertical tabs.
  $form['options'] = [
    '#type' => 'vertical_tabs',
    '#default_tab' => 'main',
    '#weight' => '-20',
    '#prefix' => '<h2><small>' . t('Bellcom indstillinger') . '</small></h2>',
    '#title' => t('Bellcom indstillinger'),
  ];

  // Contact information
  // Sets all necessary options to save data.
  // Fieldset.
  $form['options']['contact_information'] = [
    '#type' => 'fieldset',
    '#title' => t('Kontakt information'),
  ];

  // Business owner name.
  $form['options']['contact_information']['business_owner_name'] = [
    '#type' => 'textfield',
    '#title' => t('Navn'),
    '#default_value' => theme_get_setting('business_owner_name'),
  ];

  // Business startup year.
  $form['options']['contact_information']['business_startup_year'] = [
    '#type' => 'textfield',
    '#title' => t('Opstartsår'),
    '#description' => t('Det årstal der vises i copyright. <br>Eks. Copyright <strong><u>2011</u></strong>') . ' - ' . date('Y'),
    '#default_value' => theme_get_setting('business_startup_year'),
  ];

  // Address.
  $form['options']['contact_information']['address'] = [
    '#type' => 'textfield',
    '#title' => t('Adresse'),
    '#default_value' => theme_get_setting('address'),
  ];

  // Zipcode.
  $form['options']['contact_information']['zipcode'] = [
    '#type' => 'textfield',
    '#title' => t('Postnr'),
    '#default_value' => theme_get_setting('zipcode'),
  ];

  // City.
  $form['options']['contact_information']['city'] = [
    '#type' => 'textfield',
    '#title' => t('By'),
    '#default_value' => theme_get_setting('city'),
  ];

  // Phone number.
  $form['options']['contact_information']['phone_system'] = [
    '#type' => 'textfield',
    '#title' => t('Telefon'),
    '#description' => t('HUSK: uden mellemrum og inkl. +45 f.eks.: +4570260085'),
    '#default_value' => theme_get_setting('phone_system'),
  ];

  // Phone number - readable.
  $form['options']['contact_information']['phone_readable'] = [
    '#type' => 'textfield',
    '#title' => t('Vist telefon nummer'),
    '#description' => t('Telefonnummeret vist (brug evt. mellemrum så det er let læseligt)'),
    '#default_value' => theme_get_setting('phone_readable'),
  ];

  // E-mail address.
  $form['options']['contact_information']['email'] = [
    '#type' => 'textfield',
    '#title' => t('E-mail'),
    '#default_value' => theme_get_setting('email'),
  ];

  // Working hours.
  $form['options']['contact_information']['working_hours'] = [
    '#type' => 'textfield',
    '#title' => t('Åbningstid eller anden info'),
    '#default_value' => theme_get_setting('working_hours'),
  ];

  // Social links
  // Sets all necessary options to save data.
  // Fieldset.
  $form['options']['social_links'] = [
    '#type' => 'fieldset',
    '#title' => t('Sociale tjenester'),
  ];

  // Facebook.
  $form['options']['social_links']['facebook'] = [
    '#type' => 'checkbox',
    '#title' => t('Facebook'),
    '#default_value' => theme_get_setting('facebook'),
  ];
  $form['options']['social_links']['facebook_url'] = [
    '#type' => 'textfield',
    '#title' => t('Facebook URL'),
    '#default_value' => theme_get_setting('facebook_url'),
    '#states' => [
      // Hide the options when the cancel notify checkbox is disabled.
      'visible' => [
        ':input[name="facebook"]' => [
          'checked' => TRUE,
        ],
      ],
    ],
  ];
  $form['options']['social_links']['facebook_tooltip'] = [
    '#type' => 'textfield',
    '#title' => t('Tekst ved mouse-over'),
    '#default_value' => theme_get_setting('facebook_tooltip'),
    '#states' => [
      // Hide the options when the cancel notify checkbox is disabled.
      'visible' => [
        ':input[name="facebook"]' => [
          'checked' => TRUE,
        ],
      ],
    ],
  ];

  // Twitter.
  $form['options']['social_links']['twitter'] = [
    '#type' => 'checkbox',
    '#title' => t('Twitter'),
    '#default_value' => theme_get_setting('twitter'),
  ];
  $form['options']['social_links']['twitter_url'] = [
    '#type' => 'textfield',
    '#title' => t('Twitter URL'),
    '#default_value' => theme_get_setting('twitter_url'),
    '#states' => [
      // Hide the options when the cancel notify checkbox is disabled.
      'visible' => [
        ':input[name="twitter"]' => [
          'checked' => TRUE,
        ],
      ],
    ],
  ];
  $form['options']['social_links']['twitter_tooltip'] = [
    '#type' => 'textfield',
    '#title' => t('Tekst ved mouse-over'),
    '#default_value' => theme_get_setting('twitter_tooltip'),
    '#states' => [
      // Hide the options when the cancel notify checkbox is disabled.
      'visible' => [
        ':input[name="twitter"]' => [
          'checked' => TRUE,
        ],
      ],
    ],
  ];

  // Google plus.
  $form['options']['social_links']['googleplus'] = [
    '#type' => 'checkbox',
    '#title' => t('Google plus'),
    '#default_value' => theme_get_setting('googleplus'),
  ];
  $form['options']['social_links']['googleplus_url'] = [
    '#type' => 'textfield',
    '#title' => t('Google plus URL'),
    '#default_value' => theme_get_setting('googleplus_url'),
    '#states' => [
      // Hide the options when the cancel notify checkbox is disabled.
      'visible' => [
        ':input[name="googleplus"]' => [
          'checked' => TRUE,
        ],
      ],
    ],
  ];
  $form['options']['social_links']['googleplus_tooltip'] = [
    '#type' => 'textfield',
    '#title' => t('Tekst ved mouse-over'),
    '#default_value' => theme_get_setting('googleplus_tooltip'),
    '#states' => [
      // Hide the options when the cancel notify checkbox is disabled.
      'visible' => [
        ':input[name="googleplus"]' => [
          'checked' => TRUE,
        ],
      ],
    ],
  ];

  // Instagram.
  $form['options']['social_links']['instagram'] = [
    '#type' => 'checkbox',
    '#title' => t('Instagram'),
    '#default_value' => theme_get_setting('instagram'),
  ];
  $form['options']['social_links']['instagram_url'] = [
    '#type' => 'textfield',
    '#title' => t('Instagram URL'),
    '#default_value' => theme_get_setting('instagram_url'),
    '#states' => [
      // Hide the options when the cancel notify checkbox is disabled.
      'visible' => [
        ':input[name="instagram"]' => [
          'checked' => TRUE,
        ],
      ],
    ],
  ];
  $form['options']['social_links']['instagram_tooltip'] = [
    '#type' => 'textfield',
    '#title' => t('Tekst ved mouse-over'),
    '#default_value' => theme_get_setting('instagram_tooltip'),
    '#states' => [
      // Hide the options when the cancel notify checkbox is disabled.
      'visible' => [
        ':input[name="instagram"]' => [
          'checked' => TRUE,
        ],
      ],
    ],
  ];

  // LinkedIn.
  $form['options']['social_links']['linkedin'] = [
    '#type' => 'checkbox',
    '#title' => t('LinkedIn'),
    '#default_value' => theme_get_setting('linkedin'),
  ];
  $form['options']['social_links']['linkedin_url'] = [
    '#type' => 'textfield',
    '#title' => t('LinkedIn URL'),
    '#default_value' => theme_get_setting('linkedin_url'),
    '#states' => [
      // Hide the options when the cancel notify checkbox is disabled.
      'visible' => [
        ':input[name="linkedin"]' => [
          'checked' => TRUE,
        ],
      ],
    ],
  ];
  $form['options']['social_links']['linkedin_tooltip'] = [
    '#type' => 'textfield',
    '#title' => t('Tekst ved mouse-over'),
    '#default_value' => theme_get_setting('linkedin_tooltip'),
    '#states' => [
      // Hide the options when the cancel notify checkbox is disabled.
      'visible' => [
        ':input[name="linkedin"]' => [
          'checked' => TRUE,
        ],
      ],
    ],
  ];

  // Pinterest.
  $form['options']['social_links']['pinterest'] = [
    '#type' => 'checkbox',
    '#title' => t('Pinterest'),
    '#default_value' => theme_get_setting('pinterest'),
  ];
  $form['options']['social_links']['pinterest_url'] = [
    '#type' => 'textfield',
    '#title' => t('Pinterest URL'),
    '#default_value' => theme_get_setting('pinterest_url'),
    '#states' => [
      // Hide the options when the cancel notify checkbox is disabled.
      'visible' => [
        ':input[name="pinterest"]' => [
          'checked' => TRUE,
        ],
      ],
    ],
  ];
  $form['options']['social_links']['pinterest_tooltip'] = [
    '#type' => 'textfield',
    '#title' => t('Tekst ved mouse-over'),
    '#default_value' => theme_get_setting('pinterest_tooltip'),
    '#states' => [
      // Hide the options when the cancel notify checkbox is disabled.
      'visible' => [
        ':input[name="pinterest"]' => [
          'checked' => TRUE,
        ],
      ],
    ],
  ];

  // Vimeo.
  $form['options']['social_links']['vimeo'] = [
    '#type' => 'checkbox',
    '#title' => t('Vimeo'),
    '#default_value' => theme_get_setting('vimeo'),
  ];
  $form['options']['social_links']['vimeo_url'] = [
    '#type' => 'textfield',
    '#title' => t('Vimeo URL'),
    '#default_value' => theme_get_setting('vimeo_url'),
    '#states' => [
      // Hide the options when the cancel notify checkbox is disabled.
      'visible' => [
        ':input[name="vimeo"]' => [
          'checked' => TRUE,
        ],
      ],
    ],
  ];
  $form['options']['social_links']['vimeo_tooltip'] = [
    '#type' => 'textfield',
    '#title' => t('Tekst ved mouse-over'),
    '#default_value' => theme_get_setting('vimeo_tooltip'),
    '#states' => [
      // Hide the options when the cancel notify checkbox is disabled.
      'visible' => [
        ':input[name="vimeo"]' => [
          'checked' => TRUE,
        ],
      ],
    ],
  ];

  // Youtube.
  $form['options']['social_links']['youtube'] = [
    '#type' => 'checkbox',
    '#title' => t('Youtube'),
    '#default_value' => theme_get_setting('youtube'),
  ];
  $form['options']['social_links']['youtube_url'] = [
    '#type' => 'textfield',
    '#title' => t('Youtube URL'),
    '#default_value' => theme_get_setting('youtube_url'),
    '#states' => [
      // Hide the options when the cancel notify checkbox is disabled.
      'visible' => [
        ':input[name="youtube"]' => [
          'checked' => TRUE,
        ],
      ],
    ],
  ];
  $form['options']['social_links']['youtube_tooltip'] = [
    '#type' => 'textfield',
    '#title' => t('Tekst ved mouse-over'),
    '#default_value' => theme_get_setting('youtube_tooltip'),
    '#states' => [
      // Hide the options when the cancel notify checkbox is disabled.
      'visible' => [
        ':input[name="youtube"]' => [
          'checked' => TRUE,
        ],
      ],
    ],
  ];
}
