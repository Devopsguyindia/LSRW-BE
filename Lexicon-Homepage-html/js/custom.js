 // scroll remove class js 

    // $(window).scroll(function() {
      // if ($(document).scrollTop() > 150) {
        // $('.header_section').addClass('navbar-fixed-top');
        // $('.navbar_menu').addClass('navbar_color_menu');
        // $('.navbar_link').addClass('nvabr_li_set');
        // $('.navbar_first_style').addClass('navbar_sec_style');
        // $('.navbar_log').addClass('navbar_log_new');
        // $('.log_set').addClass('log_set_new');
		
          // } else {
        // $('.header_section').removeClass('navbar-fixed-top');
        // $('.navbar_menu').removeClass('navbar_color_menu');
		// $('.navbar_link').removeClass('nvabr_li_set');
		// $('.navbar_first_style').removeClass('navbar_sec_style');
		// $('.navbar_log').removeClass('navbar_log_new');
		// $('.log_set').removeClass('log_set_new');
          // }
    // });

	
 // bottom to top button js 
	
 // tooltip js 
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();   
});


 $(document).ready(function() {
  /******************************
      BOTTOM SCROLL TOP BUTTON
   ******************************/

  // declare variable
  var scrollTop = $(".scrollTop");

  $(window).scroll(function() {
    // declare variable
    var topPos = $(this).scrollTop();

    // if user scrolls down - show scroll to top button
    if (topPos > 100) {
      $(scrollTop).css("opacity", "1");

    } else {
      $(scrollTop).css("opacity", "0");
    }

  }); // scroll END

  //Click event to scroll to top
  $(scrollTop).click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 800);
    return false;

  }); // click() scroll top EMD

  /*************************************
    LEFT MENU SMOOTH SCROLL ANIMATION
   *************************************/
  // declare variable
  var h1 = $("#h1").position();
  var h2 = $("#h2").position();
  var h3 = $("#h3").position();

  $('.link1').click(function() {
    $('html, body').animate({
      scrollTop: h1.top
    }, 500);
    return false;

  }); // left menu link2 click() scroll END

  $('.link2').click(function() {
    $('html, body').animate({
      scrollTop: h2.top
    }, 500);
    return false;

  }); // left menu link2 click() scroll END

  $('.link3').click(function() {
    $('html, body').animate({
      scrollTop: h3.top
    }, 500);
    return false;

  }); // left menu link3 click() scroll END

}); // ready() END

 // multiple img slider js start here

var base_carousel = $('.owl_multiple_img');
	if (base_carousel.length) {
		base_carousel.owlCarousel({
			loop:true,
			autoplay:true,
			autoplayTimeout:2000,
			autoplayHoverPause:true,
			nav:false,
			dots: true,
			responsive:{
				0:{
					items:1
				},
				600:{
					items:2
				},
				1000:{
					items:3
				}
			}
		});
	} 