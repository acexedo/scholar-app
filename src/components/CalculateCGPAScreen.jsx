import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext.jsx";

export default function CalculateCGPAScreen() {
  const { setOverallCGPA, setCurrentCGPA, setCourses } = useContext(AppContext);
  const navigate = useNavigate();
  const [courses, setLocalCourses] = useState([
    { id: 1, name: "", units: "", score: "", grade: "" },
  ]);
  const [currentCGPA, setLocalCurrentCGPA] = useState("");
  const [previousUnits, setPreviousUnits] = useState("");

  const addCourse = () => {
    if (courses.length >= 10) {
      alert("Maximum 10 courses allowed.");
      return;
    }
    setLocalCourses([
      ...courses,
      { id: courses.length + 1, name: "", units: "", score: "", grade: "" },
    ]);
  };

  const updateCourse = (id, field, value) => {
    setLocalCourses(
      courses.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
  };

  const getGradeFromScore = (score) => {
    const scoreNum = parseFloat(score);
    if (isNaN(scoreNum)) return "";
    if (scoreNum >= 70 && scoreNum <= 100) return "A";
    if (scoreNum >= 60 && scoreNum < 70) return "B";
    if (scoreNum >= 50 && scoreNum < 60) return "C";
    if (scoreNum >= 45 && scoreNum < 50) return "D";
    if (scoreNum >= 0 && scoreNum < 45) return "F";
    return "";
  };

  const calculateCGPA = () => {
    const gradePoints = { A: 5.0, B: 4.0, C: 3.0, D: 2.0, F: 0.0 };
    let totalPoints = 0;
    let totalUnits = 0;

    // Validate course inputs
    for (const course of courses) {
      if (!course.name || !course.units || (!course.score && !course.grade)) {
        alert(
          "Please fill course name, units, and either score or grade for all courses."
        );
        return;
      }
      const units = parseFloat(course.units);
      if (isNaN(units) || units <= 0) {
        alert("Units must be a positive number.");
        return;
      }
      let grade;
      if (course.score) {
        const score = parseFloat(course.score);
        if (isNaN(score) || score < 0 || score > 100) {
          alert("Score must be a number between 0 and 100.");
          return;
        }
        grade = getGradeFromScore(score);
        if (!grade) {
          alert(
            `Invalid score for ${course.name}. Score must be between 0 and 100.`
          );
          return;
        }
      } else {
        grade = course.grade.toUpperCase();
        if (!gradePoints.hasOwnProperty(grade)) {
          alert(`Invalid grade for ${course.name}. Use A, B, C, D, or F.`);
          return;
        }
      }
      totalPoints += gradePoints[grade] * units;
      totalUnits += units;
    }

    if (totalUnits === 0) {
      alert("Total units cannot be zero.");
      return;
    }

    // Calculate semester GPA
    const semesterGPA = (totalPoints / totalUnits).toFixed(2);

    // Calculate overall CGPA
    let overallCGPA = semesterGPA;
    if (currentCGPA) {
      const cgpa = parseFloat(currentCGPA);
      if (isNaN(cgpa) || cgpa < 0 || cgpa > 5) {
        alert("Current CGPA must be a number between 0.00 and 5.00.");
        return;
      }
      const prevUnits = previousUnits ? parseFloat(previousUnits) : 30;
      if (previousUnits && (isNaN(prevUnits) || prevUnits < 0)) {
        alert("Previous units must be a non-negative number.");
        return;
      }
      overallCGPA = (
        (cgpa * prevUnits + totalPoints) /
        (prevUnits + totalUnits)
      ).toFixed(2);
    }

    // Update AppContext
    setCurrentCGPA(semesterGPA);
    setOverallCGPA(overallCGPA);
    setCourses(
      courses.map((course) => ({
        name: course.name,
        units: course.units,
        grade: course.score
          ? getGradeFromScore(course.score)
          : course.grade.toUpperCase(),
      }))
    );

    // Navigate to Display CGPA screen
    navigate("/display-cgpa", { state: { semesterGPA, overallCGPA } });
  };

  return (
    <div className="flex flex-col p-5 font-dm-sans min-h-[calc(844px-40px)]">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate("/home")}
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
          <span className="text-lg">CGPA Calculator</span>
        </div>
      </div>

      {/* Current CGPA Field */}
      <div className="mb-4">
        <div className="w-[105px] h-[22px] mb-1">
          <span className="text-sm">Current CGPA</span>
        </div>
        <input
          type="number"
          value={currentCGPA}
          onChange={(e) => setLocalCurrentCGPA(e.target.value)}
          className="w-[350px] h-[52px] bg-gray-200 text-black rounded-lg px-3 text-sm"
          placeholder="Enter current CGPA (optional)"
          step="0.01"
          min="0"
          max="5"
        />
      </div>

      {/* Cumulative TNU Field */}
      <div className="mb-4">
        <div className="w-[105px] h-[22px] mb-1">
          <span className="text-sm">Cumulative TNU</span>
        </div>
        <input
          type="number"
          value={previousUnits}
          onChange={(e) => setPreviousUnits(e.target.value)}
          className="w-[350px] h-[52px] bg-gray-200 text-black rounded-lg px-3 text-sm"
          placeholder="Enter current total units (if not first semester)"
          min="0"
        />
      </div>

      {/* Scrollable Course Fieldboxes */}
      <div className="h-[400px] overflow-y-auto scrollbar-gutter-stable mb-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="w-[350px] h-[330px] bg-gray-100 rounded-lg mb-4 p-4 relative"
          >
            <div className="w-[100px] h-[22px] mb-2">
              <span className="text-base font-medium">Course {course.id}</span>
            </div>
            {courses.length > 1 && (
              <button
                onClick={() =>
                  setLocalCourses(courses.filter((c) => c.id !== course.id))
                }
                className="absolute top-2 right-4 w-6 h-6 bg-[#8f1402] rounded-full flex items-center justify-center text-white text-sm"
              >
                X
              </button>
            )}
            {/* Course Name */}
            <div className="mb-4">
              <div className="w-[105px] h-[22px] mb-1">
                <span className="text-sm">Course name</span>
              </div>
              <input
                type="text"
                value={course.name}
                onChange={(e) =>
                  updateCourse(course.id, "name", e.target.value)
                }
                className="w-[310px] h-[52px] bg-gray-200 text-black rounded-lg px-3 text-sm"
                placeholder="Enter course name"
              />
            </div>
            {/* Number of Units */}
            <div className="mb-4">
              <div className="w-[105px] h-[22px] mb-1">
                <span className="text-sm">Number of units</span>
              </div>
              <input
                type="number"
                value={course.units}
                onChange={(e) =>
                  updateCourse(course.id, "units", e.target.value)
                }
                className="w-[310px] h-[52px] bg-gray-200 text-black rounded-lg px-3 text-sm"
                placeholder="Enter units"
                min="0"
              />
            </div>
            {/* Score or Grade */}
            <div>
              <div className="w-[105px] h-[22px] mb-1">
                <span className="text-sm">Score or Grade</span>
              </div>
              <input
                type="text"
                value={course.score || course.grade}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value) || value === "") {
                    updateCourse(course.id, "score", value);
                    updateCourse(course.id, "grade", "");
                  } else {
                    updateCourse(course.id, "score", "");
                    updateCourse(course.id, "grade", value.toUpperCase());
                  }
                }}
                className="w-[310px] h-[52px] bg-gray-200 text-black rounded-lg px-3 text-sm"
                placeholder="Enter score (0-100) or grade (A, B, C, D, F)"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Calculate and Add Course Buttons */}
      <div className="flex flex-col items-center mt-4 gap-4">
        <button
          onClick={calculateCGPA}
          className="w-[346px] h-[44px] bg-[#8f1402] rounded-lg flex items-center justify-center"
        >
          <span className="text-white text-base">Calculate CGPA</span>
        </button>
        <div className="flex justify-end w-full">
          <div className="flex flex-col items-center w-[90px]">
            <button
              onClick={addCourse}
              className="w-[40px] h-[40px] bg-[#8f1402] rounded-full flex items-center justify-center mb-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                strokeWidth={2}
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
            <span className="text-xs">Add courses</span>
          </div>
        </div>
      </div>
    </div>
  );
}
