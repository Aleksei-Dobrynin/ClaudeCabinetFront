import React, { FC, useEffect } from "react";
import { Checkbox, Container, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import ApplicationAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";
import PageGrid from 'components/PageGrid';
import { useLocation, useNavigate } from "react-router-dom";
import { GridColDef } from '@mui/x-data-grid';
import dayjs from "dayjs";
import ApplicationInfoCard from "./card";

interface ApplicationProps {
}

const ApplicationPublicView: FC<ApplicationProps> = observer(() => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const guid = query.get("guid");

  useEffect(() => {
    if ((guid != null) && (guid !== "")) {
      store.doLoad(guid);
    } else {
      navigate("/error-404");
    }

    return () => {
      store.clearStore();
    };
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'file_name',
      headerName: translate("label:ApplicationPublic.workDocuments.fileName"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Application_column_file_name"> {param.row.file_name} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_file_name">{param.colDef.headerName}</div>)
    },
    {
      field: 'comment',
      headerName: translate("label:ApplicationPublic.workDocuments.comment"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Application_column_comment"> {param.row.comment} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_comment">{param.colDef.headerName}</div>)
    },
    {
      field: 'created_at',
      headerName: translate("label:ApplicationPublic.workDocuments.uploadedAt"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Application_column_archObjectId"> {param.row.created_at} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_archObjectId">{param.colDef.headerName}</div>)
    },
    {
      field: 'is_signed',
      headerName: translate("label:ApplicationPublic.workDocuments.isSigned"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Application_column_is_signed"> <Checkbox checked={param.row.is_signed} disabled /> </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_is_signed">{param.colDef.headerName}</div>)
    },
    {
      field: 'signed_by',
      headerName: translate("label:ApplicationPublic.workDocuments.signedBy"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Application_column_signed_by"> {param.row.signed_by} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_signed_by">{param.colDef.headerName}</div>)
    },
  ]

  const columnsUploads: GridColDef[] = [
    {
      field: 'appDocName',
      headerName: translate("label:ApplicationPublic.outgoingDocuments.document"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Application_column_appDocName"> {param.row.appDocName} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_appDocName">{param.colDef.headerName}</div>)
    },
    {
      field: 'createdAt',
      headerName: translate("label:ApplicationPublic.outgoingDocuments.uploadedAt"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Application_column_createdAt"> {param.row.createdAt ? dayjs(param.row.createdAt)?.format("DD.MM.YYYY HH:mm") : ""} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_createdAt">{param.colDef.headerName}</div>)
    },
    {
      field: 'is_signed',
      headerName: translate("label:ApplicationPublic.outgoingDocuments.isSigned"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Application_column_is_signed"> <Checkbox checked={param.row.is_signed} disabled /> </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_is_signed">{param.colDef.headerName}</div>)
    },
    {
      field: 'signed_by',
      headerName: translate("label:ApplicationPublic.outgoingDocuments.signedBy"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Application_column_signed_by"> {param.row.signed_by} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_signed_by">{param.colDef.headerName}</div>)
    },
  ]

  return (
    <>
      <Container sx={{ mt: 5 }}>
        <ApplicationInfoCard />

        <PageGrid
          title={translate("label:ApplicationPublic.workDocuments.title")}
          columns={columns}
          hideActions
          data={store.workDocuments}
          hideAddButton
          tableName="WorkDocuments"
        />

        <PageGrid
          title={translate("label:ApplicationPublic.outgoingDocuments.title")}
          columns={columnsUploads}
          hideActions
          data={store.uploadDocuments}
          hideAddButton
          tableName="UploadDocuments"
        />
      </Container>
    </>
  );
})

export default ApplicationPublicView;