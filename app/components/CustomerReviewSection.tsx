import CustomerReview from "./CustomerReview";

interface Review {
  profilePicture: string;
  profileName: string;
  reviewDate: string;
  rating: number;
  reviewContent: string;
}

export default function CustomerReviewSection() {
  const reviews: Review[] = [
    {
      profilePicture: "",
      profileName: "John Doe",
      reviewDate: "2 days ago",
      rating: 4,
      reviewContent:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      profilePicture: "",
      profileName: "Jane Doe",
      reviewDate: "2 days ago",
      rating: 3,
      reviewContent:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ];

  const reviewCount = reviews.length;

  return (
    <div>
      <h2 className="mb-3.5 text-lg font-medium">
        Reviews by Customers <span className="opacity-50">· {reviewCount}</span>
      </h2>

      <div className="columns-2 gap-4">
        {reviews.map((review, index) => (
          <CustomerReview
            key={index}
            profilePicture={review.profilePicture}
            profileName={review.profileName}
            reviewDate={review.reviewDate}
            rating={review.rating}
            reviewContent={review.reviewContent}
          />
        ))}
      </div>
    </div>
  );
}
