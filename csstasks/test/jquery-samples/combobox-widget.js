(function ($) {
    $.fn.displayCombo = function(options) {
        var $holder = $(this);

        return this.each(function () {
            $.fn.displayCombo.defaults = $.extend({}, $.fn.displayCombo.defaults, options);
            var $container = $(this);
            $container.on("selectedItem:toggle", changeItem);

            setContentStyles(createContent($container));
            setButtonStyles(createButton($container));
            setTextStyles(createTextElement($container));

            var value = $container.data().value;
            var listClass = '.' + $.fn.displayCombo.defaults.dropdownList;
            var displayTextClass = '.' + $.fn.displayCombo.defaults.displayText;
            changeText($container);

            $(document).on("click", function(event){
                $(document).find('body').children('div').each(function (){
                    var $content = $(this).find(listClass);
                    $(listClass).hide();
                });
            });
    
            function changeText(container){
                var data1 = container.data().value;
                container.find(listClass).children('div').each(function () {
                    $elem = $(this);
                    var data2 = $elem.data().value;
                    if(validateData(data1) && validateData(data2) && data1 == data2){
                        container.find(displayTextClass).text(this.textContent);
                        $elem.addClass("selected");
                    }
                });
            }
    
            function validateData(value){
                return typeof value !== 'undefined';
            }
    
            function changeItem(event, data) {
                var $container = $(this);
                $container.data().value = data;
                changeText($container);
            }
    
            function createContent(container){
                var content = $('<div/>', {
                    class: $.fn.displayCombo.defaults.dropdownList,
                    click: function (event){
                        container.trigger("selectedItem:toggle",  event.target.attributes[0].value);
                        $(this).find('.selected').removeClass();
                        $(event.target).addClass("selected"); 
                        $(this).hide();
                    }
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
                    click: function (event){
                        var dropDownContent = container.find(listClass);
                        dropDownContent.toggle();
                        return false;
                    }
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

            return $container;
        });
    };

    $.fn.displayCombo.defaults = {
        dropdownList : 'dropdown-content',
        dropdownButton : 'dropbtn',
        displayText : 'text',
        icon : 'fas fa-caret-down'
    }; 
}(jQuery));