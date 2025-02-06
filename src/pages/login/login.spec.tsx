// LoginPage.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LoginPage from './Login'; // Correctly import the component

describe('LoginPage test', () => {
  it('renders the LoginPage component', () => {
    render(<LoginPage />);
    // get by thorws error
    //find by--> async
    // query by --> return null
    expect(screen.getByText("Sign in"));
    expect(screen.getByPlaceholderText("username"));
    expect(screen.getByPlaceholderText("password"));
    expect(screen.getByRole("button",{name:"Log in"}));
    expect(screen.getByRole("checkbox",{name:"Remember me"}));
    expect(screen.getByText("Forgot password"));

  });
});
