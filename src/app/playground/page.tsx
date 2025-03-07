// 'use client'
// import { CountryChart } from "@/components/CountryChart/CountryChart";
// import LineStat from "@/components/LineStat/LineStat";
// import { useState } from "react";





// const test = (n, v, color?: string) => {
//     return {
//         title: n,
//         value: v,
//         color: color || 'red'
//     }
// }


// const stat1 =[
//     test('A', 1),
//     test("B", 2),
//     test("C", 3),
//     test("D", 4),
//     test("E", 5),
//     test("F", 6),
//     test("G", 7),
//     test("H", 8),
//     test("I", 9),
//     test("GG", 20, 'green'),
//  ]


//  const stat2 =[
//     test('A', 1),
//     test("B", 2),
//     test("C", 30),
//     test("D", 4),
//     test("E", 55, 'green'),
//     test("F", 6),
//     test("G", 7),
//     test("H", 20),
//     test("I", 9),
//     test("GG", 1),
//  ]
// let counter = 0;
// export default  function Page() {
//     const [stat,setStat] = useState(stat1)
//   return <>
//     <button onClick={() => {
//         if (counter % 2 === 0) {
//             setStat(stat2)
//         } else {
//             setStat(stat1)
//         }
//         counter++;
//     }}>q</button>
//     <div style={{
//         width: '300px',
//         height: 500
//     }}>
//     {/* <LineStat options={stat}/> */}
//     <CountryChart/>
//     </div>
//   </>
// }


export default function Page() {
    return <div>Playground</div>
}