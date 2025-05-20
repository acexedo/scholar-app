import { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [overallCGPA, setOverallCGPA] = useState(() => localStorage.getItem('overallCGPA') || '0.00');
  const [currentCGPA, setCurrentCGPA] = useState(() => localStorage.getItem('currentCGPA') || '0.00');
  const [projectedGPA, setProjectedGPA] = useState(() => localStorage.getItem('projectedGPA') || '0.00');
  const [courses, setCourses] = useState(() => JSON.parse(localStorage.getItem('courses')) || []);

  useEffect(() => {
    localStorage.setItem('overallCGPA', overallCGPA);
    localStorage.setItem('currentCGPA', currentCGPA);
    localStorage.setItem('projectedGPA', projectedGPA);
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [overallCGPA, currentCGPA, projectedGPA, courses]);

  return (
    <AppContext.Provider
      value={{
        overallCGPA,
        setOverallCGPA,
        currentCGPA,
        setCurrentCGPA,
        projectedGPA,
        setProjectedGPA,
        courses,
        setCourses,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}