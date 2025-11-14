import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Typography } from '@mui/material';

interface PdfDocumentViewerProps {
  guid: string;
  onClose?: () => void;
}

const PdfDocumentViewer: React.FC<PdfDocumentViewerProps> = ({ guid, onClose }) => {
  const { t } = useTranslation();
  
  return (
    <Box 
      sx={{ 
        height: '100%', 
        minHeight: '600px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Box textAlign="center">
        <CircularProgress size={48} />
        <Typography sx={{ mt: 2 }} variant="body1">
          {t('label:application.document.pdfViewer.opening')}
        </Typography>
      </Box>
    </Box>
  );
};

export default PdfDocumentViewer;