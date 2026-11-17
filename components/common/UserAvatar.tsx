import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/format";

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  className?: string;
}

export function UserAvatar({ name, image, className }: UserAvatarProps) {
  return (
    <Avatar className={className}>
      {image && <AvatarImage src={image} alt={name ?? "User"} />}
      <AvatarFallback>{initials(name)}</AvatarFallback>
    </Avatar>
  );
}
