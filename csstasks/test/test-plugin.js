(function ($) {
    $.fn.changeLook = function( settings ) {
        var config = {
            'color': 'red'
        };
        if (settings){$.extend(config, settings);}
        return this.each(function(){
            $(this).css('color', settings);
        });
    };
 
}( jQuery ));