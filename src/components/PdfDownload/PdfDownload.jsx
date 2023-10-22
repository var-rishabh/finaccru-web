import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfContent from './PdfContent';

const PdfDownload = ({ contents, heading }) => {
  return (
    <div>
      <PDFDownloadLink document={<PdfContent contents={contents} heading={heading} />} fileName={`${heading}.pdf`}>
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
