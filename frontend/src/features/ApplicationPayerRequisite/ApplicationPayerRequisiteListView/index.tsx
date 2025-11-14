import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import ApplicationPayerRequisitePopupForm from '../ApplicationPayerRequisiteAddEditView/popupForm';
import store from "./store";


type ApplicationPayerRequisiteListViewProps = {
  mainId: number;

};


const ApplicationPayerRequisiteListView: FC<ApplicationPayerRequisiteListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.setMainId(props.mainId)
  }, [props.mainId]);
  

  const columns: GridColDef[] = [
    
    {
      field: 'paymentAccount',
      headerName: translate("label:ApplicationPayerRequisiteListView.paymentAccount"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationPayerRequisite_column_paymentAccount"> {param.row.paymentAccount} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationPayerRequisite_header_paymentAccount">{param.colDef.headerName}</div>)
    },
    {
      field: 'bank',
      headerName: translate("label:ApplicationPayerRequisiteListView.bank"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationPayerRequisite_column_bank"> {param.row.bank} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationPayerRequisite_header_bank">{param.colDef.headerName}</div>)
    },
    {
      field: 'bik',
      headerName: translate("label:ApplicationPayerRequisiteListView.bik"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ApplicationPayerRequisite_column_bik"> {param.row.bik} </div>),
      renderHeader: (param) => (<div data-testid="table_ApplicationPayerRequisite_header_bik">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:ApplicationPayerRequisiteListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="ApplicationPayerRequisite"
      onDeleteClicked={(id) => store.deleteApplicationPayerRequisite(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadApplicationPayerRequisites,
        clearStore: store.clearStore
      }}
      viewMode="popup"
    >
      <ApplicationPayerRequisitePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadApplicationPayerRequisites();
        }}
      />
    </BaseListView>
  );
})



export default ApplicationPayerRequisiteListView
