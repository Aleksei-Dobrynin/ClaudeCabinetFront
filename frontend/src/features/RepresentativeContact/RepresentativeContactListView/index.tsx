import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import RepresentativeContactPopupForm from '../RepresentativeContactAddEditView/popupForm';
import store from "./store";


type RepresentativeContactListViewProps = {
  
};


const RepresentativeContactListView: FC<RepresentativeContactListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  

  const columns: GridColDef[] = [
    
    {
      field: 'value',
      headerName: translate("label:RepresentativeContactListView.value"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_RepresentativeContact_column_value"> {param.row.value} </div>),
      renderHeader: (param) => (<div data-testid="table_RepresentativeContact_header_value">{param.colDef.headerName}</div>)
    },
    {
      field: 'allowNotification',
      headerName: translate("label:RepresentativeContactListView.allowNotification"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_RepresentativeContact_column_allowNotification"> {param.row.allowNotification} </div>),
      renderHeader: (param) => (<div data-testid="table_RepresentativeContact_header_allowNotification">{param.colDef.headerName}</div>)
    },
    {
      field: 'rTypeId',
      headerName: translate("label:RepresentativeContactListView.rTypeId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_RepresentativeContact_column_rTypeId"> {param.row.rTypeId} </div>),
      renderHeader: (param) => (<div data-testid="table_RepresentativeContact_header_rTypeId">{param.colDef.headerName}</div>)
    },
    {
      field: 'representativeId',
      headerName: translate("label:RepresentativeContactListView.representativeId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_RepresentativeContact_column_representativeId"> {param.row.representativeId} </div>),
      renderHeader: (param) => (<div data-testid="table_RepresentativeContact_header_representativeId">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:RepresentativeContactListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="RepresentativeContact"
      onDeleteClicked={(id) => store.deleteRepresentativeContact(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadRepresentativeContacts,
        clearStore: store.clearStore
      }}
      viewMode="form"
    >
      <RepresentativeContactPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadRepresentativeContacts();
        }}
      />
    </BaseListView>
  );
})



export default RepresentativeContactListView
