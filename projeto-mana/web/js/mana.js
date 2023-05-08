navigator.geolocation.getCurrentPosition(function(position) {
    var nowDate = new Date();
    var times = SunCalc.getTimes(nowDate, position.coords.latitude, position.coords.longitude);
    if (
        ((nowDate.getDay() == 5 && nowDate > times.sunset) ||
        (nowDate.getDay() == 6 && nowDate < times.sunset)) ) {
        window.location = 'https://semanadeofertas.cpb.com.br/sabado.html';
    }
});

var Mana = {
    init: function () {
        window.console.log('Mana - Init');
        Mana.tabIndexOnEnter();
        Mana.masks();
        Mana.checkout.createInterestedBind($('#cadastroNotification'));
        Mana.jQueryFunctions();
    },
    jQueryFunctions: function () {
        jQuery.extend(jQuery.validator.messages, {
            required: "Este campo é requerido.",
            email: "Informe um email válido.",
            number: "Informe somente números neste campo.",
            minlength: jQuery.validator.format("O tamanho mímino é de {0} caracteres."),
            maxlength: jQuery.validator.format("O tamanho máximo é de {0} caracteres."),
            range: jQuery.validator.format("O valor deve ser de no mínimo {0} e no máximo {1}."),
            max: jQuery.validator.format("O valor máximo é de {0}."),
            min: jQuery.validator.format("O valor mínimo é de {0}.")
        });
        jQuery.validator.addMethod("cepFound", function(value, element) {
            return $(element).hasClass('cepFound');
        });
        jQuery.validator.addMethod("cpf", function(value, element) {
            value = jQuery.trim(value);
            value = value.replace('.','');
            value = value.replace('.','');
            cpf = value.replace('-','');
            while(cpf.length < 11) cpf = "0"+ cpf;
            var expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
            var a = [];
            var b = new Number;
            var c = 11;
            for (i=0; i<11; i++){
                a[i] = cpf.charAt(i);
                if (i < 9) b += (a[i] * --c);
            }
            if ((x = b % 11) < 2) { a[9] = 0 } else { a[9] = 11-x }
            b = 0;
            c = 11;
            for (y=0; y<10; y++) b += (a[y] * c--);
            if ((x = b % 11) < 2) { a[10] = 0; } else { a[10] = 11-x; }
            var retorno = true;
            if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10]) || cpf.match(expReg)) retorno = false;
            return this.optional(element) || retorno;
            }, "Informe um CPF válido"
        );
    },
    saveFormDataBind: function () {
        $("#commentForm1 input, #commentForm2 input, #commentForm1 select, #commentForm2 select").on('blur', function () {
            sessionStorage.setItem('Mana_Form_'+$(this).attr('name'), $(this).val());
        });
    },
    restoreFormDataSaved: function () {
        $("#commentForm1 input, #commentForm2 input, #commentForm1 select, #commentForm2 select").each(function () {
            var value = sessionStorage.getItem('Mana_Form_'+$(this).attr('name'));
            if (value) {
                $(this).val(value);
            }
        });
        if (sessionStorage.getItem('Mana_Form_client[address][zipCode]')) {
            CPBCheckout.api.identificationGetAddressByCEP(
                Mana.checkout.identificationGetAddressByCEPGetData(),
                Mana.checkout.identificationGetAddressByCEPCallback
            );
        }
    },
    formValidationInit: function () {
        $("#checkoutForm input, #checkoutForm select").on('focus', function () {
            $('[for="'+$(this).attr('name')+'"]').remove();
        });
        $("#checkoutForm").validate({
            errorPlacement: function (error, element) {
                $errorTooltip = $('<span id="'+ error.attr('id') +'" for="'+error.attr('id').replace('-error','')+'" class="error fa fa-exclamation-circle" data-toggle="tooltip" data-placement="top" title="" data-original-title="' + error.html() + '"></span>');
                $('[for="'+error.attr('id').replace('-error','')+'"]').remove();
                if (error.attr('id').replace('-error','') !== "payment[form]") {
                    $wrapTooltip = element.parent().parent().find('label');
                    $refElement = element;
                } else {
                    $wrapTooltip = element.parents('#paymentForm').find('h3');
                    $refElement = $wrapTooltip;
                }
                $wrapTooltip.append($errorTooltip);
                $wrapTooltip.find('[data-toggle="tooltip"]').tooltip();
                error.insertAfter($refElement).wrap('<span/>');
            },
            success: function(label) {
                $('[data-toggle="tooltip"][for="'+label.attr('for')+'"]').remove();
            },
            messages: {
                "client[name]": {
                    required: "Nome é obrigatório",
                    minlength: jQuery.validator.format("O tamamnho mímino é de {0} caracteres")
                },
                "client[cpf]": {
                    required: "CPF é obrigatório",
                    minlength: "CPF está incorreto"
                },
                "client[email]": {
                    required: "Email é obrigatório",
                    email: "O email está incorreto"
                },
                "client[phone]": {
                    required: "Telefone é obrigatório",
                    minlength: "O telefone está incorreto"
                },
                "client[address][zipCode]": {
                    required: "CEP é obrigatório",
                    minlength: "CEP está incorreto",
                    cepFound: "CEP está incorreto"
                },
                "client[address][street]": {
                    required: "Endereço é obrigatório"
                },
                "client[address][number]": {
                    required: "Número de endereço é obrigatório"
                },
                "client[address][neighborhood]": {
                    required: "Bairro é obrigatório"
                },
                "client[address][city]": {
                    required: "Cidade é obrigatório"
                },
                "client[address][federativeUnit]": {
                    required: "Estado é obrigatório"
                },
                "payment[form]": {
                    required: "Forma de pagamento é obrigatória"
                },
                "payment[card][number]": {
                    required: "Número do Cartão é obrigatório",
                    minlength: jQuery.validator.format("Número do Cartão deve conter {0} números")
                },
                "payment[card][company]": {
                    required: "Bandeira do Cartão é obrigatória"
                },
                "payment[card][holder]": {
                    required: "Titular do Cartão é obrigatória"
                },
                "payment[card][expiry]": {
                    required: "Vencimento do Cartão é obrigatório",
                    minlength: "Vencimento do Cartão deve ser MM/AAAA"
                },
                "payment[card][cvc]": {
                    required: "Código de Segurança do Cartão é obrigatório"
                },
                "payment[card][installments]": {
                    required: "Parcelamento é obrigatório"
                }
            }
        });
        $('[data-client-address-zipcode]').rules("add",
            {
                cepFound : true
            }
        );
        $('.cpf').rules("add",
            {
                cpf: { cpf: true }
            }
        );
        $('[data-client-email]').rules("add",
            {
                email: true
            }
        );
    },
    formIsValid: function () {
        return $("#checkoutForm").validate().form()
    },
    formErrors: function () {
        $('#checkoutFormErrors').hide();
        var validate = $("#checkoutForm").validate();
        return validate.errors();
    },
    formErrorsDisplay: function () {
        $('#checkoutFormErrorsList').html('');
        Mana.formErrors().each(function () {
            if ($(this).html()) {
                $('#checkoutFormErrorsList').append('<li>' + $(this).html() + '</li>');
            }
        });
        $('#checkoutFormErrors').show();
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
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
            // $('[data-payment-card-expiry]').payment('formatCardExpiry');
        }
        // $('[data-payment-card-number]').mask('0000 0000 0000 0000', {reverse: true});
    	// Date Validade do Cartao
    	$('[data-payment-card-expiry]').mask('00/0000');
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
    youtubeModal: function () {
        $(".youtube").YouTubeModal({
            autoplay:   1,
            width:      640,
            height:     480
        });
        $(".youtube").on('click', function () {
            CPBCheckout.Google.event(
                'Materiais de Divulgação',
                'Play Video',
                'Youtube (Alt: ' + $(this).attr('alt') + ')'
            );
        });
    },
    materialDivulgacao: function () {
        $(".download").on('click', function () {
            CPBCheckout.Google.event(
                'Materiais de Divulgação',
                'Download',
                'Arquivo (Alt: ' + $(this).attr('alt') + ')'
            );
        });
    },
    carregarImg: function () {
        if($.lazyload) {
            $("img.lazy").lazyload()
        }
    }, 
    tooltipCodigoSeguranca: function () {
        $('[data-toggle="tooltip"]').tooltip()
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
                // var $itemsNotRemoved = $('.corpoItem:not(.removed) .iconTrash');
                // if ($itemsNotRemoved.length === 1) {
                //     $itemsNotRemoved.css('opacity', '.1').off('click');
                // }
            });
            // var $itemsNotRemoved = $('.corpoItem:not(.removed) .iconTrash');
            // if ($itemsNotRemoved.length === 1) {
            //     $itemsNotRemoved.css('opacity', '.1').off('click');
            // }
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
                $('.imagemprodutoTotal').removeClass('imagemprodutoTotal--total');
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
                $('.imagemprodutoTotal').addClass('imagemprodutoTotal--total');
            }
        },
        createInterestedValidateData: function () {
            $('#notificationForm').validate({
                rules: {
                    interestedName: {
                        required: true,
                        minlength: 10
                    },
                    interestedEmail: {
                        required: true
                    },
                    interestedPhone: {
                        required: true,
                        minlength: 14
                    },
                    interestedFederativeUnit: {
                        required: true
                    }
                }
            })
            return $('#notificationForm').valid();
        },
        createInterestedGetData: function () {
            return {
                "name":             $('#interestedName').val(),
                "email":            $('#interestedEmail').val(),
                "phone":            $('#interestedPhone').val(),
                "federativeUnit":   $('#interestedFederativeUnit').val(),
                "what":             'Projeto Maná'
            };
        },
        createInterestedBind: function ($element) {
            $element.on('click', function () {
                if (Mana.checkout.createInterestedValidateData()) {
                    $('#notificationForm input, #notificationForm select').prop('disable', 'disable');
                    $('#cadastroNotification').text('Enviando...');
                    CPBCheckout.api.identificationCreateInterested(
                        Mana.checkout.createInterestedGetData(),
                        Mana.checkout.createInterestedCallback
                    );
                }
            });
        },
        createInterestedCallback: function (data, textStatus, jqXHR) {
            var message = '';
            if (data.code == 200) {
                message = '<h2><i class="fa fa-check" aria-hidden="true"></i> Contato salvo com sucesso!</h2>';
                $('#notificationForm input, #notificationForm select').val('');
                CPBCheckout.Google.event(
                    'Notificação Interessados',
                    'Cadastro',
                    'Sucesso'
                );
            } else {
                message = '<h2><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> ' + data.message + '</h2>';
                CPBCheckout.Google.event(
                    'Notificação Interessados',
                    'Cadastro',
                    'Erro (Mensagem: ' + data.message + ')'
                );
            }
            $('#notificationForm input, #notificationForm select').removeProp('disable');
            $('#cadastroNotification').text('Enviar');
            $('.mesageSuccessCalendar').html(message).addClass('mesageSuccessCalendar--active').delay(2000).queue(function(n) {
                $(this).removeClass('mesageSuccessCalendar--active');
            });
        },
        identificationGetAddressByCEPBlur: function () {
            Mana.checkout.identificationGetAddressByCEPBind($('[data-client-address-zipcode]'));
        },
        identificationGetAddressByCEPGetData: function () {
            return {
                "cep": $('[data-client-address-zipcode]').val().replace(/\D/g, '')
            };
        },
        identificationGetAddressByCEPBind: function ($element) {
            $element.on('blur', function () {
                CPBCheckout.api.identificationGetAddressByCEP(
                    Mana.checkout.identificationGetAddressByCEPGetData(),
                    Mana.checkout.identificationGetAddressByCEPCallback
                );
            });
        },
        identificationGetAddressByCEPCallback: function (data, textStatus, jqXHR) {
            var message = data.message;
            if (data.code == 200) {
                var address = data.results.address;
                if (address.line3 !== undefined) {
                    $("[data-client-address-zipcode]").addClass('cepFound');
                    $('[data-client-address-street]').val(address.line1);
                    $('[data-client-address-neighborhood]').val(address.line2);
                    $('[data-client-address-city]').val(address.line3);
                    $('[data-client-address-federativeUnit]').val(address.line4);
                    sessionStorage.setItem('Mana_Form_client[address][street]', address.line1);
                    sessionStorage.setItem('Mana_Form_client[address][neighborhood]', address.line2);
                    sessionStorage.setItem('Mana_Form_client[address][city]', address.line3);
                    sessionStorage.setItem('Mana_Form_client[address][federativeUnit]', address.line4);
                    $('[for^="client[address]"].error').remove();
                } else {
                    sessionStorage.removeItem('Mana_Form_client[address][street]');
                    sessionStorage.removeItem('Mana_Form_client[address][neighborhood]');
                    sessionStorage.removeItem('Mana_Form_client[address][city]');
                    sessionStorage.removeItem('Mana_Form_client[address][federativeUnit]');
                    $("[data-client-address-zipcode]").removeClass('cepFound');
                }
                //var validator = $("#checkoutForm").validate();
                //validator.element("[data-client-address-zipcode]");
            }
        },
        getProductDetailCallback: function (productId) {
            var $product = $('[data-product][data-product-id='+productId+']');
            return {
                'id':         $product.data('productId'),
                'name':       $product.data('productName'),
                'category':   $product.data('productCategory'),
                'brand':      'CPB',
                'price':      parseFloat($product.data('productValue')),
                'quantity':   parseInt($product.find('[data-product-quantity]').val())
            };
        },
        getProductListCallback: function (productId) {
            return $('[data-product][data-product-id='+productId+']').parents('[data-products-list]').data('productsList');
        },
        changePaymentFormCallback: function (option) {
            if (option == 1) {
                $('#paymentForm input, #paymentForm select').attr('required', 'required');
            } else {
                $('#paymentForm input, #paymentForm select').removeAttr('required');
                $('[for^="payment[card]"].error').remove();
            }
            CPBCheckout.Google.checkoutOption(
                4, (option == 1) ? 'Cartão de Crédito' : 'Boleto Itaú'
            );
        },
        createOrderVisualCallback: function (data, textStatus, jqXHR) {
            if (data.code === 201) {
                sessionStorage.clear();
                $('#checkoutForm').hide();
                $('.carrinhoComItens').hide();
                $('#subTitulo').html('Pedido realizado com sucesso');
                $('#mensageCompra_sucesso_numeroPedido').html('Nº do pedido: ' + data.results.order.id);
                $('#mensagemCompra_erro').hide();
                $('#mensageCompra_sucesso').show();
                Mana.notification.addTag('purchase', true);
            } else {
                $('#mensageCompra_sucesso').hide();
                $('#mensagemCompra_erro_texto').html(
                    (data.message) ? data.message : 'Um problema ocorreu no servidor, tente novamente mais tarde. Desde já agradeçemos e pedidos desculpas pelo inconveniente.'
                );
                $('#mensagemCompra_erro').show();
                $('html, body').animate({
                    scrollTop: 999999999
                }, 1000);
            }
        }
    },
    notification: {
        addTag: function(key, value){
            OneSignal.push(function() {
                OneSignal.sendTag(key, value);
            });
        }
    }
};


$(document).ready(function(){
    if ($(".owl-carousel").length>0){
        $(".owl-carousel").owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            autoplayHoverPause: true,
        });
    }
    $(document).on('click', '.imagemProduto', function (event) {
        event = event || window.event;
        var target = event.target || event.srcElement,
        link = target.src ? target.parentNode : target,
        options = {
            index: link,
            event: event,
            toggleControlsOnReturn: false,
            toggleControlsOnSlideClick: false,
            hidePageScrollbars: true,
            disableScroll: true,
        },
        links = this.getElementsByTagName('a');
        blueimp.Gallery(links, options);
    });
});

