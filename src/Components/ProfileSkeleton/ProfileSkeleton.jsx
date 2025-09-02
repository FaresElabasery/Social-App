import { Card, Skeleton } from "@heroui/react";

export default function ProfileSkeleton() {
    return (
            <div className="max-w-[300px] w-full flex flex-col  justify-center items-center gap-3">
                <div>
                    <Skeleton className="flex rounded-full mx-auto size-30 " />
                </div>
                <div className="w-full flex flex-col mx-auto gap-3">
                    <Skeleton className="h-6 w-10/12 mx-auto rounded-lg" />
                    <Skeleton className="h-3 w-3/5 mx-auto rounded-lg" />
                    <Skeleton className="h-3 w-2/5 mx-auto rounded-lg" />
                </div>
            </div>
    )
}
