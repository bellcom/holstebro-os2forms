<?php

/**
 * @file
 * Search result page template.
 */
$title = (strlen($title) > 45) ? substr($title, 0, 45) . '...' : $title;
?>

<div class="search-results__list__item">
  <a href="<?php print url($url['path']); ?>" class="element-wrapper-link">
    <div class="entity-list-advanced entity-list-advanced--search-result">

      <div class="entity-list-advanced__body">

        <div class="entity-list-advanced__heading">
          <h3
            class="entity-list-advanced__heading__title heading-h4"><?php print check_plain($title); ?></h3>
        </div>
        <?php if ($snippet or $info) : ?>
          <div class="entity-list-advanced__search-snippet">

            <?php if ($snippet) : ?>
              <p><?php print strip_tags($snippet, '<br>'); ?></p>
            <?php endif; ?>
          </div>
        <?php endif; ?>

      </div>

    </div>

  </a>
</div>
