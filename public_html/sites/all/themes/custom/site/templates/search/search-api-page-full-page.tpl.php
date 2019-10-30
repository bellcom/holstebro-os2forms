<?php

/**
 * @file
 * Default theme implementation for displaying a search page.
 *
 * This template renders a page containing a search form and, possibly, search
 * results.
 *
 * Available variables:
 * - $results: The renderable search results.
 * - $form: The search form.
 *
 * @see template_preprocess_search_api_page()
 */
?>

<div class="search-results">

  <h1 class="sr-only"><?php print t('Search'); ?></h1>

  <!-- Begin - form -->
  <div class="search-results__form">
    <div class="boxy">
      <div class="boxy__body">

        <div class="form-inline">
          <?php print render($form); ?>
        </div>

      </div>
    </div>
  </div>
  <!-- End - form -->

  <!-- Begin - list -->
  <div class="search-results__list">
    <?php print render($results); ?>
  </div>
  <!-- End - list -->

</div>
