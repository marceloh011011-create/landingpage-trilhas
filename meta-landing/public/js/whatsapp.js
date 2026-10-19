/**
 * WHATSAPP — monta os links wa.me a partir dos atributos data-* do HTML.
 *
 *   <a data-whatsapp data-message="vaga">        usa config.whatsapp.messages.vaga
 *   <a data-whatsapp data-course="Técnico em X"> usa config.whatsapp.courseMessage
 *
 * Sem JavaScript, os links continuam funcionando: o href do HTML já aponta
 * para o número, apenas sem a mensagem pré-preenchida.
 */
(function (MetaLP) {
  "use strict";

  function buildUrl(message) {
    var url = "https://wa.me/" + MetaLP.config.whatsapp.number;
    return message ? url + "?text=" + encodeURIComponent(message) : url;
  }

  function messageFor(link) {
    var settings = MetaLP.config.whatsapp;
    var course = link.dataset.course;
    if (course) {
      return settings.courseMessage(course);
    }
    return settings.messages[link.dataset.message] || settings.messages.geral;
  }

  function init() {
    var links = document.querySelectorAll("[data-whatsapp]");
    links.forEach(function (link) {
      link.href = buildUrl(messageFor(link));
    });
    return links;
  }

  MetaLP.whatsapp = { init: init, buildUrl: buildUrl };
})(window.MetaLP = window.MetaLP || {});
