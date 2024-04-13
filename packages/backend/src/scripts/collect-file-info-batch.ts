import { CollectFileInfo } from "../application/userResource/CollectFileInfo.js";
import { FileInfoRepository } from "../infrastructure/db/FileInfoRepository.js";
import { UserResourceRepository } from "../infrastructure/db/UserResourceRepository.js";

import { logger } from "../utils/logger.js";
import minimist from "minimist";

logger.info("collect-file-info-batch BEGIN")

//repository 
const userResourceRepository = new UserResourceRepository();
const fileInfoRepository = new FileInfoRepository();
const collectFileInfo = new CollectFileInfo(userResourceRepository, fileInfoRepository);

//args
const argv = minimist(process.argv.slice(2), {
    alias: {
        uid: 'userId',
        rid: 'resourceId'
    }
});
const userId = argv.userId as number;
const resourceId = argv.resourceId as number;
logger.debug(`userId: ${userId}, resourceId: ${resourceId}`)

async function main(){
    await collectFileInfo.executeBatch(userId, resourceId);
    logger.info("collect-file-info-batch END")
}

main()
    .then(() => {
        logger.info('All operations completed successfully');
    })
    .catch(error => {
        logger.error('An error occurred:', error);
    });