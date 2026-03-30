import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./login.css";
import Logo from "../assets/icon-logo2.png";

function Login() {
  const [identificador, setIdentificador] = useState(""); // CPF ou email
  const [senha, setSenha] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    if (!identificador.trim()) return alert("Por favor, insira CPF ou email.");
    if (!senha) return alert("Por favor, insira sua senha.");

    setVerifying(true);

    try {
      let email = identificador.trim();

      if (!email.includes("@")) {
        const cpfClean = email.replace(/\D/g, "");

        const { data: userByCpf, error: userError } = await supabase
          .from("usuarios")
          .select("email")
          .eq("cpf", cpfClean)
          .single();

        if (userError || !userByCpf?.email) {
          setVerifying(false);
          return alert("CPF não encontrado. Verifique e tente novamente.");
        }

        email = userByCpf.email;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error || !data?.session) {
        setVerifying(false);
        return alert("Falha no login: " + (error?.message || "usuário/senha inválidos"));
      }

      const user = data.user;

      const { data: profile } = await supabase
        .from("usuarios")
        .select("*")
        .eq("email", user.email)
        .single();

      setVerifying(false);
      setVerified(true);

      setTimeout(() => {
        const userData = {
          ...user,
          profile,
        };
        localStorage.setItem("User", JSON.stringify(userData));
        navigate("/dashboard");
      }, 1400);
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor");
      setVerifying(false);
    }
  }

  return (
    <div className="login-wrapper">
      {(verifying || verified) && (
        <div className={`verify-overlay ${verified ? "verified" : ""}`}>
          {verifying && (
            <>
              <div className="verify-spinner" />
              <p className="verify-label">Verificando dados…</p>
            </>
          )}
          {verified && (
            <>
              <div className="verify-check">
                <svg viewBox="0 0 52 52" fill="none">
                  <circle className="check-circle" cx="26" cy="26" r="24" />
                  <polyline className="check-mark" points="14,27 22,35 38,18" />
                </svg>
              </div>
              <p className="verify-label">Identidade confirmada</p>
            </>
          )}
        </div>
      )}

      <img src={Logo} alt="Logo" className="login-logo" />
      <h2 className="login-title">Bem-vindo</h2>
      <p className="login-subtitle">Acesse sua conta para continuar</p>

      <div className="login-field">
        <label className="login-label">CPF ou Email</label>
        <input
          className="login-input"
          type="text"
          placeholder="CPF ou email"
          value={identificador}
          onChange={(e) => setIdentificador(e.target.value)}
        />

        <label className="login-label" style={{ marginTop: 16 }}>
          Senha
        </label>
        <input
          className="login-input"
          type="password"
          placeholder="********"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
      </div>

      <button className="login-button" onClick={handleLogin}>
        Entrar
      </button>

      <p className="login-footer">Plataforma segura &amp; protegida</p>
    </div>
  );
}

export default Login;