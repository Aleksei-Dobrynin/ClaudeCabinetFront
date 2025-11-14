import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import LanguagePopupForm from '../LanguageAddEditView/popupForm';
import store from "./store";


type LanguageListViewProps = {
  
};


const LanguageListView: FC<LanguageListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  

  const columns: GridColDef[] = [
    
    {
      field: 'name',
      headerName: translate("label:LanguageListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Language_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_Language_header_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'nameKg',
      headerName: translate("label:LanguageListView.nameKg"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Language_column_nameKg"> {param.row.nameKg} </div>),
      renderHeader: (param) => (<div data-testid="table_Language_header_nameKg">{param.colDef.headerName}</div>)
    },
    {
      field: 'descriptionKg',
      headerName: translate("label:LanguageListView.descriptionKg"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Language_column_descriptionKg"> {param.row.descriptionKg} </div>),
      renderHeader: (param) => (<div data-testid="table_Language_header_descriptionKg">{param.colDef.headerName}</div>)
    },
    {
      field: 'textColor',
      headerName: translate("label:LanguageListView.textColor"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Language_column_textColor"> {param.row.textColor} </div>),
      renderHeader: (param) => (<div data-testid="table_Language_header_textColor">{param.colDef.headerName}</div>)
    },
    {
      field: 'backgroundColor',
      headerName: translate("label:LanguageListView.backgroundColor"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Language_column_backgroundColor"> {param.row.backgroundColor} </div>),
      renderHeader: (param) => (<div data-testid="table_Language_header_backgroundColor">{param.colDef.headerName}</div>)
    },
    {
      field: 'description',
      headerName: translate("label:LanguageListView.description"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Language_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_Language_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'code',
      headerName: translate("label:LanguageListView.code"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Language_column_code"> {param.row.code} </div>),
      renderHeader: (param) => (<div data-testid="table_Language_header_code">{param.colDef.headerName}</div>)
    },
    {
      field: 'isdefault',
      headerName: translate("label:LanguageListView.isdefault"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Language_column_isdefault"> {param.row.isdefault} </div>),
      renderHeader: (param) => (<div data-testid="table_Language_header_isdefault">{param.colDef.headerName}</div>)
    },
    {
      field: 'queuenumber',
      headerName: translate("label:LanguageListView.queuenumber"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Language_column_queuenumber"> {param.row.queuenumber} </div>),
      renderHeader: (param) => (<div data-testid="table_Language_header_queuenumber">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:LanguageListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="Language"
      onDeleteClicked={(id) => store.deleteLanguage(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadLanguages,
        clearStore: store.clearStore
      }}
      viewMode="form"
    >
      <LanguagePopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadLanguages();
        }}
      />
    </BaseListView>
  );
})



export default LanguageListView
