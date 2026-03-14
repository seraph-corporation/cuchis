import { defineType, defineField } from "sanity";

export default defineType({
    name: "bags",
    title: "Bags",
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
        // Specific fields for bags
        defineField({
            name: "material",
            title: "Material",
            type: "string",
        }),
        defineField({
            name: "dimensions",
            title: "Dimensions",
            type: "string",
            description: "e.g. 10x12x4 inches",
        }),
    ],
});
