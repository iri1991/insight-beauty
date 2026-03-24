import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const size = {
  width: 512,
  height: 512
};

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top, rgba(255,244,239,0.95), rgba(199,100,71,0.16) 34%, rgba(125,164,149,0.28) 100%)",
          color: "#231815",
          fontFamily: "Georgia",
          position: "relative"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 38,
            borderRadius: 92,
            border: "3px solid rgba(147,67,41,0.22)"
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10
          }}
        >
          <div
            style={{
              fontSize: 176,
              lineHeight: 1
            }}
          >
            IB
          </div>
          <div
            style={{
              fontSize: 44,
              letterSpacing: 9,
              textTransform: "uppercase"
            }}
          >
            Insight Beauty
          </div>
        </div>
      </div>
    ),
    size
  );
}
