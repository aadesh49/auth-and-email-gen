interface ProfilePageProps {
    params: {
        id: string;
    };
}

export default function ProfilePage({ params }: ProfilePageProps) {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold text-amber-400">User Profile</h1>
                <p className="text-lg text-gray-300 mt-2">User ID: <span className="font-medium text-white">{params.id}</span></p>
            </div>
        </div>
    );
}
