import { CollectFileInfo } from "../application/userResource/CollectFileInfo.js";
import { FileInfoRepository } from "../infrastructure/db/FileInfoRepository.js";
import { UserResourceRepository } from "../infrastructure/db/UserResourceRepository.js";

import { logger } from "../utils/logger.js";


logger.info("collect-file-info-batch BEGIN")

//repository 
const userResourceRepository = new UserResourceRepository();
const fileInfoRepository = new FileInfoRepository();
const collectFileInfo = new CollectFileInfo(userResourceRepository, fileInfoRepository);

const userId = 1;
const resourceId = 2;

async function run(){
    await collectFileInfo.executeBatch(userId, resourceId);
    logger.info("collect-file-info-batch END")
}

run()
    .then(() => {
        logger.info('All operations completed successfully');
    })
    .catch(error => {
        logger.error('An error occurred:', error);
    });