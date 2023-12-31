import { ApolloLink, createHttpLink as createLink } from "@apollo/client/core";
import fetch from "cross-fetch";

export const createHttpLink = (): ApolloLink =>
    createLink({
        uri: process.env.TZ_API_URI || "https://api.tough.zone/graphql",
        fetch,
    });
