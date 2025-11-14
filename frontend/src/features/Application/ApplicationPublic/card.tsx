import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { observer } from 'mobx-react';
import store from './store'
import { Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Define types for component props
interface ApplicationInfoCardProps {
  applicationNumber: string;
  registrationTime: Dayjs;
  status: string;
  statusColor?: string;
  customer: string;
  address: string;
  inn: string;
  serviceName: string;
  objectName: string;
  className?: string;
}

/**
 * ApplicationInfoCard - A component to display information about an architecture application
 */
const ApplicationInfoCard = observer(() => {
  const { t } = useTranslation();
  const translate = t;

  // Format the date using dayjs
  const formattedDate = (date: Dayjs) => {
    try {
      return dayjs(date).format('DD.MM.YYYY HH:mm');
    } catch (error) {
      return translate('label:ApplicationPublic.invalidDate');
    }
  };

  // Get status color based on status name
  const getStatusColor = (statusName: string) => {
    const statusMap = {
      [translate('label:ApplicationPublic.statusApproved')]: '#4caf50',
      [translate('label:ApplicationPublic.statusRejected')]: '#f44336',
      [translate('label:ApplicationPublic.statusInProgress')]: '#ff9800',
      [translate('label:ApplicationPublic.statusWaiting')]: '#2196f3',
    };

    return statusMap[statusName] || '#757575';
  };

  return (
    <Paper elevation={5}>
      <div style={{
        overflow: 'hidden',
        fontFamily: 'Roboto, sans-serif',
        marginBottom: '30px'
      }}>

        {/* Header */}
        <div style={{
          backgroundColor: '#eef2f6',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 500 }}>
            {translate('label:ApplicationPublic.applicationTitle')}{store.mainApplication?.number}
          </h3>
          <span style={{
            backgroundColor: store.mainApplication?.status_color,
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: 500
          }}>
            {store.mainApplication?.status_name}
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: '16px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <p style={{ color: '#757575', margin: '0 0 4px 0', fontSize: '14px' }}>
                {translate('label:ApplicationPublic.registrationTime')}
              </p>
              <p style={{ margin: '0 0 12px 0', fontSize: '16px' }}>
                {store.mainApplication?.registration_date && dayjs(store.mainApplication?.registration_date)?.format("DD.MM.YYYY HH:mm")}
              </p>
            </div>

            <div>
              <p style={{ color: '#757575', margin: '0 0 4px 0', fontSize: '14px' }}>
                {translate('label:ApplicationPublic.customer')}
              </p>
              <p style={{ margin: '0 0 12px 0', fontSize: '16px' }}>
                {store.mainApplication?.customer_name}
              </p>
            </div>

            <div>
              <p style={{ color: '#757575', margin: '0 0 4px 0', fontSize: '14px' }}>
                {translate('label:ApplicationPublic.inn')}
              </p>
              <p style={{ margin: '0 0 12px 0', fontSize: '16px' }}>
                {store.mainApplication?.customer_pin}
              </p>
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '8px', borderTop: '1px solid #e0e0e0', paddingTop: '16px' }}>
              <p style={{ color: '#757575', margin: '0 0 4px 0', fontSize: '14px' }}>
                {translate('label:ApplicationPublic.service')}
              </p>
              <p style={{ margin: '0 0 12px 0', fontSize: '16px' }}>
                {store.rServiceName}
              </p>
            </div>

            <div>
              <p style={{ color: '#757575', margin: '0 0 4px 0', fontSize: '14px' }}>
                {translate('label:ApplicationPublic.address')}
              </p>
              <p style={{ margin: '0 0 12px 0', fontSize: '16px' }}>
                {store.mainApplication?.arch_object_address}
              </p>
            </div>
            <div>
              <p style={{ color: '#757575', margin: '0 0 4px 0', fontSize: '14px' }}>
                {translate('label:ApplicationPublic.object')}
              </p>
              <p style={{ margin: '0 0 0 0', fontSize: '16px' }}>
                {store.workDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
});

export default ApplicationInfoCard;