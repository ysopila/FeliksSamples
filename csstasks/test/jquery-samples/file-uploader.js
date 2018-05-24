(function($) {
    $.fn.displayImageCtrl = function(options) {
        return this.each(function() {
            var settings = $.extend({}, $.fn.displayImageCtrl.defaults, options);

            var $container = createMainContainer($(this));
            createInput(createLabel($container));

            function createZoomedImage(container, originalImage) {
                return $('<img/>', {
                    class: settings.zoomedImageClass
                }).attr("src", originalImage.attr("src")).css({
                    "width" : originalImage.width() * settings.scaleFactor,
                    "height" : originalImage.height() * settings.scaleFactor,
                    "position": "absolute"
                }).appendTo(container);
            }

            function createOverlayContainer(container, originalImage) {
                $.fn.displayImageCtrl.defaults.height = originalImage.height();
                $.fn.displayImageCtrl.defaults.width = originalImage.width();

                return $('<div/>', {
                    class: settings.overlayClass,
                    mouseleave: function(event) {
                        $(event.target).remove();
                        $container.find('.' + settings.zoomedPopupClass).remove();
                    },
                    mousemove: function(event) {
                        var offset = $(event.target).offset();
                        moveZoomScreen(event.pageX - offset.left, event.pageY - offset.top, event);
                    }
                }).appendTo(container).css({
                    "top": "0",
                    "left": "0",
                    "bottom": "0",
                    "right": "0",
                    "margin": "auto",
                    "position": "absolute",
                    "width": originalImage.width(),
                    "height": originalImage.height()
                });
            }

            function createZoomPopup(container) {
                return $('<div/>', {
                    class: settings.zoomedPopupClass
                }).css({
                    "background-color": "white",
                    "top": "-25px",
                    "left": "120px",
                    "padding": "0",
                    "position": "absolute",
                    "width": settings.widthZoomWindow,
                    "height": settings.heightZoomWindow,
                    "border": "1px solid black",
                    "overflow": "hidden"
                }).appendTo(container);
            }

            function createMainContainer(container) {
                return $('<div/>', {
                    class: settings.mainClass
                }).css({
                    "position": "absolute",
                    "top": "0",
                    "left": "0",
                    "bottom": "0",
                    "right": "0",
                    "margin": "auto",
                    "border": "2px solid black",
                    "width": "60%",
                    "height": "500px"
                }).appendTo(container);
            }

            function createImageHolder(container) {//wrapper
                return $('<img/>', {
                    class: settings.imageHolderClass,
                    mouseenter: function(event) {
                        var wrapper = createOverlayContainer(container, $(event.target))
                        createZoomedImage(createZoomPopup(wrapper), $(event.target));
                    }
                }).css({
                    "max-width": "100%",
                    "max-height": "100%",
                    "position" :"absolute",
                    "top": "0",
                    "left": "0",
                    "bottom": "0",
                    "right": "0",
                    "margin": "auto"
                }).appendTo(container);
            }

            function createLabel(container){
                return $('<label/>', {
                    class: settings.imageButtonClass
                }).css({
                    "color" : "white",
                    "background-color" : "grey",
                    "padding" : "10px 20px",
                    "position": "absolute",
                    "top": "50%",
                    "left": "50%",
                    "transform": "translate(-50%, -50%)",
                    "border" : "1.5px solid black"
                }).appendTo(container).text(settings.textButton);
            }

            function createInput(container){
                return $('<input/>', {
                    type: "file",
                    change: function(event) {
                        if (this.files && this.files[0]) {
                            var reader = new FileReader();
                            reader.onload = function(e) {
                                createImageHolder($container).attr('src', reader.result);
                                $container.find('.' + settings.imageButtonClass).remove();
                            };
                            reader.readAsDataURL(this.files[0]);
                        }
                    }
                }).css({
                    "opacity" : "0",
                    "position" : "absolute",
                    "z-index" : "-1"
                }).appendTo(container);
            }

            function validateX(x){
                return ;
            }

            function validateY(y){
                return ;
            }

            function moveZoomScreen(x, y, target) {
                var size = (settings.sizeSquare/2);
                
                $('.' + settings.zoomedImageClass).css({ 
                    "top": ((-y * settings.scaleFactor) + 75) + "px", 
                    "left": ((-x * settings.scaleFactor) + 75) + "px"
                });

                $('.' + settings.overlayClass).css({
                    "border-bottom": $.fn.displayImageCtrl.defaults.height - (y + size) + "px solid rgba(193, 193, 193, .5)",
                    "border-top": (y - size) + "px solid rgba(193, 193, 193, .5)",
                    "border-left": (x - size) + "px solid rgba(193, 193, 193, .5)",
                    "border-right": $.fn.displayImageCtrl.defaults.width - (x + size) + "px solid rgba(193, 193, 193, .5)"
                });
            }
        });

        return this;
    };

    $.fn.displayImageCtrl.defaults = {
        heightZoomWindow: "150px",
        widthZoomWindow: "150px",
        xPosZoomWindow: 75,
        yPosZoomWindow: 120,
        overlayClass: 'overlay',
        zoomedPopupClass: 'zoom-window',
        imageHolderClass: 'img-holder',
        imageButtonClass: 'load-image-button',
        zoomedImageClass: 'zoomed-image',
        mainClass: 'main',
        imageWidth: null,
        imageHeight: null,
        sizeSquare: 100,
        scaleFactor: 3,
        textButton: "Load Image"
    };
}(jQuery));