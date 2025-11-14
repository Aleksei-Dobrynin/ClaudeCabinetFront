import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import UserLoginHistoryPopupForm from '../UserLoginHistoryAddEditView/popupForm';
import store from "./store";


type UserLoginHistoryListViewProps = {
  mainId: number;

};


const UserLoginHistoryListView: FC<UserLoginHistoryListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.setMainId(props.mainId)
  }, [props.mainId]);
  

  const columns: GridColDef[] = [
    
    {
      field: 'startTime',
      headerName: translate("label:UserLoginHistoryListView.startTime"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_UserLoginHistory_column_startTime"> {param.row.startTime ? dayjs(param.row.startTime)?.format("DD.MM.YYYY HH:mm") : ""} </div>),
      renderHeader: (param) => (<div data-testid="table_UserLoginHistory_header_startTime">{param.colDef.headerName}</div>)
    },
    {
      field: 'endTime',
      headerName: translate("label:UserLoginHistoryListView.endTime"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_UserLoginHistory_column_endTime"> {param.row.endTime ? dayjs(param.row.endTime)?.format("DD.MM.YYYY HH:mm") : ""} </div>),
      renderHeader: (param) => (<div data-testid="table_UserLoginHistory_header_endTime">{param.colDef.headerName}</div>)
    },
    {
      field: 'authTypeId',
      headerName: translate("label:UserLoginHistoryListView.authTypeId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_UserLoginHistory_column_authTypeId"> {param.row.authTypeId} </div>),
      renderHeader: (param) => (<div data-testid="table_UserLoginHistory_header_authTypeId">{param.colDef.headerName}</div>)
    },
    {
      field: 'ipAddress',
      headerName: translate("label:UserLoginHistoryListView.ipAddress"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_UserLoginHistory_column_ipAddress"> {param.row.ipAddress} </div>),
      renderHeader: (param) => (<div data-testid="table_UserLoginHistory_header_ipAddress">{param.colDef.headerName}</div>)
    },
    {
      field: 'device',
      headerName: translate("label:UserLoginHistoryListView.device"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_UserLoginHistory_column_device"> {param.row.device} </div>),
      renderHeader: (param) => (<div data-testid="table_UserLoginHistory_header_device">{param.colDef.headerName}</div>)
    },
    {
      field: 'browser',
      headerName: translate("label:UserLoginHistoryListView.browser"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_UserLoginHistory_column_browser"> {param.row.browser} </div>),
      renderHeader: (param) => (<div data-testid="table_UserLoginHistory_header_browser">{param.colDef.headerName}</div>)
    },
    {
      field: 'os',
      headerName: translate("label:UserLoginHistoryListView.os"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_UserLoginHistory_column_os"> {param.row.os} </div>),
      renderHeader: (param) => (<div data-testid="table_UserLoginHistory_header_os">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:UserLoginHistoryListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="UserLoginHistory"
      onDeleteClicked={(id) => store.deleteUserLoginHistory(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadUserLoginHistorys,
        clearStore: store.clearStore
      }}
      viewMode="popup"
    >
      <UserLoginHistoryPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadUserLoginHistorys();
        }}
      />
    </BaseListView>
  );
})



export default UserLoginHistoryListView
