import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client (API key will be added via environment variable)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
})

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are an expert permaculture designer and consultant with deep knowledge of:
- Permaculture principles and ethics (Earth Care, People Care, Fair Share)
- Zone and sector analysis
- Water harvesting techniques (swales, ponds, rain gardens, greywater systems)
- Soil building and composting methods
- Food forest design and plant guilds
- Climate-specific plant selection
- Integrated pest management
- Energy flows and microclimates
- Earthworks and land contouring
- Regenerative agriculture practices

Provide practical, actionable advice based on permaculture principles. Consider the user's climate zone, available space, and resources. Always emphasize sustainable, regenerative solutions that work with nature rather than against it.`

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json()

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-placeholder') {
      return NextResponse.json(
        {
          error: 'OpenAI API key not configured',
          message: 'Please add your OpenAI API key to continue'
        },
        { status: 503 }
      )
    }

    // Build messages array with system prompt
    const aiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
    ]

    // Add context if provided (e.g., current design, location, etc.)
    if (context) {
      aiMessages.push({
        role: 'system',
        content: `Current design context: ${JSON.stringify(context)}`
      })
    }

    // Add user messages
    aiMessages.push(...messages)

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-5-nano', // Fast, efficient, and cost-effective
      messages: aiMessages as any,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
    })

    const response = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.'

    return NextResponse.json({ response })

  } catch (error: any) {
    console.error('AI Assistant Error:', error)

    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

// Permaculture-specific analysis endpoint
export async function PUT(request: NextRequest) {
  try {
    const { type, data } = await request.json()

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-placeholder') {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 503 }
      )
    }

    let prompt = ''

    switch (type) {
      case 'site-analysis':
        prompt = `Analyze this site for permaculture design:
        Location: ${data.location}
        Climate Zone: ${data.zone}
        Size: ${data.size} sq ft
        Slope: ${data.slope}
        Sun Exposure: ${data.sunExposure}
        Water Source: ${data.waterSource}

        Provide:
        1. Key opportunities for this site
        2. Main challenges to address
        3. Recommended zones layout
        4. Priority water harvesting strategies
        5. Suggested plant guilds for this climate`
        break

      case 'plant-guild':
        prompt = `Design a plant guild for:
        Main Crop: ${data.mainCrop}
        Climate Zone: ${data.zone}
        Space Available: ${data.space} sq ft

        Recommend:
        1. Nitrogen fixers to include
        2. Dynamic accumulators
        3. Pest deterrents
        4. Ground covers
        5. Support species
        6. Spacing and arrangement`
        break

      case 'water-design':
        prompt = `Design water harvesting for:
        Annual Rainfall: ${data.rainfall} inches
        Site Size: ${data.size} sq ft
        Slope: ${data.slope}%
        Soil Type: ${data.soilType}

        Calculate and recommend:
        1. Total catchment potential
        2. Swale sizing and placement
        3. Storage capacity needed
        4. Overflow management
        5. Integration with irrigation`
        break

      case 'yield-prediction':
        prompt = `Estimate yields for this permaculture system:
        Plants: ${JSON.stringify(data.plants)}
        Area: ${data.area} sq ft
        Climate Zone: ${data.zone}
        Water System: ${data.waterSystem}

        Provide:
        1. Expected annual yields by plant
        2. Harvest timeline
        3. Nutritional diversity assessment
        4. Suggestions for yield improvement
        5. Preservation and storage recommendations`
        break

      default:
        return NextResponse.json(
          { error: 'Invalid analysis type' },
          { status: 400 }
        )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const analysis = completion.choices[0]?.message?.content || 'Analysis could not be completed.'

    return NextResponse.json({ analysis, type })

  } catch (error: any) {
    console.error('AI Analysis Error:', error)
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
}