"use client"
import { useState } from "react"
import { toast } from "sonner"
import {
  FacebookShareButton,
  FacebookIcon,
  PinterestShareButton,
  PinterestIcon,
  RedditShareButton,
  RedditIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "next-share"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Share2, Copy, CopyCheck } from "lucide-react"


export default function Share({ id }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const shareUrl = `https://sfpzk.vercel.app/çalakî#${id}` // replace with actual domain

  const [copied, setCopied] = useState(false);
  const handleClick = () => {
    navigator.clipboard.writeText(shareUrl);

    setCopied(true);
    toast(
      <div className="flex items-center gap-2">
        <CopyCheck size={20} /> Lînk kopî bû 
      </div>
    );

    setTimeout(() => {
      setCopied(false);
    }, 200);
  };


  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsDialogOpen(true)}
        className="flex gap-[14px] w-full text-left px-3 py-2 hover:bg-gray-700 transition text-sm cursor-pointer"
      >
        {/*className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-yellow-200 transition-all shadow-sm hover:shadow-md"
 */}
        <Share2 size={18} />
        Parve bike
      </button>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent id="share" className="bg-gray-900 border border-gray-700 shadow-2xl max-w-md mx-auto rounded-2xl transition-all duration-300">
          <DialogTitle className="text-lg font-semibold text-gray-100 text-center mb-4">
            Parvekirin
          </DialogTitle>

          <div className="flex justify-center gap-4 flex-wrap mb-4">
            <FacebookShareButton url={shareUrl}>
              <FacebookIcon size={48} round className="hover:brightness-85" />
            </FacebookShareButton>
            {/* <PinterestShareButton url={shareUrl}>
              <PinterestIcon size={48} round />
            </PinterestShareButton>
            <RedditShareButton url={shareUrl}>
              <RedditIcon size={48} round />
            </RedditShareButton> */}
            <WhatsappShareButton url={shareUrl}>
              <WhatsappIcon size={48} round className="hover:brightness-85"/>
            </WhatsappShareButton>
            {/* <LinkedinShareButton url={shareUrl}>
              <LinkedinIcon size={48} round />
            </LinkedinShareButton> */}
          </div>

          <div
            onClick={handleClick}
            className={`text-gray-300 text-sm p-3 rounded-lg select-none break-all cursor-pointer transition-colors duration-200 active:bg-gray-600 ${copied
              ? "bg-gray-800"
              : "bg-gray-800 hover:bg-gray-700"
              }`}
          >
            {shareUrl}
            <Copy className="inline float-end" />
          </div>

        </DialogContent>
      </Dialog>
    </>
  )
}
