import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import PayerRequisitePopupForm from '../PayerRequisiteAddEditView/popupForm';
import store from "./store";


type PayerRequisiteListViewProps = {
  mainId: number;

};


const PayerRequisiteListView: FC<PayerRequisiteListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.setMainId(props.mainId)
  }, [props.mainId]);
  

  const columns: GridColDef[] = [
    
    {
      field: 'paymentAccount',
      headerName: translate("label:PayerRequisiteListView.paymentAccount"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_PayerRequisite_column_paymentAccount"> {param.row.paymentAccount} </div>),
      renderHeader: (param) => (<div data-testid="table_PayerRequisite_header_paymentAccount">{param.colDef.headerName}</div>)
    },
    {
      field: 'bank',
      headerName: translate("label:PayerRequisiteListView.bank"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_PayerRequisite_column_bank"> {param.row.bank} </div>),
      renderHeader: (param) => (<div data-testid="table_PayerRequisite_header_bank">{param.colDef.headerName}</div>)
    },
    {
      field: 'bik',
      headerName: translate("label:PayerRequisiteListView.bik"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_PayerRequisite_column_bik"> {param.row.bik} </div>),
      renderHeader: (param) => (<div data-testid="table_PayerRequisite_header_bik">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:PayerRequisiteListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="PayerRequisite"
      onDeleteClicked={(id) => store.deletePayerRequisite(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadPayerRequisites,
        clearStore: store.clearStore
      }}
      viewMode="popup"
    >
      <PayerRequisitePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadPayerRequisites();
        }}
      />
    </BaseListView>
  );
})



export default PayerRequisiteListView
