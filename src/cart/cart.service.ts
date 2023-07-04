import { randomUUID } from 'node:crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cache } from 'cache-manager';
import { Product } from 'src/shared/models/product.model';
import { ProductPrice } from 'src/shared/models/product-price.model';
import { ProductImage } from 'src/shared/models/product-image.model';

@Injectable()
export class CartService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        @InjectModel(Product) private readonly productModel: typeof Product
    ) { }

    async get(sessionCart: string) {
        const session: any = await this.cacheManager.get(sessionCart);
        const products = [];
        if (session) {
            for await (const cartItem of session.items) {
                const product = await this.productModel.findOne({
                    where: {
                        id: cartItem.product_id,
                        '$prices.id$': cartItem.price_id,
                    },
                    include: [{
                        model: ProductPrice,
                    }, {
                        model: ProductImage,
                        required: false,
                        order: [['path_src', 'ASC']],
                    }],
                    attributes: ['id', 'name', 'sku', 'type']
                });
                const { prices: [{ amount, rent_billing_mode }], ...productData } = product.toJSON();
                products.push({
                    product: {
                        ...productData,
                        price_selected: { amount, rent_billing_mode },
                        photo: productData.photos[0].path_src
                    },
                    cart_id: cartItem.cart_id,
                    quantity: cartItem.quantity
                });
            }
        }
        return session ? {
            ...session,
            items: products
        } : {};
    }

    async append(sessionCart: string, item: any) {
        const session: any = await this.cacheManager.get(sessionCart);
        const items = [].concat(session?.items || []);
        const cart_id = randomUUID();

        // const filterItem = items.filter(_item => _item.product_id === item.product_id);
        // if (filterItem.length > 0) {
        //     for (const rmItem of filterItem) {
        //         items.splice(filterItem.indexOf(rmItem), filterItem.length);
        //     }
        // }

        for (const itm of items) {
            if (itm.product_id === item.product_id) {
                items.splice(items.indexOf(itm), 1);
            }
        }

        items.push({
            ...item,
            cart_id,
            quantity: 1,
        });

        const cart = {
            items,
            created_at: Date.now()
        };

        await this.cacheManager.set(sessionCart, cart);

        return cart;
    }

    async increaseItem(sessionCart: string, item: any) {
        const items = [];
        const session: any = await this.cacheManager.get(sessionCart);
        if (Array.isArray(session?.items)) {
            const itemUpdated = session?.items.map((cartItem: any) => {
                if (cartItem.product_id === item.product.id) {
                    cartItem.quantity = item.quantity;
                }
                return cartItem;
            });

            items.push(...itemUpdated);
        }

        const cart = {
            items,
            created_at: Date.now()
        };

        await this.cacheManager.set(sessionCart, cart);

        return cart;
    }

    async remove(sessionCart: string, item: any) {
        const session: any = await this.cacheManager.get(sessionCart);
        const items = [].concat(session?.items || []);
        const index = items.findIndex(_item => _item.cart_id === item.cart_id);
        if (index > -1) {
            items.splice(index, 1);
        }

        const cart = {
            items,
            created_at: Date.now()
        };

        await this.cacheManager.set(sessionCart, cart);

        return cart;
    }
}
