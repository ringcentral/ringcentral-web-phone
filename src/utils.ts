export const uuid = (): string =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });

export const delay = async (ms: number): Promise<any> => new Promise(resolve => setTimeout(resolve, ms));

export const extend = (dst: any = {}, src: any = {}): any => Object.assign(dst || {}, src || {});
