import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext.jsx';

export default function PredictCGPAScreen() {
  const { setOverallCGPA, setCurrentCGPA, setCourses } = useContext(AppContext);
  const navigate = useNavigate();
  const [courses, setLocalCourses] = useState([
    { id: 1, name: '', units: '' },
  ]);
  const [expectedCGPA, setExpectedCGPA] = useState('');
  const [currentCGPA, setLocalCurrentCGPA] = useState('');
  const [previousUnits, setPreviousUnits] = useState('');

  const addCourse = () => {
    if (courses.length >= 10) {
      alert('Maximum 10 courses allowed.');
      return;
    }
    setLocalCourses([...courses, { id: courses.length + 1, name: '', units: '' }]);
  };

  const updateCourse = (id, field, value) => {
    setLocalCourses(
      courses.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
  };

  const predictCGPA = () => {
    // Validate inputs
    const expCGPA = parseFloat(expectedCGPA);
    if (!expectedCGPA || isNaN(expCGPA) || expCGPA < 0 || expCGPA > 5) {
      alert('Expected CGPA must be a number between 0.00 and 5.00.');
      return;
    }

    const currCGPA = currentCGPA ? parseFloat(currentCGPA) : 0;
    if (currentCGPA && (isNaN(currCGPA) || currCGPA < 0 || currCGPA > 5)) {
      alert('Current CGPA must be a number between 0.00 and 5.00.');
      return;
    }

    const prevUnits = previousUnits ? parseFloat(previousUnits) : (currentCGPA ? 30 : 0);
    if (previousUnits && (isNaN(prevUnits) || prevUnits < 0)) {
      alert('Previous units must be a non-negative number.');
      return;
    }

    let totalUnits = 0;
    for (const course of courses) {
      if (!course.name || !course.units) {
        alert('Please fill all fields for all courses.');
        return;
      }
      const units = parseFloat(course.units);
      if (isNaN(units) || units <= 0) {
        alert('Units must be a positive number.');
        return;
      }
      totalUnits += units;
    }

    if (totalUnits === 0) {
      alert('Total units cannot be zero.');
      return;
    }

    // Calculate points needed
    const totalPointsNeeded = expCGPA * (prevUnits + totalUnits);
    const currentPoints = currCGPA * prevUnits;
    let pointsToEarn = totalPointsNeeded - currentPoints;
    let semesterGPA = pointsToEarn / totalUnits;

    // Distribute grades
    const gradePoints = { A: 5.0, B: 4.0, C: 3.0, D: 2.0, F: 0.0 };
    const grades = ['D', 'C', 'B', 'A']; // Lowest to highest
    const sortedCourses = [...courses].sort((a, b) => parseFloat(b.units) - parseFloat(a.units)); // Descending
    let predictedCourses = sortedCourses.map((course) => ({ ...course, grade: 'F' }));

    if (courses.length === 1) {
      // Single course: assign smallest grade >= semesterGPA
      let assignedGrade = 'A';
      for (const grade of grades) {
        if (gradePoints[grade] >= semesterGPA && gradePoints[grade] <= 5.0) {
          assignedGrade = grade;
          break;
        }
      }
      predictedCourses[0].grade = assignedGrade;
    } else {
      // Multiple courses: assign lowest grades to meet expCGPA
      if (semesterGPA <= 5) {
        for (let i = 0; i < predictedCourses.length; i++) {
          const units = parseFloat(predictedCourses[i].units);
          for (const grade of grades) {
            const points = gradePoints[grade] * units;
            predictedCourses[i].grade = grade;
            const newPoints = predictedCourses.reduce(
              (sum, course) => sum + gradePoints[course.grade] * parseFloat(course.units),
              0
            );
            const newCGPA = (newPoints + currentPoints) / (prevUnits + totalUnits);
            if (newCGPA >= expCGPA - 0.01 && newCGPA <= 5.0) {
              break; // Keep this grade and stop
            }
          }
          // If no grade meets target, assign A and continue
          if (predictedCourses[i].grade === 'F') {
            predictedCourses[i].grade = 'A';
          }
          // Check if overall CGPA is met
          const currentPointsTotal = predictedCourses.reduce(
            (sum, course) => sum + gradePoints[course.grade] * parseFloat(course.units),
            0
          );
          const currentCGPA = (currentPointsTotal + currentPoints) / (prevUnits + totalUnits);
          if (currentCGPA >= expCGPA - 0.01) break;
        }
      } else {
        // If semesterGPA > 5, assign all A's
        predictedCourses = sortedCourses.map((course) => ({ ...course, grade: 'A' }));
      }
    }

    // Verify total points
    const actualPoints = predictedCourses.reduce(
      (sum, course) => sum + gradePoints[course.grade] * parseFloat(course.units),
      0
    );
    const actualSemesterGPA = (actualPoints / totalUnits).toFixed(2);
    const actualOverallCGPA = (
      (currCGPA * prevUnits + actualPoints) / (prevUnits + totalUnits)
    ).toFixed(2);

    // Navigate to Predict CGPA Result
    navigate('/predict-cgpa-result', {
      state: {
        expectedCGPA,
        semesterGPA: actualSemesterGPA,
        overallCGPA: actualOverallCGPA,
        predictedCourses,
      },
    });
  };

  return (
    <div className="flex flex-col p-5 font-dm-sans min-h-[calc(844px-40px)]">
      {/* Header */}
      <div className="flex items-center mb-4">
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
          <span className="text-lg">CGPA Predictor</span>
        </div>
      </div>

      {/* Expected CGPA Field */}
      <div className="mb-4">
        <div className="w-[105px] h-[22px] mb-1">
          <span className="text-sm">Expected CGPA</span>
        </div>
        <input
          type="number"
          value={expectedCGPA}
          onChange={(e) => setExpectedCGPA(e.target.value)}
          className="w-[350px] h-[52px] bg-gray-200 text-black rounded-lg px-3 text-sm"
          placeholder="Enter expected CGPA (0.00-5.00)"
          step="0.01"
          min="0"
          max="5"
        />
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
          placeholder="Enter current CGPA (optional, 0.00-5.00)"
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
            className="w-[350px] h-[240px] bg-gray-100 rounded-lg mb-4 p-4 relative"
          >
            <div className="w-[100px] h-[22px] mb-2">
              <span className="text-base font-medium">Course {course.id}</span>
            </div>
            {courses.length > 1 && (
              <button
                onClick={() => setLocalCourses(courses.filter((c) => c.id !== course.id))}
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
                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                className="w-[310px] h-[52px] bg-gray-200 text-black rounded-lg px-3 text-sm"
                placeholder="Enter course name"
              />
            </div>
            {/* Number of Units */}
            <div>
              <div className="w-[105px] h-[22px] mb-1">
                <span className="text-sm">Number of units</span>
              </div>
              <input
                type="number"
                value={course.units}
                onChange={(e) => updateCourse(course.id, 'units', e.target.value)}
                className="w-[310px] h-[52px] bg-gray-200 text-black rounded-lg px-3 text-sm"
                placeholder="Enter units (positive number)"
                min="0"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Predict and Add Course Buttons */}
      <div className="flex flex-col items-center mt-4 gap-4">
        <button
          onClick={predictCGPA}
          className="w-[346px] h-[44px] bg-[#8f1402] rounded-lg flex items-center justify-center"
        >
          <span className="text-white text-base">Predict CGPA</span>
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