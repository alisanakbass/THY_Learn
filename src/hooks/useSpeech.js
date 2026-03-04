import { useState, useCallback, useEffect } from "react";

export function useSpeech() {
    const [speaking, setSpeaking] = useState(false);

    // Bazı tarayıcılarda seslerin yüklenmesini tetiklemek için eklenen boş fonksiyon
    useEffect(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.getVoices();
        }
    }, []);

    const speak = useCallback((text, rate = 1.0, voiceLang = "en-US") => {
        if (!window.speechSynthesis) {
            console.error("Tarayıcı Web Speech API desteklemiyor.");
            return;
        }

        // Mevcut konuşma varsa durdur
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);

        // Garbage collector bu nesneyi hafızadan silmesin diye window nesnesine kopyalıyoruz
        window.utterances = window.utterances || [];
        window.utterances.push(utterance);

        utterance.lang = voiceLang; // Kesinlikle dil belirtilmeli
        utterance.rate = rate;
        utterance.pitch = 1;
        utterance.volume = 1;

        // O an yüklü olan sesleri al
        const currentVoices = window.speechSynthesis.getVoices();
        if (currentVoices.length > 0) {
            // İstenen dilde olan veya direkt İngilizce (en) ile başlayan bir ses bul
            let selectedVoice =
                currentVoices.find((v) => v.lang === voiceLang) ||
                currentVoices.find((v) => v.lang.startsWith("en"));
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
        }

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => {
            setSpeaking(false);
            // Bittiğinde diziden silebiliriz (hafıza şişmesin)
            window.utterances = window.utterances.filter((u) => u !== utterance);
        };
        utterance.onerror = (e) => {
            // Canceled hatasını raporlama maskesi
            if (e.error !== "interrupted" && e.error !== "canceled") {
                console.error("Speech synthesis error:", e);
            }
            setSpeaking(false);
            window.utterances = window.utterances.filter((u) => u !== utterance);
        };

        window.speechSynthesis.speak(utterance);
    }, []);

    const stop = useCallback(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        setSpeaking(false);
    }, []);

    const speakSlow = useCallback((text) => speak(text, 0.7), [speak]);
    const speakNormal = useCallback((text) => speak(text, 1.0), [speak]);
    const speakFast = useCallback((text) => speak(text, 1.3), [speak]);

    return { speak, speakSlow, speakNormal, speakFast, stop, speaking };
}
