import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext.jsx";
import reactImg from "../assets/react.svg";
import calculatorImg from "../assets/calculator.svg";
import predictorImg from "../assets/predictor.svg";
import recordsImg from "../assets/records.svg";
import dashboardImg from "../assets/dashboard.svg";
import performanceImg from "../assets/performance.svg";
import records2Img from "../assets/records-2.svg";
import profileImg from "../assets/profile.svg";

export default function HomeScreen() {
  const { overallCGPA, currentCGPA, projectedGPA, courses } =
    useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col p-5 font-dm-sans min-h-[calc(844px-40px)] bg-white">
      {/* Welcome Section */}
      <div className="flex items-center mb-4">
        <img src={reactImg} alt="React" className="w-8 h-8 pr-[5px]" />
        <div className="w-[137px] h-[26px] flex items-center">
          <span className="text-lg">Welcome User</span>
        </div>
        <div className="ml-auto w-[28px] h-[28px]">
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
      </div>

      {/* CGPA Box */}
      <div className="w-[350px] h-[170px] bg-[#8f1402] rounded-lg relative mb-4">
        <div className="absolute top-2 left-4 w-[78px] h-[36px] flex items-center">
          <span className="text-white text-base whitespace-nowrap">
            Overall CGPA
          </span>
        </div>
        <div className="absolute bottom-2 right-4 w-[86px] h-[72px] flex items-center justify-end">
          <span className="text-white text-3xl">{overallCGPA}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-6 mb-6">
        <div className="flex flex-col items-center">
          <img
            onClick={() => navigate("/calculate-cgpa")}
            src={calculatorImg}
            alt="Calculate"
            className="w-[50px] h-[50px] pr-[5px] rounded-full mb-1 cursor-pointer"
          />
          <span className="text-xs">Calculate CGPA</span>
        </div>
        <div className="flex flex-col items-center">
          <img
            onClick={() => navigate("/predict-cgpa")}
            src={predictorImg}
            alt="Predict"
            className="w-[50px] h-[50px] pr-[5px] rounded-full mb-1 cursor-pointer"
          />
          <span className="text-xs">Predict CGPA</span>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={recordsImg}
            alt="Records"
            disabled
            className="w-[50px] h-[50px] pr-[5px] rounded-full mb-1 opacity-50"
          />
          <span className="text-xs">Records</span>
        </div>
      </div>

      {/* Current Semester */}
      <div className="w-[145px] h-[35px] flex items-center mb-4">
        <span className="text-base font-medium whitespace-nowrap">
          Current Semester
        </span>
      </div>

      {/* Current CGPA Field */}
      <div className="w-[350px] h-[50px] bg-gray-300 rounded-lg flex items-center px-3 mb-2">
        <div className="w-[100px] h-[36px] flex items-center">
          <span className="text-sm whitespace-nowrap">Current CGPA</span>
        </div>
        <div className="ml-auto w-[27px] h-[36px] flex items-center">
          <span className="text-sm">{currentCGPA}</span>
        </div>
      </div>

      {/* Projected GPA Field */}
      <div className="w-[350px] h-[50px] bg-gray-300 rounded-lg flex items-center px-3 mb-4">
        <div className="w-[110px] h-[36px] flex items-center">
          <span className="text-sm whitespace-nowrap">Projected CGPA</span>
        </div>
        <div className="ml-auto w-[27px] h-[36px] flex items-center">
          <span className="text-sm">{projectedGPA}</span>
        </div>
      </div>

      {/* Courses List */}
      <div className="w-[350px] h-[150px] bg-white rounded-lg overflow-y-auto mb-4 scrollbar-gutter-stable">
        <div className="flex justify-between px-3 py-2 sticky top-0 bg-white">
          <div className="w-[150px]"><span className="text-sm font-bold">Courses</span></div>
          <div className="w-[50px] text-center"><span className="text-sm font-bold">Units</span></div>
          <div className="w-[100px] text-right"><span className="text-sm font-bold">Needed Grades</span></div>
        </div>
        {courses.length === 0 ? (
          <div className="text-center text-gray-500 px-3 py-2">
            No courses added
          </div>
        ) : (
          courses.map((course, index) => (
            <div key={index} className="flex justify-between px-3 py-2">
              <div className="w-[150px]"><span className="text-sm">{course.name || '-'}</span></div>
              <div className="w-[50px] text-center"><span className="text-sm">{course.units || '-'}</span></div>
              <div className="w-[100px] text-right"><span className="text-sm">{course.grade || '-'}</span></div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around gap-4 mt-auto pt-6">
        <div className="flex flex-col items-center">
          <img
            src={dashboardImg}
            alt="Dashboard"
            disabled
            className="w-[40px] h-[40px] mb-1 opacity-50"
          />
          <span className="text-xs">Dashboard</span>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={performanceImg}
            alt="Performance"
            disabled
            className="w-[40px] h-[40px] mb-1 opacity-50"
          />
          <span className="text-xs">Performance</span>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={records2Img}
            alt="Records"
            disabled
            className="w-[40px] h-[40px] mb-1 opacity-50"
          />
          <span className="text-xs">Records</span>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={profileImg}
            alt="Profile"
            disabled
            className="w-[40px] h-[40px] mb-1 opacity-50"
          />
          <span className="text-xs">Profile</span>
        </div>
      </div>
    </div>
  );
}