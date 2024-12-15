import { LoadingSpinner } from "@/components/ui/spinner";

interface LoadingSyncingProps {
  progress: {
    done: number;
    total: number;
  };
}
export default function LoadingSyncing({ progress }: LoadingSyncingProps) {
  return (
    <div className="relative h-full">
      <div className="flex flex-col gap-2 h-full items-center justify-center">
        <div className="text-sm font-semibold">
          Syncing emails into database
        </div>
        {progress.total > 0 && (
          <div className="text-sm font-semibold">
            A total of {progress.done} out {progress.total} emails synced
          </div>
        )}
        <div>
          <LoadingSpinner />
        </div>
      </div>
    </div>
  );
}
