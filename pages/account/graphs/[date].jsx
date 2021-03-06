import { Fragment } from 'react';
import PageRoot from '../@account-root';
import { getUserData } from './../@request';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'cookie';
import axios from 'axios';
import { DoughnutChart, PolarChart, VerticalBarChart, HorizontalBarChart, LineChart, PieChart } from './@graphs';

const Tools = {
    list: [],
    sorted: [],
    date( text ) {
        const 
            obj = new Date( text );
        return {
            month: obj.getMonth() + 1,
            day: obj.getDate(),
            year: obj.getFullYear(),
            hour: obj.getHours(),
            isSameMonth( date ){
                return this.s2 === date.s2;
            },
            isSameYear( date ) {
                return this.year = date.year;
            },
            isSameHour( date ) {
                return this.s4 === date.s4;
            },
            isSameDay( date ) {
                return this.s3 === date.s3;
            },
            get s4(){
                return `${this.day}/${this.month}/${this.year}/${this.hour}`;
            },
            get s3(){
                return `${this.day}/${this.month}/${this.year}`;
            },
            get s2(){
                return `${this.day}/${this.month}`;
            }
        }
    },
    push( data ) {
        return this.list.push( {
            date: this.date( data.created_at ),
            value: data.data
        } );
    },
    pushAll( list ) {
        for( const item of list )
            this.push( item ); 
    },
    sort() {
        let     
            current = '',
            temp = [],
            hour = [],
            day = [],
            month = [],
            year = [];
                for( const item of this.list ) {
                    if ( !current ) {
                        temp.date = item.date;
                            current = item.date;
                        temp.push( item );
                    } else {
                        if ( !item.date.isSameHour( current ) ) {
                            temp.date = current;
                                hour.push( temp );
                            temp = [ ];
                        }
                        current = temp.date = item.date;
                        temp.push( item );
                    }
                }
                if ( temp.length != 0 )
                    hour.push( temp );
                current = '';
                temp = [ ];
                for( const item of hour ) {
                    if ( !current ) {
                        current = temp.date = item.date;
                        temp.push( item );
                    } else {
                        if ( !item.date.isSameDay( current ) ) {
                            temp.date = current;
                                day.push( temp );
                            temp = [ ];
                        }
                        current = temp.date = item.date;
                        temp.push( item );
                    }
                }
                if ( temp.length != 0 )
                    day.push( temp );
                current = '';
                temp = [ ];
                for( const item of day ) {
                    if ( !current ) {
                        current = temp.date = item.date;
                        temp.push( item );
                    } else {
                        if ( !item.date.isSameMonth( current ) ) {
                            temp.date = current;
                                month.push( temp );
                            temp = [ ];
                        }
                        current = temp.date = item.date;
                        temp.push( item );
                    }
                }
                if ( temp.length != 0 )
                    month.push( temp );
                current = '';
                temp = [ ];
                for( const item of month ) {
                    if ( !current ) {
                        current = temp.date = item.date;
                        temp.push( item );
                    } else {
                        if ( !item.date.isSameYear( current ) ) {
                            temp.date = current;
                                year.push( temp );
                            temp = [ ];
                        }
                        current = temp.date = item.date;
                        temp.push( item );
                    }
                }
                if ( temp.length != 0 )
                    year.push( temp );
            this.sorted = year;
        return this;
    }, 
    analyseAll( nowAre, before ) {
        let 
            doughnut, polar = [], bar, point = [];
            if ( before.length === 0 )
                doughnut = [ 100, 0 ];
            else {
                let 
                    part = before.length > nowAre.length ? ( nowAre.length * 100 ) / before.length : ( before.length * 100 ) / nowAre.length;
                doughnut = [ part, 100 - part ];
            }
            bar = [];
            nowAre.map( function ( val ) {
                polar.push( val.length );
                    bar.push( val.length );
                point.push( val.length );  
            } );
        return {
            doughnut: this.stabilyze( doughnut ),
            polar: this.stabilyze( polar ),
            bar: this.stabilyze( bar ),
            point: this.stabilyze( point )
        };
    },
    stabilyze( arr ) {
        const 
            max = Math.max.apply( Math, arr );
        return arr.map( function ( value ) {
            return Math.round( ( value * 100 ) / max );
        } );
    },
    analyseLast( nowAre, before ) {
        let 
            doughnut, polar = [], bar, point = [];
            if ( before.length === 0 )
                doughnut = [ 100, 0 ];
            else {
                let 
                    part = before.length > nowAre.length ? ( nowAre.length * 100 ) / before.length : ( before.length * 100 ) / nowAre.length;
                doughnut = [ part, 100 - part ];
            }
            bar = [];
            nowAre.map( function ( val ) {
                polar.push( val.value );
                    bar.push( val.value );
                point.push( val.value );  
            } );
        return {
            doughnut: this.stabilyze( doughnut ),
            polar: this.stabilyze( polar ),
            bar: this.stabilyze( bar ),
            point: this.stabilyze( point )
        };
    },
    getDataFor( type ) {
        let 
            data = this.sorted,
            year = data.pop(),
            month = year.pop(),
            day = month.pop(),
            hour = day.pop();
                Tools.day = 1;
                for( const i in day )
                    Tools.day += i.length;
                Tools.month = Tools.day * 30;
                Tools.year = Tools.month * 12;
        if ( type === 'year' || type === 'month' || type === 'day' ) {
            if ( type === 'year' ) {
                return this.analyseAll( year, data.pop() || [ ] );
            } else {
                if ( type === 'month' ) {
                    return this.analyseAll( month, year.pop() || [ ] );
                } else {
                    return this.analyseAll( day, month.pop() || [ ] );
                }
            }
        } else if ( type === 'last' ) {
            return this.analyseLast( hour, day.pop() || [ ] );
        }
    },
    data( tables, type ) {
        this.pushAll( tables );
            this.sort();
        return this.getDataFor( type );
    }
};

export function Item( { id, date, text } ) {
    return (
        <Link href={ "/account/graphs/".concat( id ).concat( "?k=" + Item.k ) }>
            <a className={ "nav-item px-4 py-3 ".concat( id === date ? 'active': '' ) }> { text } </a>
        </Link>
    );
};

export function Nav( { date } ) {
    const obj = new Date();
    return (
        <div className="content-nav d-flex flex-column align-items-end mx-3">
            <div className="nav-brand py-3 pl-2 pt-4"> Statistique </div>
            <div className="container-fluid px-0 d-flex justify-content-between align-items-center">
                <div className="date d-flex justify-content-center align-items-center mr-4">
                    <div className="data-icon">
                        <div className="data-icon-item mb-1">
                            <Image layout="fill" src="/img/menu/calendar3.svg" alt="nav-icon" className="img" />
                        </div>
                    </div>
                    <div className="date-content pl-3"> { obj.getDate() }/{ obj.getMonth() + 1 }/{ obj.getFullYear() } </div>
                </div>
                <div className="nav d-block">
                    <Item id="last" text="Derni??res" date={ date }/>
                    <Item id="day" text="Aujourd'hui" date={ date }/>
                    <Item id="month" text="Mois" date={ date }/>
                    <Item id="year" text="Ann??e" date={ date }/>
                </div>
            </div>
        </div>
    );
};

export function AddData( { chartData } ) {
    return (
        <div className="text-light container-fluid py-4 px-3 px-md-3">
            <div className="part-title py-2"> Progression </div>
            <div className="row d-flex flex-column flex-lg-row py-3">
                <div className="col mx-lg-1 py-2">
                    <div className="content-chart shadow p-3">
                        <DoughnutChart data={ chartData.doughnut } />
                    </div>
                </div>
                <div className="col-12 col-lg-6 mx-lg-1 py-2">
                    <div className="content-chart shadow p-3">
                        <PolarChart data={ chartData.polar } />
                    </div>
                </div>
            </div>
            <div className="part-title py-2"> Donn??es </div>
            <div className="row d-flex flex-column flex-lg-row py-3">
                <div className="col mx-lg-1 py-2">
                    <div className="content-chart shadow p-3">
                        <VerticalBarChart data={ chartData.bar } />
                    </div>
                </div>
                <div className="col-12 col-lg-6 mx-lg-1 py-2">
                    <div className="content-chart shadow p-3">
                        <LineChart data={ chartData.point } />
                    </div>
                </div>
            </div>
            <div className="row d-flex flex-column flex-lg-row py-3">
                <div className="col mx-lg-1 py-2">
                    <div className="content-chart shadow p-3">
                        <PieChart data={ chartData.point } />
                    </div> 
                </div>
                <div className="col-12 col-lg-6 mx-lg-1 py-2">
                    <div className="content-chart shadow p-3">
                        <HorizontalBarChart data={ chartData.bar } />
                    </div>
                </div>
            </div>
            <div className="part-title py-2"> Enregistrment </div>
            <div className="content-save container-fluid d-flex justify-content-center py-3">
                <div className="save d-flex flex-column justidy-content-center align-items-center mx-3 my-3 px-5 py-2 shadow">
                    <div className="data"> { Tools.day } </div>
                    <div className="name"> { "Ajourd'hui" } </div>
                </div>
                <div className="save d-flex flex-column justidy-content-center align-items-center mx-3 my-3 px-5 py-2 shadow">
                    <div className="data"> { Tools.month } </div>
                    <div className="name"> Ce mois </div>
                </div>
                <div className="save d-flex flex-column justidy-content-center align-items-center mx-3 my-3 px-5 py-2 shadow">
                    <div className="data"> { Tools.year } </div>
                    <div className="name"> Cette ann??e </div>
                </div>
            </div>
        </div>
    );
};

export const page = "graphs";
/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Index( { date, user, k, tables } ) {
    const data = Tools.data( tables, date );
    Item.k = k;
    return (
        <Fragment>
            <PageRoot page={ page } userdata={ user }>
                <Nav date={ date } />
                <AddData chartData={ data } />
            </PageRoot>
        </Fragment>
    );
};

export async function getServerSideProps( context ) {
    const 
        cook = Cookies.parse( context.req.headers.cookie ),
        { k } = context.query,
        { access_token } = JSON.parse( cook.data ),
        user = await getUserData( access_token, context.res ),
        url = "/userdatanodenetwork/"+ encodeURIComponent( k ) + "/",
        tables = ( await axios.get( url, {
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        } ) ).data;
    return {
        props: {
            k,
            user: user,
            date: context.query.date,
            tables
        }
    };
};