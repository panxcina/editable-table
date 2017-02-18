editable-table
=================

This tiny (3KB, < 120 lines) jQuery plugin turns any table into an editable spreadsheet. Here are the key features:

* No magic - works on a normal HTML table (so you can plug it in into any web
table)
* Supports validation and change events (so you can warn about invalid input or
prevent invalid changes)
* Uses standard DOM focus for selection (so does not interrupt scrolling or
tabbing outside the table)
* Native copy/paste support
* Does not force any styling (so you can style it any way you want, using normal
CSS)
* Works well with Bootstrap
* Depends only on jQuery

Basic Usage
-----------

See http://mindmup.github.com/editable-table/

Dependencies
------------
* jQuery http://jquery.com/

wc-table-editor.js
------------------

A spritual descendant of editable-table, Works pretty much alike, with an
additional ability to customize the control used based on the actual table
data element being edited. A callback can be specified which will be called
whenever a table element is selected for editing. The callback receives that
element as its sole argument and should return a form control. The control is
deep-copied, so you can reuse the same one without worrying about a conflict.

To use the callback, just put it in the options setting for the wcTableEditor
function when you initialize it:

    $("#table").wcTableEditor({
        editorOverrideFunction : functionName // or you can define an anonymous function here if you like
});

