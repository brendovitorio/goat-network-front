import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index.tsx";
import Changelog from "./pages/Changelog.tsx";
import Empresa from "./pages/Empresa.tsx";
import Products from "./pages/Products.tsx";
import AnticheatProduct from "./pages/AnticheatProduct.tsx";
import Terms from "./pages/Terms.tsx";
import Privacy from "./pages/Privacy.tsx";
import Servers from "./pages/Servers.tsx";
import Auth from "./pages/Auth.tsx";
import Checkout from "./pages/Checkout.tsx";
import Ceo from "./pages/Ceo.tsx";
import DashboardShellRoute from "./pages/DashboardShellRoute.tsx";
import DashboardHome from "./pages/DashboardHome.tsx";
import DashboardSection from "./pages/DashboardSection.tsx";
import { SocketProvider } from "./lib/SocketContext.tsx";
import { LanguageProvider } from "./i18n/LanguageContext.tsx";

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <SocketProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/empresa" element={<Empresa />} />
            <Route path="/products" element={<Products />} />
            <Route path="/pricing" element={<Navigate to="/products" replace />} />
            <Route path="/produtos/goat-anticheat" element={<AnticheatProduct />} />
            <Route path="/termos" element={<Terms />} />
            <Route path="/privacidade" element={<Privacy />} />
            <Route path="/servers" element={<Servers />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/ceo" element={<Ceo />} />

            <Route path="/dashboard" element={<DashboardShellRoute />}>
              <Route index element={<DashboardHome />} />
              <Route path=":section" element={<DashboardSection />} />
            </Route>
          </Routes>
        </SocketProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
