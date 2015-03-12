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
        startElevation: "1",
        elevation: "none"
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
            $parent = $element.parent();
        $element.css("background-color", this.options.bgColor);
        $element.addClass("material");
        var elevation = this.options.startElevation;
        var shadow = '<shadow><div id="shadow-bottom" fit="" class="paper-shadow-bottom-z-' + elevation + '" animated=""></div><div id="shadow-top" fit="" class="paper-shadow-top-z-' + elevation + '" animated=""></div></shadow>';
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
            var $ripple = $('<div class="ripple animated-ripple natural"></div>');
            $ripple.css({
                top: startY,
                left: startX
            });
            $wrapper.append($ripple);

            //animate the ripple
            self.rippleExpand($element, $ripple);
            self.setElevation($element);
            $element.addClass("focused");

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
        var elevation = "paper-shadow-bottom-z-" + this.options.elevation;
        var startElevation = "paper-shadow-bottom-z-" + this.options.startElevation;
        if (!elevation == "paper-shadow-bottom-z-none") {
            $shadowContainer.find("#shadow-bottom").attr("class", elevation);
            $shadowContainer.find("#shadow-top").attr("class", elevation);

            $element.one("mouseup mouseleave touchend touchcancel", function (event) {
                if (self.isMobile() && event.type === "mouseup") {
                    return false;
                } else if (self.isMobile() && event.type === "mouseleave") {
                    return false;
                }
                $shadowContainer.find("#shadow-bottom").attr("class", startElevation);
                $shadowContainer.find("#shadow-top").attr("class", startElevation);
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
            console.log("ripple removed");
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

// scroll in view
(function ($, window, document, undefined) {
    "use strict";

    //plugin name
    var inview = "inview";

    //get instance
    var self = null;

    //defaults
    var defaults = {};

    //main function
    function Inview(element, options) {
        self = this;
        this.element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = inview;
        //init
        this.init();
        //this.clicker();
    }

    Inview.prototype.clicker = function () {
        var $element = this.element;
        $element.on("touchstart", function () {
            $element.toggleClass("z-depth-5");
        });
    };

    Inview.prototype.init = function () {
        var $element = this.element;
        $window.on("scroll", function () {
            var windowScroll = $window.scrollTop(),
                docHeight = $document.height(),
                winHeight = $window.height(),
                elIndex = $element.index(),
                elHeight = $element.outerHeight(),
                elWidth = $element.outerWidth(),
                parentOffset = $element.parent().offset().top,
                elTopEdge = $element.position().top,
                elTopOffset = elTopEdge - windowScroll + elHeight,
                elBottomEdge = $element.offset().top + elHeight,
                elBottomOffset = elBottomEdge - windowScroll - winHeight;

            if (elTopOffset >= elHeight && elBottomOffset < 0) {
                $element.data("visible", "on");
                //$element.removeClass("under over above beyond on").addClass("on");   
            } else if (elTopOffset < elHeight && elTopOffset > elHeight / 2) {
                $element.data("visible", "under");
                //$element.removeClass("under over above beyond on").addClass("under");   
            } else if (elTopOffset < elHeight && elBottomOffset <= 0) {
                $element.data("visible", "above");
                //$element.removeClass("under over above beyond on").addClass("above");   
            } else if (elBottomOffset < elHeight / 2 && elBottomOffset >= 0) {
                $element.data("visible", "over");
                //$element.removeClass("under over above beyond on").addClass("over");   
            } else if (elBottomOffset >= elHeight / 2) {
                $element.data("visible", "beyond");
                //$element.removeClass("under over above beyond on").addClass("beyond");   
            }
            self.castShadow($element);

            if (elIndex === 2) {
                console.log(elIndex + " is at " + elTopEdge + " from top");
                console.log(elTopOffset + " & " + elBottomOffset);
            }
        });

        $window.scroll();

    };

    Inview.prototype.castShadow = function ($element) {
        if ($element.data("visible") === "on" && !$element.hasClass("z-depth-5")) {
            $element.removeClass("z-depth-1-half z-depth-1").addClass("z-depth-5");
        }

        if ($element.data("visible") === "under" && !$element.hasClass("z-depth-1-half")) {
            $element.removeClass("z-depth-1 z-depth-5").addClass("z-depth-1-half");
        }

        if ($element.data("visible") === "over" && !$element.hasClass("z-depth-1-half")) {
            $element.removeClass("z-depth-1 z-depth-5").addClass("z-depth-1-half");
        }

        if ($element.data("visible") === "above" && !$element.hasClass("z-depth-1")) {
            $element.removeClass("z-depth-1-half z-depth-5").addClass("z-depth-1");
        }

        if ($element.data("visible") === "beyond" && !$element.hasClass("z-depth-1")) {
            $element.removeClass("z-depth-1-half z-depth-5").addClass("z-depth-1");
        }
    };

    /**
     * Create the jquery plugin function
     */
    $.fn.inview = function (options) {
        return this.each(function () {
            new Inview(this, options);
        });
    };
})(jQuery, window, document);