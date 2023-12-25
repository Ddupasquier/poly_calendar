const instanceOfError = (object: any): object is Error => {
    return object.message !== undefined;
}

const userEmailVerified = (user: any): boolean => {
    return user.email_confirmed_at !== null;
}

export {
    instanceOfError,
    userEmailVerified
}