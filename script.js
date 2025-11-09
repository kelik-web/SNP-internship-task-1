window.addEventListener('scroll', function () {
var header = document.querySelector("header");
var links = this.document.querySelectorAll(".header__navigation-link");
var scrollPosition = window.scrollY;
if( scrollPosition > 450) {
header.classList.add("header--fixed")
}else {header.classList.remove('header--fixed')
}
}) 