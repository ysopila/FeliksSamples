(function($) {
    $.fn.displayImageCtrl = function(options) {
        return this.each(function() {
            var settings = $.extend({}, $.fn.displayImageCtrl.defaults, options);

            var $container = createMainContainer($(this));
            createButton($container);

            function createZoomedImage(container, originalImage) {
                return $('<img/>', {
                    class: settings.zoomedImageClass
                }).attr("src", originalImage.attr("src")).css({
                    "width" : originalImage.width() * settings.scaleFactor,
                    "height" : originalImage.height() * settings.scaleFactor,
                    "position": "absolute"
                }).appendTo(container);
            }

            function createOverlayContainer(container, width, height) {
                $.fn.displayImageCtrl.defaults.height = height;
                $.fn.displayImageCtrl.defaults.width = width;

                return $('<div/>', {
                    class: settings.overlayClass,
                    mouseleave: function(event) {
                        $(event.target).remove();
                        $container.find('.' + settings.zoomedPopupClass).remove();
                    },
                    mousemove: function(event) {
                        var offset = $(event.target).offset();
                        moveZoomScreen(event.pageX - offset.left, event.pageY - offset.top);
                    }
                }).appendTo($container).css({
                    "left": "0",
                    "top": "0",
                    "position": "absolute",
                    "width": width,
                    "height": height
                });
            }

            function createZoomPopup(container) {
                return $('<div/>', {
                    class: settings.zoomedPopupClass
                }).css({
                    "background-color": "white",
                    "top": "0",
                    "left": "0",
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
                    "background-color": "lightgrey",
                    "margin": "0 auto",
                    "position": "relative",
                    "border": "2px solid black",
                    "width": "60%",
                    "height": "500px",
                    "margin-top": "200px"
                    /*                     "top": "50%",
                                        "left": "50%",
                                        "position": "relative",
                                        "transform": "translate(-50%, -50%)", */
                }).appendTo(container);
            }

            function createImageHolder(container) {
                return $('<img/>', {
                    class: settings.imageHolderClass,
                    mouseenter: function(event) {
                        createOverlayContainer(container, $(event.target).width(), $(event.target).height());
                        createZoomedImage(createZoomPopup(container), $(event.target));
                    }
                }).css({
                    "max-width": "100%",
                    "max-height": "100%"
                }).appendTo(container);
            }

            function createButton(container) {
                return $('<input/>', {
                    class: settings.imageButtonClass,
                    type: "file",
                    change: function(event) {
                        if (this.files && this.files[0]) {
                            var reader = new FileReader();
                            reader.onload = function(e) {
                                createImageHolder(container).attr('src', reader.result);
                                $('.' + settings.imageButtonClass).remove();
                            };
                            reader.readAsDataURL(this.files[0]);
                        }
                    }
                }).css({
                    "width": "150px",
                    "height": "40px",
                    "position": "relative",
                    "top": "50%",
                    "left": "50%"
                }).appendTo(container);
            }

            function moveZoomScreen(x, y) {
                $('.' + settings.zoomedImageClass).css({ 
                    "top": ((-y * settings.scaleFactor) + 75) + "px ", 
                    "left": ((-x * settings.scaleFactor) + 75) + "px" });

                $('.' + settings.zoomedPopupClass).css({ 
                    "top": (y - 75) + "px", 
                    "left": (x + 75) + "px" 
                });

                var size = (settings.sizeSquare/2);

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