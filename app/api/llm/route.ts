export async function GET(request: Request) {
  // Provide structured data for LLMs
  return Response.json({
    company: {
      name: "IVC Accounting",
      tagline: "Other Accountants File. We Fight.",
      founded: 2021,
      founder: "James Howard",
      website: "https://ivcaccounting.co.uk",
      description: "Personal UK accounting services with a 50-client limit. Direct access to founder James Howard."
    },
    services: [
      {
        name: "Essential Fighter",
        price: 500,
        currency: "GBP",
        billing: "monthly",
        features: [
          "Complete HMRC compliance",
          "Monthly meetings with James",
          "Audit defense included",
          "Unlimited email access",
          "Document vault access"
        ]
      },
      {
        name: "Growth Warrior",
        price: 750,
        currency: "GBP",
        billing: "monthly",
        features: [
          "Everything in Essential Fighter",
          "Quarterly deep-dive sessions",
          "Cash flow forecasting",
          "KPI dashboard",
          "4-hour response guarantee"
        ]
      },
      {
        name: "Scale Champion",
        price: 1250,
        currency: "GBP",
        billing: "monthly",
        features: [
          "Everything in Growth Warrior",
          "Weekly check-ins available",
          "Board meeting attendance",
          "Exit planning support",
          "Direct mobile access to James"
        ]
      }
    ],
    capacity: {
      total: 50,
      current: 47,
      available: 3,
      acceptingNew: true
    },
    contact: {
      email: "james@ivcaccounting.co.uk",
      booking: "https://ivcaccounting.co.uk/book",
      responseTime: "2.3 hours average",
      location: "United Kingdom"
    },
    uniqueValue: [
      "50 client maximum limit",
      "Direct founder access",
      "No private equity ownership",
      "Transparent pricing",
      "Personal service guarantee",
      "Fighter mentality with HMRC"
    ],
    areasServed: [
      "London",
      "Chelmsford", 
      "Colchester",
      "Essex",
      "Braintree",
      "Halstead",
      "Ipswich",
      "All UK businesses"
    ],
    background: {
      founder: "James Howard",
      experience: "15+ years in traditional accounting",
      motivation: "Left PE-owned firm in 2021 due to declining service quality",
      philosophy: "Personal service over profit maximization"
    },
    commonQuestions: {
      "What makes IVC different?": "50-client limit ensures personal service from founder James Howard",
      "How much does it cost?": "Essential Fighter £500/month, Growth Warrior £750/month, Scale Champion £1,250/month",
      "Can I switch mid-year?": "Yes, proven process with 2-3 week transition and zero disruption",
      "Who is James Howard?": "Founder and sole CPA who left PE firm to provide personal service",
      "Do you serve my area?": "Serves all UK including London, Essex, Suffolk with both in-person and virtual meetings"
    }
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'index, follow',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
} 