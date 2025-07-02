# Display All Salesforce Objects LWC

## Requirement

**Goal:**
Create a Lightning Web Component (LWC) named `displayObjects` that displays a list of all objects (Standard and Custom) present in the current Salesforce org.

**Details:**

- The component should fetch and display the API names and labels of all objects available in the org.
- The list should be presented in a user-friendly format (e.g., table or list) in the component's UI.
- The component should handle errors gracefully (e.g., display a message if objects cannot be fetched).
- The solution should be compatible with Salesforce Lightning Experience.
- The component should be easily reusable and maintainable.

**Acceptance Criteria:**

- On loading the component, all objects in the org are displayed with their API names and labels.
- The user can sort the list by clicking on the column headers (Label or API Name).
- The user can filter the list by entering text, which matches any column.
- The component does not require any manual configuration after deployment.
- Proper error handling and user feedback are implemented.

## Solution Approach

1. **Backend (Apex):**
   - Create an Apex class annotated with `@AuraEnabled` to fetch all SObject types using `Schema.getGlobalDescribe()`.
   - The Apex method will return a list of objects, each containing the API name and label.
   - Handle exceptions and return meaningful error messages if the describe call fails.

2. **Frontend (LWC):**
   - Use the `@wire` adapter to call the Apex method and retrieve the list of objects.
   - Store the result in a tracked property and render it in the component's template.
   - Display the objects in a table, showing both API name and label.
   - Provide sorting on both columns (API Name and Label) by clicking the column headers.
   - Provide a text filter input that filters the list by matching the filter text in any column.
   - Show a loading indicator while data is being fetched.
   - Display an error message if the Apex call fails.

3. **Testing:**
   - Write Jest tests for the LWC to verify correct rendering, loading state, and error handling.
   - Write Apex test methods to ensure the backend logic works as expected.

4. **Documentation:**
   - Document the component's usage, deployment steps, and any configuration required (if any).

---

**Next Steps:**

- Implement the Apex backend to fetch all objects.
- Update the LWC JavaScript and HTML to display the objects.
- Add error handling and tests.

*Paused for user review before proceeding with implementation.*
