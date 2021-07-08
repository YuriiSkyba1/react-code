import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CryptoJS from 'crypto-js';

import { ENCRYPT_IV, ENCRYPT_KEY } from 'src/utils/helpers/constants';
import { LoginUserPayload } from 'src/utils/types';
import { loginUser } from 'src/actions';
import { bemPrefix } from 'src/utils/bem';
import { Input } from '../../general/input';
import { LoginWidget } from '../login-widget';

import './login-form.scss';

const bem = bemPrefix('login-form');

interface LoginComponentProps {
  onLogin: (payload: LoginUserPayload) => void;
}

interface LoginState {
  email: string;
  userPassword: string;
}

const INITIAL_STATE: LoginState = {
  email: '',
  userPassword: '',
};

const LoginComponent: React.FC<LoginComponentProps> = ({ onLogin }) => {
  const [t] = useTranslation();

  const [{ email, userPassword }, setInputValue] = useState(INITIAL_STATE);

  const clearState = (): void => {
    setInputValue({ ...INITIAL_STATE });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !userPassword) return;

    const key = CryptoJS.enc.Hex.parse(ENCRYPT_KEY);
    const iv = CryptoJS.enc.Hex.parse(ENCRYPT_IV);
    const encryptedPass = CryptoJS.AES.encrypt(userPassword, key, { iv });

    onLogin({ email, password: encryptedPass.toString() });

    clearState();
  };

  return (
    <LoginWidget handleSubmit={handleSubmit} submitString={t('Login')} isOnLogin={true}>
      <h2 className={bem('title')}>{t('Log in to your account')}</h2>
      <p className={bem('subtitle')}>
        {`${t('Do not have an account')}? `}
        <Link className={bem('link')} to="/auth/register">
          {t('Registration is here')}
        </Link>
      </p>
      <Input
        name="email"
        label={t('Email')}
        value={email}
        className={bem('input')}
        type="text"
        placeholder={t('EmailExample')}
        required={true}
        id="userName"
        onChange={handleInput}
      />
      <Input
        name="userPassword"
        label={t('Password')}
        value={userPassword}
        className={bem('input')}
        type="password"
        placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
        required={true}
        id="password"
        onChange={handleInput}
      />
    </LoginWidget>
  );
};

const mapDispatchToProps = {
  onLogin: loginUser,
};

export const LoginForm = connect(null, mapDispatchToProps)(LoginComponent);
