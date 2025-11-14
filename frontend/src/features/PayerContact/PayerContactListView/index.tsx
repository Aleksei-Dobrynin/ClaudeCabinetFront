import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import PayerContactPopupForm from '../PayerContactAddEditView/popupForm';
import store from "./store";


type PayerContactListViewProps = {
  mainId: number;

};


const PayerContactListView: FC<PayerContactListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.setMainId(props.mainId)
  }, [props.mainId]);
  

  const columns: GridColDef[] = [
    
    {
      field: 'value',
      headerName: translate("label:PayerContactListView.value"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_PayerContact_column_value"> {param.row.value} </div>),
      renderHeader: (param) => (<div data-testid="table_PayerContact_header_value">{param.colDef.headerName}</div>)
    },
    {
      field: 'allowNotification',
      headerName: translate("label:PayerContactListView.allowNotification"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_PayerContact_column_allowNotification"> {param.row.allowNotification} </div>),
      renderHeader: (param) => (<div data-testid="table_PayerContact_header_allowNotification">{param.colDef.headerName}</div>)
    },
    {
      field: 'rTypeId',
      headerName: translate("label:PayerContactListView.rTypeId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_PayerContact_column_rTypeId"> {param.row.rTypeId} </div>),
      renderHeader: (param) => (<div data-testid="table_PayerContact_header_rTypeId">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:PayerContactListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="PayerContact"
      onDeleteClicked={(id) => store.deletePayerContact(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadPayerContacts,
        clearStore: store.clearStore
      }}
      viewMode="popup"
    >
      <PayerContactPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadPayerContacts();
        }}
      />
    </BaseListView>
  );
})



export default PayerContactListView
