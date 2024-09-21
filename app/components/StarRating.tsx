import React from "react";
import { StarIcon } from "./Icons";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5 }) => {
  return (
    <div className="flex gap-1">
      {[...Array(maxRating)].map((_, index) => (
        <StarIcon
          key={index}
          className={`size-5 ${
            index < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill={index < rating ? "currentColor" : "currentColor"}
        />
      ))}
    </div>
  );
};

export default StarRating;
