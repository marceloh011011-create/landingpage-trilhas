/**
 * CABEÇALHO — marca o cabeçalho fixo como "rolado" assim que a página desce,
 * para o CSS reforçar o efeito de vidro e a sombra (.site-header.is-scrolled).
 */
(function (MetaLP) {
  "use strict";

  function init() {
    var header = document.querySelector("[data-site-header]");
    if (!header) {
      return;
    }

    var ticking = false;

    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  MetaLP.header = { init: init };
})(window.MetaLP = window.MetaLP || {});
