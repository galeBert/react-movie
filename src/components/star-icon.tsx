import React from "react";

export default function StarIcon({
  status = "filled",
}: {
  status: "filled" | "half" | "empty";
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10.549"
      height="10.051"
      viewBox="0 0 10.549 10.051"
    >
      <defs>
        <clipPath id="leftHalf">
          <rect x="0" y="0" width="50%" height="100%" />
        </clipPath>
        <clipPath id="rightHalf">
          <rect x="50%" y="0" width="50%" height="100%" />
        </clipPath>
      </defs>
      <g clipPath="url(#leftHalf)">
        <path
          fill={
            status === "filled" || status === "half" ? "#F0D946" : "#F0F0F0"
          }
          d="M10.54,5.143a.189.189,0,0,0-.153-.129l-3.416-.5-1.528-3.1a.189.189,0,0,0-.338,0l-1.528,3.1-3.416.5a.189.189,0,0,0-.1.322L2.529,7.746l-.584,3.4a.189.189,0,0,0,.075.185.187.187,0,0,0,.2.014L5.275,9.741,8.33,11.347a.189.189,0,0,0,.274-.2l-.583-3.4,2.472-2.409A.189.189,0,0,0,10.54,5.143Z"
          transform="translate(0 -1.318)"
        />
      </g>
      <g clipPath="url(#rightHalf)">
        <path
          fill={status === "filled" ? "#F0D946" : "#F0F0F0"}
          d="M10.54,5.143a.189.189,0,0,0-.153-.129l-3.416-.5-1.528-3.1a.189.189,0,0,0-.338,0l-1.528,3.1-3.416.5a.189.189,0,0,0-.1.322L2.529,7.746l-.584,3.4a.189.189,0,0,0,.075.185.187.187,0,0,0,.2.014L5.275,9.741,8.33,11.347a.189.189,0,0,0,.274-.2l-.583-3.4,2.472-2.409A.189.189,0,0,0,10.54,5.143Z"
          transform="translate(0 -1.318)"
        />
      </g>
    </svg>
  );
}
