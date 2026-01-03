const Hero = () => {
  return (
    <section className="relative h-[70vh] md:h-screen flex items-center justify-center overflow-hidden">
      <img
        src="/Hotel1.jpg"
        alt="Luxury Resort"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative z-10 text-white text-center px-6 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to CheckInn
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Smart. Simple. Secure hotel bookings.
        </p>
      </div>
    </section>
  );
};

export default Hero;
