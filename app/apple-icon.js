import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const size = {
  width: 180,
  height: 180
};

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #fff7f3, #f6d9cf)",
          color: "#934329",
          fontFamily: "Georgia",
          fontSize: 72,
          borderRadius: 42
        }}
      >
        IB
      </div>
    ),
    size
  );
}

