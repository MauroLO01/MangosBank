import "./dashboard.css";
import { Link } from "react-router-dom";
import { useState } from "react";

function Dashboard() {
    const [saldo, setSaldo] = useState(1000);
    const [valor, setValor] = useState("");
    const [extrato, setExtrato] = useState([]);

    function depositar() {
        const novoSaldo = saldo + Number(valor);
        setSaldo(novoSaldo);

        setExtrato([
            ...extrato,
            `Depósito de R$ ${valor}`
        ]);

        setValor("");
    }

    function sacar() {
        if (saldo <= 0) {
            alert("Saldo insuficiente para saque.");
            return;
        }

        const novoSaldo = saldo - Number(valor);
        setSaldo(novoSaldo);

        setExtrato([
            ...extrato,
            `Saque de R$ ${valor}`
        ]);

        setValor("");
    }

    return (
        <div className="container">
            <div className="header">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/dashboard">Invest</Link></li>
                    <li><Link to="/dashboard">Outra opção</Link></li>
                </ul>
            </div>

            <div className="card-saldo">
                <h2>Saldo</h2>
                <p>R$ {saldo}</p>
            </div>

            <div className="acoes">
                <input
                    type="number"
                    placeholder="Digite um valor"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                />

                <button onClick={depositar}>Depositar</button>
                <button onClick={sacar}>Sacar</button>
            </div>

            <div className="card extrato">
                <h3>Extrato</h3>
                <ul>
                    {extrato.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>

        </div>
    );
}

export default Dashboard;