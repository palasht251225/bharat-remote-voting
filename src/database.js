/**
 * Rashtriya Matdaan Network (RMN) - Bharat Remote Voting Database
 * Comprehensive Indian Electoral Constituencies, Candidates & Sample Citizen Database
 */

const VOTING_DB = {
  sampleVoters: [
    {
      id: "VOTER-001",
      name: "Rahul Sharma",
      age: 28,
      gender: "Male",
      aadhaar: "4589 1234 8976",
      epicNo: "UP/64/098124",
      phone: "+91 98765 43210",
      photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
      registeredState: "Uttar Pradesh",
      registeredDistrict: "Varanasi",
      constituencyId: "UP-PC-64",
      constituencyName: "Varanasi (UP PC-64)",
      currentCity: "Bengaluru",
      currentState: "Karnataka",
      currentPincode: "560034",
      distanceFromHomeKm: 1820,
      reasonForRelocation: "Software Engineer at Tech Park, Bengaluru",
      status: "Eligible for Remote Vote"
    },
    {
      id: "VOTER-002",
      name: "Priya Nair",
      age: 24,
      gender: "Female",
      aadhaar: "8732 9845 1209",
      epicNo: "KL/04/776219",
      phone: "+91 94471 23456",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      registeredState: "Kerala",
      registeredDistrict: "Wayanad",
      constituencyId: "KL-PC-04",
      constituencyName: "Wayanad (KL PC-04)",
      currentCity: "New Delhi",
      currentState: "Delhi NCR",
      currentPincode: "110001",
      distanceFromHomeKm: 2450,
      reasonForRelocation: "Post-Graduate Student at Delhi University",
      status: "Eligible for Remote Vote"
    },
    {
      id: "VOTER-003",
      name: "Amitabh Patel",
      age: 35,
      gender: "Male",
      aadhaar: "6124 5589 3341",
      epicNo: "GJ/07/445102",
      phone: "+91 98250 88991",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      registeredState: "Gujarat",
      registeredDistrict: "Gandhinagar",
      constituencyId: "GJ-PC-06",
      constituencyName: "Gandhinagar (GJ PC-06)",
      currentCity: "Pune",
      currentState: "Maharashtra",
      currentPincode: "411057",
      distanceFromHomeKm: 650,
      reasonForRelocation: "Automobile Manufacturing Specialist, Hinjawadi",
      status: "Eligible for Remote Vote"
    },
    {
      id: "VOTER-004",
      name: "Sunita Das",
      age: 31,
      gender: "Female",
      aadhaar: "3319 7780 4421",
      epicNo: "WB/23/110934",
      phone: "+91 98301 55678",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
      registeredState: "West Bengal",
      registeredDistrict: "Kolkata South",
      constituencyId: "WB-PC-23",
      constituencyName: "Kolkata Dakshin (WB PC-23)",
      currentCity: "Mumbai",
      currentState: "Maharashtra",
      currentPincode: "400051",
      distanceFromHomeKm: 1960,
      reasonForRelocation: "Healthcare Worker / Nurse at KEM Hospital",
      status: "Eligible for Remote Vote"
    },
    {
      id: "VOTER-005",
      name: "Major Vikram Rathore",
      age: 42,
      gender: "Male",
      aadhaar: "9901 3342 7715",
      epicNo: "RJ/19/882341",
      phone: "+91 97840 11223",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      registeredState: "Rajasthan",
      registeredDistrict: "Jaipur Rural",
      constituencyId: "RJ-PC-06",
      constituencyName: "Jaipur Rural (RJ PC-06)",
      currentCity: "Leh",
      currentState: "Ladakh UT",
      currentPincode: "194101",
      distanceFromHomeKm: 1140,
      reasonForRelocation: "Indian Armed Forces Personnel on Remote Border Deployment",
      status: "Eligible for Remote Vote"
    }
  ],

  constituencies: {
    "UP-PC-64": {
      id: "UP-PC-64",
      name: "Varanasi Parliamentary Constituency",
      state: "Uttar Pradesh",
      totalRegisteredVoters: "1,854,920",
      currentTurnout: "72.4%",
      remoteVotersRegistered: 48920,
      candidates: [
        {
          id: "CAND-UP-01",
          name: "Narendra Modi",
          party: "Bharatiya Janata Party (BJP)",
          symbolName: "Lotus (कमल)",
          symbolSvg: `<svg viewBox="0 0 100 100" class="w-10 h-10 inline-block text-orange-500 fill-current"><path d="M50 10 C45 30 25 45 10 50 C25 55 45 70 50 90 C55 70 75 55 90 50 C75 45 55 30 50 10 Z"/><path d="M50 30 C48 45 35 55 25 60 C35 65 48 75 50 85 C52 75 65 65 75 60 C65 55 52 45 50 30 Z" opacity="0.6"/></svg>`,
          symbolColor: "#FF9933",
          education: "Post Graduate",
          age: 73,
          manifesto: "National Infrastructure, Digital India, Cultural Heritage Corridor, Viksit Bharat 2047"
        },
        {
          id: "CAND-UP-02",
          name: "Ajay Rai",
          party: "Indian National Congress (INC)",
          symbolName: "Hand (हाथ)",
          symbolSvg: `<svg viewBox="0 0 100 100" class="w-10 h-10 inline-block text-blue-600 fill-current"><path d="M40 20 C40 15 45 15 45 20 L45 50 C45 42 50 42 50 50 L50 25 C50 20 55 20 55 25 L55 50 L55 30 C55 25 60 25 60 30 L60 55 L60 40 C60 35 65 35 65 40 L65 70 C65 85 50 90 35 85 C25 80 25 70 30 60 L38 45 L38 20 C38 15 40 15 40 20 Z"/></svg>`,
          symbolColor: "#006699",
          education: "Graduate",
          age: 54,
          manifesto: "Youth Employment Guarantee, Local Weaver Support, Healthcare Subsidies, Civic Modernization"
        },
        {
          id: "CAND-UP-03",
          name: "Athar Jamal Lari",
          party: "Bahujan Samaj Party (BSP)",
          symbolName: "Elephant (हाथी)",
          symbolSvg: `<svg viewBox="0 0 100 100" class="w-10 h-10 inline-block text-indigo-700 fill-current"><path d="M20 60 Q25 35 55 35 Q85 35 85 60 L85 85 L75 85 L75 68 L60 68 L60 85 L50 85 L50 68 L35 68 L35 85 L25 85 L25 70 Q15 70 12 55 Q10 45 18 45 L20 48 Q20 55 20 60 Z"/></svg>`,
          symbolColor: "#224488",
          education: "Post Graduate",
          age: 62,
          manifesto: "Social Justice, Minority Education Infrastructure, Unorganized Worker Welfare"
        },
        {
          id: "CAND-UP-04",
          name: "Kameshwar Baitha",
          party: "Communist Party of India (CPI)",
          symbolName: "Ears of Corn & Sickle (हंसिया और बाली)",
          symbolSvg: `<svg viewBox="0 0 100 100" class="w-10 h-10 inline-block text-red-600 fill-current"><path d="M30 70 A30 30 0 0 1 70 30 L75 35 A25 25 0 0 0 40 68 L50 80 L40 85 Z"/><circle cx="65" cy="65" r="8"/></svg>`,
          symbolColor: "#DC2626",
          education: "Matriculate",
          age: 49,
          manifesto: "Farmer MSP Guarantees, Labor Wage Reform, Universal Free Healthcare"
        },
        {
          id: "CAND-NOTA",
          name: "None of the Above (NOTA)",
          party: "Independent / Constitutional Option",
          symbolName: "NOTA Symbol (इनमें से कोई नहीं)",
          symbolSvg: `<svg viewBox="0 0 100 100" class="w-10 h-10 inline-block text-gray-700 fill-current"><rect x="15" y="20" width="70" height="60" rx="5" fill="none" stroke="currentColor" stroke-width="8"/><line x1="25" y1="30" x2="75" y2="70" stroke="currentColor" stroke-width="8"/><line x1="75" y1="30" x2="25" y2="70" stroke="currentColor" stroke-width="8"/></svg>`,
          symbolColor: "#4B5563",
          education: "N/A",
          age: 0,
          manifesto: "Rejection of all nominated candidates in this constituency"
        }
      ]
    },
    "KL-PC-04": {
      id: "KL-PC-04",
      name: "Wayanad Parliamentary Constituency",
      state: "Kerala",
      totalRegisteredVoters: "1,462,423",
      currentTurnout: "74.1%",
      remoteVotersRegistered: 62410,
      candidates: [
        {
          id: "CAND-KL-01",
          name: "Rahul Gandhi",
          party: "Indian National Congress (INC)",
          symbolName: "Hand (കൈ)",
          symbolSvg: `<svg viewBox="0 0 100 100" class="w-10 h-10 inline-block text-blue-600 fill-current"><path d="M40 20 C40 15 45 15 45 20 L45 50 C45 42 50 42 50 50 L50 25 C50 20 55 20 55 25 L55 50 L55 30 C55 25 60 25 60 30 L60 55 L60 40 C60 35 65 35 65 40 L65 70 C65 85 50 90 35 85 C25 80 25 70 30 60 L38 45 L38 20 C38 15 40 15 40 20 Z"/></svg>`,
          symbolColor: "#006699",
          education: "M.Phil",
          age: 53,
          manifesto: "Tribal Rights Protection, Eco-tourism Development, Farmers Debt Relief, Wayanad Medical College"
        },
        {
          id: "CAND-KL-02",
          name: "Annie Raja",
          party: "Communist Party of India (CPI)",
          symbolName: "Ears of Corn & Sickle",
          symbolSvg: `<svg viewBox="0 0 100 100" class="w-10 h-10 inline-block text-red-600 fill-current"><path d="M30 70 A30 30 0 0 1 70 30 L75 35 A25 25 0 0 0 40 68 L50 80 L40 85 Z"/><circle cx="65" cy="65" r="8"/></svg>`,
          symbolColor: "#DC2626",
          education: "Graduate",
          age: 58,
          manifesto: "Women Empowerment, Agricultural Price Stabilization, Plantation Worker Housing"
        },
        {
          id: "CAND-KL-03",
          name: "K. Surendran",
          party: "Bharatiya Janata Party (BJP)",
          symbolName: "Lotus (താമര)",
          symbolSvg: `<svg viewBox="0 0 100 100" class="w-10 h-10 inline-block text-orange-500 fill-current"><path d="M50 10 C45 30 25 45 10 50 C25 55 45 70 50 90 C55 70 75 55 90 50 C75 45 55 30 50 10 Z"/></svg>`,
          symbolColor: "#FF9933",
          education: "B.Sc Chemistry",
          age: 54,
          manifesto: "National Highway Connectivity, High-Tech Agro processing zones, Central Tourism Fund"
        },
        {
          id: "CAND-NOTA",
          name: "None of the Above (NOTA)",
          party: "Independent / Constitutional Option",
          symbolName: "NOTA Symbol",
          symbolSvg: `<svg viewBox="0 0 100 100" class="w-10 h-10 inline-block text-gray-700 fill-current"><rect x="15" y="20" width="70" height="60" rx="5" fill="none" stroke="currentColor" stroke-width="8"/><line x1="25" y1="30" x2="75" y2="70" stroke="currentColor" stroke-width="8"/><line x1="75" y1="30" x2="25" y2="70" stroke="currentColor" stroke-width="8"/></svg>`,
          symbolColor: "#4B5563",
          education: "N/A",
          age: 0,
          manifesto: "Rejection of all nominated candidates in this constituency"
        }
      ]
    },
    "KA-PC-26": {
      id: "KA-PC-26",
      name: "Bangalore South Parliamentary Constituency",
      state: "Karnataka",
      totalRegisteredVoters: "2,219,300",
      currentTurnout: "61.8%",
      remoteVotersRegistered: 81200,
      candidates: [
        {
          id: "CAND-KA-01",
          name: "Tejasvi Surya",
          party: "Bharatiya Janata Party (BJP)",
          symbolName: "Lotus (ಕಮಲ)",
          symbolSvg: `<svg viewBox="0 0 100 100" class="w-10 h-10 inline-block text-orange-500 fill-current"><path d="M50 10 C45 30 25 45 10 50 C25 55 45 70 50 90 C55 70 75 55 90 50 C75 45 55 30 50 10 Z"/></svg>`,
          symbolColor: "#FF9933",
          education: "LL.B Law",
          age: 33,
          manifesto: "Namma Metro Phase 3, Start-up Capital Ecosystem, Suburban Railway, Lake Rejuvenation"
        },
        {
          id: "CAND-KA-02",
          name: "Sowmya Reddy",
          party: "Indian National Congress (INC)",
          symbolName: "Hand (ಕೈ)",
          symbolSvg: `<svg viewBox="0 0 100 100" class="w-10 h-10 inline-block text-blue-600 fill-current"><path d="M40 20 C40 15 45 15 45 20 L45 50 C45 42 50 42 50 50 L50 25 C50 20 55 20 55 25 L55 50 L55 30 C55 25 60 25 60 30 L60 55 L60 40 C60 35 65 35 65 40 L65 70 C65 85 50 90 35 85 C25 80 25 70 30 60 L38 45 L38 20 C38 15 40 15 40 20 Z"/></svg>`,
          symbolColor: "#006699",
          education: "M.Sc Environmental Tech",
          age: 44,
          manifesto: "Green Bengaluru Initiative, Women Safety Transits, Urban Civic Decentralization, Affordable Housing"
        },
        {
          id: "CAND-NOTA",
          name: "None of the Above (NOTA)",
          party: "Independent / Constitutional Option",
          symbolName: "NOTA Symbol",
          symbolSvg: `<svg viewBox="0 0 100 100" class="w-10 h-10 inline-block text-gray-700 fill-current"><rect x="15" y="20" width="70" height="60" rx="5" fill="none" stroke="currentColor" stroke-width="8"/><line x1="25" y1="30" x2="75" y2="70" stroke="currentColor" stroke-width="8"/><line x1="75" y1="30" x2="25" y2="70" stroke="currentColor" stroke-width="8"/></svg>`,
          symbolColor: "#4B5563",
          education: "N/A",
          age: 0,
          manifesto: "Rejection of all nominated candidates in this constituency"
        }
      ]
    },
    "MH-PC-24": {
      id: "MH-PC-24",
      name: "Mumbai North Parliamentary Constituency",
      state: "Maharashtra",
      totalRegisteredVoters: "1,794,100",
      currentTurnout: "58.2%",
      remoteVotersRegistered: 54100,
      candidates: [
        {
          id: "CAND-MH-01",
          name: "Piyush Goyal",
          party: "Bharatiya Janata Party (BJP)",
          symbolName: "Lotus (कमळ)",
          symbolSvg: `<svg viewBox="0 0 100 100" class="w-10 h-10 inline-block text-orange-500 fill-current"><path d="M50 10 C45 30 25 45 10 50 C25 55 45 70 50 90 C55 70 75 55 90 50 C75 45 55 30 50 10 Z"/></svg>`,
          symbolColor: "#FF9933",
          education: "Chartered Accountant & Law",
          age: 60,
          manifesto: "Coastal Road Extension, Slum Rehabilitation Fast-tracking, FinTech Hub Borivali"
        },
        {
          id: "CAND-MH-02",
          name: "Bhushan Patil",
          party: "Indian National Congress (INC)",
          symbolName: "Hand (हात)",
          symbolSvg: `<svg viewBox="0 0 100 100" class="w-10 h-10 inline-block text-blue-600 fill-current"><path d="M40 20 C40 15 45 15 45 20 L45 50 C45 42 50 42 50 50 L50 25 C50 20 55 20 55 25 L55 50 L55 30 C55 25 60 25 60 30 L60 55 L60 40 C60 35 65 35 65 40 L65 70 C65 85 50 90 35 85 C25 80 25 70 30 60 L38 45 L38 20 C38 15 40 15 40 20 Z"/></svg>`,
          symbolColor: "#006699",
          education: "Graduate",
          age: 48,
          manifesto: "Fisherfolk Protection, Mangrove Conservation, Local Train AC Fare Reduction"
        },
        {
          id: "CAND-NOTA",
          name: "None of the Above (NOTA)",
          party: "Independent / Constitutional Option",
          symbolName: "NOTA Symbol",
          symbolSvg: `<svg viewBox="0 0 100 100" class="w-10 h-10 inline-block text-gray-700 fill-current"><rect x="15" y="20" width="70" height="60" rx="5" fill="none" stroke="currentColor" stroke-width="8"/><line x1="25" y1="30" x2="75" y2="70" stroke="currentColor" stroke-width="8"/><line x1="75" y1="30" x2="25" y2="70" stroke="currentColor" stroke-width="8"/></svg>`,
          symbolColor: "#4B5563",
          education: "N/A",
          age: 0,
          manifesto: "Rejection of all nominated candidates in this constituency"
        }
      ]
    },
    "WB-PC-23": {
      id: "WB-PC-23",
      name: "Kolkata Dakshin Parliamentary Constituency",
      state: "West Bengal",
      totalRegisteredVoters: "1,812,050",
      currentTurnout: "69.5%",
      remoteVotersRegistered: 41200,
      candidates: [
        {
          id: "CAND-WB-01",
          name: "Mala Roy",
          party: "All India Trinamool Congress (AITC)",
          symbolName: "Flowers & Grass (জোড়া ফুল)",
          symbolSvg: `<svg viewBox="0 0 100 100" class="w-10 h-10 inline-block text-emerald-600 fill-current"><circle cx="35" cy="40" r="15"/><circle cx="65" cy="40" r="15"/><path d="M35 55 L50 85 L65 55" stroke="currentColor" stroke-width="8" fill="none"/></svg>`,
          symbolColor: "#059669",
          education: "Graduate",
          age: 66,
          manifesto: "Social Safety Nets (Lakshmir Bhandar), Heritage Riverfront Development, Urban Drainage Overhaul"
        },
        {
          id: "CAND-WB-02",
          name: "Debasree Chaudhuri",
          party: "Bharatiya Janata Party (BJP)",
          symbolName: "Lotus (পদ্ম)",
          symbolSvg: `<svg viewBox="0 0 100 100" class="w-10 h-10 inline-block text-orange-500 fill-current"><path d="M50 10 C45 30 25 45 10 50 C25 55 45 70 50 90 C55 70 75 55 90 50 C75 45 55 30 50 10 Z"/></svg>`,
          symbolColor: "#FF9933",
          education: "Post Graduate",
          age: 52,
          manifesto: "Industrial Revitalization, Women Security Fast-Track Courts, Central Metro Expansion"
        },
        {
          id: "CAND-WB-03",
          name: "Saira Shah Halim",
          party: "Communist Party of India (Marxist) - CPI(M)",
          symbolName: "Hammer, Sickle and Star (হাতুড়ি ও কাস্তে)",
          symbolSvg: `<svg viewBox="0 0 100 100" class="w-10 h-10 inline-block text-red-600 fill-current"><path d="M30 70 A30 30 0 0 1 70 30 L75 35 A25 25 0 0 0 40 68 L50 80 L40 85 Z"/><polygon points="75,25 80,38 95,38 83,48 88,60 75,52 62,60 67,48 55,38 70,38"/></svg>`,
          symbolColor: "#DC2626",
          education: "Post Graduate",
          age: 46,
          manifesto: "Public Education Rebuilding, Factory Job Creation, Fair Price Ration Shops"
        },
        {
          id: "CAND-NOTA",
          name: "None of the Above (NOTA)",
          party: "Independent / Constitutional Option",
          symbolName: "NOTA Symbol",
          symbolSvg: `<svg viewBox="0 0 100 100" class="w-10 h-10 inline-block text-gray-700 fill-current"><rect x="15" y="20" width="70" height="60" rx="5" fill="none" stroke="currentColor" stroke-width="8"/><line x1="25" y1="30" x2="75" y2="70" stroke="currentColor" stroke-width="8"/><line x1="75" y1="30" x2="25" y2="70" stroke="currentColor" stroke-width="8"/></svg>`,
          symbolColor: "#4B5563",
          education: "N/A",
          age: 0,
          manifesto: "Rejection of all nominated candidates in this constituency"
        }
      ]
    }
  },

  stateTurnoutStats: [
    { state: "Uttar Pradesh", registered: "152.8M", remoteVoters: "8.4M", turnoutPct: 69.4, status: "Active" },
    { state: "Maharashtra", registered: "92.4M", remoteVoters: "6.2M", turnoutPct: 64.8, status: "Active" },
    { state: "Bihar", registered: "76.5M", remoteVoters: "9.1M", turnoutPct: 62.1, status: "Active" },
    { state: "West Bengal", registered: "75.2M", remoteVoters: "3.8M", turnoutPct: 79.2, status: "Active" },
    { state: "Karnataka", registered: "54.1M", remoteVoters: "3.2M", turnoutPct: 71.3, status: "Active" },
    { state: "Kerala", registered: "27.7M", remoteVoters: "2.9M", turnoutPct: 75.8, status: "Active" },
    { state: "Rajasthan", registered: "53.2M", remoteVoters: "4.1M", turnoutPct: 68.0, status: "Active" },
    { state: "Delhi NCR", registered: "15.1M", remoteVoters: "2.7M", turnoutPct: 63.5, status: "Active" }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = VOTING_DB;
}
