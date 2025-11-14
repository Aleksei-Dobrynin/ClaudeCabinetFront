import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import UsbIcon from "@mui/icons-material/Usb";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HelpIcon from '@mui/icons-material/Help';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LanguageSectionImport from "layouts/MainLayout/Header/LanguageSection";
import i18n from "i18n";
import { useNavigate } from "react-router-dom";

const LanguageSection = LanguageSectionImport as unknown as React.FC<{ style?: React.CSSProperties }>;

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2"
    }
  }
});

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"© "} {new Date().getFullYear()}{" "}
      {i18n.t('label:authorization.title')}
    </Typography>
  );
}

const AuthForm = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const [authMethod, setAuthMethod] = useState("credentials"); // 'credentials' или 'token'
  const [showPassword, setShowPassword] = useState(false);
  const store = props.store;
  const navigate = useNavigate();

  const getSubmitButtonText = (authMethod) => {
    switch (authMethod) {
      case 'credentials':
      case 'token':
        return translate('label:authorization.signIn');
      case 'forgotPassword':
        return translate('label:authorization.recoverPassword');
    }
  };

  const handleAuthMethodChange = (newMethod) => {
    setAuthMethod(newMethod);
    store.clearStore();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    switch (authMethod) {
      case 'credentials':
        await store.onCredentialsLogin();
        break;
      case 'token':
        await store.onTokenLogin();
        break;
      case 'forgotPassword':
        await store.onForgotPassword();
        handleAuthMethodChange("credentials")
        break;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
        <LanguageSection style={{ marginLeft: '0px' }} />
      </Box>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />

        <Grid item xs={12} sm={4} md={3}
          sx={{
            bgcolor: "#2196f3",
            color: "white",
            display: "flex",
            flexDirection: "column",
            p: 3
          }}
        >
          <Typography variant="subtitle1" component="div" sx={{ mb: 2, mt: 4 }}>
            {translate('label:authorization.loginVia')}
          </Typography>

          <List component="nav" sx={{ width: "100%" }}>
            <Paper elevation={2} sx={{ mb: 2, borderRadius: 1 }}>
              <ListItemButton
                selected={authMethod === "credentials"}
                onClick={() => handleAuthMethodChange("credentials")}
                sx={{
                  borderRadius: 1,
                  p: 2,
                  "&.Mui-selected": {
                    bgcolor: "white",
                    color: "text.primary",
                    "&:hover": {
                      bgcolor: "white"
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <AccountCircleIcon color={authMethod === "credentials" ? "primary" : "inherit"} />
                </ListItemIcon>
                <ListItemText
                  primary={translate('label:authorization.loginAndPassword')}
                  secondary={authMethod === "credentials" ? translate('label:authorization.loginPasswordDescription') : null}
                  primaryTypographyProps={{
                    fontWeight: authMethod === "credentials" ? "bold" : "normal"
                  }}
                  secondaryTypographyProps={{
                    color: "text.secondary"
                  }}
                />
              </ListItemButton>
            </Paper>

            {/* Комментированный блок для Рутокен - оставляю для будущего использования */}
            {/* <Paper elevation={2} sx={{ mb: 2, borderRadius: 1 }}>
              <ListItemButton
                selected={authMethod === "token"}
                onClick={() => handleAuthMethodChange("token")}
                sx={{
                  borderRadius: 1,
                  p: 2,
                  "&.Mui-selected": {
                    bgcolor: "white",
                    color: "text.primary",
                    "&:hover": {
                      bgcolor: "white"
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <UsbIcon color={authMethod === "token" ? "primary" : "inherit"} />
                </ListItemIcon>
                <ListItemText
                  primary={t('label:authorization.rutoken')}
                  secondary={authMethod === "token" ? t('label:authorization.rutokenDescription') : null}
                  primaryTypographyProps={{
                    fontWeight: authMethod === "token" ? "bold" : "normal"
                  }}
                  secondaryTypographyProps={{
                    color: "text.secondary"
                  }}
                />
              </ListItemButton>
            </Paper> */}
          </List>

          <Box sx={{ flexGrow: 1 }} />

          <Typography variant="subtitle1" component="div" sx={{ mb: 2 }}>
            {translate('label:authorization.registration')}
          </Typography>

          <Paper elevation={2} sx={{ borderRadius: 1 }}>
            <ListItemButton
              sx={{
                borderRadius: 1,
                p: 2
              }}
              onClick={() => {
                if (props.onRegisterClick) {
                  props.onRegisterClick();
                }
              }}
            >
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary={translate('label:authorization.register')}
                secondary={translate('label:authorization.registrationDescription')}
              />
            </ListItemButton>
          </Paper>
          <Paper elevation={2} sx={{ borderRadius: 1, mt: 1 }}>
            <ListItemButton
              sx={{
                borderRadius: 1,
                p: 2
              }}
              onClick={() => {
                window.open("http://cabinet.bga.gov.kg/help", "_blank")
              }}
            >
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText
                primary={translate('label:authorization.help')}
              />
            </ListItemButton>
          </Paper>
          <Paper elevation={2} sx={{ borderRadius: 1, mt: 1 }}>
            <ListItemButton
              sx={{
                borderRadius: 1,
                p: 2
              }}
              onClick={() => {
                window.open("https://t.me/bga_ais_support", "_blank")
              }}
            >
              <ListItemIcon>
                <LiveHelpIcon />
              </ListItemIcon>
              <ListItemText
                primary={translate('label:authorization.technicalSupport')}
              />
            </ListItemButton>
          </Paper>
          <Box mt={4}>
            <Copyright />
          </Box>
        </Grid>

        <Grid item xs={12} sm={8} md={9} component={Paper} elevation={0} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: 400,
              margin: "0 auto",
              mt: 10
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 4,
                mt: 20
              }}
            >
              <img
                src="/logo256.png"
                alt={i18n.t('label:authorization.title')}
                style={{ height: 80, marginRight: 20 }}
              />
              <Box>
                <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
                  {i18n.t('label:authorization.title')}
                </Typography>
                <Typography component="h2" variant="subtitle1" color="text.secondary">
                  {translate('label:authorization.applicantCabinet')}
                </Typography>
              </Box>
            </Box>

            <Typography component="h1" variant="h5" sx={{ mb: 4, textAlign: "center" }}>
              {(() => {
                switch (authMethod) {
                  case 'credentials':
                    return translate('label:authorization.loginViaCredentials');
                  case 'token':
                    return translate('label:authorization.loginViaToken');
                  case 'forgotPassword':
                    return translate('label:authorization.passwordRecovery');
                }
              })()}
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
              {(() => {
                switch (authMethod) {
                  case 'credentials':
                    return <>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label={translate('label:authorization.login')}
                        name="email"
                        autoComplete="email"
                        value={store.email}
                        onChange={(event) => store.handleChange(event)}
                        error={!!store.emailError}
                        helperText={store.emailError}
                        autoFocus
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label={translate('label:authorization.password')}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        autoComplete="current-password"
                        value={store.password}
                        onChange={(event) => store.handleChange(event)}
                        error={!!store.passwordError}
                        helperText={store.passwordError}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                      {store.isShowCodeVerify && <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="code"
                        label={translate("label:authorization:code")}
                        type="code"
                        id="code"
                        error={store.errorCode !== ""}
                        onChange={(event) => store.handleChange(event)}
                        value={store.code}
                      />}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                        <FormControlLabel
                          control={<Checkbox value="remember" color="primary" />}
                          label={translate('label:authorization.rememberMe')}
                        />
                        <Link variant="body2" onClick={() => handleAuthMethodChange("forgotPassword")}>
                          {translate('label:authorization.forgotPassword')}
                        </Link>
                      </Box>
                    </>;
                  case 'token':
                    return <> <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="pin"
                      label={translate('label:authorization.tokenPin')}
                      name="pin"
                      type="password"
                      autoComplete="current-password"
                      value={store.pin}
                      onChange={(event) => store.handleChange(event)}
                      error={!!store.error}
                      helperText={store.error}
                      autoFocus
                    />
                    </>
                  case 'forgotPassword':
                    return <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label={translate('label:authorization.email')}
                      name="email"
                      autoComplete="email"
                      value={store.email}
                      onChange={(event) => store.handleChange(event)}
                      error={!!store.emailError}
                      helperText={store.emailError}
                      autoFocus
                    />
                }
              })()}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {getSubmitButtonText(authMethod)}
              </Button>

              {authMethod === "credentials" && (
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {translate('label:authorization.noAccount')}{" "}
                    <Link href="#" variant="body2" onClick={() => {
                      if (props.onRegisterClick) {
                        props.onRegisterClick();
                      }
                    }}>
                      {translate('label:authorization.registerNow')}
                    </Link>
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
});

export default AuthForm;