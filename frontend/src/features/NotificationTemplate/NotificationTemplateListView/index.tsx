import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import NotificationTemplatePopupForm from '../NotificationTemplateAddEditView/popupForm';
import store from "./store";


type NotificationTemplateListViewProps = {
  
};


const NotificationTemplateListView: FC<NotificationTemplateListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  

  const columns: GridColDef[] = [
    
    {
      field: 'contactTypeId',
      headerName: translate("label:NotificationTemplateListView.contactTypeId"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_NotificationTemplate_column_contactTypeId"> {param.row.contactTypeId} </div>),
      renderHeader: (param) => (<div data-testid="table_NotificationTemplate_header_contactTypeId">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:NotificationTemplateListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_NotificationTemplate_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_NotificationTemplate_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'subject',
      headerName: translate("label:NotificationTemplateListView.subject"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_NotificationTemplate_column_subject"> {param.row.subject} </div>),
      renderHeader: (param) => (<div data-testid="table_NotificationTemplate_header_subject">{param.colDef.headerName}</div>)
    },
    {
      field: 'body',
      headerName: translate("label:NotificationTemplateListView.body"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_NotificationTemplate_column_body"> {param.row.body} </div>),
      renderHeader: (param) => (<div data-testid="table_NotificationTemplate_header_body">{param.colDef.headerName}</div>)
    },
    {
      field: 'placeholders',
      headerName: translate("label:NotificationTemplateListView.placeholders"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_NotificationTemplate_column_placeholders"> {param.row.placeholders} </div>),
      renderHeader: (param) => (<div data-testid="table_NotificationTemplate_header_placeholders">{param.colDef.headerName}</div>)
    },
    {
      field: 'link',
      headerName: translate("label:NotificationTemplateListView.link"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_NotificationTemplate_column_link"> {param.row.link} </div>),
      renderHeader: (param) => (<div data-testid="table_NotificationTemplate_header_link">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:NotificationTemplateListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="NotificationTemplate"
      onDeleteClicked={(id) => store.deleteNotificationTemplate(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadNotificationTemplates,
        clearStore: store.clearStore
      }}
      viewMode="form"
    >
      <NotificationTemplatePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadNotificationTemplates();
        }}
      />
    </BaseListView>
  );
})



export default NotificationTemplateListView
