//Функция плавное перемещения и открыть Таб "Стоимость" при нажатии на ссылку
$("#more-prices-link").click(function (event) {
    //отменяем стандартную обработку нажатия по ссылке
    event.preventDefault();
    //узнаем высоту от начала страницы до блока на который ссылается якорь
    var topTab = $('#more-nav').offset().top - 5;
    //анимируем переход на расстояние - top за 1500 мс
    $('body,html').animate({ scrollTop: topTab }, 800);
    //Открываем вкладку
    $('#prices-tab').tab('show');
});
$("#more-guarantee-link").click(function (event) {
    //отменяем стандартную обработку нажатия по ссылке
    event.preventDefault();
    //узнаем высоту от начала страницы до блока на который ссылается якорь
    var topTab = $('#more-nav').offset().top - 5;
    //анимируем переход на расстояние - top за 1500 мс
    $('body,html').animate({ scrollTop: topTab }, 800);
    //Открываем вкладку
    $('#guarantee-tab').tab('show');
});

// Высота в схеме работы
function paddingScheme() {
    var paddingScheme = '150px';
    var paddingTopScheme = '150px';
    var paddingBottomScheme = '150px';
    var minHeight = 150;
    if ($(window).outerWidth() > 1199) {
        $('#scheme-list .scheme-item .scheme-item__content').each( function() {
            if ((parseInt(paddingScheme) -20) < $(this).outerHeight()) {
                paddingScheme = parseInt($(this).outerHeight()) + 20;
            }
        });
        $('#scheme-list .scheme-item').css('height', 'auto');
        $('#scheme-list .scheme-item').css('padding-top', paddingScheme).css('padding-bottom', paddingScheme);
    } else {
        if ($(window).outerWidth() > 692) {
            $('#scheme-list .scheme-item .scheme-item__content').each( function() {
                if ((minHeight) < $(this).outerHeight()) {
                    minHeight = parseInt($(this).outerHeight());
                }
            });
            $('#scheme-list .scheme-item').css('min-height', minHeight)
            $('#scheme-list .scheme-item').css('padding-top', 0).css('padding-bottom', 0);
        } else {
            $('#scheme-list .scheme-item').css('min-height', 'auto')
        }
        
    }
    
}
$(document).ready(function () {
    paddingScheme();
});
$(window).resize(function() {
    paddingScheme();
});

// Параллакс эффект фона верхнего блока
$(function() {
    var $el = $('.top-block');
    $(window).on('scroll', function () {
        var scroll = $(document).scrollTop();
        $el.css({
            'background-position':'50% '+(-.2*scroll)+'px'
        });
    });
});

// скрытие части описания категории
// console.log('scrollHeight: ' + $('.top-block__description')[0].scrollHeight);

function collapseDescription() {
    if ($('.top-block__description')[0]) {
        if ($('.top-block__description')[0].scrollHeight > 80) {
            $('.top-block__description').addClass('top-block__description_collapse')
            $('.top-block__more-link').addClass('top-block__more-link_visibled')

        }
    }
};
$(document).ready(function () {
    collapseDescription();
});
$(window).resize(function() {
    collapseDescription();
});

$('.top-block__more-link').click(function(){
    if ($(this).hasClass("top-block__more-link_collapsed")) {
        $(this).removeClass('top-block__more-link_collapsed');
        $('.top-block__description').removeClass('top-block__description_collapse');
        $('.top-block__description').addClass('top-block__description_collapsed');
        // var currentHeight = $('.top-block__description').scrollHeight;
        // $('.top-block__description').css('height', currentHeight);
    } else {
        $(this).addClass('top-block__more-link_collapsed');
        $('.top-block__description').removeClass('top-block__description_collapsed');
        $('.top-block__description').addClass('top-block__description_collapse');
    }
})


///////////////////////////////////
///////////////////////////////////
///////////////////////////////////

$(document).ready(function () {
    if ($('.service-desc__image')) {
        let urlImage = $('.service-desc__image').attr('data-src-img');
        $('.service-desc__image').attr('style', "background-image: url('" + urlImage + "')");
    } else {
        console.log('Нет элемента для обработки')
    }
    if ($('.top-block')) {
        let urlImage = $('.top-block').attr('data-src-img');
        $('.top-block').attr('style', "background-image: url('" + urlImage + "')");
    } else {
        console.log('Нет элемента для обработки')
    }
});



$('.limit').click(function(){
    $('.limit').removeClass('limit_checked');
    $(this).addClass('limit_checked');
    $(this).children('.radio').children('label').children('input').prop('checked', true);
    console.log($(this).children('.radio').children('label').children('input'));
})


$(".form-input__input").on('focus', function () {
    $(this).attr('class', 'form-input__input');
    var iconElement = $(this).parents('.form__input-block').children(".form__icon");
    iconElement.attr('class', 'form__icon').addClass('form__icon_hovered');
}).on('focusout', function () {
    var iconElement = $(this).parents('.form__input-block').children(".form__icon");
    var labelElement = $(this).parents('.form-input').children(".form-input__label");
    iconElement.attr('class', 'form__icon');
    var isRequred = false;
    if ($(this).prop('required')) {
        isRequred = true;
    }
    if ($(this).val() != "")  {
        iconElement.addClass('form__icon_success');
        labelElement.addClass('form-input__label_in-top');
        $(this).removeClass('form-input__input_invalid').addClass('form-input__input_valid');
        console.log(labelElement);
    } else {
        labelElement.removeClass('form-input__label_in-top');
        if (isRequred) {
            iconElement.addClass('form__icon_error');
            $(this).removeClass('form-input__input_valid').addClass('form-input__input_invalid');
        } 
    }
})

 //Функция плавное перемещения и при нажатии на кнопку "Подробнее"
 $("#cost-more-link").click(function (event) {
    //отменяем стандартную обработку нажатия по ссылке
    event.preventDefault();
    //узнаем высоту от начала страницы до блока на который ссылается якорь
    var topTab = $('#cost').offset().top - 5;
    //анимируем переход на расстояние - top за 800 мс
    $('body,html').animate({ scrollTop: topTab }, 800);
});