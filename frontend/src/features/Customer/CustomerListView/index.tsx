import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import CustomerPopupForm from '../CustomerAddEditView/popupForm';
import store from "./store";


type CustomerListViewProps = {
  
};


const CustomerListView: FC<CustomerListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  

  const columns: GridColDef[] = [
    
    {
      field: 'pin',
      headerName: translate("label:CustomerListView.pin"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Customer_column_pin"> {param.row.pin} </div>),
      renderHeader: (param) => (<div data-testid="table_Customer_header_pin">{param.colDef.headerName}</div>)
    },
    {
      field: 'okpo',
      headerName: translate("label:CustomerListView.okpo"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Customer_column_okpo"> {param.row.okpo} </div>),
      renderHeader: (param) => (<div data-testid="table_Customer_header_okpo">{param.colDef.headerName}</div>)
    },
    {
      field: 'postalCode',
      headerName: translate("label:CustomerListView.postalCode"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Customer_column_postalCode"> {param.row.postalCode} </div>),
      renderHeader: (param) => (<div data-testid="table_Customer_header_postalCode">{param.colDef.headerName}</div>)
    },
    {
      field: 'ugns',
      headerName: translate("label:CustomerListView.ugns"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Customer_column_ugns"> {param.row.ugns} </div>),
      renderHeader: (param) => (<div data-testid="table_Customer_header_ugns">{param.colDef.headerName}</div>)
    },
    {
      field: 'regNumber',
      headerName: translate("label:CustomerListView.regNumber"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Customer_column_regNumber"> {param.row.regNumber} </div>),
      renderHeader: (param) => (<div data-testid="table_Customer_header_regNumber">{param.colDef.headerName}</div>)
    },
    {
      field: 'organizationTypeId',
      headerName: translate("label:CustomerListView.organizationTypeId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Customer_column_organizationTypeId"> {param.row.organizationTypeId} </div>),
      renderHeader: (param) => (<div data-testid="table_Customer_header_organizationTypeId">{param.colDef.headerName}</div>)
    },
    {
      field: 'name',
      headerName: translate("label:CustomerListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Customer_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_Customer_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'address',
      headerName: translate("label:CustomerListView.address"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Customer_column_address"> {param.row.address} </div>),
      renderHeader: (param) => (<div data-testid="table_Customer_header_address">{param.colDef.headerName}</div>)
    },
    {
      field: 'director',
      headerName: translate("label:CustomerListView.director"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Customer_column_director"> {param.row.director} </div>),
      renderHeader: (param) => (<div data-testid="table_Customer_header_director">{param.colDef.headerName}</div>)
    },
    {
      field: 'nomer',
      headerName: translate("label:CustomerListView.nomer"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Customer_column_nomer"> {param.row.nomer} </div>),
      renderHeader: (param) => (<div data-testid="table_Customer_header_nomer">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:CustomerListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="Customer"
      onDeleteClicked={(id) => store.deleteCustomer(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadCustomers,
        clearStore: store.clearStore
      }}
      viewMode="form"
    >
      <CustomerPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadCustomers();
        }}
      />
    </BaseListView>
  );
})



export default CustomerListView
