import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react';
import { Paper } from '@mui/material';
import store from './store';
import { useTranslation } from 'react-i18next';
import ApplicationStatusHistoryListView from 'features/ApplicationStatusHistory/ApplicationStatusHistoryListView';
              import ApplicationPayerListView from 'features/ApplicationPayer/ApplicationPayerListView';
              import ApplicationCustomerListView from 'features/ApplicationCustomer/ApplicationCustomerListView';
              import UploadedApplicationDocumentListView from 'features/UploadedApplicationDocument/UploadedApplicationDocumentListView';
              



const ApplicationMtmTabs = observer(() => {
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();
  const translate = t;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box component={Paper} elevation={5}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab data-testid={"ApplicationStatusHistoryTabTitle"} label={translate("label:ApplicationStatusHistoryListView.entityTitle")} {...a11yProps(0)} />
              <Tab data-testid={"ApplicationPayerTabTitle"} label={translate("label:ApplicationPayerListView.entityTitle")} {...a11yProps(1)} />
              <Tab data-testid={"ApplicationCustomerTabTitle"} label={translate("label:ApplicationCustomerListView.entityTitle")} {...a11yProps(2)} />
              <Tab data-testid={"UploadedApplicationDocumentTabTitle"} label={translate("label:UploadedApplicationDocumentListView.entityTitle")} {...a11yProps(3)} />
              
        </Tabs>
      </Box>
      
      <CustomTabPanel value={value} index={0}>
        <ApplicationStatusHistoryListView mainId={store.id} />
      </CustomTabPanel>
            
      {/* <CustomTabPanel value={value} index={1}>
        <ApplicationPayerListView mainId={store.id} />
      </CustomTabPanel> */}
            
      <CustomTabPanel value={value} index={2}>
        <ApplicationCustomerListView mainId={store.id} />
      </CustomTabPanel>
            
      <CustomTabPanel value={value} index={3}>
        <UploadedApplicationDocumentListView disabled={false} mainId={store.id} />
      </CustomTabPanel>
            
    </Box>
  );

})


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default ApplicationMtmTabs