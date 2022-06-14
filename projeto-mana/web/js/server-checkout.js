var CPBCheckout = {
    init: function (config) {
        window.console.log('CPBCheckout - Init');
        CPBCheckout.Google.init();
        CPBCheckout.jqueryFunctions();
        // TODO: Use configuration sent by config
        if (true) {
            CPBCheckout.componentBind.map();
            CPBCheckout.componentBind.defaultBind();
        }
        CPBCheckout.Cart.init();
    },
    run: function () {
        if (CPBCheckout.components.visualUpdateQuantityItensCallback) {
            CPBCheckout.components.visualUpdateQuantityItensCallback(CPBCheckout.Cart.getProductsQuantity());
        }
        CPBCheckout.componentBind.productsRun();
    },
    text: {
        responseMessages: {
            creditCard: {
                title:     'Concluído, estamos aguardando processamento',
                info:      'Você receberá em seu e-mail a confirmação e o comprovante de pagamento.',
                action:    'ok, sair do carrinho'
            },
            bankSlip: {
                title:       'Concluído, estamos aguardando pagamento do boleto',
                info:        'Ao gerar o boleto para impressão abrirá uma janela do Itaú para concluir essa ação.',
                action:      'Gerar Boleto'
            }
        }
    },
    const: {
        payment: {
            type: {
                cartao: 1,
                boletoItau: 3
            }
        }
    },
    config: {
        api: {
            urlBase: 'http://checkout.cpb.com.br/api'
        },
        storage: {
            prefix: 'CPBCheckout_'
        },
        client: {
            email:  '[data-client-email]',
            name:   '[data-client-name]',
            cpf:    '[data-client-cpf]',
            phone:  '[data-client-phone]',
            phone2: '[data-client-phone2]',
            address: {
                cep:            '[data-client-address-cep]',
                street:         '[data-client-address-street]',
                complement:     '[data-client-address-complement]',
                number:         '[data-client-address-number]',
                neighborhood:   '[data-client-address-neighborhood]',
                city:           '[data-client-address-city]',
                federativeUnit: '[data-client-address-federativeUnit]',
                zipCode:        '[data-client-address-zipCode]',
                mailbox:        '[data-client-address-mailbox]',
                church:         '[data-client-address-church]'
            }
        },
        products: {
            product:        '[data-product]',
            quantityItem:   '[data-product-quantity][data-product-id]',
            subTotalItem:   '[data-product-subtotal-value][data-product-id]',
            totalValue:     '[data-products-total-value]',
            container:      '[data-products]',
            list:           '[data-products-list]'
        },
        payment: {
            form:                   '[data-payment-form]',
            company:                '[data-payment-company]',
            companyInstallments:    '[data-payment-company-installments]',
            card: {
                companyId:      '[data-payment-company]',
                number:         '[data-payment-card-number]',
                holder:         '[data-payment-card-holder]',
                expiry:         '[data-payment-card-expiry]',
                cvc:            '[data-payment-card-cvc]',
                installments:   '[data-payment-company-installments]'
            }
        },
        bankSlipLink:       '[data-payment-detail-bankslip-link]',
        resultMessage: {
            container:  '[data-result-message]',
            title:      '[data-result-message-title]',
            info:       '[data-result-message-info]',
            action:     '[data-result-message-action]'
        },
        orderCreate:        '[data-action="order/create"]',
        money: {
            prefix: 'R$ ',
            suffix: '',
            zero:   'R$ 0,00'
        },
        google: {
            ua: 'UA-12962071-1'
        }
    },
    components: {
        products:                   null,
        quantityItems:              null,
        subTotalItems:              null,
        productsTotalValue:         null,
        bankSlipLink:               null,
        resultMessage: {
            container:              null,
            title:                  null,
            info:                   null,
            action:                 null
        },
        orderCreate:                null,
        paymentCompany:             null,
        paymentCompanyInstallments: null,
        visualUpdateQuantityItensCallback: null,
        visualUpdateValueColorCallback: null
    },
    componentBind: {
        defaultBind: function () {
            CPBCheckout.componentBind.products($(CPBCheckout.config.products.container));
            CPBCheckout.componentBind.bankSlipLink($(CPBCheckout.config.bankSlipLink));
            CPBCheckout.componentBind.resultMessage($(CPBCheckout.config.resultMessage.container));
            CPBCheckout.componentBind.orderCreate($(CPBCheckout.config.orderCreate));
            CPBCheckout.componentBind.paymentForm($(CPBCheckout.config.payment.form));
        },
        map: function () {
            CPBCheckout.components.paymentCompany               = $(CPBCheckout.config.payment.company);
            CPBCheckout.components.paymentCompanyInstallments   = $(CPBCheckout.config.payment.companyInstallments);
        },
        products: function ($element) {
            // Save on Components List
            CPBCheckout.components.products = $element;
            CPBCheckout.components.quantityItems = $element.find(CPBCheckout.config.products.quantityItem);
            CPBCheckout.components.subTotalItems = $element.find(CPBCheckout.config.products.subTotalItem);
            // Default Values
            CPBCheckout.components.subTotalItems.data('productSubTotalValue', parseFloat(0));
            CPBCheckout.components.subTotalItems.html(CPBCheckout.config.money.zero);
        },
        productsRun: function () {
            // Bind Events
            CPBCheckout.components.quantityItems.each(function (index) {
                CPBCheckout.action.productQuantityRestoreValue($(this));
                CPBCheckout.componentBind.productQuantity($(this));
            });
            CPBCheckout.components.subTotalItems.each(function (index) {
                CPBCheckout.action.productSubTotalRestoreValue($(this));
                CPBCheckout.componentBind.productSubTotal($(this));
            });
            // Total Value after Cart Products Restored
            CPBCheckout.action.productsTotalValueUpdate();
            // Send Google Impression
            CPBCheckout.action.productsSendGoogleImpression();
        },
        productQuantity: function ($element) {
            CPBCheckout.componentBind.productSubTotal($element);
        },
        productSubTotal: function ($productQuantity) {
            var $productSubTotal = $(CPBCheckout.config.products.subTotalItem + '[data-product-id="' + $productQuantity.data('productId') + '"]');
            $productQuantity.on('change', function (event) {
                CPBCheckout.action.productSubTotalChange($productQuantity, $productSubTotal);
            });
        },
        bankSlipLink: function ($element) {
            CPBCheckout.components.bankSlipLink = $element;
        },
        resultMessage: function ($element) {
            CPBCheckout.components.resultMessage.container  = $element;
            CPBCheckout.components.resultMessage.title      = $element.find(CPBCheckout.config.resultMessage.title);
            CPBCheckout.components.resultMessage.info       = $element.find(CPBCheckout.config.resultMessage.info);
            CPBCheckout.components.resultMessage.action     = $element.find(CPBCheckout.config.resultMessage.action);
        },
        orderCreate: function ($element) {
            CPBCheckout.components.orderCreate = $element;
            $element.on('click', function () {
                if (CPBCheckout.action.createOrderValidate()) {
                    $(this).off('click');
                    CPBCheckout.action.createOrder();
                } else {
                    CPBCheckout.action.createOrderValidateDisplayErrors();
                }
            });
        },
        paymentForm: function ($element) {
            $element.on('change', function () {
                CPBCheckout.Order.setPaymentForm();
            });
        }
    },
    Callbacks: {
        changePaymentForm: null,
        createOrderVisualCallback: null
    },
    Order: {
        getUser: function () {
            cfgClient = CPBCheckout.config.client;
            return {
                "email":    $(cfgClient.email).val(),
                "name":     $(cfgClient.name).val(),
                "cpf":      $(cfgClient.cpf).val(),
                "phone":    $(cfgClient.phone).val(),
                "phone2":   $(cfgClient.phone2).val()
            };
        },
        getAddress: function () {
            cfgAddress = CPBCheckout.config.client.address;
            return {
                "street":           $(cfgAddress.street).val(),
                "complement":       $(cfgAddress.complement).val(),
                "number":           $(cfgAddress.number).val(),
                "neighborhood":     $(cfgAddress.neighborhood).val(),
                "city":             $(cfgAddress.city).val(),
                "federativeUnit":   $(cfgAddress.federativeUnit).val(),
                "zipCode":          $(cfgAddress.zipCode).val(),
                "mailbox":          $(cfgAddress.mailbox).val(),
                "church":           $(cfgAddress.church).val()
            };
        },
        getPaymentForm: function () {
            return parseInt($(CPBCheckout.config.payment.form + ':checked').val());
        },
        setPaymentForm: function () {
            paymentForm = CPBCheckout.Order.getPaymentForm();
            if (CPBCheckout.Callbacks.changePaymentForm) {
                CPBCheckout.Callbacks.changePaymentForm(paymentForm);
            }
        },
        getPaymentDetails: function () {
            if (CPBCheckout.Order.getPaymentForm() === CPBCheckout.const.payment.type.cartao) {
                cfgCard = CPBCheckout.config.payment.card;
                return {
                    "form": CPBCheckout.Order.getPaymentForm(),
                    "details": {
                        "card": {
                            "companyId":        $(cfgCard.companyId).val(),
                            "number":           $(cfgCard.number).val(),
                            "holder":           $(cfgCard.holder).val(),
                            "expiry":           $(cfgCard.expiry).val(),
                            "installments":     $(cfgCard.installments).val(),
                            "cvc":              $(cfgCard.cvc).val()
                        }
                    }
                }
            } else {
                return {
                    "form": CPBCheckout.Order.getPaymentForm()
                }
            }
        },
        getData: function () {
            return {
                "client": CPBCheckout.Order.getUser(),
                "products": CPBCheckout.Cart.getProducts(),
                "address": CPBCheckout.Order.getAddress(),
                "payment": CPBCheckout.Order.getPaymentDetails()
            };
        }
    },
    Cart: {
        init: function () {
            var cart = CPBCheckout.Cart.get();
            return (cart === null) ? CPBCheckout.Cart.create() : cart;
        },
        get: function () {
            console.log(JSON.parse(localStorage.getItem(CPBCheckout.config.storage.prefix + 'cart')))
            return JSON.parse(localStorage.getItem(CPBCheckout.config.storage.prefix + 'cart'));
        },
        set: function (cart) {
            localStorage.setItem(CPBCheckout.config.storage.prefix + 'cart', JSON.stringify(cart));
            return CPBCheckout.Cart.get();
        },
        reset: function () {
            localStorage.removeItem(CPBCheckout.config.storage.prefix + 'cart');
            return CPBCheckout.Cart.init();
        },
        create: function () {
            var cart = {
                id: 1,
                products: [],
                payment: null,
                address: null
            };
            localStorage.setItem(CPBCheckout.config.storage.prefix + 'cart', JSON.stringify(cart));
            return CPBCheckout.Cart.get();
        },
        updateProduct: function (product) {
            var productIndex = CPBCheckout.Cart.getProductIndex(product.id);
            if (product.quantity) {
                if (productIndex >= 0) {
                    return CPBCheckout.Cart.updateProductData(productIndex, product);
                } else {
                    return CPBCheckout.Cart.insertProduct(product);
                }
            } else {
                return CPBCheckout.Cart.removeProduct(product);
            }
        },
        updateProductData: function (productIndex, product) {
            CPBCheckout.Google.productAdd(product.id);
            var products = CPBCheckout.Cart.getProducts();
            products[productIndex] = product;
            return CPBCheckout.Cart.setProducts(products);
        },
        insertProduct: function (product) {
            CPBCheckout.Google.productAdd(product.id);
            var products = CPBCheckout.Cart.getProducts();
            products.push(product);
            return CPBCheckout.Cart.setProducts(products);
        },
        removeProduct: function (product) {
            CPBCheckout.Google.productRemove(product.id);
            var products = CPBCheckout.Cart.getProducts();
            var productIndex = CPBCheckout.Cart.getProductIndex(product.id);
            if (productIndex >= 0) {
                return CPBCheckout.Cart.removeProductByIndex(productIndex);
            } else {
                return null;
            }
        },
        removeProductByIndex: function (index) {
            var products = CPBCheckout.Cart.getProducts();
            products.splice(index, 1);
            return CPBCheckout.Cart.setProducts(products);
        },
        getProductIndex: function (id) {
            var products = CPBCheckout.Cart.getProducts();
            var productIndex = -1;
            if (products.length) {
                $(products).each(function(index, item){
                    if (id == item.id) {
                        productIndex = index;
                    }
                });
            }
            return productIndex;
        },
        getProduct: function (id) {
            var products = CPBCheckout.Cart.getProducts();
            var productIndex = CPBCheckout.Cart.getProductIndex(id);
            if (productIndex >= 0) {
                return products[productIndex];
            } else {
                return null;
            }
        },
        getProducts: function () {
            var cart = CPBCheckout.Cart.get();
            return cart.products;
        },
        getProductsQuantity: function () {
            var cart = CPBCheckout.Cart.get();
            var total = 0;
            cart.products.forEach(function(product){
              total += product.quantity;
            },this);
            return total;
        },
        setProducts: function (products) {
            var cart = CPBCheckout.Cart.get();
            cart.products = products;
            CPBCheckout.Cart.set(cart);
            return CPBCheckout.Cart.getProducts();
        },
        getProductsTotalValue: function () {
            return $(CPBCheckout.config.products.totalValue).data('productsTotalValue');
        }
    },
    action: {
        productQuantityRestoreValue: function ($element) {
            var product = CPBCheckout.Cart.getProduct($element.data('productId'));
            if (product) {
                $element.val(parseFloat(product.quantity));
            }
        },
        productSubTotalRestoreValue: function ($productSubTotal) {
            var product             = CPBCheckout.Cart.getProduct($productSubTotal.data('productId'));
            var html                = CPBCheckout.config.money.zero;
            if (product) {
                $productQuantity        = $(CPBCheckout.config.products.quantityItem + '[data-product-id=' + $productSubTotal.data('productId') + ']');
                var quantity            = parseInt(product.quantity);
                var value               = parseFloat($productQuantity.data('productValue'));
                var subTotalValue       = quantity * value;
                $productSubTotal.data('productSubTotalValue', subTotalValue);
                html = CPBCheckout.config.money.prefix + $(subTotalValue).money() + CPBCheckout.config.money.suffix;
                if (CPBCheckout.components.visualUpdateItemValueColorCallback) {
                    CPBCheckout.components.visualUpdateItemValueColorCallback($productSubTotal, quantity);
                }
            }
            return $productSubTotal.html(html);
        },
        productSubTotalChange: function ($productQuantity, $productSubTotal) {
            var quantity            = parseInt(($productQuantity.val() === "") ? 0 : $productQuantity.val());
            var value               = parseFloat($productQuantity.data('productValue'));
            var subTotalValue       = quantity * value;
            $productSubTotal.data('productSubTotalValue', subTotalValue);
            CPBCheckout.Cart.updateProduct({
                id:         $productQuantity.data('productId'),
                quantity:   quantity
            });
            CPBCheckout.action.productsTotalValueUpdate();
            if (CPBCheckout.components.visualUpdateQuantityItensCallback) {
                CPBCheckout.components.visualUpdateQuantityItensCallback(CPBCheckout.Cart.getProductsQuantity());
            }
            if (CPBCheckout.components.visualUpdateItemValueColorCallback) {
                CPBCheckout.components.visualUpdateItemValueColorCallback($productSubTotal, quantity);
            }
            return $productSubTotal.html(CPBCheckout.config.money.prefix + $(subTotalValue).money() + CPBCheckout.config.money.suffix);
        },
        productsTotalValueUpdate: function() {
            var totalValue = parseFloat(0);
            var $productsTotalValue = $(CPBCheckout.config.products.totalValue);
            CPBCheckout.components.products.find(CPBCheckout.config.products.subTotalItem).each(function (index) {
                totalValue += parseFloat($(this).data('productSubTotalValue'));
            });
            $productsTotalValue.data('productsTotalValue', totalValue);
            var $paymentCompany = CPBCheckout.components.paymentCompany;
            if ($paymentCompany.val()) {
                CPBCheckout.api.populatePaymentCompanyInstallments({
                    id:         $paymentCompany.val(),
                    totalValue: totalValue
                });
            } else {
                CPBCheckout.components.paymentCompanyInstallments.cleanOptionsToDefault();
            }
            return CPBCheckout.components.productsTotalValue = $productsTotalValue.html($(totalValue).money());
        },
        productSubTotalById: function (id) {
            CPBCheckout.action.productSubTotalChange(
                $(CPBCheckout.config.products.quantityItem + '[data-product-id="' + id + '"]'),
                $(CPBCheckout.config.products.subTotalItem + '[data-product-id="' + id + '"]')
            );
        },
        disableForm: function () {
            $('input, select').prop( "disabled", true );;
        },
        enableForm: function () {
            $('input, select').prop( "disabled", false );;
        },
        createOrderValidate: null,
        createOrderValidateDisplayErrors: null,
        createOrder: function () {
            CPBCheckout.action.disableForm();
            CPBCheckout.components.orderCreate.html('<p>Enviado...</p>');
            var orderData = CPBCheckout.Order.getData();
            // TODO: Validate Before send
            return CPBCheckout.call('POST', '/order/create.json',
                CPBCheckout.action.createOrderCallback, orderData
            );
        },
        createOrderCallback: function (data, textStatus, jqXHR) {
            if (data.code === 201) {
                // Google Purchase
                CPBCheckout.Google.purchase(
                    data.results.order.id,
                    data.results.order.store,
                    data.results.order.products,
                    {
                        "revenue":  data.results.payment.value,
                        "tax":      data.results.payment.tax,
                        "shipping": data.results.delivery.freightCosts
                    },
                    data.results.order.coupon
                );
                CPBCheckout.components.orderCreate.html('<p>' + data.message + '</p>').css('opacity', '.5');
                var text = {};
                if (data.results.payment.form === CPBCheckout.const.payment.type.cartao) {
                    text = CPBCheckout.text.responseMessages.creditCard;
                    CPBCheckout.components.resultMessage.action.prop('href', '/');
                    CPBCheckout.components.resultMessage.action.prop('target', '_self');
                } else {
                    text = CPBCheckout.text.responseMessages.bankSlip;
                    CPBCheckout.components.resultMessage.action.prop('href',
                        data.results.payment.details.bankSlip.link
                    );
                }
                CPBCheckout.components.resultMessage.title.html(text.title);
                CPBCheckout.components.resultMessage.info.html(text.info);
                CPBCheckout.components.resultMessage.action.html(text.action);
                CPBCheckout.Cart.reset();
            } else {
                CPBCheckout.action.enableForm();
                CPBCheckout.components.orderCreate.html('<p>Enviar</p>');
                CPBCheckout.components.resultMessage.title.html('Erro!');
                var message = (data.message) ? data.message : 'Um problema ocorreu no servidor, tente novamente mais tarde. Desde já agradeçemos e pedidos desculpas pelo inconveniente.';
                CPBCheckout.components.resultMessage.info.html(message);
                CPBCheckout.components.orderCreate.on('click', function () {
                    $(this).off('click');
                    CPBCheckout.action.createOrder();
                });
            }
            CPBCheckout.components.resultMessage.container.show();
            if (CPBCheckout.Callbacks.createOrderVisualCallback) {
                CPBCheckout.Callbacks.createOrderVisualCallback(data, textStatus, jqXHR);
            }
        },
        productsSendGoogleImpression: function () {
            $(CPBCheckout.config.products.list).each(function () {
                $productsList = $(this);
                window.console.log('Google Analytics - Impression of Product List: ' + $productsList.data('productsList'));
                $productsList.find(CPBCheckout.config.products.product).each(function (index) {
                    $product = $(this);
                    CPBCheckout.Google.impression(
                        $product.data('productId'),
                        $productsList.data('productsList'),
                        index+1
                    );
                });
            });
        }
    },
    call: function (method, route, callback, data) {
        $.ajax({
            method: method,
            url: CPBCheckout.config.api.urlBase + route,
            dataType: 'json',
            crossDomain: true,
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).always(callback);
    },
    api: {
        populatePaymentCompany: function (data) {
            CPBCheckout.api.paymentCompanyChangeBind($(CPBCheckout.config.payment.company));
            return CPBCheckout.api.paymentCompany(data);
        },
        paymentCompany: function (data) {
            return CPBCheckout.call('POST', '/payment/getCompany.json',
                CPBCheckout.api.paymentCompanyCallback, data
            );
        },
        paymentCompanyCallback: function (data, textStatus, jqXHR) {
            var selectPopulateOptions = {
                data:       data.results.paymentCompanys,
                value:      'id_administradora',
                display:    'nome'
            };
            var $paymentCompany = $(CPBCheckout.config.payment.company).addOptions(selectPopulateOptions);
            CPBCheckout.api.populatePaymentCompanyInstallments({
                id: $paymentCompany.val(),
                totalValue: CPBCheckout.Cart.getProductsTotalValue()
            });
        },
        paymentCompanyChangeBind: function ($paymentCompany) {
            $paymentCompany.on('change', function () {
                CPBCheckout.api.populatePaymentCompanyInstallments({
                    id:         $paymentCompany.val(),
                    totalValue: CPBCheckout.Cart.getProductsTotalValue()
                });
            });
        },
        populatePaymentCompanyInstallments: function (data) {
            return CPBCheckout.call('POST', '/payment/getCompanyInstallments.json',
                CPBCheckout.api.paymentCompanyInstallmentsCallback, data
            );
        },
        paymentCompanyInstallmentsCallback: function (data, textStatus, jqXHR) {
            var selectPopulateOptions = {
                data:       data.results.paymentCompanyInstallments,
                value:      'installments',
                display:    'installmentValue'
            };
            var     $paymentCompanyInstallments = CPBCheckout.components.paymentCompanyInstallments
                    $paymentCompanyInstallments.removeOptions();
                    $paymentCompanyInstallments.addOptions(selectPopulateOptions);
            return  $paymentCompanyInstallments.paymentInstallmentsOptions();
        },
        identificationCreateInterested: function (data, callback) {
            return CPBCheckout.call('POST', '/identification/createInterested.json',
                callback, data
            );
        },
        identificationGetAddressByCEP: function (data, callback) {
            return CPBCheckout.call('POST', '/identification/getAddressByCEP.json',
                callback, data
            );
        }
    },
    jqueryFunctions: function () {
        $.fn.money = function() {
            var tmp = '0,00';
            if ($(this).length) {
                var tmp = $(this)[0].toFixed(2).toString().replace('.', '');
                tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
                if( tmp.length > 6 )
                    tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
            }
            return tmp;
        },
        $.fn.addOptions = function(options) {
            var itens = options.data;
            $(this).append('<option selected disabled> Selecione</option>');
            for (var i=0; i < itens.length; i++) {
                $(this).append('<option value="' + itens[i][options.value] + '">' + itens[i][options.display] + '</option>');
            }
            return $(this);
        },
        $.fn.removeOptions = function(options) {
            return $(this).html('');
        },
        $.fn.cleanOptionsToDefault = function() {
            $(this).removeOptions();
            return $(this).append('<option selected disabled>Selecione</option>');;
        },
        $.fn.paymentInstallmentsOptions = function() {
            $(this).children(':not([disabled])').each(function () {
                var value = $(this).val();
                var display = $(this).html();
                $(this).html(value + 'x de R$ ' + $(parseFloat(display)).money() + ' (sem juros)');
            });
            return $(this);
        }
    },
    Google: {
        load: function () {
            window.console.log('Google Analytics - Load');
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','gaCPBCheckout');
        },
        init: function () {
            window.console.log('Google Analytics - Init');
            CPBCheckout.Google.load();
            gaCPBCheckout('create', CPBCheckout.config.google.ua, 'auto');
            gaCPBCheckout('require', 'ec');
            CPBCheckout.Google.pageView();
        },
        pageView: function () {
            window.console.log('Google Analytics - PageView');
            gaCPBCheckout('send', 'pageview');
        },
        getProductListCallback: null,
        listOfProduct: function (productId) {
            if (CPBCheckout.Google.getProductListCallback) {
                return CPBCheckout.Google.getProductListCallback(productId);
            } else {
                return null;
            }
        },
        impression: function (productId, list, position) {
            var product = CPBCheckout.Google.listOfProduct(productId);
            if (product) {
                product.list = list;
                product.position = position;
                gaCPBCheckout('ec:addImpression', product);
                CPBCheckout.Google.event('Transação', 'Impressão do Produto', productId);
            }
        },
        getProductDetailCallback: null,
        product: function (productId) {
            if (CPBCheckout.Google.getProductDetailCallback) {
                return CPBCheckout.Google.getProductDetailCallback(productId);
            } else {
                return null;
            }
        },
        productAdd: function (productId) {
            CPBCheckout.Google.productAction(CPBCheckout.Google.product(productId));
            gaCPBCheckout('ec:setAction', 'add');
            CPBCheckout.Google.event('Transação', 'Carrinho', 'Adcionado produto');
        },
        productRemove: function (productId) {
            CPBCheckout.Google.productAction(CPBCheckout.Google.product(productId));
            gaCPBCheckout('ec:setAction', 'remove');
            CPBCheckout.Google.event('Transação', 'Carrinho', 'Removido produto');
        },
        productAction: function (product) {
            if (product) {
                window.console.log('Google Analytics - Product: ' + product.id);
                gaCPBCheckout('ec:addProduct', product);
            }
        },
        checkout: function (step) {
            window.console.log('Google Analytics - Checkout Option: Step ' + step);
            gaCPBCheckout('ec:setAction','checkout', {
                'step': step
            });
            CPBCheckout.Google.event('Transação', 'Passo', step);
        },
        checkoutOption: function (step, option) {
            window.console.log('Google Analytics - Checkout Option: Step ' + step + ' - Option: ' + option);
            gaCPBCheckout('ec:setAction','checkout_option', {
                'step': step, // 1
                'option': option // Cartão 1 - Boleto Itaú 3
            });
            CPBCheckout.Google.event('Transação', 'Pagamento', (option == 1) ? 'Cartão de Crédito' : 'Boleto Bancário Itaú');
        },
        event: function (category, action, label) {
            window.console.log('Google Analytics - Event - Category: ' + category + ' - Action: ' + action + ' - Label: ' + label);
            gaCPBCheckout(
                'send', 'event', category, action, String(label)
            );
        },
        promotion: function (id, name) {
            gaCPBCheckout('ec:addPromo', {
                'id': id, 'name': name
                // 'creative': 'summer_banner2',   // Creative (string).
                // 'position': 'banner_slot1'      // Position  (string).
            });
        },
        purchase: function (transactionId, affiliation, products, values, coupon) {
            window.console.log('Google Analytics - Add Products to Purchase');
            for (var i = 0; i < products.length; i++) {
                CPBCheckout.Google.productAction({
                    id:         products[i].id,
                    name:       products[i].name,
                    price:      products[i].price,
                    quantity:   products[i].quantity
                });
            }
            window.console.log('Google Analytics - Purchase: Transaction Id: ' + transactionId +
                ' - Affiliation: ' + affiliation +
                ' - Revenue: ' + values.revenue +
                ' - Tax: ' + values.tax +
                ' - Shipping: ' + values.shipping);
            gaCPBCheckout('ec:setAction', 'purchase', {
                id:             transactionId,
                affiliation:    affiliation,
                revenue:        values.revenue,
                tax:            values.tax,
                shipping:       values.shipping
            });
            CPBCheckout.Google.event('Transação', 'Pedido', 'Enviado');
        }
    }
};