const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

d3.json(url).then((data) => {
  // Process the data
  data.forEach((d) => {
    d.Time = new Date(`1970-01-01T00:${d.Time}`);
  });

  // Set up the chart dimensions
  const width = 800;
  const height = 500;
  const padding = 50;

  // Create the SVG element
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Create the x-axis
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.Year - 1), d3.max(data, (d) => d.Year + 1)])
    .range([padding, width - padding]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis);

  // Create the y-axis
  const yScale = d3
    .scaleTime()
    .domain([d3.min(data, (d) => d.Time), d3.max(data, (d) => d.Time)])
    .range([padding, height - padding]);

  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);

  // Create the dots
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(d.Time))
    .attr("r", 5)
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.Time.toISOString())
    //color the dots
    .attr("fill", (d) => {
      if (d.Doping) {
        return "red";
      } else {
        return "blue";
      }
    });

  // Create the legend and add labels
  const legend = svg.append("g").attr("id", "legend");

  legend
    .append("circle")
    .attr("cx", width - padding * 2)
    .attr("cy", padding)
    .attr("r", 5)
    .attr("fill", "red")
    .append("text")
    .attr("x", width - padding * 2 + 10)
    .attr("y", padding)
    .text("Riders with doping allegations");

  legend
    .append("circle")
    .attr("cx", width - padding * 2)
    .attr("cy", padding * 2)
    .attr("r", 5)
    .attr("fill", "blue")
    .append("text")
    .attr("x", width - padding * 2 + 10)
    .attr("y", padding * 2)
    .text("No doping allegations");


  //add tooltip
  const tooltip = d3
    .select("#tooltip")
    .attr("id", "tooltip")
    .style("opacity", 0);

  svg.selectAll("circle").on("mouseover", (d, i) => {
    tooltip.style("opacity", 1);
    tooltip
      //get time from data
      .html(
        "Name: " +
          i.Name +
          "<br/>" + //get year from data
          "Year: " +
          i.Year +
          "<br/>" + //get time from data
          "Time: " +
          i.Time.getMinutes() +
          ":" +
          i.Time.getSeconds() +
          "<br/>" +
          i.Doping
      )
      .attr("data-year", i.Year)
      .style("left", i * 10 + "px")
      .style("top", i * 10 + "px");
  });

  svg.selectAll("circle").on("mouseout", (d) => {
    tooltip.style("opacity", 0);
  });
});
