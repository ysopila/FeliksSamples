(function ($) {
    $.fn.displayCombo = function(options) {
        $.fn.displayCombo.defaults = $.extend({}, $.fn.displayCombo.defaults, options);

        var $holder = $(this);

        $(this).each(function () {
            $container = $(this);
            $container.on("selectedItem:toggle", changeItem);

            setContentStyles(createContent($container));
            setButtonStyles(createButton($container));
            setTextStyles(createTextElement($container));

            var value = $container.data().value;
            var listClass = '.' + $.fn.displayCombo.defaults.dropdownList;
            var displayTextClass = '.' + $.fn.displayCombo.defaults.displayText;

            $container.find(listClass).children('div').each(function () {
                var data = $(this).data().value;
                if(validateData(data) && validateData(value) && data === value){
                    $container.find(displayTextClass).text(this.textContent);
                    $(this).addClass("selected");
                }
            });
        });

        $(document).on("click", function(event){
            if(event.target.id !== $.fn.displayCombo.defaults.buttonId || 
                event.target.id !== $.fn.displayCombo.defaults.iconId){
                $('.' + $.fn.displayCombo.defaults.dropdownList).css("display", "none");
            }
        });

        function validateData(value){
            return typeof value !== 'undefined';
        }

        function changeItem(event, data) {
            $(this).find('.'+$.fn.displayCombo.defaults.displayText).text(data);
        }

        function dropDownContentClick(event){
            $(this).parent().trigger("selectedItem:toggle",  event.target.textContent);
            $(this).find('.selected').removeClass();
            $(event.target).addClass("selected"); 
            $(this).css("display", "none");
        };

        function showOptionList(event){
            var listClass = '.' + $.fn.displayCombo.defaults.dropdownList;
            var dropDownContent = $(this).parent().find(listClass);
            $holder.each(function(){
                $(this).find(listClass).hide();
            });
            dropDownContent.is(':visible') ? dropDownContent.hide() : dropDownContent.show();
            return false;
        }

        function createContent(container){
            var content = $('<div/>', {
                class: $.fn.displayCombo.defaults.dropdownList,
                click: dropDownContentClick
            });
    
            container.children('div').appendTo(content);
            container.append(content);
    
            return content;
        }
    
        function createArrow() {
            return $('<i/>', { 
                class: $.fn.displayCombo.defaults.icon,
                id: $.fn.displayCombo.defaults.iconId 
            });
        }
    
        function createTextElement(container) {
            var text = $('<p/>', { class: $.fn.displayCombo.defaults.displayText });
            container.append(text);
    
            return text;
        }
    
        function createButton(container){
            var arrow = createArrow();
    
            var button = $('<div/>', {
                class: $.fn.displayCombo.defaults.dropdownButton,
                id: $.fn.displayCombo.defaults.buttonId,
                click: showOptionList
            }).append(arrow);
    
            container.append(button);
            return button;
        }
    
        function setContentStyles(content){
            content.css({
                "display" : "none",
                "position" : "absolute",
                "top" : $container.height() + "px",
                "min-width" : "200px"
            });
        }
    
        function setTextStyles(pElem){
            pElem.css({
                "margin" : "0",
                "padding" : "10px",
                "float": "left",
                "font-size": "16px"
            });
        }
    
        function setButtonStyles(btn){
           btn.css({
                "border-left" : "1px solid black",
                "float" : "right",
                "width" : "15%",
                "height" : "100%",
                "background-color" : "lightgray"
            });
        }
    };

    $.fn.displayCombo.defaults = {
        dropdownList : 'dropdown-content',
        dropdownButton : 'dropbtn',
        displayText : 'text',
        icon : 'fas fa-caret-down',
        iconId : 'iconId',
        buttonId : 'buttonId'
    }; 
}(jQuery));