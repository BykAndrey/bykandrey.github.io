import { formatNumber } from "@/utils/formatNumber";

interface StatisticSettings {
    name: string;
    mainValue: {
        better: 'large' | 'small',
        inputLabel: string,
        step: number,
        format: (v: number) => string,
    }
}



export default {
    'SP.POP.TOTL' :{
        name: 'Population',
        mainValue: {
            better: 'large',
            inputLabel: 'Population',
            step: 100000,
            format: formatNumber,
        }
    },
    'SH.DTH.IMRT' :{
        name: 'Number of infant deaths',
        mainValue: {
            better: 'small',
            inputLabel: 'Number of infant deaths',
            step: 10,
            format: formatNumber,
        }
    },
    'SP.DYN.CDRT.IN': {
        name: 'Death rate, crude (per 1,000 people)',
        mainValue: {
            better: 'small',
            inputLabel: 'Death rate, crude (per 1,000 people)',
            step: 1,
            format: formatNumber,
        }
    },
    'SH.STA.TRAF.P5': {
        name: 'Mortality caused by road traffic injury (per 100,000 population)',
        mainValue: {
            better: 'large',
            inputLabel: 'Mortality caused by road traffic injury (per 100,000 population)',
            step: 1,
            format: formatNumber,
        }
    },
    "SH.DYN.NMRT": {
        name: 'Mortality rate, neonatal (per 1,000 live births)',
        mainValue: {
            better: 'large',
            inputLabel: 'Mortality rate, neonatal (per 1,000 live births)',
            step: 1,
            format: formatNumber,
        }
    }
} as Record<string, StatisticSettings>