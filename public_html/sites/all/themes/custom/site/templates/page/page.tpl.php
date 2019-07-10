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
    <div class="flexy-header__row">
      <div class="container">
        <div class="flexy-row">

          <!-- Begin - logo -->
          <a href="<?php print $front_page; ?>" class="flexy-header__logo">
            <img src="<?php print $logo; ?>"
                 alt="<?php print t('@site_name logo', array('@site_name' => $site_name)); ?>"/>
          </a>
          <!-- End - logo -->

          <div class="flexy-spacer"></div>

          <!-- Begin - navigation -->
          <nav class="flexy-header__navigation__wrapper"
               role="navigation">
            <ul class="flexy-navigation">
              <li class="flexy-navigation__item">
                <a href="https://rebild.dk">
                  Gå tilbage til rebild.dk
                </a>
              </li>
            </ul>
          </nav>
          <!-- End - navigation -->

        </div>
      </div>
    </div>
  </header>
  <!-- End - header static -->

  <!-- Begin - header sticky -->
  <header class="flexy-header flexy-header--sticky hidden-print">
    <div class="flexy-header__row">
      <div class="container">
        <div class="flexy-row">

          <!-- Begin - logo -->
          <a href="<?php print $front_page; ?>" class="flexy-header__logo">
            <img src="<?php print $logo; ?>"
                 alt="<?php print t('@site_name logo', array('@site_name' => $site_name)); ?>"/>
          </a>
          <!-- End - logo -->

          <div class="flexy-spacer"></div>

          <!-- Begin - navigation -->
          <nav class="flexy-header__navigation__wrapper"
               role="navigation">
            <ul class="flexy-navigation">
              <li class="flexy-navigation__item">
                <a href="https://rebild.dk">
                  Gå tilbage til rebild.dk
                </a>
              </li>
            </ul>
          </nav>
          <!-- End - navigation -->

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
        <div class="container">

          <?php if (!empty($title)): ?>
            <div class="text-center">
              <h1><?php print $title; ?></h1>
            </div>
          <?php endif; ?>

          <!-- Begin - placeholder -->
          <div class="webform-progressbar-placeholder"></div>
          <!-- End - placeholder -->

        </div>
      </div>
    </section>

    <section class="sectioned">
      <div class="sectioned__inner">
        <div class="container">

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

          <div class="boxy boxy--main-content">
            <div class="boxy__body">

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
            <div class="boxy__footer">
              <div class="text-right">
                <a href="#main-content">
                  Til toppen <span class="icon fa fa-arrow-up"></span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  </main>
  <!-- End - content -->

  <!-- Begin - footer -->
  <footer class="layout__footer">
    <div class="container">
      <div class="layout__footer__inner">
        <div class="text-center">

          <!-- Begin - logo -->
          <a href="<?php print $front_page; ?>">
            <img src="<?php print $logo; ?>" alt="<?php print t('@site_name logo', array('@site_name' => $site_name)); ?>"/>
          </a>
          <!-- End - logo -->

          <!-- Begin - company details -->
          <div class="flexy-list flexy-list--centered">

            <?php if (!empty($theme_settings['contact_information']['address'])) : ?>
              <div>
                <?php print $theme_settings['contact_information']['address']; ?>
              </div>
            <?php endif; ?>

            <?php if (!empty($theme_settings['contact_information']['zipcode']) && !empty($theme_settings['contact_information']['city'])) : ?>
              <div>
                <?php print $theme_settings['contact_information']['zipcode'] . ' ' . $theme_settings['contact_information']['city']; ?>
              </div>
            <?php endif; ?>

            <?php if (!empty($theme_settings['contact_information']['phone_system']) && !empty($theme_settings['contact_information']['phone_readable'])) : ?>
              <div>
                Tlf.: <?php print '<a href="tel:' . $theme_settings['contact_information']['phone_system'] . '">' . $theme_settings['contact_information']['phone_readable'] . '</a>'; ?>
              </div>
            <?php endif; ?>

            <?php if (!empty($theme_settings['contact_information']['email'])) : ?>
              <div>
                E-mail: <?php print '<a href="mailto:' . $theme_settings['contact_information']['email'] . '">' . $theme_settings['contact_information']['email'] . '</a>'; ?>
              </div>
            <?php endif; ?>

          </div>
          <!-- End - company details -->

        </div>
      </div>
    </div>
  </footer>
  <!-- End - footer -->

</div>
<!-- End - wrapper -->
