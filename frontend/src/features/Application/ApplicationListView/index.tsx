import React, { FC, useEffect, useMemo } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import BaseListView from 'components/common/BaseListView';
import ApplicationPopupForm from '../ApplicationAddEditView/popupForm';
import store from "./store";
import { useNavigate } from 'react-router-dom';
import { Box, Chip, Grid, IconButton, InputAdornment, Paper } from '@mui/material';
import LookUp from 'components/LookUp';
import CustomTextField from 'components/TextField';
import ClearIcon from "@mui/icons-material/Clear";
import CustomButton from 'components/Button';
import MainStore from 'MainStore';


type ApplicationListViewProps = {
  filter: "all" | "need_action" | "accepted" | "done" | "draft" | "on_work";
};


const ApplicationListView: FC<ApplicationListViewProps> = observer((props) => {
  const { t, i18n } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const currentLanguage = i18n.language;

  // Функция для получения названия статуса в зависимости от языка
  const getStatusName = (row: any) => {
    if (currentLanguage === 'ky-KG' && row.statusName_kg) {
      return row.statusName_kg;
    }
    return row.statusName;
  };

  // Функция для получения названия услуги в зависимости от языка
  const getServiceName = (row: any) => {
    if (currentLanguage === 'ky-KG' && row.rServiceName_kg) {
      return row.rServiceName_kg;
    }
    return row.rServiceName;
  };

  useEffect(() => {
    store.setFilter(props.filter)
    store.doLoad()
    // Запускаем авто-обновление только если пользователь авторизован
    if (MainStore.currentUser) {
      store.startAutoRefresh();
    }

    // ВАЖНО: Очистка при размонтировании компонента
    return () => {
      store.stopAutoRefresh();
    };
  }, [])

  useEffect(() => {
    if (store.filter !== props.filter) {
      store.setFilter(props.filter)
      store.loadApplications()
    }
  }, [props.filter])

  // Используем useMemo для оптимизации пересчета колонок
  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'number',
      headerName: translate("label:ApplicationListView.number"),
      flex: 0.5,
      renderCell: (param) => (<div data-testid="table_Application_column_number"> {param.row.number} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_number">{param.colDef.headerName}</div>)
    },
    {
      field: 'workDescription',
      headerName: translate("label:ApplicationListView.objectName"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Application_column_workDescription"> {param.row.workDescription} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_workDescription">{param.colDef.headerName}</div>)
    },
    {
      field: 'address',
      headerName: translate("label:ApplicationListView.address"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Application_column_archObjectId"> {param.row.address} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_archObjectId">{param.colDef.headerName}</div>)
    },
      ...(currentLanguage === 'ky-KG' ? [{
        field: 'statusName_kg',
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
      }] : [{
        field: 'statusName',
        headerName: translate("label:ApplicationListView.statusId"),
        flex: 1,
        renderCell: (params) => (
          <Chip
            variant="outlined"
          label={getStatusName(params.row)}
            style={{ backgroundColor: params.row.statusBackColor }}
          />
        ),
        renderHeader: (param) => (<div data-testid="table_Application_header_statusId">{param.colDef.headerName}</div>)
      }]),
    // {
    //   field: 'companyId',
    //   headerName: translate("label:ApplicationListView.companyId"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_Application_column_companyId"> {param.row.companyId} </div>),
    //   renderHeader: (param) => (<div data-testid="table_Application_header_companyId">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'rServiceId',
    //   headerName: translate("label:ApplicationListView.rServiceId"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_Application_column_rServiceId"> {param.row.rServiceId} </div>),
    //   renderHeader: (param) => (<div data-testid="table_Application_header_rServiceId">{param.colDef.headerName}</div>)
    // },
    {
      field: 'rServiceName',
      headerName: translate("label:ApplicationListView.rServiceName"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_Application_column_rServiceName"> {getServiceName(param.row)} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_rServiceName">{param.colDef.headerName}</div>)
    },
    // {
    //   field: 'uniqueCode',
    //   headerName: translate("label:ApplicationListView.uniqueCode"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_Application_column_uniqueCode"> {param.row.uniqueCode} </div>),
    //   renderHeader: (param) => (<div data-testid="table_Application_header_uniqueCode">{param.colDef.headerName}</div>)
    // },
    {
      field: 'registrationDate',
      headerName: translate("label:ApplicationListView.sendDate"),
      flex: 0.5,
      renderCell: (param) => (<div data-testid="table_Application_column_registrationDate"> {param.row.registrationDate ? dayjs(param.row.registrationDate)?.format("DD.MM.YYYY HH:mm") : ""} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_registrationDate">{param.colDef.headerName}</div>)
    },
    // {
    //   field: 'deadline',
    //   headerName: translate("label:ApplicationListView.deadline"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_Application_column_deadline"> {param.row.deadline ? dayjs(param.row.deadline)?.format("DD.MM.YYYY HH:mm") : ""} </div>),
    //   renderHeader: (param) => (<div data-testid="table_Application_header_deadline">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'comment',
    //   headerName: translate("label:ApplicationListView.comment"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_Application_column_comment"> {param.row.comment} </div>),
    //   renderHeader: (param) => (<div data-testid="table_Application_header_comment">{param.colDef.headerName}</div>)
    // },
    {
      field: 'totalSum',
      headerName: translate("label:ApplicationListView.Costing"),
      flex: 0.5,
      renderCell: (param) => (<div data-testid="table_Application_column_totalSum"> {param.row.totalSum} </div>),
      renderHeader: (param) => (<div data-testid="table_Application_header_totalSum">{param.colDef.headerName}</div>)
    },
  ], [currentLanguage, translate]);

  return (
    <Box>

      <BaseListView
        maxWidth={"xl"}
        topComponent={<>
          <Paper elevation={5} style={{ width: '100%', padding: 20, marginBottom: 30 }}>
            <Grid container spacing={3}>

              <Grid item md={4} xs={12}>
                <CustomTextField
                  value={store.search}
                  onChange={(e) => store.changeNumber(e.target.value)}
                  name={"number"}
                  label={translate("common:search")}
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
              {/* <Grid item md={4} xs={12}>
                <LookUp
                  value={store.statusId}
                  onChange={(event) => store.changeStatus(event.target.value)}
                  name="statusId"
                  data={store.statuses}
                  skipEmpty
                  id="statusId"
                  label={translate("label:ApplicationListView.statusId")}
                  helperText={""}
                  error={false}
                />
              </Grid> */}
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
        hideActions={MainStore.isCommonCabinet}
        data={store.data}
        hideAddButton={props.filter != 'all' || MainStore.isCommonCabinet}
        tableName="Application"
        onAddEditClick={(id) => {
          if (id !== 0) {
            const app = store.data.find(x => x.id === id)
            if (app.statusCode !== "draft") {
              navigate(`/user/ApplicationEdit?id=${id}`)
              return;
            }
          }
          navigate(`/user/Stepper?id=${id}`)
        }}
        onDeleteClicked={(id) => store.deleteApplication(id)}
        hideDeleteButton
        onEditClicked={(id) => store.onEditClicked(id)}
        store={{
          loadData: () => { },
          clearStore: store.clearStore
        }}
        viewMode="form"
      >
        <ApplicationPopupForm
          openPanel={store.openPanel}
          id={store.currentId}
          onBtnCancelClick={() => store.closePanel()}
          onSaveClick={() => {
            store.closePanel();
            store.loadApplications();
          }}
        />
      </BaseListView>
    </Box>
  );
})



export default ApplicationListView