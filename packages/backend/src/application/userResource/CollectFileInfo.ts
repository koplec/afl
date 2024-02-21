import { UserResourceRepository } from "../../infrastructure/db/UserResourceRepository";

export class CollectFileInfo {
    private userResourceRepository: UserResourceRepository;

    constructor(userResourceRepository: UserResourceRepository) {
        this.userResourceRepository = userResourceRepository;
    }
    public execute(userId: number, resourceId:number):void{
        //与えられたuserIdとresourceIdに対応するWEBDAVリソースからディレクトリをトラバースして、
        //ファイル情報を収集して、DBに保存する

        // 1. リソース情報を取得
        const userResource = this.userResourceRepository.getUserResource(userId, resourceId);
        if(userResource === null){
            throw new Error('Resource not found');
        }
        // 2. リソース情報を元にWEBDAVリソースに接続
        
        // 3. ディレクトリをトラバースしてファイル情報を収集
        // 4. ファイル情報をDBに保存

    }
}