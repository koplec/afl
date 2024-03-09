import { CollectFileInfo } from "../application/userResource/CollectFileInfo.js";
import { FileInfoRepository } from "../infrastructure/db/FileInfoRepository.js";
import { UserResourceRepository } from "../infrastructure/db/UserResourceRepository.js";

console.info("collect-file-info-batch BEGIN")

//repository 
const userResourceRepository = new UserResourceRepository();
const fileInfoRepository = new FileInfoRepository();
const collectFileInfo = new CollectFileInfo(userResourceRepository, fileInfoRepository);

const userId = 1;
const resourceId = 2;

async function run(){
    await collectFileInfo.executeBatch(userId, resourceId);
    console.info("collect-file-info-batch END")
    process.exit(0);
}

run();