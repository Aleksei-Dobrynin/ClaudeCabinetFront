// src/components/Application/tabs/FinalDocumentsTab.tsx
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useApplicationStore, useUIStore, useErrorStore } from '../../stores/StoreContext';
import { 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Alert, 
  AlertTitle,
  Grid,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import { 
  FolderOpen as FolderIcon,
  Description as DocumentIcon,
  CheckCircle as CheckCircleIcon,
  CloudDownload as DownloadIcon,
  Visibility as ViewIcon,
  Assignment as AssignmentIcon,
  VerifiedUser as VerifiedIcon,
  CalendarToday as CalendarIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  PictureAsPdf as PdfIcon,
  Print as PrintIcon,
  Archive as ArchiveIcon
} from '@mui/icons-material';

export const FinalDocumentsTab: React.FC = observer(() => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const applicationStore = useApplicationStore();
  const uiStore = useUIStore();
  const errorStore = useErrorStore();
  
  const application = applicationStore.application;
  
  const [signActDialogOpen, setSignActDialogOpen] = useState(false);
  const [downloadAllProgress, setDownloadAllProgress] = useState(0);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  
  if (!application) return null;

  const handleSignAct = async () => {
    try {
      await applicationStore.signCompletionAct();
      setSignActDialogOpen(false);
      await applicationStore.fetchApplication();
    } catch (error) {
    }
  };

  const handleDownloadDocument = (docId: string) => {
    console.log('Downloading document:', docId);
  };

  const handleViewDocument = (docId: string) => {
    console.log('Viewing document:', docId);
  };

  const handleDownloadAll = async () => {
    // Implementation for download all
  };

  if (application.status_code !== 'completed') {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <FolderIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {t('label:ApplicationAddEdit.finalDocuments.notAvailable')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('label:ApplicationAddEdit.finalDocuments.notAvailableDescription')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 3,
          bgcolor: application.completion_act?.signed ? 'success.50' : 'warning.50',
          border: `1px solid ${application.completion_act?.signed ? theme.palette.success.light : theme.palette.warning.light}`
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AssignmentIcon sx={{ mr: 1, color: application.completion_act?.signed ? 'success.main' : 'warning.main' }} />
              <Typography variant="h6">
                {t('label:ApplicationAddEdit.finalDocuments.completionAct')}
              </Typography>
            </Box>
            
            {application.completion_act?.signed ? (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('label:ApplicationAddEdit.finalDocuments.actSigned')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    {t('label:ApplicationAddEdit.finalDocuments.signedDate')}: {application.completion_act.signedDate && new Date(application.completion_act.signedDate).toLocaleString('ru-RU')}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('label:ApplicationAddEdit.finalDocuments.signRequiredForAccess')}
                </Typography>
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    {t('label:ApplicationAddEdit.finalDocuments.signWarning')}
                  </Typography>
                </Alert>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Stack spacing={1} direction={isMobile ? 'column' : 'row'} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<ViewIcon />}
                onClick={() => console.log('View act')}
                fullWidth={isMobile}
              >
                {t('label:ApplicationAddEdit.finalDocuments.viewAct')}
              </Button>
              {!application.completion_act?.signed && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => setSignActDialogOpen(true)}
                  fullWidth={isMobile}
                >
                  {t('label:ApplicationAddEdit.finalDocuments.signWithEDS')}
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {t('label:ApplicationAddEdit.finalDocuments.outputDocuments')} ({application.final_documents?.length || 0})
          </Typography>
          {application.completion_act?.signed && application.final_documents && application.final_documents.length > 0 && (
            <Button
              variant="contained"
              startIcon={isDownloadingAll ? <CircularProgress size={20} color="inherit" /> : <ArchiveIcon />}
              onClick={handleDownloadAll}
              disabled={isDownloadingAll}
            >
              {t('label:ApplicationAddEdit.finalDocuments.downloadAll')}
            </Button>
          )}
        </Box>

        {isDownloadingAll && (
          <LinearProgress 
            variant="determinate" 
            value={downloadAllProgress} 
            sx={{ mb: 2 }}
          />
        )}

        <Grid container spacing={2}>
          {application.final_documents?.map((doc) => (
            <Grid item xs={12} md={6} key={doc.id}>
              <Card 
                variant="outlined"
                sx={{ 
                  height: '100%',
                  opacity: application.completion_act?.signed ? 1 : 0.7,
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: application.completion_act?.signed ? 2 : 0
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <PdfIcon sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {doc.name}
                      </Typography>
                      {doc.description && (
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {doc.description}
                        </Typography>
                      )}
                      <Stack spacing={0.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {t('label:ApplicationAddEdit.finalDocuments.issued')}: {new Date(doc.issueDate).toLocaleDateString('ru-RU')}
                          </Typography>
                        </Box>
                        {doc.validUntil && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <VerifiedIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {t('label:ApplicationAddEdit.finalDocuments.validUntil')}: {new Date(doc.validUntil).toLocaleDateString('ru-RU')}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Box>
                  </Box>
                  
                  <Chip 
                    label={doc.status === 'issued' ? t('label:ApplicationAddEdit.finalDocuments.status.issued') : t('label:ApplicationAddEdit.finalDocuments.status.draft')}
                    color={doc.status === 'issued' ? 'success' : 'default'}
                    size="small"
                    icon={doc.status === 'issued' ? <CheckCircleIcon /> : <WarningIcon />}
                  />
                </CardContent>
                
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={() => handleViewDocument(doc.id)}
                    disabled={!application?.completion_act?.signed}
                  >
                    {t('label:ApplicationAddEdit.finalDocuments.view')}
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadDocument(doc.id)}
                    disabled={!application?.completion_act?.signed}
                    color="primary"
                  >
                    {t('label:ApplicationAddEdit.finalDocuments.download')}
                  </Button>
                  <IconButton
                    size="small"
                    disabled={!application.completion_act?.signed}
                    sx={{ ml: 'auto' }}
                  >
                    <PrintIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {(!application.final_documents || application.final_documents.length === 0) && (
          <Alert severity="info">
            <AlertTitle>{t('label:ApplicationAddEdit.finalDocuments.preparingDocuments')}</AlertTitle>
            <Typography variant="body2">
              {t('label:ApplicationAddEdit.finalDocuments.preparingDocumentsDescription')}
            </Typography>
          </Alert>
        )}
      </Box>

      {application.completion_act?.signed && application.final_documents && application.final_documents.length > 0 && (
        <Alert severity="info" >
          <AlertTitle>{t('label:ApplicationAddEdit.finalDocuments.documentsInfo')}</AlertTitle>
          <Typography variant="body2" paragraph>
            {t('label:ApplicationAddEdit.finalDocuments.documentsInfoDescription')}
          </Typography>
          <Typography variant="body2">
            {t('label:ApplicationAddEdit.finalDocuments.supportContact')}
          </Typography>
        </Alert>
      )}

      <Dialog
        open={signActDialogOpen}
        onClose={() => setSignActDialogOpen(false)}
        aria-labelledby="sign-act-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="sign-act-dialog-title">
          {t('label:ApplicationAddEdit.finalDocuments.signActDialog.title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('label:ApplicationAddEdit.finalDocuments.signActDialog.description')}
          </DialogContentText>
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              {t('label:ApplicationAddEdit.finalDocuments.signActDialog.warning')}
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSignActDialogOpen(false)} color="inherit">
            {t('label:ApplicationAddEdit.common.cancel')}
          </Button>
          <Button 
            onClick={handleSignAct} 
            color="primary" 
            variant="contained"
            disabled={applicationStore.isSaving}
            startIcon={applicationStore.isSaving ? <CircularProgress size={20} /> : <EditIcon />}
          >
            {t('label:ApplicationAddEdit.finalDocuments.signWithEDS')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});