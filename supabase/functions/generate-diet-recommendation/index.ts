
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userData } = await req.json();

    if (!userData) {
      throw new Error('User data is required');
    }

    const prompt = `Based on the following user information, create a comprehensive, personalized dietary recommendation:

Personal Details:
- Name: ${userData.name}
- Age: ${userData.age}
- Gender: ${userData.gender}
- Weight: ${userData.weight}
- Height: ${userData.height}
- Activity Level: ${userData.activityLevel}

Dietary Information:
- Current Diet: ${userData.currentDiet}
- Dietary Restrictions: ${userData.dietaryRestrictions.join(', ') || 'None'}
- Meals per Day: ${userData.mealsPerDay}
- Cooking Time Available: ${userData.cookingTime}
- Budget: ${userData.budget}

Health & Goals:
- Health Goals: ${userData.healthGoals}
- Medical Conditions: ${userData.medicalConditions || 'None mentioned'}
- Food Preferences: ${userData.foodPreferences}
- Additional Information: ${userData.additionalInfo || 'None'}

Please provide a detailed dietary recommendation that includes:
1. A summary of their current situation
2. Specific dietary recommendations tailored to their goals
3. Sample meal ideas for different times of day
4. Nutritional guidelines and portion suggestions
5. Tips for implementation and sustainability
6. Any important considerations based on their restrictions or conditions

Format the response in a clear, encouraging, and actionable way using markdown formatting for headers and lists.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional nutritionist and dietitian with expertise in creating personalized dietary recommendations. Provide comprehensive, evidence-based advice that is practical and achievable for the individual.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const recommendation = data.choices[0].message.content;

    return new Response(JSON.stringify({ recommendation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-diet-recommendation function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
