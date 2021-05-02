let userData;

describe('Should be able to login and do search operation', function () {

    before(function () {

        cy.clearCookies();

        // Handle any exceptions during ui tests
        Cypress.on("uncaught:exception", () => {
            return false;
        });

        // Load test data
        cy.fixture('userDetails').then((data) => {
            userData = data
        });
    });

    beforeEach(function () {

        cy.visit("/index.php");
        cy.title().should('eq', 'My Store');
        cy.get('.login').click().log("User clicked on Login button");

        cy.get('#email').type(`${userData.email}`);
        cy.get('#passwd').type(`${userData.password}`);
        cy.get('#SubmitLogin > span').click().log("User submit login details");
        cy.get('.logout').should('be.visible').log('user successfully logged in');
    });

    after(function () {

        cy.end();
    });

    it('should be able to login with valid login details and perform search product - Blouse', function () {

        let searchProductName = "Blouse";

        cy.get('#search_query_top').type(searchProductName).log("User search for product");
        cy.get("button[name='submit_search']").click().log("User clicked on search product option");

        // Validate 0 result has been found not display
        cy.get("span[class='heading-counter']").should("not.have.text", "0 results have been found");
        cy.get("div[class='top-pagination-content clearfix'] div[class='product-count']")
            .should("not.have.text", "0");
        cy.get(".product-container").should("be.visible")
            .log("At least one product has been displayed");
        // check 1st product name
        cy.get(".product-container").eq(0).find(".right-block > h5").contains(searchProductName)
            .log("At least one product has been displayed");
    });

    it('should be able to login with valid login details and perform search product with wrong item', function () {

        let searchProductName = "test";

        cy.get('#search_query_top').type(searchProductName).log("User search for product");
        cy.get("button[name='submit_search']").click().log("User clicked on search product option");

        // Validate alert banner
        cy.get("p[class='alert alert-warning']").should("be.visible").log("No results were found for your search warn has been displayed");
    });
});