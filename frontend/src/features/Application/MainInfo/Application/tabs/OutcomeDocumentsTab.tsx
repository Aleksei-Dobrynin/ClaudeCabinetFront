// src/components/Application/tabs/OutcomeDocumentsTab.tsx
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useApplicationStore, useUIStore, useErrorStore } from '../../stores/StoreContext';
import { Document } from 'constants/ApplicationMain';
import {
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  Alert,
  LinearProgress,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Snackbar,
  Checkbox
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CloudDownload as DownloadIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  RemoveRedEye as RemoveRedEyeIcon,
  Replay as RefreshIcon,
  AccessTime as ClockIcon,
  GppGood as GppGoodIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import FileViewer from 'components/FileViewer';
import UploadedApplicationDocumentPopupForm from 'features/UploadedApplicationDocument/UploadedApplicationDocumentAddEditView/popupForm';

export const OutcomeDocumentsTab: React.FC = observer(() => {
  const { t } = useTranslation();
  const theme = useTheme();
  const applicationStore = useApplicationStore();
  const uiStore = useUIStore();
  const errorStore = useErrorStore();

  const application = applicationStore.application;

  const canSignDoc = (doc: Document) => {
    return doc.file_id !== null && doc.is_required
    //&&    application.status_code === "signature_required"
    // && (doc.application_document_type_name === "raspiska"
    //   || doc.application_document_type_name === "agreement"
    //   || doc.application_document_type_name === "invoice_for_payment"
    //   || doc.application_document_type_name === "confirm")
  }

  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedDocComment, setSelectedDocComment] = useState('');
  const [selectedDocName, setSelectedDocName] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    applicationStore.clearDocsIds()
  }, [])

  const checkFileView = (fileName: string) => {
    return (fileName.toLowerCase().endsWith('.jpg') ||
      fileName.toLowerCase().endsWith('.jpeg') ||
      fileName.toLowerCase().endsWith('.png') ||
      fileName.toLowerCase().endsWith('.pdf'));
  }

  if (!application) return null;

  const showCommentDialog = (doc: Document) => {
    setSelectedDocName(doc.doc_name);
    setSelectedDocComment(doc.comment || t('label:ApplicationAddEdit.outcomeDocuments.noComment'));
    setCommentDialogOpen(true);
  };

  const handleDownloadDocument = (doc: Document) => {
    if (doc.file_id) {
      applicationStore.downloadFile(doc.file_id, doc.file_name);
    }
  };

  const handleViewDocument = (doc: Document) => {
    if (doc.file_id && checkFileView(doc.file_name)) {
      applicationStore.openFileView(doc.file_id, doc.file_name);
    } else if (doc.file_id) {
      // If the file can't be viewed, download it instead
      handleDownloadDocument(doc);
      uiStore.showSnackbar(t('label:ApplicationAddEdit.outcomeDocuments.fileTypeNotViewable'), 'info');
    }
  };

  const getStatusChip = (status: string, hasFile: boolean) => {
    if (!hasFile) {
      return (
        <Chip
          label={t('label:ApplicationAddEdit.outcomeDocuments.status.notUploaded')}
          color="default"
          size="small"
        />
      );
    }

    switch (status) {
      case 'approved':
        return (
          <Chip
            icon={<CheckIcon />}
            label={t('label:ApplicationAddEdit.outcomeDocuments.status.approved')}
            color="success"
            size="small"
          />
        );
      case 'rejected':
        return (
          <Chip
            icon={<CloseIcon />}
            label={t('label:ApplicationAddEdit.outcomeDocuments.status.rejected')}
            color="error"
            size="small"
          />
        );
      case 'pending':
        return (
          <Chip
            icon={<ClockIcon />}
            label={t('label:ApplicationAddEdit.outcomeDocuments.status.pending')}
            color="warning"
            size="small"
          />
        );
      case 'uploaded':
        return (
          <Chip
            icon={<ClockIcon />}
            label={t('label:ApplicationAddEdit.outcomeDocuments.status.uploaded')}
            color="warning"
            size="small"
          />
        );
      default:
        return (
          <Chip
            icon={<ClockIcon />}
            label={t('label:ApplicationAddEdit.outcomeDocuments.status.uploaded')}
            color="info"
            size="small"
          />
        );
    }
  };

  return (
    <Box>
      <Typography
        variant="h6"
        component="h2"
        sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
      >
        {t('label:ApplicationAddEdit.outcomeDocuments.title')}
      </Typography>

      {errorStore.hasError('uploadDocument') && (
        <Alert
          severity="error"
          onClose={() => errorStore.clearError('uploadDocument')}
          sx={{ mb: 3 }}
        >
          {errorStore.getError('uploadDocument')}
        </Alert>
      )}

      {uiStore.uploadingDocument && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t('label:ApplicationAddEdit.outcomeDocuments.uploading')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(uiStore.uploadProgress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={uiStore.uploadProgress}
            aria-label={t('label:ApplicationAddEdit.outcomeDocuments.uploadProgress', { progress: Math.round(uiStore.uploadProgress) })}
          />
        </Box>
      )}

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          mb: 3
        }}
      >
        <Table aria-label={t('label:ApplicationAddEdit.outcomeDocuments.tableAriaLabel')}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('label:ApplicationAddEdit.outcomeDocuments.columns.name')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Подпись</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Статус</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('label:ApplicationAddEdit.outcomeDocuments.columns.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicationStore.outcomeDocs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('label:ApplicationAddEdit.outcomeDocuments.noDocuments')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              applicationStore.outcomeDocs.map((doc: Document) => (
                <TableRow
                  key={doc.id}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Box display={"flex"} alignItems={"center"}>
                      <Typography
                        variant="body2"
                        component="div"
                        sx={{ fontWeight: doc.status === 'rejected' ? 'bold' : 'normal' }}
                      >
                        {doc.doc_name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {doc.is_signed ? (
                      <Tooltip title={t('label:ApplicationAddEdit.outcomeDocuments.signed')}>
                        <GppGoodIcon fontSize="small" color='success' />
                      </Tooltip>
                    ) : (
                      <Checkbox
                        checked={applicationStore.checkedDocs.includes(doc.id)}
                        disabled={!canSignDoc(doc)}
                        onChange={(e) => applicationStore.changeCheckedDoc(doc.id, e.target.checked)}
                        size='small'
                        color='primary'
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(doc.status, doc.file_id !== null)}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      {doc.comment && (
                        <Tooltip title={t('label:ApplicationAddEdit.outcomeDocuments.showComment')}>
                          <IconButton
                            aria-label={t('label:ApplicationAddEdit.outcomeDocuments.showCommentFor', { name: doc.doc_name })}
                            onClick={() => showCommentDialog(doc)}
                            size="small"
                            color="warning"
                          >
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {doc.file_id && (
                        <>
                          <Tooltip title={t('label:ApplicationAddEdit.outcomeDocuments.download')}>
                            <IconButton
                              aria-label={t('label:ApplicationAddEdit.outcomeDocuments.downloadDocument', { name: doc.doc_name })}
                              onClick={() => handleDownloadDocument(doc)}
                              size="small"
                              color="primary"
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {checkFileView(doc.file_name) && (
                            <Tooltip title={t('label:ApplicationAddEdit.outcomeDocuments.view')}>
                              <IconButton
                                aria-label={t('label:ApplicationAddEdit.outcomeDocuments.viewDocument', { name: doc.doc_name })}
                                onClick={() => handleViewDocument(doc)}
                                size="small"
                                color="primary"
                              >
                                <RemoveRedEyeIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Убираю кнопку подписи документов, так как теперь нет колонки подписи */}
      {applicationStore.checkedDocs.length > 0 && (
        <Button
          color={"primary"}
          variant="contained"
          name="signUploadedDocs"
          size='small'
          id={"signUploadedDocs"}
          onClick={() => {
            applicationStore.signSelectedDocuments();
          }}
        >
          {t('label:ApplicationAddEdit.outcomeDocuments.signSelected')}
        </Button>
      )}


      <Dialog
        open={commentDialogOpen}
        onClose={() => setCommentDialogOpen(false)}
        aria-labelledby="comment-dialog-title"
        aria-describedby="comment-dialog-description"
      >
        <DialogTitle id="comment-dialog-title">
          {t('label:ApplicationAddEdit.outcomeDocuments.commentDialog.title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="comment-dialog-description">
            <Typography variant="subtitle2" component="div" gutterBottom>
              {selectedDocName}
            </Typography>
            <Typography variant="body2" component="div">
              {selectedDocComment}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCommentDialogOpen(false)}
            color="primary"
            autoFocus
          >
            {t('label:ApplicationAddEdit.common.close')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
});