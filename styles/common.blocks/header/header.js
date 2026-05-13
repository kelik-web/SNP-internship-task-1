export function initHeader() {
  var header = document.querySelector("header");
  if (header) {
    window.addEventListener("scroll", function () {
      var scrollStartPosition = window.scrollY > 450;
      header.classList.toggle("header--fixed", scrollStartPosition);
    });
  }
}
