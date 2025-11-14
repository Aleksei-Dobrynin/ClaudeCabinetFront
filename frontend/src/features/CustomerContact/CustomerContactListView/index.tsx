import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import CustomerContactPopupForm from '../CustomerContactAddEditView/popupForm';
import store from "./store";


type CustomerContactListViewProps = {
  mainId: number;

};


const CustomerContactListView: FC<CustomerContactListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.setMainId(props.mainId)
  }, [props.mainId]);
  

  const columns: GridColDef[] = [
    
    {
      field: 'value',
      headerName: translate("label:CustomerContactListView.value"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_CustomerContact_column_value"> {param.row.value} </div>),
      renderHeader: (param) => (<div data-testid="table_CustomerContact_header_value">{param.colDef.headerName}</div>)
    },
    {
      field: 'allowNotification',
      headerName: translate("label:CustomerContactListView.allowNotification"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_CustomerContact_column_allowNotification"> {param.row.allowNotification} </div>),
      renderHeader: (param) => (<div data-testid="table_CustomerContact_header_allowNotification">{param.colDef.headerName}</div>)
    },
    {
      field: 'rTypeId',
      headerName: translate("label:CustomerContactListView.rTypeId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_CustomerContact_column_rTypeId"> {param.row.rTypeId} </div>),
      renderHeader: (param) => (<div data-testid="table_CustomerContact_header_rTypeId">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:CustomerContactListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="CustomerContact"
      onDeleteClicked={(id) => store.deleteCustomerContact(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadCustomerContacts,
        clearStore: store.clearStore
      }}
      viewMode="popup"
    >
      <CustomerContactPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        mainId={props.mainId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadCustomerContacts();
        }}
      />
    </BaseListView>
  );
})



export default CustomerContactListView
