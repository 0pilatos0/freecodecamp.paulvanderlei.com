// Fetch the data from the specified URL
fetch(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
)
  .then((response) => response.json())
  .then((data) => {
    // Define the dimensions and margins of the chart
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = 960 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const tooltip = d3.select("#tooltip");

    // Append the svg object to the body of the page
    const svg = d3
      .select("#tree-map")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Define the treemap layout and sort the data
    const treemap = d3.treemap().size([width, height]).paddingInner(1);
    const root = d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);
    treemap(root);

    // Add the tiles to the chart
    const tile = svg
      .selectAll(".tile")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("class", "tile")
      .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);
    tile
      .append("rect")
      .attr("class", "tile")
      .attr("fill", (d) => {
        const category = d.data.category;
        return category === "Product Design"
          ? "#E74C3C"
          : category === "Tabletop Games"
          ? "#3498DB"
          : category === "Video Games"
          ? "#2ECC71"
          : category === "Hardware"
          ? "#9B59B6"
          : category === "Gadgets"
          ? "#F1C40F"
          : category === "Wearables"
          ? "#E67E22"
          : "#1ABC9C";
      })
      .attr("data-name", (d) => d.data.name)
      .attr("data-category", (d) => d.data.category)
      .attr("data-value", (d) => d.data.value)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0);

    tile
      .append("text")
      .attr("class", "tile-text")
      .selectAll("tspan")
      .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter()
      .append("tspan")
      .attr("x", 4)
      .attr("y", (d, i) => 13 + i * 10)
      .text((d) => d)
      .style("font-size", "8px");

    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr("transform", `translate(0, ${height + margin.bottom})`);
    const legendItem = legend;
    legendItem
      .append("rect")
      .attr("class", "legend-item")
      .attr("fill", "#E74C3C")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 20)
      .attr("height", 20);
    legendItem
      .append("text")
      .attr("class", "legend-text")
      .attr("x", 25)
      .attr("y", 15)
      .text("Product Design");
    legendItem
      .append("rect")
      .attr("class", "legend-item")
      .attr("fill", "#3498DB")
      .attr("x", 150)
      .attr("y", 0)
      .attr("width", 20)
      .attr("height", 20);
    legendItem
      .append("text")
      .attr("class", "legend-text")
      .attr("x", 175)
      .attr("y", 15)
      .text("Tabletop Games");

    svg
      .selectAll("rect")
      .on("mouseover", (d, i) => {
        console.log(d);
        console.log(i);
        tooltip
          .style("opacity", 1)
          .attr("data-value", i.data.value)
          .html(
            `
            <p>Name: ${i.data.name}</p>
            <p>Category: ${i.data.category}</p>
            <p>Value: ${i.data.value}</p>
          `
          );
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });
  });
