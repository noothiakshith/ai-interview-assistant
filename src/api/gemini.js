import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * A robust function to call the Gemini model and handle JSON parsing.
 * @param {string} prompt - The text prompt to send to the AI.
 * @returns {Promise<any>} The AI's generated response, parsed as an object if JSON.
 */
async function callGemini(prompt, expectJson = false) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (expectJson) {
      // The model might wrap the JSON in markdown backticks, so we clean it.
      const cleanedText = text.replace(/^```json\n?/, '').replace(/```$/, '');
      return JSON.parse(cleanedText);
    }
    return text; // Return raw text if not expecting JSON

  } catch (error) {
    console.error("Gemini API call failed:", error);
    // Return a structured error that the UI can handle gracefully.
    if (expectJson) {
      return { error: "AI response error. Please try again." };
    }
    return "Error: Could not get a response from the AI.";
  }
}

// --- Specific API Functions with Advanced Prompts ---

const difficulties = ["Easy", "Easy", "Medium", "Medium", "Hard", "Hard"];
const times = { Easy: 20, Medium: 60, Hard: 120 };

/**
 * Generates a high-quality interview question.
 */
export async function generateDynamicQuestion(index, existingQuestions) {
  const difficulty = difficulties[index];
  const prompt = `
    You are a Senior Staff Engineer conducting an interview for a Full Stack (React/Node.js) role.
    Your task is to generate a single, ${difficulty}-level interview question.
    The question should test practical application and deep understanding, not just trivia.
    
    Ensure the question is substantially different from these already asked questions:
    <ALREADY_ASKED>
    ${existingQuestions.length > 0 ? existingQuestions.join('\n- ') : "None"}
    </ALREADY_ASKED>

    Return ONLY the question text itself. Do not include any preamble, context, or quotation marks.
  `;

  const questionText = await callGemini(prompt);
  return {
    text: questionText.trim(),
    difficulty: difficulty,
    time: times[difficulty],
  };
}

/**
 * Evaluates an answer using a detailed rubric and returns a structured JSON object.
 */
export async function getAIEvaluation(question, answer) {
  const prompt = `
    You are an expert Senior Interviewer providing a strict, fair evaluation of a candidate's answer.

    **Your Task:**
    Evaluate the candidate's answer based on the provided question and the scoring rubric below.

    **Scoring Rubric:**
    - **0-2:** Completely incorrect, irrelevant, or no answer provided.
    - **3-4:** Showed a tiny bit of understanding but fundamentally flawed.
    - **5-6:** Partially correct but has significant gaps or misconceptions. A junior-level answer.
    - **7-8:** Mostly correct and well-explained. Shows solid understanding. A mid-level answer.
    - **9-10:** A perfect, comprehensive, and clear answer. May include nuance, trade-offs, or code examples. A senior-level answer.

    **Input:**
    <QUESTION>
    ${question}
    </QUESTION>
    <ANSWER>
    ${answer}
    </ANSWER>

    **Output Format:**
    You MUST return your response as a single, valid JSON object with two keys: "score" (a number) and "reasoning" (a brief, one-sentence justification for the score).
    
    Example:
    {"score": 8, "reasoning": "The candidate correctly explained React Hooks and provided good examples, showing solid understanding."}
  `;

  const evaluation = await callGemini(prompt, true); // `true` to expect JSON
  
  // Provide a fallback in case the AI fails or returns an error.
  if (evaluation.error || typeof evaluation.score === 'undefined') {
    return { score: 5, reasoning: "Evaluation failed; a default score was assigned." };
  }

  return evaluation;
}

/**
 * Generates a structured final summary of the interview.
 */
export async function getAISummary(interviewData) {
  const transcript = interviewData.answers.map((item, i) => 
    `Question ${i + 1} (${difficulties[i]}): ${item.question}\nAnswer: ${item.answer}\nScore: ${item.score}/10`
  ).join('\n\n');

  const prompt = `
    You are an insightful and fair Hiring Manager reviewing a candidate's interview transcript for a Full Stack role.

    **Your Task:**
    Analyze the full transcript and final score to generate a structured summary of the candidate's performance.

    **Input:**
    <CANDIDATE_NAME>${interviewData.name}</CANDIDATE_NAME>
    <FINAL_SCORE>${interviewData.score} / 60</FINAL_SCORE>
    <TRANSCRIPT>
    ${transcript}
    </TRANSCRIPT>

    **Output Format:**
    You MUST return your response as a single, valid JSON object with three keys:
    1.  "summary": A concise, 2-3 sentence professional summary.
    2.  "strengths": An array of strings listing 1-2 key technical strengths observed.
    3.  "areasForImprovement": An array of strings listing 1-2 constructive areas for improvement.
    
    Example:
    {
      "summary": "The candidate demonstrates a strong grasp of fundamental React concepts and good problem-solving skills. However, their knowledge of Node.js backend topics appears to be less developed. Overall, a promising candidate with clear strengths on the front-end.",
      "strengths": ["React Hooks", "Component Lifecycle"],
      "areasForImprovement": ["Node.js Middleware", "Database Concepts"]
    }
  `;

  const summaryData = await callGemini(prompt, true); // `true` to expect JSON

  // Provide a fallback for the summary
  if (summaryData.error || !summaryData.summary) {
    return {
      summary: "The candidate completed the interview.",
      strengths: [],
      areasForImprovement: []
    };
  }
  return summaryData;
}