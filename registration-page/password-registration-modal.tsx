import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import { IUserJobTitles, IUserRoles } from 'src/utils/types';
import { State } from 'src/reducers';
import { Icon } from 'src/components/general/icon';
import { bemPrefix } from 'src/utils/bem';
import { ModalContent } from 'src/components/general/modal/modal-content';
import { SelectGeneral } from 'src/components/general/select';
import { Input } from 'src/components/general/input';
import { RegisterErrorsState, RegisterValuesState } from './registration-page';

import './password-registration-modal.scss';

const bem = bemPrefix('password-registration-modal');

interface IPasswordRegistrationProps {
  modalState: RegisterValuesState;
  modalErrors: RegisterErrorsState;
  handlePassword: (value: string) => void;
  handlePasswordConfirm: (value: string) => void;
  handleSpecialization: (value: string) => void;
  handleUserPosition: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  roles: IUserRoles;
  jobTitles: IUserJobTitles[];
}

interface PasswordRegistrationInputs {
  value: string;
  name: string;
  isSelected: boolean;
}

export const PasswordRegistration: React.FC<IPasswordRegistrationProps> = ({
  modalState,
  modalErrors,
  handlePassword,
  handlePasswordConfirm,
  handleSpecialization,
  handleUserPosition,
  onClose,
  onSubmit,
  roles,
  jobTitles,
}) => {
  const [t] = useTranslation();

  const passwordFields = [
    {
      label: t('Password'),
      value: modalState.userPassword,
      type: 'password',
      autoComplete: 'new-password',
      placeholder: '',
      isRequired: false,
      id: 'userPassword',
      textError: modalErrors.errorUserPassword,
      className: bem('password-input'),
      handler: (event: React.ChangeEvent<HTMLInputElement>) => handlePassword(event.target.value),
    },
    {
      label: t('Repeat password'),
      value: modalState.confirmPassword,
      type: 'password',
      autoComplete: 'new-password',
      placeholder: '',
      isRequired: false,
      id: 'confirmPassword',
      textError: modalErrors.errorConfirmPassword,
      className: bem('password-input'),
      handler: (event: React.ChangeEvent<HTMLInputElement>) => handlePasswordConfirm(event.target.value),
    },
  ];

  const positionDropDown = {
    label: `${t('Position')} *`,
    initialValue: t('Chief Engineer'),
    options: isEmpty(jobTitles)
      ? [{
        value: 'value',
        label: 'label',
        id: 'userPosition',
      }]
      : jobTitles.map(title => ({
          value: title.job_title_id,
          label: title.name,
          id: 'userPosition',
        })),
  };

  const footerText = `*- ${t('required fields')}`;

  const specializationInputs: PasswordRegistrationInputs[] = [
    {
      value: roles.farmer,
      name: t('Farmer'),
      isSelected: modalState.userSpecialization === roles.farmer,
    },
    {
      value: roles.consultant,
      name: t('Consultant'),
      isSelected: modalState.userSpecialization === roles.consultant,
    },
    {
      value: roles.dealer,
      name: t('Dealer'),
      isSelected: modalState.userSpecialization === roles.dealer,
    },
  ];

  const getFooter = () => (
    <>
      <p>
        {t('By clicking Registrate you accept the next')}
        <p><Link className={bem('link')} to="/auth/privacy-policy">{ t('Terms of use')}</Link></p>
      </p>
      <p>{`${t('Step')} 2/2`}</p>
    </>
  )

  return (
    <div className={bem()}>
      <ModalContent
        className={bem('modal')}
        title={t('Registration')}
        onSuccess={onSubmit}
        okButtonName={t('Registrate')}
        value=""
        close={onClose}
        footerText={footerText}
        additionalFooterText={getFooter()}
      >
        <>
          <SelectGeneral
            label={positionDropDown.label}
            options={positionDropDown.options}
            placeholder={positionDropDown.initialValue}
            onChange={(e) => handleUserPosition(e.value)}
          />
          {modalErrors.errorUserPosition && <div className={bem('error-text')}>{modalErrors.errorUserPosition}</div>}
          {passwordFields.map(
            ({ label, value, type, placeholder, isRequired, id, className, textError, autoComplete, handler }) => (
              <form key={id}>
                <Input
                  label={label}
                  value={value}
                  className={className}
                  type={type}
                  placeholder={placeholder}
                  required={isRequired}
                  id={id}
                  onChange={handler}
                  hasRequiredMark={isRequired}
                  autoComplete={autoComplete}
                  textError={t(textError)}
                />
              </form>
            )
          )}
          <div className={bem('specialization-form')}>
            <span className={bem('title')}>{t('Your specialization*')}</span>
            <form className={bem('form')}>
              {specializationInputs.map(({ value, name, isSelected }) => (
                <div
                  key={`key-${name}`}
                  className={`${bem('form__radio')} ${isSelected ? 'checked' : ''}`}
                  onClick={() => handleSpecialization(value)}
                >
                  <input type="radio" checked={isSelected} onChange={() => null} />
                  <Icon
                    className={bem('form__radio__icon')}
                    name={isSelected ? 'radioBtnFill' : 'radioBtnBlank'}
                  />
                  {name}
                </div>
              ))}
            </form>
            {modalErrors.errorUserSpecialization && <div className={bem('error-text')}>{modalErrors.errorUserSpecialization}</div>}
          </div>
        </>
      </ModalContent>
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  roles: state.user.userRoles,
  jobTitles: state.user.userJobTitles,
});

export const PasswordRegistrationModal = connect(mapStateToProps)(PasswordRegistration);
