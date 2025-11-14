import { FC, useEffect } from 'react';
import {
  Box,
  Chip,
  Container,
  IconButton,
  Tooltip,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import styled from 'styled-components';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import dayjs from 'dayjs';
import CustomButton from 'components/Button';

type AttachFromOldDocumentsProps = {
  idApplicationDocument: number;
  idApplication: number;
  idServiceDoc: number;
  openPanel: boolean;
  onBtnCancelClick: () => void;
  onSaveClick: (id: number) => void;
};


const AttachFromOldDocuments: FC<AttachFromOldDocumentsProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    if (props.openPanel) {
      store.loaduploaded_application_documents( props.idServiceDoc)
    }
    else {
      store.clearStore()
    }

    return () => store.clearStore()
  }, [props.openPanel])


  const columns: GridColDef[] = [

    {
      field: 'number',
      headerName: translate("label:uploaded_application_documentListView.number"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_uploaded_application_document_column_number"> {param.row.number} </div>),
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_number">{param.colDef.headerName}</div>)
    },
    {
      field: 'service_name',
      headerName: translate("label:uploaded_application_documentListView.service_name"),
      flex: 3,
      renderCell: (param) => (<div data-testid="table_uploaded_application_document_column_service_name"> {param.row.service_name} </div>),
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_service_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'file_name',
      headerName: translate("label:uploaded_application_documentListView.file_name"),
      flex: 2,
      renderCell: (param) => (<div data-testid="table_uploaded_application_document_column_file_name">
        {param.row.file_name}
        {param.row.file_id && <Tooltip title={translate("label:fileDownload.downloadTooltip")}>
          <IconButton size='small' onClick={() => store.downloadFile(param.row.file_id, param.row.file_name)}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>}
      </div>),
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_file_name">{param.colDef.headerName}</div>)
    },
    {
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
      field: 'file_id',
      headerName: translate("label:uploaded_application_documentListView.chooseDocument"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_uploaded_application_document_column_file_id">
        <CustomButton size='small' variant='contained' onClick={() => store.onPickedFile(param.row.file_id, props.idApplication, param.row.service_document_id, props.onSaveClick)}>
          {translate("common:Choose")}
        </CustomButton>
      </div>),
      renderHeader: (param) => (<div data-testid="table_uploaded_application_document_header_file_name">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Dialog open={props.openPanel} onClose={props.onBtnCancelClick} maxWidth="lg" fullWidth>
        <DialogContent>
          <PageGrid
            title={translate("label:uploaded_application_documentListView.oldAttacheds")}
            columns={columns}
            hideActions
            hideAddButton
            data={store.data}
            tableName="uploaded_application_document" />
        </DialogContent>
        <DialogActions>
          <DialogActions>
            <CustomButton
              variant="contained"
              id="id_uploaded_application_documentCancelButton"
              name={'uploaded_application_documentAddEditView.cancel'}
              onClick={() => props.onBtnCancelClick()}
            >
              {translate("common:close")}
            </CustomButton>
          </DialogActions>
        </DialogActions >
      </Dialog >

    </Box>
  );
})



export default AttachFromOldDocuments