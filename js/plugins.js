// Avoid `console` errors in browsers that lack a console.
(function () {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());


// wave ripple effect
(function ($, window, document, undefined) {

    "use strict";

    //plugin name
    var ripple = "ripple";

    //get instance
    var self = null;

    //defaults
    var defaults = {
        bgColor: "#FFFFFF",
        rippleColor: "rgba(0, 0, 0, 0.1)",
        restElevation: "z0",
        touchElevation: "z2"
    };

    //main function
    function Ripple(element, options) {
        self = this;
        this.element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = ripple;
        //init
        this.init();
    }

    //check for mobile devices
    Ripple.prototype.isMobile = function () {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    //Init
    Ripple.prototype.init = function () {
        var $element = this.element,
            $parent = $element.parent(),
            bgColor = this.options.bgColor,
            rippleColor = this.options.rippleColor;
        $element.css("background-color", this.options.bgColor);
        $element.addClass("material");
        var restElevation = this.options.restElevation;
        var shadow = '<shadow><div id="key-light" fit="" class="key-shadow z0 animated"></div><div id="ambient-light" fit="" class="ambient-shadow z0 animated"></div></shadow>';
        $element.append(shadow);

        $element.on("mousedown touchstart", function (event) {
            //cancel mousedown if touchstart fired
            if (self.isMobile() && event.type === "mousedown") {
                return false;
            }

            //check to see if element has a wave already. if not, create it
            if (!($element.find(".wave").length)) {
                $element.append("<div class=\"wave\"></div>");
            }

            var $wrapper = $element.children(".wave");

            //get touch position, relative to the element
            var startX = self.getStartX($wrapper, event);
            var startY = self.getStartY($wrapper, event);

            //returns the event if touch coordinates are false
            if (!startX && !startY) {
                return;
            }

            //create the ripple
            var $ripple = $('<div class="ripple animated-ripple natural" style="background-color: ' + rippleColor + ';"></div>');
            $ripple.css({
                top: startY,
                left: startX
            });
            $wrapper.append($ripple);
            console.log(rippleColor);

            //animate the ripple
            self.rippleExpand($element, $ripple);
            self.setElevation($element);

            setTimeout(function () {
                self.rippleEnd($element, $ripple);
            }, 300);

            // mousedown & touchstart end
            $element.one("mouseup mouseleave touchend touchcancel", function (event) {
                $ripple.data("mousedown", "off");
                //event.preventPropagation();

                if (self.isMobile() && event.type === "mouseup") {
                    return false;
                } else if (self.isMobile() && event.type === "mouseleave") {
                    return false;
                }
                if ($ripple.data("animating") === "off") {
                    self.rippleClear($element, $ripple);
                }
            });
        });

    };

    /**
     * Get the parent size based on the element height/width and the ripple width
     */
    Ripple.prototype.rippleParentSize = function ($element, $ripple) {
        return (Math.max($element.outerWidth(), $element.outerHeight()));
    };

    /**
     * If specified, set elevation
     */
    Ripple.prototype.setElevation = function ($element) {
        var $shadowContainer = $element.find("shadow");
        var touchElevation = this.options.touchElevation;
        var restElevation = this.options.restElevation;
        if (touchElevation !== "off") {
            $element.addClass("focused");
            $shadowContainer.find("#key-light").addClass(touchElevation);
            $shadowContainer.find("#ambient-light").addClass(touchElevation);

            $element.one("mouseup mouseleave touchend touchcancel", function (event) {
                if (self.isMobile() && event.type === "mouseup") {
                    return false;
                } else if (self.isMobile() && event.type === "mouseleave") {
                    return false;
                }
                $element.removeClass("focused");
                $shadowContainer.find("#key-light").removeClass(touchElevation);
                $shadowContainer.find("#ambient-light").removeClass(touchElevation);

                console.log("back to normal");
            });
        }
    };

    /**
     * Get the touch position, relative to the $element
     */
    Ripple.prototype.getStartX = function ($wrapper, event) {
        var wrapperOffset = $wrapper.offset();
        if (!self.isMobile()) {
            /**
             * Get the mouse position relative to the ripple wrapper
             */
            return event.pageX - wrapperOffset.left;
        } else {
            /**
             * Make sure the user is using only one finger and then get the touch
             * position relative to the ripple wrapper
             */
            event = event.originalEvent;

            if (event.touches.length === 1) {
                return event.touches[0].pageX - wrapperOffset.left;
            }
            return false;
        }
    };

    Ripple.prototype.getStartY = function ($wrapper, event) {
        var wrapperOffset = $wrapper.offset();
        if (!self.isMobile()) {
            /**
             * Get the mouse position relative to the ripple wrapper
             */
            return event.pageY - wrapperOffset.top;
        } else {
            /**
             * Make sure the user is using only one finger and then get the touch
             * position relative to the ripple wrapper
             */
            event = event.originalEvent;

            if (event.touches.length === 1) {
                return event.touches[0].pageY - wrapperOffset.top;
            }
            return false;
        }
    };


    /**
     * Turn on the ripple effect
     */
    Ripple.prototype.rippleExpand = function ($element, $ripple) {
        var size = self.rippleParentSize($element, $ripple);
        $ripple
            .css({
                "-ms-transform": "scale(" + (size / $ripple.outerWidth()) * 1 + ")",
                "-webkit-transform": "scale(" + (size / $ripple.outerWidth()) * 1 + ")",
                "transform": "scale(" + (size / $ripple.outerWidth()) * 1 + ")"
            })
            .addClass("ripple-on")
            .data("animating", "on")
            .data("mousedown", "on");
        console.log("ripple expanding");

    };

    Ripple.prototype.rippleEnd = function ($element, $ripple) {
        $ripple.data("animating", "off");

        if ($ripple.data("mousedown") === "off") {
            self.rippleClear($element, $ripple);
        }
        console.log("ripple finished animating");
    };

    /**
     * Turn off the ripple effect
     */
    Ripple.prototype.rippleClear = function ($element, $ripple) {
        var size = self.rippleParentSize($element, $ripple);
        $ripple.off();
        //$element.off("mouseup mouseleave touchend touchcancel");
        $ripple
            .css({
                "-ms-transform": "scale(" + (size / $ripple.outerWidth()) * 2.5 + ")",
                "-webkit-transform": "scale(" + (size / $ripple.outerWidth()) * 2.5 + ")",
                "transform": "scale(" + (size / $ripple.outerWidth()) * 2.5 + ")"
            })
            .addClass("ripple-out");
        $ripple.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
            $ripple.remove();
        });
    };




    /**
     * Create the jquery plugin function
     */
    $.fn.ripple = function (options) {
        return this.each(function () {
            new Ripple(this, options);
        });
    };

})(jQuery, window, document);