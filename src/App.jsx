import React from 'react'
import DashboardPage from "./pages/DashboardPage";
import ChatGPTPage from "./pages/ChatGPTPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return(
    <Router>
      <Routes>
        <Route path='/' element={<DashboardPage />} />
        <Route path='/chat' element={<ChatGPTPage />} />
      </Routes>
    </Router>
  )
}

export default App