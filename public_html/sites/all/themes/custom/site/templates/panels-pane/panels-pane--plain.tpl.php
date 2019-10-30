<?php

/**
 * @file
 * Overrides plain panel template.
 */
?>
<?php if ($pane_prefix): ?>
    <?php print $pane_prefix; ?>
<?php endif; ?>

<div class="partial <?php print $classes; ?>" <?php print $id; ?>>
    <?php if ($admin_links): ?>
        <?php print $admin_links; ?>
    <?php endif; ?>

    <?php print render($title_prefix); ?>
    <?php if ($title): ?>
        <div class="partial__heading">
            <h2 class="partial__heading__title" <?php print $title_attributes; ?>><?php print $title; ?></h2>
        </div>
    <?php endif; ?>
    <?php print render($title_suffix); ?>

    <?php if ($feeds): ?>
        <div class="feed">
            <?php print $feeds; ?>
        </div>
    <?php endif; ?>

    <div class="partial__body">
        <div class="pane-content">
            <?php print render($content); ?>
        </div>
    </div>

    <?php if ($links): ?>
        <div class="links">
            <?php print $links; ?>
        </div>
    <?php endif; ?>

    <?php if ($more): ?>
        <div class="more-link">
            <?php print $more; ?>
        </div>
    <?php endif; ?>
</div>
<?php if ($pane_suffix): ?>
    <?php print $pane_suffix; ?>
<?php endif; ?>
