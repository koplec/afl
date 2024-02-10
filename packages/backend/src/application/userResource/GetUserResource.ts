import { UserResourceType } from "../../domain/types";
import { UserResourceRepository } from "../../infrastructure/db/UserResourceRepository";

export default class GetUserResource {
    private userResourceRepository: UserResourceRepository;
    constructor(userResourceRepository: UserResourceRepository){
        this.userResourceRepository = userResourceRepository;
    }

    async execute(userId: number, resourceId: number):Promise<UserResourceType|null>{
        return await this.userResourceRepository.getUserResource(userId, resourceId);
    }
}