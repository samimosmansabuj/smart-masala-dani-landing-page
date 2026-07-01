// ==================================================================================================
// *********//////////====Facebook Pixel and Event Tracking Function=====/////////////***************
window.dataLayer = window.dataLayer || [];

// View Item
function GAViewItemEvent(product) {
    if (!product) return;
    dataLayer.push({
        event: "view_item",
        ecommerce: {
            currency: "BDT",
            value: Number(product.discount_price),
            items: [
                {
                    item_id: String(product.id),
                    item_name: product.name,
                    price: Number(product.discount_price),
                    quantity: 1
                }
            ]
        }
    });
}

// Add To Cart
function GAAddToCartEvent(product) {
    if (!product) return;
    dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
            currency: "BDT",
            value: Number(product.discount_price),
            items: [
                {
                    item_id: String(product.id),
                    item_name: product.name,
                    price: Number(product.discount_price),
                    quantity: 1
                }
            ]
        }
    });
}

// Begin Checkout
function GAInitiateCheckoutEvent(products, total) {
    if (!products || !products.length) return;
    dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
            currency: "BDT",
            value: Number(total),
            items: products.map(product => ({
                item_id: String(product.id),
                item_name: product.name,
                price: Number(product.price),
                quantity: Number(product.quantity)
            }))
        }
    });
}

// Purchase
function GAInitiatePurchaseEvent(products, total) {
    if (!products || !products.length) return;
    dataLayer.push({
        event: "purchase",
        ecommerce: {
            transaction_id: Date.now().toString(),
            currency: "BDT",
            value: Number(total),
            items: products.map(product => ({
                item_id: String(product.id),
                item_name: product.name,
                price: Number(product.price),
                quantity: Number(product.quantity)
            }))
        }
    });
}

// *********//////////=========================/////////////***************
// =========================================================================