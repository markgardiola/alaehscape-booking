import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

/**
 * Popup shown when a customer clicks "View Room" -- just a name and an
 * image carousel, since rooms are informational only (no price, no
 * selection) on a private resort booking.
 */
const RoomPreviewDialog = ({ room, open, onOpenChange }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{room?.name}</DialogTitle>
      </DialogHeader>

      {room?.images?.length > 0 ? (
        <Carousel className="rounded-xl">
          <CarouselContent>
            {room.images.map((img) => (
              <CarouselItem key={img.id}>
                <img
                  src={img.image_url}
                  alt={room.name}
                  className="block h-72 w-full rounded-xl object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <p className="py-10 text-center text-sm text-ink/50">
          No photos available for this room yet.
        </p>
      )}
    </DialogContent>
  </Dialog>
);

export default RoomPreviewDialog;
