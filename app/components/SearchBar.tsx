'use client';

import { useState, useEffect } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  disabled?: boolean;
  resetTrigger?: number;
}

export default function SearchBar({ onSearch, disabled, resetTrigger }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Reset search query when resetTrigger changes
  useEffect(() => {
    if (resetTrigger !== undefined) {
      setSearchQuery('');
    }
  }, [resetTrigger]);

  useEffect(() => {
    // Initialize speech recognition if available
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        onSearch(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onSearch]);

  const handleVoiceSearch = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        setIsListening(true);
        recognition.start();
      }
    } else {
      alert('Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
    }
  };

  const handleTextSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Auto-search as user types (debounced effect would be better for production)
    if (value.length > 0) {
      onSearch(value);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleTextSearch} className={styles.searchForm}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search for a script..."
          className={styles.searchInput}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={handleVoiceSearch}
          className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
          disabled={disabled}
          title="Voice search"
        >
          {isListening ? '🎙️' : '🎤'}
        </button>
      </form>
      {isListening && <p className={styles.listeningText}>Listening...</p>}
    </div>
  );
}
