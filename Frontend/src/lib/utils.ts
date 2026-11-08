export function formatPrice(price: number) {
    return `PKR ${new Intl.NumberFormat('en-PK', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price)}`
}
