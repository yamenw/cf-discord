export function getOption(name: string, data?: { name: string; value: string | number }[]) {
    if (!data)
        return undefined;
    const option = data?.find(
        (option: { name: string; value: string | number }) => option.name === name
    )
    if (!option)
        return undefined;
    // throw new Error(`Missing option: ${name}`);
    return option.value;
}

//TODO: TS wizardry with generics
//TODO: make a required version