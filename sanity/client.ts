import { createClient } from "next-sanity";

export const client = createClient({
    projectId: "p8o637q1",
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: true,
});