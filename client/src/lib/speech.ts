let speaking = false;

export function speak(text: string, volume: number = 80) {
  if (!speaking && "speechSynthesis" in window) {
    speaking = true;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.volume = volume / 100;
    utterance.onend = () => {
      speaking = false;
    };
    window.speechSynthesis.speak(utterance);
  }
}
