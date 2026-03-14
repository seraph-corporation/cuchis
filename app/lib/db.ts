
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
    private _carts: Cart[] = [];
    private _orders: Order[] = [];
    private _wishlist: WishlistItem[] = [];
    private _reviews: Review[] = [];

    // Cart
    cart = {
        findUnique: async ({ where, include }: any) => {
            const cart = this._carts.find((c) => c.userId === where.userId);
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
            this._carts.push(newCart);
            return newCart;
        },
    };

    cartItem = {
        create: async ({ data }: any) => {
            const cart = this._carts.find((c) => c.id === data.cartId);
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
            for (const cart of this._carts) {
                const item = cart.items.find((i) => i.id === where.id);
                if (item) {
                    if (data.quantity !== undefined) item.quantity = data.quantity;
                    return item;
                }
            }
            throw new Error("Item not found");
        },
        delete: async ({ where }: any) => {
            for (const cart of this._carts) {
                const index = cart.items.findIndex((i) => i.id === where.id);
                if (index !== -1) {
                    return cart.items.splice(index, 1)[0];
                }
            }
            throw new Error("Item not found");
        },
        deleteMany: async ({ where }: any = {}) => {
            if (where?.cartId) {
                const cart = this._carts.find((c) => c.id === where.cartId);
                if (cart) {
                    const count = cart.items.length;
                    cart.items = [];
                    return { count };
                }
            }
            return { count: 0 };
        }
    };

    // Order
    order = {
        findMany: async ({ where, include, orderBy, take }: any = {}) => {
            let result = this._orders;
            if (where?.userId) {
                result = result.filter((o) => o.userId === where.userId);
            }
            if (where?.status) {
                result = result.filter((o) => o.status === where.status);
            }
            return result;
        },
        create: async ({ data }: any) => {
            const newOrder: Order = {
                id: Math.random().toString(36).substring(7),
                userId: data.userId,
                total: data.total || 0,
                status: data.status || "processing",
                createdAt: new Date(),
                items: [],
                user: { email: "guest@example.com" }
            };
            this._orders.push(newOrder);
            return newOrder;
        },
        count: async ({ where }: any = {}) => {
            let result = this._orders;
            if (where?.status) {
                result = result.filter((o) => o.status === where.status);
            }
            return result.length;
        },
        aggregate: async ({ _sum }: any = {}) => {
            const total = this._orders.reduce((sum, o) => sum + o.total, 0);
            return { _sum: { total } };
        },
        update: async ({ where, data }: any) => {
            const order = this._orders.find(o => o.id === where.id);
            if (order) {
                if (data.status) order.status = data.status;
                return order;
            }
            throw new Error("Order not found");
        }
    };

    // Wishlist
    wishlist = {
        findMany: async ({ where }: any = {}) => {
            return this._wishlist.filter((w) => w.userId === where?.userId);
        },
        findFirst: async ({ where }: any) => {
            return this._wishlist.find(
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
            this._wishlist.push(newItem);
            return newItem;
        },
        delete: async ({ where }: any) => {
            const index = this._wishlist.findIndex((w) => w.id === where.id);
            if (index !== -1) {
                return this._wishlist.splice(index, 1)[0];
            }
            throw new Error("Item not found");
        },
    };

    // Review
    review = {
        findMany: async ({ where, include }: any = {}) => {
            return this._reviews.filter((r) => r.productId === where?.productId);
        },
        findFirst: async ({ where }: any) => {
            return this._reviews.find(
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
            this._reviews.push(newReview);
            return newReview;
        },
        update: async ({ where, data }: any) => {
            const review = this._reviews.find(r => r.id === where.id);
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
