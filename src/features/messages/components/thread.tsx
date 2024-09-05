import { Button } from '@/components/ui/button';
import { Id } from '../../../../convex/_generated/dataModel';
import { AlertTriangle, Loader, XIcon } from 'lucide-react';
import { useGetMessage } from '../api/use-get-message';
import { Message } from '@/components/message';
import { useCurrentMember } from '@/features/menbers/api/use-current-member';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

interface ThreadProps {
  messageId: Id<'messages'>;
  onClose: () => void;
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkspaceId();
  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);
  const { data: currentMember } = useCurrentMember({workspaceId});
  const { data: message, isLoading: loadingMessage } = useGetMessage({
    id: messageId,
  });

  if (loadingMessage) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 border-b h-[49px]">
          <p className="text-lg font-bold">Thread</p>
          <Button size="iconSm" variant="ghost" onClick={onClose}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 border-b h-[49px]">
          <p className="text-lg font-bold">Thread</p>
          <Button size="iconSm" variant="ghost" onClick={onClose}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Message not found. 
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 border-b h-[49px]">
        <p className="text-lg font-bold">Thread</p>
        <Button size="iconSm" variant="ghost" onClick={onClose}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div>
        <Message 
          hideThreadButton
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        />
      </div>
      <div className="px-4">
        <Editor
          onSubmit={() => {}}
          disabled={false}
          placeholder='Reply to this message...'
        />
      </div>
    </div>
  );
};
