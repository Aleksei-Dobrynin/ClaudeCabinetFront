import React, { ComponentType, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { observer } from "mobx-react";
import { Grid, Box, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';

// Type for store that our HOC expects
interface FormStore {
  doLoad: (id: number) => void;
  clearStore: () => void;
  onSaveClick: (callback: (id: number) => void) => void;
}

// Type for props that our HOC will inject
interface WithFormProps {
  id: string | null;
  store: FormStore;
  cancelPath: string;
}

/**
 * A HOC that enhances a component with form functionality
 * @param WrappedComponent The component to wrap
 * @param store The MobX store to use
 * @param cancelPath The path to navigate to on cancel
 */
export const withForm = <P extends object>(
  WrappedComponent: ComponentType<P>,
  store: FormStore,
  cancelPath: string
) => {
  // Create and return the enhanced component
  const WithForm = observer((props: Omit<P, keyof WithFormProps>) => {
    const { t } = useTranslation();
    const translate = t;
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const id = query.get("id");

    useEffect(() => {
      if ((id != null) && (id !== "") && !isNaN(Number(id.toString()))) {
        store.doLoad(Number(id));
      } else {
        navigate("/error-404");
      }

      return () => {
        store.clearStore();
      };
    }, []);

    // Combine the props for the wrapped component
    const wrappedProps = {
      ...props as P,
      id,
      store,
      cancelPath
    } as P;

    return (
      <>
        <WrappedComponent {...wrappedProps} />

        {/* Standard form buttons */}
        <Container maxWidth='xl'>

          <Box display="flex" p={2}>
            <Box m={2}>
              <CustomButton
                variant="contained"
                id="id_SaveButton"
                onClick={() => {
                  store.onSaveClick((id: number) => {
                    navigate(cancelPath);
                  });
                }}
              >
                {translate("common:save")}
              </CustomButton>
            </Box>
            <Box m={2}>
              <CustomButton
                color={"secondary"}
                sx={{ color: "white", backgroundColor: "red !important" }}
                variant="contained"
                id="id_CancelButton"
                onClick={() => navigate(cancelPath)}
              >
                {translate("common:goOut")}
              </CustomButton>
            </Box>
          </Box>

        </Container>

      </>
    );
  });

  return WithForm;
};

// Helper function to get the display name of a component
function getDisplayName(WrappedComponent: ComponentType<any>): string {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}