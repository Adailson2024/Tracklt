import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ResetStyle from "./style/ResetStyle.js";
import GlobalStyle from "./style/GlobalStyle.js";
import AppRouter from "./router/AppRouter.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ResetStyle />
    <GlobalStyle />
    <AppRouter />
  </StrictMode>
)
