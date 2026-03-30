import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./cadastro.css";
import { supabase } from "./supabaseClient.js"; // ajuste o caminho se necessário
import Logo from "../assets/icon-logo2.png";

function Cadastro() {
  // Dados Pessoais
  // const [user, setUser] = useState(null);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [data_Nascimento, setData_Nascimento] = useState("");
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
      const response = await fetch(
        `https://viacep.com.br/ws/${cepValue}/json/`,
      );
      const data = await response.json();

      if (!data.erro) {
        setRua(data.logradouro || "");
        setBairro(data.bairro || "");
        setCidade(data.localidade || "");
        setEstado(data.uf || "");
      } else {
        alert("CEP não encontrado!");
      }
    } catch (err) {
      console.error("🔥 ERRO NO CADASTRO:");
      console.error("Mensagem:", err.message);

      alert("Erro ao conectar com o servidor");
      setVerifying(false);
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
    return (
      senha.length >= 8 &&
      /[A-Z]/.test(senha) &&
      /[a-z]/.test(senha) &&
      /\d/.test(senha)
    );
  }

  function validarFormulario() {
    const novosErros = {};

    if (!nome.trim()) novosErros.nome = "Nome é obrigatório";

    if (!cpf || !validarCPF(cpf)) {
      novosErros.cpf = "CPF inválido";
    }

    if (!email || !validarEmail(email)) {
      novosErros.email = "Email inválido";
    }

    // ✅ VALIDAÇÃO CORRETA DA DATA
    if (!validarData(data_Nascimento)) {
      novosErros.data_Nascimento = "Data inválida";
    }

    if (!telefone || telefone.length < 10) {
      novosErros.telefone = "Telefone inválido";
    }

    if (!cep || cep.length !== 8) {
      novosErros.cep = "CEP inválido";
    }

    if (!rua.trim()) novosErros.rua = "Rua obrigatória";
    if (!numero.trim()) novosErros.numero = "Número obrigatório";
    if (!bairro.trim()) novosErros.bairro = "Bairro obrigatório";
    if (!cidade.trim()) novosErros.cidade = "Cidade obrigatória";
    if (!estado.trim()) novosErros.estado = "Estado obrigatório";

    if (!senha || !validarSenha(senha)) {
      novosErros.senha = "Senha fraca";
    }

    if (senha !== confirmarSenha) {
      novosErros.confirmarSenha = "Senhas não coincidem";
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleCadastro() {
    if (!validarFormulario()) return;

    setVerifying(true);

    try {
      const cpfClean = cpf.replace(/\D/g, "");

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            nome,
            cpf: cpfClean,
            telefone,
            profissao,
          },
        },
      });

      if (signUpError) {
        console.error("Erro supabase auth:", signUpError);
        setVerifying(false);
        return alert("Erro ao cadastrar usuário: " + signUpError.message);
      }

      const authUserId = signUpData?.user?.id;

      const { data: insertedUser, error } = await supabase
        .from("usuarios")
        .insert([
          {
            auth_user_id: authUserId,
            nome,
            cpf: cpfClean,
            email,
            data_nascimento: formatarData(data_Nascimento),
            telefone,
            profissao,
            renda_mensal: rendaMensal ? parseFloat(rendaMensal.replace(",", ".")) : 0,
            cep,
            rua,
            numero,
            bairro,
            cidade,
            estado,
            senha
          },
        ])
        .select();

      if (error) {
        console.error("🔥 ERRO DO BANCO:", error);
        setVerifying(false);

        if (error.code === "23505") {
          return alert("Erro: CPF ou Email já cadastrado!");
        }

        return alert("Erro ao cadastrar: " + error.message);
      }

      setTimeout(() => {
        setVerifying(false);
        setVerified(true);

        setTimeout(() => {
          localStorage.setItem("User", JSON.stringify(insertedUser[0]));
          navigate("/login");
        }, 1400);
      }, 1200);
    } catch (err) {
      console.error("Erro geral:", err);
      alert("Erro ao conectar com o servidor");
      setVerifying(false);
    }
  }

  function formatarData(data) {
    return `${data.slice(4, 8)}-${data.slice(2, 4)}-${data.slice(0, 2)}`;
  }

  function validarData(data) {
    if (data.length !== 8) return false;

    const dia = parseInt(data.slice(0, 2));
    const mes = parseInt(data.slice(2, 4));
    const ano = parseInt(data.slice(4, 8));

    const dataObj = new Date(ano, mes - 1, dia);

    return (
      dataObj.getFullYear() === ano &&
      dataObj.getMonth() === mes - 1 &&
      dataObj.getDate() === dia
    );
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
                <p className="verify-label">Verificando seu cadastro…</p>
              </>
            )}
            {verified && (
              <>
                <div className="verify-check">
                  <svg viewBox="0 0 52 52" fill="none">
                    <circle className="check-circle" cx="26" cy="26" r="24" />
                    <polyline
                      className="check-mark"
                      points="14,27 22,35 38,18"
                    />
                  </svg>
                </div>
                <p className="verify-label">Cadastro realizado com sucesso!</p>
              </>
            )}
          </div>
        )}
        {/* ── Formulário ── */}
        <Link className="backButton" to="/">
          ←
        </Link>
        <a className="cadastro-logo" href="/" target="_blank">
          <img src={Logo} alt="Logo" className="cadastro-logo" />
        </a>
        <h1 className="cadastro-title">Abra sua conta Mangos</h1>
        <p className="cadastro-subtitle">
          Preencha todos os dados para continuar
        </p>
        <div className="cadastro-grid">
          {/* Dados Pessoais */}
          <div className="cadastro-section">
            <h2 className="section-title">Dados Pessoais</h2>
            <div className="cadastro-field">
              <label className="cadastro-label">Nome</label>
              <input
                className={`cadastro-input ${errors.nome ? "error" : ""}`}
                type="text"
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              {errors.nome && (
                <span className="error-message">{errors.nome}</span>
              )}
            </div>
            <div className="cadastro-field">
              <label className="cadastro-label">Data de Nascimento</label>
              <input
                className={`cadastro-input ${errors.data_Nascimento ? "error" : ""}`}
                type="text"
                placeholder="DDMMYYYY"
                value={data_Nascimento}
                onChange={(e) => setData_Nascimento(e.target.value)}
                maxLength={8}
              />
              {errors.data_Nascimento && (
                <span className="error-message">{errors.data_Nascimento}</span>
              )}
            </div>
            <div className="cadastro-field">
              <label className="cadastro-label">CPF</label>
              <input
                className={`cadastro-input ${errors.cpf ? "error" : ""}`}
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                maxLength={14}
              />
              {errors.cpf && (
                <span className="error-message">{errors.cpf}</span>
              )}
            </div>
            <div className="cadastro-field">
              <label className="cadastro-label">Email</label>
              <input
                className={`cadastro-input ${errors.email ? "error" : ""}`}
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>
            <div className="cadastro-field">
              <label className="cadastro-label">Telefone</label>
              <input
                className={`cadastro-input ${errors.telefone ? "error" : ""}`}
                type="text"
                placeholder="34999999999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                maxLength={11}
              />
              {errors.telefone && (
                <span className="error-message">{errors.telefone}</span>
              )}
            </div>
          </div>
          {/* Endereço */}
          <div className="cadastro-section">
            <h2 className="section-title">Endereço</h2>
            <div className="cadastro-field">
              <label className="cadastro-label">CEP</label>
              <input
                className={`cadastro-input ${errors.cep ? "error" : ""}`}
                type="text"
                placeholder="00000000"
                value={cep}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setCep(value);
                  if (value.length === 8) buscarEndereco(value);
                }}
                maxLength={8}
              />
              {cepLoading && (
                <span className="loading">Buscando endereço...</span>
              )}
              {errors.cep && (
                <span className="error-message">{errors.cep}</span>
              )}
            </div>
            <div className="cadastro-field">
              <label className="cadastro-label">Rua</label>
              <input
                className={`cadastro-input ${errors.rua ? "error" : ""}`}
                type="text"
                placeholder="Nome da rua"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
              />
              {errors.rua && (
                <span className="error-message">{errors.rua}</span>
              )}
            </div>
            <div className="cadastro-row">
              <div className="cadastro-field">
                <label className="cadastro-label">Número</label>
                <input
                  className={`cadastro-input ${errors.numero ? "error" : ""}`}
                  type="text"
                  placeholder="123"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
                {errors.numero && (
                  <span className="error-message">{errors.numero}</span>
                )}
              </div>
              <div className="cadastro-field">
                <label className="cadastro-label">Bairro</label>
                <input
                  className={`cadastro-input ${errors.bairro ? "error" : ""}`}
                  type="text"
                  placeholder="Nome do bairro"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
                {errors.bairro && (
                  <span className="error-message">{errors.bairro}</span>
                )}
              </div>
            </div>
            <div className="cadastro-row">
              <div className="cadastro-field">
                <label className="cadastro-label">Cidade</label>
                <input
                  className={`cadastro-input ${errors.cidade ? "error" : ""}`}
                  type="text"
                  placeholder="Nome da cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
                {errors.cidade && (
                  <span className="error-message">{errors.cidade}</span>
                )}
              </div>
              <div className="cadastro-field">
                <label className="cadastro-label">Estado</label>
                <input
                  className={`cadastro-input ${errors.estado ? "error" : ""}`}
                  type="text"
                  placeholder="UF"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  maxLength={2}
                />
                {errors.estado && (
                  <span className="error-message">{errors.estado}</span>
                )}
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
          {/* Senha */}
          <div className="cadastro-section">
            <h2 className="section-title">Senha </h2>
            <div className="cadastro-field">
              <label className="cadastro-label">Senha</label>
              <input
                className={`cadastro-input ${errors.senha ? "error" : ""}`}
                type="password"
                placeholder="Crie uma senha forte"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              {errors.senha && (
                <span className="error-message">{errors.senha}</span>
              )}
            </div>
            <div className="cadastro-field">
              <label className="cadastro-label">Confirmar Senha</label>
              <input
                className={`cadastro-input ${errors.confirmarSenha ? "error" : ""}`}
                type="password"
                placeholder="Confirme sua senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
              {errors.confirmarSenha && (
                <span className="error-message">{errors.confirmarSenha}</span>
              )}
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
