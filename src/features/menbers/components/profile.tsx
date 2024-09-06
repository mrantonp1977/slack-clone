import { Button } from '@/components/ui/button';
import { Id } from '../../../../convex/_generated/dataModel';
import { useGetMember } from '../api/use-get-member';
import {
  AlertTriangle,
  ChevronDownIcon,
  Loader,
  MailIcon,
  XIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useUpdateMember } from '../api/use-update-member';
import { useRemoveMember } from '../api/use-remove-member';
import { useCurrentMember } from '../api/use-current-member';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { toast } from 'sonner';
import { useConfirm } from '@/hooks/use-confirm';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProfileProps {
  memberId: Id<'members'>;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data: member, isLoading: isLoadingMember } = useGetMember({
    id: memberId,
  });
  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({ workspaceId });

  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();
  const { mutate: removeMember, isPending: isRemovingMember } =
    useRemoveMember();

  const [LeaveDialog, confirmLeave] = useConfirm(
    'Leave Workspace',
    'Are you sure you want to leave this workspace?'
  );

  const [RemoveDialog, confirmRemove] = useConfirm(
    'Remove Member',
    'Are you sure you want to renove this member?'
  );

  const [UpdateDialog, confirmUpdate] = useConfirm(
    'Update Role',
    'Are you sure you want to update this member role?'
  );

  const onRemove = async () => {
    const ok = await confirmRemove();

    if (!ok) {
      return;
    }
    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success('Member removed successfully.');
          onClose();
        },
        onError: (error) => {
          toast.error('Failed to remove member.');
        },
      }
    );
  };

  const onLeave = async () => {
    const ok = await confirmLeave();
    if (!ok) {
      return;
    }
    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          router.replace('/');
          toast.success('You left the workspace successfully.');
          onClose();
        },
        onError: (error) => {
          toast.error('Failed to leave the workspace.');
        },
      }
    );
  };

  const onUpdate = async (role: 'admin' | 'member') => {
    const ok = await confirmUpdate();
    if (!ok) {
      return;
    }
    updateMember(
      { id: memberId, role },
      {
        onSuccess: () => {
          toast.success('Role updated successfully.');
          onClose();
        },
        onError: (error) => {
          toast.error('Failed to update role.');
        },
      }
    );
  };

  if (isLoadingMember || isLoadingCurrentMember) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 border-b h-[49px]">
          <p className="text-lg font-bold">Profile</p>
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

  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 border-b h-[49px]">
          <p className="text-lg font-bold">Profile</p>
          <Button size="iconSm" variant="ghost" onClick={onClose}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Profile not found.</p>
        </div>
      </div>
    );
  }

  const avatarFallback = member.user.name?.charAt(0).toUpperCase() || 'M';

  return (
    <>
      <RemoveDialog />
      <LeaveDialog />
      <UpdateDialog />
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 border-b h-[49px]">
          <p className="text-lg font-bold">Profile</p>
          <Button size="iconSm" variant="ghost" onClick={onClose}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col p-4 items-center justify-center">
          <Avatar className="max-w-[256px] max-h-[256px] size-full">
            <AvatarImage src={member.user.image} />
            <AvatarFallback className="aspect-square text-6xl">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.user.name}</p>
          {currentMember?.role === 'admin' &&
          currentMember?._id !== memberId ? (
            <div className="flex items-center gap-2 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="w-full capitalize font-semibold"
                    variant="outline"
                  >
                    {member.role} <ChevronDownIcon className="size-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup value={member.role} onValueChange={(role) => onUpdate(role as "admin" | "member")}>
                    <DropdownMenuRadioItem value='admin'>
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='member'>
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={onRemove}
                className="w-full font-semibold"
                variant="outline"
              >
                Remove
              </Button>
            </div>
          ) : currentMember?._id === memberId &&
            currentMember?.role !== 'admin' ? (
            <div className="mt-4">
              <Button
                onClick={onLeave}
                className="w-full font-semibold"
                variant="outline"
              >
                Leave
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-md font-bold mb-4">Contact information</p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center">
              <MailIcon className="size-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <p className="text-[14px] font-semibold text-muted-foreground">
                Email Address
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-sm font-semibold hover:underline text-[#1264a3]"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
