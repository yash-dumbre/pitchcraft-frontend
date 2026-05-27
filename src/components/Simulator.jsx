import React, { useState, useEffect } from 'react';

// Global Opening Question Bank Configuration
const OPENING_QUESTIONS = {
  "Selling Cloud Storage to a Skeptical CTO": 
    "Hello. I am the CTO. We already use local physical servers. Why should we risk switching to your cloud service? Our IT budget is incredibly tight.",
  
  "Pitching Enterprise HR Software to a VP of Talent": 
    "Hello, thanks for hopping on. Our current onboarding process is manual but it works. Why should we invest a huge setup fee to transition to your HR software platform?",

  "Java / Python Software Developer Interview": 
    "Welcome to your technical interview. Let's start with a foundational architectural scenario: How would you decide whether to back our new analytics platform using a relational SQL database versus a document-oriented NoSQL cluster?",

  "MERN Stack / Full Stack Web Developer Interview": 
    "Thanks for coming in. Looking at our application layer architecture, can you explain how you optimize database query speeds and manage state persistence across the client-server boundary in a high-traffic MERN stack deployment?",

  "Database Administrator (DBMS) Technical Round":
    "Welcome. In a production cluster running heavy transactional loads, what specific strategies would you use to prevent database deadlocks, and how do you monitor slow-running queries?",

  "HR Round: Behavioral & Situational Assessment":
    "Hello! Let's start with a classic behavioral situation. Tell me about a time you faced a major conflict within a technical project team. How did you handle it, and what was the outcome?"
};

function Simulator({ email, setEmail, scenario, setScenario, transcript, setTranscript, evaluation, setEvaluation, loading, setLoading, fetchAnalytics }) {
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Helper boolean to check if the current scenario is an IT Interview track
  const isInterview = scenario.includes("Interview") || scenario.includes("Technical") || scenario.includes("Assessment");

  //  Automatically update the chat box opening question when the scenario changes
  useEffect(() => {
    const initialQuestion = OPENING_QUESTIONS[scenario] || "Hello, let's begin our session.";
    setTranscript([
      { role: 'prospect', text: initialQuestion }
    ]);
    // Clear out any old score card evaluations from previous selections
    setEvaluation(null); 
  }, [scenario, setScenario, setTranscript, setEvaluation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    // 1. Instantly push your message into the chat UI log
    const updatedWithRep = [...transcript, { role: 'rep', text: chatInput }];
    setTranscript(updatedWithRep);
    const userLatestMsg = chatInput;
    setChatInput('');
    setChatLoading(true);

    try {
      // 2. Fetch the true AI response from your server chat endpoint with correct payloads
      const response = await fetch('http://localhost:5000/api/simulations/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          scenario: scenario, 
          message: userLatestMsg, // Explicitly tell the backend what you typed
          history: updatedWithRep  // Pass down the history context array for Gemini's memory 
        })
      });
      
      const json = await response.json();
      
      if (json.success) {
        // 3. Mount the dynamic live Gemini AI generated reply right into the UI
        setTranscript([...updatedWithRep, { role: 'prospect', text: json.reply }]);
      } else {
        alert("Server responded but could not fetch AI message: " + (json.error || "Unknown Error"));
      }
    } catch (err) {
      console.error('Error hitting chat endpoint:', err);
      alert('Failed connecting to backend chat endpoint. Make sure node server.js is running!');
    } finally {
      setChatLoading(false);
    }
  };

  const handleSubmitPitch = async () => {
    if (transcript.length < 2) {
      alert(isInterview ? "Please answer at least one interview question before submitting!" : "Please send at least one argument before scoring!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/simulations/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, scenario, transcript })
      });
      const json = await response.json();
      if (json.success) {
        setEvaluation({ score: json.data.score, feedback: json.data.feedback });
        if (json.data.transcript) setTranscript(json.data.transcript);
        fetchAnalytics();
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-[#1e293b] rounded-2xl border border-slate-700/50 p-6 shadow-xl mb-6">
      <h2 className="text-xl font-bold mb-4 text-purple-300">
        {isInterview ? "Live IT Mock Interview Simulator " : "Live AI Pitch Simulator "}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            {isInterview ? "Candidate Email" : "Rep Email"}
          </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Active Track Scenario</label>
          <select value={scenario} onChange={(e) => setScenario(e.target.value)} className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500">
            <option value="Selling Cloud Storage to a Skeptical CTO">Selling Cloud Storage to a Skeptical CTO</option>
            <option value="Pitching Enterprise HR Software to a VP of Talent">Pitching Enterprise HR Software to a VP of Talent</option>
            <option value="Java / Python Software Developer Interview">IT Interview: Software Developer (Core Tech)</option>
            <option value="MERN Stack / Full Stack Web Developer Interview">IT Interview: Web Developer (MERN Stack)</option>
            <option value="Database Administrator (DBMS) Technical Round">IT Interview: Database Administrator (SQL/NoSQL)</option>
            <option value="HR Round: Behavioral & Situational Assessment">IT Interview: HR Round (Fresher Behavioral)</option>
          </select>
        </div>
      </div>

      {/* Chat Display Box */}
      <div className="bg-[#0f172a] rounded-xl p-4 min-h-[220px] max-h-[300px] overflow-y-auto mb-4 border border-slate-800 flex flex-col gap-3">
        {transcript.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.role === 'rep' ? 'items-end' : 'items-start'}`}>
            <span className="text-[10px] uppercase font-bold text-slate-500 mb-0.5 px-1">
              {msg.role === 'rep' ? (isInterview ? 'Your Response' : 'Your Sales Argument') : (isInterview ? 'Technical Interviewer' : 'AI Prospect')}
            </span>
            <div className={`text-sm p-3 rounded-xl max-w-[85%] ${msg.role === 'rep' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/40'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {chatLoading && (
          <div className="text-xs text-slate-500 italic px-1 animate-pulse">
            {isInterview ? "Interviewer is analyzing response details..." : "Prospect is formulating a counter-argument..."}
          </div>
        )}
      </div>

      {/* Input Message Form Submission */}
      <form onSubmit={handleSendMessage} className="flex gap-2 mb-4">
        <input 
          type="text" 
          value={chatInput} 
          onChange={(e) => setChatInput(e.target.value)} 
          disabled={chatLoading}
          placeholder={isInterview ? "Provide your detailed technical answer here..." : "Type your strategic sales argument here..."} 
          className="flex-1 bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500 disabled:opacity-50" 
        />
        <button type="submit" disabled={chatLoading} className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 text-white font-semibold text-sm px-5 rounded-xl transition-all">
          Send
        </button>
      </form>

      {/* Global Evaluation Reporting Button Trigger */}
      <button onClick={handleSubmitPitch} disabled={loading} className="w-full bg-[#10b981] hover:bg-[#059669] disabled:bg-slate-700 text-slate-900 font-bold py-3 px-4 rounded-xl text-center transition-all shadow-md">
        {loading 
          ? 'Evaluating Performance Logs via Gemini AI...' 
          : (isInterview ? 'Complete Session & Generate Interview Analytics 📊' : 'Submit Pitch for Performance Scoring 📊')
        }
      </button>

      {/* Evaluation Results Card Render */}
      {evaluation && (
        <div className="mt-6 bg-gradient-to-br from-indigo-900/40 to-slate-900 rounded-2xl border border-indigo-500/30 p-6 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-indigo-300">
              {isInterview ? "AI Interview Feedback Report" : "AI Evaluation Report Card"}
            </h3>
            <div className="bg-indigo-600/30 border border-indigo-400/50 rounded-full px-4 py-1 text-center">
              <span className="text-2xl font-black text-indigo-400">{evaluation.score}/100</span>
            </div>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed bg-[#0f172a]/80 p-4 rounded-xl border border-slate-800">
            <strong className="text-purple-400 block mb-1">Target Feedback:</strong> "{evaluation.feedback}"
          </p>
        </div>
      )}
    </div>
  );
}

export default Simulator;