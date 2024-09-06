import { useMemberId } from "@/hooks/use-member-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetMember } from "@/features/menbers/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { Loader } from "lucide-react";
import { Header } from "./header";

interface ConversationProps {
  id: Id<'conversations'>;
};

export const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();
  const { data: member, isLoading: memberLoading } = useGetMember({ id: memberId });
  const { results, status, loadMore } = useGetMessages({ conversationId: id });

  if (memberLoading || status === 'LoadingFirstPage') {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
 
  return (
    <div className="flex flex-col h-full">
      <Header 
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => {}}
      />
    </div>
  );
};