import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfContent from './PdfContent';
import './PdfDownload.css';

const PdfDownload = ({ contents, heading, name, logo }) => {
  return (
    <div className='pdf__download--button'>
      <PDFDownloadLink document={<PdfContent contents={contents} heading={heading} logo={logo} />} fileName={`${name}.pdf`}>
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
