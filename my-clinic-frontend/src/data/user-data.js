const data = [
    {
        name: "Jon Dou",
        img: "",
        age: 26,
        dateOfBirth:"28-07-1998",
        gender: "male",
        clinic: "Dew",
        account: "A1234567",
        plan: "Membership",
        benefitYear: "jan-dec"

    },
    {
        name: "Harly Devid",
        img: "",
        age: 29,
        dateOfBirth:"28-07-1996",
        gender: "male",
        clinic: "WW",
        account: "A1234545",
        plan: "Commercial",
        benefitYear: "jan-dec"

    },
    {
        name: "Shen Watson",
        img: "",
        age: 35,
        dateOfBirth:"28-07-1991",
        gender: "male",
        clinic: "RB",
        account: "A1234501",
        plan: "Medicare-Advantage",
        benefitYear: "jan-dec"

    },
    
];

function getUserData() {
    return data;
}

export {getUserData}