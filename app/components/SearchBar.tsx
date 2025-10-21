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
  const [errorMessage, setErrorMessage] = useState('');

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
      recognitionInstance.interimResults = true; // Show interim results for better feedback
      recognitionInstance.maxAlternatives = 3; // Improve accuracy
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setErrorMessage('');
        setIsListening(true);
      };

      recognitionInstance.onaudiostart = () => {
        setErrorMessage('Listening... Speak now');
      };

      recognitionInstance.onresult = (event: any) => {
        let transcript = '';
        // Get the final result or the latest interim result
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript = event.results[i][0].transcript;
          } else {
            transcript = event.results[i][0].transcript;
            setSearchQuery(transcript); // Show interim results
          }
        }

        if (transcript) {
          setSearchQuery(transcript);
          onSearch(transcript);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);

        // Provide user-friendly error messages
        switch(event.error) {
          case 'no-speech':
            setErrorMessage('No speech detected. Please try again.');
            break;
          case 'audio-capture':
            setErrorMessage('Microphone not found. Please check your device settings.');
            break;
          case 'not-allowed':
            setErrorMessage('Microphone access denied. Please enable microphone permissions.');
            break;
          case 'network':
            setErrorMessage('Network error. Please check your connection.');
            break;
          default:
            setErrorMessage('Voice recognition failed. Please try typing instead.');
        }

        // Clear error after 5 seconds
        setTimeout(() => setErrorMessage(''), 5000);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        if (!errorMessage) {
          setErrorMessage('');
        }
      };

      setRecognition(recognitionInstance);
    }
  }, [onSearch]);

  const handleVoiceSearch = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        setErrorMessage('');
        try {
          recognition.start();
        } catch (error) {
          console.error('Error starting recognition:', error);
          setErrorMessage('Failed to start microphone. Please try again.');
          setTimeout(() => setErrorMessage(''), 5000);
        }
      }
    } else {
      setErrorMessage('Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      setTimeout(() => setErrorMessage(''), 5000);
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
          title="Voice search - Tap and speak"
          aria-label="Voice search"
        >
          {isListening ? '🎙️' : '🎤'}
        </button>
      </form>
      {isListening && !errorMessage && <p className={styles.listeningText}>Listening...</p>}
      {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
    </div>
  );
}
