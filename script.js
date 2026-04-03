import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, set, runTransaction } from "firebase/database";

// Suas chaves do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBdlHar22iODe81f-nrUi06PLWKQReb9Gc",
    authDomain: "siteescolaeduarda.firebaseapp.com",
    databaseURL: "https://siteescolaeduarda-default-rtdb.firebaseio.com",
    projectId: "siteescolaeduarda",
    storageBucket: "siteescolaeduarda.firebasestorage.app",
    messagingSenderId: "381495876879",
    appId: "1:381495876879:web:5b2bbb9083924f597e327a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const hoje = new Date().toISOString().split('T')[0];

// Navegação
window.mudarAba = (id) => {
    document.querySelectorAll('.aba').forEach(a => a.classList.remove('active'));
    document.getElementById(id).classList.add('active');
};

// --- CHAT (FÓRUM) ---
window.salvarMensagem = () => {
    const nick = document.getElementById('input-nick').value || "Anônimo";
    const msg = document.getElementById('input-msg').value;
    if(!msg) return;
    push(ref(db, 'chat'), { nick, msg, timestamp: Date.now() });
    document.getElementById('input-msg').value = "";
};

onValue(ref(db, 'chat'), (snap) => {
    const feed = document.getElementById('feed-forum');
    const dados = snap.val();
    let html = "";
    for(let id in dados) {
        html += `<div class="msg-post"><strong>@${dados[id].nick}:</strong> ${dados[id].msg}</div>`;
    }
    feed.innerHTML = html;
    feed.scrollTop = feed.scrollHeight;
});

// --- MURAL DE IDEIAS ---
window.salvarIdeia = () => {
    const texto = document.getElementById('input-ideia').value;
    if(!texto) return;
    push(ref(db, 'mural'), { texto, votos: 0 });
    document.getElementById('input-ideia').value = "";
};

onValue(ref(db, 'mural'), (snap) => {
    const feed = document.getElementById('feed-mural');
    const dados = snap.val();
    let html = "";
    for(let id in dados) {
        html += `<div class="msg-post">💡 ${dados[id].texto}</div>`;
    }
    feed.innerHTML = html;
});

// --- HUMOR DIÁRIO (RESET AUTOMÁTICO) ---
window.votarHumor = (tipo) => {
    const humorRef = ref(db, `humor/${hoje}/${tipo}`);
    runTransaction(humorRef, (atual) => (atual || 0) + 1);
};

onValue(ref(db, `humor/${hoje}`), (snap) => {
    const dados = snap.val() || { feliz: 0, triste: 0, cansado: 0 };
    document.getElementById('v-feliz').innerText = dados.feliz || 0;
    document.getElementById('v-triste').innerText = dados.triste || 0;
    document.getElementById('v-cansado').innerText = dados.cansado || 0;
});

// --- FEEDBACK ---
window.enviarFeedback = () => {
    const texto = document.getElementById('texto-feedback').value;
    if(!texto) return;
    push(ref(db, 'feedbacks'), { texto, data: new Date().toLocaleString() });
    alert("Enviado com sucesso!");
    document.getElementById('texto-feedback').value = "";
};

