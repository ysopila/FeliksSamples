(function ($) {
    $.fn.displayCombo = function(ccName, cName, bName, tName, iName) {
        var iconName = iName;
        var containerName = ccName;
        var contentName = cName;
        var buttonName = bName;
        var textName = tName;

        var containerClassName = '.' + containerName;
        var contentClassName = '.' + contentName;
        var buttonClassName = '.' + buttonName;
        var textClassName = '.' + textName;
        var $holder = $(this);

        $(this).each(function () {
            $container = $(this);
            setContentStyles(createContent($container));
            setButtonStyles(createButton($container));
            setTextStyles(createTextElement($container));

            $(this).on("selectedItem:toggle", changeItem);

            var value = $container.data().value;
            $container.find(contentClassName).children('div').each(function () {
                if(this.attributes.length > 0 && this.attributes[0].value == value){
                    $container.find(textClassName).text(this.textContent);
                    $(this).addClass("selected");
                }
            });
        });

        $(document).on("click", function(event){
            if(event.target.className !== buttonName || 
                event.target.className !== iconName){
                $(contentClassName).css("display", "none");
            }
        });

        function changeItem(event, data) {
            $(this).find(textClassName).text(data);
        }

        function dropDownContentClick(event){
            //$(this).parent().find(textClassName).text(event.target.textContent);
            $(this).parent().trigger("selectedItem:toggle",  event.target.textContent);
            $(this).find('.selected').removeClass();
            $(event.target).addClass("selected"); 
            $(this).css("display", "none");
        };

        function showOptionList(event){
            var dropDownContent = $(this).parent().find(contentClassName);
            $holder.each(function(){
                $(this).find(contentClassName).css("display", "none");
            });
            dropDownContent.css("display", dropDownContent.css("display") === "none" ? "block" : "none");
            return false;
        }
    
        function createContent(container){
            var content = $('<div/>', {
                class: contentName,
                click: dropDownContentClick,
            });
    
            container.children('div').appendTo(content);
            container.append(content);
    
            return content;
        }
    
        function createArrow() {
            return $('<i/>', { class: iconName });
        }
    
        function createTextElement(container) {
            var text = $('<p/>', { class: textName });
            container.append(text);
    
            return text;
        }
    
        function createButton(container){
            var arrow = createArrow();
    
            var button = $('<div/>', {
                class: buttonName,
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
}(jQuery));