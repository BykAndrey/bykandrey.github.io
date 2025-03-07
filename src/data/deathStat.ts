// import xmlData from '@/assets/data.json'

// const deathStatistics = xmlData.Root.data.record.reduce((acc, record) => {
//     const countryName = record.field.find((f) => f._name === 'Country or Area')?.__text;
//     const name = record.field.find((f) => f._name === 'Country or Area')?._key
//     const year = +record.field.find((f) => f._name === 'Year')?.__text
//     const value = +record.field.find((f) => f._name === 'Value')?.__text

//     if (!name) return acc
//     let dt = {
//         name: countryName,
//         year: year,
//         value: value,
//     }
//     return {
//         ...acc,
//         [name]: acc[name] ? [...acc[name], dt] : [dt],
//     }
// }, {}) as {
//     [key: string]: { year: number; value: number, name: string }[]
// }


// export default deathStatistics;