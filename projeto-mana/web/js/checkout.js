$(function() {
    window.console.log('Mana - Checkout - $Ready');
    // CPBCheckout Initiation
    CPBCheckout.init();
    CPBCheckout.config.api.urlBase = 'https://checkout-cestabasica.cpb.com.br/api';
    // TODO: Alterar carminho para /
    if (!CPBCheckout.Cart.getProductsQuantity()) {
        window.location = '/';
    }
    CPBCheckout.components.visualUpdateQuantityItensCallback = Mana.checkout.updateQuantityItens;
    CPBCheckout.api.populatePaymentCompany();
    CPBCheckout.Google.getProductDetailCallback = Mana.checkout.getProductDetailCallback;
    CPBCheckout.Callbacks.changePaymentForm = Mana.checkout.changePaymentFormCallback;
    CPBCheckout.Callbacks.createOrderVisualCallback = Mana.checkout.createOrderVisualCallback;
    CPBCheckout.Google.checkout(2);
    CPBCheckout.Google.checkoutOption(3, 'Carta Registrada');
    CPBCheckout.action.createOrderValidate = Mana.formIsValid;
    CPBCheckout.action.createOrderValidateDisplayErrors = Mana.formErrorsDisplay;
    CPBCheckout.run();
    // Mana Initiation
    Mana.init();
    Mana.masks();
    Mana.formValidationInit();
    Mana.checkout.showItensWithQuantitySetup();
    Mana.checkout.removeFromCartBindClick();
    Mana.checkout.identificationGetAddressByCEPBlur();
    Mana.tooltipCodigoSeguranca();
    Mana.restoreFormDataSaved();
    Mana.saveFormDataBind();
});
