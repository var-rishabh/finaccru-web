import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfContent from './PdfContent';

const PdfDownload = ({ contents, heading }) => {
  return (
    <div className='read__estimate__header--btn2'>
      <PDFDownloadLink document={<PdfContent contents={contents} heading={heading} />} fileName={`${heading}.pdf`}>
        {({ blob, url, loading, error }) => {
          if (loading) return 'Loading ...';
          if (error) return 'Error ...';
          {/* return <a href={url} style={{ color: "var(--white)" }} target="_blank" rel="noreferrer">Download</a>; */}
          return <div style={{ color: "var(--white)" }} target="_blank" rel="noreferrer">Download</div>;
        }}
      </PDFDownloadLink>
    </div>
  );
};

export default PdfDownload;
