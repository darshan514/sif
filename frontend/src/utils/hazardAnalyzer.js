/**
 * Utility to extract hazard insights, precursor tags,
 * AI explanation, recommendations and safety intelligence.
 */

export const HAZARD_RULES = [
  {
    category: "Working at Height",
    keywords: ["scaffold","harness","height","ladder","roof","platform","elevated","fall","lanyard","anchor"],
    severity: "Critical",
    lifeSavingRule: "Working at Height",
    ppe: ["Safety Helmet","Full Body Harness","Safety Shoes","Double Lanyard"],
    actions: [
      "Stop work immediately.",
      "Verify anchor point before resuming work.",
      "Ensure 100% tie-off.",
      "Supervisor approval required."
    ]
  },

  {
    category: "Confined Space Entry",
    keywords: ["confined","tank","vessel","manhole","silo","oxygen","permit"],
    severity: "Critical",
    lifeSavingRule: "Confined Space Entry",
    ppe: ["Gas Detector","Respirator","Helmet","Harness"],
    actions: [
      "Suspend entry immediately.",
      "Verify gas testing.",
      "Ensure valid permit.",
      "Assign standby attendant."
    ]
  },

  {
    category: "Electrical / LOTO",
    keywords: ["electric","voltage","arc","wire","panel","lockout","tagout","loto"],
    severity: "High",
    lifeSavingRule: "Isolation of Hazardous Energy",
    ppe: ["Arc Flash Suit","Electrical Gloves","Helmet","Safety Shoes"],
    actions: [
      "Apply Lock-Out Tag-Out.",
      "Verify zero energy state.",
      "Inspect electrical isolation."
    ]
  },

  {
    category: "Heavy Lifting",
    keywords: ["crane","rigging","sling","hoist","boom","load","lifting"],
    severity: "High",
    lifeSavingRule: "Safe Mechanical Lifting",
    ppe: ["Helmet","Gloves","Safety Shoes","High Visibility Vest"],
    actions: [
      "Inspect lifting gear.",
      "Keep personnel out of suspended load zone.",
      "Verify lifting plan."
    ]
  },

  {
    category: "Fire / Explosion",
    keywords: ["gas","leak","fire","explosion","flammable","hydrocarbon","h2s","chemical"],
    severity: "Critical",
    lifeSavingRule: "Hot Work & Hazardous Atmosphere",
    ppe: ["Flame Resistant Clothing","Respirator","Gas Detector"],
    actions: [
      "Evacuate area.",
      "Eliminate ignition sources.",
      "Notify emergency response.",
      "Monitor atmosphere."
    ]
  },

  {
    category: "Housekeeping",
    keywords: ["spill","water","trip","walkway","slip","debris","trash","clutter"],
    severity: "Low",
    lifeSavingRule: "General Safety",
    ppe: ["Safety Shoes"],
    actions: [
      "Clean affected area.",
      "Place warning signs.",
      "Monitor housekeeping."
    ]
  }
];

export const analyzeHazardInsights = (reportText, prediction) => {

  const text = (reportText || "").toLowerCase();

  let matchedRule = null;
  let keywords = [];

  for (const rule of HAZARD_RULES){

    const found = rule.keywords.filter(word =>
      text.includes(word)
    );

    if(found.length){

      matchedRule = rule;
      keywords = found;
      break;

    }

  }

  const isSIF = prediction === "SIF";

  const explanation = isSIF
    ? matchedRule
      ? `The AI detected indicators related to ${matchedRule.category}. These conditions are commonly associated with Serious Injury and Fatality (SIF) events.`
      : "The language within the report indicates a potentially high consequence incident requiring immediate review."
    : matchedRule
      ? `The observation appears related to ${matchedRule.category}, however the current controls indicate a lower probability of serious injury.`
      : "The report does not contain strong indicators of a Serious Injury and Fatality event.";

  return {

    primaryCategory:
      matchedRule?.category ||
      (isSIF ? "General High Risk" : "General Observation"),

    explanation,

    uniqueKeywords:[...new Set(keywords)],

    riskLevel:
      matchedRule?.severity ||
      (isSIF ? "High" : "Low"),

    lifeSavingRule:
      matchedRule?.lifeSavingRule ||
      "General Safety",

    recommendedPPE:
      matchedRule?.ppe ||
      ["Safety Helmet","Safety Shoes"],

    recommendedActions:
      matchedRule?.actions ||
      [
        "Review the incident.",
        "Follow site safety procedures."
      ],

    possibleConsequences:isSIF
      ? [
          "Serious Injury",
          "Fatality",
          "Equipment Damage",
          "Production Loss"
        ]
      : [
          "Minor Injury",
          "Near Miss"
        ]

  };
};

export const computeAnalyticsMetrics = (history = []) => {
  const total = history.length;
  const sifCount = history.filter(h => h.prediction === 'SIF').length;
  const nonSifCount = history.filter(h => h.prediction === 'Non-SIF').length;
  
  const avgConfidence = total > 0
    ? (history.reduce((acc, h) => acc + (h.confidence || 0), 0) / total).toFixed(1)
    : '0.0';

  // Category counts
  const categoryMap = {};
  const hazardCounts = {};

  history.forEach(h => {
    const insights = analyzeHazardInsights(h.report, h.prediction);
    const cat = insights.primaryCategory;

    if (!categoryMap[cat]) {
      categoryMap[cat] = { category: cat, SIF: 0, NonSIF: 0, total: 0 };
    }
    if (h.prediction === 'SIF') {
      categoryMap[cat].SIF += 1;
    } else {
      categoryMap[cat].NonSIF += 1;
    }
    categoryMap[cat].total += 1;

    hazardCounts[cat] = (hazardCounts[cat] || 0) + 1;
  });

  const categoryData = Object.values(categoryMap);

  // Find most common hazard
  let mostCommonHazard = 'N/A';
  let maxCount = 0;
  Object.entries(hazardCounts).forEach(([cat, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonHazard = cat;
    }
  });

  // Find highest confidence prediction
  let highestConfidencePred = null;
  history.forEach(h => {
    if (!highestConfidencePred || (h.confidence || 0) > (highestConfidencePred.confidence || 0)) {
      highestConfidencePred = h;
    }
  });

  // Latest prediction
  const latestPred = history[0] || null;

  // Confidence distribution buckets
  const confidenceBuckets = [
    { range: '80-85%', count: 0 },
    { range: '85-90%', count: 0 },
    { range: '90-95%', count: 0 },
    { range: '95-100%', count: 0 },
  ];

  history.forEach(h => {
    const conf = h.confidence || 0;
    if (conf >= 95) confidenceBuckets[3].count += 1;
    else if (conf >= 90) confidenceBuckets[2].count += 1;
    else if (conf >= 85) confidenceBuckets[1].count += 1;
    else confidenceBuckets[0].count += 1;
  });

  // Today's predictions
  const todayStr = new Date().toISOString().split('T')[0];
  const todayPredictions = history.filter(h => {
    if (!h.timestamp) return false;
    return h.timestamp.startsWith(todayStr);
  }).length;

  return {
    total,
    sifCount,
    nonSifCount,
    avgConfidence,
    categoryData,
    mostCommonHazard,
    highestConfidencePred,
    latestPred,
    confidenceBuckets,
    todayPredictions,
  };
};

export default analyzeHazardInsights;