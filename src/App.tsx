import { RouterProvider, createBrowserRouter, Outlet } from "react-router";
import { AppProvider } from "./context/AppContext";
import { LanguageProvider } from "./context/LanguageContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PageMotion from "./components/PageMotion";

import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import ProducerProfile from "./pages/ProducerProfile";
import ProducersList from "./pages/ProducersList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Favorites from "./pages/Favorites";
import ConsumerDashboard from "./pages/ConsumerDashboard";
import ProducerDashboard from "./pages/ProducerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NewListing from "./pages/NewListing";
import HowItWorks from "./pages/HowItWorks";
import Traceability from "./pages/Traceability";
import DemoRegional from "./pages/DemoRegional";
import SpeechTranslator from "./components/SpeechTranslator";
import { Privacy, Terms, ShippingReturns, AboutUs, FAQ, Contact } from "./pages/StaticPages";

function RootLayout() {
  return (
    <AppProvider>
      <LanguageProvider>
      <ScrollToTop />
      <Outlet />
      <SpeechTranslator />
      </LanguageProvider>
    </AppProvider>
  );
}

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <PageMotion />
      </main>
      <Footer />
    </div>
  );
}

function DashboardLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <PageMotion />
      </main>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <PublicLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "catalogo", element: <Catalog /> },
          { path: "producto/:id", element: <ProductDetail /> },
          { path: "productor/:id", element: <ProducerProfile /> },
          { path: "productores", element: <ProducersList /> },
          { path: "como-funciona", element: <HowItWorks /> },
          { path: "trazabilidad", element: <Traceability /> },
          { path: "quienes-somos", element: <AboutUs /> },
          { path: "preguntas-frecuentes", element: <FAQ /> },
          { path: "contacto", element: <Contact /> },
          { path: "privacidad", element: <Privacy /> },
          { path: "terminos", element: <Terms /> },
          { path: "envios-devoluciones", element: <ShippingReturns /> },
          { path: "login", element: <Login /> },
          { path: "registro", element: <Register /> },
          { path: "carrito", element: <Cart /> },
          { path: "checkout", element: <Checkout /> },
          { path: "favoritos", element: <Favorites /> },
          { path: "demo-regional", element: <DemoRegional /> },
        ],
      },
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          { path: "consumidor/dashboard", element: <ConsumerDashboard /> },
          { path: "productor/dashboard", element: <ProducerDashboard /> },
          { path: "productor/nueva-publicacion", element: <NewListing /> },
          { path: "admin", element: <AdminDashboard /> },
        ],
      },
      {
        path: "*",
        element: (
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
              <div className="font-display text-8xl font-bold text-[#EDE8DF] mb-4">404</div>
              <h2 className="font-display text-2xl font-bold text-[#3A2923] mb-3">Página no encontrada</h2>
              <p className="text-[#6B6763] mb-6">La ruta que buscas no existe.</p>
              <a href="/" className="btn-primary">Ir al inicio</a>
            </div>
          </div>
        ),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
