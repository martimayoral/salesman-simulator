export function getSmallDateId() {
    const date = Date.now().toString()
    return date.slice(date.length - 5, date.length - 1)
}

export function getRandomId() {
    return (Math.random() * 1000000000).toFixed(0).padStart(10, '0')
}