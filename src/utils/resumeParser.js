import * as pdfjsLib from 'pdfjs-dist';

// We need to provide the worker script's location.
// This is a standard setup step for pdfjs-dist in bundlers like Vite.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

/**
 * Parses a PDF file to extract text content and attempts to find key information.
 * @param {File} file - The PDF file object from an input element.
 * @returns {Promise<object>} A promise that resolves to an object with extracted info.
 */
export const parseResume = async (file) => {
  // Use a FileReader to read the file's content as a binary buffer.
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async (event) => {
      try {
        const typedarray = new Uint8Array(event.target.result);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        
        let fullText = '';
        // Iterate through each page of the PDF.
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          // Concatenate the text from all pages.
          fullText += textContent.items.map(s => s.str).join(' ');
        }
        
        // --- Information Extraction using Regular Expressions ---
        // NOTE: These are basic regex patterns and may not work for all resume formats.
        // A robust solution would involve more advanced NLP techniques.

        const nameMatch = fullText.match(/([A-Z][a-z]+)\s([A-Z][a-z'-]+)/);
        const emailMatch = fullText.match(/[\w.-]+@[\w.-]+\.\w+/);
        // This regex looks for common US phone number formats.
        const phoneMatch = fullText.match(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);

        // Resolve the promise with the found information, or empty strings if not found.
        resolve({
          name: nameMatch ? nameMatch[0] : '',
          email: emailMatch ? emailMatch[0] : '',
          phone: phoneMatch ? phoneMatch[0] : '',
        });
      } catch (error) {
        console.error('Error parsing PDF:', error);
        reject('Sorry, we could not read the PDF file. Please try another one.');
      }
    };

    reader.onerror = () => {
        reject('Failed to read the file.');
    };

    // Start reading the file.
    reader.readAsArrayBuffer(file);
  });
};