$(document).ready( function(){
	window.console.log();
	/* Menu do Topo */
	$('.navicon').on('click', function(){
	   $('.itensMenu').addClass('itensMenu--show');
	});
	$('.itemMenuSingle').on('click', function(){
	   $('.itensMenu').removeClass('itensMenu--show');
	});
	$('.fecharMenu').on('click', function(){
	   $('.itensMenu').removeClass('itensMenu--show');
	});
	// Mask Celular
	$('.phone_with_ddd').mask('(00) 00000-0000');
	// Confirmaçao cadastro de notificação
	$('#cadastroNotification').on('click', function(){
		$('.mesageSuccessCalendar').addClass('mesageSuccessCalendar--active').delay(2000).queue(function(n) {
	  		$(this).removeClass('mesageSuccessCalendar--active'); n();
		});
	});
	// Next input form
	$('.text1').on('keyup', function(e) {
	 var mEvent = e || window.event;
	 var mPressed = mEvent.keyCode || mEvent.which;
	 if (mPressed == 13) {
	  // On enter, go to next input field
	   $('.text1[tabindex=' + (this.tabIndex + 1) + ']').focus();
	 }
	return true;
	});

	Mana.slide( $(window).width() );

	Mana.menuTopo();

	$('#cadastroNotification').on('click',function(event){
		event.preventDefault();
		jQuery.support.cors = true;
		var post = $.ajax({
					  type: "POST",
					  url: 'http://apidigital.cpb.com.br/manaNotification.json',
					  crossDomain : true,
					  dataType: 'json',
					  data: {  JSON.stringify({								    
					  				"name":"Guilherme Pacheco",
								    "email":"guilherup@gmail.com",
								    "phone":"1599991545",
								    "state":"São Paulo - SP"})

							}
					});

		   post.done(function( data ) {
		     window.console.log(data);
		   });
		window.console.log('click');
	})	

	
});

var Mana = {
	slide: function (tamanho) {
		var minSlides = 0;
		var maxSlides = 0;

		if (tamanho > 1200) {
		minSlides = 4;
		  maxSlides = 4;
		} else if (tamanho > 900) {
		  minSlides = 3;
		  maxSlides = 3;
		} else if (tamanho > 768) {
		minSlides = 2;
		  maxSlides = 2;
		} else {
		  minSlides = 1;
		  maxSlides = 1;
		}

		var slideWidth = 400;

		/* Material Slider */
		$('.materiaisDownload').bxSlider({
			minSlides: minSlides,
			maxSlides: maxSlides,
			slideWidth: slideWidth,
			pager: false,
			controls: true,
			prevText: '',
			nextText: '',
			adaptiveHeight: true,
			adaptiveHeightSpeed: 500,
			prevSelector: $('#setaSlider-prev'),
			nextSelector: $('#setaSlider-next')
		});
		$('#setaSlider-prev .bx-prev').addClass('fa fa-chevron-left fa-lg');
		$('#setaSlider-next .bx-next').addClass('fa fa-chevron-right fa-lg');

	},
	menuTopo: function () {
		var $meunufixo = $('#inicio'); // guardar o elemento na memoria para melhorar performance
		$(document).on('scroll', function () {
			var rolagem = $(document).scrollTop();
			if (rolagem >= 100) {
				$meunufixo.addClass('menuFixo');
				$('#sobre').css('margin-top', '0px');
			} else {
				$('#sobre').css('margin-top', -rolagem + 'px');
				$meunufixo.removeClass('menuFixo');
			}
		});
	},
	mensagemNotification: function() {
		
	}
};
$(function() {
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});
 $(".navicon").on('click',function(){
    $("html, body").css({
        'overflow-y' : 'hidden'
    });
});
  $(".itemMenuSingle, .fecharMenu").on('click',function(){
    $("html, body").css({
        'overflow-y' : 'visible'
    });
});