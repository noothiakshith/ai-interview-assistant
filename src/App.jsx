import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import IntervieweePage from './pages/IntervieweePage';
import InterviewerPage from './pages/InterviewerPage';

// The App component serves as the main layout and router for the application.
function App() {
  return (
    // BrowserRouter (aliased as Router) provides the routing functionality.
    <Router>
      <div className="app-container">
        {/* The header is static and appears on all pages. */}
        <header className="app-header">
          <div className="logo-container">
            <h1>Crisp AI</h1>
          </div>
          {/* The nav contains the links that function as our tabs. */}
          <nav className="app-nav">
            {/* NavLink is a special type of Link that knows whether it is "active".
                We use this to apply a special style to the currently selected tab. */}
            <NavLink 
              to="/" 
              // The `className` prop can be a function to conditionally apply styles.
              // Here, if the link is active, we apply the 'active-link' class from our CSS.
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              Interviewee
            </NavLink>
            <NavLink 
              to="/interviewer" 
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              Interviewer
            </NavLink>
          </nav>
        </header>

        {/* The <main> element will contain the content for the current page. */}
        <main className="app-main">
          {/* The <Routes> component is where we define which component to render for which URL path. */}
          <Routes>
            {/* When the URL path is "/", render the IntervieweePage component. */}
            <Route path="/" element={<IntervieweePage />} />
            
            {/* When the URL path is "/interviewer", render the InterviewerPage component. */}
            <Route path="/interviewer" element={<InterviewerPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;