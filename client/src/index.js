import React from "react";
import ReactDOM from "react-dom/client";
import Main from "./Main";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools />
    <AuthProvider defaultValue={false}>
      <Main />
    </AuthProvider>
  </QueryClientProvider>
  // </React.StrictMode>
);

reportWebVitals();
