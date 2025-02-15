const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-indigo-600 to-purple-600">
      <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin"></div>
      <h2 className="mt-4 text-2xl text-white font-semibold">Loading...</h2>
    </div>
  );
};

export default LoadingScreen;
