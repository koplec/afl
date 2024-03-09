import { WebDavFileInfo } from "../../domain/types";
import { FileInfoRepository } from "../../infrastructure/db/FileInfoRepository.js";
import { UserResourceRepository } from "../../infrastructure/db/UserResourceRepository.js";
import { RetryError, WebDavService } from "../../infrastructure/webdav/WebDavService.js";

export class CollectFileInfo {
    private userResourceRepository: UserResourceRepository;
    private fileInfoRepository: FileInfoRepository;

    constructor(
        userResourceRepository: UserResourceRepository, 
        fileInfoRepository: FileInfoRepository) {
        this.userResourceRepository = userResourceRepository;
        this.fileInfoRepository =  fileInfoRepository;
    }
    public async execute(userId: number, resourceId:number, batchSize:number=10):Promise<void>{
        //与えられたuserIdとresourceIdに対応するWEBDAVリソースからディレクトリをトラバースして、
        //ファイル情報を収集して、DBに保存する

        console.info("userId: " + userId);
        console.info("resourceId: " + resourceId)
        
        // 1. リソース情報を取得
        console.info("getUserResource BEGIN");
        const userResource = await this.userResourceRepository.getUserResource(userId, resourceId);
        if(userResource === null){
            throw new Error('Resource not found');
        }

        // 2. リソース情報を元にWEBDAVリソースに接続
        console.info("WebDavService BEGIN")
        const webDavService: WebDavService = new WebDavService(
            userResource.url, userResource.username, userResource.password);

        // 3. ディレクトリをトラバースしてファイル情報を収集
        console.info("Traversing BEGIN")
        await webDavService.traverse(userResource.directory, async (item: WebDavFileInfo) => {
            // 4. ファイル情報をDBに保存
            try{
                await this.fileInfoRepository.saveWebDavFileInfo(resourceId, item);
            }catch(e: unknown){
                if(e instanceof RetryError){
                    console.error(`RetryError: Failed to save file info ${item.filename} : ${e.message}`);
                }else{
                    console.error(`UnknownError ${item.filename}`, e);
                }
            }
        }, {
            maxRetries: 3,
            retryInterval: 1000
        });


        console.info("END")
    }
}