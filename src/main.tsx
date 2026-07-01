
  import { createRoot } from "react-dom/client";
  import { initMercadoPago } from "@mercadopago/sdk-react";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  const mercadoPagoPublicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
  if (mercadoPagoPublicKey) {
    initMercadoPago(mercadoPagoPublicKey, { locale: "pt-BR" });
  }

  createRoot(document.getElementById("root")!).render(<App />);
