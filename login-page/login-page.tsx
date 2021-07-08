import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { FooterPage } from 'src/components/general/footer';
import { State } from 'src/reducers';
import { bemPrefix } from 'src/utils/bem';
import Logo from 'src/images/image-logo-green.png';
import BgImage from 'src/images/image-login-bg.png';
import { clearRedirectPath } from 'src/utils/helpers/helpers';
import { LoginForm } from '../login-form';

import './login-page.scss';

const bem = bemPrefix('login-page');

interface NavInterface {
  isLink: boolean;
  redirect?: string;
  label: string;
}

interface LoginPageProps {
  history: { push(url: string): void };
  loggedIn: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ history, loggedIn }) => {
  const [t] = useTranslation();

  useEffect(() => {
    if (loggedIn) {
      const redirectPath = localStorage.getItem('redirectPath');
      history.push(`${redirectPath || '/main/our-products'}`);
      clearRedirectPath();
    }
  }, [loggedIn]);

  const navBar: NavInterface[] = [
    {
      isLink: true,
      redirect: '/blog',
      label: t('Blog'),
    },
    {
      isLink: true,
      redirect: '/',
      label: t('School'),
    },
    {
      isLink: true,
      redirect: 'auth/contact-us/',
      label: t('Contacts'),
    },
    {
      isLink: false,
      label: t('ENG'),
    },
  ];

  return (
    <div className={bem()}>
      <div className={bem('wrapper')}>
        <img src={BgImage} alt="logo" className={bem('image-bg')} />
        <div className={bem('left')}>
          <div className={bem('container')}>
            <div className="logo">
              <a href="/">
                <img src={Logo} alt="logo" width="120" height="47" />
              </a>
            </div>
            <div className={bem('headings')}>
              <h2 className={bem('heading')}>PROFERMER</h2>
              <p className={bem('subheading')}>{t('Hi-Tech agriculture')}</p>
            </div>
          </div>
        </div>
        <div className={bem('right')}>
          <div className={bem('container')}>
            <nav className={bem('nav')}>
              <ul className={bem('nav__list')}>
                {navBar.map(({ isLink, redirect, label }) => (
                  <li key={label}>{isLink ? <Link to={redirect || '/'}>{label}</Link> : <span>{label}</span>}</li>
                ))}
              </ul>
            </nav>
            <LoginForm />
            {/* Placeholder div to center elements in flexbox */}
            <div />
            {/* Placeholder ends here */}
          </div>
        </div>
      </div>
      <FooterPage isContacts={false} />
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  loggedIn: state.user.isLoggedIn,
});

export const LoginPageContainer = connect(mapStateToProps)(LoginPage);
