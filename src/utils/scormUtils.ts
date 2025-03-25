
/**
 * Basic SCORM 1.2/2004 API functions
 */

// Define window with SCORM properties
declare global {
  interface Window {
    API?: ScormAPI;
    API_1484_11?: ScormAPI;
  }
}

// Define the type for SCORM API
interface ScormAPI {
  Initialize: (param: string) => string;
  Terminate: (param: string) => string;
  GetValue: (element: string) => string;
  SetValue: (element: string, value: string) => string;
  Commit: (param: string) => string;
  GetLastError: () => string;
  GetErrorString: (errorCode: string) => string;
  GetDiagnostic: (errorCode: string) => string;
}

// Variable to hold the SCORM API instance
let scormAPI: ScormAPI | null = null;
let isScormInitialized = false;

/**
 * Find the SCORM API adapter
 */
const findScormAPI = (): ScormAPI | null => {
  let win = window as Window;
  let scorm = null;
  let findAttempts = 0;
  const maxAttempts = 10;
  
  // Search for the SCORM API, working up through the window hierarchy
  while (!scorm && win && findAttempts < maxAttempts) {
    findAttempts++;
    
    // Check SCORM 1.2 API
    if (win.API) {
      scorm = win.API;
    } 
    // Check SCORM 2004 API
    else if (win.API_1484_11) {
      scorm = win.API_1484_11;
    } 
    // Try parent window
    else if (win.parent && win.parent !== win) {
      win = win.parent;
    } 
    // No more parents, exit
    else {
      break;
    }
  }
  
  return scorm;
};

/**
 * Initialize SCORM communication
 */
export const initializeScorm = (): boolean => {
  // If already initialized, don't do it again
  if (isScormInitialized) return true;
  
  try {
    // First find the API
    scormAPI = findScormAPI();
    
    if (!scormAPI) {
      console.log('SCORM API not found - continuing in non-SCORM mode');
      return false;
    }
    
    // Initialize the connection
    const result = scormAPI.Initialize("");
    
    if (result === "true" || result === "1") {
      console.log('SCORM API initialized successfully');
      isScormInitialized = true;
      
      // Set some initial values
      scormAPI.SetValue("cmi.core.lesson_status", "incomplete");
      scormAPI.SetValue("cmi.core.score.min", "0");
      scormAPI.SetValue("cmi.core.score.max", "100");
      scormAPI.Commit("");
      
      // Add event listener for unload
      window.addEventListener('beforeunload', () => {
        if (scormAPI) {
          // Set final status when user leaves the page
          const visitedAllSections = sessionStorage.getItem('portfolio_all_sections_visited');
          if (visitedAllSections === 'true') {
            scormAPI.SetValue("cmi.core.lesson_status", "completed");
            scormAPI.SetValue("cmi.core.score.raw", "100");
          } else {
            scormAPI.SetValue("cmi.core.lesson_status", "incomplete");
            scormAPI.SetValue("cmi.core.score.raw", "50");
          }
          scormAPI.Commit("");
          scormAPI.Terminate("");
        }
      });
      
      return true;
    } else {
      console.error('SCORM API initialization failed');
      return false;
    }
  } catch (error) {
    console.error('Error initializing SCORM:', error);
    return false;
  }
};

/**
 * Track user progress for SCORM
 * @param section The section being visited
 */
export const trackSectionVisit = (section: string): void => {
  if (!scormAPI) return;
  
  try {
    // Get previously visited sections from session storage
    const visitedSections = JSON.parse(sessionStorage.getItem('portfolio_visited_sections') || '[]');
    
    // Add current section if not already visited
    if (!visitedSections.includes(section)) {
      visitedSections.push(section);
      sessionStorage.setItem('portfolio_visited_sections', JSON.stringify(visitedSections));
      
      // Update SCORM with progress percentage
      const requiredSections = ['home', 'projects', 'contact'];
      const visitedRequired = requiredSections.filter(req => visitedSections.includes(req));
      const progressPercentage = Math.round((visitedRequired.length / requiredSections.length) * 100);
      
      scormAPI.SetValue("cmi.core.score.raw", progressPercentage.toString());
      
      // Mark as complete if all required sections are visited
      if (visitedRequired.length === requiredSections.length) {
        sessionStorage.setItem('portfolio_all_sections_visited', 'true');
        scormAPI.SetValue("cmi.core.lesson_status", "completed");
      }
      
      scormAPI.Commit("");
      console.log(`SCORM: Tracked visit to ${section}, progress: ${progressPercentage}%`);
    }
  } catch (error) {
    console.error('Error tracking section visit:', error);
  }
};

/**
 * Set completion status in SCORM
 */
export const setScormCompletion = (completed: boolean): void => {
  if (!scormAPI) return;
  
  try {
    scormAPI.SetValue("cmi.core.lesson_status", completed ? "completed" : "incomplete");
    scormAPI.Commit("");
  } catch (error) {
    console.error('Error setting SCORM completion:', error);
  }
};

/**
 * Set a score in SCORM
 */
export const setScormScore = (score: number): void => {
  if (!scormAPI) return;
  
  try {
    scormAPI.SetValue("cmi.core.score.raw", score.toString());
    scormAPI.Commit("");
  } catch (error) {
    console.error('Error setting SCORM score:', error);
  }
};

/**
 * Terminate SCORM connection
 */
export const terminateScorm = (): void => {
  if (!scormAPI) return;
  
  try {
    scormAPI.Terminate("");
    scormAPI = null;
    isScormInitialized = false;
  } catch (error) {
    console.error('Error terminating SCORM:', error);
  }
};
