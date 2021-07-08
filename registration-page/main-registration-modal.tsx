import React from 'react';
import { useTranslation } from 'react-i18next';
import PhoneInput from 'react-phone-input-2';

import { bemPrefix } from 'src/utils/bem';
import { ModalContent } from 'src/components/general/modal/modal-content';
import { Input } from 'src/components/general/input';
import { RegisterValuesState, RegisterErrorsState } from './registration-page';

import 'react-phone-input-2/lib/style.css';
import './main-registration-modal.scss';

const bem = bemPrefix('main-registration-modal');

interface MainRegistrationModalProps {
  modalState: RegisterValuesState;
  modalErrors: RegisterErrorsState;
  handleUserName: (value: string) => void;
  handleLastName: (value: string) => void;
  handlePatronymic: (value: string) => void;
  handleUserEmail: (value: string) => void;
  handlePhone: (value: string) => void;
  handleCountryCode: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

interface FieldInterface {
  label: string;
  value: string;
  type: string;
  placeholder: any;
  id?: string;
  textError?: string;
  hideText?: boolean;
  handler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isRequired: boolean;
}

export const MainRegistrationModal: React.FC<MainRegistrationModalProps> = ({
  modalState,
  modalErrors,
  handleUserName,
  handleLastName,
  handlePatronymic,
  handleUserEmail,
  handlePhone,
  handleCountryCode,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [t] = useTranslation();

  const fields: FieldInterface[] = [
    {
      id: 'userLastName',
      label: t('Last name'),
      value: modalState.userLastName,
      type: 'text',
      placeholder: 'Смирнов',
      textError: modalErrors.errorUserLastName,
      handler: (event: React.ChangeEvent<HTMLInputElement>) => handleLastName(event.target.value),
      isRequired: true,
    },
    {
      id: 'userName',
      label: t('Name'),
      value: modalState.userName,
      type: 'text',
      placeholder: 'Сергей',
      textError: modalErrors.errorUserName,
      handler: (event: React.ChangeEvent<HTMLInputElement>) => handleUserName(event.target.value),
      isRequired: true,
    },
    {
      id: 'userPatronymic',
      label: t('Patronymic'),
      value: modalState.userPatronymic,
      type: 'text',
      placeholder: 'Олегович',
      textError: '',
      handler: (event: React.ChangeEvent<HTMLInputElement>) => handlePatronymic(event.target.value),
      isRequired: false,
    },
    {
      id: 'userEmail',
      label: t('Email'),
      value: modalState.userEmail,
      type: 'text',
      placeholder: t('EmailExample'),
      textError: modalErrors.errorUserEmail,
      handler: (event: React.ChangeEvent<HTMLInputElement>) => handleUserEmail(event.target.value),
      isRequired: true,
    },
  ];

  const phoneHandler = (phone: string, country: any) => {
    handlePhone(phone);
    const countryCode: string = country && country.countryCode ? country.countryCode : '';
    modalState.userCountryCode !== countryCode && handleCountryCode(countryCode);
  };

  const footerText = `*- ${t('required fields')}`;
  const additionalFooterText = `${t('Step')} 1/2`;

  return (
    <div className={bem()}>
      <ModalContent
        className={bem('modal')}
        title={t('Registration')}
        onSuccess={onSubmit}
        okButtonName={t('Continue')}
        value=""
        close={onClose}
        footerText={footerText}
        additionalFooterText={additionalFooterText}
        isWaiting={isLoading}
      >
        {fields.map(({ id, label, value, type, placeholder, isRequired, handler, textError }) => (
          <div key={id}>
            <Input
              label={label}
              value={value}
              className={bem('input-container')}
              type={type}
              placeholder={placeholder}
              required={isRequired}
              id={id}
              onChange={handler}
              hasRequiredMark={isRequired}
              textError={t(textError)}
            />
          </div>
        ))}
        <div className={`${bem('phone-block')} ${modalErrors.errorUserPhone ? bem('phone-block--error') : ''}`}>
          <span className={bem('phone-block__title')}>{`${t('Phone')}*`}</span>
          <PhoneInput
            country="us"
            value={modalState.userPhone}
            onChange={(phone, country) => phoneHandler(phone, country)}
            countryCodeEditable={false}
          />
          {modalErrors.errorUserPhone && (
            <span className={bem('phone-block__error')}>{modalErrors.errorUserPhone}</span>
          )}
        </div>
      </ModalContent>
    </div>
  );
};
