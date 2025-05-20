import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext.jsx';

export default function DisplayCGPAScreen() {
  const { setOverallCGPA, setCurrentCGPA, setCourses } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { semesterGPA, overallCGPA } = location.state || { semesterGPA: '0.00', overallCGPA: '0.00' };

  const handleSave = () => {
    // Already set in CalculateCGPAScreen, but ensure persistence
    setOverallCGPA(overallCGPA);
    setCurrentCGPA(semesterGPA);
    navigate('/home');
  };

  const handleRecalculate = () => {
    navigate('/calculate-cgpa');
  };

  return (
    <div className="flex flex-col p-5 font-dm-sans min-h-[calc(844px-40px)] items-center">
      {/* Header */}
      <div className="flex items-center mb-8 self-start">
        <button
          onClick={() => navigate('/home')}
          className="w-[24px] h-[24px] mr-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="black"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="w-[149px] h-[21px] flex items-center">
          <span className="text-lg text-black">Back to Home</span>
        </div>
      </div>

      {/* GPA Textbox with large padding */}
      <div className="w-[258px] h-[16px] flex justify-center mt-32 mb-4">
        <span className="text-sm text-black text-center">
          Your grade point average for the semester is
        </span>
      </div>

      {/* GPA Display */}
      <div className="w-[158px] h-[103px] flex justify-center items-center mb-4">
        <span className="text-5xl font-bold text-black">{semesterGPA}</span>
      </div>

      {/* Overall CGPA Field */}
      <div className="w-[350px] h-[50px] bg-gray-100 rounded-lg flex items-center px-3 mb-4">
        <div className="w-[100px] h-[36px] flex items-center">
          <span className="text-sm text-black whitespace-nowrap">Overall CGPA</span>
        </div>
        <div className="ml-auto w-[27px] h-[36px] flex items-center">
          <span className="text-sm text-black">{overallCGPA}</span>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-[346px] h-[44px] bg-[#8f1402] rounded-lg flex items-center justify-center mb-4"
      >
        <span className="text-white text-base">Save</span>
      </button>

      {/* Recalculate Button */}
      <button
        onClick={handleRecalculate}
        className="w-[346px] h-[44px] border-2 border-[#8f1402] bg-white rounded-lg flex items-center justify-center"
      >
        <span className="text-[#8f1402] text-base">Recalculate</span>
      </button>
    </div>
  );
}