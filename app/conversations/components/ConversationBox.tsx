"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Conversation, Message, User } from "@prisma/client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";

import { FullConversationType } from "@/app/types";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [router, data.id]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(() => {
    return session?.data?.user?.email;
  }, [session?.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
      w-full
      relative
      flex
      items-center
      space-x-3
      hover:bg-neutral-100
      rounded-lg
      transition
      cursor-pointer
      p-3
      mt-3
    `,
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}

      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <div>
              <p className="text-sm font-bold text-gray-900">
                {data.name || otherUser?.name || otherUser?.email || "Unknown"}
              </p>
              <p className="text-sm font-medium text-gray-500">
                {data.name
                  ? `group of ${data.users.length} members`
                  : `@${otherUser?.username}`}
              </p>
            </div>

            {lastMessage?.createdAt && (
              <p className="text-xs text-gray-400 font-light">
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `
    truncate
    text-sm
  `,
              hasSeen ? "text-gray-400" : "text-black font-medium"
            )}
          >
            {lastMessageText}
            {hasSeen ? null : (
              <span className="absolute block rounded-full bg-blue-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3"></span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
