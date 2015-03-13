(function ($, window, document) {

    // The $ is now locally scoped 
    $(function () {

        // DOM ready!
        //Variables
        $document = $(document),
            $window = $(window),
            $body = $("body"),
            $card = $("card"),
            $tile = $card.find(".tile");

        // Initial setup
        // Event delegation
        $tile.on("touchstart", showCardInfo);

    });

    function showCardInfo() {
        var $this = $(this),
            $cardInfo = $this.find(".card-info"),
            cardInfoSize = 10,
            tileWidth = $this.outerWidth(),
            tileHeight = $this.outerHeight(),
            newCardInfoSize = (Math.max(tileWidth, tileHeight) / cardInfoSize) * 2.5;

        console.log(tileWidth + " x " + tileHeight);
        console.log(newCardInfoSize);
        $cardInfo.css({
            "-ms-transform": "scale3d(" + newCardInfoSize + ", " + newCardInfoSize + ", " + newCardInfoSize + ")",
            "-webkit-transform": "scale3d(" + newCardInfoSize + ", " + newCardInfoSize + ", " + newCardInfoSize + ")",
            "transform": "scale3d(" + newCardInfoSize + ", " + newCardInfoSize + ", " + newCardInfoSize + ")"
        });

    }


    // Functions


}(window.jQuery, window, document)); // Fully reference jQuery after this point.