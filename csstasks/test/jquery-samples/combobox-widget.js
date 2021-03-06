(function ($) {
    $.fn.displayCombo = function(options) {
        return this.each(function () {
            var settings = $.extend({}, $.fn.displayCombo.defaults, options);
            var $container = $(this);
            $container.addClass('display-combo').on("selectedItem:toggle", changeItem);

            setContentStyles(createContent($container));
            setButtonStyles(createButton($container));
            setTextStyles(createTextElement($container));

            var value = $container.data().value;
            var listClass = '.' + settings.dropdownList;
            var displayTextClass = '.' + settings.displayText;
            
            changeText($container);

            $(document).on("click", function(event) {
                var $combo = $(event.target).closest('.display-combo');
                if (!$combo.length || $combo[0] !== $container[0]) {
                    $container.find(listClass).hide();
                }
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
                    class: settings.dropdownList,
                    click: function (event) {
                        var $this = $(this);
                        container.trigger("selectedItem:toggle",  event.target.attributes[0].value);
                        $this.find('.selected').removeClass();
                        $(event.target).addClass("selected"); 
                        $this.hide();
                    }
                });
        
                container.children('div').appendTo(content);
                container.append(content);
        
                return content;
            }
        
            function createArrow() {
                return $('<i/>', { 
                    class: settings.icon
                });
            }
        
            function createTextElement(container) {
                var text = $('<p/>', { class: settings.displayText });
                container.append(text);
        
                return text;
            }

            function createButton(container){
                var arrow = createArrow();
                var button = $('<div/>', {
                    class: settings.dropdownButton,
                    click: function() {
                        $(listClass, container).toggle();
                    }
                }).append(arrow);
        
                container.append(button);
                return button;
            }
        
            function setContentStyles(content){
                content.css({
                    "display" : "none",
                    "background-color" : "white",
                    "position" : "absolute",
                    "top" : "100%",
                    "left" : "-1px",
                    "min-width" : "200px",
                    "z-index" : "1"
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
        });

        return this;
    };

    $.fn.displayCombo.defaults = {
        dropdownList : 'dropdown-content',
        dropdownButton : 'dropbtn',
        displayText : 'text',
        dropdownContainer : 'dropdown',
        icon : 'fas fa-caret-down'
    }; 
}(jQuery));