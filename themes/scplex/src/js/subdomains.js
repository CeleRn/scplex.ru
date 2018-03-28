import Cookies from 'js-cookie';

// Смена значения href в теге Base
function changeBase(cookieCity, mainDomain) {
    $("#base-domain").attr("href", "https://" + cookieCity + "." + mainDomain);
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
        changeBase(currentAlias, mainDomain);
        changeNameCityTopPanel(currentAlias, domainsList);
    }

});



$('.change-city-link_cookie').click(function (event) {
    console.log('Нажата кнопка');
    // event.preventDefault();
    // console.log('Нажата кнопка');
    // var newAlias = $(this).attr('data-alias');
    // console.log(newAlias);
    // Cookies.set('city', newAlias, { domain: '.' + mainDomain });
    // changeBase(newAlias, mainDomain);
    // changeNameCityTopPanel(newAlias, domainsList);
    // $('#changeCity').modal('hide');
});
console.log('Перед функцией');

$("#city-dolgoprudnyi").click(function () {
    alert("Handler for .click() called.");
});


