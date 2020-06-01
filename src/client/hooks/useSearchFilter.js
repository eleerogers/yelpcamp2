import { useState, useCallback, useEffect } from 'react';

function useSearchFilter(search, initArr) {
  const [itemsArr, setItemsArr] = useState([]);

  useEffect(() => {
    const searchLC = search.toLowerCase();
    const filteredItems = initArr.filter((item) => {
      const itemNamePropertyLC = item.name.toLowerCase();
      return (search === ''
      || itemNamePropertyLC.indexOf(searchLC) !== -1);
    });
    setItemsArr(filteredItems);
  }, [search, initArr]);


  // const filterArr = useCallback((search) => {
  //   const searchLC = search.toLowerCase();
  //   setItemsArr((itemsAr) => itemsAr.filter((item) => {
  //     const itemNamePropertyLC = item.name.toLowerCase();
  //     return (search === ''
  //     || itemNamePropertyLC.indexOf(searchLC) !== -1);
  //   }));
  // }, []);

  return itemsArr;
}

export default useSearchFilter;
