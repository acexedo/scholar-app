import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center w-full h-full bg-[#8f1402]">
      <div className="w-[265px] h-[72px] flex justify-center items-center">
        <h1 className="text-white text-4xl font-bold font-dm-sans">
          Scholar
        </h1>
      </div>
    </div>
  );
}