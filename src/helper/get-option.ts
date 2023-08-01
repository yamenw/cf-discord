export function getOption(name: string, data: { name: string; value: string }[]) {
    const option = data?.find(
        (option: { name: string; value: string }) => option.name === name
    )
    if (!option)
        return undefined;
    // throw new Error(`Missing option: ${name}`);
    return option;
}

//TODO: TS wizardry with generics
//TODO: make a required version