import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "../pages/home"
import Login from "../pages/login"
import Register from "../pages/register"
import Checkin from "../pages/checkin"
import Inside from "../pages/inside"
import Karaoke from "../pages/karaoke"

export default function RouterManager() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/checkin/:houseId" element={<Checkin />} />
                <Route path="/inside/:houseId" element={<Inside />} />
                <Route path="/karaoke/:houseId" element={<Karaoke />} />
            </Routes>
        </Router>
    )
}