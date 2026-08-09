import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';

const apiKey = env.GEMINI_API_KEY;
let aiClient: GoogleGenerativeAI | null = null;

if (apiKey) {
  try {
    aiClient = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.warn('Gemini client initialization warning:', err);
  }
}

// Helper to clean JSON markdown wrappers ```json ... ```
const parseJsonResponse = (rawText: string) => {
  try {
    const cleaned = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse Gemini JSON output:', rawText);
    throw new Error('Invalid JSON format from AI response');
  }
};

export const geminiService = {
  // 1. Generate AI Study Plan
  async generateStudyPlan(data: any) {
    const prompt = `
You are an expert academic tutor and AI study scheduler.
Generate a structured, optimal multi-day study schedule for the student using ONLY the following data:

Student Data:
- Daily Available Hours: ${data.dailyAvailableHours || 4} hours/day
- Preferred Study Time: ${data.preferredStudyTime || 'Evening'}
- Comfort Feedback / Mood: ${data.comfortFeeling || 'Normal'}, Workload Difficulty: ${data.comfortDifficulty || 'Moderate'}
- Subjects: ${JSON.stringify(data.subjects || [])}
- Weak Topics: ${JSON.stringify(data.weakTopics || [])}
- Upcoming Exams: ${JSON.stringify(data.exams || [])}
- Study Goals: ${JSON.stringify(data.goals || [])}

STRICT SCHEDULING CONSTRAINTS:
1. NEVER exceed the student's daily available study limit of ${data.dailyAvailableHours || 4} hours.
2. Prioritize upcoming exams with closest dates first.
3. Prioritize topics flagged as "Weak" or low progress.
4. Include realistic breaks between tasks.
5. Provide task types: "Study", "Revision", or "Practice".
6. If the student selected mood "Tired" or "Overwhelmed", generate a lighter schedule with shorter blocks and more revision/breaks.
7. Return ONLY valid raw JSON with NO markdown or explanations outside the JSON object.

JSON Schema format:
{
  "planTitle": "AI Custom Study Plan",
  "summary": "Short study plan rationale summary",
  "plan": [
    {
      "date": "YYYY-MM-DD",
      "totalHours": 3.5,
      "tasks": [
        {
          "subject": "Subject Name",
          "topic": "Topic Name",
          "type": "Study",
          "startTime": "18:00",
          "durationMinutes": 60,
          "priority": "High",
          "reason": "Exam in 12 days & topic marked weak"
        }
      ]
    }
  ]
}
`;

    if (!aiClient) {
      return this.getFallbackStudyPlan(data);
    }

    try {
      const model = aiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return parseJsonResponse(text);
    } catch (error) {
      console.error('Gemini generateStudyPlan error, using smart fallback:', error);
      return this.getFallbackStudyPlan(data);
    }
  },

  // 2. Smart Reschedule Missed Tasks
  async rescheduleTasks(data: any) {
    const prompt = `
You are an adaptive AI study planner. The student missed some study tasks.
Reschedule the missed tasks into their upcoming schedule WITHOUT overwhelming their daily limit of ${data.dailyAvailableHours || 4} hours/day.

Missed Tasks: ${JSON.stringify(data.missedTasks || [])}
Upcoming Exams: ${JSON.stringify(data.exams || [])}
Existing Schedule: ${JSON.stringify(data.existingTasks || [])}

Return ONLY raw JSON with schema:
{
  "rescheduledTasks": [
    {
      "originalTaskId": "optional-id",
      "subject": "Subject Name",
      "topic": "Topic Name",
      "newDate": "YYYY-MM-DD",
      "newStartTime": "19:00",
      "durationMinutes": 45,
      "priority": "High",
      "reason": "Rescheduled missed task prior to exam"
    }
  ],
  "advice": "Encouraging advice to catch up cleanly."
}
`;

    if (!aiClient) {
      return this.getFallbackReschedule(data);
    }

    try {
      const model = aiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return parseJsonResponse(result.response.text());
    } catch (error) {
      console.error('Gemini rescheduleTasks error:', error);
      return this.getFallbackReschedule(data);
    }
  },

  // 3. Analyze Brain Dump
  async analyzeBrainDump(rawText: string, studentContext: any) {
    const prompt = `
You are an empathetic academic assistant analyzing a student's unstructured brain dump.
Extract key insights, detect priorities, and generate an actionable action plan.

Brain Dump Input:
"${rawText}"

Student Context:
Subjects: ${JSON.stringify(studentContext.subjects || [])}
Exams: ${JSON.stringify(studentContext.exams || [])}

Return ONLY raw JSON with schema:
{
  "aiSummary": "Clear 2-sentence summary of student concerns and mindset",
  "detectedPriorities": [
    { "subject": "Subject Name", "priority": "High", "reason": "Mentions upcoming test and lack of confidence" }
  ],
  "suggestedActions": [
    { "action": "Specific study step", "duration": "45 mins", "recommendedTime": "Today Evening" }
  ],
  "encouragement": "Empathetic, positive academic encouragement"
}
`;

    if (!aiClient) {
      return this.getFallbackBrainDump(rawText);
    }

    try {
      const model = aiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return parseJsonResponse(result.response.text());
    } catch (error) {
      console.error('Gemini analyzeBrainDump error:', error);
      return this.getFallbackBrainDump(rawText);
    }
  },

  // 4. Generate Interactive AI Quiz
  async generateQuiz(subject: string, topic: string, questionCount: number, difficulty: string) {
    const prompt = `
You are an expert academic test creator. Create a ${questionCount}-question multiple-choice quiz on:
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

STRICT QUIZ CONSTRAINTS:
1. Each question must have exactly 4 options labeled "A", "B", "C", "D".
2. Include the exact "correctAnswer" option key ("A", "B", "C", or "D").
3. Include a clear educational "explanation" for why that answer is correct.
4. Return ONLY valid raw JSON with NO markdown or extra text.

JSON Schema:
{
  "subject": "${subject}",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": 1,
      "question": "Question text...",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": "B",
      "explanation": "Detailed step-by-step explanation..."
    }
  ]
}
`;

    if (!aiClient) {
      return this.getFallbackQuiz(subject, topic, questionCount, difficulty);
    }

    try {
      const model = aiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return parseJsonResponse(result.response.text());
    } catch (error) {
      console.error('Gemini generateQuiz error:', error);
      return this.getFallbackQuiz(subject, topic, questionCount, difficulty);
    }
  },

  // 5. Chat with AI Study Assistant
  async chatWithAssistant(message: string, history: any[], studentContext: any) {
    const prompt = `
You are the AI Study Assistant for AI Study Planner, a friendly, encouraging, and highly knowledgeable academic tutor.
Assist the student with clear, concise, and structured guidance.

Student Context:
Name: ${studentContext.name || 'Student'}
Department: ${studentContext.department || 'General Science'}
Subjects: ${JSON.stringify(studentContext.subjects || [])}
Weak Topics: ${JSON.stringify(studentContext.weakTopics || [])}

User Message: "${message}"

Keep response concise (under 250 words), educational, formatted in markdown with bullet points where appropriate.
`;

    if (!aiClient) {
      return { response: `Here is guidance for "${message}": Break down the topic into 20-minute practice blocks, review key formulas, and test yourself with 3 practice problems.` };
    }

    try {
      const model = aiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return { response: result.response.text() || 'I am ready to help you with your studies.' };
    } catch (error) {
      console.error('Gemini chat error:', error);
      return { response: 'AI study assistant is operating in offline mode. For best results, review your weak topics in Mathematics and Physics.' };
    }
  },

  // 6. Smart Learning Concept Breakdown
  async explainTopic(subject: string, topic: string, confidence: string) {
    const prompt = `
You are a professor explaining the topic "${topic}" in subject "${subject}".
The student confidence level is "${confidence}".

Provide a structured educational summary formatted in JSON with schema:
{
  "explanation": "Clear 3-paragraph conceptual explanation adapted for ${confidence} level",
  "keyConcepts": ["Concept 1", "Concept 2", "Concept 3"],
  "formulasOrExamples": ["Key formula or real-world example 1", "Example 2"],
  "studyStrategy": "Actionable strategy to master this topic",
  "revisionTips": ["Tip 1", "Tip 2"]
}
`;

    if (!aiClient) {
      return {
        explanation: `The topic ${topic} in ${subject} forms a cornerstone of the syllabus. Understanding fundamental principles ensures smooth problem-solving under exam conditions.`,
        keyConcepts: ["Fundamental Definitions", "Core Formulas & Derivations", "Application Problems"],
        formulasOrExamples: ["Standard Formula: f(x) = dx/dt", "Example: Real-world modeling"],
        studyStrategy: "Spend 30 minutes reading concepts followed by 30 minutes solving practice problems.",
        revisionTips: ["Create flashcards for formulas", "Re-solve missed quiz questions"]
      };
    }

    try {
      const model = aiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return parseJsonResponse(result.response.text());
    } catch (error) {
      return {
        explanation: `Topic breakdown for ${topic} in ${subject}.`,
        keyConcepts: ["Key Theorem", "Proof & Method", "Edge Cases"],
        formulasOrExamples: ["Formula 1", "Example Problem"],
        studyStrategy: "Focus on understanding derivations step-by-step.",
        revisionTips: ["Review every 3 days"]
      };
    }
  },

  // Fallback Data Generators
  getFallbackStudyPlan(data: any) {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    return {
      planTitle: "AI Optimized Study Schedule",
      summary: "Prioritized Mathematics and Physics based on upcoming exam dates and weak topic confidence ratings.",
      plan: [
        {
          date: today,
          totalHours: 3.5,
          tasks: [
            {
              subject: "Mathematics",
              topic: "Integration by Parts & Substitution",
              type: "Study",
              startTime: "17:00",
              durationMinutes: 60,
              priority: "High",
              reason: "Exam in 12 days and marked as weak confidence"
            },
            {
              subject: "Physics",
              topic: "Quantum Wave Equations",
              type: "Revision",
              startTime: "18:15",
              durationMinutes: 45,
              priority: "High",
              reason: "Spaced repetition revision due"
            },
            {
              subject: "Artificial Intelligence",
              topic: "Backpropagation & Gradient Descent",
              type: "Practice",
              startTime: "19:15",
              durationMinutes: 60,
              priority: "Medium",
              reason: "Problem solving and code practice"
            }
          ]
        },
        {
          date: tomorrow,
          totalHours: 3.0,
          tasks: [
            {
              subject: "Database Management Systems",
              topic: "ACID Transactions & Concurrency",
              type: "Study",
              startTime: "17:30",
              durationMinutes: 60,
              priority: "Medium",
              reason: "Core syllabus coverage"
            },
            {
              subject: "Mathematics",
              topic: "Linear Algebra Eigenvalues",
              type: "Practice",
              startTime: "18:45",
              durationMinutes: 60,
              priority: "High",
              reason: "Exam practice set"
            }
          ]
        }
      ]
    };
  },

  getFallbackReschedule(data: any) {
    const nextDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    return {
      rescheduledTasks: [
        {
          subject: "Physics",
          topic: "Quantum Wave Equations",
          newDate: nextDate,
          newStartTime: "16:00",
          durationMinutes: 45,
          priority: "High",
          reason: "Rescheduled missed revision session"
        }
      ],
      advice: "Keep consistent! Shifting tasks smoothly prevents last-minute cramming."
    };
  },

  getFallbackBrainDump(rawText: string) {
    return {
      aiSummary: "You expressed anxiety regarding upcoming Mathematics and Physics exams while balancing limited daily study hours.",
      detectedPriorities: [
        { subject: "Mathematics", priority: "High", reason: "Integration incomplete with exam in 12 days" },
        { subject: "Physics", priority: "High", reason: "Quantum mechanics topics pending" }
      ],
      suggestedActions: [
        { action: "Solve 5 Integration by Parts problems", duration: "45 mins", recommendedTime: "Today 17:00" },
        { action: "Review Quantum Wave Equation formula sheet", duration: "30 mins", recommendedTime: "Today 18:15" }
      ],
      encouragement: "You have plenty of time if you stick to 3.5 hours of focused study per day. You've got this!"
    };
  },

  getFallbackQuiz(subject: string, topic: string, count: number, difficulty: string) {
    return {
      subject,
      topic,
      difficulty,
      questions: [
        {
          id: 1,
          question: `What is the fundamental integration technique used for the product of two functions u(x) and v'(x)?`,
          options: [
            "A) Integration by Parts (∫ u dv = uv - ∫ v du)",
            "B) Partial Fraction Decomposition",
            "C) Trigonometric Substitution",
            "D) L'Hôpital's Rule"
          ],
          correctAnswer: "A",
          explanation: "Integration by parts is derived from the product rule of differentiation: d(uv)/dx = u'v + uv'."
        },
        {
          id: 2,
          question: `In calculus, what does the definite integral of a positive function f(x) from a to b represent geometrically?`,
          options: [
            "A) The slope of the tangent line at x = a",
            "B) The net area under the curve between x = a and x = b",
            "C) The second derivative of the function",
            "D) The perimeter of the region"
          ],
          correctAnswer: "B",
          explanation: "The definite integral ∫[a to b] f(x) dx computes the exact area under the curve f(x) bound by x=a and x=b."
        },
        {
          id: 3,
          question: `Which constant of integration is added to the result of an indefinite integral?`,
          options: [
            "A) π",
            "B) e",
            "C) + C (Arbitrary Constant)",
            "D) 0"
          ],
          correctAnswer: "C",
          explanation: "Because the derivative of a constant is 0, antiderivatives include an arbitrary constant + C."
        },
        {
          id: 4,
          question: `Which method is best suited for integrating standard expressions of the form f(g(x)) * g'(x)?`,
          options: [
            "A) Integration by Substitution (u-substitution)",
            "B) Euler's Method",
            "C) Taylor Series Expansion",
            "D) Matrix Inversion"
          ],
          correctAnswer: "A",
          explanation: "u-substitution reverses the chain rule by setting u = g(x), so du = g'(x) dx."
        },
        {
          id: 5,
          question: `What is the integral of 1/x with respect to x?`,
          options: [
            "A) x^2 / 2",
            "B) ln|x| + C",
            "C) e^x",
            "D) -1 / x^2"
          ],
          correctAnswer: "B",
          explanation: "The antiderivative of 1/x is the natural logarithm ln|x| + C for x ≠ 0."
        }
      ].slice(0, count)
    };
  }
};
