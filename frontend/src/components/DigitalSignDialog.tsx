// DigitalSignDialog.tsx - исправленная версия с локализацией
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Dialog from "@mui/material/Dialog";
import MuiDialogContent from "@mui/material/DialogContent";
import CustomTextField from "components/TextField";
import MaskedTextField from "components/MaskedTextField";
import MainStore from "./../MainStore";
import CustomButton from "./Button";
import { useTranslation } from "react-i18next";
import { signFiles, sendCode } from "api/FileSign";

const DigitalSignDialog = observer(() => {
  const { t } = useTranslation();
  
  // Локальные состояния для управления формой
  const [pin, setPin] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [isSend, setIsSend] = useState(false);

  // Эффект для синхронизации PIN с MainStore при открытии диалога
  useEffect(() => {
    if (MainStore.digitalSign.open) {
      // При открытии диалога всегда берем актуальное значение из MainStore
      setPin(MainStore.currentUserPin || "");
      // Сбрасываем остальные поля
      setPinCode("");
      setIsSend(false);
    }
  }, [MainStore.digitalSign.open]); // Зависимость только от open, не от curentUserPin

  // Дополнительный эффект для отслеживания изменений curentUserPin в реальном времени
  // Это нужно, если PIN может измениться пока диалог открыт
  useEffect(() => {
    // Обновляем PIN только если диалог открыт и пользователь еще не отправил код
    if (MainStore.digitalSign.open && !isSend) {
      setPin(MainStore.currentUserPin || "");
    }
  }, [MainStore.currentUserPin, MainStore.digitalSign.open, isSend]);

  // Обработчик изменения PIN пользователем
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPin(e.target.value);
  };

  // Обработчик отправки кода
  const handleSendCode = async () => {
    setIsSend(true);

    try {
      MainStore.changeLoader(true);
      const response = await sendCode(pin);
      
      if ((response.status === 201 || response.status === 200)) {
        MainStore.setSnackbar(t("label:digitalSign.pinCodeSent"), "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(t("label:digitalSign.noDigitalSignature"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  // Обработчик подписания
  const handleSign = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await signFiles(
        MainStore.digitalSign.fileIds, 
        MainStore.digitalSign.applicationId,
        pin,
        pinCode
      );
      
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        MainStore.setSnackbar(t("label:digitalSign.successfullySigned"), "success");
        setIsSend(false);
        MainStore.digitalSign.onCloseYes(pin);
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  // Обработчик закрытия диалога
  const handleClose = () => {
    // Сбрасываем локальные состояния
    setPin("");
    setPinCode("");
    setIsSend(false);
    // Вызываем callback закрытия
    MainStore.digitalSign.onCloseNo();
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      fullWidth={true}
      id={"DigitalSignDialog"}
      maxWidth={"xs"}
      open={MainStore.digitalSign.open}
    >
      <CloseModal onClick={handleClose} />
      <ContentWrapper>
        <Header>
          <MainText>{t("label:digitalSign.enterYourInn")}</MainText>
        </Header>

        <MaskedTextField
          label={t("label:digitalSign.inn")}
          value={pin}
          mask={"00000000000000"}
          onChange={handlePinChange}
          id='id_dialog_sign_pin'
          name='dialog_sign_pin'
          disabled={true}
        />
        
        {isSend && (
          <>
            <div style={{ margin: 15 }}>
              {t("label:digitalSign.pinCodeSentNotification")}
            </div>
            <MaskedTextField
              label={t("label:digitalSign.pinCode")}
              value={pinCode}
              mask={"000000"}
              onChange={(e) => setPinCode(e.target.value)}
              id='id_dialog_sign_pin_code'
              name='dialog_sign_pin_code'
            />
          </>
        )}
        
        <ActionsWrapper>
          {!isSend && (
            <ButtonWrapper>
              <CustomButton
                name="AlertButtonYes"
                color={"primary"}
                variant="contained"
                id={"AlertButtonYes"}
                disabled={pin?.length !== 14}
                onClick={handleSendCode}
              >
                {t("label:digitalSign.sendCode")}
              </CustomButton>
            </ButtonWrapper>
          )}

          {isSend && (
            <ButtonWrapper>
              <CustomButton
                name="AlertButtonYes"
                color={"primary"}
                variant="contained"
                id={"AlertButtonYes"}
                disabled={pinCode?.length !== 6}
                onClick={handleSign}
              >
                {t("label:digitalSign.sign")}
              </CustomButton>
            </ButtonWrapper>
          )}
          
          <ButtonWrapper>
            <CustomButton
              color={"error"}
              variant="contained"
              name="AlertButtonNo"
              id={"AlertButtonNo"}
              onClick={handleClose}
            >
              {t("label:digitalSign.cancel")}
            </CustomButton>
          </ButtonWrapper>
        </ActionsWrapper>
      </ContentWrapper>
    </Dialog>
  );
});

export default DigitalSignDialog;

// Стили остаются без изменений
const MainText = styled.h1`
  color: var(--colorNeutralForeground1);
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
`;

const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
`;

const ButtonWrapper = styled.div``;

const ContentWrapper = styled(MuiDialogContent)`
  margin: 20px;
`;

const Header = styled.div`
  font-size: 18px;
  font-weight: 500;
  line-height: 36px;
  text-align: left;
  color: var(--colorNeutralForeground1);
`;

const CloseModal = styled.button`
  border: none;
  outline: none;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 38px;
  right: 30px;
  width: 24px;
  height: 24px;
  font-size: 16px;
  opacity: 0.6;
  transition: opacity ease 0.3s;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 10px;
    display: block;
    width: 18px;
    height: 3px;
    background: var(--colorBrandForeground1);
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }
`;