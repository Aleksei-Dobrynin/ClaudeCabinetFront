import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import SDocumenttemplatetranslationPopupForm from '../SDocumenttemplatetranslationAddEditView/popupForm';
import store from "./store";


type SDocumenttemplatetranslationListViewProps = {
  mainId: number;

};


const SDocumenttemplatetranslationListView: FC<SDocumenttemplatetranslationListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.setMainId(props.mainId)
  }, [props.mainId]);
  

  const columns: GridColDef[] = [
    
    {
      field: 'template',
      headerName: translate("label:SDocumenttemplatetranslationListView.template"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_SDocumenttemplatetranslation_column_template"> {param.row.template} </div>),
      renderHeader: (param) => (<div data-testid="table_SDocumenttemplatetranslation_header_template">{param.colDef.headerName}</div>)
    },
    {
      field: 'idlanguage',
      headerName: translate("label:SDocumenttemplatetranslationListView.idlanguage"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_SDocumenttemplatetranslation_column_idlanguage"> {param.row.idlanguage} </div>),
      renderHeader: (param) => (<div data-testid="table_SDocumenttemplatetranslation_header_idlanguage">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <BaseListView
      maxWidth={"xl"}
      title={translate("label:SDocumenttemplatetranslationListView.entityTitle")}
      columns={columns}
      data={store.data}
      tableName="SDocumenttemplatetranslation"
      onDeleteClicked={(id) => store.deleteSDocumenttemplatetranslation(id)}
      onEditClicked={(id) => store.onEditClicked(id)}
      store={{
        loadData: store.loadSDocumenttemplatetranslations,
        clearStore: store.clearStore
      }}
      viewMode="popup"
    >
      <SDocumenttemplatetranslationPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        mainId={props.mainId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel();
          store.loadSDocumenttemplatetranslations();
        }}
      />
    </BaseListView>
  );
})



export default SDocumenttemplatetranslationListView
