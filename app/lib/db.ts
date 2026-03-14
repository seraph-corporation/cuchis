
// Mock In-Memory Database to replace Prisma
// This is non-persistent and will reset on server restart.

type CartItem = {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    variant?: string | null;
    createdAt: Date;
};

type Cart = {
    id: string;
    userId: string;
    items: CartItem[];
    createdAt: Date;
};

type OrderItem = {
    id: string;
    orderId: string;
    title: string;
    quantity: number;
    price: number;
    productId: string;
};

type Order = {
    id: string;
    userId: string;
    total: number;
    status: string;
    createdAt: Date;
    items: OrderItem[];
    user: { email: string };
};

type WishlistItem = {
    id: string;
    userId: string;
    productId: string;
    createdAt: Date;
};

type Review = {
    id: string;
    userId: string;
    productId: string;
    rating: number;
    title?: string | null;
    comment?: string | null;
    createdAt: Date;
    user: { name: string; email: string };
};

class MockDB {
    private carts: Cart[] = [];
    private orders: Order[] = [];
    private wishlist: WishlistItem[] = [];
    private reviews: Review[] = [];

    // Cart
    cart = {
        findUnique: async ({ where, include }: any) => {
            const cart = this.carts.find((c) => c.userId === where.userId);
            if (!cart) return null;
            return cart;
        },
        create: async ({ data, include }: any) => {
            const newCart: Cart = {
                id: Math.random().toString(36).substring(7),
                userId: data.userId,
                items: [],
                createdAt: new Date(),
            };
            this.carts.push(newCart);
            return newCart;
        },
    };

    cartItem = {
        create: async ({ data }: any) => {
            const cart = this.carts.find((c) => c.id === data.cartId);
            if (cart) {
                const newItem: CartItem = {
                    id: Math.random().toString(36).substring(7),
                    cartId: data.cartId,
                    productId: data.productId,
                    quantity: data.quantity,
                    variant: data.variant,
                    createdAt: new Date(),
                };
                cart.items.push(newItem);
                return newItem;
            }
            throw new Error("Cart not found");
        },
        update: async ({ where, data }: any) => {
            for (const cart of this.carts) {
                const item = cart.items.find((i) => i.id === where.id);
                if (item) {
                    if (data.quantity !== undefined) item.quantity = data.quantity;
                    return item;
                }
            }
            throw new Error("Item not found");
        },
        delete: async ({ where }: any) => {
            for (const cart of this.carts) {
                const index = cart.items.findIndex((i) => i.id === where.id);
                if (index !== -1) {
                    return cart.items.splice(index, 1)[0];
                }
            }
            throw new Error("Item not found");
        },
    };

    // Order
    order = {
        findMany: async ({ where, include, orderBy, take }: any) => {
            let result = this.orders;
            if (where?.userId) {
                result = result.filter((o) => o.userId === where.userId);
            }
            if (where?.status) {
                result = result.filter((o) => o.status === where.status);
            }
            // Mock sorting/limiting if needed, effectively return all for now
            return result;
        },
        create: async ({ data }: any) => {
            // Implementation for creating order would go here if we were processing checkout fully
            // For now, checkout route doesn't seem to create order in DB (it calls Stripe), 
            // but maybe webhook does? We don't have webhook route read yet. 
            // Assuming simplistic usage for now.
            return {};
        },
        count: async ({ where }: any) => {
            let result = this.orders;
            if (where?.status) {
                result = result.filter((o) => o.status === where.status);
            }
            return result.length;
        },
        aggregate: async ({ _sum }: any) => {
            const total = this.orders.reduce((sum, o) => sum + o.total, 0);
            return { _sum: { total } };
        },
        update: async ({ where, data }: any) => {
            const order = this.orders.find(o => o.id === where.id);
            if (order) {
                if (data.status) order.status = data.status;
                return order;
            }
            throw new Error("Order not found");
        }
    };

    // Wishlist
    wishlist = {
        findMany: async ({ where }: any) => {
            return this.wishlist.filter((w) => w.userId === where.userId);
        },
        findFirst: async ({ where }: any) => {
            return this.wishlist.find(
                (w) => w.userId === where.userId && w.productId === where.productId
            );
        },
        create: async ({ data }: any) => {
            const newItem: WishlistItem = {
                id: Math.random().toString(36).substring(7),
                userId: data.userId,
                productId: data.productId,
                createdAt: new Date(),
            };
            this.wishlist.push(newItem);
            return newItem;
        },
        delete: async ({ where }: any) => {
            const index = this.wishlist.findIndex((w) => w.id === where.id);
            if (index !== -1) {
                return this.wishlist.splice(index, 1)[0];
            }
            throw new Error("Item not found");
        },
    };

    // Review
    review = {
        findMany: async ({ where, include }: any) => {
            return this.reviews.filter((r) => r.productId === where.productId);
        },
        findFirst: async ({ where }: any) => {
            return this.reviews.find(
                (r) => r.userId === where.userId && r.productId === where.productId
            );
        },
        create: async ({ data }: any) => {
            const newReview: Review = {
                id: Math.random().toString(36).substring(7),
                userId: data.userId,
                productId: data.productId,
                rating: data.rating,
                title: data.title,
                comment: data.comment,
                createdAt: new Date(),
                user: { name: "Guest User", email: "guest@example.com" }, // Mock user
            };
            this.reviews.push(newReview);
            return newReview;
        },
        update: async ({ where, data }: any) => {
            const review = this.reviews.find(r => r.id === where.id);
            if (review) {
                if (data.rating) review.rating = data.rating;
                if (data.title !== undefined) review.title = data.title;
                if (data.comment !== undefined) review.comment = data.comment;
                return review;
            }
            throw new Error("Review not found");
        }
    };
}

export const db = new MockDB();
