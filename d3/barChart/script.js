const datasetUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
const margin = { top: 20, right: 20, bottom: 60, left: 60 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3
  .select("#chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const tooltip = d3
  .select("#tooltip")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.json(datasetUrl).then((data) => {
  const gdpData = data.data.map((d) => d[1]);
  const years = data.data.map((d) => new Date(d[0]));

  const xScale = d3
    .scaleTime()
    .domain([d3.min(years), d3.max(years)])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(gdpData)])
    .range([height, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  svg.append("g").attr("id", "y-axis").call(yAxis);

  svg
    .selectAll(".bar")
    .data(data.data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("x", (d) => xScale(new Date(d[0])))
    .attr("y", (d) => yScale(d[1]))
    .attr("width", width / data.data.length)
    .attr("height", (d) => height - yScale(d[1]))
    .on("mouseover", (d, i) => {
      console.log(d);
      console.log(i);
      tooltip
        .style("opacity", 0.9)
        .attr("data-date", i[0])
        .html(`$${i[1]} billion<br>${i[0]}`)

    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });

  svg
    .append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
    .style("text-anchor", "middle")
    .text("Year");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Gross Domestic Product, Billion USD");
});
