'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Fuse from 'fuse.js';
import SearchBar from './components/SearchBar';
import styles from './page.module.css';

// Dynamically import PDFViewer to avoid SSR issues
const PDFViewer = dynamic(() => import('./components/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 15px'
      }}></div>
      <p>Loading PDF viewer...</p>
    </div>
  )
});

interface Script {
  name: string;
  filename: string;
  path: string;
}

export default function Home() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [filteredScripts, setFilteredScripts] = useState<Script[]>([]);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [fuse, setFuse] = useState<Fuse<Script> | null>(null);
  const [searchResetTrigger, setSearchResetTrigger] = useState(0);

  useEffect(() => {
    loadScripts();
  }, []);

  const loadScripts = async () => {
    try {
      const response = await fetch('/api/scripts');
      const data = await response.json();
      const scriptsList: Script[] = data.scripts || [];

      setScripts(scriptsList);
      setFilteredScripts(scriptsList);

      // Initialize Fuse.js for fuzzy search
      const fuseInstance = new Fuse<Script>(scriptsList, {
        keys: ['name', 'filename'],
        threshold: 0.4, // 0 = exact match, 1 = match anything
        includeScore: true,
        minMatchCharLength: 2,
      });
      setFuse(fuseInstance);

      setLoading(false);
    } catch (error) {
      console.error('Error loading scripts:', error);
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredScripts(scripts);
      return;
    }

    if (fuse) {
      // Use fuzzy search
      const results = fuse.search(query);
      const matchedScripts = results.map(result => result.item);
      setFilteredScripts(matchedScripts);
    }
  };

  const handleScriptSelect = (script: Script) => {
    setSelectedScript(script);
  };

  const handleBackToScripts = () => {
    setSelectedScript(null);
    setFilteredScripts(scripts); // Reset to show all scripts
    setSearchResetTrigger(prev => prev + 1); // Trigger search bar reset
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={selectedScript ? styles.headerCompact : styles.header}>
          <h1 className={styles.title}>📜 NLP Scripts Viewer</h1>
          {!selectedScript && (
            <p className={styles.subtitle}>
              Search by voice or text to find and view your scripts
            </p>
          )}
        </header>

        {!selectedScript && <SearchBar onSearch={handleSearch} disabled={loading} resetTrigger={searchResetTrigger} />}

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading scripts...</p>
          </div>
        ) : (
          <>
            {!selectedScript && filteredScripts.length > 0 && (
              <div className={styles.scriptsGrid}>
                <h2 className={styles.gridTitle}>
                  {filteredScripts.length === scripts.length
                    ? `All Scripts (${scripts.length})`
                    : `Found ${filteredScripts.length} script${filteredScripts.length !== 1 ? 's' : ''}`}
                </h2>
                <div className={styles.grid}>
                  {filteredScripts.map((script) => (
                    <button
                      key={script.filename}
                      onClick={() => handleScriptSelect(script)}
                      className={styles.scriptCard}
                    >
                      <div className={styles.scriptIcon}>📄</div>
                      <div className={styles.scriptName}>{script.name.replace(/_/g, ' ')}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!selectedScript && filteredScripts.length === 0 && (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>🔍</div>
                <h2>No scripts found</h2>
                <p>Try a different search term or check your voice input</p>
              </div>
            )}

            {selectedScript && (
              <div className={styles.viewerContainer}>
                <button
                  onClick={handleBackToScripts}
                  className={styles.backButton}
                >
                  ← Back to Scripts
                </button>
                <PDFViewer
                  pdfUrl={selectedScript.path}
                  scriptName={selectedScript.name.replace(/_/g, ' ')}
                />
              </div>
            )}

            {!selectedScript && scripts.length === 0 && !loading && (
              <div className={styles.noScripts}>
                <div className={styles.noScriptsIcon}>📂</div>
                <h2>No scripts available</h2>
                <p>Add PDF files to the <code>public/scripts</code> folder to get started</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
