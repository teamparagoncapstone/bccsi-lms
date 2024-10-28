// unauthorized.tsx

const UnauthorizedPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-black mb-2">Access Denied</h1>
                <p className="text-lg text-gray-700">You do not have the necessary permissions to view this content.</p>
                <p className="text-sm text-gray-500 mt-4">If you believe this is an error, please contact support.</p>
            </div>
        </div>
    );
};

export default UnauthorizedPage;