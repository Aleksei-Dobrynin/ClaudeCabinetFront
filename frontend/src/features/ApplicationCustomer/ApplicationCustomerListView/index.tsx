import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import ApplicationCustomerPopupForm from '../ApplicationCustomerAddEditView/popupForm';
import store from "./store";


type ApplicationCustomerListViewProps = {
  mainId: number;

};


const ApplicationCustomerListView: FC<ApplicationCustomerListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.setMainId(props.mainId)
  }, [props.mainId]);
  

  const columns: GridColDef[] = [
    
    {
      field: 'director',
      headerName: translate("label:ApplicationCustomerListView.director"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationCustomer_column_director"> {param.row.director} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationCustomer_header_director">{param.colDef.headerName}</div>)
    },
    {
      field: 'okpo',
      headerName: translate("label:ApplicationCustomerListView.okpo"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationCustomer_column_okpo"> {param.row.okpo} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationCustomer_header_okpo">{param.colDef.headerName}</div>)
    },
    {
      field: 'paymentAccount',
      headerName: translate("label:ApplicationCustomerListView.paymentAccount"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationCustomer_column_paymentAccount"> {param.row.paymentAccount} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationCustomer_header_paymentAccount">{param.colDef.headerName}</div>)
    },
    {
      field: 'postalCode',
      headerName: translate("label:ApplicationCustomerListView.postalCode"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationCustomer_column_postalCode"> {param.row.postalCode} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationCustomer_header_postalCode">{param.colDef.headerName}</div>)
    },
    {
      field: 'ugns',
      headerName: translate("label:ApplicationCustomerListView.ugns"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationCustomer_column_ugns"> {param.row.ugns} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationCustomer_header_ugns">{param.colDef.headerName}</div>)
    },
    {
      field: 'bank',
      headerName: translate("label:ApplicationCustomerListView.bank"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationCustomer_column_bank"> {param.row.bank} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationCustomer_header_bank">{param.colDef.headerName}</div>)
    },
    {
      field: 'bik',
      headerName: translate("label:ApplicationCustomerListView.bik"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationCustomer_column_bik"> {param.row.bik} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationCustomer_header_bik">{param.colDef.headerName}</div>)
    },
    {
      field: 'registrationNumber',
      headerName: translate("label:ApplicationCustomerListView.registrationNumber"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationCustomer_column_registrationNumber"> {param.row.registrationNumber} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationCustomer_header_registrationNumber">{param.colDef.headerName}</div>)
    },
    {
      field: 'identityDocumentTypeId',
      headerName: translate("label:ApplicationCustomerListView.identityDocumentTypeId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationCustomer_column_identityDocumentTypeId"> {param.row.identityDocumentTypeId} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationCustomer_header_identityDocumentTypeId">{param.colDef.headerName}</div>)
    },
    {
      field: 'organizationTypeId',
      headerName: translate("label:ApplicationCustomerListView.organizationTypeId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationCustomer_column_organizationTypeId"> {param.row.organizationTypeId} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationCustomer_header_organizationTypeId">{param.colDef.headerName}</div>)
    },
    {
      field: 'pin',
      headerName: translate("label:ApplicationCustomerListView.pin"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationCustomer_column_pin"> {param.row.pin} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationCustomer_header_pin">{param.colDef.headerName}</div>)
    },
    {
      field: 'isOrganization',
      headerName: translate("label:ApplicationCustomerListView.isOrganization"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationCustomer_column_isOrganization"> {param.row.isOrganization} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationCustomer_header_isOrganization">{param.colDef.headerName}</div>)
    },
    {
      field: 'fullName',
      headerName: translate("label:ApplicationCustomerListView.fullName"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationCustomer_column_fullName"> {param.row.fullName} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationCustomer_header_fullName">{param.colDef.headerName}</div>)
    },
    {
      field: 'address',
      headerName: translate("label:ApplicationCustomerListView.address"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationCustomer_column_address"> {param.row.address} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationCustomer_header_address">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:ApplicationCustomerListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="ApplicationCustomer"
      onDeleteClicked={(id) => store.deleteApplicationCustomer(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadApplicationCustomers,
        clearStore: store.clearStore
      }}
      viewMode="popup"
    >
      <ApplicationCustomerPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadApplicationCustomers();
        }}
      />
    </BaseListView>
  );
})



export default ApplicationCustomerListView
