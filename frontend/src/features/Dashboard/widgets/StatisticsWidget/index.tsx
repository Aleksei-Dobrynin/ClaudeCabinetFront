// components/dashboard-beta/widgets/StatisticsWidget/index.tsx

import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
  alpha,
  Grow,
  Tooltip,
  Button
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  HourglassEmpty as HourglassEmptyIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { statisticsStore } from '../../stores/dashboard/StatisticsStore';
import { StatisticsWidgetProps, DashboardStats } from '../../types/dashboard';
import WidgetWrapper from '../../components/WidgetWrapper';
import SkeletonLoader from '../../components/SkeletonLoader';
import { useWidget } from '../../hooks/useWidget';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  url?: string;
  onClick?: () => void;
  delay?: number;
}> = ({ title, value, icon, color, trend, onClick, delay = 0 }) => {
  const theme = useTheme();

  return (
    <Grow in timeout={300 + delay}>
      <Card
        sx={{
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          '&:hover': onClick ? {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
          } : {},
        }}
        onClick={onClick}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                {title}
              </Typography>
              <Typography variant="h4" component="div" sx={{ mb: 0.5, fontWeight: 600 }}>
                <CountUp
                  start={0}
                  end={value}
                  duration={1.5}
                  separator=" "
                  delay={delay / 1000}
                />
              </Typography>

            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: alpha(color, 0.1),
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
            {/* {trend !== undefined && (
              <Tooltip title={`${trend > 0 ? '+' : ''}${trend}% от прошлого месяца`}>
                <Chip
                  size="small"
                  icon={trend > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  label={`${Math.abs(trend)}%`}
                  color={trend > 0 ? 'success' : 'error'}
                  sx={{ height: 24 }}
                />
              </Tooltip>
            )} */}
          </Box>

        </CardContent>
      </Card>
    </Grow>
  );
};

const StatisticsWidget: React.FC<StatisticsWidgetProps> = observer(({
  size = 'normal',
  onCardClick,
  refreshInterval = 30000
}) => {
  const { t } = useTranslation('dashboard');
  const theme = useTheme();
  const { refresh } = useWidget({
    widgetId: 'widget-statistics',
    refreshInterval
  });

  useEffect(() => {
    if (!statisticsStore.lastUpdated) {
      statisticsStore.fetchStatistics();
    }
  }, []);

  const stats: Array<{
    key: keyof DashboardStats;
    title: string;
    icon: React.ReactNode;
    color: string;
    trend?: number;
    url?: string;
  }> = [
      {
        key: 'total',
        title: t('label:dashboard.statistics.total'),
        icon: <AssignmentIcon />,
        color: theme.palette.primary.main,
        trend: 12,
        url: "/user/ApplicationAll",
      },
      {
        key: 'requires_action',
        title: t('label:dashboard.statistics.requiresAction'),
        icon: <WarningIcon />,
        color: theme.palette.warning.main,
        trend: -5,
        url: "/user/ApplicationNeedAction",
      },
      {
        key: 'in_progress',
        title: t('label:dashboard.statistics.inProgress'),
        icon: <HourglassEmptyIcon />,
        color: theme.palette.info.main,
        trend: 8,
        url: "/user/ApplicationOnWork",
      },
      {
        key: 'completed',
        title: t('label:dashboard.statistics.completed'),
        icon: <CheckCircleIcon />,
        color: theme.palette.success.main,
        trend: 15,
        url: "/user/ApplicationDone",
      }
    ];

  const navigate = useNavigate()
  const handleCardClick = (statType: keyof DashboardStats) => {
    if (onCardClick) {
      onCardClick(statType);
    }
  };

  const handleRefresh = async () => {
    await statisticsStore.refreshStatistics();
    refresh();
  };

  if (statisticsStore.isLoading && !statisticsStore.lastUpdated) {
    return <SkeletonLoader type="statistics" />;
  }

  return (
    <WidgetWrapper
      title={t('label:dashboard.statistics.title')}
      loading={statisticsStore.isLoading}
      error={statisticsStore.error}
      onRefresh={handleRefresh}
    >
      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={size === 'compact' ? 6 : 3}
            key={stat.key}
          >
            <StatCard
              title={stat.title}
              value={statisticsStore.stats[stat.key]}
              icon={stat.icon}
              color={stat.color}
              url={stat.url}
              trend={stat.trend}
              onClick={() => {
                navigate(stat.url)
              }}
              delay={index * 100}
            />
          </Grid>
        ))}
      </Grid>

      {size !== 'compact' && (
        <Box
          sx={{
            mt: 3,
            pt: 3,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button variant='contained' onClick={() => {
            navigate(`/user/Stepper?id=0`)
          }}>
            {t("label:ApplicationListView.createNewApplication")}
          </Button>
          <Typography variant="body2" color="text.secondary">
            {statisticsStore.lastUpdated &&
              `Обновлено: ${new Date(statisticsStore.lastUpdated).toLocaleTimeString()}`
            }
          </Typography>
          {/* <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => onCardClick?.('total')}
          >
            {t('label:dashboard.statistics.goToApplications')} →
          </Typography> */}
        </Box>
      )}
    </WidgetWrapper>
  );
});

export default StatisticsWidget;