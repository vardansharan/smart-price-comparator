const products = [
  { name: "Headphone A", price: 50, rating: 4.5, reviews: 120 },
  { name: "Headphone B", price: 40, rating: 4.0, reviews: 300 },
  { name: "Headphone C", price: 60, rating: 4.8, reviews: 80 },
  { name: "iPhone 14", price: 900, rating: 4.7, reviews: 2000 },
  { name: "Samsung S23", price: 850, rating: 4.6, reviews: 1800 }
];

function searchProducts(query, maxPrice) {
  let filtered = products;

  if (query) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= maxPrice);
  }

  const result = filtered.map(p => ({
    ...p,
    valueScore: (p.rating * Math.log(p.reviews + 1)) / p.price
  }));

  return result.sort((a, b) => b.valueScore - a.valueScore);
}

module.exports = { searchProducts };