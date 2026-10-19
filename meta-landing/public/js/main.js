/**
 * PRINCIPAL — ponto de entrada. Apenas inicializa os módulos.
 */
(function (MetaLP) {
  "use strict";

  function setCurrentYear() {
    document.querySelectorAll("[data-current-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    MetaLP.whatsapp.init();
    MetaLP.tracking.init();
    MetaLP.floatingCta.init();
    MetaLP.header.init();
    MetaLP.components.FactoryTeacherCard("[data-teacher-grid]");
    setCurrentYear();
  });
})(window.MetaLP);
