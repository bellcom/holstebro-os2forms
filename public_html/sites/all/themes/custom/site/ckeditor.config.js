/*
Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/*
 WARNING: clear browser's cache after you modify this file.
 If you don't do this, you may notice that browser is ignoring all your changes.
 */
CKEDITOR.editorConfig = function(config) {
  // [ Left, Center, Right, Justified ]
  config.justifyClasses = [ 'text-left', 'text-center', 'text-right', 'text-justify' ];
  config.wsc_lang = "da_DK";
  config.scayt_defLan = 'da_DK';
  config.allowedContent = true;
  config.extraPlugins = "lineutils,widget,leaflet";
};

// Remove all unneassecary inputs on table and image dialogs.
CKEDITOR.on('dialogDefinition', function( ev ) {
  var dialogName = ev.data.name;
  var dialogDefinition = ev.data.definition;
  var infoTab = dialogDefinition.getContents('info');

  if(dialogName === 'table' || dialogName == 'tableProperties' ) {

    //remove fields
    infoTab
        .remove('txtCellSpace')
        .remove('txtCellPad')
        .remove('txtBorder')
        .remove('txtWidth')
        .remove('txtHeight')
        .remove('cmbAlign');
  }

  if(dialogName === 'image') {
    infoTab.remove('txtBorder');
  }
});
