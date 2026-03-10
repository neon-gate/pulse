import { Card } from "@shadcn/components/ui/card";
import { Uploader } from "@uploader/ui";
import { AudioLinesIcon, FolderUpIcon } from "lucide-react";

export default function UploaderSlot() {
  return (
    <Card className="mobile-hidden overflow-y-auto mr-2 glassy-surface surface col-span-2">
      <Uploader />
    </Card>
  )
}
