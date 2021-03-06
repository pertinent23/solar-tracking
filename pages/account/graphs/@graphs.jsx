import { Fragment } from 'react';
import { Bar, Pie, PolarArea, Doughnut, Line } from 'react-chartjs-2';

const Sizes = {
    width: '300',
    height: '260'
};

const Colors = {
    index: 1 + 0.1,
    yellow: "#E6BD84",
    blue: "#36A4E5",
    pink: "#F9896B",
    orange: "#F7931A",
    text: "#999999",
    dark: "rgba( 19, 21, 27, 1 )",
    background: "rgba( 33, 34, 45, 1 )",
    gradient( context ) {
        const 
            gradient = context.createLinearGradient( 0, 0, 200, 200 );
                gradient.addColorStop( 0.3, Colors.yellow );
                gradient.addColorStop( 0.7, Colors.orange );
        return gradient;
    }
};

export default function Index() {
    return (
        <Fragment />
    );
};

export function DoughnutChart( { data, name, width, height } ) {
    return (
        <Doughnut 
            width={ width || Sizes.width  } 
            height={ height  || Sizes.height  } 
            id="doughnut"
            data={ ( canvas ) => {
                const 
                    context = canvas.getContext( '2d' );
                return {
                    min: 0,
                    max: 250,
                    datasets: [ {
                        data: data,
                        backgroundColor: [ Colors.background, Colors.gradient( context ) ],
                        borderColor: Colors.dark,
                        borderWidth: 5,
                        borderRadius: 10,
                        borderSkipped: false,
                    } ]
                };
            } }

            options={ {
                responsive: false,
                plugins: {
                    title: {
                        display: true,
                        text: name || 'Doughnut',
                        color: Colors.text
                    }
                }
            } }
        />
    )
};

export function PolarChart( { data, name, width, height } ) {
    return (
        <PolarArea
            width={ width || Sizes.width  } 
            height={ height  || Sizes.height  } 
            id="polar"
            data={ ( canvas ) => {
                const 
                    context = canvas.getContext( '2d' );
                return {
                    datasets: [ {
                        data: data,
                        backgroundColor: Colors.gradient( context ),
                        borderColor: Colors.dark,
                        borderWidth: 3,
                        borderRadius: 10,
                        borderSkipped: false,
                    } ],
                    labels: data,
                };
            } }

            options={ {
                scales: {
                    r: { display: false },
                },
                responsive: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: name || 'Diagramme polaire',
                        color: Colors.text
                    }
                }
            } }
        />
    )
};

export function VerticalBarChart( { data, name, width, height } ) {
    return (
        <Bar
            width={ width || Sizes.width  } 
            height={ height  || Sizes.height  } 
            id="vbar"
            data={ ( canvas ) => {
                const 
                    context = canvas.getContext( '2d' );
                return {
                    datasets: [ {
                        data: data,
                        backgroundColor: Colors.gradient( context ),
                        borderColor: Colors.dark,
                        borderWidth: 3,
                        borderRadius: 10,
                        borderSkipped: false,
                    } ],
                    labels: data,
                };
            } }

            options={ {
                indexAxis: 'x',
                responsive: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text:  name || 'Diagramme en batton',
                        color: Colors.text
                    }
                }
            } }
        />
    )
};

export function HorizontalBarChart( { data, name, width, height } ) {
    return (
        <Bar
            width={ width || Sizes.width  } 
            height={ height  || Sizes.height  } 
            id="hbar"
            data={ ( canvas ) => {
                const 
                    context = canvas.getContext( '2d' );
                return {
                    datasets: [ {
                        data: data,
                        backgroundColor: Colors.gradient( context ),
                        borderColor: Colors.dark,
                        borderWidth: 3,
                        borderRadius: 10,
                        borderSkipped: false,
                    } ],
                    labels: data,
                };
            } }

            options={ {
                indexAxis: 'y',
                responsive: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text:  name || 'Diagramme en batton',
                        color: Colors.text
                    }
                }
            } }
        />
    )
};

export function LineChart( { data, name, width, height } ) {
    return (
        <Line
            width={ width || Sizes.width  } 
            height={ height  || Sizes.height  } 
            id="line"
            data={ ( canvas ) => {
                const 
                    context = canvas.getContext( '2d' );
                return {
                    datasets: [ {
                        data: data,
                        backgroundColor: Colors.gradient( context ),
                        borderColor: Colors.dark,
                        fill: true,
                        borderRadius: 10,
                        borderSkipped: false,
                    } ],
                    labels: data,
                };
            } }

            options={ {
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                responsive: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: name || 'line',
                        color: Colors.text
                    }
                }
            } }
        />
    )
};

export function PieChart( { data, name, width, height } ) {
    return (
        <Pie
            width={ width || Sizes.width  } 
            height={ height  || Sizes.height  } 
            id="pie"
            data={ ( canvas ) => {
                const 
                    context = canvas.getContext( '2d' );
                return {
                    datasets: [ {
                        data: data,
                        backgroundColor: Colors.gradient( context ),
                        borderColor: Colors.dark,
                        borderWidth: 3,
                        borderRadius: 10,
                        borderSkipped: false,
                    } ],
                    labels: data,
                };
            } }

            options={ {
                responsive: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: name || 'Diagramme circulaire',
                        color: Colors.text
                    }
                }
            } }
        />
    )
};