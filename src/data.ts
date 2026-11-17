export type Skill = 'vocabulary' | 'grammar' | 'reading';
export interface Question {
  id: string; skill: Skill; topic: string; difficulty: 1 | 2 | 3;
  passage?: string; prompt: string; options: string[]; answer: number; why: string;
}
export const SKILL_LABEL: Record<Skill, string> = { vocabulary: 'Vocabulary', grammar: 'Grammar', reading: 'Reading' };

const MSG = 'Hallo Anna,\nich arbeite heute bis 18 Uhr. Bitte kaufe Brot und Milch. Das Essen ist im Kühlschrank. Um 19 Uhr treffen wir uns vor dem Kino.\nLiebe Grüße, Tom';
const SIGN = 'Bäckerei Müller\nÖffnungszeiten: Montag bis Freitag 7:00–18:00 Uhr, Samstag 7:00–13:00 Uhr, Sonntag geschlossen.';

export const QUESTIONS: Question[] = [
  { id: 'v1', skill: 'vocabulary', topic: 'greetings', difficulty: 1, prompt: 'It is 9 a.m. and you meet your teacher. What do you say?', options: ['Gute Nacht', 'Guten Morgen', 'Guten Abend', 'Auf Wiedersehen'], answer: 1, why: '"Guten Morgen" is the morning greeting.' },
  { id: 'v2', skill: 'vocabulary', topic: 'places', difficulty: 1, prompt: 'What does "der Bahnhof" mean?', options: ['Airport', 'Hospital', 'Train station', 'Bakery'], answer: 2, why: 'Der Bahnhof = train station.' },
  { id: 'v3', skill: 'vocabulary', topic: 'food', difficulty: 1, prompt: 'Ich möchte ein Brötchen mit ____.', options: ['Schuhe', 'Bus', 'Montag', 'Käse'], answer: 3, why: 'Käse (cheese) is the only food word.' },
  { id: 'v4', skill: 'vocabulary', topic: 'numbers', difficulty: 2, prompt: 'How do you write 47 in German?', options: ['vierundsiebzig', 'siebenundvierzig', 'siebzehn', 'vierzigsieben'], answer: 1, why: 'German says the ones first: sieben-und-vierzig = 47. Vierundsiebzig is 74.' },
  { id: 'v5', skill: 'vocabulary', topic: 'time', difficulty: 3, prompt: '"Es ist halb drei." What time is it?', options: ['3:30', '2:15', '2:30', '3:00'], answer: 2, why: '"Halb drei" means half an hour before three: 2:30, not 3:30.' },
  { id: 'g1', skill: 'grammar', topic: 'verb-conjugation', difficulty: 1, prompt: 'Er ____ gern Fußball.', options: ['spiele', 'spielst', 'spielt', 'spielen'], answer: 2, why: 'er/sie/es takes -t: er spielt.' },
  { id: 'g2', skill: 'grammar', topic: 'articles-gender', difficulty: 1, prompt: '____ Buch ist interessant.', options: ['Der', 'Die', 'Das', 'Den'], answer: 2, why: 'Buch is neuter: das Buch.' },
  { id: 'g3', skill: 'grammar', topic: 'negation', difficulty: 2, prompt: 'Ich habe ____ Auto.', options: ['nicht', 'kein', 'keine', 'nichts'], answer: 1, why: 'Use kein to negate a noun with ein/no article. Nicht negates verbs or adjectives.' },
  { id: 'g4', skill: 'grammar', topic: 'accusative', difficulty: 2, prompt: 'Ich kaufe ____ Apfel.', options: ['ein', 'einen', 'eine', 'einem'], answer: 1, why: 'Der Apfel is masculine and the direct object, so ein becomes einen.' },
  { id: 'g5', skill: 'grammar', topic: 'word-order', difficulty: 3, prompt: 'Which sentence is correct?', options: ['Ich heute gehe zur Schule.', 'Heute ich gehe zur Schule.', 'Heute gehe ich zur Schule.', 'Gehe heute ich zur Schule.'], answer: 2, why: 'The verb is always in position 2: Heute (1) gehe (2) ich.' },
  { id: 'r1', skill: 'reading', topic: 'reading-messages', difficulty: 1, passage: MSG, prompt: 'Until when does Tom work?', options: ['16:00', '18:00', '19:00', '20:00'], answer: 1, why: '"bis 18 Uhr" = until 18:00.' },
  { id: 'r2', skill: 'reading', topic: 'reading-messages', difficulty: 1, passage: MSG, prompt: 'What should Anna buy?', options: ['Bread and milk', 'Bread and cheese', 'Milk and fruit', 'Dinner'], answer: 0, why: '"Brot und Milch" = bread and milk. Dinner is already in the fridge.' },
  { id: 'r3', skill: 'reading', topic: 'reading-messages', difficulty: 2, passage: MSG, prompt: 'Where do they meet at 19:00?', options: ['At home', 'At work', 'In front of the cinema', 'At the station'], answer: 2, why: '"vor dem Kino" = in front of the cinema.' },
  { id: 'r4', skill: 'reading', topic: 'reading-notices', difficulty: 2, passage: SIGN, prompt: 'Can you buy bread on Sunday?', options: ['Yes, all day', 'Yes, until 13:00', 'Only in the morning', 'No, it is closed'], answer: 3, why: '"Sonntag geschlossen" = closed on Sunday.' },
  { id: 'r5', skill: 'reading', topic: 'reading-notices', difficulty: 3, passage: SIGN, prompt: 'When does the bakery close on Saturday?', options: ['12:00', '13:00', '14:00', '18:00'], answer: 1, why: 'Samstag 7:00–13:00 Uhr: it closes at 13:00. 18:00 is the weekday closing time.' },
];

export const TIPS: Record<string, { title: string; action: string }> = {
  greetings: { title: 'Greetings by time of day', action: 'Learn Guten Morgen / Tag / Abend / Gute Nacht and when each is used. Say each aloud with a situation.' },
  places: { title: 'City places', action: 'Learn 20 place words with their articles (der Bahnhof, die Apotheke, die Bank). Label places on a map.' },
  food: { title: 'Food and drink words', action: 'Learn 20 words and practise ordering: "Ich möchte ein/einen/eine ...".' },
  numbers: { title: 'Numbers 13 to 100', action: 'German says the ones first (47 = siebenundvierzig). Write 10 phone numbers or prices out in words.' },
  time: { title: 'Clock times', action: 'Practise "Wie spät ist es?" with halb, Viertel vor/nach. Remember: halb drei = 2:30.' },
  'verb-conjugation': { title: 'Present-tense endings', action: 'Conjugate 10 regular verbs for ich/du/er/wir/ihr/sie: endings -e, -st, -t, -en, -t, -en.' },
  'articles-gender': { title: 'Der / die / das', action: 'Learn every noun with its article as one unit. Add 10 new nouns a day and test yourself.' },
  negation: { title: 'kein vs nicht', action: 'kein negates nouns (Ich habe kein Auto). nicht negates verbs and adjectives. Write 10 sentences of each.' },
  accusative: { title: 'Accusative case', action: 'Only masculine changes: der to den, ein to einen. Write 15 sentences with kaufen, haben, sehen.' },
  'word-order': { title: 'Verb in position 2', action: 'Rewrite 10 sentences starting with a time word (Heute, Morgen). The verb stays second.' },
  'reading-messages': { title: 'Short messages', action: 'Read 5 short messages and underline the times, places and things. Answer who, when, where.' },
  'reading-notices': { title: 'Notices and signs', action: 'Practise opening hours and signs. Learn geöffnet, geschlossen, Montag bis Freitag.' },
};

export const FILLERS = [
  { title: 'Take a timed official mock', action: 'Do the free Goethe A1 Modellsatz on goethe.de under exam timing before you book.' },
  { title: 'Practise listening, writing and speaking', action: 'This check cannot test them, but they are most of the exam. Practise with audio, a short form and a spoken self-introduction.' },
];
