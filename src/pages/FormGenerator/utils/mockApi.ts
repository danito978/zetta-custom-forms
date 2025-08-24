// Mock API for Bulgarian cities auto-fill
export interface CityData {
  city: string;
  region: string;
  postalCode: string;
  population: number;
}

// Mock Bulgarian cities data
const bulgarianCitiesData: Record<string, CityData> = {
  'sofia': {
    city: 'Sofia',
    region: 'Sofia City',
    postalCode: '1000',
    population: 1400000
  },
  'plovdiv': {
    city: 'Plovdiv',
    region: 'Plovdiv',
    postalCode: '4000',
    population: 346893
  },
  'varna': {
    city: 'Varna',
    region: 'Varna',
    postalCode: '9000',
    population: 335177
  },
  'burgas': {
    city: 'Burgas',
    region: 'Burgas',
    postalCode: '8000',
    population: 202694
  },
  'ruse': {
    city: 'Ruse',
    region: 'Ruse',
    postalCode: '7000',
    population: 142902
  },
  'stara zagora': {
    city: 'Stara Zagora',
    region: 'Stara Zagora',
    postalCode: '6000',
    population: 138272
  },
  'pleven': {
    city: 'Pleven',
    region: 'Pleven',
    postalCode: '5800',
    population: 106954
  },
  'sliven': {
    city: 'Sliven',
    region: 'Sliven',
    postalCode: '8800',
    population: 91620
  },
  'dobrich': {
    city: 'Dobrich',
    region: 'Dobrich',
    postalCode: '9300',
    population: 89481
  },
  'shumen': {
    city: 'Shumen',
    region: 'Shumen',
    postalCode: '9700',
    population: 80855
  }
};

/**
 * Mock API call to fetch city data
 * Simulates network delay and potential failures
 */
export const fetchCityData = async (cityName: string): Promise<CityData | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
  
  // Normalize city name for lookup
  const normalizedCity = cityName.toLowerCase().trim();
  
  // Return city data if found
  return bulgarianCitiesData[normalizedCity] || null;
};

/**
 * Get all available Bulgarian cities for autocomplete
 */
export const getBulgarianCities = (): string[] => {
  return Object.values(bulgarianCitiesData).map(city => city.city);
};
