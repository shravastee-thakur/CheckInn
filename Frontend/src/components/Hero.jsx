import Book from "./Book";
import SearchForm from "./SearchForm";

const Hero = () => {
  return (
    <section>
      <div className="w-full">
        <img
          src="/Hotel1.jpg"
          alt="Background"
          className="w-full h-auto object-cover"
        />
      </div>
      <SearchForm />
    </section>
  );
};

export default Hero;
