(function($) {
    $.fn.displayImageCtrl = function(options) {
        return this.each(function() {
            var settings = $.extend({}, $.fn.displayImageCtrl.defaults, options);
            var $element = $(this);
            var $container = createMainContainer($(this));
            var mouseinside = false;
            var x = 0;
            var y = 0;
            var last_x = 0;
            var last_y = 0; 

            var $overlayElement;
            var $zoomedImageElement;
            var $zoomedPopupElement;
            var $buttonElement;
            var overlayWidth;
            var overlayHeight;
            var pointerWidth;
            var pointerHeight;

            createInput(createLabel($container));

            function startQueue() {
                var queue = function () {
                    if (mouseinside) {
                        if(last_x != x || last_y != y){
                            moveZoomScreen(x, y);
                        }
                    }
                    setTimeout(queue, 50);
                }
                setTimeout(queue, 50);
            }

            function createZoomedImage(container, originalImage) {
                return $zoomedImageElement = $('<img/>', {
                    class: settings.zoomedImageClass
                }).attr("src", originalImage.attr("src")).css({
                    "width" : originalImage.width() * settings.scaleFactor,
                    "height" : originalImage.height() * settings.scaleFactor,
                    "position": "absolute"
                }).appendTo(container);
            }

            function createOverlayContainer(container, originalImage) {
                overlayHeight = originalImage.height();
                overlayWidth = originalImage.width();

                pointerWidth = settings.scalePointer * originalImage.width();
                pointerHeight = settings.scalePointer * originalImage.height();

                return $overlayElement = $('<div/>', {
                    class: settings.overlayClass,
                    mouseleave: function(event) {
                        mouseinside = false;
                        last_x = 0;
                        last_y = 0; 
                        $zoomedPopupElement.remove();
                        $(event.target).remove();
                    },
                    mousemove: function(event) {
                        var offset = $(event.target).offset();
                        x = event.pageX - offset.left;
                        y = event.pageY - offset.top;
                        mouseinside = true;
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
                return $zoomedPopupElement = $('<div/>', {
                    class: settings.zoomedPopupClass
                }).css({
                    "background-color": "white",
                    "top": "-100px",
                    "left": "120px",
                    "padding": "0",
                    "position": "absolute",
                    "width": pointerWidth * settings.scaleFactor,
                    "height": pointerHeight * settings.scaleFactor,
                    "border": "1px solid black",
                    "overflow": "hidden"
                }).appendTo(container);
            }

            function createMainContainer(container) {
                return $('<div/>', {
                    class: settings.mainClass
                }).css({
                    "position": "relative",
                    "top": "50%",
                    "left": "50%",
                    "transform": "translate(-50%, -50%)",
                    "border": "2px solid black",
                    "width": settings.widthControl,
                    "height": settings.heightControl
                }).appendTo(container);
            }

            function createImageHolder(container) {
                return $('<img/>', {
                    class: settings.imageHolderClass,
                    mouseenter: function(event) {
                        createOverlayContainer(container, $(event.target))
                        createZoomedImage(createZoomPopup($overlayElement), $(event.target));
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
                return $buttonElement = $('<label/>', {
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
                                startQueue();
                                $buttonElement.remove();
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

            function validateBorderSize(size, max){
                if(size < 0){
                    return 0;
                }else if(size > max){
                    return max;
                }else{
                    return size;
                }
            }

            function moveZoomScreen(x, y) {
                var sizeW = (pointerWidth * 0.5);
                var sizeH =  (pointerHeight * 0.5);

                $zoomedPopupElement.css({ 
                    "top": -(pointerHeight * 0.85) + "px", 
                    "left": pointerWidth + settings.paddingZoom + "px"
                });
                
                $zoomedImageElement.css({ 
                    "top": ((-y * settings.scaleFactor) + (sizeH * settings.scaleFactor)) + "px", 
                    "left": ((-x * settings.scaleFactor) + (sizeW * settings.scaleFactor)) + "px"
                });

                $overlayElement.css({
                    "border-bottom": validateBorderSize(overlayHeight - (y + sizeH), overlayHeight) + "px solid rgba(193, 193, 193, .5)",
                    "border-top": validateBorderSize(y - sizeH, overlayHeight) + "px solid rgba(193, 193, 193, .5)",
                    "border-left": validateBorderSize(x - sizeW, overlayWidth) + "px solid rgba(193, 193, 193, .5)",
                    "border-right": validateBorderSize(overlayWidth - (x + sizeW), overlayWidth) + "px solid rgba(193, 193, 193, .5)"
                });
                last_x = x;
                last_y = y; 
            }
        });

        return this;
    };

    $.fn.displayImageCtrl.defaults = {
        overlayClass: 'overlay',
        zoomedPopupClass: 'zoom-window',
        imageHolderClass: 'img-holder',
        imageButtonClass: 'load-image-button',
        zoomedImageClass: 'zoomed-image',
        mainClass: 'main',
        paddingZoom: 25,
        scalePointer: 0.25,
        scaleFactor: 3,
        textButton: "Load Image",
        widthControl: "40%",
        heightControl: "300px"
    };
}(jQuery));