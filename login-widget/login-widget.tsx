import React, { FormEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { FooterPage } from 'src/components/general/footer';
import { bemPrefix } from '../../../utils/bem';

import './login-widget.scss';

const bem = bemPrefix('login-widget');

interface LoginWidgetInterface {
  children: ReactNode;
  handleSubmit: (event: FormEvent) => void;
  submitString: string | JSX.Element;
  isOnLogin?: boolean;
  isOnRegister?: boolean;
  hasFooter?: boolean;
}

export const LoginWidget: React.FC<LoginWidgetInterface> = ({
  children,
  handleSubmit,
  submitString,
  isOnLogin = false,
  isOnRegister = false,
  hasFooter = false,
}) => {
  const [t] = useTranslation();

  return (
    <div className={bem('wrapper')}>
      <form className={bem('form')} onSubmit={handleSubmit}>
        <div className={bem('general-block')}>
          {children}
          <div className={bem('buttons')}>
            <button className={bem('submit')} type="submit">
              {submitString}
            </button>
            {isOnLogin && (
              <Link className={bem('link')} to="/auth/reset-password">
                {t('Forgot Password')}
              </Link>
            )}
          </div>
          {hasFooter && <FooterPage isLegalLinks={false} className="footer-section" />}
        </div>
        {isOnRegister && (
          <div className={bem('additional-text')}>
            {t('By clicking Registrate you accept the next')}
            <Link className={bem('link')} to="/main/our-products">
              {t('Terms of use')}
            </Link>
            .
          </div>
        )}
      </form>
    </div>
  );
};
