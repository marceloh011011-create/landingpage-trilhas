/**
 * CARTÃO DE PROFESSOR — lê data/professores.json e monta um cartão por
 * professor dentro da lista indicada.
 *
 *   MetaLP.components.FactoryTeacherCard("[data-teacher-grid]");
 *
 * A foto de cada professor fica em assets/img/professores/<nome>.jpeg.
 * Professor sem foto não ganha cartão.
 *
 * Interações:
 *   - inclinação 3D suave seguindo o mouse ou o dedo (desligada com
 *     prefers-reduced-motion);
 *   - o cartão gira e mostra o perfil no verso ("Ver perfil" / "Voltar").
 */
(function (MetaLP) {
  "use strict";

  var DATA_URL = "data/professores.json";
  var PHOTO_DIR = "assets/img/professores/";
  var PHOTO_EXT = ".jpeg";
  var MAX_TILT = 8; // graus

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function photoUrl(name) {
    return PHOTO_DIR + encodeURIComponent(name) + PHOTO_EXT;
  }

  // Confere se a foto existe sem baixá-la (só os cabeçalhos)
  function hasPhoto(teacher) {
    return fetch(photoUrl(teacher.nome), { method: "HEAD" })
      .then(function (response) { return response.ok; })
      .catch(function () { return false; });
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function icon(name) {
    var node = el("i", "fa-solid " + name);
    node.setAttribute("aria-hidden", "true");
    return node;
  }

  function actionButton(label, iconName, ariaLabel) {
    var button = el("button", "teacher-card__action");
    button.type = "button";
    button.setAttribute("aria-label", ariaLabel);
    var badge = el("span", "teacher-card__action-icon");
    badge.append(icon(iconName));
    button.append(el("span", null, label), badge);
    return button;
  }

  /* ---------- Inclinação 3D ---------- */
  function attachTilt(card) {
    var frame = null;
    var point = null;

    function render() {
      frame = null;
      if (!point) return;
      var rect = card.getBoundingClientRect();
      var x = Math.min(Math.max((point.x - rect.left) / rect.width, 0), 1);
      var y = Math.min(Math.max((point.y - rect.top) / rect.height, 0), 1);
      card.style.setProperty("--tilt-x", ((0.5 - y) * MAX_TILT).toFixed(2) + "deg");
      card.style.setProperty("--tilt-y", ((x - 0.5) * MAX_TILT).toFixed(2) + "deg");
    }

    function move(event) {
      if (reduceMotion.matches) return;
      point = { x: event.clientX, y: event.clientY };
      card.classList.add("is-tilting");
      if (!frame) frame = requestAnimationFrame(render);
    }

    function reset() {
      point = null;
      card.classList.remove("is-tilting", "is-pressed");
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    }

    card.addEventListener("pointerdown", function (event) {
      if (event.pointerType !== "mouse") card.classList.add("is-pressed");
      move(event);
    });
    card.addEventListener("pointermove", function (event) {
      // No toque, só inclina enquanto o dedo está apoiado no cartão
      if (event.pointerType === "mouse" || card.classList.contains("is-pressed")) {
        move(event);
      }
    });
    card.addEventListener("pointerup", function (event) {
      if (event.pointerType !== "mouse") reset();
    });
    card.addEventListener("pointerleave", reset);
    card.addEventListener("pointercancel", reset); // o navegador assumiu a rolagem
  }

  /* ---------- Virar o cartão ---------- */
  function attachFlip(card, front, back, openButton, closeButton) {
    function setFlipped(flipped) {
      var hadFocus = card.contains(document.activeElement);
      card.classList.toggle("is-flipped", flipped);
      openButton.setAttribute("aria-expanded", String(flipped));
      // Só a face visível fica acessível ao teclado e ao leitor de tela
      front.inert = flipped;
      back.inert = !flipped;
      if (hadFocus) (flipped ? closeButton : openButton).focus({ preventScroll: true });
    }

    back.inert = true;
    openButton.addEventListener("click", function (event) {
      event.stopPropagation();
      setFlipped(true);
    });
    closeButton.addEventListener("click", function (event) {
      event.stopPropagation();
      setFlipped(false);
    });
    // Tocar em qualquer parte do cartão também vira (atalho no celular)
    card.addEventListener("click", function () {
      setFlipped(!card.classList.contains("is-flipped"));
    });
  }

  function createCard(teacher, index) {
    var backId = "teacher-profile-" + index;
    var item = el("li");
    var card = el("article", "teacher-card");
    var inner = el("div", "teacher-card__inner");

    /* Frente: foto e nome */
    var front = el("div", "teacher-card__face teacher-card__front");
    var img = el("img", "teacher-card__photo");
    img.src = photoUrl(teacher.nome);
    img.alt = "Foto de " + teacher.nome;
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 400;
    img.height = 500;

    var frontBody = el("div", "teacher-card__body");
    var openButton = actionButton("Ver perfil", "fa-arrow-right", "Ver perfil de " + teacher.nome);
    openButton.setAttribute("aria-expanded", "false");
    openButton.setAttribute("aria-controls", backId);
    frontBody.append(el("h3", "teacher-card__name", teacher.nome), openButton);
    front.append(img, frontBody);

    /* Verso: perfil */
    var back = el("div", "teacher-card__face teacher-card__back");
    back.id = backId;
    var header = el("div", "teacher-card__back-header");
    var avatar = el("img", "teacher-card__avatar");
    avatar.src = img.src;
    avatar.alt = "";
    avatar.loading = "lazy";
    avatar.width = 56;
    avatar.height = 56;
    var heading = el("div");
    heading.append(
      el("p", "teacher-card__eyebrow", "Perfil"),
      el("p", "teacher-card__back-name", teacher.nome)
    );
    header.append(avatar, heading);

    var bio = el("div", "teacher-card__bio");
    bio.append(el("p", null, teacher.bio));

    var closeButton = actionButton("Voltar", "fa-rotate-left", "Voltar para a foto de " + teacher.nome);
    closeButton.classList.add("teacher-card__action--back");
    back.append(header, bio, closeButton);

    inner.append(front, back);
    card.append(inner);
    item.append(card);

    attachTilt(card);
    attachFlip(card, front, back, openButton, closeButton);
    return item;
  }

  /**
   * Busca os professores no JSON e renderiza um cartão para cada um.
   * @param {string|Element} target lista (<ul>) que recebe os cartões
   * @returns {Promise<Element[]>} os <li> criados
   */
  function FactoryTeacherCard(target) {
    var list = typeof target === "string" ? document.querySelector(target) : target;
    if (!list) return Promise.resolve([]);

    return fetch(DATA_URL)
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then(function (teachers) {
        return Promise.all(teachers.map(hasPhoto)).then(function (found) {
          return teachers.filter(function (teacher, i) { return found[i]; });
        });
      })
      .then(function (teachers) {
        var items = teachers.map(createCard);
        list.replaceChildren.apply(list, items);
        return items;
      })
      .catch(function (error) {
        console.error("Não foi possível carregar os professores:", error);
        return [];
      })
      .finally(function () {
        list.removeAttribute("aria-busy");
      });
  }

  MetaLP.components = MetaLP.components || {};
  MetaLP.components.FactoryTeacherCard = FactoryTeacherCard;
})(window.MetaLP = window.MetaLP || {});
