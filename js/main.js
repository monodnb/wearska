(function ($) {

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