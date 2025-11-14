import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import UserPopupForm from '../UserAddEditView/popupForm';
import store from "./store";


type UserListViewProps = {
  
};


const UserListView: FC<UserListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  

  const columns: GridColDef[] = [
    
    {
      field: 'isApproved',
      headerName: translate("label:UserListView.isApproved"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_User_column_isApproved"> {param.row.isApproved} </div>),
      renderHeader: (param) => (<div data-testid="table_User_header_isApproved">{param.colDef.headerName}</div>)
    },
    {
      field: 'lastName',
      headerName: translate("label:UserListView.lastName"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_User_column_lastName"> {param.row.lastName} </div>),
      renderHeader: (param) => (<div data-testid="table_User_header_lastName">{param.colDef.headerName}</div>)
    },
    {
      field: 'firstName',
      headerName: translate("label:UserListView.firstName"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_User_column_firstName"> {param.row.firstName} </div>),
      renderHeader: (param) => (<div data-testid="table_User_header_firstName">{param.colDef.headerName}</div>)
    },
    {
      field: 'secondName',
      headerName: translate("label:UserListView.secondName"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_User_column_secondName"> {param.row.secondName} </div>),
      renderHeader: (param) => (<div data-testid="table_User_header_secondName">{param.colDef.headerName}</div>)
    },
    {
      field: 'pin',
      headerName: translate("label:UserListView.pin"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_User_column_pin"> {param.row.pin} </div>),
      renderHeader: (param) => (<div data-testid="table_User_header_pin">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:UserListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="User"
      onDeleteClicked={(id) => store.deleteUser(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadUsers,
        clearStore: store.clearStore
      }}
      viewMode="form"
    >
      <UserPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadUsers();
        }}
      />
    </BaseListView>
  );
})



export default UserListView
