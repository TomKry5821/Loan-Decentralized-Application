import { useState } from 'react'
import './App.css'
import Home from './components/Home'
import Navbar from './components/navbar'
import Dashboard from './components/Dashboard'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router >
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/dashbosard" element={<Dashboard />} />
        </Routes>
      </Router >
    </>
  )
}

export default App
