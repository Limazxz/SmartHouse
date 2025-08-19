import React, { useEffect, useState } from "react";
import * as Paho from "paho-mqtt";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap icons

function App() {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [theme, setTheme] = useState("light"); // State for theme switching

  const [garageLight, setGarageLight] = useState(false);
  const [roomLight, setRoomLight] = useState(false);
  const [ac, setAC] = useState(false);
  const [humidifier, setHumidifier] = useState(false);
  const [bedroomLight, setBedroomLight] = useState(false);
  const [curtain, setCurtain] = useState(false);
  const [outlet, setOutlet] = useState(false);
  const [basculanteGateOpen, setBasculanteGateOpen] = useState(false); // State for basculante gate

  // Aplica/remover classes no body para mudar o tema da página inteira
  useEffect(() => {
    const cls = `theme-${theme}`;
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(cls);
  }, [theme]);

  useEffect(() => {
    const mqttClient = new Paho.Client(
      "broker.hivemq.com",
      8884, // WebSocket port
      "react_client_" + Math.floor(Math.random() * 1000)
    );

    mqttClient.onConnectionLost = (responseObject) => {
      console.log("Conexão perdida:", responseObject.errorMessage);
      setIsConnected(false);
    };

    mqttClient.onMessageArrived = (message) => {
      const payload = (message.payloadString || "").trim();
      console.log("Mensagem recebida:", message.destinationName, payload);

      switch (message.destinationName) {
        case "iot/garage/light":
          setGarageLight(payload.toUpperCase() === "ON");
          break;
        case "iot/room/light":
          setRoomLight(payload.toUpperCase() === "ON");
          break;
        case "iot/room/ac":
          setAC(payload.toUpperCase() === "ON");
          break;
        case "iot/room/humidifier":
          setHumidifier(payload.toUpperCase() === "ON");
          break;
        case "iot/bedroom/light":
          setBedroomLight(payload.toUpperCase() === "ON");
          break;
        case "iot/bedroom/curtain":
          setCurtain(
            payload.toUpperCase() === "OPEN" || payload.toUpperCase() === "ON"
          );
          break;
        case "iot/bedroom/outlet":
          setOutlet(payload.toUpperCase() === "ON");
          break;
        case "iot/garage/gateSocial":
          // Aqui entra o filtro
          if (
            (payload === "OPEN" && !garageLight) ||
            (payload === "CLOSE" && garageLight)
          ) {
            setGarageLight(payload === "OPEN");
          }
          break;
        case "iot/garage/gateBasculante":
          if (
            (payload === "OPEN" && !basculanteGateOpen) ||
            (payload === "CLOSE" && basculanteGateOpen)
          ) {
            setBasculanteGateOpen(payload === "OPEN");
          }
          break;
        default:
          break;
      }
    };

    mqttClient.connect({
      onSuccess: () => {
        console.log("Conectado ao broker MQTT!");
        setIsConnected(true);
        [
          "iot/garage/light",
          "iot/garage/gateSocial",
          "iot/garage/gateBasculante",
          "iot/room/light",
          "iot/room/ac",
          "iot/room/humidifier",
          "iot/bedroom/light",
          "iot/bedroom/curtain",
          "iot/bedroom/outlet",
        ].forEach((topic) => mqttClient.subscribe(topic));
      },
    });

    setClient(mqttClient);
  }, []);

  const sendCommand = (topic, message) => {
    if (!client) return;
    const msg = new Paho.Message(message);
    msg.destinationName = topic;
    client.send(msg);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const renderButton = (label, active, topic, onMsg) => (
    <button
      className={`btn ${active ? "btn-success" : "btn-secondary"} mb-2 w-100`}
      onClick={() => sendCommand(topic, onMsg)}
    >
      {label}
    </button>
  );

  return (
    <div className={`container mt-4`}>
      <header className="d-flex justify-content-between align-items-center mb-3">
        <h1>🏠 Dashboard Casa IoT</h1>
        <button
          className="btn btn-outline-secondary"
          onClick={toggleTheme}
          title="Trocar tema"
        >
          <i className={`bi bi-${theme === "light" ? "moon" : "sun"}`}></i>
        </button>
      </header>
      <p>Conectado ao broker: {isConnected ? "✅ Sim" : "❌ Não"}</p>

      <div className="row">
        {/* Garagem */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm p-3">
            <h4 className="card-title">Garagem</h4>
            {renderButton(
              `Luz ${garageLight ? "Desligar" : "Ligar"}`,
              garageLight,
              "iot/garage/light",
              garageLight ? "OFF" : "ON"
            )}
            {renderButton(
              "Abrir Portão Social",
              false,
              "iot/garage/gateSocial",
              "OPEN"
            )}
            {renderButton(
              "Fechar Portão Social",
              false,
              "iot/garage/gateSocial",
              "CLOSE"
            )}
            {renderButton(
              "Abrir Portão Basculante",
              basculanteGateOpen,
              "iot/garage/gateBasculante",
              "OPEN"
            )}
            {renderButton(
              "Fechar Portão Basculante",
              !basculanteGateOpen,
              "iot/garage/gateBasculante",
              "CLOSE"
            )}
          </div>
        </div>

        {/* Sala */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm p-3">
            <h4 className="card-title">Sala</h4>
            {renderButton(
              `Luz ${roomLight ? "Desligar" : "Ligar"}`,
              roomLight,
              "iot/room/light",
              roomLight ? "OFF" : "ON"
            )}
            {renderButton(
              `Ar-condicionado ${ac ? "Desligar" : "Ligar"}`,
              ac,
              "iot/room/ac",
              ac ? "OFF" : "ON"
            )}
            {renderButton(
              `Umidificador ${humidifier ? "Desligar" : "Ligar"}`,
              humidifier,
              "iot/room/humidifier",
              humidifier ? "OFF" : "ON"
            )}
          </div>
        </div>

        {/* Quarto */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm p-3">
            <h4 className="card-title">Quarto</h4>
            {renderButton(
              `Luz ${bedroomLight ? "Desligar" : "Ligar"}`,
              bedroomLight,
              "iot/bedroom/light",
              bedroomLight ? "OFF" : "ON"
            )}
            {renderButton(
              `Cortina ${curtain ? "Fechar" : "Abrir"}`,
              curtain,
              "iot/bedroom/curtain",
              curtain ? "CLOSE" : "OPEN"
            )}
            {renderButton(
              `Tomada ${outlet ? "Desligar" : "Ligar"}`,
              outlet,
              "iot/bedroom/outlet",
              outlet ? "OFF" : "ON"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
