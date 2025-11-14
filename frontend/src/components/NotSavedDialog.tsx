import Dialog from '@mui/material/Dialog';
import MuiDialogContent from '@mui/material/DialogContent';
import { observer } from "mobx-react";
import styled from 'styled-components';
import CustomButton from "components/Button";
import { useTranslation } from 'react-i18next';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog = observer(({ open, title, message, onConfirm, onCancel }: ConfirmationDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog 
      onClose={onCancel}
      aria-labelledby="confirmation-dialog-title"
      fullWidth={true}
      maxWidth={'sm'}
      open={open}
    >
      <CloseModal onClick={onCancel} />
      <ContentWrapper>
        <Header>
          <MainText>{title}</MainText>
        </Header>
        <Body>
          <div dangerouslySetInnerHTML={{ __html: message }} />
        </Body>

        <ButtonsWrapper>
          <CustomButton
            name="ConfirmationButtonCancel"
            color="primary"
            variant="outlined"
            onClick={onCancel}
            sx={{ mr: 2 }}
          >
            {t('common:cancel')}
          </CustomButton>
          <CustomButton
            name="ConfirmationButtonConfirm"
            color="primary"
            variant="contained"
            onClick={onConfirm}
          >
            {t('common:next')}
          </CustomButton>
        </ButtonsWrapper>
      </ContentWrapper>
    </Dialog>
  );
});

export default ConfirmationDialog;

const MainText = styled.h1`
  margin: 20px;
`;

const ButtonsWrapper = styled.div`
  margin: 10px;
  margin-left: 30px;
  display: flex;
  justify-content: flex-start;
`;

const ContentWrapper = styled(MuiDialogContent)`
  margin: 20px;
`;

const Header = styled.div`
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  line-height: 36px;
  text-align: left;
  color: var(--colorNeutralForeground1);
  margin: 0 0 30px 0;
`;

const Body = styled.div`
  margin: 30px;
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