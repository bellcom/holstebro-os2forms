<?php
/**
 * @file
 * NemID Login block template.
 */
?>
<script type="text/x-nemid" id="nemid_parameters"><?php echo $params;?></script>
<?php if (!$errors): ?>
<iframe id="nemid_iframe" title="NemID" allowfullscreen="true" scrolling="no" frameborder="0" style="width:300px;height:450px;border:0; display:inline-block" src="<?php echo $settings['iframe_url']; ?>"></iframe>
  <div style="display:inline-block; vertical-align: top; width: 500px"><?php print $help; ?></div>
  <form name="postBackForm" action="<?php print $post_back_form_action;?>" method="post">
    <input type="hidden" name="response" value=""/>
  </form>
<?php else:
  echo t("There was a problem the NemID client");
endif;?>
