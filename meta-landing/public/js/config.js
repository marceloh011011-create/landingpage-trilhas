/**
 * CONFIGURAÇÃO — único lugar para trocar o número do WhatsApp e os textos
 * das mensagens pré-preenchidas. Nenhuma lógica aqui.
 */
window.MetaLP = window.MetaLP || {};

window.MetaLP.config = {
  whatsapp: {
    // DDI + DDD + número, só dígitos: 55 (Brasil) 31 9 3618-4286
    number: "5531936184286",

    // Mensagens usadas pelo atributo data-message="chave" no HTML
    messages: {
      geral: "Olá! Vim pelo site e quero saber mais sobre os cursos técnicos da Meta.",
      vaga: "Olá! Vim pelo site e quero garantir minha vaga na Meta Escola Técnica.",
      visita: "Olá! Vim pelo site e quero agendar uma visita à Meta Escola Técnica.",
      professores: "Olá! Vim pelo site e quero conhecer os cursos e os professores da Meta Escola Técnica."
    },

    // Mensagem usada pelo atributo data-course="Nome do curso" no HTML
    courseMessage: function (course) {
      return "Olá! Vim pelo site e quero saber mais sobre o curso " + course + ".";
    }
  }
};
