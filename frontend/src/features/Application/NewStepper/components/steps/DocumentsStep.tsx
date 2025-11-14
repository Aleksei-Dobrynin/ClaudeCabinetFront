// components/steps/DocumentsStep.tsx

import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  IconButton,
  Tooltip,
  LinearProgress,
  Chip,
  Divider,
  CircularProgress,
  Stack
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  CheckCircle,
  Warning,
  InsertDriveFile,
  Visibility
} from '@mui/icons-material';
import { rootStore } from '../../stores/RootStore';
import FileViewer from "components/FileViewer";

const DocumentsStep: React.FC = observer(() => {
  const { t, i18n } = useTranslation();
  const { documentsStore } = rootStore;
  const fileInputRefs = React.useRef<Record<number, HTMLInputElement | null>>({});

  // Получаем текущий язык
  const currentLanguage = i18n.language;

  // Функция для получения названия документа в зависимости от языка
  const getDocumentName = (doc: any) => {
    if (currentLanguage === 'ky-KG' && doc.doc_name_kg) {
      return doc.doc_name_kg;
    }
    return doc.doc_name;
  };

  React.useEffect(() => {
    if (rootStore.currentStep === 2) {
      documentsStore.loadInitialData();
    }
  }, [rootStore.currentStep]);

  const handleFileSelect = (documentId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      // if (file.size > 10 * 1024 * 1024) {
      //   rootStore.showSnackbar(t('label:steps.documents.fileSizeError'), "error");
      //   return;
      // }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        rootStore.showSnackbar(t('label:steps.documents.fileTypeError'), "error");
        return;
      }

      documentsStore.uploadFile(documentId, file);
    }

    // Reset input value
    event.target.value = '';
  };

  const handleUploadClick = (documentId: number) => {
    const input = fileInputRefs.current[documentId];
    if (input) {
      input.click();
    }
  };

  const renderDocument = (doc: any) => {
    const isUploaded = documentsStore.isDocumentUploaded(doc.id);
    const isUploading = documentsStore.isUploading(doc.id);
    const uploadProgress = documentsStore.getUploadProgress(doc.id);

    return (
      <Box key={doc.id} sx={{ py: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2} flex={1}>
            <InsertDriveFile color={isUploaded ? "success" : "action"} />
            <Box flex={1}>
              <Typography variant="body1">
                {getDocumentName(doc)}
              </Typography>
              {isUploaded && doc.file_name && (
                <Typography variant="caption" color="text.secondary">
                  {doc.file_name}
                </Typography>
              )}
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            {isUploading ? (
              <Box sx={{ width: 100, mr: 1 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            ) : (
              <>
                {isUploaded && (
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={t('label:steps.documents.uploaded')}
                      size="small"
                      color="success"
                      icon={<CheckCircle />}
                    />
                    <Tooltip title={t('label:steps.documents.view')}>
                      <IconButton size="small" onClick={()=>{
                        documentsStore.OpenFileFile(doc.file_id, doc.file_name)
                      }}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                )}

                <Button
                  variant={isUploaded ? "outlined" : "contained"}
                  size="small"
                  startIcon={<CloudUpload />}
                  onClick={() => handleUploadClick(doc.id)}
                  disabled={isUploading}
                >
                  {isUploaded ? t('label:steps.documents.replace') : t('label:steps.documents.upload')}
                </Button>

                <input
                  ref={el => fileInputRefs.current[doc.id] = el}
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileSelect(doc.id, e)}
                />
              </>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  if (documentsStore.isLoadingDocuments) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const mandatoryDocs = documentsStore.mandatoryDocuments;
  const optionalDocs = documentsStore.optionalDocuments;
  const hasUnuploadedMandatory = mandatoryDocs.some(doc => !documentsStore.isDocumentUploaded(doc.id));

  return (
    <Box>
      <FileViewer
        isOpen={documentsStore.isOpenFileView}
        onClose={() => { documentsStore.isOpenFileView = false }}
        fileUrl={documentsStore.fileUrl}
        fileType={documentsStore.fileType} />

      <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
        {t('label:steps.documents.title')}
      </Typography>

      {/* Status Alert */}
      {documentsStore.isAllRequiredUploaded ? (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight={600}>
            {t('label:steps.documents.allRequiredUploaded')}
          </Typography>
        </Alert>
      ) : (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight={600}>
            {t('label:steps.documents.uploadAllRequired')}
          </Typography>
        </Alert>
      )}

      {/* Mandatory Documents */}
      {mandatoryDocs.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Typography
                variant="h6"
                color={hasUnuploadedMandatory ? "error" : "success"}
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                {hasUnuploadedMandatory ? <Warning /> : <CheckCircle />}
                {t('label:steps.documents.mandatoryDocuments')}
              </Typography>
              <Chip
                label={`${mandatoryDocs.filter(d => documentsStore.isDocumentUploaded(d.id)).length}/${mandatoryDocs.length}`}
                size="small"
                color={hasUnuploadedMandatory ? "error" : "success"}
              />
            </Box>
            <Divider sx={{ mb: 2 }} />
            {mandatoryDocs.map(doc => renderDocument(doc))}
          </CardContent>
        </Card>
      )}

      {/* Optional Documents */}
      {optionalDocs.length > 0 && (
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Typography
                variant="h6"
                color="primary"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <InsertDriveFile />
                {t('label:steps.documents.optionalDocuments')}
              </Typography>
              <Chip
                label={`${optionalDocs.filter(d => documentsStore.isDocumentUploaded(d.id)).length}/${optionalDocs.length}`}
                size="small"
                color="primary"
              />
            </Box>
            <Divider sx={{ mb: 2 }} />
            {optionalDocs.map(doc => renderDocument(doc))}
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('label:steps.documents.uploadSummary')}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            {documentsStore.isAllRequiredUploaded ? (
              <>
                <CheckCircle color="success" />
                <Typography color="success.main" fontWeight={600}>
                  {t('label:steps.documents.allRequiredUploadedSuccess')}
                </Typography>
              </>
            ) : (
              <>
                <Warning color="warning" />
                <Typography color="warning.main" fontWeight={600}>
                  {t('label:steps.documents.notAllRequiredUploaded')}
                </Typography>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
});

export default DocumentsStep;