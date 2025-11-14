// components/dashboard-beta/core/DashboardContainer.tsx

import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Container,
  Grid,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
  Skeleton
} from '@mui/material';
import { DashboardContainerProps } from './types/dashboard';
import { dashboardStore } from './stores/dashboard/DashboardStore';
import { applicationsStore } from './stores/dashboard/ApplicationStore';
import { statisticsStore } from './stores/dashboard/StatisticsStore';
import StatisticsWidget from './widgets/StatisticsWidget';
import ApplicationsWidget from './widgets/ApplicationsWidget';
import QuickActionsWidget from './widgets/QuickActionsWidget';
import CalendarWidget from './widgets/CalendarWidget';
import ReferenceWidget from './widgets/ReferenceWidget';

const DashboardContainer: React.FC<DashboardContainerProps> = observer(({
  layout = 'grid',
  theme = 'light',
  widgets,
  onWidgetReorder
}) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');

  useEffect(() => {
    // Initialize stores
    dashboardStore.loadConfiguration();
    applicationsStore.fetchApplications();
    statisticsStore.fetchStatistics();
    statisticsStore.startAutoRefresh();

    return () => {
      statisticsStore.stopAutoRefresh();
    };
  }, []);

  useEffect(() => {
    if (layout) dashboardStore.setLayout(layout);
    if (theme) dashboardStore.setTheme(theme);
    if (widgets) dashboardStore.reorderWidgets(widgets);
  }, [layout, theme, widgets]);

  const muiTheme = createTheme({
    palette: {
      mode: dashboardStore.isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: dashboardStore.isDarkMode ? '#121212' : '#f5f5f5',
        paper: dashboardStore.isDarkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            },
          },
        },
      },
    },
  });

  const renderWidget = (widgetConfig: any) => {
    if (!widgetConfig.enabled) return null;

    const widgetProps = {
      key: widgetConfig.id,
      ...widgetConfig.settings,
    };

    switch (widgetConfig.type) {
      case 'statistics':
        return <StatisticsWidget {...widgetProps} />;
      case 'applications':
        return <ApplicationsWidget {...widgetProps} />;
      // case 'quickActions':
      //   return <QuickActionsWidget {...widgetProps} />;
      // case 'calendar':
      //   return <CalendarWidget {...widgetProps} />;
      case 'reference':
        return <ReferenceWidget {...widgetProps} />;
      default:
        return null;
    }
  };

  const getGridSize = (widgetType: string, size?: string) => {
    const baseSize = {
      statistics: { xs: 12, sm: 12, md: 12, lg: 12 },
      applications: { xs: 12, sm: 12, md: 12, lg: 12 },
      quickActions: { xs: 12, sm: 12, md: 4, lg: 4 },
      calendar: { xs: 12, sm: 6, md: 4, lg: 4 },
      reference: { xs: 12, sm: 12, md: 12, lg: 12 },
    };

    return baseSize[widgetType] || { xs: 12, sm: 6, md: 4, lg: 4 };
  };

  if (dashboardStore.isLoading) {
    return (
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} key={i}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          py: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Container maxWidth="xl">
          {layout === 'grid' ? (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {dashboardStore.enabledWidgets.map((widget) => (
                <Grid
                  item
                  key={widget.id}
                  {...getGridSize(widget.type, widget.size)}
                >
                  {renderWidget(widget)}
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: layout === 'flex' ? 'column' : 'row',
                gap: 3,
                flexWrap: 'wrap',
              }}
            >
              {dashboardStore.enabledWidgets.map((widget) => (
                <Box
                  key={widget.id}
                  sx={{
                    flex: layout === 'masonry' ? '1 1 auto' : '1',
                    minWidth: isMobile ? '100%' : isTablet ? '48%' : '300px',
                  }}
                >
                  {renderWidget(widget)}
                </Box>
              ))}
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
});

export default DashboardContainer;