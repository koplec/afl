import { UserRepository } from "../../infrastructure/db/UserRepository";

export class GetUser {
    constructor(private userRepository: UserRepository) {}

    async execute(name:string){
        return await this.userRepository.getUserByName(name);
    }
}