const loadData = async function () {
  const response = await fetch("./data.json");
  const data = await response.json();
};

// loadData();
