
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


class MockDB {
    private _carts: Cart[] = [];

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

    // Order - Removed
    // Wishlist - Removed
    // Review - Removed
}

export const db = new MockDB();
