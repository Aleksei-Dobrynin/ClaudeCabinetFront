export interface CountryPhone {
  id: string;
  name: string;
  code: string;
  phoneCode: string;
  phoneFormat: string;
  flagIcon?: string;
  index: number; // Added index property
}

export const DEFAULT_COUNTRIES: CountryPhone[] = [
  {
    id: 'kg',
    name: 'Kyrgyzstan',
    code: 'KG',
    phoneCode: '+996',
    phoneFormat: '000-00-00-00',
    flagIcon: '/flags/kg.png',
    index: 1, // Added index
  },
  {
    id: 'ru',
    name: 'Russia',
    code: 'RU',
    phoneCode: '+7',
    phoneFormat: '000-000-00-00',
    flagIcon: '/flags/ru.png',
    index: 2, // Added index
  },
  {
    id: 'kz',
    name: 'Kazakhstan',
    code: 'KZ',
    phoneCode: '+7',
    phoneFormat: '000-000-00-00',
    flagIcon: '/flags/kz.png',
    index: 3, // Added index
  },
  {
    id: 'us',
    name: 'United States',
    code: 'US',
    phoneCode: '+1',
    phoneFormat: '000-000-0000',
    flagIcon: '/flags/us.png',
    index: 4, // Added index
  },
  {
    id: 'cn',
    name: 'China',
    code: 'CN',
    phoneCode: '+86',
    phoneFormat: '000-0000-0000',
    flagIcon: '/flags/cn.png',
    index: 5, // Added index
  },
  {
    id: 'de',
    name: 'Germany',
    code: 'DE',
    phoneCode: '+49',
    phoneFormat: '000-0000000',
    flagIcon: '/flags/de.png',
    index: 6, // Added index
  },
  {
    id: 'gb',
    name: 'United Kingdom',
    code: 'GB',
    phoneCode: '+44',
    phoneFormat: '000-0000-0000',
    flagIcon: '/flags/gb.png',
    index: 7, // Added index
  },
  {
    id: 'fr',
    name: 'France',
    code: 'FR',
    phoneCode: '+33',
    phoneFormat: '0-00-00-00-00',
    flagIcon: '/flags/fr.png',
    index: 8, // Added index
  },
  {
    id: 'tr',
    name: 'Turkey',
    code: 'TR',
    phoneCode: '+90',
    phoneFormat: '000-000-0000',
    flagIcon: '/flags/tr.png',
    index: 9, // Added index
  },
  {
    id: 'uz',
    name: 'Uzbekistan',
    code: 'UZ',
    phoneCode: '+998',
    phoneFormat: '00-000-0000',
    flagIcon: '/flags/uz.png',
    index: 10, // Added index
  },
  {
    id: 'tj',
    name: 'Tajikistan',
    code: 'TJ',
    phoneCode: '+992',
    phoneFormat: '00-000-0000',
    flagIcon: '/flags/tj.png',
    index: 11, // Added index
  },
  {
    id: 'tm',
    name: 'Turkmenistan',
    code: 'TM',
    phoneCode: '+993',
    phoneFormat: '0-000-0000',
    flagIcon: '/flags/tm.png',
    index: 12, // Added index
  },
  {
    id: 'ae',
    name: 'United Arab Emirates',
    code: 'AE',
    phoneCode: '+971',
    phoneFormat: '00-000-0000',
    flagIcon: '/flags/ae.png',
    index: 13, // Added index
  },
  {
    id: 'in',
    name: 'India',
    code: 'IN',
    phoneCode: '+91',
    phoneFormat: '00000-00000',
    flagIcon: '/flags/in.png',
    index: 14, // Added index
  },
  {
    id: 'jp',
    name: 'Japan',
    code: 'JP',
    phoneCode: '+81',
    phoneFormat: '00-0000-0000',
    flagIcon: '/flags/jp.png',
    index: 15, // Added index
  },
];
