import type { SpeechEngine, SpeechEngineOptions, SpeechRecognitionResult } from './SpeechEngine';

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult2;
  [index: number]: SpeechRecognitionResult2;
}

interface SpeechRecognitionResult2 {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

export class WebSpeechEngine implements SpeechEngine {
  onResult: ((result: SpeechRecognitionResult) => void) | null = null;
  onError: ((error: string) => void) | null = null;
  onEnd: (() => void) | null = null;

  private recognition: SpeechRecognition | null = null;

  isSupported(): boolean {
    return !!(window.SpeechRecognition ?? window.webkitSpeechRecognition);
  }

  start(options: Partial<SpeechEngineOptions> = {}): void {
    if (!this.isSupported()) {
      this.onError?.('Web Speech API no disponible en aquest navegador');
      return;
    }

    const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    this.recognition = new SpeechRecognitionCtor();
    this.recognition.lang = options.language ?? 'ca-ES';
    this.recognition.continuous = options.continuous ?? false;
    this.recognition.interimResults = options.interimResults ?? true;
    this.recognition.maxAlternatives = 3;

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      const alternative = result[0];
      this.onResult?.({
        transcript: alternative.transcript.trim().toLowerCase(),
        confidence: alternative.confidence,
        isFinal: result.isFinal,
      });
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      this.onError?.(event.error);
    };

    this.recognition.onend = () => {
      this.onEnd?.();
    };

    this.recognition.start();
  }

  stop(): void {
    this.recognition?.stop();
  }
}
