const instanceOfError = (object: any): object is Error => {
    return object.message !== undefined;
}

export {
    instanceOfError,
}