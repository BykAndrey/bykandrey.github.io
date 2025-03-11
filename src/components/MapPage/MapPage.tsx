'use client'
import React from 'react'
import st from './MapPage.module.scss'
import Maps from '../Maps/Maps'
import { Label } from '../Label/Label'
import { InfoBlock } from '../InfoBlock/InfoBlock'
import cnn from '@/utils/ccn'
import Compare from '../Compare/Compare'
// import deathStatistics from '@/data/deathStat'
// import allStats from '@/assets/data/all.json'
import StatisticsService, {
    CountryData,
    CountryYearData,
} from '@/core/services/StatisticsService'

import ValueSlider from '../ValueSlider/ValueSlider'
import uiStatisticSettings from '@/core/uiSettings/statistic'
import country_codes from '@/core/countryCodes.json'
import SlideSelector from '../SlideSelector/SlideSelector'
import LineStat from '../LineStat/LineStat'
import { CountryChart } from '../CountryChart/CountryChart'
import { calculateMedian } from '@/utils/median'
const getMinMax = (
    value: number,
    minMax: { min: number; max: number },
): { min: number; max: number } => {
    if (isNaN(value) || value === Infinity || value === -Infinity) return minMax
    return {
        min: minMax.min < value ? minMax.min : value,
        max: minMax.max > value ? minMax.max : value,
    }
}

// const CountryDescription = (props: { code: string | null; title: string }) => {
//     return (
//         <div>
//             <h2>{props.title}</h2>
//             <div>{props.children}</div>
//         </div>
//     )
// }

type ExtractRecordType<R> = R extends Record<string, infer T> ? T : never
interface MapData {
    [key: string]: {
        value: number
    }
}
interface State {
    inited: boolean
    year: number
    yearMinMax: {
        min: number
        max: number
    }
    valueRange: {
        min: number
        max: number
    }
    compareOptions: { name: string; value: string; id: string }[]
    perfectValue: number
    data: Record<string, CountryYearData>
    statisticName: string
    selectedCounty: string | null
    // mainService: StatisticsService
    allStats: Record<string, StatisticsService>
    uiSettings: ExtractRecordType<typeof uiStatisticSettings>
    isShowInfo: boolean
    countryInfo: {
        code?: string
        title?: string
        description?: { name: string; value: string }[]
    } | null
    mapData: MapData
    charts: {
        [key: string]: {
            value: number
            color: string
            title: string
        }[]
    }
    countriesInChart: string[]
    countryChartData: { title: string; labels: string[]; values: number[] }[],
    isShowListStatistic: boolean
}

// const STAT_TITLES: { [key: string]: string } = {
//     'SH.DTH.IMRT': 'Number of infant deaths',
//     'SP.DYN.CDRT.IN': 'Death rate, crude (per 1,000 people)',
//     'SP.POP.TOTL': 'Population',
//     // 'SP.POP.TOTL': 'Population',
// }
interface Props {
    id? : string
}
// type FromPromise<P> = P extends Promise<infer T> ? T : never
class MapPage extends React.Component<Props, State, object> {
    constructor(props: Props) {
        super(props)
        const statisticName = props.id ?? 'SP.POP.TOTL';
        this.state = {
            inited: false,
            year: 2022,
            yearMinMax: {
                min: Infinity,
                max: -Infinity,
            },
            valueRange: {
                min: Infinity,
                max: -Infinity,
            },
            isShowInfo: false,
            countryInfo: null,
            compareOptions: [],
            mapData: {},
            perfectValue: 0,
            data: {},
            selectedCounty: null,
            // mainService: new StatisticsService(statisticName),
            allStats: {},
            statisticName: statisticName,
            uiSettings: uiStatisticSettings[statisticName],
            charts: {},
            countryChartData: [],
            countriesInChart: [],
            isShowListStatistic: false
        }
    }
    async initialiazation(statisticName: string, year?: number) {
        const allStats = await StatisticsService.getStatisticNames().then(
            (statisticNames) => {
                return statisticNames.reduce(
                    (acc, name) => {
                        return {
                            ...acc,
                            [name]: new StatisticsService(
                                name,
                                uiStatisticSettings[name].name,
                            ),
                        }
                    },
                    {} as State['allStats'],
                )
            },
        )
        console.log(allStats)
        const service = allStats[statisticName]
        if (!service) return

        const allData = await this.loadData(service);
        const minMax = this.getMinMaxYears(allData);
        year = year ?? minMax.max;
        const data = this.getCountriesYearData(allData, year)

        const minMaxValue = this.getMinMaxValue(data);
        const perfectValue = Math.floor(calculateMedian(Object.values(data).map(value => value.yearValue)));
        const mapData = Object.values(data).reduce((acc, dt) => {
            return {
                ...acc,
                [dt.country_code]: {
                    value: dt.yearValue,
                },
            }
        }, {} as MapData)
        const charts = this.getCharts(data);
        console.log('perfectValue',perfectValue)
        this.setState({
            year,
            statisticName,
            allStats,
            data,
            yearMinMax: minMax,
            valueRange: minMaxValue,
            perfectValue: perfectValue,// minMaxValue.min + (minMaxValue.max - minMaxValue.min) / 2,
            uiSettings: uiStatisticSettings[statisticName],
            mapData,
            charts,
            countryChartData: [],
        })
    }

    async changeYearOfCurrentStatistic(year: number) {
        const service = this.state.allStats[this.state.statisticName]
        if (!service) return

        const data = this.getCountriesYearData(service.collection, year)
        const minMaxValue = this.getMinMaxValue(data)
        const mapData = this.getMapDataFromCountyYearData(data)
        const charts = this.getCharts(data)
        let newPerfectValue = this.state.perfectValue;
        if (this.state.perfectValue > minMaxValue.max) {
            newPerfectValue = minMaxValue.max;
        }
        if (this.state.perfectValue < minMaxValue.min) {
            newPerfectValue = minMaxValue.min;
        }

        this.setState({
            data,
            year,
            valueRange: minMaxValue,
            perfectValue: newPerfectValue,
            mapData,
            charts,
        })
    }

    loadData(service: StatisticsService) {
        return service.getAllData()
    }
    getCountriesYearData(
        data: Record<string, CountryData>,
        year: number,
    ): Record<string, CountryYearData> {
        return Object.values(data).reduce(
            (acc, dt) => {
                const {  ...props } = dt
                return {
                    ...acc,
                    [dt.country_code]: {
                        ...props,
                        year: year,
                        yearValue: dt.years[year],
                    },
                }
            },
            {} as Record<string, CountryYearData>,
        )
    }
    getMinMaxYears(data: Record<string, CountryData>): {
        min: number
        max: number
    } {
        let minMax = { min: Infinity, max: -Infinity }
        Object.values(data).forEach((dt) => {
            Object.entries(dt.years).forEach(([year, value]) => {
                if (!country_codes.includes(dt.country_code)) return

                if (isNaN(value) || value === 0) return
                minMax = getMinMax(+year, minMax)
            })
        })
        return minMax
    }
    getMinMaxValue(data: Record<string, CountryYearData>): {
        min: number
        max: number
    } {
        let minMax = { min: Infinity, max: -Infinity }

        Object.values(data).forEach((dt) => {
            if (!country_codes.includes(dt.country_code)) return
            const value = dt.yearValue
            minMax = getMinMax(value, minMax)
        })
        return minMax
    }
    getMapDataFromCountyYearData(
        data: Record<string, CountryYearData>,
    ): MapData {
        return Object.values(data).reduce((acc, dt) => {
            return {
                ...acc,
                [dt.country_code]: {
                    value: dt.yearValue,
                },
            }
        }, {} as MapData)
    }
    componentDidMount(): void {
        this.initialiazation(this.state.statisticName)
    }

    getCharts(data: Record<string, CountryYearData>) {
        const right = Object.values(data)
            .filter((dt) => country_codes.includes(dt.country_code))
            .map((dt) => {
                return {
                    title: dt.country_name,
                    value: dt.yearValue,
                    color: 'green',
                }
            })
            .sort((a, b) => (a.value > b.value ? -1 : 1))
            .slice(0, 20)

        const left = Object.values(data)
            .filter(
                (dt) =>
                    country_codes.includes(dt.country_code) &&
                    dt.yearValue !== 0,
            )
            .map((dt) => {
                return {
                    title: dt.country_name,
                    value: dt.yearValue,
                    color: 'green',
                }
            })
            .sort((a, b) => (a.value < b.value ? -1 : 1))
            .slice(0, 20)
            .sort((a, b) => (a.value < b.value ? -1 : 1))
        return {
            left,
            right,
        }
    }

    async getDataForCountryChart(
        countryCode: string,
    ): Promise<{ title: string; labels: string[]; values: number[] }> {
        const service = this.state.allStats[this.state.statisticName]
        if (!service) return { title: '', labels: [], values: [] }

        const allData = await this.loadData(service)
        if (!allData[countryCode]) return { title: '', labels: [], values: [] }
        const minMaxYears = this.state.yearMinMax
        const result = {
            title: allData[countryCode].country_name,
            labels: [],
            values: [],
        } as { title: string; labels: string[]; values: number[] }

        for (let i = minMaxYears.min; i <= minMaxYears.max; i++) {
            const value = allData[countryCode].years[i.toString()] || 0
            result.labels.push(i.toString())
            result.values.push(value)
        }
        return result
    }

    handlerCompareItemRemove = () => {}
    handlerYear = (year: number | number[]) => {
        if (typeof year === 'number') {
            // this.initialiazation('SH.DTH.IMRT', year)
            this.changeYearOfCurrentStatistic(year)
        }
    }
    handlerChangePerfectValue = (v: number | number[]) => {
        if (typeof v === 'number') {
            this.setState({
                perfectValue: v,
            })
        }
    }
    handlerStatisticsChange = (value: string | number) => {
        if (typeof value === 'string') {
            this.initialiazation(value, this.state.year)
        }
    }
    handlerCountry = async (country: string | null) => {
        if (country) {
            if (!this.state.mapData[country]) return
            if (this.state.countriesInChart.includes(country)) return
            const data = await this.getDataForCountryChart(country)
            this.setState((state) => ({
                selectedCounty: country,
                countriesInChart: [
                    ...state.countriesInChart.slice(0, 1),
                    country,
                ],
                countryChartData: [...state.countryChartData.slice(0, 1), data],
            }))
        }
    }
    handlerCloseCoutryChart = () => {
        this.setState({
            selectedCounty: null,
            countriesInChart: [],
            countryChartData: [],
        })
    }
    handlerClickToggleList = () => {
        this.setState((state) => ({
            isShowListStatistic: !state.isShowListStatistic
        }))
    }
    render() {
        if (!this.state.mapData) return
        return (
            <div className={st.container}>
                <div className={st.map}>
                    <Maps
                        activeValue={''}
                        data={this.state.mapData}
                        perfectValue={this.state.perfectValue}
                        onCountryClick={this.handlerCountry}
                        invertColors={
                            this.state.uiSettings.mainValue.better === 'small'
                        }
                    />
                </div>

                <div className={st.controls}>
                    <div
                        className={cnn({
                            [st.countryChart+'']: true,
                            [st.countryChartActive]: this.state.selectedCounty,
                        }).join(' ')}
                    >
                        {this.state.selectedCounty && (
                            <CountryChart
                                min={this.state.valueRange.min}
                                max={this.state.valueRange.max}
                                data={this.state.countryChartData}
                                onClose={this.handlerCloseCoutryChart}
                                centerTo={this.state.year.toString()}
                            />
                        )}
                    </div>
                    <div
                        className={cnn({
                            [st.controlsStatSelector]: true,
                            [st.controlsStatSelectorActive]:
                                !this.state.selectedCounty,
                        }).join(' ')}
                    >
                        <SlideSelector
                            options={Object.values(this.state.allStats).map(
                                (service) => {
                                    return {
                                        title: service.name,
                                        value: service.statisticsCode,
                                    }
                                },
                            )}
                            value={this.state.statisticName}
                            onChange={this.handlerStatisticsChange}
                        />
                    </div>
                    <div
                        className={cnn({
                            [st.infoBlock]: true,
                            [st.infoBlockShow]: this.state.isShowInfo,
                            [st['infoBlock--compare-active']]:
                                this.state.compareOptions.length,
                        }).join(' ')}
                    >
                        {this.state.countryInfo && (
                            <InfoBlock
                                id={this.state.countryInfo.code!}
                                title={this.state.countryInfo.title}
                                // onAddToCompare={handlerCompare}
                                isShowAddToCompare={true}
                            >
                                {this.state.countryInfo?.description?.map(
                                    (dt) => {
                                        return (
                                            <div key={dt.name}>
                                                {dt.name}: {dt.value}
                                            </div>
                                        )
                                    },
                                )}
                            </InfoBlock>
                        )}
                    </div>

                    <Compare
                        options={this.state.compareOptions}
                        onItemRemove={this.handlerCompareItemRemove}
                    />
                    <div
                        className={st.controlsElement}
                    >
                        <Label description={'Year'} center={true}>
                            <ValueSlider
                                value={this.state.year}
                                min={this.state.yearMinMax.min}
                                max={this.state.yearMinMax.max}
                                step={1}
                                onChange={this.handlerYear}
                            />
                        </Label>
                    </div>
                    <div
                        className={st.controlsElement}
                    >
                        <Label
                            description={
                                this.state.uiSettings.mainValue.inputLabel
                            }
                            center={true}
                        >
                            <ValueSlider
                                value={this.state.perfectValue}
                                min={this.state.valueRange.min}
                                max={this.state.valueRange.max}
                                step={this.state.uiSettings.mainValue.step}
                                onChange={this.handlerChangePerfectValue}
                                formatValue={
                                    this.state.uiSettings.mainValue.format
                                }
                            />
                        </Label>
                    </div>
                </div>

                {this.state.charts.left && !this.state.selectedCounty && this.state.isShowListStatistic && (
                    <div className={st.chartLeft}>
                        <LineStat
                            side={'left'}
                            options={this.state.charts.left}
                        />
                    </div>
                )}
                {this.state.charts.right && !this.state.selectedCounty && this.state.isShowListStatistic && (
                    <div className={st.chart}>
                        <LineStat
                            side={'right'}
                            options={this.state.charts.right}
                        />
                    </div>
                )}
                {!this.state.selectedCounty && (
                    <button className={st.listStatToggle} onClick={this.handlerClickToggleList}>
                    {this.state.isShowListStatistic ? 'Hide statistic list ' : 'Show statistic list'}
                </button>
                )}
                
            </div>
        )
    }
}

export default MapPage
