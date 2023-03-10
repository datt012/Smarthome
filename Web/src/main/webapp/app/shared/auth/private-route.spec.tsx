import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';

import { AUTHORITIES } from 'app/config/constants';
import { PrivateRouteComponent, hasAnyAuthority } from './private-route';

const TestComp = () => <div>Test</div>;

describe('private-route component', () => {
  // All tests will go here
  it('Should throw error when no component is provided', () => {
    const originalError = console.error;
    console.error = jest.fn();
    expect(() => render(<PrivateRouteComponent component={null} isAuthenticated sessionHasBeenFetched isAuthorized path="/" />)).toThrow(
      Error
    );
    console.error = originalError;
  });

  it('Should render an error message when the user has no authorities', () => {
    const history: any = createMemoryHistory();
    const { container } = render(
      <Router history={history}>
        <PrivateRouteComponent component={TestComp} isAuthenticated sessionHasBeenFetched isAuthorized={false} path="/" />
      </Router>
    );
    expect(container.innerHTML).toEqual(
      '<div class="insufficient-authority"><div class="alert alert-danger">You are not authorized to access this page.</div></div>'
    );
  });

  it('Should render a route for the component provided when authenticated', () => {
    const history: any = createMemoryHistory();
    const { container } = render(
      <Router history={history}>
        <PrivateRouteComponent component={TestComp} isAuthenticated sessionHasBeenFetched isAuthorized path="/" />
      </Router>
    );
    expect(container.innerHTML).toEqual('<div>Test</div>');
  });

  it('Should render a redirect to login when not authenticated', () => {
    const history: any = createMemoryHistory();
    const { container } = render(
      <Router history={history}>
        <PrivateRouteComponent exact component={TestComp} isAuthenticated={false} sessionHasBeenFetched isAuthorized path="/" />
      </Router>
    );
    expect(container.innerHTML).not.toEqual('<div>Test</div>');
  });
});

describe('hasAnyAuthority', () => {
  // All tests will go here
  it('Should return false when authorities is invalid', () => {
    expect(hasAnyAuthority(undefined, undefined)).toEqual(false);
    expect(hasAnyAuthority(null, [])).toEqual(false);
    expect(hasAnyAuthority([], [])).toEqual(false);
    expect(hasAnyAuthority([], [AUTHORITIES.USER])).toEqual(false);
  });

  it('Should return true when authorities is valid and hasAnyAuthorities is empty', () => {
    expect(hasAnyAuthority([AUTHORITIES.USER], [])).toEqual(true);
  });

  it('Should return true when authorities is valid and hasAnyAuthorities contains an authority', () => {
    expect(hasAnyAuthority([AUTHORITIES.USER], [AUTHORITIES.USER])).toEqual(true);
    expect(hasAnyAuthority([AUTHORITIES.USER, AUTHORITIES.ADMIN], [AUTHORITIES.USER])).toEqual(true);
    expect(hasAnyAuthority([AUTHORITIES.USER, AUTHORITIES.ADMIN], [AUTHORITIES.USER, AUTHORITIES.ADMIN])).toEqual(true);
    expect(hasAnyAuthority([AUTHORITIES.USER, AUTHORITIES.ADMIN], [AUTHORITIES.USER, 'ROLEADMIN'])).toEqual(true);
    expect(hasAnyAuthority([AUTHORITIES.USER, AUTHORITIES.ADMIN], [AUTHORITIES.ADMIN])).toEqual(true);
  });

  it('Should return false when authorities is valid and hasAnyAuthorities does not contain an authority', () => {
    expect(hasAnyAuthority([AUTHORITIES.USER], [AUTHORITIES.ADMIN])).toEqual(false);
    expect(hasAnyAuthority([AUTHORITIES.USER, AUTHORITIES.ADMIN], ['ROLE_USERSS'])).toEqual(false);
    expect(hasAnyAuthority([AUTHORITIES.USER, AUTHORITIES.ADMIN], ['ROLEUSER', 'ROLEADMIN'])).toEqual(false);
  });
});
