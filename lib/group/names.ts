// Arrays of positive words related to notes, creativity, and organization
const prefixes = ["The", "A", "My", "Our", ""];

const adjectives = [
  "Brilliant", "Radiant", "Illuminated", "Inspired", "Creative", "Vibrant", "Organized", "Thoughtful", "Focused", 
  "Visionary", "Sparkling", "Gleaming", "Iridescent", "Reflective", "Luminous", 
  "Harmonious", "Insightful", "Innovative", "Bright", "Polished", "Refined"
];

const nouns = [
  "Notes", "Ideas", "Thoughts", "Collection", "Reflections", "Prism", 
  "Insights", "Concepts", "Musings", "Notebook", "Perspectives", "Visions", "Plans", 
  "Sparks", "Archive", "Journal", "Crystals", "Gems", "Collection", "Cluster",
  "Facets", "Framework", "Constellation", "Synthesis", "Mosaic", "Gallery"
];

const secondaryPhrases = [
  "in Progress", "in Motion", "in Bloom", "in Focus", "in Development", 
  "to Remember", "to Explore", "to Organize", "to Inspire", "to Refine",
  "for Later", "for Reference", "for Creativity", "for Insight", "for Planning"
];

/**
 * Generates a creative, positive group name that fits the Note Prism brand theme
 */
export function generateGroupName(): string {
  // Determine structure type (1-4)
  const structureType = Math.floor(Math.random() * 4);
  
  // 1. Basic: [Prefix] [Adjective] [Noun]
  if (structureType === 0) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${prefix} ${adjective} ${noun}`.trim();
  }
  
  // 2. [Noun] [SecondaryPhrase]
  else if (structureType === 1) {
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const phrase = secondaryPhrases[Math.floor(Math.random() * secondaryPhrases.length)];
    return `${noun} ${phrase}`;
  }
  
  // 3. [Adjective] [Noun] [SecondaryPhrase] - less common
  else if (structureType === 2 && Math.random() > 0.5) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const phrase = secondaryPhrases[Math.floor(Math.random() * secondaryPhrases.length)];
    return `${adjective} ${noun} ${phrase}`;
  }
  
  // 4. Prismatic phrases - brand specific
  else {
    const prismPhrases = [
      "Notes", "Ideas", "Thoughts", 
      "Reflections", "Collection"
    ];
    return prismPhrases[Math.floor(Math.random() * prismPhrases.length)];
  }
} 