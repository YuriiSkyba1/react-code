import React from 'react';
import { useTranslation } from 'react-i18next';

import { Icon } from '../../general/icon';
import { bemPrefix } from '../../../utils/bem';

import './reset-password-success.scss';

const bem = bemPrefix('reset-password-success');

interface IMatchParams {
  params: { email: string };
}

interface IResetSuccessProps {
  match: IMatchParams;
  history: { push(url: string): void };
}

export const ResetPasswordSuccess: React.FC<IResetSuccessProps> = ({ match, history }) => {
  const [t] = useTranslation();
  const { email } = match.params;

  const handleRedirect = () => history.push('/auth');

  return (
    <div className={bem('main')}>
      <div className={bem('wrapper-center')}>
        <Icon name="logoGreenWhite" />
        <div className={bem('widget-wrapper')}>
          <div className={bem('box')}>
            <div className={bem('box-icon')}>
              <Icon name="success" />
            </div>
            <h2 className={bem('title')}>{t('Password was reset successfully')}</h2>
            <div className={bem('additional-text')}>
              {t('We have sent the new password to your email')}
              <p className={bem('mail')}>{email}</p>
            </div>
            <button className={bem('redirect-btn')} onClick={handleRedirect}>
              {t('Go to main page')}
            </button>
          </div>
        </div>
      </div>
      <Icon name="closeThin" className={bem('close-icon')} onClick={handleRedirect} />
    </div>
  );
};
