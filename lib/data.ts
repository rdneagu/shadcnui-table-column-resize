import { faker } from "@faker-js/faker";
export type User = {
    firstName: string;
    lastName: string;
    age: any;
    email: string;
    comments: string;
};

export const createUser = (numUser: number) => {
    console.log("createUser");
    const users: User[] = [
        // {
        //     firstName: "First name",
        //     lastName: "Last name",
        //     age: "Age",
        //     email: "Email",
        //     comments: "Comments",
        // },
    ];
    for (let i = 0; i < numUser; i++) {
        users.push({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            age: faker.number.int({ min: 18, max: 90 }),
            email: faker.internet.email(),
            comments: faker.lorem.sentences(3),
        });
    }
    return users;
};

// export const data: User[] = [
//     ...createUser(10000)
// ];
