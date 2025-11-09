"use client"
import { useState } from "react"
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
import { Share2 } from "lucide-react"


export default function Share({ id }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const shareUrl = `https://sfpzk.org/çalakî#${id}` // ✅ replace with your actual domain

  return (
    <>
    {/* Trigger Button */}
      <button
        onClick={() => setIsDialogOpen(true)}
        className="flex gap-[14px] w-full text-left px-3 py-2 hover:bg-gray-700 transition text-sm"
      >
        {/*className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-yellow-200 transition-all shadow-sm hover:shadow-md"
 */}
        <Share2 size={18} />
        Parvekirin
      </button>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent id="share" className="bg-gray-900 border border-gray-700 shadow-2xl max-w-md mx-auto rounded-2xl transition-all duration-300">
          <DialogTitle className="text-lg font-semibold text-gray-100 text-center mb-4">
            Parvekirin
          </DialogTitle>

          <div className="flex justify-center gap-4 flex-wrap mb-4">
            <FacebookShareButton url={shareUrl}>
              <FacebookIcon size={48} round />
            </FacebookShareButton>
            {/* <PinterestShareButton url={shareUrl}>
              <PinterestIcon size={48} round />
            </PinterestShareButton>
            <RedditShareButton url={shareUrl}>
              <RedditIcon size={48} round />
            </RedditShareButton> */}
            <WhatsappShareButton url={shareUrl}>
              <WhatsappIcon size={48} round />
            </WhatsappShareButton>
            {/* <LinkedinShareButton url={shareUrl}>
              <LinkedinIcon size={48} round />
            </LinkedinShareButton> */}
          </div>

          <div className="bg-gray-800 text-gray-300 text-sm p-3 rounded-lg select-all break-all">
            {shareUrl}
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl)
            }}
            className="w-full mt-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition-all cursor-pointer"
          >
            Girêdanê Kopî Bike
          </button>
        </DialogContent>
      </Dialog>
    </>
  )
}
