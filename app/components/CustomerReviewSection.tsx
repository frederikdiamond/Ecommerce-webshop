import { useState } from "react";
import CustomerReview from "./CustomerReview";

interface Review {
  profilePicture: string;
  profileName: string;
  reviewDate: string;
  rating: number;
  reviewContent: string;
}

export default function CustomerReviewSection() {
  const [visibleReviews, setVisibleReviews] = useState(4);

  const toggleReviews = () => {
    setVisibleReviews((prevVisible) =>
      prevVisible === reviews.length ? 4 : reviews.length,
    );
  };

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
    {
      profilePicture: "",
      profileName: "Jane Doe",
      reviewDate: "2 days ago",
      rating: 3,
      reviewContent:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      profilePicture: "",
      profileName: "John Smith",
      reviewDate: "14 July, 2024",
      rating: 3,
      reviewContent:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      profilePicture: "",
      profileName: "Jane Doe",
      reviewDate: "2 days ago",
      rating: 1,
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

      <div className="flex flex-col items-center gap-5">
        <div className="grid grid-cols-2 gap-4">
          {reviews.slice(0, visibleReviews).map((review, index) => (
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
        {reviews.length > 4 && (
          <button
            onClick={toggleReviews}
            className="rounded-md px-3 py-1.5 text-center font-semibold text-blue-500 transition duration-200 ease-in-out hover:bg-blue-500 hover:text-white active:bg-blue-600"
          >
            {visibleReviews < reviews.length ? "Show More" : "Show Less"}
          </button>
        )}
      </div>
    </div>
  );
}
