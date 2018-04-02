import Cookies from 'js-cookie';

// Смена значения href в теге Base
function changeBase(cookieCity, protocol, mainDomain) {

    $("#base-domain").attr("href", protocol + "://" + cookieCity + "." + mainDomain);
}

// Смена названия города в верхней панели
function changeNameCityTopPanel(alias, domainsList) {
    $('#change-city-name').text(domainsList[alias]);
}

$(document).ready(function () {
    // Установка куки
    if (subdomainAlias != 'master') {
        Cookies.set('city', subdomainAlias, { domain: '.' + mainDomain });
    } else {
        // Если на осноовной домен без куки, то устанавливать куку по умолчанию
        if ((Cookies.get('city') === undefined) || (Cookies.get('city') == '')) {
            Cookies.set('city', 'moscow', { domain: '.' + mainDomain });
        }
    };

    if (location.host != 'localhost:4000') {
        var currentAlias = Cookies.get('city');
        changeBase(currentAlias, protocol, mainDomain);
        changeNameCityTopPanel(currentAlias, domainsList);
    }

});

$(document).on('click','.change-city-link_cookie', function(){
    event.preventDefault();
    var newAlias = $(this).attr('data-alias');
    Cookies.set('city', newAlias, { domain: '.' + mainDomain });
    changeBase(newAlias, protocol, mainDomain);
    changeNameCityTopPanel(newAlias, domainsList);
    $('#changeCity').modal('hide');
});
