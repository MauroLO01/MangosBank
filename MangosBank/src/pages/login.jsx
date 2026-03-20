import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import Logo from "../assets/icon-logo2.png";

function Login() {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [verifying, setVerifying] = useState(false);   // spinner
    const [verified, setVerified] = useState(false);     // checkmark
    const navigate = useNavigate();

    async function handleLogin() {
        if (!nome) return alert("Por favor, insira seu nome.");
        if (!cpf) return alert("Por favor, insira seu CPF.");

        setVerifying(true);

        try {
            const res = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nome, cpf }),
            });

            const data = await res.json();

            setVerifying(false);
            setVerified(true);

            setTimeout(() => {
                localStorage.setItem("User", JSON.stringify(data));
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
            {/* ── Overlay de verificação ── */}
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

            {/* ── Formulário ── */}
            <img src={Logo} alt="Logo" className="login-logo" />
            <h2 className="login-title">Bem-vindo</h2>
            <p className="login-subtitle">Acesse sua conta para continuar</p>

            <div className="login-field">
                <label className="login-label">Nome</label>
                <input
                    className="login-input"
                    type="text"
                    placeholder="Seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />

                <label className="login-label" style={{ marginTop: 16 }}>CPF</label>
                <input
                    className="login-input"
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    maxLength={14}
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