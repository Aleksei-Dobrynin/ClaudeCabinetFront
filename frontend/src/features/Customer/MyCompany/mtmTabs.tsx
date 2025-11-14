import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react';
import { Paper } from '@mui/material';
import store from './store';
import { useTranslation } from 'react-i18next';
import CustomerContactListView from 'features/CustomerContact/CustomerContactListView';
import CustomerRequisiteListView from 'features/CustomerRequisite/CustomerRequisiteListView';
import RepresentativeListView from 'features/Representative/RepresentativeListView';
import ApplicationPaidInvoiceListView from 'features/ApplicationPaidInvoice/ApplicationPaidInvoiceListView';
import MainStore from 'MainStore';





const CustomerMtmTabs = observer(() => {
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();
  const translate = t;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box component={Paper} elevation={5} sx={{ mt: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab data-testid={"RepresentativeTabTitle"} label={translate("label:RepresentativeListView.entityTitle")} {...a11yProps(0)} />
          {/* <Tab data-testid={"ApplicationPaidInvoiceTabTable"} label={translate("label:ApplicationPaidInvoiceListView.entityTitle")} {...a11yProps(1)} /> */}

        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <RepresentativeListView mainId={store.id} disabled={MainStore.isCommonCabinet}/>
      </CustomTabPanel>
      {/* <CustomTabPanel value={value} index={1}>
        <ApplicationPaidInvoiceListView customerId={store.id} />
      </CustomTabPanel> */}

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


export default CustomerMtmTabs