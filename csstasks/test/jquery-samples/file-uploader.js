(function($) {
    $.fn.displayImageCtrl = function(options) {
        return this.each(function() {
            var settings = $.extend({}, $.fn.displayImageCtrl.defaults, options);
            var $container = $(this);

            createButton($container);

            function createZoomedImage(container, src){
                return $('<img/>', {
                    class: settings.zoomedImageClass
                }).attr("src", src).css({
                    "transform" : "scale(3)",
                    "position" : "absolute"
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
                        moveZoomScreen(event.pageX, event.pageY);
                    }
                }).appendTo(container).css({
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
                    "padding" : "0",
                    "position": "relative",
                    "width": settings.widthZoomWindow,
                    "height": settings.heightZoomWindow,
                    "border": "1px solid black",
                    "overflow" : "hidden"
                }).appendTo(container);
            }

            function createImageHolder(container) {
                return $('<img/>', {
                    class: settings.imageHolderClass,
                    mouseenter: function(event) {
                        createOverlayContainer(container,  $(event.target).width(), $(event.target).height());
                        createZoomedImage(createZoomPopup(container), $(event.target).attr("src"));
                    }
                }).css({
                    "position": "absolute",
                    "top": "0",
                    "left": "0",
                    "margin" : "0 auto"
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

            //function validateYPosition(y){
                //return (y > 75 && y < ($.fn.displayImageCtrl.defaults.height - 75));
            //}

            //function validateXPosition(x){
               // return (x > 50 && x < ($.fn.displayImageCtrl.defaults.width - 50));
            //}

            function moveZoomScreen(x, y) {
                //var obj = $('.' + settings.imageHolderClass).getBoundingClientRect();
                $('.' + settings.zoomedImageClass).css({ "top": (-(y) + 50) + "px ", "left" : (-(x) + 50) + "px" });

                var pos = { "top": $('.' + settings.zoomedPopupClass).css("top"), "left": $('.' + settings.zoomedPopupClass).css("left") };

                //if(validateXPosition(x)){
                    pos.left = (x + 75) + "px";
                //}
                //if(validateXPosition(y)){
                    pos.top = (y - 120) + "px";
                //} 

                $('.' + settings.zoomedPopupClass).css(pos);

                $('.' + settings.overlayClass).css({
                    "border-bottom": $.fn.displayImageCtrl.defaults.height - (y + 50) + "px solid rgba(193, 193, 193, .5)",
                    "border-top": (y - 50) + "px solid rgba(193, 193, 193, .5)",
                    "border-left": (x - 50) + "px solid rgba(193, 193, 193, .5)",
                    "border-right": $.fn.displayImageCtrl.defaults.width - (x + 50) + "px solid rgba(193, 193, 193, .5)"
                });
            }
        });

        return this;
    };

    $.fn.displayImageCtrl.defaults = {
        heightZoomWindow: "150px",
        widthZoomWindow: "200px",
        xPosZoomWindow: 75,
        yPosZoomWindow: 120,
        overlayClass: 'overlay',
        zoomedPopupClass: 'zoom-window',
        imageHolderClass: 'img-holder',
        imageButtonClass: 'load-image-button',
        zoomedImageClass: 'zoomed-image',

        imageWidth: null,
        imageHeight: null,

        textButton: "Load Image"
    };
}(jQuery));