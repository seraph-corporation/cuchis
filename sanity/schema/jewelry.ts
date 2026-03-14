import { defineType, defineField } from "sanity";

export default defineType({
    name: "jewelry",
    title: "Jewelry",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "price",
            title: "Price",
            type: "number",
            validation: (Rule) => Rule.required().positive(),
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
        }),
        defineField({
            name: "images",
            title: "Images",
            type: "array",
            of: [{ type: "image" }],
            validation: (Rule) => Rule.min(1),
        }),
        defineField({
            name: "inStock",
            title: "In Stock",
            type: "boolean",
            initialValue: true,
        }),
        defineField({
            name: "featured",
            title: "Featured",
            type: "boolean",
            initialValue: false,
        }),
        // Specific fields for jewelry
        defineField({
            name: "metalType",
            title: "Metal Type",
            type: "string",
            options: {
                list: ["Gold", "Silver", "Platinum", "Rose Gold", "Other"],
            },
        }),
        defineField({
            name: "gemstone",
            title: "Gemstone",
            type: "string",
        }),
    ],
    preview: {
        select: {
            title: "title",
            subtitle: "price",
            media: "images.0",
        },
    },
});
