(function ($) {

    $(".menutoggle").on("click", function () {
        var $tline = $(this).find(".top-line"),
            $cline = $(this).find(".center-line"),
            $bline = $(this).find(".bottom-line"),
            $line = $(this).find(".line");
        $line.toggleClass("open");
    })

    $(".tile").ripple({
        touchElevation: "z2"
    });

    img = $(".tile > img")[0]; // Get my img elem
    var pic_real_width, pic_real_height, to_clip;
    $("<img/>") // Make in memory copy of image to avoid css issues
        .attr("src", $(img).attr("src"))
        .load(function () {
            pic_real_width = this.width; // Note: $(this).width() will not
            pic_real_height = this.height; // work for in memory images.
            console.log(pic_real_height);
            console.log(pic_real_width);
            if (pic_real_width > pic_real_height) {
                to_clip = (pic_real_width - pic_real_height) / 2;
                $(".tile > img").css("clip", "rect(0px," + to_clip + "px,0px," + to_clip + "px)");
                console.log(to_clip);
            }
        });



}(jQuery));