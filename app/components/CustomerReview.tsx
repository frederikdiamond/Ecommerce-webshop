import StarRating from "./StarRating";

export default function CustomerReview({
  profilePicture,
  profileName,
  reviewDate,
  rating,
  reviewContent,
}: {
  profilePicture: string;
  profileName: string;
  reviewDate: string;
  rating: number;
  reviewContent: string;
}) {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-black/10 p-3 transition duration-200 ease-in-out hover:border-black/20">
      <div className="flex items-center justify-between">
        <div className="flex gap-2.5">
          <img src={profilePicture} alt="" className="size-10 rounded-full" />
          <div className="flex flex-col gap-0.5">
            <p className="font-semibold">{profileName}</p>
            <p className="text-sm opacity-50">{reviewDate}</p>
          </div>
        </div>
        <StarRating rating={rating} />
      </div>

      <p>{reviewContent}</p>
    </div>
  );
}
