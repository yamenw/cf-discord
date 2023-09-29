export function getOption
    <T, U extends readonly { name: string, value: T }[], V extends U[number]['name']>
    (name: V, data: U | undefined):
    Extract<U[number], { name: V }>['value'] | undefined {

    function optionExists(option: U[number]): option is Extract<U[number], { name: V }> {
        return option.name === name;
    }

    if (!data)
        return undefined;
    const option = data.find(optionExists);
    if (!option)
        return undefined;
    return option.value;
}
