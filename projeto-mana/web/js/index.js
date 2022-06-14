$(function() {
    window.console.log('Mana - Index - $Ready');
    // CPBCheckout Initiation
    CPBCheckout.init();
    CPBCheckout.config.api.urlBase = 'https://checkout-cestabasica.cpb.com.br/api';
    CPBCheckout.components.visualUpdateQuantityItensCallback = Mana.checkout.updateQuantityItens;
    CPBCheckout.components.visualUpdateItemValueColorCallback = Mana.checkout.updateItemValueColor;
    CPBCheckout.Google.getProductDetailCallback = Mana.checkout.getProductDetailCallback;
    CPBCheckout.Google.getProductListCallback = Mana.checkout.getProductListCallback;
    CPBCheckout.Google.checkout(1);
    CPBCheckout.run();
    // Mana Initiation
    Mana.init();
    Mana.menuTopoItensLink();
    Mana.menuReponsivo();
    Mana.menuTopo();
    Mana.slide($(window).width());
    Mana.youtubeModal();
    Mana.materialDivulgacao();
    Mana.carregarImg();
});
