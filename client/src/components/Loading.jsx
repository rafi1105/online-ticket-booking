const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <svg
            className="w-12 h-12 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
          </svg>
        </div>
        <p className="mt-6 text-xl font-semibold text-gray-700">Loading...</p>
        <p className="mt-2 text-gray-500">Please wait while we prepare your content</p>
      </div>
    </div>
  );
};

export default Loading;
