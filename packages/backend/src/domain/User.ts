class User {
    id: number;
    name: string;
    password: string;
    
    constructor(id: number, name: string, password: string) {
        this.id = id;
        this.name = name;
        this.password = password;
    }
    
    validPassword(password: any) {
        return this.password === password;
    }

}

export default User;
