'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import styles from './PDFViewer.module.css';

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  pdfUrl: string;
  scriptName: string;
}

export default function PDFViewer({ pdfUrl, scriptName }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isMobile, setIsMobile] = useState<boolean>(false);


  // Detect mobile and set appropriate initial scale
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        // Set scale to fit mobile screen width (approx 0.5 for most mobiles)
        const mobileScale = Math.min(window.innerWidth / 600, 1.0);
        setScale(mobileScale);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function zoomIn() {
    setScale(prev => Math.min(prev + 0.1, 2.0));
  }

  function zoomOut() {
    setScale(prev => Math.max(prev - 0.1, 0.3));
  }

  return (
    <div className={styles.container}>
      <div className={styles.floatingControls}>
        <div className={styles.controlsGroup}>
          <button onClick={zoomOut} disabled={scale <= 0.3} className={styles.button}>
            🔍−
          </button>
          <span className={styles.zoomLevel}>{Math.round(scale * 100)}%</span>
          <button onClick={zoomIn} disabled={scale >= 2.0} className={styles.button}>
            🔍+
          </button>
        </div>
        <div className={styles.controlsGroup}>
          <button
            onClick={previousPage}
            disabled={pageNumber <= 1}
            className={styles.button}
          >
            ← Previous
          </button>
          <span className={styles.pageInfo}>
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={nextPage}
            disabled={pageNumber >= numPages}
            className={styles.button}
          >
            Next →
          </button>
        </div>
      </div>

      <div className={styles.documentContainer}>
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading PDF...</p>
            </div>
          }
          error={
            <div className={styles.error}>
              <p>Failed to load PDF file.</p>
              <p>Please check if the file exists.</p>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  );
}
