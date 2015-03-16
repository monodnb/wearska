(function ($, window, document) {

    // The $ is now locally scoped 
    $(function () {

        // DOM ready!
        //Variables
        $document = $(document),
            $window = $(window),
            $body = $("body"),
            $card = $(".card")
            $thumb = $card.find(".card-thumb"),
            $overlay = $card.find(".card-overlay"),
            $info = $card.find(".card-info"),
            overlay = false,
            animating = false;

        // Initial setup
        
        // set tile overlay color after image has finished loading
        $window.on("load", function () {
            $card.each(function () {
                var colorThief = new ColorThief();
                var dominantColor = colorThief.getColor($(this).find(".card-thumb > img")[0]);
                var newColor = "rgb(" + dominantColor[0] + "," + dominantColor[1] + "," + dominantColor[2] + ")";
                console.log(newColor);
                $(this).find(".card-overlay").css({
                    "background-color": newColor
                });
                $(this).css({
                    "background-color": newColor
                });
            });
        });


        // Event delegation
        $card.on("click", showCardOverlay);
        //$flip.on("click", flipCard);



    });


    function showCardOverlay() {
        //console.log(animating);
        var $this = $(this),
            $overlay = $this.find(".card-overlay"),
            $info = $this.find(".card-info"),
            $thumb = $this.find(".card-thumb");

        if (!$this.hasClass("active")) {
            $overlay.toggleClass("on off");
            $info.toggleClass("on off");
            $thumb.toggleClass("on off");
        }
    }
/*
    function flipCard() {
        var $this = $(this),
            $cardContent = $("#card-content"),
            $tile = $this.closest(".tile"),
            $tileOverlay = $tile.find(".tile-overlay"),
            $tileInfo = $tile.find(".tile-info"),
            $tileThumb = $tile.find(".tile-thumb"),
            $card = $tile.closest("card"),
            $block = $this.closest(".block"),
            offset = $card.offset().top - $window.scrollTop(),
            wHeight = $window.height(),
            wWidth = $window.width();

        $tile.addClass("active");
        $card.toggleClass("focused");
        $tileOverlay.toggleClass("focused").toggleClass("on");
        $tileInfo.toggleClass("focused").toggleClass("on");
        $tileThumb.toggleClass("clipped");
    }

*/

    // Functions

    function setCardsSize(){
        $card.css({
                width: $card.parent().outerWidth(),
                height: $card.parent().outerHeight()
            });
    }

}(window.jQuery, window, document)); // Fully reference jQuery after this point.