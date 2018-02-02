"use strict";




///////////
// Стили //
///////////


require('./styles/main.scss');


//////////////
// Картинки //
//////////////

require('./images/logo_plex.svg');

/////////////
// Скрипты //
/////////////

// Bootstrap scripts
import 'bootstrap/js/dist/tab';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/collapse';


// OwlCarousel
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'owl.carousel';

$(document).ready(function () {
    $('.owl-carousel').owlCarousel({
        loop: true, 
        margin: 10,
        responsiveClass: true,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        navText: ["", ""],
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            576: {
                items: 2,
                nav: false
            },
            768: {
                items: 3,
                nav: false,
            },
            992: {
                items: 4,
                nav: false
            },
            1200: {
                items: 5,
                nav: false
            },
        }
    });
});

// Мои скрипты
import './js/my-stcripts.js';

/////////////////////////////////
// Загрузка иконок для спрайта //
/////////////////////////////////

// main
require('./icons/arrow-down.svg');
require('./icons/menu.svg');
require('./icons/home.svg');
require('./icons/mail.svg');
require('./icons/phone.svg');
require('./icons/place.svg');
require('./icons/search.svg');
require('./icons/time.svg');
require('./icons/comment.svg');
require('./icons/edit.svg');
require('./icons/close.svg');
require('./icons/person.svg');
require('./icons/person-o.svg');
require('./icons/mobile.svg');

// Логотипы производителей
// require('./images/vendors/ocz.svg');
// require('./images/vendors/samsung.svg');
// require('./images/vendors/seagate.svg');
// require('./images/vendors/toshiba.svg');
// require('./images/vendors/transcent.svg');
// require('./images/vendors/wd.svg');


//////////////
// Favicons //
//////////////

require('./images/favicons/android-icon-36x36.png');
require('./images/favicons/android-icon-48x48.png');
require('./images/favicons/android-icon-72x72.png');
require('./images/favicons/android-icon-96x96.png');
require('./images/favicons/android-icon-144x144.png');
require('./images/favicons/android-icon-192x192.png');
require('./images/favicons/apple-icon.png');
require('./images/favicons/apple-icon-57x57.png');
require('./images/favicons/apple-icon-60x60.png');
require('./images/favicons/apple-icon-72x72.png');
require('./images/favicons/apple-icon-76x76.png');
require('./images/favicons/apple-icon-114x114.png');
require('./images/favicons/apple-icon-120x120.png');
require('./images/favicons/apple-icon-144x144.png');
require('./images/favicons/apple-icon-152x152.png');
require('./images/favicons/apple-icon-180x180.png');
require('./images/favicons/apple-icon-precomposed.png');
require('./images/favicons/browserconfig.xml');
require('./images/favicons/favicon.ico');
require('./images/favicons/favicon-16x16.png');
require('./images/favicons/favicon-32x32.png');
require('./images/favicons/favicon-96x96.png');
require('./images/favicons/manifest.json');
require('./images/favicons/ms-icon-70x70.png');
require('./images/favicons/ms-icon-144x144.png');
require('./images/favicons/ms-icon-150x150.png');
require('./images/favicons/ms-icon-310x310.png');