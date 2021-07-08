import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import CryptoJS from 'crypto-js';

import { ENCRYPT_IV, ENCRYPT_KEY } from 'src/utils/helpers/constants';
import { Input } from 'src/components/general/input';
import { validatePassword } from 'src/utils/helpers/validators';
import { ResetPassConfirmPayload } from 'src/utils/types';
import { resetPasswordConfirmation } from 'src/actions';
import { bemPrefix } from 'src/utils/bem';
import { Icon } from '../../general/icon';
import { LoginWidget } from '../login-widget';

import './reset-password-confirmation.scss';

const bem = bemPrefix('reset-password-confirmation');

interface IMatchParams {
  params: { token: string };
}

interface IResetPassProps {
  submitReset: (payload: ResetPassConfirmPayload, token: string) => Promise<any>;
  history: { push(url: string): void };
  match: IMatchParams;
}

const ResetPass: React.FC<IResetPassProps> = ({ history, submitReset, match }) => {
  const [t] = useTranslation();
  const { token } = match.params;

  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleClose = () => history.push('/auth');

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (passwordError) {
      setPasswordError('');
    }

    event.target.name === 'password' ? setPassword(event.target.value) : setPasswordConfirm(event.target.value);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    const key = CryptoJS.enc.Hex.parse(ENCRYPT_KEY);
    const iv = CryptoJS.enc.Hex.parse(ENCRYPT_IV);
    const encryptedPass = CryptoJS.AES.encrypt(password, key, { iv }).toString();

    const payload = {
      password: encryptedPass,
      password_confirmation: encryptedPass,
    };

    submitReset(payload, token).then((error?: string) => {
      setIsLoading(false);
      if (error) {
        return;
      }

      history.push('/auth');
    });
  };

  const handleValidation = (event: React.FormEvent<Element>) => {
    event.preventDefault();
    let newError = '';

    if (!validatePassword(passwordConfirm)) {
      newError = t('Password should be at least 8 symbols, contain all cases letters and number');
    }

    if (password !== passwordConfirm) {
      newError = t('Passwords should be identical');
    }

    if (newError) {
      setPasswordError(newError);
      return;
    }

    handleSubmit();
  };

  const inputField = useMemo(
    () => [
      {
        label: t('New password'),
        value: password,
        name: 'password',
      },
      {
        label: t('Repeat password'),
        value: passwordConfirm,
        name: 'passwordConfirm',
      },
    ],
    [password, passwordConfirm]
  );

  const getSubmitLabel = () => (isLoading ? <Icon name="animatedSpinner" /> : t('Send'));

  return (
    <div className={bem()}>
      <div className={bem('wrapper-center')}>
        <Icon name="logoGreenWhite" />
        <div className={bem('widget-wrapper')}>
          <LoginWidget handleSubmit={(e) => handleValidation(e)} submitString={getSubmitLabel()}>
            <h2 className={bem('title')}>{t('Create new password')}</h2>
            {inputField.map(({ label, value, name }) => (
              <Input
                key={`${name}-${label}`}
                type="password"
                name={name}
                label={t(label)}
                value={value}
                onChange={handlePassword}
              />
            ))}
            <div className={passwordError ? bem('error-text--shown') : bem('error-text--hidden')}>{passwordError}</div>
          </LoginWidget>
        </div>
      </div>
      <Icon name="closeThin" className={bem('close-icon')} onClick={handleClose} />
    </div>
  );
};

const mapDispatchToProps = {
  submitReset: resetPasswordConfirmation,
};

export const ResetPassConfirmationPage = connect(null, mapDispatchToProps)(ResetPass);
