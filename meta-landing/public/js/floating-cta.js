/**
 * BOTÃO FLUTUANTE — esconde o botão fixo de WhatsApp enquanto um bloco
 * marcado com data-hides-floating-cta (que já tem o seu próprio botão)
 * estiver visível, para os dois não se sobreporem.
 *
 * A aparência do estado escondido fica no CSS (.floating-cta.is-hidden).
 * Sem JavaScript, o botão simplesmente permanece visível.
 */
(function (MetaLP) {
  "use strict";

  function init() {
    var button = document.querySelector("[data-floating-cta]");
    var blocks = document.querySelectorAll("[data-hides-floating-cta]");
    if (!button || !blocks.length || !("IntersectionObserver" in window)) {
      return;
    }

    var visibleBlocks = new Set();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          visibleBlocks.add(entry.target);
        } else {
          visibleBlocks.delete(entry.target);
        }
      });
      button.classList.toggle("is-hidden", visibleBlocks.size > 0);
    });

    blocks.forEach(function (block) {
      observer.observe(block);
    });
  }

  MetaLP.floatingCta = { init: init };
})(window.MetaLP = window.MetaLP || {});
