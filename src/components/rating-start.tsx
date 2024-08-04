import React from "react";
import StarIcon from "./star-icon";

export default function RatingStar({ rating }: { rating: number }) {
  const roundedRating = Math.round(rating * 2) / 2;

  // Determine the number of full, half, and empty stars
  const fullStars = Math.floor(roundedRating);
  const halfStars = roundedRating % 1 !== 0 ? 1 : 0;
  const emptyStars = 10 - fullStars - halfStars;

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {[...Array(fullStars)].map((_, index) => (
        <StarIcon key={`full-${index}`} status="filled" />
      ))}
      {halfStars === 1 && <StarIcon key="half" status="half" />}
      {[...Array(emptyStars)].map((_, index) => (
        <StarIcon key={`empty-${index}`} status="empty" />
      ))}
    </div>
  );
}
