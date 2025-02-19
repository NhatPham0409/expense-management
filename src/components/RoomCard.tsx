import { Card, Tag } from "antd";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface RoomCardProps {
  room: any;
}

function RoomCard({ room }: RoomCardProps) {
  const router = useRouter();

  const handleNavigate = (id: number) => {
    router.push(`/${id}`);
  };

  return (
    <Card
      hoverable
      className="h-full shadow-md transition-all duration-300 hover:shadow-lg"
      onClick={() => handleNavigate(room.id)}
    >
      <Card.Meta
        title={
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">{room.name}</span>
          </div>
        }
        description={
          <div>
            <p className="text-gray-600 mt-2">{room.description}</p>
          </div>
        }
      />
    </Card>
  );
}

export default RoomCard;
