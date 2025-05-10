const Home = () => {
  return (
    <div className="w-screen h-screen p-20 bg-gray-200 grid grid-cols-2 items-center pointer-events-none gap-16">
      <h1 className="text-7xl! font-bold text-shadow-lg text-shadow-white uppercase drop-shadow-2xl flex flex-col gap-8">
        <span className="block text-left">Multi Tabs</span>
        <span className="block text-right">by F1GENZ</span>
      </h1>
      <img
        className="max-w-150 rounded-2xl border border-white drop-shadow-2xl"
        loading="eager"
        decoding="sync"
        fetchPriority="high"
        src="/welcome.jpg"
        alt="Welcome to Collection Tabs"
      />
    </div>
  );
};

export default Home;
