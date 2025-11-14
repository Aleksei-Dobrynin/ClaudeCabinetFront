import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import NotificationLogPopupForm from '../NotificationLogAddEditView/popupForm';
import store from "./store";


type NotificationLogListViewProps = {
  
};


const NotificationLogListView: FC<NotificationLogListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  

  const columns: GridColDef[] = [
    
    {
      field: 'text',
      headerName: translate("label:NotificationLogListView.text"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_NotificationLog_column_text"> {param.row.text} </div>),
      renderHeader: (param) => (<div data-testid="table_NotificationLog_header_text">{param.colDef.headerName}</div>)
    },
    {
      field: 'title',
      headerName: translate("label:NotificationLogListView.title"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_NotificationLog_column_title"> {param.row.title} </div>),
      renderHeader: (param) => (<div data-testid="table_NotificationLog_header_title">{param.colDef.headerName}</div>)
    },
    {
      field: 'applicationId',
      headerName: translate("label:NotificationLogListView.applicationId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_NotificationLog_column_applicationId"> {param.row.applicationId} </div>),
      renderHeader: (param) => (<div data-testid="table_NotificationLog_header_applicationId">{param.colDef.headerName}</div>)
    },
    {
      field: 'contact',
      headerName: translate("label:NotificationLogListView.contact"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_NotificationLog_column_contact"> {param.row.contact} </div>),
      renderHeader: (param) => (<div data-testid="table_NotificationLog_header_contact">{param.colDef.headerName}</div>)
    },
    {
      field: 'dateSend',
      headerName: translate("label:NotificationLogListView.dateSend"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_NotificationLog_column_dateSend"> {param.row.dateSend} </div>),
      renderHeader: (param) => (<div data-testid="table_NotificationLog_header_dateSend">{param.colDef.headerName}</div>)
    },
    {
      field: 'rContactTypeId',
      headerName: translate("label:NotificationLogListView.rContactTypeId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_NotificationLog_column_rContactTypeId"> {param.row.rContactTypeId} </div>),
      renderHeader: (param) => (<div data-testid="table_NotificationLog_header_rContactTypeId">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:NotificationLogListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="NotificationLog"
      onDeleteClicked={(id) => store.deleteNotificationLog(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadNotificationLogs,
        clearStore: store.clearStore
      }}
      viewMode="form"
    >
      <NotificationLogPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadNotificationLogs();
        }}
      />
    </BaseListView>
  );
})



export default NotificationLogListView
