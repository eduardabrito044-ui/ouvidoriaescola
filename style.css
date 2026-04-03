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

// nome automático
let meuNome = localStorage.getItem("nome");
if (!meuNome) {
  meuNome = prompt("Digite seu nome:");
  localStorage.setItem("nome", meuNome);
}

// trocar aba
window.mudarAba = function(id) {
  document.querySelectorAll('.aba').forEach(a => a.classList.remove('active'));
  document.getElementById(id).classList.add('active');
};

// enviar mensagem
window.salvarMensagem = function() {
  const msg = document.getElementById("input-msg").value;
  if (!msg) return;

  push(mensagensRef, {
    nome: meuNome,
    texto: msg,
    hora: new Date().toLocaleTimeString()
  });

  document.getElementById("input-msg").value = "";
};

// receber mensagens
onValue(mensagensRef, (snapshot) => {
  const feed = document.getElementById("feed-forum");
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

// funções extras (mantidas simples)
window.salvarIdeia = function() {
  alert("Ideia salva (modo simples)");
};

window.votarEmoji = function(tipo) {
  alert("Voto registrado: " + tipo);
};

window.salvarFeedbackEscola = function() {
  alert("Feedback enviado!");
};
