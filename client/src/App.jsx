import "./App.css";
import HomePage from "./pages/HomePage";
import { AppProviders } from "./context/AppProviders";

function App() {
  return (
    <AppProviders>
      <HomePage />
    </AppProviders>
  );
}

export default App;
