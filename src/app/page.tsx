"use client"

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { z } from "zod"
import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { Loader2 } from "lucide-react";



const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((file) => file.length > 0, `Required`)
});


export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  const isLoading = files === undefined;

  return (
    <main className="container mx-auto pt-12">

      {isLoading && (
        <div className="flex flex-col gap-8 w-full items-center mt-12">
          <Loader2 className="h-32 w-32 animate-spin  text-gray-700" />
          <div className="text-2xl">Loading your files...</div>
        </div>

      )
      }

      {!isLoading && files?.length === 0 && (
        <div className="flex flex-col gap-8 w-full items-center mt-12">
          <Image
            alt="an img of upload file"
            height="400"
            width="400"
            priority
            src="/upload.svg"
          />
          <div className="text-2xl">You have no files yet, upload any file</div>
          <UploadButton />
        </div>
      )}

      {!isLoading && files.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <UploadButton />
          </div>

          <div className="grid grid-cols-4 gap-4">
            {files?.map(file => {
              return <FileCard key={file._id} file={file} />
            })}
          </div>
        </>
      )}
    </main>
  );
}
