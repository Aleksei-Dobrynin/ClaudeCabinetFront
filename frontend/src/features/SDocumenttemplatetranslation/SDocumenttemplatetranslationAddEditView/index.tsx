import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import SDocumenttemplatetranslationAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

interface SDocumenttemplatetranslationProps {
  id: string | null;
}

const SDocumenttemplatetranslationAddEditView: FC<SDocumenttemplatetranslationProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <SDocumenttemplatetranslationAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing SDocumenttemplatetranslation */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </SDocumenttemplatetranslationAddEditBaseView>
  );
})

export default withForm(SDocumenttemplatetranslationAddEditView, store, "/user/SDocumenttemplatetranslation");