// auth.js
import { auth, rtdb } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

console.log("auth.js carregado");



// ----------- FUNÇÃO PARA MOSTRAR ERRO ABAIXO DO CAMPO -----------
function showError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

// ------------------------------------------------------
// ----------------------- CADASTRO ----------------------
// ------------------------------------------------------

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // limpar erros anteriores
    showError("registerNameError", "");
    showError("registerEmailError", "");
    showError("registerPasswordError", "");
    showError("registerConfirmPasswordError", "");

    const nome = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const senha = document.getElementById("registerPassword").value;
    const confirmar = document.getElementById("registerConfirmPassword").value;

    // validações
    if (!nome) {
      showError("registerNameError", "Digite seu nome.");
      return;
    }
    if (!email) {
      showError("registerEmailError", "Digite seu e-mail.");
      return;
    }
    if (!senha) {
      showError("registerPasswordError", "Crie uma senha.");
      return;
    }
    if (senha !== confirmar) {
      showError("registerConfirmPasswordError", "As senhas não coincidem.");
      return;
    }

    try {
      console.log("Criando usuário:", email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const uid = userCredential.user.uid;

      await set(ref(rtdb, "usuarios/" + uid), {
        nome,
        email,
        criadoEm: new Date().toISOString()
      });

      window.location.href = "index.html";




    } catch (err) {
      console.error("Erro ao cadastrar:", err);

      if (err.code === "auth/email-already-in-use") {
        showError("registerEmailError", "Este e-mail já está em uso.");
      }
      else if (err.code === "auth/invalid-email") {
        showError("registerEmailError", "E-mail inválido.");
      }
      else if (err.code === "auth/weak-password") {
        showError("registerPasswordError", "A senha deve ter no mínimo 6 caracteres.");
      }
      else {
        showError("registerEmailError", "Erro ao cadastrar.");
      }
    }
  });
} else {
  console.log("registerForm não encontrado.");
}

// ------------------------------------------------------
// ------------------------- LOGIN -----------------------
// ------------------------------------------------------

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  document.getElementById("loginEmailError").textContent = "";
  document.getElementById("loginPasswordError").textContent = "";

  const email = document.getElementById("loginEmail").value.trim();
  const senha = document.getElementById("loginPassword").value;

  if (!email) {
    document.getElementById("loginEmailError").textContent = "Digite seu e-mail.";
    return;
  }

  if (!senha) {
    document.getElementById("loginPasswordError").textContent = "Digite sua senha.";
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const uid = userCredential.user.uid;

    // Buscar nome no Banco de Dados
    const userRef = ref(rtdb, "usuarios/" + uid);
    const snap = await get(userRef);

    let nome = "";
    if (snap.exists()) {
        nome = snap.val().nome;
    }

    // Salvar no localStorage
    localStorage.setItem("user", JSON.stringify({ 
        logged: true, 
        uid, 
        email,
        nome
    }));

    window.location.href = "index.html";

  } catch (err) {

    if (err.code === "auth/user-not-found") {
      document.getElementById("loginEmailError").textContent = "Este e-mail não existe.";
    } 
    else if (err.code === "auth/wrong-password") {
      document.getElementById("loginPasswordError").textContent = "Senha incorreta.";
    } 
    else if (err.code === "auth/invalid-email") {
      document.getElementById("loginEmailError").textContent = "E-mail inválido.";
    }
    else {
      document.getElementById("loginPasswordError").textContent = "Erro ao fazer login ou o login não existe.";
    }
  }
});
