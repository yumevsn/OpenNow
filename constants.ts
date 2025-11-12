import { Business, BusinessType, Day } from './types';

export const LOCATIONS: { [city: string]: string[] } = {
  Harare: [
    'CBD', 'Avondale', 'Belgravia', 'Borrowdale', 'Chisipite', 'Eastlea',
    'Glen Lorne', 'Greendale', 'Highlands', 'Hillside', 'Mabelreign',
    'Milton Park', 'Mount Pleasant', 'Newlands', 'Waterfalls', 'Westgate',
    'Highfield', 'Glen View', 'Budiriro'
  ],
  Bulawayo: [
    'CBD', 'Belmont', 'Bradfield', 'Burnside', 'Famona', 'Hillcrest',
    'Hillside', 'Kumalo', 'Matsheumhlope', 'Morningside', 'North End',
    'Paddonhurst', 'Suburbs'
  ],
  Mutare: [
    'CBD', 'Darlington', 'Fairbridge Park', 'Florida', 'Greenside',
    'Morningside', 'Palmerston', 'Yeovil'
  ],
  Gweru: [
    'CBD', 'Kopje', 'Lundi Park', 'Mkoba', 'Nashville', 'Ridgemont', 'Southdowns'
  ],
  Kwekwe: ['CBD', 'Amaveni', 'Masasa Park', 'Mbizo', 'Redcliff'],
  Masvingo: ['CBD', 'Mucheke', 'Rhodene', 'Rujeko'],
  Chinhoyi: ['CBD', 'Hunyani', 'Mzari'],
  Kadoma: ['CBD', 'Eiffel Flats', 'Rimuka'],
  Marondera: ['CBD', 'Cherutombo', 'Paradise'],
  'Victoria Falls': ['Town Centre', 'Chinotimba', 'Low Density Suburbs'],
  Hwange: ['Town Centre', 'Baobab', 'Empumalanga'],
  Beitbridge: ['Town Centre', 'Dulivhadzimu'],
  Bindura: ['CBD', 'Chipadze', 'Aerodrome'],
};


export const BUSINESS_TYPES: (BusinessType | 'All')[] = [
  'All',
  BusinessType.Supermarket,
  BusinessType.Pharmacy,
  BusinessType.Restaurant,
];

export const DAYS_OF_WEEK: Day[] = [
  Day.Mon,
  Day.Tue,
  Day.Wed,
  Day.Thu,
  Day.Fri,
  Day.Sat,
  Day.Sun,
];

export const SAMPLE_BUSINESSES: Business[] = [
  {
    id: 1,
    name: 'OK Mart',
    type: BusinessType.Supermarket,
    branches: [
      {
        id: 101,
        address: '123 Samora Machel Ave, Harare',
        city: 'Harare',
        area: 'CBD',
        latitude: -17.824,
        longitude: 31.049,
        schedule: {
          [Day.Mon]: { open: '8 AM', close: '8 PM' },
          [Day.Tue]: { open: '8 AM', close: '8 PM' },
          [Day.Wed]: { open: '8 AM', close: '8 PM' },
          [Day.Thu]: { open: '8 AM', close: '8 PM' },
          [Day.Fri]: { open: '8 AM', close: '9 PM' },
          [Day.Sat]: { open: '9 AM', close: '7 PM' },
          [Day.Sun]: { open: '9 AM', close: '5 PM' },
        },
      },
    ],
  },
  {
    id: 2,
    name: 'Alpha Pharmacy',
    type: BusinessType.Pharmacy,
    branches: [
      {
        id: 201,
        address: '456 Jason Moyo St, Bulawayo',
        city: 'Bulawayo',
        area: 'CBD',
        latitude: -20.151,
        longitude: 28.586,
        schedule: {
          [Day.Mon]: { open: '9 AM', close: '7 PM' },
          [Day.Tue]: { open: '9 AM', close: '7 PM' },
          [Day.Wed]: { open: '9 AM', close: '7 PM' },
          [Day.Thu]: { open: '9 AM', close: '7 PM' },
          [Day.Fri]: { open: '9 AM', close: '7 PM' },
          [Day.Sat]: { open: '10 AM', close: '1 PM' },
          [Day.Sun]: null,
        },
      },
      {
        id: 202,
        address: 'Shop 5, Avondale Shopping Centre, Harare',
        city: 'Harare',
        area: 'Avondale',
        latitude: -17.795,
        longitude: 31.02,
        schedule: {
          [Day.Mon]: { open: '8 AM', close: '8 PM' },
          [Day.Tue]: { open: '8 AM', close: '8 PM' },
          [Day.Wed]: { open: '8 AM', close: '8 PM' },
          [Day.Thu]: { open: '8 AM', close: '8 PM' },
          [Day.Fri]: { open: '8 AM', close: '8 PM' },
          [Day.Sat]: { open: '9 AM', close: '5 PM' },
          [Day.Sun]: { open: '10 AM', close: '4 PM' },
        },
      },
    ],
  },
  {
    id: 3,
    name: 'Gweru Pizzeria',
    type: BusinessType.Restaurant,
    branches: [
      {
        id: 301,
        address: '789 Robert Mugabe Way, Gweru',
        city: 'Gweru',
        area: 'CBD',
        latitude: -19.458,
        longitude: 29.815,
        schedule: {
          [Day.Mon]: null,
          [Day.Tue]: { open: '5 PM', close: '10 PM' },
          [Day.Wed]: { open: '5 PM', close: '10 PM' },
          [Day.Thu]: { open: '5 PM', close: '10 PM' },
          [Day.Fri]: { open: '4 PM', close: '11 PM' },
          [Day.Sat]: { open: '4 PM', close: '11 PM' },
          [Day.Sun]: { open: '4 PM', close: '9 PM' },
        },
      },
    ],
  },
  {
    id: 4,
    name: 'Mutare Books & Coffee',
    type: BusinessType.Restaurant,
    branches: [
      {
        id: 401,
        address: '101 Herbert Chitepo St, Mutare',
        city: 'Mutare',
        area: 'CBD',
        latitude: -18.973,
        longitude: 32.671,
        schedule: {
          [Day.Mon]: { open: '7 AM', close: '6 PM' },
          [Day.Tue]: { open: '7 AM', close: '6 PM' },
          [Day.Wed]: { open: '7 AM', close: '6 PM' },
          [Day.Thu]: { open: '7 AM', close: '6 PM' },
          [Day.Fri]: { open: '7 AM', close: '8 PM' },
          [Day.Sat]: { open: '8 AM', close: '8 PM' },
          [Day.Sun]: { open: '8 AM', close: '4 PM' },
        },
      },
    ],
  },
  {
    id: 5,
    name: 'TM Pick n Pay',
    type: BusinessType.Supermarket,
    branches: [
      {
        id: 501,
        address: '212 Fife St, Bulawayo',
        city: 'Bulawayo',
        area: 'Hillcrest',
        latitude: -20.165,
        longitude: 28.601,
        schedule: {
          [Day.Mon]: { open: '7 AM', close: '10 PM' },
          [Day.Tue]: { open: '7 AM', close: '10 PM' },
          [Day.Wed]: { open: '7 AM', close: '10 PM' },
          [Day.Thu]: { open: '7 AM', close: '10 PM' },
          [Day.Fri]: { open: '7 AM', close: '10 PM' },
          [Day.Sat]: { open: '7 AM', close: '10 PM' },
          [Day.Sun]: { open: '7 AM', close: '10 PM' },
        },
      },
    ],
  },
  {
    id: 6,
    name: 'Food World',
    type: BusinessType.Supermarket,
    branches: [
      {
        id: 601,
        address: '10 Nelson Mandela Ave, Kwekwe',
        city: 'Kwekwe',
        area: 'CBD',
        latitude: -18.924,
        longitude: 29.812,
        schedule: {
          [Day.Mon]: { open: '8 AM', close: '7 PM' },
          [Day.Tue]: { open: '8 AM', close: '7 PM' },
          [Day.Wed]: { open: '8 AM', close: '7 PM' },
          [Day.Thu]: { open: '8 AM', close: '7 PM' },
          [Day.Fri]: { open: '8 AM', close: '7 PM' },
          [Day.Sat]: { open: '8 AM', close: '5 PM' },
          [Day.Sun]: { open: '9 AM', close: '1 PM' },
        },
      },
    ],
  },
  {
    id: 7,
    name: 'The Lookout Cafe',
    type: BusinessType.Restaurant,
    branches: [
      {
        id: 701,
        address: 'Batoka Gorge, Victoria Falls',
        city: 'Victoria Falls',
        area: 'Town Centre',
        latitude: -17.925,
        longitude: 25.85,
        schedule: {
          [Day.Mon]: { open: '10 AM', close: '10 PM' },
          [Day.Tue]: { open: '10 AM', close: '10 PM' },
          [Day.Wed]: { open: '10 AM', close: '10 PM' },
          [Day.Thu]: { open: '10 AM', close: '10 PM' },
          [Day.Fri]: { open: '10 AM', close: '11 PM' },
          [Day.Sat]: { open: '10 AM', close: '11 PM' },
          [Day.Sun]: { open: '10 AM', close: '10 PM' },
        },
      },
    ],
  },
  {
    id: 8,
    name: 'CureChem Pharmacy',
    type: BusinessType.Pharmacy,
    branches: [
      {
        id: 801,
        address: '33 Robert Mugabe Rd, Masvingo',
        city: 'Masvingo',
        area: 'CBD',
        latitude: -20.074,
        longitude: 30.829,
        schedule: {
          [Day.Mon]: { open: '8 AM', close: '9 PM' },
          [Day.Tue]: { open: '8 AM', close: '9 PM' },
          [Day.Wed]: { open: '8 AM', close: '9 PM' },
          [Day.Thu]: { open: '8 AM', close: '9 PM' },
          [Day.Fri]: { open: '8 AM', close: '9 PM' },
          [Day.Sat]: { open: '8 AM', close: '9 PM' },
          [Day.Sun]: { open: '9 AM', close: '6 PM' },
        },
      },
    ],
  },
];