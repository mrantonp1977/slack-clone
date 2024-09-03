import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Doc } from '../../../../convex/_generated/dataModel';
import { ChevronDown, ListFilter, SquarePen } from 'lucide-react';
import { Hint } from '@/components/hint';
import { PreferencesModal } from './preferences-modal';
import { useState } from 'react';
import { InviteModal } from './invite-modal';

interface WorkspaceHeaderProps {
  workspace: Doc<'workspaces'>;
  isAdmin: boolean;
}

export const WorkspaceHeader = ({
  workspace,
  isAdmin,
}: WorkspaceHeaderProps) => {
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);


  return (
    <>
    <InviteModal 
      open={inviteOpen} 
      setOpen={setInviteOpen}
      name={workspace.name}
      joinCode={workspace.joinCode}
    />
    <PreferencesModal 
      open={preferencesOpen} 
      setOpen={setPreferencesOpen} 
      initialValue={workspace.name}
    />
      <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="transparent"
              className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
              size="sm"
            >
              <span className="truncate">{workspace.name}</span>
              <ChevronDown className="size-5 ml-2 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" className="w-64">
            <DropdownMenuItem className="capitalize cursor-pointer">
              <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold">{workspace.name}</p>
                <p className="font-xs text-muted-foreground">
                  Active Workspace
                </p>
              </div>
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="py-2 cursor-pointer text-sm font-medium"
                  onClick={() => setInviteOpen(true)}
                >
                  Invite people to {workspace.name}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="py-2 cursor-pointer text-sm font-medium"
                  onClick={() => setPreferencesOpen(true)}
                >
                  Preferences
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-0.5">
          <Hint label="Filter conversations" side="bottom">
            <Button variant="transparent" size="iconSm">
              <ListFilter className="size-5" />
            </Button>
          </Hint>
          <Hint label="New message" side="bottom">
            <Button variant="transparent" size="iconSm">
              <SquarePen className="size-5" />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
};
