import { Outlet } from "react-router-dom";
import React, { FC } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { Snackbar, Alert, Backdrop, CircularProgress } from "@mui/material";
import MainStore from "MainStore";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import AlertDialog from "components/AlertDialog";
import ConfirmDialog from "components/ConfirmDialog";
import DigitalSignDialog from "components/DigitalSignDialog";
import FileDownload from "components/FileDownload";
type MainWrapperProps = {
  children: React.ReactNode;
};

const MainWrapper: FC<MainWrapperProps> = observer(() => {
  
  const getSnackbarIcon = () => {
    switch (MainStore.snackbarSeverity) {
      case "error":
        return <CancelIconWrapp />;
      case "success":
        return <CheckIconWrapp />;
      case "warning":
        return <WarningIconWrapp />;
      case "info":
        return <InfoIconWrapp />;
      default:
        return <CheckIconWrapp />;
    }
  };

  const getBackgroundColor = () => {
    switch (MainStore.snackbarSeverity) {
      case "error":
        return "#d32f2f";
      case "success":
        return "#2e7d32";
      case "warning":
        return "#ed6c02";
      case "info":
        return "#0288d1";
      default:
        return "#3e4450";
    }
  };

  return (
    <AppMainWapper id="main-scroll-content">
      <Outlet />

      <Snackbar
        id="Alert_Snackbar"
        anchorOrigin={MainStore.positionSnackbar}
        open={MainStore.openSnackbar}
        onClose={() => MainStore.changeSnackbar(false)}
        autoHideDuration={MainStore.snackbarSeverity === "error" ? 6000 : 3000}
        message={MainStore.snackbarMessage}
        key={"bottomleft"}
      >
        <StyledAlert
          icon={getSnackbarIcon()}
          onClose={() => MainStore.changeSnackbar(false)}
          $severity={MainStore.snackbarSeverity}
          $backgroundColor={getBackgroundColor()}
        >
          {MainStore.snackbarMessage}
        </StyledAlert>
      </Snackbar>

      <Backdrop 
        id={"Preloader_1"} 
        sx={{ 
          color: "#fff", 
          zIndex: 1000000,
          backdropFilter: "blur(2px)"
        }} 
        open={MainStore.loader}
      >
        <CircularProgress color="inherit" size={60} />
      </Backdrop>

      <AlertDialog />
      <ConfirmDialog />
      <DigitalSignDialog />
      <FileDownload />
      
    </AppMainWapper>
  );
});

export default MainWrapper;

const AppMainWapper = styled.div``;

const StyledAlert = styled(Alert)<{ 
  $severity?: "success" | "info" | "warning" | "error";
  $backgroundColor?: string;
}>`
  background-color: ${props => props.$backgroundColor || "#3e4450"} !important;
  color: #fff !important;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  
  .MuiAlert-message {
    display: flex;
    align-items: center;
  }
`;

const CancelIconWrapp = styled(CancelIcon)`
  color: #fff !important;
`;

const CheckIconWrapp = styled(CheckCircleIcon)`
  color: #fff !important;
`;

const WarningIconWrapp = styled(WarningIcon)`
  color: #fff !important;
`;

const InfoIconWrapp = styled(InfoIcon)`
  color: #fff !important;
`;