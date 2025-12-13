import './App.css'
import { UserProvider } from './context/UserContext.jsx'
import HomePage from './pages/HomePage'

function App() {

  return (
    <>
      <UserProvider>
        <HomePage />
      </UserProvider>
    </>
  )
}

export default App
