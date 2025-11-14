// src/components/Application/ApplicationTabs.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useApplicationStore, useUIStore } from '../stores/StoreContext';
import {
  Box,
  Tabs,
  Tab,
  Chip,
  Badge
} from '@mui/material';
import {
  InfoOutlined,
  DescriptionOutlined,
  AssignmentOutlined,
  PaymentOutlined,
  FolderOutlined
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import QrCode2 from '@mui/icons-material/QrCode2';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`application-tabpanel-${index}`}
      aria-labelledby={`application-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `application-tab-${index}`,
    'aria-controls': `application-tabpanel-${index}`,
  };
}

export const ApplicationTabs: React.FC = observer(() => {
  const { application, documents, outcomeDocs } = useApplicationStore();
  const uiStore = useUIStore();
  const { t } = useTranslation();

  if (!application) return null;

  const getTabIndex = (tab: string): number => {
    switch (tab) {
      case 'info': return 0;
      case 'documents': return 1;
      case 'final': return 2;
      case 'payment': return 3;
      case 'qrPayment': return 4;
      case 'contract': return 5;
      default: return 0;
    }
  };

  const getTabValue = (index: number): 'info' | 'documents' | 'final' | 'payment' | 'qrPayment' | 'contract' => {
    switch (index) {
      case 0: return 'info';
      case 1: return 'documents';
      case 2: return 'final';
      case 3: return 'payment';
      case 4: return 'qrPayment';
      case 5: return 'contract';
      default: return 'info';
    }
  };

  const currentTabIndex = getTabIndex(uiStore.activeTab);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    uiStore.setActiveTab(getTabValue(newValue));
  };

  // Check for rejected documents in regular documents
  const hasRejectedDocuments = documents.some(doc => doc.status === 'rejected');

  // Check for uploaded outcome documents
  const hasUploadedOutcomeDocuments = outcomeDocs.some(doc => doc.file_id !== null);

  const isContractUnsigned = true;
  // const isContractUnsigned = application.contract && !application.contract.signed;

  const isPaymentPending = true;
  // const isPaymentPending = application.invoice && application.invoice.status === 'pending';

  const isFinalDocsAvailable = true;
  // const isFinalDocsAvailable = application.completionAct?.signed;

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={currentTabIndex}
        onChange={handleTabChange}
        aria-label={t('label:applicationTabs.tabsLabel')}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          '& .MuiTab-root': {
            minHeight: 64,
            textTransform: 'none',
            fontSize: '0.9rem',
          }
        }}
      >
        <Tab
          icon={<InfoOutlined />}
          iconPosition="start"
          label={t('label:applicationTabs.information')}
          {...a11yProps(0)}
        />

        <Tab
          icon={<DescriptionOutlined />}
          iconPosition="start"
          label={
            <Badge
              color="error"
              variant="dot"
              invisible={!hasRejectedDocuments}
              sx={{ '& .MuiBadge-badge': { right: -4, top: 4 } }}
            >
              {t('label:applicationTabs.documents')}
            </Badge>
          }
          {...a11yProps(1)}
        />

        <Tab
          icon={<FolderOutlined />}
          iconPosition="start"
          label={
            <Badge
              color="primary"
              variant="dot"
              invisible={!hasUploadedOutcomeDocuments}
              sx={{ '& .MuiBadge-badge': { right: -4, top: 4 } }}
            >
              {t('label:applicationTabs.outputDocuments')}
            </Badge>
          }
          {...a11yProps(2)}
        />

        <Tab
          icon={<PaymentOutlined />}
          iconPosition="start"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {t('label:applicationTabs.payment')}
            </Box>
          }
          {...a11yProps(3)}
        />

        <Tab
          icon={<QrCode2 />}
          iconPosition="start"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {t('label:applicationTabs.qrPayment')}
              {application.total_paid < application.total_sum && (
                <Chip
                  label={t('label:applicationTabs.pendingPayment')}
                  color="warning"
                  size="small"
                  sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Box>
          }
          {...a11yProps(4)}
        />

        {(application.status_code === 'payment' || application.status_code === 'signing' || application.status_code === 'completed') && (
          <Tab
            icon={<AssignmentOutlined />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {t('label:applicationTabs.contract')}
                {isContractUnsigned && (
                  <Chip
                    label={t('label:applicationTabs.notSigned')}
                    color="warning"
                    size="small"
                    sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                  />
                )}
              </Box>
            }
            {...a11yProps(5)}
          />
        )}
      </Tabs>
    </Box>
  );
});