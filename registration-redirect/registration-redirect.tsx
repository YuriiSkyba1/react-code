import React from 'react';
import { connect } from 'react-redux';
import { Redirect, useRouteMatch } from 'react-router';
import { registerConfirmation } from 'src/actions';

interface IMatchParams {
  params: { token: string };
  path: string
}

const RedirectPage: React.FC<{confirm: (token: string) => void}> = ({confirm}) => {
  const match: IMatchParams = useRouteMatch();

  confirm(match.params.token)

  return <Redirect to="/main/our-products" />
};

const mapDispatchToProps = {
  confirm: registerConfirmation,
};

export const RegistrationRedirect = connect(null, mapDispatchToProps)(RedirectPage);