import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfContent from './PdfContent';

const PdfDownload = (content, name) => {
  const contentTest = ['Section 1 content', 'Section 2 content', /* Add more sections */];

  return (
    <div>
      <PDFDownloadLink document={<PdfContent content={contentTest} />} fileName={`${"name"}.pdf`}>
        {({ blob, url, loading, error }) => {
          if (loading) return 'Loading document...';
          if (error) return 'Error loading document...';
          return <a href={url} target="_blank">Download PDF</a>;
        }}
      </PDFDownloadLink>
    </div>
  );
};

export default PdfDownload;
