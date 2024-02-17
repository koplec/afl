import { UserResourceRepository } from "../../infrastructure/db/UserResourceRepository";

export class DeleteUserResource {
    private userResourceRepository: UserResourceRepository;
    constructor(userResourceRepository: UserResourceRepository){
        this.userResourceRepository = userResourceRepository;
    }

    async execute(userId: number, resourceId: number): Promise<boolean>{
        const deleted = await this.userResourceRepository.deleteUserResource(userId, resourceId);
        return deleted;
    }
}