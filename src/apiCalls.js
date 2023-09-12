// Your fetch requests will live here!


const fetchData = (type, link, fn) => {
  return fetch(link)
    .then(response => response.json())
    .then(data => {
      return fn(data[type]);
    });
};

export {
  fetchData
};



  



