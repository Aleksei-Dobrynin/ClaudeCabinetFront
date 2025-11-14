// components/ServiceInfoPanelV2.tsx

import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  Paper,
  Grid,
  Stack,
  Collapse,
  IconButton,
  CircularProgress,
  Skeleton
} from '@mui/material';
import {
  ExpandMore,
  Description,
  AccessTime,
  Info,
  CheckCircle,
  Warning,
  Article,
  AttachMoney,
  Assignment,
  Close,
  InfoOutlined,
  FolderOpen
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { getServiceDocumentsByIdService } from 'api/MainBackAPI';
import { ServiceDocumentDTO } from 'api/MainBackAPI/models/upladed_application_document';
import { Service } from 'constants/Service';

interface ServiceInfoPanelProps {
  service: Service;
  expanded?: boolean;
  onClose?: () => void;
}

const ServiceInfoPanelV2: React.FC<ServiceInfoPanelProps> = ({
  service,
  expanded = true,
  onClose
}) => {
  const { t, i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<ServiceDocumentDTO[]>([]);

  // Получаем текущий язык
  const currentLanguage = i18n.language;

  // Функция для получения названия документа в зависимости от языка
  const getDocumentName = (doc: ServiceDocumentDTO) => {
    if (currentLanguage === 'ky-KG' && doc.name_kg) {
      return doc.name_kg;
    }
    return doc.name;
  };

  // Функция для получения описания документа в зависимости от языка
  const getDocumentDescription = (doc: ServiceDocumentDTO) => {
    if (currentLanguage === 'ky-KG' && doc.description_kg) {
      return doc.description_kg;
    }
    return doc.description || doc.law_description;
  };

  useEffect(() => {
    if (service?.id) {
      loadServiceDocuments(service.id);
    }
  }, [service?.id]);

  const loadServiceDocuments = async (serviceId: number) => {
    setIsLoading(true);
    try {
      const response = await getServiceDocumentsByIdService(serviceId);

      if (response.status === 201 || response.status === 200) {
        setDocuments(response.data);
      }

    } catch (error) {
      console.error('Error loading documents:', error);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!service) return null;

  const totalIncomingDocs = documents.filter(doc => doc.is_required && !doc.doc_is_outcome).length + documents.filter(doc => !doc.is_required && !doc.doc_is_outcome).length;

  return (
    <Collapse in={Boolean(service)} timeout="auto">
      <Paper
        elevation={2}
        sx={{
          mt: 2,
          mb: 3,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'primary.light',
          bgcolor: 'background.paper'
        }}
      >
        <Box
          sx={{
            p: 2,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <InfoOutlined />
            <Typography variant="subtitle1" fontWeight="bold">
              {t('label:serviceInfoPanel.title')}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Stack direction="row" spacing={1}>
              <Chip
                label={t('label:serviceInfoPanel.daysCount', { count: service.day_count })}
                size="small"
                icon={<AccessTime />}
                sx={{ bgcolor: 'white', color: 'primary.main' }}
              />
            </Stack>
          </Box>
        </Box>

        <Box sx={{ p: 2 }}>
          {service.description && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                {service.description}
              </Typography>
            </Alert>
          )}

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" gap={2} width="100%">
                <Description color="primary" />
                <Typography variant="subtitle2" fontWeight="medium">
                  {t('label:serviceInfoPanel.requiredDocuments')}
                </Typography>
                {!isLoading && (
                  <Chip
                    label={t('label:serviceInfoPanel.requiredDocumentsCount', {
                      required: documents.filter(doc => doc.is_required && !doc.doc_is_outcome).length,
                      total: totalIncomingDocs
                    })}
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {isLoading ? (
                <Box>
                  <Skeleton variant="rectangular" height={60} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" height={60} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" height={60} />
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {documents.filter(doc => doc.is_required && !doc.doc_is_outcome).length > 0 && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="error" fontWeight="bold" gutterBottom>
                        {t('label:serviceInfoPanel.mandatoryDocumentsTitle')}
                      </Typography>
                      <List dense sx={{ mt: 1 }}>
                        {documents.filter(doc => doc.is_required && !doc.doc_is_outcome).map((doc) => (
                          <ListItem
                            key={doc.id}
                            sx={{
                              pl: 0,
                              ...(doc.background_color && {
                                bgcolor: doc.background_color,
                                borderRadius: 1,
                                mb: 0.5,
                                px: 1
                              })
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircle color="error" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary={getDocumentName(doc)}
                              secondary={getDocumentDescription(doc)}
                              primaryTypographyProps={{
                                variant: 'body2',
                                fontWeight: 'medium',
                                ...(doc.text_color && { color: doc.text_color })
                              }}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  )}

                  {documents.filter(doc => !doc.is_required && !doc.doc_is_outcome).length > 0 && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold" gutterBottom>
                        {t('label:serviceInfoPanel.optionalDocumentsTitle')}
                      </Typography>
                      <List dense sx={{ mt: 1 }}>
                        {documents.filter(doc => !doc.is_required && !doc.doc_is_outcome).map((doc) => (
                          <ListItem
                            key={doc.id}
                            sx={{
                              pl: 0,
                              ...(doc.background_color && {
                                bgcolor: doc.background_color,
                                borderRadius: 1,
                                mb: 0.5,
                                px: 1
                              })
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Article color="action" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary={getDocumentName(doc)}
                              secondary={getDocumentDescription(doc)}
                              primaryTypographyProps={{
                                variant: 'body2',
                                ...(doc.text_color && { color: doc.text_color })
                              }}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  )}
                </Grid>
              )}
            </AccordionDetails>
          </Accordion>

          {documents.filter(doc => doc.doc_is_outcome).length > 0 && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" alignItems="center" gap={2}>
                  <FolderOpen color="primary" />
                  <Typography variant="subtitle2" fontWeight="medium">
                    {t('label:serviceInfoPanel.outputDocuments')}
                  </Typography>
                  <Chip
                    label={t('label:serviceInfoPanel.outputDocumentsCount', {
                      count: documents.filter(doc => doc.doc_is_outcome && !getDocumentName(doc)?.toLowerCase()?.includes("отказ")).length
                    })}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {documents.filter(doc => doc.doc_is_outcome && !getDocumentName(doc)?.toLowerCase()?.includes("отказ")).map((doc) => (
                    <ListItem
                      key={doc.id}
                      sx={{
                        pl: 0,
                        ...(doc.background_color && {
                          bgcolor: doc.background_color,
                          borderRadius: 1,
                          mb: 0.5,
                          px: 1
                        })
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Assignment color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={getDocumentName(doc)}
                        secondary={getDocumentDescription(doc)}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: 'medium',
                          ...(doc.text_color && { color: doc.text_color })
                        }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          )}

          <Box mt={2}>
            <Alert severity="warning" icon={<Warning />}>
              <Typography variant="subtitle2" gutterBottom>
                {t('label:serviceInfoPanel.notice.title')}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                • {t('label:serviceInfoPanel.notice.documentsActual')}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                • {t('label:serviceInfoPanel.notice.documentsClear')}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                • {t('label:serviceInfoPanel.notice.additionalDocuments')}
              </Typography>
              {documents.filter(doc => doc.is_required && !doc.doc_is_outcome).some(doc => doc.law_description) && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  • {t('label:serviceInfoPanel.notice.lawRequirements')}
                </Typography>
              )}
            </Alert>
          </Box>
        </Box>
      </Paper>
    </Collapse>
  );
};

export default ServiceInfoPanelV2;