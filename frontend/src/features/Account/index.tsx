import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';
import CustomTextField from 'components/TextField';
import userProfileStore from './userProfileStore';
import './UserProfile.css';
import { Chip } from "@mui/material";

const UserProfile = observer(() => {
  const { t } = useTranslation();
  const translate = t;
  const [openEditInfo, setOpenEditInfo] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);

  useEffect(() => {
    userProfileStore.loadUserData();
  }, []);

  const handleEditInfoOpen = () => {
    userProfileStore.setEditFormData({
      firstName: userProfileStore.userData.firstName || '',
      lastName: userProfileStore.userData.lastName || '',
      secondName: userProfileStore.userData.secondName || '',
      pin: userProfileStore.userData.pin || ''
    });
    setOpenEditInfo(true);
  };

  const handleEditInfoClose = () => {
    setOpenEditInfo(false);
  };

  const handleChangePasswordOpen = () => {
    userProfileStore.setPasswordFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setOpenChangePassword(true);
  };

  const handleChangePasswordClose = () => {
    setOpenChangePassword(false);
  };

  const handleSaveInfo = () => {
    userProfileStore.updateUserInfo(() => {
      setOpenEditInfo(false);
    });
  };

  const handleChangePassword = () => {
    userProfileStore.changePassword(() => {
      setOpenChangePassword(false);
    });
  };

  const InfoField = ({ label, value }) => (
    <div className="profile-info-field">
      <div className="profile-info-label">{label}:</div>
      <div className="profile-info-value">{value || '—'}</div>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {userProfileStore.userData.firstName?.[0]}
            {userProfileStore.userData.lastName?.[0]}
          </div>
          <div className="profile-user-info">
            <h1 className="profile-user-name">
              {userProfileStore.userData.firstName} {userProfileStore.userData.lastName} {userProfileStore.userData.secondName}
            </h1>
            {/* <p className="profile-user-id">ID: {userProfileStore.userData.id}</p> */}
          </div>
        </div>

        <div className="profile-divider"></div>

        <div className="profile-grid">
          <div>
            <h2 className="profile-section-title">{translate('label:UserProfile.personalInfo')}</h2>
            <InfoField label={translate('label:UserProfile.lastName')} value={userProfileStore.userData.lastName} />
            <InfoField label={translate('label:UserProfile.firstName')} value={userProfileStore.userData.firstName} />
            <InfoField label={translate('label:UserProfile.secondName')} value={userProfileStore.userData.secondName} />
            <InfoField label={translate('label:UserProfile.email')} value={userProfileStore.userData.email} />
          </div>

          <div>
            <h2 className="profile-section-title">{translate('label:UserProfile.accountInfo')}</h2>
            <InfoField
              label={translate('label:UserProfile.created')}
              value={userProfileStore.userData.createdAt ? new Date(userProfileStore.userData.createdAt).toLocaleDateString() : '—'}
            />
            <InfoField
              label={translate('label:UserProfile.lastUpdate')}
              value={userProfileStore.userData.updatedAt ? new Date(userProfileStore.userData.updatedAt).toLocaleDateString() : '—'}
            />
            <InfoField
              label={translate('label:UserProfile.status')}
              value={userProfileStore.userData.isApproved ? translate('label:UserProfile.approved') : translate('label:UserProfile.notApproved')}
            />
          </div>
        </div>

        <div className="profile-divider"></div>

        <div className="profile-actions">
          <CustomButton
            variant="contained"
            id="edit-info-button"
            onClick={handleEditInfoOpen}
          >
            {translate('label:UserProfile.editInfo')}
          </CustomButton>
          <CustomButton
            variant="contained"
            id="change-password-button"
            onClick={handleChangePasswordOpen}
          >
            {translate('label:UserProfile.changePassword')}
          </CustomButton>
          {/* {userProfileStore.userData.guid && (
            userProfileStore.userData.is_connect_telegram ? (
              <Chip
                label={translate('common:Telegram_attached')}
                color="success"
                variant="outlined"
                sx={{ mb: 1, ml: 1 }}
              />
            ) : (
            <CustomButton
              variant='contained'
              sx={{ mb: 1, ml: 1 }}
              id={`employee_contactAddButton`}
              onClick={() => window.open(`https://t.me/bga_employee_notification_bot?start=guid_${userProfileStore.userData.guid}`, '_blank').focus()}
            >
              {translate("common:Attach_telegram")}
            </CustomButton>
          ))} */}
        </div>

        {openEditInfo && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">
                {translate('label:UserProfile.editPersonalInfo')}
              </h2>

              <div className="form-group">
                <CustomTextField
                  label={translate('label:UserProfile.lastName')}
                  value={userProfileStore.editFormData.lastName}
                  onChange={(e) => userProfileStore.handleEditFormChange({ target: { name: 'lastName', value: e.target.value } })}
                  error={!!userProfileStore.errors.lastName}
                  helperText={userProfileStore.errors.lastName}
                  id="edit-lastName"
                  name="lastName"
                />
              </div>

              <div className="form-group">
                <CustomTextField
                  label={translate('label:UserProfile.firstName')}
                  value={userProfileStore.editFormData.firstName}
                  onChange={(e) => userProfileStore.handleEditFormChange({ target: { name: 'firstName', value: e.target.value } })}
                  error={!!userProfileStore.errors.firstName}
                  helperText={userProfileStore.errors.firstName}
                  id="edit-firstName"
                  name="firstName"
                />
              </div>

              <div className="form-group">
                <CustomTextField
                  label={translate('label:UserProfile.secondName')}
                  value={userProfileStore.editFormData.secondName}
                  onChange={(e) => userProfileStore.handleEditFormChange({ target: { name: 'secondName', value: e.target.value } })}
                  error={!!userProfileStore.errors.secondName}
                  helperText={userProfileStore.errors.secondName}
                  id="edit-secondName"
                  name="secondName"
                />
              </div>

              <div className="modal-actions">
                <CustomButton onClick={handleEditInfoClose}>
                  {translate('common:cancel')}
                </CustomButton>
                <CustomButton onClick={handleSaveInfo} variant="contained">
                  {translate('common:save')}
                </CustomButton>
              </div>
            </div>
          </div>
        )}

        {openChangePassword && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">
                {translate('label:UserProfile.changePassword')}
              </h2>

              <div className="form-group">
                <CustomTextField
                  label={translate('label:UserProfile.oldPassword')}
                  type="password"
                  value={userProfileStore.passwordFormData.oldPassword}
                  onChange={(e) => userProfileStore.handlePasswordFormChange({ target: { name: 'oldPassword', value: e.target.value } })}
                  error={!!userProfileStore.errors.oldPassword}
                  helperText={userProfileStore.errors.oldPassword}
                  id="change-oldPassword"
                  name="oldPassword"
                />
              </div>

              <div className="form-group">
                <CustomTextField
                  label={translate('label:UserProfile.newPassword')}
                  type="password"
                  value={userProfileStore.passwordFormData.newPassword}
                  onChange={(e) => userProfileStore.handlePasswordFormChange({ target: { name: 'newPassword', value: e.target.value } })}
                  error={!!userProfileStore.errors.newPassword}
                  helperText={userProfileStore.errors.newPassword}
                  id="change-newPassword"
                  name="newPassword"
                />
              </div>

              <div className="form-group">
                <CustomTextField
                  label={translate('label:UserProfile.confirmPassword')}
                  type="password"
                  value={userProfileStore.passwordFormData.confirmPassword}
                  onChange={(e) => userProfileStore.handlePasswordFormChange({ target: { name: 'confirmPassword', value: e.target.value } })}
                  error={!!userProfileStore.errors.confirmPassword}
                  helperText={userProfileStore.errors.confirmPassword}
                  id="change-confirmPassword"
                  name="confirmPassword"
                />
              </div>

              <div className="modal-actions">
                <CustomButton onClick={handleChangePasswordClose}>
                  {translate('common:cancel')}
                </CustomButton>
                <CustomButton onClick={handleChangePassword} variant="contained">
                  {translate('common:save')}
                </CustomButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default UserProfile;