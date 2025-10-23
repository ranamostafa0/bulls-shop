export const calculateFinalPrice = (originalPrice, discountPercent = 0) => {
    const price = Number(originalPrice);
    const discount = Number(discountPercent) || 0;
    const finalPrice = price - (price * discount) / 100;
    return Number(finalPrice.toFixed(2)); // optional rounding
};
