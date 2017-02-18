/* Lightweight table editor, inspired by and adapted from
https://github.com/mindmup/editable-table

Primary difference: allows you to specify a callback that can change what
type of edit control to use for the given field. The callback will receive
the individual table element being changed as an argument, so you can use
that to make the decision based on class, position, or whatever other
criteria you deem important.

Supports input, select, and input checkboxes at a minimum. Ideally, will be
able to support Daniel Farrell's Bootstrap combobox, too.

I'm writing this with Bootstrap in mind, but like Mindmup's widget, this
won't depend on it. It does depend on jQuery, though. 

*/
$.fn.wcTableEditor = function (options) {
    'use strict';
    return $(this).each(function () {
        var buildDefaultOptions = function () {
            var opts = $.extend({}, $.fn.wcTableEditor.defaultOptions);
            opts.defaultEditor.clone();
            return opts;
        },
        activeOptions = $.extend(buildDefaultOptions(), options),
        // key bind codes
        ARROW_LEFT = 37,
        ARROW_UP = 38,
        ARROW_RIGHT = 39,
        ARROW_DOWN = 40,
        ENTER = 13,
        ESC = 27,
        TAB = 9,
        CTRL = 17,
        WIN = 91,
        MENU = 93,
        tableElement = $(this),
        makeEditor = function (editor) {
            return editor.css('position', 'absolute').hide()
                .appendTo(tableElement.parent())
        },
        active,
        defaultEditor = makeEditor(activeOptions.defaultEditor),
        currentEditor = defaultEditor,
        editorOverride = activeOptions.editorOverrideFunction,
        invokeEditor = function(editor) {
            editor.val(active.text())
                .removeClass('error')
                .show()
                .offset(active.offset())
                .css(active.css(activeOptions.cloneProperties))
                .width(active.width())
                .height(active.height())
                .focus()
                .blur(function () {
                    setActiveText();
                    currentEditor.hide();
                })
                .keydown(function (e) {
                    switch (e.which) {
                        case ENTER:
                            e.preventDefault();
                            e.stopPropagation();
                            active.focus();
                            break;
                        case ESC:
                            currentEditor.val(active.text());
                            e.preventDefault();
                            e.stopPropagation();
                            currentEditor.hide();
                            active.focus();
                            break;
                        case TAB:
                            active.focus();
                        default:
                            break;
                    }
                })
                .on('input paste', function () {
					var evt = $.Event('validate');
                    active.trigger(evt, editor.val());
                    if (evt.result === false) {
                        editor.addClass('error');
                    } else {
                        editor.removeClass('error');
                    }
                });
            return editor;
        },
        setActiveText = function () {
            var text = currentEditor.val(),
                evt = $.Event('change'),
                originalContent;
            if (active.text() === text || currentEditor.hasClass('error')) {
                return true;
            }
            originalContent = active.html();
            active.text(text).trigger(evt, text);
            if (evt.result === false) {
                active.html(originalContent);
            }
        },
        movement = function (element, keycode) {
            var rtnList = [];
            switch (keycode) {
                case ARROW_RIGHT:
                    rtnList = element.next('td');
                    break;
                case ARROW_LEFT:
                    rtnList = element.prev('td');
                    break;
                case ARROW_UP:
                    rtnList = element.parent().prev().children().eq(element.index());
                    break;
                case ARROW_DOWN:
                    rtnList = element.parent().next().children().eq(element.index());
                    break;
            }
            return rtnList;
        },
        showEditor = function (select) {
            active = tableElement.find('td:focus');
            if (active.length) {
                if (editorOverride && typeof editorOverride == "function") {
                    currentEditor.hide();
                    currentEditor = makeEditor(editorOverride(active));
                }
                currentEditor = invokeEditor(currentEditor);
                if (select) {
                    currentEditor.select();
                }    
            } 
        };
        tableElement.on('click keypress dblclick', showEditor)
            .css('cursor', 'pointer')
            .keydown(function (e) {
                var prevent = true,
                    possibleMove = movement($(e.target), e.which);
                if (possibleMove.length) {
                    possibleMove.focus();
                }
                else if (e.which === ENTER) {
                    showEditor(false);
                }
                else if (e.which === CTRL || e.which === WIN
                         || e.which === MENU) {
                    showEditor(true);
                    prevent = false;
                }
                else {
                    prevent = false;
                }
                if (prevent) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            })
            .find('td').prop('tabindex', 1);
    });
};

$.fn.wcTableEditor.defaultOptions = {
	cloneProperties: ['padding', 'padding-top', 'padding-bottom', 
                      'padding-left', 'padding-right', 'text-align', 'font', 
                      'font-size', 'font-family', 'font-weight',
                      'border', 'border-top', 'border-bottom', 'border-left',
                      'border-right'],
    defaultEditor: $('<input>'),
    editorOverrideFunction : false
};
