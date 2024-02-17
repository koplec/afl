import { CREATE_USER_WEB_DAV_RESOURCE_FAILED, UserResourceRepository } from "../../infrastructure/db/UserResourceRepository";


export type CreateUserResourceArgs = {
    userId: number;
    url: string;
    type: "WEBDAV",
    username: string;
    password: string;
    directory: string;
};

export class CreateUserResource {
    private userResourceRepository: UserResourceRepository;
    
    constructor(userResourceRepository: UserResourceRepository) {
        this.userResourceRepository = userResourceRepository;
    }
    
    async execute(args: CreateUserResourceArgs): Promise<number> {
        const createUserResourceID = await this.userResourceRepository.createUserWEBDavResource(
            args.userId, args.url, args.username, args.password, args.directory
        );
        if (createUserResourceID === CREATE_USER_WEB_DAV_RESOURCE_FAILED) {
            throw new Error('User resource creation failed');
        }
        return createUserResourceID;
    }
}