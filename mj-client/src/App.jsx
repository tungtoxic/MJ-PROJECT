import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Player from "./pages/Player";
import StoryGateway from "./pages/StoryGateway";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/music" element={<Player />} />
      <Route path="/story" element={<StoryGateway />} />
    </Routes>
  );
}

export default App;
