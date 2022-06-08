$( document ).ready(function()
{
    $.getJSON('https://rafaelneri.github.io/doutrinas/json/doctrines.json', function(data)
    {        
        data.doctrines.forEach(function(doctrine, i_doctrine){
            
            // CATEGORIAS - SIDEBAR
            if(i_doctrine == 0) {
                $('<li class="mb-1"><button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed" data-bs-toggle="collapse" data-bs-target="#collapse'+i_doctrine+'" aria-expanded="true">'+doctrine.name+'</button></li> <div class="collapse show" id="collapse'+i_doctrine+'"><ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small" id="cat'+i_doctrine+'"></ul></div>').appendTo('#sidebarDoutrinas');
            }
            else {
                $('<li class="mb-1"><button class="btn btn-toggle d-inline-flex align-items-center rounded border-0" data-bs-toggle="collapse" data-bs-target="#collapse'+i_doctrine+'" aria-expanded="false">'+doctrine.name+'</button></li> <div class="collapse" id="collapse'+i_doctrine+'"><ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small" id="cat'+i_doctrine+'"></ul></div>').appendTo('#sidebarDoutrinas');
            }
            
            // CATEGORIAS - MENU MOBILE
            $('<li class="dropdown nav-item text-center mt-1"><a class="nav-link dropdown-toggle" href="#" id="navbarDropdown'+i_doctrine+'" role="button" data-bs-toggle="dropdown" aria-expanded="false">'+doctrine.name+'</a><ul class="dropdown-menu" aria-labelledby="navbarDropdown'+i_doctrine+'" id="catMobile'+i_doctrine+'"></ul></li>').appendTo("#menuMobileDoutrinas");
            
            // CATEGORIAS - BODY
            $('<h2>'+doctrine.name+' <img src="images/ico-link-hover.svg" class="iconLink" alt="A Doutrina de Deus" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" data-bs-custom-class="custom-tooltip" title="Copiar link"></h2><p class="lead text-white mb-5">'+doctrine.description+'</p><div id="detalheCat'+i_doctrine+'"></div>').appendTo("#doutrinasDetalhes");
            
            doctrine.belief.forEach(function(belief, i_belief){
                // SUBCATEGORIAS - SIDEBAR
                $('<li><a href="#" class="d-inline-flex text-decoration-none rounded">'+belief.name+'</a></li>').appendTo('#cat'+i_doctrine);
                
                // SUBCATEGORIAS - MENU MOBILE
                $('<li><a class="dropdown-item" href="#">'+belief.name+'</a></li>').appendTo('#catMobile'+i_doctrine);
                
                // SUBCATEGORIAS - BODY
                $('<h3 class="text-white">'+belief.name+' <img src="images/ico-link-hover.svg" class="iconLink" alt="'+belief.name+'" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" data-bs-custom-class="custom-tooltip" title="Copiar link"></h3><p class="lead text-white">Crença Fundamental (Hinos de '+belief.firstHymn+' a '+belief.lastHymn+')</p><p class="text-white mb-3">'+belief.description+'</p><table class="table table-dark table-hover" style="margin-bottom: 100px;"><thead><tr><th scope="col" class="text-center" style="width: 15%;">Número</th><th scope="col">Hino</th><th scope="col" class="text-center" style="width: 15%;">Vídeo</th></tr></thead><tbody id="hinosCat'+i_doctrine+'Sub'+i_belief+'"></tbody></table>').appendTo('#detalheCat'+i_doctrine);
                
                // HINOS
                belief.hymns.forEach(function(hymn, i_hymn){
                    if(hymn.youtubeURL == '') {
                        $('<tr><th scope="row" class="text-center">'+hymn.number+'</th><td>'+hymn.title+'</td><td class="text-center">-</td></tr>').appendTo('#hinosCat'+i_doctrine+'Sub'+i_belief);
                    }
                    else {
                        $('<tr><th scope="row" class="text-center">'+hymn.number+'</th><td>'+hymn.title+'</td><td class="text-center"><a href="'+hymn.youtubeURL+'" target="_blank"><img src="images/ico-youtube-white.svg" alt="Youtube"></a></td></tr>').appendTo('#hinosCat'+i_doctrine+'Sub'+i_belief);
                    }
                });
            });
            
        });
    });
});