import { Review as PrismaReview } from "@prisma/client";

export type ReviewData = Omit<PrismaReview, 'createdAt'> & {
  createdAt: string | Date;
};

export type Review = ReviewData;