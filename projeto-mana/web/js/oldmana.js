var Mana = {
    init: function () {
        Mana.test();
        Mana.tabIndexOnEnter();
        Mana.masks();
    },
    test: function () {
        // Confirmaçao cadastro de notificação
        $('#cadastroNotification').on('click', function(){
            $('.mesageSuccessCalendar').addClass('mesageSuccessCalendar--active').delay(2000).queue(function(n) {
                $(this).removeClass('mesageSuccessCalendar--active');
            });
        });
    },
    formValidation: function () {
    	return $("#checkoutForm").validate();
    },
    maskPhoneBehavior: function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 0 0000-0000' : '(00) 0000-00009';
    },
    masks: function () {
        // Mask Celular
        $('.phone_with_ddd').mask(Mana.maskPhoneBehavior, {
            onKeyPress: function(val, e, field, options) {
                field.mask(Mana.maskPhoneBehavior.apply({}, arguments), options);
            }
        });
    	// Mask CPF
    	$('.cpf').mask('000.000.000-00', {reverse: true});
    	// Mask CEP
    	$('.cep').mask('00000-000');
        // Numero do Cartão
        if ($('[data-payment-card-number]').length) {
            $('[data-payment-card-number]').payment('formatCardNumber');
            $('[data-payment-card-cvc]').payment('formatCardCVC');
            $('[data-payment-card-expiry]').payment('formatCardExpiry');
        }
        // $('[data-payment-card-number]').mask('0000 0000 0000 0000', {reverse: true});
    	// Date Validade do Cartao
    	$('.vencimento-cartao').mask('00/0000');
    },
    tabIndexOnEnter: function () {
        // Next input form
    	$('[tabindex]').on('keyup', function(e) {
            var mEvent = e || window.event;
            var mPressed = mEvent.keyCode || mEvent.which;
            if (mPressed == 13) {
                $('[tabindex=' + (this.tabIndex + 1) + ']').focus();
            }
            return true;
    	});
    },
    carinhoHover: function () {
        $(".carrinho").hover(function(){
            $(".carrinhoItens").addClass("carrinhoItens--show");
    	},function(){
            $(".carrinhoItens").removeClass("carrinhoItens--show")
    	});
    },
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
    menuTopoItensLink: function () {
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
    menuReponsivo: function () {
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
    },
    checkout: {
        removeFromCartVisual: function ($element) {
            $productQuantity = $element.parents('.corpoItem').addClass('removed').find('[data-product-quantity]');
            $productQuantity.val(0);
            return $productQuantity.data('productId');
        },
        removeFromCartBindClick: function () {
            $('.iconTrash').on('click', function () {
                var productId = Mana.checkout.removeFromCartVisual($(this));
                CPBCheckout.Cart.updateProduct({
                    id: productId,
                    quantity: 0
                });
                CPBCheckout.action.productSubTotalById(productId);
                var $itemsNotRemoved = $('.corpoItem:not(.removed) .iconTrash');
                if ($itemsNotRemoved.length === 1) {
                    $itemsNotRemoved.css('opacity', '.1').off('click');
                }
            });
            var $itemsNotRemoved = $('.corpoItem:not(.removed) .iconTrash');
            if ($itemsNotRemoved.length === 1) {
                $itemsNotRemoved.css('opacity', '.1').off('click');
            }
        },
        showItensWithQuantitySetup: function () {
            $('[data-product-quantity]').each(function(){
                var $productQuantity = $(this);
                if ($productQuantity.val() > 0) {
                    $productQuantity.parents('.corpoItem').removeClass('removed').show();
                }
            });
        },
        updateItemValueColor: function ($valueItem, quantity) {
            if (quantity) {
                $valueItem.addClass('subtotal--verde');
            } else {
                $valueItem.removeClass('subtotal--verde');
            }
        },
        updateQuantityItens: function (quantity) {
            $('#numeroCarrinho').html(quantity);
            if (quantity == 0) {
                $('.fa-shopping-cart').css('color', '#9d9d9d');
                $('#palavraItens').html('itens');
                $('#finalizarCompra')
                    .removeClass('btn--verde')
                    .addClass('btn--branco')
                    .prop('href', '#assinaturas');
                $('.imagemProdutoTotal').removeClass('imagemProdutoTotal--total');
            } else {
                if (quantity == 1) {
                    $('#palavraItens').html('item');
                } else {
                    $('#palavraItens').html('itens');
                }
                $('#finalizarCompra')
                    .removeClass('btn--branco')
                    .addClass('btn--verde')
                    .prop('href', '/checkout.html');
                $('.fa-shopping-cart').css('color', '#2ECC71');
                $('.imagemProdutoTotal').addClass('imagemProdutoTotal--total');
            }
        }
    }
};
