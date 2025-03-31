import { notFound } from "next/navigation";

const vinylRecords = [
    { id: 1, title: "Abbey Road", artist: "The Beatles", price: 29.99, image: "https://via.placeholder.com/400", description: "A classic album from The Beatles, released in 1969." },
    { id: 2, title: "Dark Side of the Moon", artist: "Pink Floyd", price: 34.99, image: "https://via.placeholder.com/400", description: "One of the best-selling albums of all time, released in 1973." },
    { id: 3, title: "Rumours", artist: "Fleetwood Mac", price: 27.99, image: "https://via.placeholder.com/400", description: "Fleetwood Mac's legendary 1977 album, full of iconic tracks." },
];

export default function ProductPage({ params }: { params: { id: string } }) {
    const record = vinylRecords.find((r) => r.id === parseInt(params.id));

    if (!record) {
        return notFound(); // Shows 404 page if record not found
    }

    return (
        <main className="container mx-auto p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <img src={record.image} alt={record.title} className="w-64 h-64 object-cover rounded-md" />

                <div>
                    <h1 className="text-3xl font-bold">{record.title}</h1>
                    <p className="text-gray-500">{record.artist}</p>
                    <p className="mt-4 text-lg">{record.description}</p>
                    <p className="text-2xl font-bold mt-4">${record.price}</p>

                    <button className="mt-4 px-6 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600">
                        Add to Cart 🛒
                    </button>
                </div>
            </div>
        </main>
    );
}
