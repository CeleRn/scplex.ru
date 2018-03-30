webpackHotUpdate(0,{

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

var _jsCookie = __webpack_require__(12);

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        _jsCookie2.default.set('city', subdomainAlias, { domain: '.' + mainDomain });
    } else {
        // Если на осноовной домен без куки, то устанавливать куку по умолчанию
        if (_jsCookie2.default.get('city') === undefined || _jsCookie2.default.get('city') == '') {
            _jsCookie2.default.set('city', 'moscow', { domain: '.' + mainDomain });
        }
    };

    if (location.host != 'localhost:4000') {
        var currentAlias = _jsCookie2.default.get('city');
        changeBase(currentAlias, mainDomain);
        changeNameCityTopPanel(currentAlias, domainsList);
    }
});

// $('.change-city-link_cookie').click(function (event) {
//     console.log('Нажата кнопка');
//     event.preventDefault();
//     console.log('Нажата кнопка');
//     var newAlias = $(this).attr('data-alias');
//     console.log(newAlias);
//     Cookies.set('city', newAlias, { domain: '.' + mainDomain });
//     changeBase(newAlias, mainDomain);
//     changeNameCityTopPanel(newAlias, domainsList);
//     $('#changeCity').modal('hide');
// });
// console.log('Перед функцией');

$(document).on('click', '.change-city-link_cookie', function () {
    console.log('Нажата кнопка');
    event.preventDefault();
    console.log('Нажата кнопка');
    var newAlias = $(this).attr('data-alias');
    console.log(newAlias);
    _jsCookie2.default.set('city', newAlias, { domain: '.' + mainDomain });
    changeBase(newAlias, mainDomain);
    changeNameCityTopPanel(newAlias, domainsList);
    $('#changeCity').modal('hide');
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ })

})