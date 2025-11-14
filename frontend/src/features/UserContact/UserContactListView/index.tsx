import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import UserContactPopupForm from '../UserContactAddEditView/popupForm';
import store from "./store";


type UserContactListViewProps = {
  
};


const UserContactListView: FC<UserContactListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  

  const columns: GridColDef[] = [
    
    {
      field: 'rTypeId',
      headerName: translate("label:UserContactListView.rTypeId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_UserContact_column_rTypeId"> {param.row.rTypeId} </div>),
      renderHeader: (param) => (<div data-testid="table_UserContact_header_rTypeId">{param.colDef.headerName}</div>)
    },
    {
      field: 'rTypeName',
      headerName: translate("label:UserContactListView.rTypeName"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_UserContact_column_rTypeName"> {param.row.rTypeName} </div>),
      renderHeader: (param) => (<div data-testid="table_UserContact_header_rTypeName">{param.colDef.headerName}</div>)
    },
    {
      field: 'value',
      headerName: translate("label:UserContactListView.value"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_UserContact_column_value"> {param.row.value} </div>),
      renderHeader: (param) => (<div data-testid="table_UserContact_header_value">{param.colDef.headerName}</div>)
    },
    {
      field: 'allowNotification',
      headerName: translate("label:UserContactListView.allowNotification"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_UserContact_column_allowNotification"> {param.row.allowNotification} </div>),
      renderHeader: (param) => (<div data-testid="table_UserContact_header_allowNotification">{param.colDef.headerName}</div>)
    },
    {
      field: 'customerId',
      headerName: translate("label:UserContactListView.customerId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_UserContact_column_customerId"> {param.row.customerId} </div>),
      renderHeader: (param) => (<div data-testid="table_UserContact_header_customerId">{param.colDef.headerName}</div>)
    },
    {
      field: 'userId',
      headerName: translate("label:UserContactListView.userId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_UserContact_column_userId"> {param.row.userId} </div>),
      renderHeader: (param) => (<div data-testid="table_UserContact_header_userId">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:UserContactListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="UserContact"
      onDeleteClicked={(id) => store.deleteUserContact(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadUserContacts,
        clearStore: store.clearStore
      }}
      viewMode="form"
    >
      <UserContactPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadUserContacts();
        }}
      />
    </BaseListView>
  );
})



export default UserContactListView
