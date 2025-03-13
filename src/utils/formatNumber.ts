import { formatNumber as formatNumberChart } from 'chart.js/helpers'
// export function formatNumber(v:number): string {
//     return Math.ceil(v)
//     .toString()
//     .split('')
//     .reverse()
//     .map((l, index) => {
//         if ((index + 1) % 3 === 0 && v.toString().length !== index + 1)
//             return ',' + l
//         return l
//     })
//     .reverse()
//     .join('')
// }

// export
// formatNumber(props.value, 'en', {
//     roundingPriority: "morePrecision" ,
// // roundingIncrement?: 1 | 2 | 5 | 10 | 20 | 25 | 50 | 100 | 200 | 250 | 500 | 1000 | 2000 | 2500 | 5000 | undefined;
//     roundingMode: "ceil",
//     trailingZeroDisplay: "auto"
//     })

export const formatNumber = (value: number) => {
    return formatNumberChart(value, 'en', {
        roundingPriority: 'morePrecision',
        // roundingIncrement?: 1 | 2 | 5 | 10 | 20 | 25 | 50 | 100 | 200 | 250 | 500 | 1000 | 2000 | 2500 | 5000 | undefined;
        roundingMode: 'ceil',
        trailingZeroDisplay: 'auto',
    })
}
