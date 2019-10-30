<?php

/**
 * @file
 * Template for sectioned top dark layout panel.
 */
?>
<div <?php print !empty($css_id) ? "id=\"$css_id\"" : ""; ?>>
  <?php if ($content['top']): ?>
    <!-- Begin - top -->
    <div class="panels-pane-region panels-pane-region--top">
      <?php print $content['top']; ?>
    </div>
    <!-- End - top -->
  <?php endif ?>

  <?php if ($content['light_section_1']): ?>
    <!-- Begin - light section no. 1 -->
    <div class="sectioned sectioned--light">
      <div class="sectioned__inner">
        <div class="container">
          <div class="row">
            <div class="col-xs-12">
              <div class="panels-pane-region panels-pane-region--light-section-1">
                <?php echo $content['light_section_1']; ?>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- End - light section no. 1 -->
  <?php endif; ?>

  <?php if ($content['dark_section_1']): ?>
    <!-- Begin - dark section no. 1 -->
    <div class="sectioned sectioned--dark">
      <div class="sectioned__inner">
        <div class="container">
          <div class="row">
            <div class="col-xs-12">
              <div class="panels-pane-region panels-pane-region--dark-section-1">
                <?php echo $content['dark_section_1']; ?>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- End - dark section no. 1 -->
  <?php endif; ?>

  <?php if ($content['light_section_2']): ?>
    <!-- Begin - light section no. 2 -->
    <div class="sectioned sectioned--light">
      <div class="sectioned__inner">
        <div class="container">
          <div class="row">
            <div class="col-xs-12">
              <div class="panels-pane-region panels-pane-region--light-section-2">
                <?php echo $content['light_section_2']; ?>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- End - light section no. 2 -->
  <?php endif; ?>

  <?php if ($content['dark_section_2']): ?>
    <!-- Begin - dark section no. 2 -->
    <div class="sectioned sectioned--dark">
      <div class="sectioned__inner">
        <div class="container">
          <div class="row">
            <div class="col-xs-12">
              <div class="panels-pane-region panels-pane-region--dark-section-2">
                <?php echo $content['dark_section_2']; ?>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- End - dark section no. 2 -->
  <?php endif; ?>

</div>
