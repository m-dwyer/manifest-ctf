describe("login", () => {
  it("should error on invalid login", () => {
    cy.visit("http://localhost:3000/login");

    cy.get('input[name="email"]').type("john@doesnotexist.com");
    cy.get('input[name="password"]').type("MyPassw0rd");
    cy.get('button[type="submit"]').click();

    cy.get('div[data-testid="login-error"]').should(
      "have.text",
      "Invalid login credentials"
    );
  });
});
