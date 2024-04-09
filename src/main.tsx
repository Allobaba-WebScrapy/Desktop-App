import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// redux
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "./state/store.ts";

//react router
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Layouts
import RootLayout from "./layouts/RootLayout.tsx";
import ScrapyPagesLayout from "./layouts/ScrapyPagesLayout.tsx";

// Pages
// Root
import App from "./App.tsx";
// AutoScout24
import AutoScout24 from "./pages/AutoScout24.tsx";
// Orange
import Orange from "./pages/Orange.tsx";
// PagesJaunes
import PagesJaunes from "./pages/PagesJaunes.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import LoginPage from "./components/global/LoginPage.tsx";

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path="/scrapy" element={<RootLayout />}>
        <Route path="*" element={<ScrapyPagesLayout />}>
          <Route path="" element={<App />} />
          <Route path="orange/*" element={<Orange />} />
          <Route path="pagesjaunes/*" element={<PagesJaunes />} />
          <Route path="autoscout24" element={<AutoScout24 />} />
        </Route>
      </Route>
      <Route path='*' element={<Navigate to='/scrapy' replace />} />
    </Routes>
  );
};

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path='*' element={<Navigate to='/login' replace />} />
    </Routes>
  );
};

const HandleRoutes = () => {
  // Call useSelector at the top level of your component
  const isAuthenticated = useSelector((state: RootState) => state.auth.isLogin);

  return (
    <Router>
      <Routes>
        {
          isAuthenticated
            ? <Route path="/*" element={<PrivateRoutes />} />
            : <Route path="/*" element={<PublicRoutes />} />
        }
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <HandleRoutes />
      </ThemeProvider>
    </Provider>
  </React.StrictMode >
);