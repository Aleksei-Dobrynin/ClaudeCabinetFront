// components/steps/CompletionStep.tsx

import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Chip,
  Grid,
  Alert,
  Divider,
  IconButton
} from '@mui/material';
import {
  CheckCircle,
  Print,
  Add,
  List as ListIcon,
  Email,
  Assignment,
  Schedule,
  Person,
  Celebration,
  ContentCopy,
  Home
} from '@mui/icons-material';
import { rootStore } from '../../stores/RootStore';

const CompletionStep: React.FC = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { applicationNumber } = rootStore;

  const copyToClipboard = () => {
    if (applicationNumber) {
      navigator.clipboard.writeText(applicationNumber.toString());
      rootStore.showSnackbar(t('label:steps.completion.numberCopied'), 'success');
    }
  };

  const nextSteps = [
    {
      icon: <Assignment color="primary" />,
      title: t('label:steps.completion.nextSteps.study.title'),
      description: t('label:steps.completion.nextSteps.study.description'),
      duration: t('label:steps.completion.nextSteps.study.duration')
    },
    {
      icon: <Person color="primary" />,
      title: t('label:steps.completion.nextSteps.assign.title'),
      description: t('label:steps.completion.nextSteps.assign.description'),
      duration: t('label:steps.completion.nextSteps.assign.duration')
    },
    {
      icon: <Schedule color="primary" />,
      title: t('label:steps.completion.nextSteps.prepare.title'),
      description: t('label:steps.completion.nextSteps.prepare.description'),
      duration: t('label:steps.completion.nextSteps.prepare.duration')
    },
    {
      icon: <Email color="primary" />,
      title: t('label:steps.completion.nextSteps.notify.title'),
      description: t('label:steps.completion.nextSteps.notify.description'),
      duration: t('label:steps.completion.nextSteps.notify.duration')
    }
  ];

  return (
    <Box textAlign="center" py={5}>
      <Celebration sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />

      <Typography variant="h3" gutterBottom fontWeight="bold">
        {t('label:steps.completion.title')}
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mt: 3, mb: 4, display: 'inline-block', bgcolor: 'success.50' }}>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {t('label:steps.completion.applicationNumber')}
        </Typography>
        <Box display="flex" alignItems="center" gap={2} justifyContent="center">
          <Typography variant="h4" fontWeight="bold">
            {applicationNumber}
          </Typography>
          <IconButton onClick={copyToClipboard} color="primary">
            <ContentCopy />
          </IconButton>
        </Box>
        <Chip 
          label={t('label:steps.completion.underReview')} 
          color="primary" 
          sx={{ mt: 2 }}
        />
      </Paper>

      <Paper sx={{ p: 4, mb: 4, textAlign: 'left', maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          {t('label:steps.completion.completed')}
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText
              primary={t('label:steps.completion.completedItems.submitted')}
              secondary={t('label:steps.completion.completedItems.submittedDesc')}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText
              primary={t('label:steps.completion.completedItems.notifications')}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText
              primary={t('label:steps.completion.completedItems.documentsSaved')}
              secondary={t('label:steps.completion.completedItems.documentsDesc')}
            />
          </ListItem>
        </List>
      </Paper>

      <Divider sx={{ my: 4, maxWidth: 800, mx: 'auto' }} />

      <Box>
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Add />}
              onClick={() => {
                rootStore.startNewApplication();
                rootStore.setCurrentStep(0);
              }}
            >
              {t('label:steps.completion.createNew')}
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ListIcon />}
              onClick={() => {
                navigate('/user/ApplicationAll')
              }}
            >
              {t('label:steps.completion.goToList')}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box mt={4}>
        <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
          <Typography variant="body2">
            <strong>{t('label:steps.completion.tip')}:</strong> {t('label:steps.completion.tipDescription')}
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
});

export default CompletionStep;