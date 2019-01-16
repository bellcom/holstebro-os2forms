PHPWord module integrates the [PHPWord](https://github.com/PHPOffice/PHPWord) library with Drupal.

> PHPWord is a library written in pure PHP that provides a set of classes to write to and read from different document file formats. The current version of PHPWord supports Microsoft [Office Open XML](http://en.wikipedia.org/wiki/Office_Open_XML) (OOXML or OpenXML), OASIS [Open Document Format for Office Applications](http://en.wikipedia.org/wiki/OpenDocument) (OpenDocument or ODF), [Rich Text Format](http://en.wikipedia.org/wiki/Rich_Text_Format) (RTF), HTML, and PDF.

### Library features

With PHPWord, you can create OOXML, ODF, or RTF documents dynamically using your PHP 5.3.3+ scripts. Below are some of the things that you can do with PHPWord library:

*   Set document properties, e.g. title, subject, and creator.
*   Create document sections with different settings, e.g. portrait/landscape, page size, and page numbering
*   Create header and footer for each sections
*   Set default font type, font size, and paragraph style
*   Use UTF-8 and East Asia fonts/characters
*   Define custom font styles (e.g. bold, italic, color) and paragraph styles (e.g. centered, multicolumns, spacing) either as named style or inline in text
*   Insert paragraphs, either as a simple text or complex one (a text run) that contains other elements
*   Insert titles (headers) and table of contents
*   Insert text breaks and page breaks
*   Insert and format images, either local, remote, or as page watermarks
*   Insert binary OLE Objects such as Excel or Visio
*   Insert and format table with customized properties for each rows (e.g. repeat as header row) and cells (e.g. background color, rowspan, colspan)
*   Insert list items as bulleted, numbered, or multilevel
*   Insert hyperlinks
*   Insert footnotes and endnotes
*   Insert drawing shapes (arc, curve, line, polyline, rect, oval)
*   Insert charts (pie, doughnut, bar, line, area, scatter, radar)
*   Insert form fields (textinput, checkbox, and dropdown)
*   Create document from templates
*   Use XSL 1.0 style sheets to transform headers, main document part, and footers of an OOXML template
*   ... and many more features on progress

### Dependencies

*   [PHPWord](https://github.com/PHPOffice/PHPWord) library.
*   [Libraries API](/project/libraries) module.
*   [X Autoload](/project/xautoload) module.
*   [PHPOffice-Common](/project/phpoffice_common) library module.
*   [Zend Stdlib](/project/zend_stdlibd) library module (optional - required for create document from templates).

### Installation

*   Download [PHPWord](https://github.com/PHPOffice/PHPWord) library, unzip and rename folder to "**zend_stdlib**".
*   Put the folder in a libraries directory (example: _sites/all/libraries/**zend_stdlib**_).
*   Install and enable [Libraries API](/project/libraries) 2.x.
*   Install and enable [X Autoload](/project/xautoload).
*   Install and enable [PHPOffice-Common](/project/phpoffice_common).
*   Install and enable PHPWord module.

([Module installation help](/docs/7/extending-drupal-7/installing-drupal-7-contributed-modules))

More examples are provided in the [samples folder](https://github.com/PHPOffice/PHPWord/blob/develop/samples). You can also read the [Developers' Documentation](http://phpword.readthedocs.io/en/latest/) and the [API Documentation](http://phpoffice.github.io/PHPWord/docs/master/) for more detail. If you find some bugs (or futures) - please tell me about in [issue](https://www.drupal.org/node/add/project-issue/phpword) ;)