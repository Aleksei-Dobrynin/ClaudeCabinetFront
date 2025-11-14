import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import store from "./store";
import { useNavigate } from 'react-router-dom';
import { Box, Chip, Grid, IconButton, InputAdornment, Paper } from '@mui/material';
import LookUp from 'components/LookUp';
import CustomTextField from 'components/TextField';
import ClearIcon from "@mui/icons-material/Clear";
import CustomButton from 'components/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ApplicationListView: FC = observer(() => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();

  useEffect(() => {
    store.doLoad()
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'number',
      headerName: translate("label:ApplicationListView.number"),
      flex: 0.5,
      renderCell: (param) => (<div data-testid="table_Application_column_number"> {param.row.number} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_number">{param.colDef.headerName}</div>)
    },
    {
      field: 'workDescription',
      headerName: translate("Название объекта"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Application_column_workDescription"> {param.row.workDescription} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_workDescription">{param.colDef.headerName}</div>)
    },
    {
      field: 'address',
      headerName: translate("Адрес"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Application_column_archObjectId"> {param.row.address} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_archObjectId">{param.colDef.headerName}</div>)
    },
    {
      field: 'statusName',
      headerName: translate("label:ApplicationListView.statusId"),
      flex: 1,
      renderCell: (params) => (
        <Chip
          variant="outlined"
          label={params.value}
          style={{ backgroundColor: params.row.statusBackColor }}
        />
      ),
      renderHeader: (param) => (<div data-testid="table_Application_header_statusId">{param.colDef.headerName}</div>)
    },
    {
      field: 'rServiceName',
      headerName: translate("label:ApplicationListView.rServiceName"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Application_column_rServiceName"> {param.row.rServiceName} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_rServiceName">{param.colDef.headerName}</div>)
    },
    {
      field: 'registrationDate',
      headerName: translate("Время отправки"),
      flex: 0.5,
      renderCell: (param) => (<div data-testid="table_Application_column_registrationDate"> {param.row.registrationDate ? dayjs(param.row.registrationDate)?.format("DD.MM.YYYY HH:mm") : ""} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_registrationDate">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <Box>

      <BaseListView
        editIcon={<VisibilityIcon />}
        editLabel={'view'}
        maxWidth={"xl"}
        topComponent={<>
          <Paper elevation={5} style={{ width: '100%', padding: 20, marginBottom: 30 }}>
            <Grid container spacing={3}>

              <Grid item md={4} xs={12}>
                <CustomTextField
                  value={store.search}
                  onChange={(e) => store.changeNumber(e.target.value)}
                  name={"number"}
                  label={translate("Поиск")}
                  onKeyDown={(e) => e.keyCode === 13 && store.loadApplications()}
                  id={"pin"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          id="number_Search_Btn"
                          onClick={() => store.changeNumber("")}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item md={12} xs={12}>

                <Box sx={{ minWidth: 80 }} display={"flex"} justifyContent={"flex-end"}>
                  {(store.search !== ""
                    || store.statusId !== 0
                  ) && <Box sx={{ mr: 2 }}>
                      <CustomButton
                        id="clearSearchFilterButton"
                        onClick={() => {
                          store.clearFilter();
                          store.loadApplications();
                        }}
                      >
                        {translate("clear")}
                      </CustomButton>
                    </Box>}
                  <CustomButton
                    variant="contained"
                    id="searchFilterButton"
                    onClick={() => {
                      store.loadApplications();
                    }}
                  >
                    {translate("search")}
                  </CustomButton>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </>}
        title={translate("label:ApplicationListView.entityTitle")}
        columns={columns}
        data={store.data}
        hideAddButton={true}
        tableName="Application"
        onAddEditClick={(id) => navigate(`/user/HistoryTableApplication?id=${id}`)}
        onDeleteClicked={(id) => store.deleteApplication(id)}
        hideDeleteButton
        onEditClicked={(id) => store.onEditClicked(id)}
        store={{
          loadData: () => {},
          clearStore: store.clearStore
        }}
        viewMode="form"
      >
      </BaseListView>
    </Box>
  );
})



export default ApplicationListView
