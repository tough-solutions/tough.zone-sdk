import { ApolloQueryResult, ApolloClient } from "@apollo/client/core";
import { ToughZone } from "../../src";
import { errors } from "../../src/errors";
import { warnings } from "../../src/warnings";
import * as graphQlClient from "../../src/graphql/graphQlClient";
import { auth } from "../../src/graphql/queries";

describe("Auth", () => {
    beforeEach(() => {
        process.env.TZ_API_KEY = "someApiKey";
        Reflect.set(ToughZone.Auth, "instance", undefined);
    });

    describe("static functions", () => {
        describe("init", () => {
            it("should create instance and set apiKey from env var", () => {
                expect(Reflect.get(ToughZone.Auth, "instance")).toBeUndefined();

                ToughZone.Auth.init();

                const instance = Reflect.get(ToughZone.Auth, "instance");
                expect(instance).toBeTruthy();
                expect(Reflect.get(instance, "apiKey")).toBe("someApiKey");
            });

            it("should override apiKey", () => {
                expect(process.env.TZ_API_KEY).toBe("someApiKey");

                ToughZone.Auth.init("anotherApiKey");

                const instance = Reflect.get(ToughZone.Auth, "instance");
                expect(instance).toBeTruthy();
                expect(Reflect.get(instance, "apiKey")).toBe("anotherApiKey");
            });

            it("should warn if no API key is configured", () => {
                delete process.env.TZ_API_KEY;
                const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

                ToughZone.Auth.init();

                expect(consoleSpy).toBeCalledWith(warnings.noApiKeyConfigured);
            });

            it("should delete token on subsequent calls with a different API key", () => {
                ToughZone.Auth.init();

                const instance = Reflect.get(ToughZone.Auth, "instance");
                Reflect.set(instance, "token", "someToken");

                ToughZone.Auth.init("someDifferentApiKey");

                expect(Reflect.get(instance, "token")).toBeUndefined();
            });

            it("should keep token on subsequent calls with equal API key", () => {
                ToughZone.Auth.init();

                const instance = Reflect.get(ToughZone.Auth, "instance");
                Reflect.set(instance, "token", "someToken");

                ToughZone.Auth.init();

                expect(Reflect.get(instance, "token")).toBe("someToken");
            });

            it("should throw if API key is not a string", () => {
                expect(() => ToughZone.Auth.init(4 as unknown as string)).toThrowError(
                    new Error(`"apiKey" must be a string`),
                );
            });
        });

        describe("getToken", () => {
            it("should throw if no API key is configured", () => {
                delete process.env.TZ_API_KEY;
                jest.spyOn(console, "warn").mockImplementation();

                ToughZone.Auth.init();

                const instance = Reflect.get(ToughZone.Auth, "instance");
                expect(Reflect.get(instance, "apiKey")).toBeUndefined();
                expect(ToughZone.Auth.getToken).toThrowError(new Error(errors.noApiKeyConfigured));
            });

            it("should resolve with token if one is set", async () => {
                ToughZone.Auth.init();
                Reflect.set(Reflect.get(ToughZone.Auth, "instance"), "token", "someToken");

                const graphQlQuerySpy = jest.spyOn(graphQlClient, "getGraphQlClient");

                await expect(ToughZone.Auth.getToken()).resolves.toBe("someToken");

                expect(graphQlQuerySpy).not.toBeCalled();
            });

            it("should authenticate with API if no token is set", async () => {
                ToughZone.Auth.init();

                const graphQlQuerySpy = jest.fn().mockResolvedValue({
                    data: {
                        auth: {
                            token: "someToken",
                        },
                    },
                } as ApolloQueryResult<any>);

                jest.spyOn(graphQlClient, "getGraphQlClient").mockReturnValue({
                    query: graphQlQuerySpy,
                } as unknown as ApolloClient<any>);

                await expect(ToughZone.Auth.getToken()).resolves.toBe("someToken");

                expect(graphQlQuerySpy).toBeCalledWith({
                    query: auth,
                    variables: {
                        apiKey: "someApiKey",
                    },
                });
            });

            it("should reject with GraphQL error", () => {
                ToughZone.Auth.init();

                jest.spyOn(graphQlClient, "getGraphQlClient").mockReturnValue({
                    query: jest.fn().mockResolvedValue({
                        error: {
                            message: "Something went wrong.",
                        },
                    } as ApolloQueryResult<any>),
                } as unknown as ApolloClient<any>);

                return expect(ToughZone.Auth.getToken()).rejects.toEqual(new Error("Something went wrong."));
            });

            it("should reject if no token returned", () => {
                ToughZone.Auth.init();

                jest.spyOn(graphQlClient, "getGraphQlClient").mockReturnValue({
                    query: jest.fn().mockResolvedValue({} as ApolloQueryResult<any>),
                } as unknown as ApolloClient<any>);

                return expect(ToughZone.Auth.getToken()).rejects.toEqual(new Error(errors.noTokenReturned));
            });
        });
    });
});
