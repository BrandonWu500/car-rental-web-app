/// <reference types="Cypress" />

describe('Trips', () => {
  beforeEach(() => {
    cy.resetDB();
    cy.seed();
  });

  // jane user has one reservation for civic

  it("should show the user's trips on the trips page", () => {
    cy.login('jane@test.com', '123456');

    cy.findByRole('button', { name: /user menu/i }).click();

    cy.findByText(/my trips/i).click();

    cy.url().should('include', '/trips');

    cy.findByRole('heading', { name: /civic/i }).should('exist');
    cy.findByRole('button', { name: /cancel reservation/i }).should('exist');
  });
});

export {};
