import CreateCapsule from "./components/CreateCapsule";
import HeroPage from "./components/HeroPage";
import MyCapsules from "./components/MyCapsules";
import Navbar from "./components/Navbar";
import SignUp from "../src/SignUp"; 
import SignIn from "../src/SignIn";
import CapsuleMediaView from "./components/CapsuleMediaView.jsx"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicCapsules from "./components/PublicCapsules.jsx";
import FAQPage from "./components/FAQPage.jsx"
import Footer from "./components/Footer.jsx";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/create-capsule" element={<CreateCapsule/>} />
        <Route path="/my-capsules" element={<MyCapsules/>} />
        <Route path="/capsule/:id" element={<CapsuleMediaView />} />
        <Route path="/public-capsules" element={<PublicCapsules/>}/>
        <Route path="/faqs" element={<FAQPage />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;