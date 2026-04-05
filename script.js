import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, runTransaction, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 1. CONFIGURAÇÃO FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyBdlHar22iODe81f-nrUi06PLWKQReb9Gc",
    authDomain: "siteescolaeduarda.firebaseapp.com",
    databaseURL: "https://siteescolaeduarda-default-rtdb.firebaseio.com",
    projectId: "siteescolaeduarda"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 2. IDENTIFICAÇÃO DO ALUNO
let nome = localStorage.getItem("nome") || prompt("Olá! Qual o seu nome?") || "Estudante";
localStorage.setItem("nome", nome);

let responderInfo = null; // Para guardar quem estamos respondendo

// 3. TROCA DE ABAS (7 ABAS)
window.mudarAba = (id) => {
    document.querySelectorAll(".aba").forEach(a => a.classList.remove("active"));
    document.querySelectorAll(".menu-scroll button").forEach(b => b.classList.remove("active-btn"));
    
    document.getElementById(id).classList.add("active");
    if(document.getElementById("btn-"+id)) {
        document.getElementById("btn-"+id).classList.add("active-btn");
    }
};

// 4. MODO CLARO/ESCURO
window.toggleTheme = () => {
    const body = document.body;
    if (body.classList.contains("dark-mode")) {
        body.classList.replace("dark-mode", "light-mode");
    } else {
        body.classList.replace("light-mode", "dark-mode");
    }
};

// 5. CHAT (DIRECT)
window.salvarMensagem = () => {
    const input = document.getElementById("input-msg");
    if (!input.value.trim()) return;

    const novaMsg = {
        nome: nome,
        texto: input.value,
        hora: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    if (responderInfo) {
        novaMsg.replyTo = responderInfo.autor;
        novaMsg.replyText = responderInfo.texto;
    }

    push(ref(db, "mensagens"), novaMsg);
    input.value = "";
    cancelarResposta();
};

onValue(ref(db, "mensagens"), snap => {
    const feed = document.getElementById("feed-forum");
    feed.innerHTML = "";
    snap.forEach(c => {
        const d = c.val();
        const div = document.createElement("div");
        div.className = `msg-post ${d.nome === nome ? 'me' : 'outro'}`;
        div.onclick = () => prepararResposta(d.nome, d.texto);
        
        div.innerHTML = `
            <span class="msg-info">${d.nome}</span>
            <div class="bubble">
                ${d.replyTo ? `<div class="reply-inside"><small>↳ ${d.replyTo}</small><p>${d.replyText}</p></div>` : ''}
                <p>${d.texto}</p>
            </div>
            <span class="msg-time">${d.hora}</span>
        `;
        feed.appendChild(div);
    });
    feed.scrollTop = feed.scrollHeight;
});

window.prepararResposta = (autor, texto) => {
    responderInfo = { autor, texto };
    document.getElementById("reply-preview").style.display = "flex";
    document.getElementById("reply-user").innerText = "Respondendo a " + autor;
    document.getElementById("reply-text").innerText = texto;
};

window.cancelarResposta = () => {
    responderInfo = null;
    document.getElementById("reply-preview").style.display = "none";
};

// 6. MURAL DE IDEIAS (RANKING)
window.salvarIdeia = () => {
    const input = document.getElementById("input-ideia");
    if(input.value.trim()){
        push(ref(db, "mural"), { autor: nome, texto: input.value, votos: 0 });
        input.value = "";
    }
};

window.votarIdeia = (id) => {
    runTransaction(ref(db, `mural/${id}/votos`), v => (v || 0) + 1);
};

onValue(ref(db, "mural"), snap => {
    const feed = document.getElementById("feed-mural");
    feed.innerHTML = "";
    let lista = [];
    snap.forEach(c => { lista.push({id: c.key, ...c.val()}); });
    
    // Ordenar pelo mais votado
    lista.sort((a,b) => (b.votos || 0) - (a.votos || 0));

    lista.forEach((d, index) => {
        const div = document.createElement("div");
        div.className = "msg-post outro";
        div.style.maxWidth = "100%";
        div.innerHTML = `
            <div class="bubble">
                <strong>${index === 0 ? '👑 ' : ''}${d.autor}:</strong> ${d.texto}
                <button onclick="votarIdeia('${d.id}')" style="float:right; background:none; border:none; cursor:pointer;">👍 ${d.votos || 0}</button>
            </div>
        `;
        feed.appendChild(div);
    });
});

// 7. FEEDBACK PRIVADO (SÓ VOCÊ VÊ)
window.enviarFeedback = () => {
    const texto = document.getElementById("texto-feedback");
    if (texto.value.trim()) {
        push(ref(db, "feedbacks_privados"), {
            aluno: nome,
            mensagem: texto.value,
            data: new Date().toLocaleString()
        });
        alert("Obrigado! Seu feedback foi enviado direto para a Eduarda.");
        texto.value = "";
        mudarAba('forum');
    }
};

// 8. HUMOR (SENTIMENTOS)
window.enviarHumor = (tipo) => {
    set(ref(db, "humor/" + nome), { status: tipo, data: new Date().toLocaleTimeString() });
    alert("Humor registrado! 😊");
};

// 9. AVISOS (COM SENHA)
window.salvarAviso = () => {
    const senha = prompt("Digite a chave de acesso:");
    if (senha === "Chernobyl") {
        const input = document.getElementById("input-aviso");
        if(input.value.trim()){
            push(ref(db, "avisos"), { msg: input.value, data: new Date().toLocaleString() });
            input.value = "";
        }
    } else {
        alert("Chave incorreta!");
    }
};

onValue(ref(db, "avisos"), snap => {
    const feed = document.getElementById("feed-avisos");
    feed.innerHTML = "";
    snap.forEach(c => {
        const d = c.val();
        const div = document.createElement("div");
        div.className = "msg-post outro";
        div.style.maxWidth = "100%";
        div.innerHTML = `<div class="bubble"><strong>AVISO:</strong> ${d.msg}<br><small>${d.data}</small></div>`;
        feed.prepend(div); // Avisos novos no topo
    });
});
