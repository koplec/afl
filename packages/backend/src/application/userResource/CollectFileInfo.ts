import { WebDavFileInfo } from "../../domain/types";
import BatchLogRepository from "../../infrastructure/db/BatchLogRepository.js";
import { FileInfoRepository } from "../../infrastructure/db/FileInfoRepository.js";
import { UserResourceRepository } from "../../infrastructure/db/UserResourceRepository.js";
import { RetryError, WebDavService } from "../../infrastructure/webdav/WebDavService.js";

import { logger } from "../../utils/logger.js";

export class CollectFileInfo {
    private userResourceRepository: UserResourceRepository;
    private batchLogRepository: BatchLogRepository;
    private fileInfoRepository: FileInfoRepository;

    constructor(
        userResourceRepository: UserResourceRepository, 
        fileInfoRepository: FileInfoRepository,
        batchLogRepository: BatchLogRepository) {
        this.userResourceRepository = userResourceRepository;
        this.fileInfoRepository =  fileInfoRepository;
        this.batchLogRepository = batchLogRepository;
    }
    public async execute(userId: number, resourceId:number):Promise<void>{
        //与えられたuserIdとresourceIdに対応するWEBDAVリソースからディレクトリをトラバースして、
        //ファイル情報を収集して、DBに保存する
        const startMessage = `CollectFileInfo.execute userId:${userId} resourceId:${resourceId} BEGIN`;
        logger.info(startMessage);


        // 1. リソース情報を取得
        logger.debug("getUserResource BEGIN");
        const userResource = await this.userResourceRepository.getUserResource(userId, resourceId);
        if(userResource === null){
            const message = 'userResource not found'
            throw new Error(message);
        }

        // 2. リソース情報を元にWEBDAVリソースに接続
        logger.debug("WebDavService BEGIN")
        const webDavService: WebDavService = new WebDavService(
            userResource.url, userResource.username, userResource.password);

        // 3. ディレクトリをトラバースしてファイル情報を収集
        await webDavService.traverse(userResource.directory, async (item: WebDavFileInfo) => {
            // 4. ファイル情報をDBに保存
            try{
                await this.fileInfoRepository.saveWebDavFileInfo(resourceId, item);
            }catch(e: unknown){
                if(e instanceof RetryError){
                    logger.error(`RetryError: Failed to save file info ${item.filename} : ${e.message}`);
                }else{
                    logger.error(`UnknownError ${item.filename}`, e);
                }
            }
        }, {
            maxRetries: 3,
            retryInterval: 1000
        });

        logger.info("END")
    }

    public async executeBatch(userId: number, resourceId:number, batchSize:number=10):Promise<void>{
        //与えられたuserIdとresourceIdに対応するWEBDAVリソースからディレクトリをトラバースして、
        //ファイル情報を収集して、DBに保存する
        const startMessage = `CollectFileInfo.execute userId:${userId} resourceId:${resourceId} BEGIN`;
        logger.info(startMessage); 
        const batchLogId = await this.batchLogRepository.startBatch(startMessage);

        // 1. リソース情報を取得
        logger.debug("getUserResource BEGIN");
        const userResource = await this.userResourceRepository.getUserResource(userId, resourceId);
        if(userResource === null){
            const errorMessage = 'userResource not found'
            await this.batchLogRepository.errorBatch(batchLogId, errorMessage);
            throw new Error(errorMessage);
        }

        // 2. リソース情報を元にWEBDAVリソースに接続
        logger.debug("WebDavService BEGIN")
        const webDavService: WebDavService = new WebDavService(
            userResource.url, userResource.username, userResource.password);

        // 3. ディレクトリをトラバースしてファイル情報を収集
        const traverseGenerator = webDavService.traverseBatch(userResource.directory, batchSize);
        for await (const batch of traverseGenerator){
            for(const item of batch){
                // 4. ファイル情報をDBに保存
                try{
                    await this.fileInfoRepository.saveWebDavFileInfo(resourceId, item);
                }catch(e: unknown){
                    if(e instanceof RetryError){
                        logger.error(`RetryError: Failed to save file info ${item.filename} : ${e.message}`);
                    }else{
                        logger.error(`UnknownError ${item.filename}`, e);
                    }
                }
            }
        }
        
        await this.batchLogRepository.endBatch(batchLogId);
        logger.info("END")
    }
}