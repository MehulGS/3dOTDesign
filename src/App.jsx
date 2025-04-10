import './App.css'
import LoginForm from './LoginForm'

function App() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0", // optional: light background
      }}
    >
      <LoginForm />
    </div>
  )
}

export default App
