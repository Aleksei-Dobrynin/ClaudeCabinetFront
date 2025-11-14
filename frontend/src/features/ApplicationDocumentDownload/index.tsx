import React, { FC, useEffect } from "react";
import { Container } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import store from "./store";
import { useLocation, useNavigate } from "react-router-dom";
import ApplicationInfoCard from "./card";
import LanguageSectionImport from "layouts/MainLayout/Header/LanguageSection";
import Box from "@mui/material/Box";
import i18n from "i18next";

const LanguageSection = LanguageSectionImport as unknown as React.FC<{ style?: React.CSSProperties }>;

interface ApplicationProps {
}

const ApplicationDocumentDownloadView: FC<ApplicationProps> = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const guid = query.get("guid");

  useEffect(() => {
    const isValidGuid = (guid: string | null): boolean => {
      if (!guid || guid.trim() === "") return false;
      return true; 

      
      // const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      // return guidRegex.test(guid.trim());
    };

    if (guid && isValidGuid(guid)) {
      store.doLoad(guid.trim());
    } else if (guid === null || guid === "") {
      console.warn("GUID parameter is missing in URL");
    } else {
      console.warn("Invalid GUID format:", guid);
    }

    return () => {
      store.clearStore();
    };
  }, [guid]); 

  return (
    <Container sx={{ mt: 5 }}>
      <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
        <LanguageSection style={{ marginLeft: '0px' }} />
      </Box>
      <ApplicationInfoCard key={i18n.language} />
    </Container>
  );
});

export default ApplicationDocumentDownloadView;