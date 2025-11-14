import React from 'react';
import { observer } from 'mobx-react-lite';
import { ApplicationHeader } from './ApplicationHeader';
import { ApplicationProgress } from './ApplicationProgress';
import { ApplicationTabs } from './ApplicationTabs';
import { ApplicationInfo } from './tabs/ApplicationInfo';
import { DocumentsTab } from './tabs/DocumentsTab';
import { OutcomeDocumentsTab } from './tabs/OutcomeDocumentsTab';
import { ContractTab } from './tabs/ContractTab';
import { PaymentTab } from './tabs/PaymentTab';
import { QrPaymentTab } from './tabs/QrPaymentTab';
import { FinalDocumentsTab } from './tabs/FinalDocumentsTab';
import { useApplicationStore, useUIStore, useErrorStore } from '../stores/StoreContext';
import {
  Container,
  Box,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Button
} from '@mui/material';
import { SyncOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import FileViewer from 'components/FileViewer';

export const ApplicationView: React.FC = observer(() => {
  const applicationStore = useApplicationStore();
  const uiStore = useUIStore();
  const errorStore = useErrorStore();
  const { t } = useTranslation();

  const application = applicationStore.application;

  if (!application) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh'
        }}
      >
        <CircularProgress
          aria-label={t('label:applicationView.loadingData')}
          size={40}
        />
        <Typography
          variant="body1"
          sx={{ ml: 2 }}
          color="text.secondary"
        >
          {t('label:applicationView.loadingData')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        <ApplicationHeader />

        <ApplicationProgress />

        {applicationStore.isSaving && (
          <Alert
            severity="info"
            icon={<SyncOutlined className="animate-spin" />}
            sx={{ mb: 2 }}
          >
            {t('label:applicationView.savingChanges')}
          </Alert>
        )}

        {errorStore.hasError('updateApplication') && (
          <Alert
            severity="error"
            onClose={() => errorStore.clearError('updateApplication')}
            sx={{ mb: 2 }}
          >
            {errorStore.getError('updateApplication')}
          </Alert>
        )}

        <Paper
          elevation={2}
          sx={{
            mb: 2,
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <ApplicationTabs />

          <Box sx={{ p: 3 }}>
            {uiStore.activeTab === 'info' && <ApplicationInfo />}
            {uiStore.activeTab === 'documents' && <DocumentsTab />}
            {uiStore.activeTab === 'final' && <OutcomeDocumentsTab />}
            {uiStore.activeTab === 'payment' && <PaymentTab />}
            {uiStore.activeTab === 'contract' && <ContractTab />}
            {uiStore.activeTab === 'qrPayment' && <QrPaymentTab />}
          </Box>
        </Paper>

        <Box display={"flex"} justifyContent={"space-between"}>
          {application.status_code === "return_with_error" ?
            <Button size="small" variant="contained" color='primary'
              disabled={!applicationStore.documents.every(x => x.status !== "rejected")}
              onClick={() => {
                applicationStore.reSendToBga()
              }}>
              {t('label:applicationView.sendForReview')}
            </Button> : <div></div>}

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              textAlign: 'right',
              mt: 1
            }}
          >
            {t('label:applicationView.lastUpdated')}: {applicationStore.lastUpdatedFormatted}
          </Typography>
        </Box>
      </Container>
      <FileViewer
        isOpen={applicationStore.isOpenFileView}
        onClose={() => { applicationStore.isOpenFileView = false }}
        fileUrl={applicationStore.fileUrl}
        fileType={applicationStore.fileType} />

    </Box>
  );
});