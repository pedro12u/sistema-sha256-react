import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [message, setMessage] = useState("");
  const [hashes, setHashes] = useState("");
  const [showHashes, setShowHashes] = useState(false);
  const [chaveAES, setChaveAES] = useState("");

  const handleRegister = async () => {
    if (/\d/.test(nome)) {
      setMessage("O nome não pode conter números");
      return;
    }
    if (!email.includes("@")) {
      setMessage("Email inválido. Deve conter @");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/register",
        {
          nome,
          email,
          senha,
        }
      );
      setMessage(response.data);
      setNome("");
      setSenha("");
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data);
      } else {
        setMessage("Erro ao registrar");
      }
    }
  };

  const handleLogin = async () => {
    if (!email.includes("@")) {
      setMessage("Email inválido. Deve conter @");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        {
          email,
          senha,
        }
      );
      setMessage(response.data);
      if (response.data === "Autenticação bem-sucedida") {
        const hashResponse = await axios.get(
          "http://localhost:3000/api/users/hashes",
          {
            params: { email },
          }
        );
        setHashes(hashResponse.data);

        const aesResponse = await axios.get(
          "http://localhost:3000/api/users/aes",
          {
            params: { email },
          }
        );
        setChaveAES(aesResponse.data);
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data);
      } else {
        setMessage("Erro ao autenticar");
      }
    }
  };

  const toggleShowHashes = () => {
    setShowHashes(!showHashes);
  };

  return (
    <div className="container">
      <h2>Proteção de Dados com SHA-256</h2>
      <div className="form">
        <input
          type="text"
          className="input-field"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="text"
          className="input-field"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="input-field"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <div className="buttons">
          <button className="button register-button" onClick={handleRegister}>
            Registrar
          </button>
          <button className="button login-button" onClick={handleLogin}>
            Login
          </button>
        </div>
        <div className="buttons">
          <button className="button toggle-button" onClick={toggleShowHashes}>
            {showHashes ? "Ocultar Informações" : "Mostrar Hash e Chave AES"}
          </button>
        </div>
        {message && <p className="message">{message}</p>}
        {showHashes && (hashes || chaveAES) && (
          <div className="hashes-container">
            {hashes && (
              <p>
                <strong>{hashes}</strong>
              </p>
            )}
            {chaveAES && (
              <p>
                <strong>Chave AES: {chaveAES}</strong>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
