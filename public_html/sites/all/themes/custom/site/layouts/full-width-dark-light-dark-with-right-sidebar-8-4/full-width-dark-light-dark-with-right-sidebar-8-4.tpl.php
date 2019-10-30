<?php

/**
 * @file
 * Template for full-width-dark-light-dark-with-right-sidebar 8-4 layout panel.
 */
?>
<div <?php print !empty($css_id) ? "id=\"$css_id\"" : ""; ?>>
  <?php if ($content['light_section_0']): ?>
    <!-- Begin - light section no. 0 -->
    <div class="sectioned sectioned--light">
      <div class="sectioned__inner">
        <div class="container">
          <div class="panels-pane-region panels-pane-region--light-section-0">
            <?php echo $content['light_section_0']; ?>
          </div>
        </div>
      </div>
    </div>
    <!-- End - light section no. 0 -->
  <?php endif; ?>

  <?php if ($content['content'] or $content['sidebar']): ?>
    <!-- Begin - light section -->
    <div class="sectioned sectioned--light">
      <div class="sectioned__inner">
        <div class="container">
          <div class="row">

            <?php if ($content['sidebar']): ?>

              <!-- Begin - content -->
              <div class="col-sm-7 col-lg-8">
                <?php echo $content['content']; ?>
              </div>
              <!-- End - content -->

              <!-- Begin - sidebar -->
              <div class="col-sm-5 col-lg-4 hidden-print">
                <?php echo $content['sidebar']; ?>
              </div>
              <!-- End - sidebar -->

            <?php else: ?>

              <!-- Begin - content -->
              <div class="col-xs-12">
                <?php echo $content['content']; ?>
              </div>
              <!-- End - content -->

            <?php endif ?>

          </div>
        </div>
      </div>
    </div>
    <!-- End - light section -->
  <?php endif ?>

  <?php if ($content['light_section_1']): ?>
    <!-- Begin - light section no. 1 -->
    <div class="sectioned sectioned--light">
      <div class="sectioned__inner">
        <div class="container">
          <div class="panels-pane-region panels-pane-region--light-section-1">
            <?php echo $content['light_section_1']; ?>
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
          <div class="panels-pane-region panels-pane-region--dark-section-1">
            <?php echo $content['dark_section_1']; ?>
          </div>
        </div>
      </div>
    </div>
    <!-- End - dark section no. 1 -->
  <?php endif; ?>

</div>
