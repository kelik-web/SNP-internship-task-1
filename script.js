//Фиксированный хэдер
window.addEventListener('scroll', function () {
    var header = document.querySelector("header");
    var links = this.document.querySelectorAll(".header__navigation-link");
    var scrollPosition = window.scrollY;
    if( scrollPosition > 450) {
        header.classList.add("header--fixed")
    }
    else {
        header.classList.remove('header--fixed')
    }
}) 
//Изменение цвета селекта
var tourSelect = document.querySelector('#tour-selection');
if (tourSelect) {
    tourSelect.addEventListener('change', function() {
        this.classList.toggle('selected', !!this.value);
    });
    tourSelect.classList.toggle('selected', !!tourSelect.value);
}
//Валидация телефона
var isLibReady = typeof window.IMask !== "undefined";
if (isLibReady){
    var phoneInput = document.querySelector("#phone")
    var mask = new IMask(phoneInput, {
        mask: "+7 (000) 000-00-00"
    })
}