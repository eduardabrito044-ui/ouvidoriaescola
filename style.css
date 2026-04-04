* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
body { background: #0b0e14; color: white; display: flex; min-height: 100vh; overflow-x: hidden; }
.mesh-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); z-index: -1; opacity: 0.2; }

/* LOGO */
.logo-container {
    width: 80px !important; height: 80px !important; min-width: 80px !important; min-height: 80px !important;
    background-color: white !important; border-radius: 50% !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    margin: 15px auto !important; padding: 8px !important; flex-shrink: 0 !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important; overflow: hidden !important;
}
.logo-container img { max-width: 100%; max-height: 100%; object-fit: contain; }

/* SIDEBAR */
.sidebar { width: 250px; padding: 20px; display: flex; flex-direction: column; gap: 10px; height: 100vh; position: sticky; top: 0; }
.sidebar h2 { margin-bottom: 20px; font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; }
.sidebar button { background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: 12px; cursor: pointer; text-align: left; transition: 0.3s; }
.sidebar button:hover { background: #7c3aed; transform: translateX(5px); }

/* MAIN CONTENT */
.main-content { flex: 1; padding: 30px; display: flex; flex-direction: column; }
.glass { background: rgba(255,255,255,0.08); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 20px; }
.aba { display: none; height: 100%; flex-direction: column; }
.aba.active { display: flex; animation: fadeIn 0.4s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; } }

/* CHAT DESIGN (BALÕES SEPARADOS) */
.feed { flex: 1; min-height: 350px; overflow-y: auto; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 15px; margin-bottom: 15px; display: flex; flex-direction: column; gap: 15px; }

.msg-post { padding: 12px 16px; border-radius: 15px; max-width: 85%; position: relative; cursor: pointer; display: flex; flex-direction: column; gap: 4px; }
.msg-post.me { background: #7c3aed; align-self: flex-end; border-bottom-right-radius: 2px; }
.msg-post.outro { background: rgba(255,255,255,0.1); align-self: flex-start; border-bottom-left-radius: 2px; }

.msg-name { font-weight: bold; font-size: 0.75rem; color: #a78bfa; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
.msg-post.me .msg-name { color: #e9d5ff; }

.msg-text { font-size: 0.95rem; line-height: 1.4; color: white; word-wrap: break-word; }
.msg-time { font-size: 0.6rem; opacity: 0.5; align-self: flex-end; margin-top: 4px; }

/* RESPOSTA DENTRO DO BALÃO */
.reply-inside { background: rgba(0,0,0,0.2); border-left: 3px solid #fff; padding: 6px 10px; border-radius: 8px; margin-bottom: 6px; font-size: 0.8rem; opacity: 0.9; }

/* ÁREA DE INPUT E PREVIEW */
.input-area-container { display: flex; flex-direction: column; gap: 8px; }

#reply-preview { 
    background: rgba(124, 58, 237, 0.2); padding: 12px; border-radius: 12px; 
    border-left: 5px solid #7c3aed; display: flex; align-items: center; justify-content: space-between; 
}

.btn-cancelar { background: #ff4d4d; color: white; border: none; padding: 5px 12px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.8rem; transition: 0.3s; }
.btn-cancelar:hover { background: #ff1a1a; }

.input-area { display: flex; gap: 10px; }
input, textarea { width: 100%; padding: 14px; border-radius: 12px; border: none; background: rgba(0,0,0,0.3); color: white; outline: none; }
button { background: #7c3aed; color: white; border: none; padding: 12px 20px; border-radius: 12px; cursor: pointer; transition: 0.3s; font-weight: bold; }

/* MOBILE */
@media (max-width: 768px) {
    body { flex-direction: column; }
    .sidebar { width: 100%; height: auto; flex-direction: row !important; overflow-x: auto; position: sticky; top: 0; z-index: 100; padding: 10px; background: #0b0e14; align-items: center; }
    .sidebar h2 { display: none; }
    .logo-container { margin: 0 10px 0 0 !important; width: 60px !important; height: 60px !important; min-width: 60px !important; }
}

.btn-contato { display: block; padding: 12px; text-align: center; border-radius: 10px; text-decoration: none; margin-bottom: 10px; font-weight: bold; color: white; }
.wa { background: #25d366; } .ig { background: #e1306c; }
