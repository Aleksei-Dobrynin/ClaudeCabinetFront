import React, { useState, useEffect } from 'react';
import Joyride, { STATUS, Step } from 'react-joyride';
import { useTranslation } from 'react-i18next';
import MainStore from "./MainStore";
import { setSeenTour } from "./api/User";

const AppTour: React.FC = () => {
  const { t } = useTranslation();
  const [run, setRun] = useState(false);

  const steps: Step[] = [
    {
      target: '.profile-icon',
      content: t('label:tour.steps.welcome'),
      placement: 'bottom',
      disableBeacon: true
    },
    {
      target: '.menu-item-archive',
      content: t('label:tour.steps.archive'),
      placement: 'right',
      disableBeacon: true
    },
    {
      target: '.menu-item-in-progress',
      content: t('label:tour.steps.inProgress'),
      placement: 'right',
      disableBeacon: true
    },
    {
      target: '.menu-item-history',
      content: t('label:tour.steps.history'),
      placement: 'right',
      disableBeacon: true
    }
  ];

  useEffect(() => {
    if (MainStore.currentUser?.is_seen_tour != true){
      setRun(true);
    }
  }, [MainStore.currentUser?.is_seen_tour]);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setSeenTour();
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      callback={handleJoyrideCallback}
      continuous
      showSkipButton
      scrollToFirstStep
      locale={{
        back: t('label:tour.back'),
        close: t('label:tour.close'),
        last: t('label:tour.last'),
        next: t('label:tour.next'),
        skip: t('label:tour.skip')
      }}
      styles={{
        options: {
          arrowColor: '#ffffff',
          backgroundColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.4)',
          primaryColor: '#2B6CB0',
          textColor: '#2c2c2c',
          width: 400,
          zIndex: 10000,
        },
        buttonNext: {
          backgroundColor: '#2B6CB0',
          color: '#ffffff',
          borderRadius: '6px',
          padding: '6px 16px',
        },
        buttonSkip: {
          backgroundColor: '#9B2C2C',
          color: '#ffffff',
          borderRadius: '6px',
          padding: '6px 16px',
        },
        buttonBack: {
          color: '#888',
          marginRight: 8,
        },
        buttonClose: {
          color: '#999',
        },
        tooltipContainer: {
          padding: '16px 20px',
        },
        tooltipContent: {
          fontSize: '15px',
          lineHeight: '1.5',
        },
      }}
    />
  );
};

export default AppTour;