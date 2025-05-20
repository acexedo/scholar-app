import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen.jsx';
import HomeScreen from './components/HomeScreen.jsx';
import CalculateCGPAScreen from './components/CalculateCGPAScreen.jsx';
import PredictCGPAScreen from './components/PredictCGPAScreen.jsx';
import DisplayCGPAScreen from "./components/DisplayCGPAScreen.jsx";
import PredictCGPAResultScreen from './components/PredictCGPAResultScreen.jsx';
import { AppProvider } from './contexts/AppContext.jsx';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div id="app-container" className={location.pathname === '/' ? 'splash' : ''}>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/calculate-cgpa" element={<CalculateCGPAScreen />} />
            <Route path="/predict-cgpa" element={<PredictCGPAScreen />} />
            <Route path="/display-cgpa" element={<DisplayCGPAScreen />} />
            <Route path="/predict-cgpa-result" element={<PredictCGPAResultScreen />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}