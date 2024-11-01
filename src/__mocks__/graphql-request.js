// src/__mocks__/graphql-request.js
export class GraphQLClient {
    request() {
        return Promise.resolve({
            login: { message: "Login successful!", user: { email: "test@example.com" }, token: "test-token" },
        });
    }
}
export const gql = (query) => query;
