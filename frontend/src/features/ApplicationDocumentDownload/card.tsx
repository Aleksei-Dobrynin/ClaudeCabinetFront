import React, { useEffect, useState, useRef } from "react";
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Alert,
  AlertTitle,
  styled,
  CircularProgress,
  Button,
  Stack
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArticleIcon from '@mui/icons-material/Article';
import SecurityIcon from '@mui/icons-material/Security';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import store from './store';
import FileViewer from 'components/FileViewer';
import i18n from "../../i18n";
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.3.31/build/pdf.worker.min.mjs`;

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '& .MuiCardHeader-title': {
    fontSize: '1.3rem',
    fontWeight: 600
  },
  '& .MuiCardHeader-subheader': {
    color: theme.palette.primary.contrastText,
    opacity: 0.9
  }
}));

const InfoLabel = styled(Typography)({
  color: '#757575',
  fontSize: '14px',
  marginBottom: '4px'
});

const InfoValue = styled(Typography)({
  fontSize: '16px',
  marginBottom: '12px'
});

const SignatureTable = ({ signatures }) => {
  const { t } = useTranslation();
  
  return (
  <TableContainer component={Box} sx={{ marginTop: 2, maxWidth: '100%', mb: 2 }}>
    <Table aria-label="signature table" size="small">
      <TableHead>
        <TableRow sx={{ backgroundColor: 'grey.100' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>{t('label:application.document.signature.whoSigned')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>{t('label:application.document.signature.whenSigned')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {signatures.map((signature) => (
          <TableRow key={signature.id} hover>
            <TableCell>{signature.user_full_name}</TableCell>
            <TableCell>
              {signature.timestamp && dayjs(signature.timestamp).format("DD.MM.YYYY HH:mm")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
};

const OfficialStamp = () => {
  const { t } = useTranslation();
  
  return (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      mt: 4,
      mb: 2,
      p: 2,
      border: '1px dashed',
      borderColor: 'primary.main',
      borderRadius: 1
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 1
      }}
    >
      <SecurityIcon color="primary" />
      <Typography variant="h6" color="primary.main">
          {t('label:application.document.officialStamp.title')}
      </Typography>
    </Box>
    <Typography variant="body1" align="center">
        {t('label:application.document.officialStamp.description')}
    </Typography>
  </Box>
);
};

const LoadingCard = () => {
  const { t } = useTranslation();
  
  return (
  <Card elevation={0}>
    <StyledCardHeader
      avatar={<CircularProgress size={24} color="inherit" />}
        title={t('label:application.document.loading.title')}
        subheader={t('label:application.document.loading.subtitle')}
    />
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    </CardContent>
  </Card>
);
};

const DocumentReadyForDownload = () => {
  const { t } = useTranslation();
  const query = new URLSearchParams(window.location.search);
  const guid = query.get("guid");

  useEffect(() => {
    if (guid && !store.filePath) {
      store.viewPdfInline(guid);
    }
  }, [guid]);

  const handleViewPdf = async () => {
    if (guid) {
      await store.viewPdfInNewTab(guid);
    }
  };

  const handleDownload = () => {
    if (guid) {
      store.downloadDocument(guid);
    }
  };

  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(300);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
      }
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  return (
    <Card elevation={0}>


      <FileViewer
        isOpen={store.isOpenFileView}
        onClose={() => { store.isOpenFileView = false }}
        fileUrl={store.fileUrl}
        fileType={store.fileType} />


      <StyledCardHeader
        avatar={<ArticleIcon />}
        title={t('label:application.document.readyForDownload.title')}
        subheader={t('label:application.document.readyForDownload.subtitle', { date: dayjs().format('DD.MM.YYYY') })}
      />
      <CardContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>{t('label:application.document.readyForDownload.alertTitle')}</AlertTitle>
          {t('label:application.document.readyForDownload.alertDescription')}
        </Alert>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <Box>
            <InfoLabel>{t('label:application.document.fileName')}</InfoLabel>
            <InfoValue>
              {store.isPdfFile && <PictureAsPdfIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'error.main' }} />}
              {store.file_name}
            </InfoValue>
          </Box>

          <TableContainer component={Box} sx={{ marginTop: 2, maxWidth: '100%', mb: 2 }}>
            <Table aria-label="signature table" size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t('label:application.document.fileName')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t('label:application.document.fileType')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  <TableCell>{store.file_name}</TableCell>
                  <TableCell>{store.file_type_name}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Divider />

          <Box>
            <InfoLabel>{t('label:application.document.signatureInfo')}</InfoLabel>
            <SignatureTable signatures={store.signs} />
          </Box>
        </Box>

        {store.isPdfFile && store.filePath && (
          <Box sx={{ mb: 3 }}>
            {/* Кнопки действий для документа */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              sx={{ mb: 2 }}
              justifyContent="flex-end"
            >

              <Button
                variant="contained"
                size="medium"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                disabled={store.isLoading}
              >
                {t('label:application.document.actions.downloadDocument') || 'Скачать'}
              </Button>
            </Stack>

            {/* Область просмотра документа */}
            <Box
              sx={{
                width: "100%",
                maxWidth: "100%",
                mx: "auto",
                maxHeight: 600,
                overflowY: "auto",
                border: 1,
                borderColor: "grey.300",
                borderRadius: 1,
                p: 2
              }}
            >
              <div ref={containerRef} style={{ width: "100%" }}>
                <Document
                  file={store.filePath}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={console.error}
                  loading={<Typography>{t('label:application.document.loading_document')}</Typography>}
                >
                  {Array.from({ length: numPages }, (_, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      width={containerWidth}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                    />
                  ))}
                </Document>
              </div>
            </Box>
          </Box>
        )}

        {store.downloadError && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {store.downloadError}
          </Alert>
        )}

        <OfficialStamp />
      </CardContent>
    </Card>
  );
};

const DocumentSuccessfullyDownloaded = () => {
  const { t } = useTranslation();
  
  return (
  <Card elevation={0}>
    <StyledCardHeader
      avatar={<VerifiedIcon />}
        title={t('label:application.document.successfullyDownloaded.title')}
        subheader={t('label:application.document.successfullyDownloaded.subtitle', { date: dayjs().format('DD.MM.YYYY') })}
    />
    <CardContent>
      <Alert severity="success" sx={{ mb: 3 }}>
          <AlertTitle>{t('label:application.document.successfullyDownloaded.alertTitle')}</AlertTitle>
          {t('label:application.document.successfullyDownloaded.alertDescription')}
      </Alert>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
            <InfoLabel>{t('label:application.document.fileName')}</InfoLabel>
          <InfoValue>
            {store.isPdfFile && <PictureAsPdfIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'error.main' }} />}
            {store.file_name}
          </InfoValue>
        </Box>

        <Divider />

        <Box>
            <InfoLabel>{t('label:application.document.signatureInfo')}</InfoLabel>
          <SignatureTable signatures={store.signs} />
        </Box>
      </Box>

      <OfficialStamp />
    </CardContent>
  </Card>
);
};

const DocumentNotFound = () => {
  const { t } = useTranslation();
  
  return (
  <Card elevation={0}>
    <StyledCardHeader
      avatar={<ArticleIcon />}
        title={t('label:application.document.notFound.title')}
        subheader={t('label:application.document.notFound.subtitle')}
    />
    <CardContent>
      <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>{t('label:application.document.notFound.alertTitle')}</AlertTitle>
          {t('label:application.document.notFound.alertDescription')}
      </Alert>
      <Typography variant="body1" color="text.secondary">
          {t('label:application.document.notFound.possibleReasons')}
      </Typography>
      <ul>
        <Typography component="li" variant="body2" color="text.secondary">
            {t('label:application.document.notFound.reason1')}
        </Typography>
        <Typography component="li" variant="body2" color="text.secondary">
            {t('label:application.document.notFound.reason2')}
        </Typography>
        <Typography component="li" variant="body2" color="text.secondary">
            {t('label:application.document.notFound.reason3')}
        </Typography>
      </ul>
    </CardContent>
  </Card>
);
};

const DownloadError = () => {
  const { t } = useTranslation();
  
  return (
  <Card elevation={0}>
    <StyledCardHeader
      avatar={<ErrorOutlineIcon />}
        title={t('label:application.document.downloadError.title')}
        subheader={t('label:application.document.downloadError.subtitle')}
    />
    <CardContent>
      <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>{t('label:application.document.downloadError.alertTitle')}</AlertTitle>
          {store.downloadError || t('label:application.document.downloadError.alertDescription')}
      </Alert>

      {store.documentFound && (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <Box>
                <InfoLabel>{t('label:application.document.fileName')}</InfoLabel>
              <InfoValue>{store.file_name}</InfoValue>
            </Box>
              
            <Divider />

            <Box>
                <InfoLabel>{t('label:application.document.signatureInfo')}</InfoLabel>
              <SignatureTable signatures={store.signs} />
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => {
              const query = new URLSearchParams(window.location.search);
              const guid = query.get("guid");
              if (guid) {
                store.downloadDocument(guid);
              }
            }}
            disabled={store.isLoading}
          >
              {t('label:application.document.actions.tryDownloadAgain')}
          </Button>
        </>
      )}
    </CardContent>
  </Card>
);
};

const InvalidGuidError = () => {
  const { t } = useTranslation();
  
  return (
  <Card elevation={0}>
    <StyledCardHeader
      avatar={<ErrorOutlineIcon />}
        title={t('label:application.document.invalidGuid.title')}
        subheader={t('label:application.document.invalidGuid.subtitle')}
    />
    <CardContent>
      <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>{t('label:application.document.invalidGuid.alertTitle')}</AlertTitle>
          {t('label:application.document.invalidGuid.alertDescription')}
      </Alert>
      <Typography variant="body1" color="text.secondary">
          {t('label:application.document.invalidGuid.instruction')}
      </Typography>
    </CardContent>
  </Card>
);
};

const DocumentDownloadCard = observer(() => {
  const query = new URLSearchParams(window.location.search);
  const guid = query.get("guid");

  if (!guid || guid.trim() === "") {
    return (
      <Paper elevation={5} sx={{ mb: 4, overflow: 'hidden' }}>
        <InvalidGuidError />
      </Paper>
    );
  }

  if (store.isLoading) {
    return (
      <Paper elevation={5} sx={{ mb: 4, overflow: 'hidden' }}>
        <LoadingCard />
      </Paper>
    );
  }

  if (store.downloadError && !store.downloadError.includes("Файл будет скачан")) {
    return (
      <Paper elevation={5} sx={{ mb: 4, overflow: 'hidden' }}>
        <DownloadError />
      </Paper>
    );
  }

  if (store.hasDocument && store.documentFound) {
    return (
      <Paper elevation={5} sx={{ mb: 4, overflow: 'hidden' }}>
        <DocumentSuccessfullyDownloaded />
      </Paper>
    );
  }

  if (store.documentFound && !store.hasDocument) {
    return (
      <Paper elevation={5} sx={{ mb: 4, overflow: 'hidden' }}>
        <DocumentReadyForDownload />
      </Paper>
    );
  }

  if (!store.documentFound && !store.isLoading) {
    return (
      <Paper elevation={5} sx={{ mb: 4, overflow: 'hidden' }}>
        <DocumentNotFound />
      </Paper>
    );
  }

  return (
    <Paper elevation={5} sx={{ mb: 4, overflow: 'hidden' }}>
      <LoadingCard />
    </Paper>
  );
});

export default DocumentDownloadCard;