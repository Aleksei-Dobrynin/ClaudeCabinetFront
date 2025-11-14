import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import UserAuthMethodsPopupForm from '../UserAuthMethodsAddEditView/popupForm';
import store from "./store";


type UserAuthMethodsListViewProps = {
  mainId: number;

};


const UserAuthMethodsListView: FC<UserAuthMethodsListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.setMainId(props.mainId)
  }, [props.mainId]);
  

  const columns: GridColDef[] = [
    
    {
      field: 'authTypeId',
      headerName: translate("label:UserAuthMethodsListView.authTypeId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_UserAuthMethods_column_authTypeId"> {param.row.authTypeId} </div>),
      renderHeader: (param) => (<div data-testid="table_UserAuthMethods_header_authTypeId">{param.colDef.headerName}</div>)
    },
    {
      field: 'authData',
      headerName: translate("label:UserAuthMethodsListView.authData"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_UserAuthMethods_column_authData"> {param.row.authData} </div>),
      renderHeader: (param) => (<div data-testid="table_UserAuthMethods_header_authData">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:UserAuthMethodsListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="UserAuthMethods"
      onDeleteClicked={(id) => store.deleteUserAuthMethods(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadUserAuthMethodss,
        clearStore: store.clearStore
      }}
      viewMode="popup"
    >
      <UserAuthMethodsPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadUserAuthMethodss();
        }}
      />
    </BaseListView>
  );
})



export default UserAuthMethodsListView
