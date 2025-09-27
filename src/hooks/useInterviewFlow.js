import { useState, useEffect } from 'react';
import useInterviewStore from '../store/interviewStore';
import { generateDynamicQuestion, getAIEvaluation, getAISummary } from '../api/gemini';

/**
 * Manages the interview chat flow with a robust, linear logic to ensure
 * only one question is processed at a time.
 */
const useInterviewFlow = () => {
  const { activeInterview, submitAnswer, completeInterview } = useInterviewStore();
  
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const currentQuestionIndex = activeInterview.currentQuestionIndex;
  const isCompleted = activeInterview.status === 'completed';

  useEffect(() => {
    const startInterview = async () => {
      if (activeInterview.status === 'in-progress' && messages.length === 0) {
        setIsLoading(true);
        setMessages([{ sender: 'ai', text: `Hello ${activeInterview.name}! The interview will now begin.` }]);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const question = await generateDynamicQuestion(0, []);
        setCurrentQuestion(question);
        setMessages(prev => [...prev, { sender: 'ai', text: question.text }]);
        setIsLoading(false);
      }
    };
    startInterview();
  }, [activeInterview.status, activeInterview.name]);


  /**
   * Handles submitting an answer and fetching the NEXT question.
   */
  const handleAnswerSubmit = async (answer) => {
    if (!answer.trim() || isLoading) return;

    // --- STEP 1: UI Update & State Lock ---
    setMessages(prev => [...prev, { sender: 'user', text: answer }]);
    setUserInput('');
    setIsLoading(true);
    setCurrentQuestion(null);

    // --- STEP 2: Process the Answer ---
    const questionText = activeInterview.answers[currentQuestionIndex]?.question || currentQuestion.text;
    const evaluation = await getAIEvaluation(questionText, answer);
    const answerData = { question: questionText, answer, ...evaluation };
    submitAnswer(answerData);

    // --- STEP 3: Decide What's Next ---
    const nextQuestionIndex = currentQuestionIndex + 1;

    if (nextQuestionIndex < 6) {
      const existingQuestions = [...activeInterview.answers.map(a => a.question), questionText];
      const nextQuestion = await generateDynamicQuestion(nextQuestionIndex, existingQuestions);
      
      setCurrentQuestion(nextQuestion);
      setMessages(prev => [...prev, { sender: 'ai', text: nextQuestion.text }]);
    } else {
      const finalInterviewData = { ...activeInterview, answers: [...activeInterview.answers, answerData], score: activeInterview.score + evaluation.score };
      const summary = await getAISummary(finalInterviewData);
      setMessages(prev => [...prev, { sender: 'ai', text: "Thank you! The interview is now complete." }]);
      completeInterview(summary);
    }

    // --- STEP 4: Unlock the UI ---
    setIsLoading(false);
  };

  return { messages, currentQuestion, userInput, setUserInput, isLoading, isCompleted, handleAnswerSubmit };
};

export default useInterviewFlow;