const NATURAL_VOICE_NAMES = [
  "natural",
  "google",
  "microsoft",
  "dalia",
  "jorge",
  "paulina",
  "monica",
  "marisol",
  "diego",
];

const MAYA_PHONETICS: Record<string, string> = {
  "Ba'ax ka wa'alik": "Báash ka waálik",
  "Ma'alob k'iin": "Máalob kiin",
  "Yuum bo'otik": "Yuum boótik",
  "Bix a beel": "Bish a beel",
  "Bix a beel?": "Bish a beel",
  "K'a'abéet ten áantaj": "Káabéet ten áantaj",
  "Bajux u tojol": "Bajush u tojol",
  "In k'áat in konej le ba'ax in beetik": "In káat in konej le báash in beetik",
  "Ko'ox": "Koósh",
};

function voiceScore(voice: SpeechSynthesisVoice) {
  const name = voice.name.toLocaleLowerCase("es-MX");
  const language = voice.lang.toLocaleLowerCase("es-MX");
  let score = 0;

  if (language === "es-mx") score += 100;
  else if (language.startsWith("es-419")) score += 90;
  else if (language.startsWith("es")) score += 70;
  NATURAL_VOICE_NAMES.forEach((keyword, index) => {
    if (name.includes(keyword)) score += 40 - index;
  });
  if (name.includes("espeak") || name.includes("compact")) score -= 30;

  return score;
}

function bestSpanishVoice() {
  return window.speechSynthesis
    .getVoices()
    .filter(voice => voice.lang.toLocaleLowerCase("es-MX").startsWith("es"))
    .sort((a, b) => voiceScore(b) - voiceScore(a))[0];
}

export function speakNaturally(text: string, options?: { maya?: boolean }) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const spokenText = options?.maya
    ? MAYA_PHONETICS[text] ?? text.replaceAll("'", "").replaceAll("x", "sh")
    : text;
  const utterance = new SpeechSynthesisUtterance(spokenText);
  const voice = bestSpanishVoice();

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = "es-MX";
  }

  utterance.rate = options?.maya ? 0.82 : 0.94;
  utterance.pitch = options?.maya ? 1.04 : 1.02;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);

  return utterance;
}
