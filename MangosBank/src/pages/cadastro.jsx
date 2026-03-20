import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cadastro.css";
import Logo from "../assets/icon-logo2.png";

function Cadastro() {
    // Dados Pessoais
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [telefone, setTelefone] = useState("");

    // Informações da profissão
    const [profissao, setProfissao] = useState("");
    const [rendaMensal, setRendaMensal] = useState("");

    // Endereço
    const [cep, setCep] = useState("");
    const [rua, setRua] = useState("");
    const [numero, setNumero] = useState("");
    const [bairro, setBairro] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");

    // Documentos
    const [frenteDocumento, setFrenteDocumento] = useState(null);
    const [versoDocumento, setVersoDocumento] = useState(null);

    // Senha
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    // Estados de validação e UI
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [errors, setErrors] = useState({});
    const [cepLoading, setCepLoading] = useState(false);
    const navigate = useNavigate();

    // Função para buscar endereço via CEP
    async function buscarEndereco(cepValue) {
        if (cepValue.length !== 8) return;

        setCepLoading(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
            const data = await response.json();

            if (!data.erro) {
                setRua(data.logradouro || "");
                setBairro(data.bairro || "");
                setCidade(data.localidade || "");
                setEstado(data.uf || "");
            } else {
                alert("CEP não encontrado!");
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            alert("Erro ao buscar CEP. Tente novamente.");
        }
        setCepLoading(false);
    }

    // Validações
    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        if (cpf.length !== 11) return false;
        if (/^(\d)\1+$/.test(cpf)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        return resto === parseInt(cpf.charAt(10));
    }

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validarSenha(senha) {
        return senha.length >= 8 && /[A-Z]/.test(senha) && /[a-z]/.test(senha) && /\d/.test(senha);
    }

    function validarFormulario() {
        const novosErros = {};

        if (!nome.trim()) novosErros.nome = "Nome é obrigatório";
        if (!cpf || !validarCPF(cpf)) novosErros.cpf = "CPF inválido";
        if (!email || !validarEmail(email)) novosErros.email = "Email inválido";
        if (!dataNascimento || dataNascimento.length !== 8) novosErros.dataNascimento = "Data de nascimento inválida (DDMMYYYY)";
        if (!telefone || telefone.length < 10) novosErros.telefone = "Telefone inválido";
        if (!cep || cep.length !== 8) novosErros.cep = "CEP inválido";
        if (!rua.trim()) novosErros.rua = "Rua é obrigatória";
        if (!numero.trim()) novosErros.numero = "Número é obrigatório";
        if (!bairro.trim()) novosErros.bairro = "Bairro é obrigatório";
        if (!cidade.trim()) novosErros.cidade = "Cidade é obrigatória";
        if (!estado.trim()) novosErros.estado = "Estado é obrigatório";
        if (!frenteDocumento) novosErros.frenteDocumento = "Upload da frente do documento é obrigatório";
        if (!versoDocumento) novosErros.versoDocumento = "Upload do verso do documento é obrigatório";
        if (!senha || !validarSenha(senha)) novosErros.senha = "Senha deve ter pelo menos 8 caracteres, com maiúscula, minúscula e número";
        if (senha !== confirmarSenha) novosErros.confirmarSenha = "Senhas não coincidem";

        setErrors(novosErros);
        return Object.keys(novosErros).length === 0;
    }

    async function handleCadastro() {
        if (!validarFormulario()) return;

        setVerifying(true);

        try {
            const formData = new FormData();
            formData.append("nome", nome);
            formData.append("cpf", cpf);
            formData.append("email", email);
            formData.append("dataNascimento", dataNascimento);
            formData.append("telefone", telefone);
            formData.append("profissao", profissao);
            formData.append("rendaMensal", rendaMensal);
            formData.append("cep", cep);
            formData.append("rua", rua);
            formData.append("numero", numero);
            formData.append("bairro", bairro);
            formData.append("cidade", cidade);
            formData.append("estado", estado);
            formData.append("senha", senha);
            if (frenteDocumento) formData.append("frenteDocumento", frenteDocumento);
            if (versoDocumento) formData.append("versoDocumento", versoDocumento);

            const res = await fetch("http://localhost:3000/cadastro", {
                method: "POST",
                body: formData,
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
        <div className="cadastro-container">
            <div className="cadastro-wrapper">
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
                                <p className="verify-label">Cadastro realizado com sucesso!</p>
                            </>
                        )}
                    </div>
                )}
                {/* ── Formulário ── */}
                <a className="cadastro-logo" href="/" target="_blank" ><img src={Logo} alt="Logo" className="cadastro-logo" /></a>
                <h1 className="cadastro-title">Abra sua conta Mangos</h1>
                <p className="cadastro-subtitle">Preencha todos os dados para continuar</p>
                <div className="cadastro-grid">
                    {/* Dados Pessoais */}
                    <div className="cadastro-section">
                        <h2 className="section-title">Dados Pessoais</h2>
                        <div className="cadastro-field">
                            <label className="cadastro-label">Nome</label>
                            <input
                                className={`cadastro-input ${errors.nome ? 'error' : ''}`}
                                type="text"
                                placeholder="Seu nome completo"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                            {errors.nome && <span className="error-message">{errors.nome}</span>}
                        </div>
                        <div className="cadastro-field">
                            <label className="cadastro-label">Data de Nascimento</label>
                            <input
                                className={`cadastro-input ${errors.dataNascimento ? 'error' : ''}`}
                                type="text"
                                placeholder="DDMMYYYY"
                                value={dataNascimento}
                                onChange={(e) => setDataNascimento(e.target.value)}
                                maxLength={8}
                            />
                            {errors.dataNascimento && <span className="error-message">{errors.dataNascimento}</span>}
                        </div>
                        <div className="cadastro-field">
                            <label className="cadastro-label">CPF</label>
                            <input
                                className={`cadastro-input ${errors.cpf ? 'error' : ''}`}
                                type="text"
                                placeholder="000.000.000-00"
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                                maxLength={14}
                            />
                            {errors.cpf && <span className="error-message">{errors.cpf}</span>}
                        </div>
                        <div className="cadastro-field">
                            <label className="cadastro-label">Email</label>
                            <input
                                className={`cadastro-input ${errors.email ? 'error' : ''}`}
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                        <div className="cadastro-field">
                            <label className="cadastro-label">Telefone</label>
                            <input
                                className={`cadastro-input ${errors.telefone ? 'error' : ''}`}
                                type="text"
                                placeholder="34999999999"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                maxLength={11}
                            />
                            {errors.telefone && <span className="error-message">{errors.telefone}</span>}
                        </div>
                    </div>
                    {/* Endereço */}
                    <div className="cadastro-section">
                        <h2 className="section-title">Endereço</h2>
                        <div className="cadastro-field">
                            <label className="cadastro-label">CEP</label>
                            <input
                                className={`cadastro-input ${errors.cep ? 'error' : ''}`}
                                type="text"
                                placeholder="00000000"
                                value={cep}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    setCep(value);
                                    if (value.length === 8) buscarEndereco(value);
                                }}
                                maxLength={8}
                            />
                            {cepLoading && <span className="loading">Buscando endereço...</span>}
                            {errors.cep && <span className="error-message">{errors.cep}</span>}
                        </div>
                        <div className="cadastro-field">
                            <label className="cadastro-label">Rua</label>
                            <input
                                className={`cadastro-input ${errors.rua ? 'error' : ''}`}
                                type="text"
                                placeholder="Nome da rua"
                                value={rua}
                                onChange={(e) => setRua(e.target.value)}
                            />
                            {errors.rua && <span className="error-message">{errors.rua}</span>}
                        </div>
                        <div className="cadastro-row">
                            <div className="cadastro-field">
                                <label className="cadastro-label">Número</label>
                                <input
                                    className={`cadastro-input ${errors.numero ? 'error' : ''}`}
                                    type="text"
                                    placeholder="123"
                                    value={numero}
                                    onChange={(e) => setNumero(e.target.value)}
                                />
                                {errors.numero && <span className="error-message">{errors.numero}</span>}
                            </div>
                            <div className="cadastro-field">
                                <label className="cadastro-label">Bairro</label>
                                <input
                                    className={`cadastro-input ${errors.bairro ? 'error' : ''}`}
                                    type="text"
                                    placeholder="Nome do bairro"
                                    value={bairro}
                                    onChange={(e) => setBairro(e.target.value)}
                                />
                                {errors.bairro && <span className="error-message">{errors.bairro}</span>}
                            </div>
                        </div>
                        <div className="cadastro-row">
                            <div className="cadastro-field">
                                <label className="cadastro-label">Cidade</label>
                                <input
                                    className={`cadastro-input ${errors.cidade ? 'error' : ''}`}
                                    type="text"
                                    placeholder="Nome da cidade"
                                    value={cidade}
                                    onChange={(e) => setCidade(e.target.value)}
                                />
                                {errors.cidade && <span className="error-message">{errors.cidade}</span>}
                            </div>
                            <div className="cadastro-field">
                                <label className="cadastro-label">Estado</label>
                                <input
                                    className={`cadastro-input ${errors.estado ? 'error' : ''}`}
                                    type="text"
                                    placeholder="UF"
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value)}
                                    maxLength={2}
                                />
                                {errors.estado && <span className="error-message">{errors.estado}</span>}
                            </div>
                        </div>
                    </div>
                    {/* Profissão e Renda */}
                    <div className="cadastro-section">
                        <h2 className="section-title">Profissão</h2>
                        <div className="cadastro-field">
                            <label className="cadastro-label">Profissão</label>
                            <input
                                className="cadastro-input"
                                type="text"
                                placeholder="Engenheiro, Médico, etc"
                                value={profissao}
                                onChange={(e) => setProfissao(e.target.value)}
                            />
                        </div>
                        <div className="cadastro-field">
                            <label className="cadastro-label">Renda Mensal</label>
                            <input
                                className="cadastro-input"
                                type="text"
                                placeholder="5000,00"
                                value={rendaMensal}
                                onChange={(e) => setRendaMensal(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Documentos */}
                    <div className="cadastro-section">
                        <h2 className="section-title">Documentos</h2>
                        <div className="cadastro-field">
                            <label className="cadastro-label">Frente do RG ou CNH</label>
                            <input
                                className={`cadastro-file ${errors.frenteDocumento ? 'error' : ''}`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFrenteDocumento(e.target.files[0])}
                            />
                            {errors.frenteDocumento && <span className="error-message">{errors.frenteDocumento}</span>}
                        </div>
                        <div className="cadastro-field">
                            <label className="cadastro-label">Verso do RG ou CNH</label>
                            <input
                                className={`cadastro-file ${errors.versoDocumento ? 'error' : ''}`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => setVersoDocumento(e.target.files[0])}
                            />
                            {errors.versoDocumento && <span className="error-message">{errors.versoDocumento}</span>}
                        </div>
                    </div>
                    {/* Senha */}
                    <div className="cadastro-section">
                        <h2 className="section-title">Senha </h2>
                        <div className="cadastro-field">
                            <label className="cadastro-label">Senha</label>
                            <input
                                className={`cadastro-input ${errors.senha ? 'error' : ''}`}
                                type="password"
                                placeholder="Crie uma senha forte"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                            {errors.senha && <span className="error-message">{errors.senha}</span>}
                        </div>
                        <div className="cadastro-field">
                            <label className="cadastro-label">Confirmar Senha</label>
                            <input
                                className={`cadastro-input ${errors.confirmarSenha ? 'error' : ''}`}
                                type="password"
                                placeholder="Confirme sua senha"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                            />
                            {errors.confirmarSenha && <span className="error-message">{errors.confirmarSenha}</span>}
                        </div>
                    </div>
                </div>
                <button className="cadastro-button" onClick={handleCadastro}>
                    Criar Conta
                </button>
                <p className="cadastro-footer">Plataforma segura &amp; protegida</p>
            </div>
        </div>
    );
}

export default Cadastro;