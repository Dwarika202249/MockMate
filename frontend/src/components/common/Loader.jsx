const Loader = () => {
  return (
      <div className="flex space-x-2 animate-pulse">
        <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
        <div className="w-8 h-8 bg-green-500 rounded-full"></div>
        <div className="w-8 h-8 bg-red-500 rounded-full"></div>
      </div>
  );
};

export default Loader;
