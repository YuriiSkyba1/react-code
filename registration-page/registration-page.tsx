import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import CryptoJS from 'crypto-js';
import PNF from 'google-libphonenumber';

import { ENCRYPT_IV, ENCRYPT_KEY } from 'src/utils/helpers/constants';
import { State } from 'src/reducers';
import {
  ICountryOption,
  IUserJobTitles,
  IUserRoles,
  RegisterUserPayload,
  VerifyExistedEmailPayload,
} from 'src/utils/types';
import { checkExistedEmail, fetchJobTitles, fetchRoles, getCountryOptions, registerUser } from 'src/actions';
import { bemPrefix } from 'src/utils/bem';
import { validateEmail, validateName, validatePassword } from 'src/utils/helpers/validators';
import { LandingFormWrapper } from '../../general/landing-form-wrapper';
import { MainRegistrationModal } from './main-registration-modal';
import { PasswordRegistrationModal } from './password-registration-modal';

import './registration-page.scss';

const bem = bemPrefix('registration-page');

export enum ModalForms {
  GeneralForm = 'generalForm',
  PasswordFrom = 'paswordForm',
}

interface RegistrationProps {
  onRegister: (data: RegisterUserPayload) => void;
  verifyEmail: (data: VerifyExistedEmailPayload) => Promise<boolean>;
  getRoles: () => void;
  getJobTitles: () => void;
  getCountries: () => void;
  isLoggedIn: boolean;
  history: { push(url: string): void };
  jobTitles: IUserJobTitles[];
  roles: IUserRoles;
  countries: ICountryOption[];
  isLoading: boolean;
  isExistingEmailLoading: boolean;
}

export interface RegisterValuesState {
  userName: string;
  userLastName: string;
  userPatronymic: string;
  userEmail: string;
  userPhone: string;
  userCountryCode: string;
  userPosition: string;
  userSpecialization: string;
  userPassword: string;
  confirmPassword: string;
}

export interface RegisterErrorsState {
  errorUserName: string;
  errorUserLastName: string;
  errorUserEmail: string;
  errorUserPhone: string;
  errorUserPosition: string;
  errorUserSpecialization: string;
  errorUserPassword: string;
  errorConfirmPassword: string;
}

const INITIAL_VALUES: RegisterValuesState = {
  userName: '',
  userLastName: '',
  userPatronymic: '',
  userEmail: '',
  userPhone: '',
  userCountryCode: '',
  userPosition: '',
  userSpecialization: '',
  userPassword: '',
  confirmPassword: '',
};

const INITIAL_ERRORS: RegisterErrorsState = {
  errorUserName: '',
  errorUserLastName: '',
  errorUserEmail: '',
  errorUserPhone: '',
  errorUserPosition: '',
  errorUserSpecialization: '',
  errorUserPassword: '',
  errorConfirmPassword: '',
};

const Registration: React.FC<RegistrationProps> = ({
  onRegister,
  verifyEmail,
  getRoles,
  getJobTitles,
  getCountries,
  history,
  jobTitles,
  roles,
  countries,
  isLoading,
  isExistingEmailLoading,
}) => {
  const [state, setState] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [shownModal, setShownModal] = useState(ModalForms.GeneralForm);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const hasRoles = !isEmpty(Object.keys(roles)) && !!Object.values(roles)[0];
    !hasRoles && getRoles();
    isEmpty(jobTitles) && getJobTitles();
    isEmpty(countries) && getCountries();
  }, [jobTitles]);

  const redirectToLoginPage = () => history.push('/auth');

  const [t] = useTranslation();

  const handleUserName = (name: string) => {
    if (errors.errorUserName) {
      setErrors({ ...errors, errorUserName: '' });
    }

    setState({ ...state, userName: name });
  };

  const handleLastName = (lastName: string) => {
    if (errors.errorUserLastName) {
      setErrors({ ...errors, errorUserLastName: '' });
    }

    setState({ ...state, userLastName: lastName });
  };

  const handlePatronymic = (name: string) => setState({ ...state, userPatronymic: name });

  const handleUserEmail = (email: string) => {
    if (errors.errorUserEmail) {
      setErrors({ ...errors, errorUserEmail: '' });
    }

    setState({ ...state, userEmail: email });
  };

  const handlePhone = (name: string) => {
    if (errors.errorUserPhone) {
      setErrors({ ...errors, errorUserPhone: '' });
    }

    setState({ ...state, userPhone: name });
  };

  const handleCountryCode = (code: string) => {
    setState({ ...state, userCountryCode: code });
  };

  const handlePassword = (pass: string) => {
    if (errors.errorUserPassword) {
      setErrors({ ...errors, errorUserPassword: '' });
    }

    setState({ ...state, userPassword: pass });
  };

  const handlePasswordConfirm = (pass: string) => {
    if (errors.errorConfirmPassword) {
      setErrors({ ...errors, errorConfirmPassword: '' });
    }

    setState({ ...state, confirmPassword: pass });
  };

  const handleSpecialization = (value: string) => {
    if (errors.errorUserSpecialization) {
      setErrors({ ...errors, errorUserSpecialization: '' });
    }

    setState({ ...state, userSpecialization: value });
  };

  const handleUserPosition = (position: string) => {
    if (errors.errorUserPosition) {
      setErrors({ ...errors, errorUserPosition: '' });
    }

    setState({ ...state, userPosition: position });
  };

  const handleRegister = () => {
    const key = CryptoJS.enc.Hex.parse(ENCRYPT_KEY);
    const iv = CryptoJS.enc.Hex.parse(ENCRYPT_IV);
    const encryptedPass = CryptoJS.AES.encrypt(state.userPassword, key, { iv }).toString();

    history.push(`/auth/register-success/${state.userEmail}`);
    onRegister({
      email: state.userEmail,
      password: encryptedPass,
      password_confirmation: encryptedPass,
      role_id: state.userSpecialization,
      job_title_id: state.userPosition,
      license_code: '',
      firstname: state.userName,
      lastname: state.userLastName,
      patronymic: state.userPatronymic,
      phone: state.userPhone,
    });
  };

  const validatePhone = (): boolean => {
    try {
      const phoneValidator = PNF.PhoneNumberUtil.getInstance();
      const isNumbValid = phoneValidator.isValidNumberForRegion(
        phoneValidator.parse(state.userPhone, state.userCountryCode),
        state.userCountryCode
      );

      if (isNumbValid) {
        return true;
      }

      return false;
    } catch (e) {
      return false;
    }
  };

  const handleValidationMainRegistration = () => {
    let hasErrors = false;
    const formErrors = {
      errorUserName: '',
      errorUserLastName: '',
      errorUserEmail: '',
      errorUserPhone: '',
    };

    if (!validateName(state.userName)) {
      hasErrors = true;
      formErrors.errorUserName = 'Enter correct name';
    }

    if (!validateName(state.userLastName)) {
      hasErrors = true;
      formErrors.errorUserLastName = 'Enter correct last name';
    }

    const isValidPhone = validatePhone();

    if (!isValidPhone) {
      hasErrors = true;
      formErrors.errorUserPhone = 'Enter correct phone number';
    }

    if (!validateEmail(state.userEmail)) {
      hasErrors = true;
      formErrors.errorUserEmail = 'Enter the correct email';
    }

    if (hasErrors) {
      setErrors({ ...errors, ...formErrors });
      return;
    }

    verifyEmail({ email: state.userEmail }).then((isEmailExisted?: boolean) => {
      if (isEmailExisted) {
        setErrors({ ...errors, errorUserEmail: 'This email has been already in use' });
      } else {
        setShownModal(ModalForms.PasswordFrom);
      }
    });
  };

  const handleValidationPasswordRegistration = () => {
    let hasErrors = false;
    const formErrors = {
      errorUserSpecialization: '',
      errorUserPassword: '',
      errorConfirmPassword: '',
      errorUserPosition: '',
    };

    if (!validatePassword(state.confirmPassword)) {
      hasErrors = true;
      formErrors.errorConfirmPassword = t(
        'Password should be at least 8 symbols, contain all cases letters and number'
      );
    }

    if (state.userPassword !== state.confirmPassword) {
      hasErrors = true;
      formErrors.errorConfirmPassword = t('Passwords should be identical');
    }

    if (!state.userPosition) {
      hasErrors = true;
      formErrors.errorUserPosition = t('Choose your position');
    }

    if (!state.userSpecialization) {
      hasErrors = true;
      formErrors.errorUserSpecialization = t('Choose your specialization');
    }

    if (hasErrors) {
      setErrors({ ...errors, ...formErrors });
      return;
    }

    handleRegister();
  };

  return (
    <LandingFormWrapper onClick={redirectToLoginPage} widgetWrapperClass={bem('widget-wrapper')}>
      {shownModal === ModalForms.GeneralForm && (
        <MainRegistrationModal
          modalState={state}
          modalErrors={errors}
          handleUserName={handleUserName}
          handleLastName={handleLastName}
          handlePatronymic={handlePatronymic}
          handleUserEmail={handleUserEmail}
          handlePhone={handlePhone}
          handleCountryCode={handleCountryCode}
          onSubmit={handleValidationMainRegistration}
          onClose={redirectToLoginPage}
          isLoading={isExistingEmailLoading}
        />
      )}
      {shownModal === ModalForms.PasswordFrom && (
        <PasswordRegistrationModal
          modalState={state}
          modalErrors={errors}
          handlePassword={handlePassword}
          handlePasswordConfirm={handlePasswordConfirm}
          handleSpecialization={handleSpecialization}
          handleUserPosition={handleUserPosition}
          onSubmit={handleValidationPasswordRegistration}
          onClose={redirectToLoginPage}
        />
      )}
    </LandingFormWrapper>
  );
};

const mapStateToProps = (state: State) => ({
  jobTitles: state.user.userJobTitles,
  roles: state.user.userRoles,
  countries: state.management.countryOptions,
  isLoading: state.user.isLoading,
  isExistingEmailLoading: state.user.isExistingEmailLoading,
});

const mapDispatchToProps = {
  getRoles: fetchRoles,
  getJobTitles: fetchJobTitles,
  getCountries: getCountryOptions,
  onRegister: registerUser,
  verifyEmail: checkExistedEmail,
};

export const RegistrationPage = connect(mapStateToProps, mapDispatchToProps)(Registration);
