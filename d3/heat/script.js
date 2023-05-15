// Set up the dimensions of the heatmap and its margins
const margin = { top: 50, right: 50, bottom: 100, left: 100 };
const width = 1200 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Append the SVG element to the body
const svg = d3
  .select("#heatmap")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the tooltip element
const tooltip = d3.select("#tooltip");

// Fetch the data from the API
const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
d3.json(url).then(function (data) {
  // Convert the data to the appropriate format
  data.monthlyVariance.forEach(function (d) {
    d.month -= 1; // adjust for zero-indexed months
    d.temperature = data.baseTemperature + d.variance;
  });

  // Create the x and y scales
  const xScale = d3
    .scaleBand()
    .domain(
      data.monthlyVariance.map(function (d) {
        return d.year;
      })
    )
    .range([0, width]);
  const yScale = d3
    .scaleBand()
    .domain(
      data.monthlyVariance.map(function (d) {
        return d.month;
      })
    )
    .range([0, height]);

  // Create the color scale
  const colorScale = d3
    .scaleQuantize()
    .domain(
      d3.extent(data.monthlyVariance, function (d) {
        return d.temperature;
      })
    )
    .range([
      "#313695",
      "#4575b4",
      "#74add1",
      "#abd9e9",
      "#e0f3f8",
      "#ffffbf",
      "#fee090",
      "#fdae61",
      "#f46d43",
      "#d73027",
      "#a50026",
    ]);

  // Add the cells to the heatmap
  svg
    .selectAll(".cell")
    .data(data.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("x", function (d) {
      return xScale(d.year);
    })
    .attr("y", function (d) {
      return yScale(d.month);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("fill", function (d) {
      return colorScale(d.temperature);
    })
    .attr("data-month", function (d) {
      return d.month;
    })
    .attr("data-year", function (d) {
      return d.year;
    })
    .attr("data-temp", function (d) {
      return d.temperature;
    })
    .on("mouseover", function (d) {
      tooltip
        .html(
          d.year +
            " - " +
            (d.month + 1) +
            "<br>" +
            d.temperature.toFixed(2) +
            "&#8451;"
        )
        .attr("data-year", d.year)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px")
        .classed("hidden", false);
    })
    .on("mouseout", function (d) {
      tooltip.classed("hidden", true);
    });

  const xAxis = d3.axisBottom(xScale).tickValues(
    xScale.domain().filter(function (year) {
      return year % 10 === 0;
    })
  );
  const yAxis = d3.axisLeft(yScale).tickFormat(function (month) {
    const date = new Date(0);
    date.setUTCMonth(month);
    return d3.timeFormat("%B")(date);
  });

  // Add the x-axis
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the y-axis
  svg.append("g").attr("id", "y-axis").call(yAxis);

  // Add the legend
  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", "translate(0," + (height + 50) + ")");
  const legendWidth = 400;
  const legendHeight = 30;
  const legendColors = [
    "#313695",
    "#4575b4",
    "#74add1",
    "#abd9e9",
    "#e0f3f8",
    "#ffffbf",
    "#fee090",
    "#fdae61",
    "#f46d43",
    "#d73027",
    "#a50026",
  ];
  const legendScale = d3
    .scaleLinear()
    .domain([
      d3.min(data.monthlyVariance, function (d) {
        return d.temperature;
      }),
      d3.max(data.monthlyVariance, function (d) {
        return d.temperature;
      }),
    ])
    .range([0, legendWidth]);
  const legendAxis = d3
    .axisBottom(legendScale)
    .tickValues(
      colorScale
        .range()
        .slice(1)
        .map(function (d) {
          const i = colorScale.invertExtent(d);
          return i[0];
        })
    )
    .tickFormat(d3.format(".1f"));
  legend
    .selectAll("rect")
    .data(
      colorScale.range().map(function (d) {
        const i = colorScale.invertExtent(d);
        return i;
      })
    )
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return legendScale(d[0]);
    })
    .attr("y", 0)
    .attr("width", function (d) {
      return legendScale(d[1]) - legendScale(d[0]);
    })
    .attr("height", legendHeight)
    .attr("fill", function (d) {
      return colorScale(d[0]);
    });
  legend
    .append("g")
    .attr("transform", "translate(0," + legendHeight + ")")
    .call(legendAxis);

  //show the #tooltip when hovering over a cell
  //hide the #tooltip when the mouse leaves the cell
  svg
    .selectAll("rect")
    .on("mouseover", function (d, i) {
      tooltip
        .style("opacity", 1)
        .attr("data-year", i.year)
        .html(
          i.year +
            " - " +
            i.month +
            "<br>" +
            i.temperature +
            "℃" +
            "<br>" +
            i.variance +
            "℃"
        );
    })
    .on("mouseout", function (d) {
      tooltip.style("opacity", 0);
    });
});
