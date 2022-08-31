export class OwnerModel {
    constructor(
        public createAt: Date = new Date(),
        public email:    string = '',
        public id:       number = 0,
        public image:    string = '',
        public name:     string = '',
        public username: string = '',
        public password:    string = '',
        public enabled:     string = '',
        public roles: string[] = []
    ){

    }   
}

export class OwnerDaoModel {
    constructor(
        public id:       number = 0,
        public name:     string = ''
    ){

    }   
} 