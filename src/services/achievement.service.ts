import { Types } from "mongoose";
import AchievementModel, { IAchievement } from "../models/achievement.model";
import NFTService from "./nft.service";
import { milestoneNFTs } from "../config/nftMetadataMap";

// Map each milestone key to its corresponding smart contract enum number
const achievementTypeMap: Record<string, number> = {
  "Collaboration_Champion": 0,
  "Fast_Learner": 1,
  "Quiz_Conqueror": 2,
  "Streak_Scholar": 3,
  "Study_Group_Leader": 4,
  "Subject_Expert": 5,
  // Add more as needed
};

export async function grantAchievementNFT(
  userId: Types.ObjectId,
  userWallet: string,
  milestoneKey: string
): Promise<IAchievement> {
  const existing = await AchievementModel.findOne({
    userId,
    key: milestoneKey,
  });

  if (existing) {
    throw new Error("Achievement already granted to this user.");
  }

  const metadata = milestoneNFTs[milestoneKey];
  const achievementType = achievementTypeMap[milestoneKey];

  if (!metadata || achievementType === undefined) {
    throw new Error(`Invalid milestone key: ${milestoneKey}`);
  }

  const { name, tokenURI } = metadata;
  const description = `NFT awarded for milestone: ${name}`;
  const image = `${tokenURI}/image.png`; // assuming a standard path

  try {
    const txHash = await NFTService.mintAchievement(userWallet, achievementType, tokenURI);

    const achievement = await AchievementModel.create({
      userId,
      key: milestoneKey,
      name,
      description,
      txHash,
      tokenURI,
      image,
      achievementType,
      earnedAt: new Date(),
    });

    return achievement;
  } catch (err) {
    console.error("Error while granting NFT:", err);
    throw new Error("Failed to mint and store NFT achievement.");
  }
}



