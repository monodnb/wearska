(function ($) {

     $document = $(document),
            $window = $(window),
            $body = $("body"),
            $card = $(".card")
            $thumb = $card.find(".card-thumb"),
            $overlay = $card.find(".card-overlay"),
            $info = $card.find(".card-info"),
            overlay = false,
            animating = false;
    
    $(".menutoggle").on("click", function () {
        var $tline = $(this).find(".top-line"),
            $cline = $(this).find(".center-line"),
            $bline = $(this).find(".bottom-line"),
            $line = $(this).find(".line");
        $line.toggleClass("open");
    })

    $(".sidemenu").find("a").ripple({
        touchElevation: "off",
        restElevation: "z0",
    });
    
}(jQuery));