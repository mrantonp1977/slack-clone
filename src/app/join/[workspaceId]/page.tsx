"use client";

import { Button } from "@/components/ui/button";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { useJoin } from "@/features/workspaces/api/use-join";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import VerificationInput from "react-verification-input";
import { toast } from "sonner";


const JoinPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useGetWorkspaceInfo({id: workspaceId});
  const { mutate, isPending } = useJoin();

  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);


  const handleComplete = (value: string) => {
    mutate({workspaceId, joinCode: value}, {
      onSuccess: (id) => {
        router.replace(`/workspace/${id}`);
        toast.success("Successfully joined workspace");
      },
      onError: (error) => {
        toast.error("Failed to join workspace");
      }
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return ( 
    <div className="flex flex-col items-center justify-center h-full gap-y-8 bg-white p-8 rounded-lg shadow-md">
      <Image 
        src={"/logo.png"}
        width={60}
        height={60}
        alt="logo"
      />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">
            Join {data?.name}
          </h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          onComplete={handleComplete} 
          classNames={{
            container: cn("flex gap-x-2", isPending && "opacity-50 cursor-not-allowed"),
            character: "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-bold text-gray-600",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          autoFocus
          length={6}
        />
      </div>
      <div className="flex gap-x-4">
        <Button size="lg" variant="outline" asChild>
          <Link href="/">
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
   );
}
 
export default JoinPage;