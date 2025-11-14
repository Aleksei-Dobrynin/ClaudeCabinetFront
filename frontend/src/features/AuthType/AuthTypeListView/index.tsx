import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import AuthTypePopupForm from '../AuthTypeAddEditView/popupForm';
import store from "./store";


type AuthTypeListViewProps = {
  
};


const AuthTypeListView: FC<AuthTypeListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  

  const columns: GridColDef[] = [
    
    {
      field: 'description',
      headerName: translate("label:AuthTypeListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_AuthType_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_AuthType_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'name',
      headerName: translate("label:AuthTypeListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_AuthType_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_AuthType_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:AuthTypeListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_AuthType_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_AuthType_header_code">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:AuthTypeListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="AuthType"
      onDeleteClicked={(id) => store.deleteAuthType(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadAuthTypes,
        clearStore: store.clearStore
      }}
      viewMode="form"
    >
      <AuthTypePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadAuthTypes();
        }}
      />
    </BaseListView>
  );
})



export default AuthTypeListView
