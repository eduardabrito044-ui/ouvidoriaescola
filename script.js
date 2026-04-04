import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

// --- CONFIGURAÇÃO TELEGRAM ---
const TELEGRAM_TOKEN = '8677563218:AAETd9WMADtAu1PG9i4pOmP07eKZTHtAOxE';
const MEU_CHAT_ID = '8562940574';

async function enviarTelegram(texto) {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${MEU_CHAT_ID}&text=${encodeURIComponent(texto)}`;
    try { await fetch(url); } catch (e) { console.error("Erro Telegram", e); }
}

// --- CONTROLE DE ABAS ---
window.mudarAba = function(id) {
    document.querySelectorAll('.aba').forEach(a => a.classList.remove('active'));
    document.getElementById(id).classList.add('active');
};

// --- 1. CHAT DA ESCOLA (FORUM) ---
window.salvarMensagem = function() {
    const nick = document.getElementById("input-nick").value || "Anônimo";
    const msg = document.getElementById("input-msg").value;
    if (!msg) return;

    push(ref(db, "mensagens"), {
        nome: nick,
        texto: msg,
        hora: new Date().toLocaleTimeString()
    });

    enviarTelegram(`💬 CHAT: ${nick} disse: ${msg}`);
    document.getElementById("input-msg").value = "";
};

onValue(ref(db, "mensagens"), (snapshot) => {
    const feed = document.getElementById("feed-forum");
    feed.innerHTML = "";
    snapshot.forEach((child) => {
        const d = child.val();
        feed.innerHTML += `<div class="msg-post"><strong>${d.nome}</strong>: ${d.texto} <br><small>${d.hora}</small></div>`;
    });
    feed.scrollTop = feed.scrollHeight;
});

// --- 2. MURAL DE IDEIAS ---
window.salvarIdeia = function() {
    const ideiaInput = document.getElementById("input-ideia");
    const ideia = ideiaInput.value;
    if (!ideia) return;

    push(ref(db, "ideias"), {
        texto: ideia,
        data: new Date().toLocaleDateString()
    });

    enviarTelegram(`💡 NOVA IDEIA: ${ideia}`);
    alert("Sugestão enviada para o mural!");
    ideiaInput.value = "";
};

onValue(ref(db, "ideias"), (snapshot) => {
    const feed = document.getElementById("feed-mural");
    feed.innerHTML = "";
    snapshot.forEach((child) => {
        const d = child.val();
        feed.innerHTML += `<div class="msg-post">💡 ${d.texto} <br><small>${d.data}</small></div>`;
    });
});

// --- 3. HUMOR DO DIA ---
window.votarHumor = function(tipo) {
    const humorRef = ref(db, `humor/${tipo}`);
    get(humorRef).then((snapshot) => {
        const votos = (snapshot.val() || 0) + 1;
        set(humorRef, votos);
        enviarTelegram(`🎭 HUMOR: Alguém votou em [${tipo}]`);
        alert("Obrigado por votar!");
    });
};

// Atualiza o placar de humor na tela
onValue(ref(db, "humor"), (snapshot) => {
    const dados = snapshot.val() || {};
    document.getElementById("v-feliz").innerText = dados.feliz || 0;
    document.getElementById("v-triste").innerText = dados.triste || 0;
    document.getElementById("v-cansado").innerText = dados.cansado || 0;
});

// --- 4. SOBRE A ESCOLA (FEEDBACK) ---
window.enviarFeedback = function() {
    const campo = document.getElementById("texto-feedback");
    const msg = campo.value;
    if (!msg) return;

    enviarTelegram(`🏫 FEEDBACK ESCOLA: ${msg}`);
    alert("Sua opinião foi enviada para a coordenação!");
    campo.value = "";
};



