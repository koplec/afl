import { CollectFileInfo } from "../application/userResource/CollectFileInfo.js";
import { FileInfoRepository } from "../infrastructure/db/FileInfoRepository.js";
import { UserResourceRepository } from "../infrastructure/db/UserResourceRepository.js";

//repository 
const userResourceRepository = new UserResourceRepository();
const fileInfoRepository = new FileInfoRepository();
const collectFileInfo = new CollectFileInfo(userResourceRepository, fileInfoRepository);

const userId = 1;
const resourceId = 1;

async function run(){
    await collectFileInfo.execute(userId, resourceId);
    process.exit(0);
}

run();