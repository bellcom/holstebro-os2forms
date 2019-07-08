<?php

/**
 * @file
 * Overrides page template.
 */
?>
<!-- Begin - wrapper -->
<div class="layout__wrapper">

  <!-- Begin - sidr source provider -->
  <aside class="sidr-source-provider">

    <!-- Begin - navigation -->
    <nav class="slinky-menu" role="navigation">
      <?php print render($menu_slinky__main_menu); ?>
    </nav>
    <!-- End - navigation -->

  </aside>
  <!-- End - sidr source provider -->

  <!-- Begin - header static -->
  <header class="flexy-header flexy-header--static hidden-print">
    <div class="flexy-header__row flexy-header__row--first hidden-xs">
      <div class="container-fluid">
        <div class="flexy-row">
          <div class="flexy-spacer"></div>

          <!-- Begin - navigation -->
          <nav class="flexy-header__secondary-navigation"
               role="navigation">
            <?php print render($flexy_list__secondary); ?>
          </nav>
          <!-- End - navigation -->

        </div>
      </div>
    </div>
    <div class="flexy-header__row flexy-header__row--second">
      <div class="container-fluid">
        <div class="flexy-row">

          <!-- Begin - logo -->
          <a href="<?php print $front_page; ?>" class="flexy-header__logo">
            <img src="<?php print $logo; ?>"
                 alt="<?php print t('@site_name logo', array('@site_name' => $site_name)); ?>"/>
          </a>
          <!-- End - logo -->

          <div class="flexy-spacer"></div>

          <!-- Begin - navigation -->
          <nav class="flexy-header__navigation__wrapper hidden-xs hidden-sm"
               role="navigation">
            <?php print render($flexy_navigation__primary); ?>
          </nav>
          <!-- End - navigation -->

          <!-- Begin - responsive toggle -->
          <button
            class="flexy-header__sidebar-toggle sidr-toggle--right visible-xs visible-sm">
            <span class="icon fa fa-bars"></span>
          </button>
          <!-- End - responsive toggle -->

        </div>
      </div>
    </div>
  </header>
  <!-- End - header static -->

  <!-- Begin - header sticky -->
  <header class="flexy-header flexy-header--sticky hidden-print">
    <div class="flexy-header__row">
      <div class="container-fluid">
        <div class="flexy-row">

          <!-- Begin - logo -->
          <a href="<?php print $front_page; ?>" class="flexy-header__logo">
            <img src="<?php print $logo; ?>"
                 alt="<?php print t('@site_name logo', array('@site_name' => $site_name)); ?>"/>
          </a>
          <!-- End - logo -->

          <div class="flexy-spacer"></div>

          <!-- Begin - navigation -->
          <nav class="flexy-header__navigation__wrapper hidden-xs hidden-sm"
               role="navigation">
            <?php print render($flexy_navigation__primary); ?>
          </nav>
          <!-- End - navigation -->

          <!-- Begin - responsive toggle -->
          <button
            class="flexy-header__sidebar-toggle sidr-toggle--right visible-xs visible-sm">
            <span class="icon fa fa-bars"></span>
          </button>
          <!-- End - responsive toggle -->

        </div>
      </div>
    </div>
  </header>
  <!-- End - header sticky -->

  <!-- Begin - content -->
  <main class="layout__content" role="main">
    <a id="main-content"></a>

    <section class="sectioned sectioned--page-header sectioned--small-inner-spacing">
      <div class="sectioned__inner">
        <div class="container-fluid">
          <div class="row">
            <div class="col-xs-12 col-md-6">

              <?php if (!empty($title)): ?>
                <h1><?php print $title; ?></h1>
              <?php endif; ?>

            </div>
            <div class="col-xs-12 col-md-6">
              <div class="hidden-xs text-right text-sm-left breadcrumb__wrapper hidden-print">
                <?php print $breadcrumb; ?>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sectioned">
      <div class="sectioned__inner">
        <div class="container-fluid">

          <?php if (!empty($page['help'])): ?>
            <?php print render($page['help']); ?>
          <?php endif; ?>

          <?php if (!empty($action_links)): ?>
            <ul class="action-links"><?php print render($action_links); ?></ul>
          <?php endif; ?>

          <?php if (!empty($messages)): ?>
            <!-- Begin - messages -->
            <?php print $messages; ?>
            <!-- End - messages -->
          <?php endif; ?>

          <?php if (!empty($tabs_primary)): ?>
            <!-- Begin - tabs primary -->
            <?php print render($tabs_primary); ?>
            <!-- End - tabs primary -->
          <?php endif; ?>

          <?php if (!empty($tabs_secondary)): ?>
            <!-- Begin - tabs secondary -->
            <?php print render($tabs_secondary); ?>
            <!-- End - tabs secondary -->
          <?php endif; ?>

          <?php if (!empty($page['sidebar__right'])): ?>
            <div class="row">
              <section class="col-sm-8">
                <?php print render($page['content']); ?>
              </section>

              <aside class="hidden-xs col-sm-4" role="complementary">
                <?php print render($page['sidebar__right']); ?>
              </aside>
            </div>

          <?php else: ?>
            <?php print render($page['content']); ?>
          <?php endif; ?>

        </div>
      </div>
    </section>
  </main>
  <!-- End - content -->

  <!-- Begin - footer -->
  <footer class="layout__footer">
    <div class="container-fluid">
      <div class="layout__footer__inner">
        <div class="text-center">
          &copy; <?php echo date('Y'); ?> <?php print t('OS2forms'); ?>
        </div>
      </div>
    </div>
  </footer>
  <!-- End - footer -->

</div>
<!-- End - wrapper -->
