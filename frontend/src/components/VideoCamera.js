// components/VideoCamera.js
import React from "react";

const VideoCamera = React.forwardRef(({ overlayColor = "blue", size = 192 }, ref) => (
  <div className="relative rounded-xl overflow-hidden shadow-md">
    <video
      ref={ref}
      autoPlay
      muted
      playsInline
      width={size}
      height={(size * 0.75).toFixed()}
      className="rounded-xl w-full h-64 object-cover"
    />
    <div className="absolute inset-0 flex justify-center items-center">
      <div
        className={`w-${size} h-${size} border-4 rounded-full animate-pulse`}
        style={{ borderColor: overlayColor }}
      ></div>
    </div>
  </div>
));

export default VideoCamera;
