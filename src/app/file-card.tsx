import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Doc, Id } from "../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { FileTextIcon, GanttChartIcon, ImageIcon, MoreVertical, TrashIcon } from "lucide-react"
import { ReactNode, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"


function FileCardActions({ file }: { file: Doc<"files"> }) {
    const deleteFile = useMutation(api.files.deleteFile);
    const { toast } = useToast();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    return (
        <>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => {
                            // TODO Delete Action
                            await deleteFile({
                                fileId: file._id
                            });
                            toast({
                                variant: "default",
                                title: "File deleted successfully!",
                                description: "Your file is deleted from system",
                            })
                        }}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
                <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={() => setIsConfirmOpen(true)}
                        className="flex gap-1 text-red-600 items-center">
                        <TrashIcon className="w-5 h-5" />Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

function getFileUrl(fileId: Id<"_storage">): string {
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`
}

export function FileCard({ file }: { file: Doc<"files"> }) {

    const typeIcons = {
        'image': <ImageIcon />,
        'pdf': <FileTextIcon />,
        'csv': <GanttChartIcon />,
    } as Record<Doc<"files">['type'], ReactNode>

    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2">
                    <div className="flex justify-center">{typeIcons[file.type]}</div>
                    {file.name}
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions file={file} />
                </div>
            </CardHeader>
            <CardContent>
                {
                    file.type === 'image' && (
                        <Image
                            alt={file.name}
                            width='200'
                            height='200'
                            src={getFileUrl(file.fileId)}
                        />
                    )}
            </CardContent>
            <CardFooter>
                <Button>Download</Button>
            </CardFooter>
        </Card>

    )
}