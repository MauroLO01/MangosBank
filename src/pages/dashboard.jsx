import "./dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Logo from "../assets/icon-logo2.png";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [saldo, setSaldo] = useState(0);
    const [extrato, setExtrato] = useState([]);
    const [valor, setValor] = useState("");
    const [destinatario, setDestinatario] = useState("");
    const [modal, setModal] = useState(null);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [step, setStep] = useState(1);
    const [mostrarExtrato, setMostrarExtrato] = useState(false);
    const [mostrarSaldo, setMostrarSaldo] = useState(true);

    // 2. DEPOIS useEffect

    const navigate = useNavigate();

    useEffect(() => {
        async function init() {
            const {
                data: { session },
                error: sessionError,
            } = await supabase.auth.getSession();

            if (sessionError) {
                console.error("Erro ao obter sessão:", sessionError);
            }

            if (!session?.user) {
                return navigate("/login");
            }

            const { data: profile, error } = await supabase
                .from("usuarios")
                .select("*")
                .or(`auth_user_id.eq.${session.user.id},email.eq.${session.user.email}`)
                .single();

            if (error) {
                console.warn("Perfil não encontrado em usuarios", error);
                setUser({ ...session.user, profile: null });
            } else {
                setUser({ ...session.user, ...profile });
            }
        }

        init();
    }, [navigate]);

    // 3. VARIÁVEIS DERIVADAS

    const nome = user?.nome || "Cliente";
    const hoje = new Date().toLocaleDateString("pt-BR");

    function abrirModal(tipo) {
        setModal(tipo);
        setValor("");
        setErro("");
        setStep(1);
        setDestinatario("");
    }

    function fecharModal() {
        setModal(null);
        setStep(1);
        setValor("");
        setErro("");
        setDestinatario("");
    }

    async function signOut() {
        await supabase.auth.signOut();
        localStorage.removeItem("User");
        navigate("/login");
    }

    function feedback(tipo, msg) {
        if (tipo === "erro") setErro(msg);
        else setSucesso(msg);
        setTimeout(() => { setErro(""); setSucesso(""); }, 3000);
    }

    function validarValor() {
        const num = Number(valor);
        if (!valor || isNaN(num) || num <= 0) {
            feedback("erro", "Informe um valor válido maior que zero.");
            return null;
        }
        return num;
    }

    function confirmacao() {
        const num = validarValor();
        if (!num) return;
        if (modal !== "depositar" && num > saldo) {
            feedback("erro", "Saldo insuficiente.");
            return;
        }
        setStep(2);
    }

    function depositar() {
        const num = validarValor();
        if (!num) return;
        setSaldo(s => s + num);
        setExtrato(e => [{ tipo: "deposito", desc: "Depósito", valor: num, data: hoje }, ...e]);
        fecharModal();
        feedback("sucesso", `Depósito de R$ ${num.toFixed(2)} realizado!`);
    }

    function sacar() {
        const num = validarValor();
        if (!num) return;
        if (num > saldo) {
            feedback("erro", `Saldo insuficiente. Seu saldo é R$ ${saldo.toFixed(2)}.`);
            return;
        }
        setSaldo(s => s - num);
        setExtrato(e => [{ tipo: "saque", desc: "Saque", valor: num, data: hoje }, ...e]);
        fecharModal();
        feedback("sucesso", `Saque de R$ ${num.toFixed(2)} realizado!`);
    }

    function pix() {
        const num = validarValor();
        if (!num) return;
        if (num > saldo) {
            feedback("erro", `Saldo insuficiente para Pix. Seu saldo é R$ ${saldo.toFixed(2)}.`);
            return;
        }
        setSaldo(s => s - num);
        setExtrato(e => [{ tipo: "pix", desc: `Pix enviado${destinatario ? ` → ${destinatario}` : ""}`, valor: num, data: hoje }, ...e]);
        fecharModal();
        feedback("sucesso", `Pix de R$ ${num.toFixed(2)} enviado!`);
    }

    function transferir() {
        const num = validarValor();
        if (!num) return;
        if (num > saldo) {
            feedback("erro", `Saldo insuficiente para transferência. Seu saldo é R$ ${saldo.toFixed(2)}.`);
            return;
        }
        setSaldo(s => s - num);
        setExtrato(e => [{ tipo: "transferencia", desc: `Transferência${destinatario ? ` → ${destinatario}` : ""}`, valor: num, data: hoje }, ...e]);
        fecharModal();
        feedback("sucesso", `Transferência de R$ ${num.toFixed(2)} realizada!`);
    }

    function recarregar() {
        const num = validarValor();
        if (!num) return;
        if (num > saldo) {
            feedback("erro", `Saldo insuficiente para recarga. Seu saldo é R$ ${saldo.toFixed(2)}.`);
            return;
        }
        setSaldo(s => s - num);
        setExtrato(e => [{ tipo: "recarga", desc: "Recarga de celular", valor: num, data: hoje }, ...e]);
        fecharModal();
        feedback("sucesso", `Recarga de R$ ${num.toFixed(2)} realizada!`);
    }

    function investir() {
        const num = validarValor();
        if (!num) return;
        if (num > saldo) {
            feedback("erro", `Saldo insuficiente para investir. Seu saldo é R$ ${saldo.toFixed(2)}.`);
            return;
        }
        setSaldo(s => s - num);
        setExtrato(e => [{ tipo: "invest", desc: "Investimento realizado", valor: num, data: hoje }, ...e]);
        fecharModal();
        feedback("sucesso", `Investimento de R$ ${num.toFixed(2)} aplicado!`);
    }

    const acaoModal = {
        depositar: { label: "Depositar", fn: depositar, cor: "verde" },
        sacar: { label: "Sacar", fn: sacar, cor: "vermelho" },
        pix: { label: "Enviar Pix", fn: pix, cor: "azul" },
        transferencia: { label: "Transferir", fn: transferir, cor: "azul" },
        recarga: { label: "Recarregar", fn: recarregar, cor: "laranja" },
        invest: { label: "Investir", fn: investir, cor: "verde" },
    };

    const iconeExtrato = { deposito: "↑", saque: "↓", pix: "⚡", transferencia: "→", recarga: "📶", invest: "📈" };
    const corExtrato = { deposito: "entrada", saque: "saida", pix: "saida", transferencia: "saida", recarga: "saida", invest: "saida" };

    return (
        <div className="db-root">
            <aside className="db-sidebar">
                <div className="db-logo">
                    <span className="db-logo-img">
                        <img className="logo" src={Logo} />
                    </span>
                    <span className="db-logo-text">MangosBank</span>
                </div>
                <nav className="db-nav">
                    <Link to="/" className="db-nav-item">
                        <span className="db-nav-icon">⌂</span> Início
                    </Link>
                    <Link to="/dashboard" className="db-nav-item active">
                        <span className="db-nav-icon">▦</span> Dashboard
                    </Link>
                    <button className="db-nav-item" onClick={() => abrirModal("invest")}>
                        <span className="db-nav-icon">📈</span> Investimentos
                    </button>
                    <button className="db-nav-item" onClick={() => setMostrarExtrato(v => !v)}>
                        <span className="db-nav-icon">≡</span> Extrato
                    </button>
                </nav>
                <div className="db-sidebar-bottom">
                    <div className="db-user">
                        <div className="db-avatar">
                            {user?.nome?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="db-user-name">{nome}</div>
                            <div className="db-user-role">Conta corrente</div>
                        </div>
                    </div>
                    <button className="db-logout-button" onClick={signOut}>
                        Sair
                    </button>
                </div>
            </aside>

            <main className="db-main">
                {erro && <div className="db-toast db-toast-erro">⚠ {erro}</div>}
                {sucesso && <div className="db-toast db-toast-sucesso">✓ {sucesso}</div>}

                <header className="db-header">
                    <div>
                        <h1 className="db-titulo">Olá, {user?.nome}👋</h1>
                        <p className="db-subtitulo">Aqui está um resumo da sua conta</p>
                    </div>
                    <div className="db-header-data">{hoje}</div>
                </header>

                <div className="db-saldo-card">
                    <div className="db-saldo-info">
                        <span className="db-saldo-label">Saldo disponível</span>
                        <div className="db-saldo-valor-row">
                            <span className="db-saldo-valor">
                                {mostrarSaldo
                                    ? `R$ ${saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                                    : "R$ ••••••"}
                            </span>
                            <button
                                className="db-olho"
                                onClick={() => setMostrarSaldo(v => !v)}
                                title={mostrarSaldo ? "Ocultar saldo" : "Mostrar saldo"}
                            >
                                {mostrarSaldo ? "👁" : "👁"}
                            </button>
                        </div>
                        <span className="db-agencia">Ag. 0001 · CC 12345-6</span>
                    </div>
                    <div className="db-saldo-acoes">
                        <button className="db-btn-saldo" onClick={() => abrirModal("depositar")}>
                            ↑ Depositar
                        </button>
                        <button className="db-btn-saldo db-btn-sacar" onClick={() => abrirModal("sacar")}>
                            ↓ Sacar
                        </button>
                    </div>
                </div>

                <section className="db-acoes-rapidas">
                    <h2 className="db-secao-titulo">Ações rápidas</h2>
                    <div className="db-acoes-grid">
                        {[
                            { key: "pix", icon: "⚡", label: "Pix" },
                            { key: "transferencia", icon: "→", label: "Transferência" },
                            { key: "invest", icon: "📈", label: "Investir" },
                            { key: "recarga", icon: "📶", label: "Recarga" },
                        ].map(({ key, icon, label }) => (
                            <button
                                key={key}
                                className="db-acao-card"
                                onClick={() => abrirModal(key)}
                            >
                                <span className="db-acao-icon">{icon}</span>
                                <span className="db-acao-label">{label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {mostrarExtrato && (
                    <section className="db-extrato">
                        <div className="db-extrato-header">
                            <h2 className="db-secao-titulo">Extrato</h2>
                            <button className="db-fechar-extrato" onClick={() => setMostrarExtrato(false)}>✕</button>
                        </div>
                        {extrato.length === 0 ? (
                            <p className="db-extrato-vazio">Nenhuma transação ainda.</p>
                        ) : (
                            <ul className="db-extrato-lista">
                                {extrato.map((item, i) => (
                                    <li key={i} className={`db-extrato-item db-extrato-${corExtrato[item.tipo]}`}>
                                        <span className="db-extrato-icone">{iconeExtrato[item.tipo]}</span>
                                        <div className="db-extrato-detalhe">
                                            <span className="db-extrato-desc">{item.desc}</span>
                                            <span className="db-extrato-data">{item.data}</span>
                                        </div>
                                        <span className="db-extrato-quantia">
                                            {corExtrato[item.tipo] === "entrada" ? "+" : "−"} R$ {item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                )}
            </main>

            {modal && (
                <div className="db-overlay" onClick={fecharModal}>
                    <div className="db-modal" onClick={e => e.stopPropagation()}>
                        <button className="db-modal-fechar" onClick={fecharModal}>✕</button>
                        <h3 className="db-modal-titulo">{acaoModal[modal].label}</h3>
                        <p className="db-modal-saldo-atual">
                            Saldo atual: <strong>R$ {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
                        </p>
                        {erro && <p className="db-modal-erro">⚠ {erro}</p>}

                        {step === 1 && (
                            <>
                                {(modal === "pix" || modal === "transferencia") && (
                                    <input
                                        type="text"
                                        className="db-modal-input2"
                                        placeholder="Digite a chave Pix ou conta"
                                        value={destinatario}
                                        onChange={e => setDestinatario(e.target.value)}
                                    />
                                )}
                                <input
                                    type="number"
                                    className="db-modal-input"
                                    placeholder="Digite o valor (R$)"
                                    value={valor}
                                    min="0.01"
                                    step="0.01"
                                    onChange={e => { setValor(e.target.value); setErro(""); }}
                                    autoFocus
                                />
                                <button
                                    className={`db-modal-btn-${acaoModal[modal].cor}`}
                                    onClick={confirmacao}
                                >
                                    Continuar
                                </button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <p className="db-modal-confirmacao">
                                    Confirmar <strong>{acaoModal[modal].label}</strong> de{" "}
                                    <strong>R$ {Number(valor).toFixed(2)}</strong>
                                    {destinatario && <> para <strong>{destinatario}</strong></>}?
                                </p>
                                <button
                                    className={`db-modal-btn db-modal-btn-${acaoModal[modal].cor}`}
                                    onClick={acaoModal[modal].fn}
                                >
                                    Confirmar
                                </button>
                                <button className="db-modal-btn db-modal-btn-voltar" onClick={() => setStep(1)}>
                                    Voltar
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;