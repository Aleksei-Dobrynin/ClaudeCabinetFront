import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  IconButton,
  Tooltip,
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadIcon from '@mui/icons-material/Download';
import BaseListView from 'components/common/BaseListView';
import UploadedApplicationDocumentPopupForm from '../UploadedApplicationDocumentAddEditView/popupForm';
import store from "./store";
import CustomButton from "components/Button";
import FileViewer from "components/FileViewer";
import AttachFromOldDocuments from '../AttachFromOldDocuments';
import AttachFileIcon from '@mui/icons-material/AttachFile';

type UploadedApplicationDocumentListViewProps = {
  mainId: number;
  disabled: boolean;
  isIncoming?: boolean;
};


const UploadedApplicationDocumentListView: FC<UploadedApplicationDocumentListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.setMainId(props.mainId)
  }, [props.mainId]);


  useEffect(() => {
    return () => store.clearStore()
  }, []);


  let columns: GridColDef[] = []
  columns.push(
    // {
    //   field: 'document_number',
    //   headerName: translate("label:uploaded_application_documentListView.document_number"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_uploaded_application_document_column_document_number"> {param.row.document_number} </div>),
    //   renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_document_number">{param.colDef.headerName}</div>)
    // },
    {
      field: 'doc_name',
      headerName: translate("label:uploaded_application_documentListView.doc_name"),
      flex: 2,
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_doc_name">{param.colDef.headerName}</div>)
    });

  if (!props.isIncoming)
    columns.push({
      field: 'is_signed',
      headerName: translate("label:uploaded_application_documentListView.is_signed"),
      flex: 1,
      renderCell: (param) => (<div>
        <Checkbox
          color='secondary'
          checked={param.row.is_signed}
          disabled
        />
      </div>),
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_is_signed">{param.colDef.headerName}</div>)
    });
  if (!props.isIncoming)
    columns.push({
      field: 'is_required',
      headerName: translate("label:uploaded_application_documentListView.is_required"),
      flex: 1,
      renderCell: (param) => (<div>
        {param.row.is_required && <Chip
          label={translate("label:uploaded_application_documentListView.required")}
          size="small"
          color={"error"}
        />}

        {/* <Checkbox
          color='secondary'
          checked={param.row.is_required}
        /> */}
      </div>),
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_is_required">{param.colDef.headerName}</div>)
    });
  if (!props.isIncoming)
    columns.push({
      field: 'file_id',
      headerName: translate("label:uploaded_application_documentListView.status"),
      flex: 1,
      renderCell: (param) => {

        return <div data-testid="table_uploaded_application_document_column_file_name">
          <Tooltip title={param.row.app_doc_id ? translate("label:uploaded_application_documentListView.replace") : translate("label:uploaded_application_documentListView.upload")}>
            <IconButton size='small' disabled={props.disabled} onClick={() => store.uploadFile(param.row.id, param.row.app_doc_id)}>
              <FileUploadIcon />
            </IconButton>
          </Tooltip>
          <Chip
            label={param.row.app_doc_id ? translate("label:uploaded_application_documentListView.uploaded") : translate("label:uploaded_application_documentListView.not_uploaded")}
            size="small"
            color={param.row.app_doc_id ? 'success' : "error"}
          />
        </div>
      },
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_file_name">{param.colDef.headerName}</div>)
    });
  // {
  //   field: 'upload_id',
  //   headerName: translate("label:uploaded_application_documentListView.accept"),
  //   flex: 1,
  //   renderCell: (param) => {
  //     return <div data-testid="table_uploaded_application_document_column_upload_id">
  //       <Checkbox checked={param.row.upload_id} disabled={param.row.file_id} onChange={(e) => {
  //         if (e.target.checked) {
  //           store.acceptDocumentWithoutFile(param.row.id)
  //         } else if (param.row.upload_id) {
  //           store.rejectDocument(param.row.upload_id)
  //         }
  //       }} />
  //     </div>
  //   },
  //   renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_upload_id">{param.colDef.headerName}</div>)
  // },
  columns.push({
    field: 'file_name',
    headerName: translate("label:uploaded_application_documentListView.file_name"),
    flex: 2,
    renderCell: (param) => (<div data-testid="table_uploaded_application_document_column_file_name">
      {param.row.file_name}
      {param.row.file_id && <Tooltip title={translate("download")}>
        <IconButton size='small' onClick={() => store.downloadFile(param.row.file_id, param.row.file_name, props.isIncoming)}>
          <DownloadIcon />
        </IconButton>
      </Tooltip>}
      {(param.row.file_id && store.checkFile(param.row.file_name)) && <Tooltip title={translate("view")}>
        <IconButton size='small' onClick={() => store.OpenFileFile(param.row.file_id, param.row.file_name)}>
          <RemoveRedEyeIcon />
        </IconButton>
      </Tooltip>}
    </div>),
    renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_file_name">{param.colDef.headerName}</div>)
  });
  if (!props.isIncoming)
    columns.push({
      field: 'created_at',
      headerName: translate("label:uploaded_application_documentListView.created_at"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format('DD.MM.YYYY HH:mm') : ""}
        </span>
      ),
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_created_at">{param.colDef.headerName}</div>)
    },
      {
        field: 'id',
        headerName: translate("label:uploaded_application_documentListView.lastUploads"),
        flex: 1,
        renderCell: (param) => {
          return <div data-testid="table_uploaded_application_document_column_file_name">
            <Tooltip title={translate("label:uploaded_application_documentListView.lastUploads")}>
              <IconButton size='small' onClick={() => store.attachClicked(param.row.app_doc_id, param.row.service_document_id)}>
                <AttachFileIcon />
              </IconButton>
            </Tooltip>
          </div>
        },
        renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_file_name">{param.colDef.headerName}</div>)
      },
    );
  // if(props.fromTasks){
  //   columns = [
  //     {
  //       field: 'doc_name',
  //       headerName: translate("label:uploaded_application_documentListView.doc_name"),
  //       flex: 2,
  //       renderCell: (param) => (<div data-testid="table_uploaded_application_document_column_doc_name"> {param.row.doc_name} </div>),
  //       renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_doc_name">{param.colDef.headerName}</div>)
  //     },
  //     {
  //       field: 'file_id',
  //       headerName: translate("label:uploaded_application_documentListView.status"),
  //       flex: 1,
  //       renderCell: (param) => {

  //         return <div data-testid="table_uploaded_application_document_column_file_name">
  //           <Tooltip title={param.row.upload_id ? translate("label:uploaded_application_documentListView.replace") : translate("label:uploaded_application_documentListView.upload")}>
  //             <IconButton size='small' onClick={() => store.uploadFile(param.row.id, param.row.upload_id)}>
  //               <FileUploadIcon />
  //             </IconButton>
  //           </Tooltip>
  //           <Chip
  //             label={param.row.upload_id ? (param.row.file_id ? translate("label:uploaded_application_documentListView.uploaded") : translate("label:uploaded_application_documentListView.accepted")) : translate("label:uploaded_application_documentListView.not_uploaded")}
  //             size="small"
  //             color={param.row.upload_id ? (param.row.file_id ? 'success' : "info") : "error"}
  //           />
  //         </div>
  //       },
  //       renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_file_name">{param.colDef.headerName}</div>)
  //     },
  //     {
  //       field: 'file_name',
  //       headerName: translate("label:uploaded_application_documentListView.file_name"),
  //       flex: 1,
  //       renderCell: (param) => (<div data-testid="table_uploaded_application_document_column_file_name">
  //         {param.row.file_name}
  //         {param.row.file_id && <Tooltip title={translate("download")}>
  //           <IconButton size='small' onClick={() => store.downloadFile(param.row.file_id, param.row.file_name)}>
  //             <DownloadIcon />
  //           </IconButton>
  //         </Tooltip>}
  //       </div>),
  //       renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_file_name">{param.colDef.headerName}</div>)
  //     },
  //     {
  //       field: 'created_at',
  //       headerName: translate("label:uploaded_application_documentListView.created_at"),
  //       flex: 1,
  //       renderCell: (params) => (
  //         <span>
  //           {params.value ? dayjs(params.value).format('DD.MM.YYYY HH:mm') : ""}
  //         </span>
  //       ),
  //       renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_created_at">{param.colDef.headerName}</div>)
  //     },
  //   ]
  // }

  return (
    <>
      <Container maxWidth={"xl"}>
        <h2>{translate("label:uploaded_application_documentListView.important_message")}</h2>
      </Container>

      {!props.isIncoming &&
        <Container maxWidth={"xl"}>
          <CustomButton
            color={"primary"}
            variant="contained"
            name="signUploadedDocs"
            id={"signUploadedDocs"}
            disabled={store.selectedRows.length === 0 || props.disabled}
            onClick={() => {
              store.signSelectedDocuments();
            }}
          >
            {translate("label:uploaded_application_documentListView.sign_selected_documents")}
          </CustomButton>
        </Container>
      }

      <BaseListView
        maxWidth={"xl"}
        marginTop={15}
        title={props.isIncoming ? translate("label:uploaded_application_documentListView.incoming_documents") : translate("label:UploadedApplicationDocumentListView.entityTitle")}
        columns={columns}
        data={store.data.filter(x => props.isIncoming ? x.is_outcome === true : x.is_outcome !== true)}
        tableName="UploadedApplicationDocument"
        hideActions={true}
        onDeleteClicked={(id) => store.deleteUploadedApplicationDocument(id)}
        onEditClicked={(id) => store.onEditClicked(id)}
        store={{
          loadData: store.loadUploadedApplicationDocuments,
          clearStore: store.clearStore
        }}
        viewMode="popup"
        checkboxSelection={!props.isIncoming}
        hideAddButton={true}
        onRowSelectionModelChange={(rows, detials) => {
          console.log(rows);
          store.changeSelectedRows(rows);
        }}
        isRowSelectable={(params) => {
          return params.row.file_id != null && !(params.row.is_signed ?? false);
        }}
      >
        <UploadedApplicationDocumentPopupForm
          openPanel={store.openPanel}
          id={store.currentId}
          doc_id={store.service_document_id}
          applicationId={store.mainId}

          onBtnCancelClick={() => store.closePanel()}
          onSaveClick={() => {
            store.closePanel();
            store.loadUploadedApplicationDocuments();
          }}
        />

        <AttachFromOldDocuments
          openPanel={store.openPanelAttachFromOtherDoc}
          onBtnCancelClick={() => store.closePanelAttach()}
          onSaveClick={() => {
            store.closePanelAttach()
            store.loaduploaded_application_documents()
          }}
          idApplicationDocument={store.idDocumentAttach}
          idApplication={store.mainId}
          idServiceDoc={store.service_document_id}
        />

      </BaseListView>

      <FileViewer
        isOpen={store.isOpenFileView}
        onClose={() => { store.isOpenFileView = false }}
        fileUrl={store.fileUrl}
        fileType={store.fileType} />
    </>
  );
})



export default UploadedApplicationDocumentListView