/**
 * RASTREAMENTO — registra cliques nos botões de WhatsApp como conversão.
 *
 * Só envia eventos se as ferramentas já estiverem instaladas na página:
 *   - Google Tag Manager / GA4 (window.dataLayer)
 *   - Meta Pixel (window.fbq)
 * Sem elas, este arquivo não faz nada.
 */
(function (MetaLP) {
  "use strict";

  function trackWhatsappClick(link) {
    var detail = {
      origin: link.dataset.origin || "desconhecida",
      course: link.dataset.course || null
    };

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: "whatsapp_click",
        click_origin: detail.origin,
        course: detail.course
      });
    }

    if (typeof window.fbq === "function") {
      window.fbq("track", "Contact", detail);
    }
  }

  function init() {
    document.addEventListener("click", function (event) {
      var link = event.target.closest("[data-whatsapp]");
      if (link) {
        trackWhatsappClick(link);
      }
    });
  }

  MetaLP.tracking = { init: init };
})(window.MetaLP = window.MetaLP || {});
