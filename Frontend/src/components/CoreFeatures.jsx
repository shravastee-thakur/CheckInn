import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import QueryBuilderOutlinedIcon from "@mui/icons-material/QueryBuilderOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";

const CoreFeatures = () => {
  const features = [
    {
      icon: <ThumbUpOffAltIcon fontSize="large" />,
      title: "High Rating",
      description:
        "We take pride in curating a selection of hotels that consistently receive high ratings and positive reviews.",
    },
    {
      icon: <QueryBuilderOutlinedIcon fontSize="large" />,
      title: "Quiet Hours",
      description:
        "We understand that peace and uninterrupted rest are essential for a rejuvenating experience.",
    },
    {
      icon: <LocationOnOutlinedIcon fontSize="large" />,
      title: "Best Location",
      description:
        "At our hotel booking website, we take pride in offering accommodations in the most prime and sought-after locations.",
    },
    {
      icon: <CancelOutlinedIcon fontSize="large" />,
      title: "Free Cancellation",
      description:
        "We understand that travel plans can change unexpectedly, which is why we offer the flexibility of free cancellation.",
    },
    {
      icon: <CreditScoreOutlinedIcon fontSize="large" />,
      title: "Payment Options",
      description:
        "Our hotel booking website offers a range of convenient payment options to suit your preferences.",
    },
    {
      icon: <DiscountOutlinedIcon fontSize="large" />,
      title: "Special Offers",
      description:
        "Whether you're planning a romantic getaway, or a business trip, our carefully curated special offers cater to all your needs.",
    },
  ];
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Core Features
          </h2>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-yellow-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-[#bda705] mb-3">
                {feature.icon}
              </h2>
              <h3 className="text-xl font-semibold text-[#03377f] mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreFeatures;
