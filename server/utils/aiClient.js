/**
 * AI Assistant Client
 * Provides contextual scholarship guidance using LLM or local rule-based intelligence.
 * Never throws uncaught exceptions. Non-blocking to core matching flow.
 */

const SYSTEM_PROMPT = `You are Right2Know AI, an intelligent scholarship guidance assistant.
Answer only using the supplied student profile and scholarship information provided in context.
Do not claim that the student is definitely eligible unless the deterministic matching engine marks the scholarship as eligible.
Do not invent scholarship names, amounts, deadlines, eligibility requirements or application links.
If information is unavailable in the provided data, explicitly state that it is not available.
Keep answers concise, actionable, and student-friendly with clear bullet points.`;

/**
 * Generate AI response using configured LLM API or smart offline rule engine
 */
export async function generateScholarshipGuidance({ profile, schemes, question }) {
  const apiKey = process.env.LLM_API_KEY || process.env.GEMINI_API_KEY;
  const provider = (process.env.LLM_PROVIDER || 'gemini').toLowerCase();
  const model = process.env.LLM_MODEL || (provider === 'gemini' ? 'gemini-1.5-flash' : 'gpt-4o-mini');

  // If no external API key is provided, use smart contextual fallback
  if (!apiKey) {
    return generateOfflineContextualAnswer(profile, schemes, question);
  }

  try {
    const contextPrompt = buildContextPrompt(profile, schemes, question);

    if (provider === 'gemini') {
      return await callGeminiAPI(apiKey, model, contextPrompt);
    } else if (provider === 'openai' || provider === 'openrouter') {
      return await callOpenAICompatibleAPI(apiKey, provider, model, contextPrompt);
    } else {
      return await callGeminiAPI(apiKey, model, contextPrompt);
    }
  } catch (error) {
    console.error('AI Service Exception (Handled):', error.message);
    // Graceful fallback on network or API failure
    return generateOfflineContextualAnswer(profile, schemes, question);
  }
}

function buildContextPrompt(profile, schemes, question) {
  const profileSummary = profile
    ? `Student Profile:
- Course: ${profile.course || 'N/A'} (Year ${profile.year || 'N/A'})
- State: ${profile.state || 'N/A'}
- Category: ${profile.category || 'N/A'}
- Family Income: ₹${profile.incomeLakhs || 0} Lakhs/year
- Academic CGPA: ${profile.cgpa || 'N/A'}
- Disability Status: ${profile.hasDisability ? 'Yes' : 'No'}
- Gender: ${profile.gender || 'N/A'}`
    : 'Student Profile: Not specified';

  const schemesSummary = Array.isArray(schemes) && schemes.length > 0
    ? schemes.map((s, i) => `[${i + 1}] ${s.name} (${s.provider})
Benefit: ${s.benefit}
Deadline: ${s.deadline}
Match Score: ${s.matchScore || 'N/A'}%
Reason: ${s.reason || 'N/A'}
Required Documents: ${(s.documents || []).join(', ')}
Apply URL: ${s.applyLink}`).join('\n\n')
    : 'No matched schemes currently in list.';

  return `${SYSTEM_PROMPT}

Context Information:
${profileSummary}

Matched Scholarships:
${schemesSummary}

Student Question:
"${question}"

Provide a helpful, precise answer directly addressing the student's question based on the context above.`;
}

async function callGeminiAPI(apiKey, model, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 600
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidateText) {
      return { success: true, answer: candidateText.trim() };
    }
    throw new Error('Malformed Gemini response format');
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

async function callOpenAICompatibleAPI(apiKey, provider, model, prompt) {
  const baseUrl = provider === 'openrouter'
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 600
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`${provider} API returned status ${response.status}`);
    }

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content;
    if (answer) {
      return { success: true, answer: answer.trim() };
    }
    throw new Error('Malformed AI response format');
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Intelligent local contextual fallback when AI API is unconfigured or unavailable
 */
function generateOfflineContextualAnswer(profile, schemes, question) {
  const q = question.toLowerCase();
  const count = Array.isArray(schemes) ? schemes.length : 0;

  if (q.includes('document') || q.includes('prepare') || q.includes('certificate') || q.includes('paper')) {
    const allDocs = new Set();
    (schemes || []).forEach(s => (s.documents || []).forEach(d => allDocs.add(d)));
    const docList = Array.from(allDocs);
    return {
      success: true,
      answer: `Based on your ${count} eligible scholarship(s), here are the standard documents you should have ready:\n\n` +
        (docList.length > 0
          ? docList.map(d => `• ${d}`).join('\n')
          : '• Aadhaar Card (Aadhaar-seeded bank account)\n• Latest Academic Marksheet/Grade Card\n• Valid Income Certificate from Tehsildar/SDM\n• College Admission / Bonafide Certificate') +
        '\n\nTip: Keep digital PDF copies under 200KB for easy uploading on application portals.'
    };
  }

  if (q.includes('deadline') || q.includes('close') || q.includes('first') || q.includes('when') || q.includes('date')) {
    if (count > 0) {
      const sortedByDate = [...schemes].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      const first = sortedByDate[0];
      return {
        success: true,
        answer: `The scholarship closing earliest is **${first.name}** with a deadline of **${first.deadline}**.\n\nRecommended Action: Complete your documentation for ${first.provider} first to ensure timely submission.`
      };
    }
  }

  if (q.includes('why') || q.includes('eligible') || q.includes('match') || q.includes('qualify')) {
    if (count > 0) {
      const top = schemes[0];
      return {
        success: true,
        answer: `You qualified for **${top.name}** (${top.matchScore}% Match) because ${top.reason}\n\nTotal matched opportunities: ${count} scholarships found matching your discipline (${profile?.course || 'General'}), state (${profile?.state || 'All'}), and income criteria.`
      };
    }
  }

  if (q.includes('highest') || q.includes('money') || q.includes('benefit') || q.includes('amount') || q.includes('more')) {
    if (count > 0) {
      const highest = [...schemes].sort((a, b) => (b.benefitAmount || 0) - (a.benefitAmount || 0))[0];
      return {
        success: true,
        answer: `The highest financial award among your matches is **${highest.name}**, offering **${highest.benefit}**.\n\nYou can apply directly via their official portal: ${highest.applyLink}`
      };
    }
  }

  // General helpful response
  return {
    success: true,
    answer: count > 0
      ? `You currently have **${count} matched scholarship(s)** available. You can view full requirements, eligibility breakdown, and official application links directly on your results page. Feel free to ask about specific documents, upcoming deadlines, or highest benefit schemes!`
      : `Enter your student details on the Eligibility Form to see matched scholarships and ask specific questions about document requirements and application deadlines.`
  };
}
