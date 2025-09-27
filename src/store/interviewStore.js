import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useInterviewStore = create(
  persist(
    (set, get) => ({
      candidates: [],
      activeInterview: {
        candidateId: null,
        status: 'pending',
        name: '',
        email: '',
        phone: '',
        currentQuestionIndex: 0,
        answers: [],
        score: 0,
        summary: null, // Changed to null to accommodate an object
      },
      
      startNewInterview: () => {
        set({
          activeInterview: {
            candidateId: `candidate-${Date.now()}`,
            status: 'pending', name: '', email: '', phone: '',
            currentQuestionIndex: 0, answers: [], score: 0, summary: null,
          },
        });
      },

      updateCandidateInfo: (info) => {
        set((state) => ({
          activeInterview: { 
            ...state.activeInterview, 
            ...info, 
          },
        }));
      },

      startInterviewProcess: () => {
        set((state) => ({
          activeInterview: { ...state.activeInterview, status: 'in-progress' },
        }));
      },

      // Handles the full evaluation object: { question, answer, score, reasoning }
      submitAnswer: (answerData) => {
        set((state) => ({
          activeInterview: {
            ...state.activeInterview,
            answers: [...state.activeInterview.answers, answerData], 
            currentQuestionIndex: state.activeInterview.currentQuestionIndex + 1,
            score: state.activeInterview.score + answerData.score,
          },
        }));
      },

      // Handles the full summary object: { summary, strengths, ... }
      completeInterview: (summaryData) => {
        const finalInterviewState = { 
          ...get().activeInterview, 
          status: 'completed', 
          summary: summaryData, 
        };
        
        set((state) => ({
          candidates: [...state.candidates.filter(c => c.candidateId !== finalInterviewState.candidateId), finalInterviewState],
          activeInterview: {
            candidateId: null, status: 'pending', name: '', email: '', phone: '',
            currentQuestionIndex: 0, answers: [], score: 0, summary: null,
          },
        }));
      },
      
      resetActiveInterview: () => {
         set({
          activeInterview: {
            candidateId: `candidate-${Date.now()}`, status: 'pending', name: '', email: '', phone: '',
            currentQuestionIndex: 0, answers: [], score: 0, summary: null,
          },
        });
      }
    }),
    {
      name: 'crisp-interview-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useInterviewStore;