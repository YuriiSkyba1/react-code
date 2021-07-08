import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ConfirmationModal } from 'src/components/general/confirmation-modal';
import { LandingFormWrapper } from 'src/components/general/landing-form-wrapper';
import { Spinner } from 'src/components/general/spinner';
import { State } from 'src/reducers';
import { bemPrefix } from 'src/utils/bem';

const bem = bemPrefix('registration-confirmation');

interface IMatchParams {
  params: { email: string };
}

interface RegistrationConfirmationProps {
  history: { push(url: string): void };
  match: IMatchParams;
  isLoading: boolean
}

export const RegistrationConfirmation: React.FC<RegistrationConfirmationProps> = ({history, match, isLoading}) => {
  const [t] = useTranslation();
  const { email } = match.params;

  const redirectToLoginPage = () => history.push('/auth');

  return (
    <>
      { 
        isLoading 
          ? <Spinner /> 
          : (
            <LandingFormWrapper onClick={redirectToLoginPage} widgetWrapperClass={bem('widget-wrapper')}>
              <ConfirmationModal
                onClick={redirectToLoginPage}
                buttonName={t('Go to main page')}
                closeModal={redirectToLoginPage}
                title={t('Registration successful')}
                subtitle={`${t('We have sent the entrance link to your email')} ${email}`}
              />
            </LandingFormWrapper>
          )
      }
    </>
  );
};

const mapStateToProps = (state: State) => ({ isLoading: state.user.isLoading });

export const RegistrationConfirmationPage = connect(mapStateToProps)(RegistrationConfirmation);