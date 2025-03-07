export default function cnn<T extends {[key: string]: string| number| boolean | null | undefined}>(obj: T): string[] {
    const v =  Object.keys(obj).reduce((acc, key ) => {
        if (obj[key]) return [...acc, key];
        return acc
    }, [] as string[]);
    return v;
}