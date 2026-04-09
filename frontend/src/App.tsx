import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { CatalogPage } from "./pages/CatalogPage.tsx";
import { BookPage } from "./pages/BookPage.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import { RegisterPage } from "./pages/RegisterPage.tsx";
import { PricingPage } from "./pages/PricingPage.tsx";
import { PrivacidadePage } from "./pages/PrivacidadePage.tsx";
import { useAuth } from "./context/AuthContext.tsx";
import { Spinner } from "./components/ui/Spinner.tsx";

function PrivateRoute({ children }: { children: ReactNode }) {
  const { token, loading } = useAuth();
  if (loading) {
    return (
      <div
        className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-stone-600"
        role="status"
        aria-live="polite"
        aria-label="Carregando sessão"
      >
        <Spinner className="h-8 w-8 text-amber-700" />
        <span className="text-sm font-medium">Verificando sua sessão…</span>
      </div>
    );
  }
  if (!token) return <Navigate to="/entrar" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="catalogo" element={<CatalogPage />} />
        <Route path="livro/:id" element={<BookPage />} />
        <Route path="entrar" element={<LoginPage />} />
        <Route path="cadastro" element={<RegisterPage />} />
        <Route path="privacidade" element={<PrivacidadePage />} />
        <Route
          path="assinatura"
          element={
            <PrivateRoute>
              <PricingPage />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}
