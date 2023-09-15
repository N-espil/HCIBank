import React, { useEffect, useRef, useState, useContext } from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function Graph({ transactions, session }) {
    //console.log("GRAPH",transactions)
    const chartRef = useRef(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    // const { graphLoading, setGraphLoading } = useContext(context);
    const [chartWidth, setChartWidth] = useState(null);
    const [chartHeight, setChartHeight] = useState(null);

    const dummyTransactions = [
        { date: 'Sun Jan 01 2023 12:00:00 GMT+0400 (Gulf Standard Time)', balance: 1000 },
        { date: 'Mon Feb 13 2023 05:30:00 GMT+0400 (Gulf Standard Time)', balance: 1300 },
        { date: 'Sat Mar 25 2023 19:00:00 GMT+0400 (Gulf Standard Time)', balance: 1500 },
        { date: 'Wed May 10 2023 08:15:00 GMT+0400 (Gulf Standard Time)', balance: 1800 },
        { date: 'Fri Jun 23 2023 22:45:00 GMT+0400 (Gulf Standard Time)', balance: 2200 },
        { date: 'Tue Aug 08 2023 14:00:00 GMT+0400 (Gulf Standard Time)', balance: 2400 },
        { date: 'Thu Sep 21 2023 03:30:00 GMT+0400 (Gulf Standard Time)', balance: 2800 },
        { date: 'Sat Nov 04 2023 17:00:00 GMT+0400 (Gulf Standard Time)', balance: 3200 },
        { date: 'Mon Dec 18 2023 10:30:00 GMT+0400 (Gulf Standard Time)', balance: 2800 },
        { date: 'Sat Jan 06 2024 02:00:00 GMT+0400 (Gulf Standard Time)', balance: 3500 }
    ]



    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);

        }
    }, []);

    useEffect(() => {
        setChartHeight(responsiveHeight());
        setChartWidth(responsiveWidth());
    }, [width, height]);

    // useEffect(() => {
    //     if (chartWidth && chartHeight) {
    //         setGraphLoading(false);
    //     }
    // }, [chartWidth, chartHeight]);

    function handleResize() {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }



    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function responsiveWidth() {
        if (width <= 1024) {
            return 800
        }
        if (width <= 1100) {
            return 800
        }
        if (width <= 1200) {
            return 850
        }
        if (width <= 1250) {
            return 900
        }
        if (width <= 1280) {
            return 1000
        }
        if (width <= 1440) {
            return 600
        }
        else {
            return 850
        }

    }

    function responsiveHeight() {
        if (width <= 1280) {
            return 235
        }
        if (width <= 1366) {
            return 265
        }
        if (width <= 1500) {
            return 310
        }
        else {
            return 400
        }

    }

    function getData() {
        if (transactions.length <= 1) {
            return dummyTransactions.map(({ date, balance }) => ([new Date(date).getTime(), balance]))
        }
        else {
            // transactions.unshift()
            return transactions.map(({ date, toBalance, fromBalance, toName }) => ([new Date(date).getTime(), session.user.username == toName ? toBalance : fromBalance]))
        }
    }


    return (
        <>


            <div ref={chartRef} className={`${transactions.length <= 1 ? "pointer-events-none" : ""} relative`} >
                {transactions.length <= 1 &&
                    <div className={`absolute z-50 w-full h-full flex flex-col items-center justify-center`}>
                        <h1 className='font-medium text-center lg:text-lg 4xl:text-4xl text-[#D7D7D7] '>No transactions available to display...</h1>
                    </div>
                }
                <div className={`${transactions.length <= 1 ? "opacity-40" : ""}`}>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={{

                            legend: {
                                enabled: false
                            },
                            chart: {
                                type: 'line',
                                backgroundColor: "#242529",
                                height: chartHeight,
                                width: chartWidth
                            },

                            title: {
                                text: ''
                            },
                            xAxis: {
                                type: 'datetime',
                                gridLineColor: '#6A747C',
                                lineColor: '#6A747C',
                                tickColor: '#6A747C',
                                title: {
                                    text: '',
                                    style: {
                                        color: '#9A82BF'
                                    }

                                },
                                labels: {
                                    style: {
                                        color: '#6A747C'
                                    }
                                }
                            },
                            yAxis: {
                                gridLineColor: '#6A747C',
                                tickAmount: 5,
                                title: {
                                    text: '',
                                    style: {
                                        color: '#9A82BF'
                                    }
                                },
                                labels: {
                                    style: {
                                        color: '#6A747C'
                                    }
                                }
                            },
                            series: [{
                                name: 'Balance',
                                lineColor: '#9A82BF',
                                color: '#9A82BF',
                                lineWidth: 4,
                                data: getData()
                            }],
                            // responsive: {
                            //     rules: [{
                            //         condition: {
                            //             maxWidth: 200,
                            //         },
                            //         chartOptions: {
                            //             legend: {
                            //                 enabled: false
                            //             }
                            //         }
                            //     }]
                            // }
                        }}
                    />
                </div>

            </div>
        </>

    )
}
