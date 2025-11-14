import React, { FC, useEffect } from "react";
import { Checkbox, Container, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import store from "./store";
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


  return (
    <>
      <Container sx={{ mt: 5 }}>
        <ApplicationInfoCard />
      </Container>
    </>
  );
})

export default ApplicationPublicView;