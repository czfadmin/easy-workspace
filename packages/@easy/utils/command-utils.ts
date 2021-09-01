import { EeasyOption } from './../cli/option';
export function attachOptionToCommand(
    options:EeasyOption,func: (options: EeasyOption) => void
) {
    if (func) {
        func(options);
    }
}
