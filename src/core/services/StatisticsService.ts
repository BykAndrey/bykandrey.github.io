import allStats from '@/assets/data/all.json';
import statisticsData from '@/assets/data/statisticsData.json';


export interface CountryData {
    country_name: string,
    country_code: string,
    indicator_name: string,
    indicator_code: string,
    years: { [key: string]: number }
}
export interface CountryYearData extends Omit<CountryData, 'years'> {
    year: number,
    yearValue: number
}

class FetchCache {
    cache: { [key: string]: Promise<unknown> | undefined } = {}
    fetch<T>(key: string, fn: () => Promise<T>): Promise<T> {
        console.log(key, this.cache[key])
        if (this.cache[key]) return this.cache[key] as Promise<T>;
        this.cache[key] = fn();
        return this.cache[key] as Promise<T>;
    }
}
class StatisticsService {
    allStats: {
        [key: string]: string[]
    } = allStats;
    name: string;
    statisticsCode: string;
    supportedCountries: string[] = [];
    collection: { [key: string]: CountryData } = {};
    fetch: FetchCache;

    constructor(statisticsCode: string, name:string) {
        if (!this.allStats[statisticsCode]) {
            throw new Error("Country does not exist");
        }
        this.statisticsCode = statisticsCode;
        this.supportedCountries = this.allStats[statisticsCode];
        this.fetch = new FetchCache();
        this.name = name
    }
    static async getStatisticNames(): Promise<string[]> {
        return Object.keys(allStats);
    }
    static async getStatisticsInfo(): Promise<{
        id: string,
        name: string;
        description: string;
    }[]> {
        return Object.entries(statisticsData).map(([key, value]) => {
            return {
                ...value,
                id: key
            }
        });
    }
    isAllLoaded(): boolean {
        const isAllCountriesLoaded = this.supportedCountries.filter(code => !!this.collection[code]).length === this.supportedCountries.length;
        return isAllCountriesLoaded;
    }
    async getOneCountryData(countryCode: string): Promise<CountryData> {
        if (this.isAllLoaded()) {
            return this.collection[countryCode];
        }
        const url = `http://localhost:3000/data/${this.statisticsCode}/${countryCode}.json`;


        return this.fetch.fetch(url, () => {
            return fetch(url).then(r => r.json()).then((data: CountryData) => {
                this.collection[data.country_code] = data;
                return data;
            });
        })
    }
    async getAllData(): Promise<Record<string, CountryData>> {
        if (this.isAllLoaded()) {
            return this.collection
        }
        const url = `http://localhost:3000/data/${this.statisticsCode}/all.json`;
        return this.fetch.fetch(url, () => {
            return fetch(url).then(r => r.json()).then((data: Record<string, CountryData>) => {
                this.collection = data;
                return data;
            })
        })
    }
}


export default StatisticsService;