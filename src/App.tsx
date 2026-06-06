import { HashRouter, Routes, Route } from "react-router-dom"
import FrontPage from "@/pages/FrontPage"
import AdminPage from "@/pages/AdminPage"

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </HashRouter>
  )
}
