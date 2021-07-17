import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import qs from 'qs';

import GeneralContext from '../../context/GeneralContext';

import styles from '../../styles/Modal/AdvanceSearch.module.css';

import { CrossIcon } from '../../utils/icons';

export default function AdvanceSearch() {
  const router = useRouter();

  const [filters, setFilters] = useState([]);
  const [sort, setSort] = useState('title:ASC');

  const {
    modal: { hideModal },
  } = useContext(GeneralContext);

  const submitHandler = (event) => {
    event.preventDefault();

    const search = JSON.parse(localStorage.getItem('search'));
    const query = { _where: filters, _sort: sort };
    localStorage.setItem('query', JSON.stringify(query));

    if (search) {
      query._q = search;
    }

    hideModal();
    router.push(`/search?${qs.stringify(query)}`);
  };

  const resetHandler = () => {
    setFilters([]);
    setSort('title:ASC');
    localStorage.removeItem('query');
  };

  const checkHandler = (event, q) => {
    if (!event.target.checked) {
      setFilters([...filters.filter((item) => Object.keys(item)[0] !== Object.keys(q)[0])]);
    } else {
      setFilters([...filters, q]);
    }
  };

  useEffect(() => {
    const query = JSON.parse(localStorage.getItem('query'));

    if (query) {
      setFilters(query._where);
      setSort(query._sort);
    }
  }, []);

  return (
    <div className={styles.modalBody} onMouseDown={(event) => event.stopPropagation()}>
      <button type="button" className="close" onClick={hideModal}>
        <CrossIcon />
      </button>

      <form className={styles.advanceSearch} onSubmit={submitHandler}>
        <div>
          <label htmlFor="available">Show available products only</label>
          <input
            type="checkbox"
            name="available"
            id="available"
            checked={!!filters.find((item) => Object.keys(item)[0] === 'stock_gt')}
            onChange={(event) => checkHandler(event, { stock_gt: 0 })}
          />
        </div>
        <div>
          <label htmlFor="sort">Sort</label>
          <select name="sort" id="sort" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="title:ASC">Alphabetical (A - Z)</option>
            <option value="title:DESC">Alphabetical (Z - A)</option>
            <option value="price:ASC">Price (Low - High)</option>
            <option value="price:DESC">Price (High - Low)</option>
            <option value="updatedAt:DESC">Date (New - Old)</option>
            <option value="updatedAt:ASC">Date (Old - New)</option>
            <option value="rate:DESC,rater:DESC">Rating (Good - Bad)</option>
            <option value="rate:ASC,rater:ASC">Rating (Bad - Good)</option>
          </select>
        </div>
        <div>
          <button type="button" className="btn btn-block btn-danger" onClick={resetHandler}>
            Reset
          </button>
          <button type="submit" className="btn btn-block btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
