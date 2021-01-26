import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import StallGrid from '../../components/StallGrid/StallGrid';
import styles from './SearchPage.module.css';
import { Checkbox } from 'semantic-ui-react';
import SearchHeader from '../../components/SearchHeader/SearchHeader';
import Stall from '../../types/Stall';
import { searchStall } from '../../services/stall';

interface SearchParams {
  region: any;
  category: any;
  limit: string;
  page: string;
}

const SearchPage: React.FunctionComponent = () => {
  const history: any = useHistory();
  const queryString = require('query-string');
  const location = useLocation();

  const params = useParams<{ query: string }>();
  const inputSearchParams: SearchParams = queryString.parse(location.search, { arrayFormat: 'comma' });
  if (typeof inputSearchParams.region === 'string') {
    inputSearchParams.region = [inputSearchParams.region];
  } else {
    inputSearchParams.region = Array.isArray(inputSearchParams.region) ? inputSearchParams.region : [];
  }

  if (typeof inputSearchParams.category === 'string') {
    inputSearchParams.category = [inputSearchParams.category];
  } else {
    inputSearchParams.category = Array.isArray(inputSearchParams.category) ? inputSearchParams.category : [];
  }

  const [searchParams, setSearchParams] = useState<SearchParams>(inputSearchParams);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [query, setQuery] = useState<string>(params.query ? params.query : '');

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log(searchParams);
    const currentParams: string = queryString.stringify(searchParams, { arrayFormat: 'comma' });
    searchStall(query, currentParams).then((response) => {
      setStalls(response.data.rows);
    });
  }, [query, queryString, searchParams]);

  function checkLocation(loc: string): boolean {
    return searchParams.region && searchParams.region.includes(loc);
  }

  function checkCategory(cat: string): boolean {
    return searchParams.category && searchParams.category.includes(cat);
  }

  function filterByCategory(e: any, data: any): void {
    const newSearchParams: SearchParams = { ...searchParams };
    if (data.checked) {
      newSearchParams.category.push(data.value);
      setSearchParams(newSearchParams);
      history.push({
        pathname: `/search/`,
        search: queryString.stringify(newSearchParams, { arrayFormat: 'comma' }),
      });
    } else {
      newSearchParams.category = newSearchParams.category.filter((val: string) => val !== data.value);
      setSearchParams(newSearchParams);
      history.push({
        pathname: `/search/`,
        search: queryString.stringify(newSearchParams, { arrayFormat: 'comma' }),
      });
    }
  }

  function filterByLocation(e: any, data: any): void {
    const newSearchParams: SearchParams = { ...searchParams };
    if (data.checked) {
      newSearchParams.region.push(data.value);
      setSearchParams(newSearchParams);
      history.push({
        pathname: `/search/`,
        search: queryString.stringify(newSearchParams, { arrayFormat: 'comma' }),
      });
    } else {
      newSearchParams.region = newSearchParams.region.filter((val: string) => val !== data.value);
      setSearchParams(newSearchParams);
      history.push({
        pathname: `/search/`,
        search: queryString.stringify(newSearchParams, { arrayFormat: 'comma' }),
      });
    }
  }

  return (
    <>
      <SearchHeader isSearchPage={true} setQuery={setQuery} />
      <div className={styles['search-div']}>
        <div className={styles['filter-div']}>
          <div id="checkbox" className={styles['checkbox-div']}>
            <b>Cuisine</b>
            <Checkbox name="cuisine" label="Chinese" value="1" checked={checkCategory('1')} onChange={filterByCategory} />
            <Checkbox name="cuisine" label="Malay" value="4" checked={checkCategory('4')} onChange={filterByCategory} />
            <Checkbox name="cuisine" label="Indian" value="3" checked={checkCategory('3')} onChange={filterByCategory} />
            <Checkbox name="cuisine" label="Western" value="2" checked={checkCategory('2')} onChange={filterByCategory} />
            <Checkbox name="cuisine" label="Japanese" value="6" checked={checkCategory('6')} onChange={filterByCategory} />
            <Checkbox name="cuisine" label="Korean" value="5" checked={checkCategory('5')} onChange={filterByCategory} />
            <Checkbox name="cuisine" label="Thai" value="8" checked={checkCategory('8')} onChange={filterByCategory} />
            <Checkbox name="cuisine" label="Dessert" value="10" checked={checkCategory('10')} onChange={filterByCategory} />
            <b>Location</b>
            <Checkbox name="location" label="North" value="1" checked={checkLocation('1')} onChange={filterByLocation} />
            <Checkbox name="location" label="Northeast" value="5" checked={checkLocation('5')} onChange={filterByLocation} />
            <Checkbox name="location" label="East" value="2" checked={checkLocation('2')} onChange={filterByLocation} />
            <Checkbox name="location" label="West" value="3" checked={checkLocation('3')} onChange={filterByLocation} />
            <Checkbox name="location" label="Central" value="4" checked={checkLocation('4')} onChange={filterByLocation} />
          </div>
        </div>
        <div className={styles['result-div']}>
          <div className={styles['site-content']}>
            <div className={styles['section-search-header-row']}>
              <div className={styles['section-search-header']}>
                <b>{query !== '' ? 'Search result for ' + query : 'All stalls'}</b>
              </div>
            </div>
            <StallGrid stallList={stalls} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;

/*
  useEffect(() => {
    searchStall(query).then((response) => {
      setOriginalStalls(response.data);
      setStalls(filterStalls(response.data));
    });
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setStalls(() => filterStalls(originalStalls));
  }, [ratingFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  function filterStalls(stalls: Stall[]): any {
    return stalls;
    //(cuisineFilter.includes(s.cuisine) ||
    //locationFilter.includes(s.location)) &&
    //s.rating > ratingFilter;
  }

  function filterByCuisine(e: any, data: any): void {
    if (data.checked) {
      setCuisineFilter(() => [...cuisineFilter, data.value]);
    } else {
      setCuisineFilter(() => cuisineFilter.splice(cuisineFilter.indexOf(data.value), 1));
    }
  }

  function filterByLocation(e: any, data: any): void {
    if (data.checked) {
      setLocationFilter(() => [...locationFilter, data.value]);
    } else {
      setLocationFilter(() => locationFilter.splice(locationFilter.indexOf(data.value), 1));
    }
  }

  function filterByRating(e: any): void {
    setRatingFilter(e.target.value);
  }
  */
