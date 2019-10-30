<?php

/**
 * @file
 * Template for 2 columns and 2 rows layout panel.
 */
?>
<div <?php print !empty($css_id) ? "id=\"$css_id\"" : ""; ?>>
  <?php if ($content['left-content-1'] || $content['right-content-1']): ?>
    <div class="row">
      
      <?php if ($content['left-content-1']): ?>
        <!-- Begin - left content -->
        <div class="col-sm-6">
          <?php print $content['left-content-1']; ?>
        </div>
        <!-- End - left content -->
      <?php endif; ?>
      
      <?php if ($content['right-content-1']): ?>
        <!-- Begin - right content -->
        <div class="col-sm-6">
          <?php print $content['right-content-1']; ?>
        </div>
        <!-- End - right content -->
      <?php endif; ?>

    </div>
  <?php endif; ?>
  
  <?php if ($content['left-content-2'] || $content['right-content-2']): ?>
    <div class="row">
      
      <?php if ($content['left-content-2']): ?>
        <!-- Begin - left content -->
        <div class="col-sm-6">
          <?php print $content['left-content-2']; ?>
        </div>
        <!-- End - left content -->
      <?php endif; ?>
      
      <?php if ($content['right-content-2']): ?>
        <!-- Begin - right content -->
        <div class="col-sm-6">
          <?php print $content['right-content-2']; ?>
        </div>
        <!-- End - right content -->
      <?php endif; ?>

    </div>
  <?php endif; ?>
</div>
