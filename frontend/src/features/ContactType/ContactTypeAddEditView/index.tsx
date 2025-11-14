import React, { FC } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { withForm } from "components/hoc/withForm";
import ContactTypeAddEditBaseView from "./base";
import store from "./store";
import MtmTabs from "./mtmTabs";

/**
 * Interface for component props
 */
interface ContactTypeProps {
  id: string | null;
}

/**
 * ContactType form component for adding and editing ContactTypes
 * @param props - Component props
 */
const ContactTypeAddEditView: FC<ContactTypeProps> = observer((props) => {
  const { t } = useTranslation();
  const { id } = props;

  return (
    <ContactTypeAddEditBaseView>
      {/* Show many-to-many relationship tabs only when editing existing ContactType */}
      {Number(id) > 0 && (
        <Grid item xs={12} spacing={0}>
          <MtmTabs />
        </Grid>
      )}
    </ContactTypeAddEditBaseView>
  );
});

// Enhance component with form functionality using the HOC
export default withForm(ContactTypeAddEditView, store, "/user/ContactType");