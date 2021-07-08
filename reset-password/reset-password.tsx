import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as EmailValidator from 'email-validator';

import { resetPassword } from '../../../actions';
import { Icon } from '../../general/icon';
import { InputValidate } from '../../general/input-validate';
import { LoginWidget } from '../login-widget';
import { bemPrefix } from '../../../utils/bem';

import './reset-password.scss';

const bem = bemPrefix('reset-password');

interface IResetPassProps {
  reset: (email: string) => void;
  history: { push(url: string): void };
}

interface ResetPasswordState {
  userEmail: string;
  errorUserEmail?: string;
}

const INITIAL_VALUES: ResetPasswordState = {
  userEmail: '',
  errorUserEmail: '',
};

const ResetPass: React.FC<IResetPassProps> = ({ history, reset }) => {
  const [t] = useTranslation();

  const [{ userEmail, errorUserEmail }, setInputValue] = useState(INITIAL_VALUES);

  const handleClose = () => history.push('/auth');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    reset(userEmail);
    history.push(`/auth/reset-password-success/${userEmail}`);
  };

  const handleValidation = (e: React.FormEvent) => {
    let errorText = '';
    e.preventDefault();

    if (!EmailValidator.validate(userEmail)) {
      errorText = t('Enter the correct email');
    }

    setInputValue((prevState) => ({
      ...prevState,
      errorUserEmail: errorText,
    }));

    if (!errorText) {
      handleSubmit();
    }
  };

  return (
    <div className={bem('main')}>
      <div className={bem('wrapper-center')}>
        <Icon name="logoGreenWhite" />
        <div className={bem('widget-wrapper')}>
          <LoginWidget handleSubmit={handleValidation} submitString={t('Send')} isOnLogin={false} isOnRegister={false}>
            <h2 className={bem('title')}>{t('Reset password')}</h2>
            <InputValidate
              name="userEmail"
              label={t('Email')}
              value={userEmail}
              className={bem('input')}
              type="text"
              placeholder={t('EmailExample')}
              required={true}
              id="email"
              textError={errorUserEmail}
              onChange={handleInput}
              isTextHidden={false}
            />
          </LoginWidget>
        </div>
      </div>
      <div className={bem('wrapper-close-icon')}>
        <Icon name="closeThin" className={bem('close-icon')} onClick={handleClose} />
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  reset: resetPassword,
};

export const ResetPassword = connect(null, mapDispatchToProps)(ResetPass);
