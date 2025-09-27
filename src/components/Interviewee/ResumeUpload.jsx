import React, { useState } from 'react';
import { parseResume } from '../../utils/resumeParser';

/**
 * A component that allows users to upload a resume file.
 * @param {object} props
 * @param {function(object): void} props.onUploadSuccess - Callback function executed on successful parse.
 */
const ResumeUpload = ({ onUploadSuccess }) => {
  const [error, setError] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Basic file type validation
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are accepted. Please upload a .pdf file.');
      return;
    }
    
    setError('');
    setIsParsing(true);

    try {
      // Call our utility function to parse the resume.
      const extractedInfo = await parseResume(file);
      // If successful, call the function passed in props with the extracted data.
      onUploadSuccess(extractedInfo);
    } catch (err) {
      // If parsing fails, display the error message.
      setError(err.toString());
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="resume-upload">
      <h2>Begin Your Interview</h2>
      <p>Upload your resume to get started. We'll extract your name, email, and phone number.</p>
      
      <input 
        type="file" 
        accept=".pdf" 
        onChange={handleFileChange} 
        disabled={isParsing} 
      />

      {isParsing && <p>Parsing your resume, please wait...</p>}
      
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ResumeUpload;