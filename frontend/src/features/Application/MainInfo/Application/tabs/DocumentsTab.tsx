// src/components/Application/tabs/DocumentsTab.tsx
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

export const DocumentsTab: React.FC = observer(() => {
  const { t } = useTranslation();
  const theme = useTheme();
  const applicationStore = useApplicationStore();
  const uiStore = useUIStore();
  const errorStore = useErrorStore();

  const application = applicationStore.application;
  const canEdit = application.status_code === "return_with_error"

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
    setSelectedDocComment(doc.comment || t('label:ApplicationAddEdit.documents.noComment'));
    setCommentDialogOpen(true);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Chip
            icon={<CheckIcon />}
            label={t('label:ApplicationAddEdit.documents.status.approved')}
            color="success"
            size="small"
            aria-label={t('label:ApplicationAddEdit.documents.status.approved')}
          />
        );
      case 'rejected':
        return (
          <Chip
            icon={<CloseIcon />}
            label={t('label:ApplicationAddEdit.documents.status.rejected')}
            color="error"
            size="small"
            aria-label={t('label:ApplicationAddEdit.documents.status.rejected')}
          />
        );
      case 'pending':
        return (
          <Chip
            icon={<ClockIcon />}
            label={t('label:ApplicationAddEdit.documents.status.pending')}
            color="warning"
            size="small"
            aria-label={t('label:ApplicationAddEdit.documents.status.pending')}
          />
        );
      case 'uploaded':
        return (
          <Chip
            icon={<ClockIcon />}
            label={t('label:ApplicationAddEdit.documents.status.uploaded')}
            color="warning"
            size="small"
            aria-label={t('label:ApplicationAddEdit.documents.status.uploaded')}
          />
        );
      case 'not_uploaded':
        return (
          <Chip
            label={t('label:ApplicationAddEdit.documents.status.notUploaded')}
            color="default"
            size="small"
            aria-label={t('label:ApplicationAddEdit.documents.status.notUploaded')}
          />
        );
      default:
        return (
          <Chip
            label={t('label:ApplicationAddEdit.documents.status.notUploaded')}
            color="default"
            size="small"
            aria-label={t('label:ApplicationAddEdit.documents.status.notUploaded')}
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
        {t('label:ApplicationAddEdit.documents.title')}
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
              {t('label:ApplicationAddEdit.documents.uploading')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(uiStore.uploadProgress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={uiStore.uploadProgress}
            aria-label={t('label:ApplicationAddEdit.documents.uploadProgress', { progress: Math.round(uiStore.uploadProgress) })}
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
        <Table aria-label={t('label:ApplicationAddEdit.documents.tableAriaLabel')}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('label:ApplicationAddEdit.documents.columns.name')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('label:ApplicationAddEdit.documents.columns.signature')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('label:ApplicationAddEdit.documents.columns.status')}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('label:ApplicationAddEdit.documents.columns.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicationStore.documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('label:ApplicationAddEdit.documents.noDocuments')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              applicationStore.documents.map((doc: Document) => (
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
                        {doc.is_required && <Chip
                          label={t('label:ApplicationAddEdit.documents.required')}
                          color="error"
                          sx={{ ml: 1 }}
                          size="small"
                          aria-label={t('label:ApplicationAddEdit.documents.required')}
                        />}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {doc.is_signed ? <Tooltip title={t('label:ApplicationAddEdit.documents.signed')}>
                      <GppGoodIcon fontSize="small" color='success' />
                    </Tooltip> : <>
                      <Checkbox
                        checked={applicationStore.checkedDocs.includes(doc.id)}
                        disabled={doc.file_id === null || !canEdit}
                        onChange={(e) => applicationStore.changeCheckedDoc(doc.id, e.target.checked)}
                        size='small' color='primary' />
                    </>}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(doc.status)}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {doc.comment && (
                        <Tooltip title={t('label:ApplicationAddEdit.documents.showComment')}>
                          <IconButton
                            aria-label={t('label:ApplicationAddEdit.documents.showCommentFor', { name: doc.doc_name })}
                            onClick={() => showCommentDialog(doc)}
                            size="small"
                            color="warning"
                          >
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {doc.file_id && <Tooltip title={t('label:ApplicationAddEdit.documents.download')}>
                        <IconButton
                          aria-label={t('label:ApplicationAddEdit.documents.downloadDocument', { name: doc.doc_name })}
                          onClick={() => {
                            applicationStore.downloadFile(doc.file_id, doc.file_name)
                          }}
                          rel="noopener noreferrer"
                          size="small"
                          color="primary"
                          sx={{ ml: 1 }}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>}

                      {doc.file_id && <Tooltip title={t('label:ApplicationAddEdit.documents.view')}>
                        <IconButton
                          aria-label={t('label:ApplicationAddEdit.documents.viewDocument', { name: doc.doc_name })}
                          onClick={() => {
                            applicationStore.openFileView(doc.file_id, doc.file_name)
                          }}
                          rel="noopener noreferrer"
                          size="small"
                          color="primary"
                          sx={{ ml: 1 }}
                        >
                          <RemoveRedEyeIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>}

                      <Tooltip title={doc.file_id ? t('label:ApplicationAddEdit.documents.replace') : t('label:ApplicationAddEdit.documents.upload')}>
                        <IconButton
                          aria-label={t('label:ApplicationAddEdit.documents.uploadCorrected', { name: doc.doc_name })}
                          onClick={() => {
                            applicationStore.openPanelUploadDocument(doc.app_doc_id, doc.id)
                          }}
                          disabled={uiStore.uploadingDocument || !canEdit}
                          size="small"
                          color="success"
                          sx={{ ml: 1 }}
                        >
                          <UploadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {applicationStore.checkedDocs.length > 0 && <Button
        color={"primary"}
        variant="contained"
        name="signUploadedDocs"
        size='small'
        id={"signUploadedDocs"}
        onClick={() => {
          applicationStore.signSelectedDocuments();
        }}
      >
        {t('label:ApplicationAddEdit.documents.signSelected')}
      </Button>}


      <UploadedApplicationDocumentPopupForm
        openPanel={applicationStore.openPanelUploadDoc}
        id={applicationStore.uplId}
        doc_id={applicationStore.serviceDocId}
        applicationId={applicationStore.applicationId}
        onBtnCancelClick={() => applicationStore.closePanelUploadDoc()}
        onSaveClick={() => {
          applicationStore.closePanelUploadDoc();
          applicationStore.fetchDocuments();
        }}
      />

      <Dialog
        open={commentDialogOpen}
        onClose={() => setCommentDialogOpen(false)}
        aria-labelledby="comment-dialog-title"
        aria-describedby="comment-dialog-description"
      >
        <DialogTitle id="comment-dialog-title">
          {t('label:ApplicationAddEdit.documents.commentDialog.title')}
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