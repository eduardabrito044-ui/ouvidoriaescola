import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, update, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBdlHar22iODe81f-nrUi06PLWKQReb9Gc",
    authDomain: "siteescolaeduarda.firebaseapp.com",
    databaseURL: "https://siteescolaeduarda-default-rtdb.firebaseio.com",
    projectId: "siteescolaeduarda"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
let nome = localStorage.getItem("nome") || prompt("Nome:") || "Anônimo";
localStorage.setItem("nome", nome);

window.mudarAba = (id) => {
    document.querySelectorAll('.aba').forEach(a => a.classList.remove('active'));
    document.querySelectorAll('.menu-scroll button').forEach(b => b.classList.remove('active-btn'));
    document.getElementById(id).classList.add('active');
    document.getElementById('btn-'+id).classList.add('active-btn');
};

window.mostrarToast = (msg) => {
    const t = document.getElementById("toast"); t.innerText = msg;
    t.style.display = "block"; setTimeout(() => t.style.display = "none", 2500);
};

// ALERTAS (SÓ COM CHAVE)
window.salvarAviso = () => {
    const chave = prompt("Chave Chernobyl:");
    if (chave === "Chernobyl") {
        const input = document.getElementById("input-aviso");
        if(input.value.trim()){
            push(ref(db, "avisos"), { msg: input.value, data: new Date().toLocaleDateString() });
            input.value = ""; mostrarToast("Alerta Postado! ✓");
        }
    } else { alert("Senha errada!"); }
};

onValue(ref(db, "avisos"), snap => {
    const feed = document.getElementById("feed-avisos"); feed.innerHTML = "";
    snap.forEach(c => {
        const d = c.val();
        const div = document.createElement("div");
        div.className = "card-alerta";
        div.innerHTML = `<strong>⚠️ ${d.data}</strong><p>${d.msg}</p>`;
        feed.prepend(div);
    });
});

// CRONOGRAMA (SÓ COM CHAVE)
window.salvarAgenda = () => {
    const chave = prompt("Chave Chernobyl:");
    if (chave === "Chernobyl") {
        const input = document.getElementById("input-agenda");
        if(input.value.trim()){
            push(ref(db, "agenda"), { texto: input.value, data: new Date().toLocaleDateString() });
            input.value = ""; mostrarToast("Cronograma Atualizado! ✓");
        }
    } else { alert("Senha errada!"); }
};

onValue(ref(db, "agenda"), snap => {
    const feed = document.getElementById("feed-agenda"); feed.innerHTML = "";
    snap.forEach(c => {
        const d = c.val();
        const div = document.createElement("div");
        div.className = "idea-card";
        div.innerHTML = `<small>📅 ${d.data}</small><p>${d.texto}</p>`;
        feed.prepend(div);
    });
});

// CHAT E IDEIAS (VOTAÇÃO) - Mantido igual ao anterior para não bugar
// ... (resto das funções de chat, humor e ideias aqui)
