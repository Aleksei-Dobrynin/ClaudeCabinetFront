import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import CustomerRequisitePopupForm from '../CustomerRequisiteAddEditView/popupForm';
import store from "./store";


type CustomerRequisiteListViewProps = {
  mainId: number;

};


const CustomerRequisiteListView: FC<CustomerRequisiteListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.setMainId(props.mainId)
  }, [props.mainId]);
  

  const columns: GridColDef[] = [
    
    {
      field: 'paymentAccount',
      headerName: translate("label:CustomerRequisiteListView.paymentAccount"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_CustomerRequisite_column_paymentAccount"> {param.row.paymentAccount} </div>),
      renderHeader: (param) => (<div data-testid="table_CustomerRequisite_header_paymentAccount">{param.colDef.headerName}</div>)
    },
    {
      field: 'bank',
      headerName: translate("label:CustomerRequisiteListView.bank"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_CustomerRequisite_column_bank"> {param.row.bank} </div>),
      renderHeader: (param) => (<div data-testid="table_CustomerRequisite_header_bank">{param.colDef.headerName}</div>)
    },
    {
      field: 'bik',
      headerName: translate("label:CustomerRequisiteListView.bik"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_CustomerRequisite_column_bik"> {param.row.bik} </div>),
      renderHeader: (param) => (<div data-testid="table_CustomerRequisite_header_bik">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:CustomerRequisiteListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="CustomerRequisite"
      // onDeleteClicked={(id) => store.deleteCustomerRequisite(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadCustomerRequisites,
        clearStore: store.clearStore
      }}
      viewMode="popup"
    >
      <CustomerRequisitePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        mainId={props.mainId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadCustomerRequisites();
        }}
      />
    </BaseListView>
  );
})



export default CustomerRequisiteListView
