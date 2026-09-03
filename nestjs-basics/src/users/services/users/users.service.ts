import { Injectable } from '@nestjs/common';
import { createUser } from '../../../utils/type';

@Injectable()
export class UsersService {
    private fakedata = [
        { username: 'Om', email: 'om@gmail.com'}
    ];

    fetchUsers() {
        return this.fakedata;
    }

    createUser(userDetails: createUser) {
        this.fakedata.push(userDetails);
        return;
    }
}
