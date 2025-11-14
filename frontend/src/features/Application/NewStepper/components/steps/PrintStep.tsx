// components/steps/PrintStep.tsx

import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  AlertTitle,
  Chip,
  Checkbox,
  FormControlLabel,
  FormGroup,
  LinearProgress,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  Print as PrintIcon,
  Visibility,
  CheckCircle,
  Description,
  Warning,
  Download,
  Assignment,
  Receipt,
  ListAlt,
  PersonOutline,
  CreateOutlined,
  AssignmentTurnedIn,
  LocalPrintshop
} from '@mui/icons-material';
import { rootStore } from '../../stores/RootStore';

const PrintStep: React.FC = observer(() => {
  const { t } = useTranslation();
  const { printStore } = rootStore;
  const [activeStep, setActiveStep] = React.useState(0);
  
  const printSteps = [
    {
      label: t('label:steps.print.processSteps.generate.label'),
      description: t('label:steps.print.processSteps.generate.description'),
      icon: <Description />
    },
    {
      label: t('label:steps.print.processSteps.print.label'),
      description: t('label:steps.print.processSteps.print.description'),
      icon: <LocalPrintshop />
    },
    {
      label: t('label:steps.print.processSteps.sign.label'),
      description: t('label:steps.print.processSteps.sign.description'),
      icon: <CreateOutlined />
    },
    {
      label: t('label:steps.print.processSteps.check.label'),
      description: t('label:steps.print.processSteps.check.description'),
      icon: <AssignmentTurnedIn />
    }
  ];
  
  const checklistItems = [
    {
      key: 'allPrinted',
      label: t('label:steps.print.checklist.allPrinted.label'),
      description: t('label:steps.print.checklist.allPrinted.description'),
      icon: <PrintIcon />
    },
    {
      key: 'applicantSigned',
      label: t('label:steps.print.checklist.applicantSigned.label'),
      description: t('label:steps.print.checklist.applicantSigned.description'),
      icon: <PersonOutline />
    },
    {
      key: 'receiptGiven',
      label: t('label:steps.print.checklist.receiptGiven.label'),
      description: t('label:steps.print.checklist.receiptGiven.description'),
      icon: <Receipt />
    },
    {
      key: 'registrarSigned',
      label: t('label:steps.print.checklist.registrarSigned.label'),
      description: t('label:steps.print.checklist.registrarSigned.description'),
      icon: <Assignment />
    }
  ];
  
  const getDocumentIcon = (documentId: number) => {
    switch (documentId) {
      case 1: return <Assignment />;
      case 2: return <Receipt />;
      case 3: return <ListAlt />;
      default: return <Description />;
    }
  };
  
  React.useEffect(() => {
    if (!printStore.generatedDocuments.length && !printStore.isGenerating) {
      printStore.generateDocuments();
    }
  }, [printStore]);
  
  React.useEffect(() => {
    if (printStore.checklistProgress === 100) {
      setActiveStep(3);
    } else if (printStore.checklistProgress > 50) {
      setActiveStep(2);
    } else if (printStore.checklistProgress > 0) {
      setActiveStep(1);
    }
  }, [printStore.checklistProgress]);
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
        {t('label:steps.print.title')}
      </Typography>
      
      <Alert severity="error" sx={{ mb: 3 }}>
        <AlertTitle>{t('label:steps.print.mandatoryStep')}</AlertTitle>
        {t('label:steps.print.mandatoryStepDescription')}
      </Alert>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              {t('label:steps.print.documentsForPrint')}
            </Typography>
            
            {printStore.isGenerating ? (
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <CircularProgress size={24} />
                    <Typography>{t('label:steps.print.generating')}</Typography>
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={2}>
                {printStore.printDocuments.map(doc => (
                  <Grid item xs={12} key={doc.id}>
                    <Card 
                      variant={doc.isPrimary ? "elevation" : "outlined"} 
                      sx={{ 
                        border: doc.isPrimary ? 2 : 1, 
                        borderColor: doc.isPrimary ? 'primary.main' : 'divider'
                      }}
                    >
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Box display="flex" gap={2}>
                            <Avatar sx={{ bgcolor: doc.isPrimary ? 'primary.main' : 'grey.400' }}>
                              {getDocumentIcon(doc.id)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6">
                                {doc.name}
                                {doc.isPrimary && (
                                  <Chip 
                                    label={t('label:steps.print.primary')} 
                                    size="small" 
                                    color="primary" 
                                    sx={{ ml: 1 }}
                                  />
                                )}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {doc.description}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            icon={<CheckCircle />}
                            label={t('label:steps.print.ready')}
                            color="success"
                            size="small"
                          />
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              <strong>{t('label:steps.print.signaturesRequired')}:</strong> {doc.signatures}
                            </Typography>
                            {doc.copies > 1 && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>{t('label:steps.print.copies')}:</strong> {doc.copies} ({t('label:steps.print.copiesDescription')})
                              </Typography>
                            )}
                          </Box>
                          <Box display="flex" gap={1}>
                            <Tooltip title={t('label:steps.print.preview')}>
                              <IconButton
                                color="primary"
                                onClick={() => printStore.previewDocument(doc.id)}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('common:download')}>
                              <IconButton
                                color="primary"
                                onClick={() => {
                                  rootStore.showSnackbar(t('label:steps.print.documentDownloaded'), 'success');
                                }}
                              >
                                <Download />
                              </IconButton>
                            </Tooltip>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<PrintIcon />}
                              onClick={() => printStore.printDocument(doc.id)}
                            >
                              {t('common:print')}
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            
            <Box textAlign="center" mt={3}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PrintIcon />}
                onClick={() => printStore.printAll()}
                disabled={printStore.isGenerating}
                fullWidth
                sx={{ py: 2 }}
              >
                {t('label:steps.print.printAll')}
              </Button>
              <Typography variant="caption" display="block" color="text.secondary" mt={1}>
                {t('label:steps.print.printAllDescription')}
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              {t('label:steps.print.process')}
            </Typography>
            
            <Stepper activeStep={activeStep} orientation="vertical">
              {printSteps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    optional={
                      <Typography variant="caption">{step.description}</Typography>
                    }
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    {index === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        {t('label:steps.print.processHelp.generate')}
                      </Typography>
                    )}
                    {index === 1 && (
                      <Typography variant="body2" color="text.secondary">
                        {t('label:steps.print.processHelp.print')}
                      </Typography>
                    )}
                    {index === 2 && (
                      <Typography variant="body2" color="text.secondary">
                        {t('label:steps.print.processHelp.sign')}
                      </Typography>
                    )}
                    {index === 3 && (
                      <Typography variant="body2" color="text.secondary">
                        {t('label:steps.print.processHelp.check')}
                      </Typography>
                    )}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>
      </Grid>
      
      <Box mt={4}>
        <Card sx={{ bgcolor: 'success.50' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="success.dark">
              {t('label:steps.print.checklistTitle')}
            </Typography>
            
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="body2" color="text.secondary">
                {t('label:steps.print.checklistProgress', { 
                  completed: Object.values(printStore.checklist).filter(v => v).length,
                  total: checklistItems.length 
                })}
              </Typography>
              <Chip 
                label={`${Math.round(printStore.checklistProgress)}%`} 
                color={printStore.checklistProgress === 100 ? 'success' : 'warning'}
                size="small"
              />
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={printStore.checklistProgress} 
              sx={{ mb: 3 }}
              color={printStore.checklistProgress === 100 ? 'success' : 'warning'}
            />
            
            <FormGroup>
              {checklistItems.map(item => (
                <Box key={item.key} mb={2}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={printStore.checklist[item.key as keyof typeof printStore.checklist]}
                        onChange={(e) => printStore.updateChecklist(
                          item.key as keyof typeof printStore.checklist, 
                          e.target.checked
                        )}
                        color="success"
                      />
                    }
                    label={
                      <Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          {item.icon}
                          <Typography variant="body1">{item.label}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              ))}
            </FormGroup>
            
            {!printStore.isChecklistComplete && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                {t('label:steps.print.completeAllItems')}
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>
      
      {printStore.printHistory.length > 0 && (
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary">
            {t('label:steps.print.printHistory')}:
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
            {printStore.printHistory.map((history, index) => (
              <Chip
                key={index}
                label={`${printStore.printDocuments.find(d => d.id === history.documentId)?.name} - ${new Date(history.printedAt).toLocaleTimeString('ru')}`}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
});

export default PrintStep;