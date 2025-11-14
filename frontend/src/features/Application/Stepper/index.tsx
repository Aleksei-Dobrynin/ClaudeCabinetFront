import React, { FC, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip, IconButton
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import ApplicationAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";
import CustomButton from "components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import CustomerAddEditView from "features/Customer/CustomerAddEditView";
import RepresentativeListView from "features/Representative/RepresentativeListView";
import PayerListView from "features/Payer/PayerListView";
import UploadedApplicationDocumentListView from "features/UploadedApplicationDocument/UploadedApplicationDocumentListView";
import ApplicationPaidInvoiceListView from "features/ApplicationPaidInvoice/ApplicationPaidInvoiceListView";
import styled from "styled-components";
import TemplatePrint from "./dogovor";
import { APPLICATION_CABINET_STATUSES } from "constants/constant";
import MainStore from "MainStore";
import Ckeditor from "components/ckeditor/ckeditor";
import printJS from "print-js";
import QrCodePanel from "./QrCodePanel";
import ConfirmationDialog from "components/NotSavedDialog";
import documentStore from 'features/UploadedApplicationDocument/UploadedApplicationDocumentListView/store'
import ApplicationPayerListView from 'features/ApplicationPayer/ApplicationPayerListView';
import DownloadIcon from "@mui/icons-material/Download";

interface ApplicationProps {
  id: string | null;
}

const StepperView: FC<ApplicationProps> = observer((props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get("id");
  const tab = query.get("tab");
  // Remove "Оплаты" from initial state - only show for accepted status
  const [steps, setSteps] = useState(["Общие сведения", "Заявитель", "Представитель", "Плательщик", "Документы", "Заявление"]);

  // Add these state variables for handling dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetStep, setTargetStep] = useState(-1);

  // Синхронизируем URL с состоянием хранилища при изменении параметров
  useEffect(() => {
    if ((id != null) && (id !== "") && !isNaN(Number(id.toString()))) {
      store.doLoad(Number(id));
      if (tab && !isNaN(Number(tab.toString()))) {
        store.setActiveStep(Number(tab));
      }
    } else {
      navigate("/error-404");
    }
    return () => {
      store.clearStore();
    };
  }, [id, tab]);

  useEffect(() => {
    if (store.statusCode.length > 0 && [APPLICATION_CABINET_STATUSES.return_with_error].includes(store.statusCode) &&
      !steps.includes("Замечания")) {
      setSteps(prevSteps => ["Замечания", ...prevSteps]);
    }
    if (APPLICATION_CABINET_STATUSES.accepted === store.statusCode || APPLICATION_CABINET_STATUSES.documents_ready === store.statusCode) {
      // Keep "Оплаты" as the last tab for accepted status
      setSteps(["Общие сведения", "Заказчик", "Представитель", "Плательщик", "Документы", "Входящие документы", "Поступившие платежи"])
    }
  }, [store.statusCode]);

  const navigateToStep = (stepIndex: number, skip?: boolean) => {
    // Only allow navigation if application exists (id > 0)
    if (store.id <= 0) {
      return;
    }

    // If there are unsaved changes, show confirmation dialog
    if (!skip && store.changed && stepIndex !== store.activeStep) {
      setTargetStep(stepIndex);
      setDialogOpen(true);
    } else {
      // No unsaved changes, navigate directly
      store.setActiveStep(stepIndex, true); // Reset changed flag when navigating via click
      navigate(`/user/stepper?id=${store.id}&tab=${stepIndex}`);
    }
  };

  const handleConfirmNavigation = () => {
    setDialogOpen(false);
    navigateToStep(targetStep, true);
  };

  const handleCancelNavigation = () => {
    setDialogOpen(false);
    setTargetStep(-1);
  };

  const handleNextClick = () => {
    if (store.activeStep === (steps[0] === "Замечания" ? 1 : 0)) {
      store.onSaveClick(navigate);
    } else if (store.activeStep === 4 && steps[0] !== "Замечания") {
      if (documentStore.isDocumentsUploaded()) {
        const nextStep = store.activeStep + 1;
        store.setActiveStep(nextStep);
        navigate(`/user/stepper?id=${store.id}&tab=${nextStep}`);
      } else {
        MainStore.openErrorDialog("Выберите и подпишите обязательные документы!")
      }
    } else {
      const nextStep = store.activeStep + 1;
      store.setActiveStep(nextStep);
      navigate(`/user/stepper?id=${store.id}&tab=${nextStep}`);
    }
  };

  const handlePrevClick = () => {
    const prevStep = store.activeStep - 1;
    store.setActiveStep(prevStep);
    navigate(`/user/stepper?id=${store.id}&tab=${prevStep}`);
  };

  return (
    <>
      <Container maxWidth={"xl"}>
        <Box display={"flex"} justifyContent={"space-between"}>
          <CustomButton onClick={() => navigate("/user/ApplicationAll")}>
            Назад
          </CustomButton>

          {store.id > 0 ? <CustomButton onClick={() => store.setQrCodePanel(true)}>
            Показать QR-код
          </CustomButton> : ""}
        </Box>

        <QrCodePanel guid={store.appCabinetUuid} openPanel={store.openPanelQrCode} onBtnCancelClick={() => store.setQrCodePanel(false)} />

        {/* Add the confirmation dialog */}
        <ConfirmationDialog
          open={dialogOpen}
          title="Подтверждение перехода"
          message="У вас есть несохраненные изменения. При переходе на другой шаг они будут потеряны. Хотите продолжить?"
          onConfirm={handleConfirmNavigation}
          onCancel={handleCancelNavigation}
        />

        {store.activeStep === 10 ? <>
          <ResultMessage>
            Ваша заявка отправлена на рассмотрение
            <CustomButton
              variant="contained"
              onClick={() => navigate("/user")}
              sx={{
                mt: 4,
                backgroundColor: "#5e35b1",
                "&:hover": {
                  backgroundColor: "#4527a0"
                },
                fontSize: "16px",
                padding: "10px 24px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
              }}
            >
              На главную
            </CustomButton>
          </ResultMessage>
        </> : <Paper elevation={7} variant="outlined">
          <Card>
            <CardContent>
              <Stepper activeStep={store.activeStep} alternativeLabel sx={{ mb: 6 }}>
                {steps.map((label, index) => {
                  const stepProps: { completed?: boolean } = {};
                  const labelProps: {
                    optional?: React.ReactNode;
                  } = {};

                  return (
                    <Step
                      key={label}
                      {...stepProps}
                      onClick={() => navigateToStep(index, false)}
                      sx={{
                        cursor: store.id > 0 ? 'pointer' : 'default',
                        '&:hover': {
                          '& .MuiStepLabel-label': {
                            color: store.id > 0 ? 'primary.main' : 'inherit',
                          }
                        }
                      }}
                    >
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>

              {store.activeStep === 0 && steps[0] === "Замечания" && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6">Замечания</Typography>
                  <Ckeditor
                    value={store.rejectHtml ?? ""}
                    disabled={true}
                    withoutPlaceholder
                    onChange={(event) => {
                      store.handleChange(event);
                    }}
                    name={`description_kg`}
                    id={`id_f_release_description_kg`}
                  />
                  <Box sx={{ display: 'flex' }}>
                  <Box sx={{ mt: 2 }}>
                    <CustomButton variant="contained" onClick={() => {
                      printJS({
                        printable: store.rejectHtml ?? "<h1></h1>",
                        type: "raw-html",
                        targetStyles: ["*"]
                      });
                    }}>
                      Печать
                    </CustomButton>
                  </Box>
                  {store.rejectFileId > 0 && <Box sx={{ mt: 2, ml: 2 }}>
                    <CustomButton variant="contained" onClick={() => store.downloadFile(store.rejectFileId, "")}>
                      Скачать
                    </CustomButton>
                  </Box>}
                </Box>
                </Box>
              )}

              {store.activeStep === (steps[0] === "Замечания" ? 1 : 0) && (
                <ApplicationAddEditBaseView />
              )}

              {store.activeStep === (steps[0] === "Замечания" ? 2 : 1) && (
                <CustomerAddEditView
                  id={store.companyId}
                  applicationId={store.id}
                  statusCode={store.statusCode}
                  onNextClick={(id: number) => {
                    if (store.companyId !== id) {
                      store.saveCustomerId(id, navigate);
                    } else {
                      const nextStep = store.activeStep + 1;
                      store.setActiveStep(nextStep);
                      navigate(`/user/stepper?id=${store.id}&tab=${nextStep}`);
                    }
                  }}
                  onPrevClick={() => {
                    const prevStep = store.activeStep - 1;
                    store.setActiveStep(prevStep);
                    navigate(`/user/stepper?id=${store.id}&tab=${prevStep}`);
                  }}
                />
              )}

              {store.activeStep === (steps[0] === "Замечания" ? 3 : 2) && (
                <Box sx={{ mt: 4 }}>
                  <RepresentativeListView
                    disabled={store.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || store.statusCode === APPLICATION_CABINET_STATUSES.accepted}
                    mainId={store.companyId} />
                </Box>
              )}
              {store.activeStep === (steps[0] === "Замечания" ? 4 : 3) && (
                <Box sx={{ mt: 4 }}>
                  <ApplicationPayerListView
                    disabled={store.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || store.statusCode === APPLICATION_CABINET_STATUSES.accepted}
                    applicationId={store.id} customerId={store.companyId}
                  />
                </Box>
              )}
              {store.activeStep === (steps[0] === "Замечания" ? 5 : 4) && (
                <Box sx={{ mt: 4 }}>
                  <UploadedApplicationDocumentListView
                    isIncoming={false}
                    disabled={store.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || store.statusCode === APPLICATION_CABINET_STATUSES.accepted}
                    mainId={store.id} />
                </Box>
              )}

              {/* Template for non-accepted status */}
              {(store.statusCode !== APPLICATION_CABINET_STATUSES.accepted && store.statusCode !== APPLICATION_CABINET_STATUSES.documents_ready && store.activeStep === (steps[0] === "Замечания" ? 6 : 5)) && (
                <Box sx={{ mt: 4 }}>
                  <TemplatePrint disabled={store.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || store.statusCode === APPLICATION_CABINET_STATUSES.accepted} />
                </Box>
              )}

              {/* Incoming documents for accepted status */}
              {((store.statusCode === APPLICATION_CABINET_STATUSES.accepted || store.statusCode === APPLICATION_CABINET_STATUSES.documents_ready) && store.activeStep === (steps[0] === "Замечания" ? 6 : 5)) && (
                <Box sx={{ mt: 4 }}>
                  <UploadedApplicationDocumentListView
                    isIncoming={true}
                    disabled={store.statusCode === APPLICATION_CABINET_STATUSES.under_consideration || store.statusCode === APPLICATION_CABINET_STATUSES.accepted}
                    mainId={store.id} />
                </Box>
              )}

              {/* New step for ApplicationPaidInvoiceListView - only for accepted status */}
              {(store.statusCode === APPLICATION_CABINET_STATUSES.done || store.statusCode === APPLICATION_CABINET_STATUSES.documents_ready) && store.activeStep === (steps[0] === "Замечания" ? 7 : 6) && (
                <Box sx={{ mt: 4 }}>
                  <ApplicationPaidInvoiceListView
                    applicationId={store.id} />
                </Box>
              )}

              {store.activeStep !== (steps[0] === "Замечания" ? 2 : 1) &&
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  {store.activeStep !== 0 && <CustomButton
                    onClick={handlePrevClick}
                    sx={{ mr: 1 }}
                    variant="contained"
                  >
                    Назад
                  </CustomButton>}
                  <Box sx={{ flex: "1 1 auto" }} />

                  {(store.statusCode !== APPLICATION_CABINET_STATUSES.draft && store.statusCode !== APPLICATION_CABINET_STATUSES.rejected) ? <>
                    {store.activeStep !== steps.length - 1 &&
                      <CustomButton
                        variant="contained"
                        onClick={handleNextClick}
                        sx={{ mr: 1 }}>
                        Далее
                      </CustomButton>
                    }
                    {store.activeStep === steps.length - 1 &&
                      <CustomButton
                        variant="contained"
                        onClick={() => navigate(`/user/ApplicationAll`)}
                        sx={{ mr: 1 }}>
                        На главную
                      </CustomButton>
                    }
                  </> :
                    <>
                      {(store.activeStep === steps.length - 1) ? <CustomButton
                        variant="contained"
                        onClick={() => {
                          MainStore.openDigitalSign(
                            [],
                            store.id,
                            async () => {
                              MainStore.onCloseDigitalSign();
                              store.sendToBga(navigate)
                            },
                            () => MainStore.onCloseDigitalSign(),
                          );
                        }}
                        sx={{ mr: 1 }}>
                        Генерировать заявление и подписать
                      </CustomButton> : <CustomButton
                        variant="contained"
                        onClick={handleNextClick}
                        sx={{ mr: 1 }}>
                        Далее
                      </CustomButton>}
                    </>
                  }
                </Box>}
            </CardContent>
          </Card>
        </Paper>}
      </Container>
    </>
  );
});


// Updated ResultMessage component with improved design
const ResultMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 400px;
    width: 100%;
    border-radius: 16px;
    margin-top: 50px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    color: rgb(57, 177, 53);
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;

    /* Add a subtle hover effect */

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    }

    /* Create a container for the text with an icon */

    &::before {
        content: "✓";
        display: flex;
        justify-content: center;
        align-items: center;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-color: rgb(57, 177, 53);
        color: white;
        font-size: 40px;
        margin-bottom: 1.5rem;
    }

    /* Style for the main text */
    font-family: 'Roboto', sans-serif;
    font-size: 32px;
    font-weight: 600;
    letter-spacing: 0.5px;
    line-height: 1.4;
`;

export default StepperView;