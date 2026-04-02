import { MeetingRoom } from "./MeetingRoom";

interface PageProps {
  params: Promise<{ roomName: string }>;
  searchParams: Promise<{ name?: string }>;
}

export default async function MeetingRoomPage({ params, searchParams }: PageProps) {
  const { roomName } = await params;
  const { name } = await searchParams;

  return (
    <MeetingRoom
      roomName={decodeURIComponent(roomName)}
      participantName={name ?? "Guest"}
    />
  );
}
