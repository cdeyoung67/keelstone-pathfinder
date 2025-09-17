// Content library with quotes and virtue-based content

import { Quote, CardinalVirtue } from './types';

// Sample quotes organized by virtue and door
// In production, this would be your curated year's worth of content
export const SAMPLE_QUOTES: Record<CardinalVirtue, Record<'christian' | 'secular', Quote[]>> = {
  wisdom: {
    christian: [
      {
        text: "The fear of the Lord is the beginning of wisdom, and knowledge of the Holy One is understanding.",
        source: "Proverbs 9:10",
        type: "biblical",
        bibleVersion: "niv"
      },
      {
        text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
        source: "Proverbs 3:5-6",
        type: "biblical", 
        bibleVersion: "niv"
      },
      {
        text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
        source: "James 1:5",
        type: "biblical",
        bibleVersion: "niv"
      },
      {
        text: "The simple believe anything, but the prudent give thought to their steps.",
        source: "Proverbs 14:15",
        type: "biblical",
        bibleVersion: "niv"
      },
      {
        text: "Plans fail for lack of counsel, but with many advisers they succeed.",
        source: "Proverbs 15:22",
        type: "biblical",
        bibleVersion: "niv"
      }
    ],
    secular: [
      {
        text: "The only true wisdom is in knowing you know nothing.",
        source: "Socrates",
        type: "wisdom"
      },
      {
        text: "It is impossible for a man to learn what he thinks he already knows.",
        source: "Epictetus",
        type: "stoic"
      },
      {
        text: "The fool doth think he is wise, but the wise man knows himself to be a fool.",
        source: "William Shakespeare",
        type: "wisdom"
      },
      {
        text: "Wisdom begins in wonder.",
        source: "Socrates", 
        type: "wisdom"
      },
      {
        text: "The unexamined life is not worth living.",
        source: "Socrates",
        type: "wisdom"
      }
    ]
  },
  
  courage: {
    christian: [
      {
        text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
        source: "Joshua 1:9",
        type: "biblical",
        bibleVersion: "niv"
      },
      {
        text: "The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?",
        source: "Psalm 27:1",
        type: "biblical",
        bibleVersion: "niv"
      },
      {
        text: "I can do all this through him who gives me strength.",
        source: "Philippians 4:13",
        type: "biblical",
        bibleVersion: "niv"
      },
      {
        text: "When I am afraid, I put my trust in you.",
        source: "Psalm 56:3",
        type: "biblical",
        bibleVersion: "niv"
      },
      {
        text: "Be strong and take heart, all you who hope in the Lord.",
        source: "Psalm 31:24",
        type: "biblical",
        bibleVersion: "niv"
      }
    ],
    secular: [
      {
        text: "Courage is not the absence of fear, but rather the assessment that something else is more important than fear.",
        source: "Franklin D. Roosevelt",
        type: "wisdom"
      },
      {
        text: "You have power over your mind—not outside events. Realize this, and you will find strength.",
        source: "Marcus Aurelius",
        type: "stoic"
      },
      {
        text: "The brave may not live forever, but the cautious do not live at all.",
        source: "Richard Branson",
        type: "wisdom"
      },
      {
        text: "It is during our darkest moments that we must focus to see the light.",
        source: "Aristotle",
        type: "wisdom"
      },
      {
        text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
        source: "Ralph Waldo Emerson",
        type: "wisdom"
      }
    ]
  },
  
  justice: {
    christian: [
      {
        text: "He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God.",
        source: "Micah 6:8",
        type: "biblical",
        bibleVersion: "niv"
      },
      {
        text: "Love your neighbor as yourself.",
        source: "Mark 12:31",
        type: "biblical",
        bibleVersion: "niv"
      },
      {
        text: "Defend the weak and the fatherless; uphold the cause of the poor and the oppressed.",
        source: "Psalm 82:3",
        type: "biblical",
        bibleVersion: "niv"
      },
      {
        text: "Let justice roll on like a river, righteousness like a never-failing stream!",
        source: "Amos 5:24",
        type: "biblical",
        bibleVersion: "niv"
      },
      {
        text: "Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you.",
        source: "Colossians 3:13",
        type: "biblical",
        bibleVersion: "niv"
      }
    ],
    secular: [
      {
        text: "Injustice anywhere is a threat to justice everywhere.",
        source: "Martin Luther King Jr.",
        type: "wisdom"
      },
      {
        text: "The best way to find yourself is to lose yourself in the service of others.",
        source: "Mahatma Gandhi",
        type: "wisdom"
      },
      {
        text: "No one can hurt you without your permission.",
        source: "Eleanor Roosevelt",
        type: "wisdom"
      },
      {
        text: "We were born to work together like feet, hands, and eyes, like the two rows of teeth, upper and lower.",
        source: "Marcus Aurelius",
        type: "stoic"
      },
      {
        text: "The measure of a civilization is how it treats its weakest members.",
        source: "Mahatma Gandhi",
        type: "wisdom"
      }
    ]
  },
  
  temperance: {
    christian: [
      {
        text: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.",
        source: "Galatians 5:22-23",
        type: "biblical",
        bibleVersion: "niv"
      },
      {
        text: "Be still, and know that I am God.",
        source: "Psalm 46:10",
        type: "biblical",
        bibleVersion: "niv"
      },
      {
        text: "Come to me, all you who are weary and burdened, and I will give you rest.",
        source: "Matthew 11:28",
        type: "biblical",
        bibleVersion: "niv"
      },
      {
        text: "A person without self-control is like a city broken into and left without walls.",
        source: "Proverbs 25:28",
        type: "biblical",
        bibleVersion: "niv"
      },
      {
        text: "In your anger do not sin: Do not let the sun go down while you are still angry.",
        source: "Ephesians 4:26",
        type: "biblical",
        bibleVersion: "niv"
      }
    ],
    secular: [
      {
        text: "Moderation in all things, including moderation.",
        source: "Oscar Wilde",
        type: "wisdom"
      },
      {
        text: "You have power over your mind—not outside events. Realize this, and you will find strength.",
        source: "Marcus Aurelius",
        type: "stoic"
      },
      {
        text: "The best fighter is never angry.",
        source: "Lao Tzu",
        type: "wisdom"
      },
      {
        text: "Between stimulus and response there is a space. In that space is our power to choose our response. In our response lies our growth and our freedom.",
        source: "Viktor Frankl",
        type: "wisdom"
      },
      {
        text: "Peace cannot be kept by force; it can only be achieved by understanding.",
        source: "Albert Einstein",
        type: "wisdom"
      }
    ]
  }
};

// Bible version variations for key verses
// This would be expanded with your actual quote library
export const BIBLE_VERSION_VARIATIONS: Record<string, Record<string, string>> = {
  "Joshua 1:9": {
    kjv: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest.",
    niv: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    esv: "Have I not commanded you? Be strong and courageous. Do not be frightened, and do not be dismayed, for the Lord your God is with you wherever you go.",
    nlt: "This is my command—be strong and courageous! Do not be afraid or discouraged. For the Lord your God is with you wherever you go.",
    msg: "Haven't I commanded you? Strength! Courage! Don't be timid; don't get discouraged. God, your God, is with you every step you take."
  },
  "Proverbs 3:5-6": {
    kjv: "Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
    niv: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    esv: "Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.",
    nlt: "Trust in the Lord with all your heart; do not depend on your own understanding. Seek his will in all you do, and he will show you which path to take.",
    msg: "Trust God from the bottom of your heart; don't try to figure out everything on your own. Listen for God's voice in everything you do, everywhere you go; he's the one who will keep you on track."
  }
};

// Virtue descriptions for the intake form
export const VIRTUE_DESCRIPTIONS = {
  wisdom: {
    title: "Wisdom",
    subtitle: "Discerning, but not proud",
    description: "The ability to make sound judgments and navigate life's complexities with understanding and humility."
  },
  courage: {
    title: "Courage", 
    subtitle: "Brave, but not reckless",
    description: "The strength to face difficulties, take right action, and persevere through challenges with measured boldness."
  },
  justice: {
    title: "Justice",
    subtitle: "Fair, but not harsh", 
    description: "The commitment to fairness, compassion, and right relationships with others and community."
  },
  temperance: {
    title: "Temperance",
    subtitle: "Steady, but not rigid",
    description: "The practice of moderation, self-control, and finding healthy balance in all areas of life."
  }
} as const;
