import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const roomName = request.nextUrl.searchParams.get("roomName");
  const participantName = request.nextUrl.searchParams.get("participantName");

  if (!roomName || !participantName) {
    return NextResponse.json(
      { error: "roomName과 participantName이 필요합니다." },
      { status: 400 }
    );
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const liveKitUrl = process.env.LIVEKIT_URL;

  if (!apiKey || !apiSecret || !liveKitUrl) {
    return NextResponse.json(
      { error: "LiveKit 환경변수가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    name: participantName,
  });
  at.ttl = "1h";
  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return NextResponse.json({
    serverUrl: liveKitUrl,
    roomName,
    participantToken: await at.toJwt(),
    participantName,
  });
}
