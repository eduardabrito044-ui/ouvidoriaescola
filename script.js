<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdlHar22iODe81f-nrUi06PLWKQReb9Gc",
  authDomain: "siteescolaeduarda.firebaseapp.com",
  databaseURL: "https://siteescolaeduarda-default-rtdb.firebaseio.com",
  projectId: "siteescolaeduarda",
  storageBucket: "siteescolaeduarda.firebasestorage.app",
  messagingSenderId: "381495876879",
  appId: "1:381495876879:web:4366dc25b119a2567e327a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const mensagensRef = ref(db, "mensagens");

// 👇 ESPERA CARREGAR A PÁGINA
window.addEventListener("DOMContentLoaded", () => {

  let meuNome = localStorage.getItem("nome");
  if (!meuNome || meuNome.trim() === "") {
    meuNome = prompt("Digite seu nome:") || "Anônimo";
    localStorage.setItem("nome", meuNome);
  }

  // 📩 Enviar mensagem
  window.salvarMensagem = function() {
    const input = document.getElementById("input-msg");
    const msg = input.value.trim();

    if (!msg) return;

    push(mensagensRef, {
      nome: meuNome,
      texto: msg,
      hora: new Date().toLocaleTimeString()
    });

    input.value = "";
  };

  // ⌨️ ENTER funcionando
  const input = document.getElementById("input-msg");
  if (input) {
    input.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        salvarMensagem();
      }
    });
  }

  // 👀 Receber mensagens
  const feed = document.getElementById("feed-forum");

  onValue(mensagensRef, (snapshot) => {
    if (!feed) return;

    feed.innerHTML = "";

    snapshot.forEach((child) => {
      const dados = child.val();

      const div = document.createElement("div");
      div.classList.add("msg");

      if (dados.nome === meuNome) {
        div.classList.add("me");
      } else {
        div.classList.add("outro");
      }

      div.innerHTML = `
        <strong>${dados.nome}</strong><br>
        ${dados.texto}<br>
        <small>${dados.hora}</small>
      `;

      feed.appendChild(div);
    });

    feed.scrollTop = feed.scrollHeight;
  });

});

// 🔄 Fora do DOM (funciona com botão onclick)
window.mudarAba = function(id) {
  document.querySelectorAll('.aba').forEach(a => a.classList.remove('active'));
  document.getElementById(id).classList.add('active');
};

window.salvarIdeia = function() {
  alert("Ideia salva");
};

window.votarEmoji = function(tipo) {
  alert("Voto: " + tipo);
};

window.salvarFeedbackEscola = function() {
  alert("Feedback enviado!");
};
</script>