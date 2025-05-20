import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext.jsx';

export default function PredictCGPAResultScreen() {
  const { setOverallCGPA, setProjectedGPA, setCourses } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { expectedCGPA, semesterGPA, overallCGPA, predictedCourses } = location.state || {
    expectedCGPA: '0.00',
    semesterGPA: '0.00',
    overallCGPA: '0.00',
    predictedCourses: [],
  };

  const isOnTrack = parseFloat(overallCGPA) >= parseFloat(expectedCGPA) - 0.01;

  const handleSave = () => {
    setOverallCGPA(overallCGPA);
    setProjectedGPA(semesterGPA);
    setCourses(predictedCourses.map((course) => ({
      name: course.name,
      units: course.units,
      grade: course.grade,
    })));
    navigate('/home');
  };

  const handleRecalculate = () => {
    navigate('/predict-cgpa');
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

      {/* Expected CGPA Result */}
      <div className="w-[158px] h-[103px] flex justify-center items-center mb-4">
        <span className="text-5xl font-bold text-black">{overallCGPA}</span>
      </div>

      {/* Status Textbox */}
      <div className="w-[258px] h-[16px] flex justify-center mb-10">
        <span className="text-sm text-black text-center">
          {isOnTrack
            ? '👏 You\'re on track to meet the expected grade'
            : 'Couldn\'t meet expected. This is the maximum possible grade.'}
        </span>
      </div>

      {/* Breakdown Header */}
      <div className="w-[350px] h-[22px] mb-4">
        <span className="text-base font-medium text-black">Breakdown of Needed Results</span>
      </div>

      {/* Breakdown Table */}
      <div className="w-[350px] h-[400px] bg-gray-100 rounded-lg p-4 overflow-y-auto scrollbar-gutter-stable">
        {predictedCourses.length === 0 ? (
          <div className="text-sm text-black text-center">No courses available</div>
        ) : (
          predictedCourses.map((course, index) => (
            <div
              key={index}
              className="flex justify-between items-center h-[52px] bg-gray-200 rounded-lg px-3 mb-2"
            >
              <div className="w-[150px]">
                <span className="text-sm text-black">{course.name}</span>
              </div>
              <div className="w-[50px] text-center">
                <span className="text-sm text-black">{course.units}</span>
              </div>
              <div className="w-[100px] text-right">
                <span className="text-sm text-black">{course.grade}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-[346px] h-[44px] bg-[#8f1402] rounded-lg flex items-center justify-center mb-4 mt-4"
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