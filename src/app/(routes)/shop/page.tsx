import Link from "next/link";

const vinylRecords = [
    { id: 1, title: "Abbey Road", artist: "The Beatles", price: 29.99, image: "https://via.placeholder.com/200" },
    { id: 2, title: "Dark Side of the Moon", artist: "Pink Floyd", price: 34.99, image: "https://via.placeholder.com/200" },
    { id: 3, title: "Rumours", artist: "Fleetwood Mac", price: 27.99, image: "https://via.placeholder.com/200" },
];

export default function ShopPage() {
    return (
        <main className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">🎵 Shop Vinyl Records</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {vinylRecords.map((record) => (
                    <Link key={record.id} href={`/shop/${record.id}`} className="bg-white shadow-md p-4 rounded-lg hover:shadow-xl transition">
                        <img src={record.image} alt={record.title} className="w-full h-48 object-cover rounded-md" />
                        <h2 className="mt-2 text-xl font-semibold">{record.title}</h2>
                        <p className="text-gray-500">{record.artist}</p>
                        <p className="text-lg font-bold mt-2">${record.price}</p>
                    </Link>
                ))}
            </div>
        </main>
    );
}
