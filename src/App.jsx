import React, { useState, useEffect } from 'react';
import Simulator from './components/Simulator';
import Dashboard from './components/Dashboard';

// 1. Full-Coverage Unified Question Bank Mapping
const OPENING_QUESTIONS = {
  // Sales Tracks
  "Selling Cloud Storage to a Skeptical CTO": 
    "Hello. I am the CTO. We already use local physical servers. Why should we risk switching to your cloud service? Our IT budget is incredibly tight.",
  
  "Pitching Enterprise HR Software to a VP of Talent": 
    "Hello, thanks for hopping on. Our current onboarding process is manual but it works. Why should we invest a huge setup fee to transition to your HR software platform?",

  // Core Tech Track
  "Java / Python Software Developer Interview": 
    "Welcome to your core software engineering technical round. Let's start with object-oriented fundamentals: Can you explain how you use inheritance and polymorphism to design reusable code, and how memory allocation differs between stack and heap space?",

  // MERN Stack / Web Track
  "MERN Stack / Full Stack Web Developer Interview": 
    "Thanks for coming in. Looking at our application layer architecture, can you explain how you optimize database query speeds and manage state persistence across the client-server boundary in a high-traffic MERN stack deployment?",

  // Database Track
  "Database Administrator (DBMS) Technical Round": 
    "Welcome to your technical interview. Let's start with a foundational architectural scenario: How would you decide whether to back our new analytics platform using a relational SQL database versus a document-oriented NoSQL cluster?",

  // HR / Behavioral Track
  "HR Round: Behavioral & Situational Assessment": 
    "Hello! It's great to meet you. This round will focus on your soft skills and team compatibility. Can you tell me about a time you encountered a strict project deadline during your college terms, and how you managed your schedule to deliver it successfully?"
};

function App() {
  const [email, setEmail] = useState('yash@test.com');
  const [scenario, setScenario] = useState('Selling Cloud Storage to a Skeptical CTO');
  
  // 2. Initialize transcript dynamically matching the starting state key
  const [transcript, setTranscript] = useState([
    { role: 'prospect', text: OPENING_QUESTIONS['Selling Cloud Storage to a Skeptical CTO'] }
  ]);
  
  const [evaluation, setEvaluation] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);

  // API Call: Fetch performance aggregation telemetry benchmarks
  const fetchAnalytics = async () => {
  try {
    const response = await fetch(`/api/simulations/analytics`); // Note the leading slash
    const json = await response.json();
    if (json.success) setAnalytics(json.data);
  } catch (err) {
    console.error('Error fetching analytics:', err);
  }
};

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // 3. React Effect Engine: Listens for user dropdown swaps to switch roles cleanly
  useEffect(() => {
    setTranscript([
      { role: 'prospect', text: OPENING_QUESTIONS[scenario] || "Hello, let's begin our session." }
    ]);
    setEvaluation(null); // Instantly clears previous evaluation reports upon change
  }, [scenario]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans p-6 flex flex-col items-center">
      
      {/* Platform Branding Header */}
      <header className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">
          PitchCraft.ai 🚀
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Train account executives and developers against custom customer and technical roles, tracking persistent metrics via cloud aggregation pipelines.
        </p>
      </header>

      {/* Simulator Interface Module */}
      <Simulator 
        email={email} setEmail={setEmail}
        scenario={scenario} setScenario={setScenario}
        transcript={transcript} setTranscript={setTranscript}
        evaluation={evaluation} setEvaluation={setEvaluation}
        loading={loading} setLoading={setLoading}
        fetchAnalytics={fetchAnalytics}
      />

      {/* Analytics Dashboard Matrix Module */}
      <Dashboard analytics={analytics} fetchAnalytics={fetchAnalytics} />
      
    </div>
  );
}

export default App;